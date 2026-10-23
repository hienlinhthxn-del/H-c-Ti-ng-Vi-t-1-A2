import React, { useState, useEffect } from 'react';
import { Volume1Lesson, RecordingTargetInfo, AchievementBadge, SyllableModel } from '../types';
import { speechService, generateSpellingSteps, getPhoneticSound, getToneSymbol } from '../services/speechService';
import { lessonStorageService } from '../services/lessonStorageService';
import { teacherAudioService } from '../services/teacherAudioService';
import { achievementService } from '../services/achievementService';
import { userProfileService } from '../services/userProfileService';
import { TeacherAudioTarget } from './TeacherAudioRecorderModal';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Play,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  PenTool,
  MessageSquare,
  Award,
  Edit3,
  Mic,
  Type,
  Check,
  Radio,
  Bot,
  AlertCircle,
  RotateCcw,
  VolumeX,
  HelpCircle
} from 'lucide-react';

export const renderResultColored = (model: SyllableModel, lessonLetters: string[] = []) => {
  const normLetters = lessonLetters.map(l => l.toLowerCase().trim());
  const init = (model.initial || '').trim();
  const initIsNew = normLetters.includes(init.toLowerCase());
  const res = model.result || '';

  if (init && initIsNew && res.toLowerCase().startsWith(init.toLowerCase())) {
    const initPart = res.slice(0, init.length);
    const restPart = res.slice(init.length);
    return (
      <span className="font-sgk font-bold">
        <span className="text-[#e11d48]">{initPart}</span>
        <span className="text-slate-900">{restPart}</span>
      </span>
    );
  }

  const vowel = (model.vowel || '').trim();
  const vowelIsNew = normLetters.includes(vowel.toLowerCase());
  if (vowel && vowelIsNew && res.toLowerCase().endsWith(vowel.toLowerCase())) {
    const initPart = res.slice(0, res.length - vowel.length);
    const vowelPart = res.slice(res.length - vowel.length);
    return (
      <span className="font-sgk font-bold">
        <span className="text-slate-900">{initPart}</span>
        <span className="text-[#e11d48]">{vowelPart}</span>
      </span>
    );
  }

  return <span className="font-sgk font-bold text-slate-900">{res}</span>;
};

interface Volume1LessonViewProps {
  lesson: Volume1Lesson;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onOpenWritingPractice: (text: string) => void;
  onAddStar: () => void;
  onEditLesson?: () => void;
  onOpenVoiceRecorder?: (target: RecordingTargetInfo) => void;
  onOpenTeacherRecorder?: (target: TeacherAudioTarget) => void;
  onUnlockBadges?: (badges: AchievementBadge[]) => void;
  onBackToList?: () => void;
}

export const Volume1LessonView: React.FC<Volume1LessonViewProps> = ({
  lesson,
  onPreviousLesson,
  onNextLesson,
  hasPrevious,
  hasNext,
  onOpenWritingPractice,
  onAddStar,
  onEditLesson,
  onOpenVoiceRecorder,
  onOpenTeacherRecorder,
  onUnlockBadges,
  onBackToList
}) => {
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'huge'>('normal');
  const [isTeacherVoiceEditMode, setIsTeacherVoiceEditMode] = useState<boolean>(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [key: string]: number }>({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState<{ [key: string]: boolean }>({});
  const [quizFeedbacks, setQuizFeedbacks] = useState<{ [key: string]: 'correct' | 'wrong' }>({});
  const [readingPromptKey, setReadingPromptKey] = useState<string | null>(null);
  const [activeStoryPic, setActiveStoryPic] = useState<number>(1);
  const [spellingActiveIdx, setSpellingActiveIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => achievementService.isLessonCompleted('vol1', lesson.id));
  const [, setAudioVersion] = useState<number>(0);

  useEffect(() => {
    setIsCompleted(achievementService.isLessonCompleted('vol1', lesson.id));
  }, [lesson.id]);

  // Subscribe to teacher audio updates
  useEffect(() => {
    const unsub = teacherAudioService.subscribe(() => {
      setAudioVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const isCustomized = lessonStorageService.isVolume1Customized(lesson.id);

  const handleReadPrompt = (key: string, textToRead: string) => {
    if (readingPromptKey === key) {
      speechService.stop();
      setReadingPromptKey(null);
      return;
    }
    setReadingPromptKey(key);
    speechService.playSoundEffect('pop');
    speechService.speak(textToRead, () => {
      setReadingPromptKey(null);
    });
  };

  const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string, section?: 'letter' | 'syllable' | 'word' | 'sentence' | 'passage' | 'quiz' | 'general') => {
    e.stopPropagation();
    if (onOpenTeacherRecorder) {
      onOpenTeacherRecorder({
        targetText: text,
        volume: 'vol1',
        lessonId: lesson.id,
        lessonNumber: lesson.lessonNumber,
        lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
        sectionTitle,
        section
      });
    }
  };

  const handleToggleCompletion = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    const { newlyCompleted, newBadges } = achievementService.setLessonCompleted('vol1', lesson.id, nextState);
    
    // Sync to user profile & class statistics in real time
    userProfileService.recordLessonCompletion(`vol1_${lesson.id}`, nextState, {
      volume: 'vol1',
      lessonNumber: lesson.lessonNumber,
      lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
      practiceType: 'reading'
    });

    if (newlyCompleted) {
      speechService.playSoundEffect('fanfare');
      speechService.speak('Hoan hô bé đã đọc xong và hoàn thành bài học này!');
      onAddStar();

      if (newBadges.length > 0 && onUnlockBadges) {
        onUnlockBadges(newBadges);
      }
    } else {
      speechService.playSoundEffect('pop');
    }
  };

  const handleSpellingModel = (
    model: { initial?: string; vowel?: string; tone?: string; result: string; spellingSteps?: string[] },
    idx: number,
    lessonId: string
  ) => {
    setSpellingActiveIdx(idx);

    // 1. If Teacher has recorded sample audio for this spelling model and preferTeacherVoice is active:
    if (
      teacherAudioService.isPreferTeacherVoice() &&
      (teacherAudioService.hasAudioForText(model.result, 'syllable', lessonId) ||
       teacherAudioService.hasAudioForText(model.result, undefined, lessonId))
    ) {
      speechService.stop();
      const audio = teacherAudioService.playAudio(model.result, 'syllable', lessonId, () => {
        speechService.playSoundEffect('sparkle');
        setSpellingActiveIdx(null);
      });
      if (audio) {
        return;
      }
    }

    // 2. Otherwise play AI Grade 1 phonetic spelling chain: "bờ - a - ba"
    const steps = generateSpellingSteps(model);
    speechService.spellOut(steps, model.result, () => {
      speechService.playSoundEffect('sparkle');
    }, lessonId);
    setTimeout(() => {
      setSpellingActiveIdx(null);
    }, (steps ? steps.length * 800 : 1000) + 1200);
  };

  const handleAnswerQuiz = (quizId: string, optionIdx: number, correctIdx: number) => {
    setSelectedQuizAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
    const isCorrect = optionIdx === correctIdx;
    setQuizFeedbacks(prev => ({ ...prev, [quizId]: isCorrect ? 'correct' : 'wrong' }));

    if (isCorrect) {
      // Play pleasant correct chime
      speechService.playSoundEffect('correct');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      const praises = [
        'Đúng rồi! Bé giỏi quá!',
        'Hoan hô bé! Câu trả lời rất chính xác!',
        'Tuyệt vời! Bé thông minh lắm!'
      ];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];

      if (!answeredCorrectly[quizId]) {
        const nextCorrectMap = { ...answeredCorrectly, [quizId]: true };
        setAnsweredCorrectly(nextCorrectMap);
        
        // Check if all quiz questions in this section/lesson are completed
        const totalQuizzes = lesson.quiz?.length || 0;
        const totalCompleted = Object.keys(nextCorrectMap).length;
        
        if (totalQuizzes > 0 && totalCompleted >= totalQuizzes) {
          setTimeout(() => {
            speechService.playSoundEffect('fanfare');
            speechService.speak('Hoan hô bé! Bé đã xuất sắc trả lời đúng tất cả câu hỏi thử thách!');
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
          }, 350);
        } else {
          setTimeout(() => {
            speechService.speak(randomPraise);
          }, 350);
        }
        onAddStar();
      } else {
        setTimeout(() => {
          speechService.speak(randomPraise);
        }, 300);
      }
    } else {
      // Play gentle encouraging sound for incorrect answer
      speechService.playSoundEffect('wrong');
      const encouragements = [
        'Chưa đúng rồi, bé hãy thử chọn lại nhé!',
        'Bé hãy suy nghĩ kỹ hơn một chút và thử lại nào!'
      ];
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      setTimeout(() => {
        speechService.speak(randomEncouragement);
      }, 350);
    }
  };

  // Text content variables for recording
  const lettersText = (lesson.part1_Letters?.letters || []).join(', ');
  const syllablesText = (lesson.part2_SyllablesAndWords?.readingSyllables || []).join('   ');
  const wordsText = (lesson.part2_SyllablesAndWords?.words || []).map(w => w.word).join(', ');
  const passageText = lesson.part3_SentenceAndPractice?.readingPassage || '';

  // Split reading passage into distinct sentences/lines for individual display
  const passageSentences = passageText
    ? passageText
        .split(/\n+/)
        .map(line => (line || '').trim())
        .filter(line => line.length > 0)
    : [];

  // Dynamic font sizing
  const passageFontSizeClass = fontSizeMode === 'huge'
    ? 'text-2xl sm:text-3xl leading-[2.3]'
    : fontSizeMode === 'large'
    ? 'text-xl sm:text-2xl leading-[2.2]'
    : 'text-lg sm:text-xl leading-[2.1]';

  const wordFontSizeClass = fontSizeMode === 'huge'
    ? 'text-xl sm:text-2xl'
    : fontSizeMode === 'large'
    ? 'text-lg sm:text-xl'
    : 'text-base sm:text-lg';

  const letterFontSizeClass = fontSizeMode === 'huge'
    ? 'text-4xl sm:text-5xl'
    : fontSizeMode === 'large'
    ? 'text-3xl sm:text-4xl'
    : 'text-2xl sm:text-3xl';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 font-sgk">
      
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {onBackToList ? (
          <button
            id="back-to-list-btn"
            onClick={onBackToList}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50/70 border border-blue-200/80 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách</span>
          </button>
        ) : <div />}

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Font Size Switcher */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl shadow-2xs">
            <span className="text-slate-400 text-xs px-1 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
            </span>
            <button
              onClick={() => setFontSizeMode('normal')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'normal' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Cỡ chữ chuẩn SGK"
            >
              Chuẩn
            </button>
            <button
              onClick={() => setFontSizeMode('large')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'large' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Cỡ chữ Lớn"
            >
              Lớn
            </button>
            <button
              onClick={() => setFontSizeMode('huge')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'huge' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Cỡ chữ Rất Lớn"
            >
              Rất lớn
            </button>
          </div>

          {/* Toggle Teacher Voice Recording / Editing Mode */}
          {onOpenTeacherRecorder && (
            <button
              id="toggle-teacher-voice-mode-btn"
              onClick={() => {
                setIsTeacherVoiceEditMode(!isTeacherVoiceEditMode);
                speechService.playSoundEffect('pop');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer border ${
                isTeacherVoiceEditMode
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 ring-2 ring-amber-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300/80'
              }`}
              title="Bật/tắt chế độ cho phép Giáo viên thu âm giọng mẫu chuẩn cho từng âm, tiếng, từ, câu"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isTeacherVoiceEditMode ? 'Đang sửa giọng GV' : 'Sửa giọng mẫu GV'}</span>
            </button>
          )}

          {/* Edit Lesson Button (for teachers) */}
          {onEditLesson && (
            <button
              id="edit-current-lesson-btn"
              onClick={onEditLesson}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Chỉnh sửa nội dung bài học này"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa bài</span>
            </button>
          )}

          {/* Mark completed button */}
          <button
            id="toggle-vol1-completed-btn"
            onClick={handleToggleCompletion}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer border ${
              isCompleted
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200'
            }`}
            title={isCompleted ? 'Bé đã hoàn thành bài đọc này' : 'Bấm để đánh dấu đã đọc xong'}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-100 fill-emerald-600" />
                <span>Đã đọc xong ⭐</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-slate-500" />
                <span>Đánh dấu xong</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Streamlined Lesson Card */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-lg shadow-amber-900/5 border border-orange-200/70 overflow-hidden relative border-t-4 border-t-orange-500">
        <div className="p-5 sm:p-8 lg:p-10 space-y-8 sm:space-y-10">
          
          {/* Lesson Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {isCustomized && (
                <>
                  <span className="bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-500 fill-orange-400" />
                    Đã tùy chỉnh bởi GV
                  </span>
                  {onEditLesson && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Thầy Cô có muốn khôi phục Bài ${lesson.lessonNumber} về nội dung chuẩn sách giáo khoa ban đầu không?`)) {
                          lessonStorageService.resetVolume1Lesson(lesson.id);
                          window.location.reload();
                        }
                      }}
                      className="text-xs text-orange-700 hover:text-orange-900 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full font-semibold transition-all cursor-pointer flex items-center gap-1"
                      title="Khôi phục bài học về dữ liệu gốc SGK Kết Nối Tri Thức"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Khôi phục gốc SGK</span>
                    </button>
                  )}
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              Bài {lesson.lessonNumber}: {lesson.title}
            </h1>
            <p className="text-sm font-medium text-orange-600 italic mt-1 font-serif">
              Trang {lesson.pageRange} • Tập 1
            </p>
          </div>

          {/* ========================================================
              PHẦN 1: PHÁT ÂM (ÂM / VẦN)
             ======================================================== */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-bold text-orange-600 font-serif">
                  Phát âm
                </h2>
                <button
                  id="speak-p1-instruction-btn"
                  onClick={() => handleReadPrompt('p1_title', 'Phần một: Phát âm. Bé hãy lắng nghe cô giáo đọc mẫu và phát âm theo các âm chữ dưới đây nhé!')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    readingPromptKey === 'p1_title'
                      ? 'bg-orange-600 text-white shadow-2xs'
                      : 'bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-200'
                  }`}
                  title="AI đọc giúp bé yêu cầu phần phát âm"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI đọc yêu cầu</span>
                </button>
              </div>

              {/* Action Buttons for Section 1 */}
              <div className="flex items-center gap-2">
                <button
                  id="speak-all-letters-btn"
                  onClick={() => {
                    const lettersSpoken = lesson.part1_Letters.letters
                      .map(l => getPhoneticSound(l))
                      .join(', ');
                    speechService.speak(lettersSpoken, undefined, 0.75, 'letter', lesson.id);
                  }}
                  className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white hover:bg-orange-50 text-orange-500 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  title="Nghe phát âm tất cả các âm vần (chuẩn âm: a, bờ, cờ...)"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {onOpenVoiceRecorder && (
                  <button
                    id="record-letters-btn"
                    onClick={() => {
                      const phoneticText = lesson.part1_Letters.letters
                        .map(l => getPhoneticSound(l))
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .join(', ');
                      const allModelsText = (lesson.part2_SyllablesAndWords.models || [])
                        .map(m => generateSpellingSteps(m).join(' - '))
                        .join(', ');
                      onOpenVoiceRecorder({
                        volume: 'vol1',
                        lessonId: lesson.id,
                        lessonNumber: lesson.lessonNumber,
                        lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                        sectionTitle: 'Phần 1: Luyện đọc Đầu bài',
                        targetText: allModelsText || phoneticText || lettersText,
                        syllableModels: (lesson.part2_SyllablesAndWords.models && lesson.part2_SyllablesAndWords.models.length > 0)
                          ? lesson.part2_SyllablesAndWords.models
                          : undefined,
                        lessonLetters: lesson.part1_Letters?.letters || []
                      });
                    }}
                    className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Ghi âm và nộp bài luyện đọc đầu bài"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Luyện đọc đầu bài</span>
                  </button>
                )}
              </div>
            </div>

            {/* Câu nhận biết mở đầu bài học (SGK Tiếng Việt 1 - KNTT) */}
            {lesson.part1_Letters.recognitionSentence && (
              <div className="bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-100/70 p-3.5 sm:p-4 rounded-2xl border border-orange-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start sm:items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                    👀
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-orange-950 tracking-wider bg-orange-200/90 px-2 py-0.5 rounded-md">
                        Câu nhận biết (Khởi động)
                      </span>
                      <span className="text-xs text-orange-800 font-medium hidden sm:inline">
                        Bé lắng nghe câu mở đầu giới thiệu bài
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-slate-800 font-reading mt-1">
                      "{lesson.part1_Letters.recognitionSentence}"
                    </p>
                  </div>
                </div>

                <button
                  id="speak-recognition-sentence-btn"
                  onClick={() => handleReadPrompt('recognition', `Câu nhận biết: ${lesson.part1_Letters.recognitionSentence}`)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 self-start sm:self-auto shrink-0 ${
                    readingPromptKey === 'recognition'
                      ? 'bg-orange-600 text-white ring-2 ring-orange-300'
                      : 'bg-white hover:bg-orange-100 text-orange-950 border border-orange-300'
                  }`}
                  title="AI đọc giúp bé câu nhận biết vì câu dài bé chưa tự đọc được"
                >
                  <Volume2 className={`w-4 h-4 text-orange-600 ${readingPromptKey === 'recognition' ? 'animate-bounce text-white' : ''}`} />
                  <span>{readingPromptKey === 'recognition' ? 'AI đang đọc...' : 'AI đọc câu nhận biết'}</span>
                </button>
              </div>
            )}

            {/* Letter Cards Grid */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              {lesson.part1_Letters.letters.map((letter, idx) => {
                const hasTeacherAudio = teacherAudioService.hasAudioForText(letter, 'letter', lesson.id);
                return (
                  <div key={idx} className="relative group/card">
                    <button
                      id={`letter-card-${idx}`}
                      onClick={() => speechService.speak(letter, undefined, undefined, 'letter', lesson.id)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200/90 hover:border-orange-400 shadow-xs hover:shadow flex items-center justify-center text-[#c2410c] hover:text-orange-600 hover:scale-105 transition-all cursor-pointer font-sgk font-black tracking-normal relative ${letterFontSizeClass}`}
                      title={hasTeacherAudio ? `Giọng đọc mẫu Cô giáo: ${letter}` : `Bấm để nghe phát âm: ${letter}`}
                    >
                      {letter}
                      {hasTeacherAudio && (
                        <span className="absolute bottom-1 right-1.5 px-1 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-3xs" title="Đã có giọng đọc mẫu cô giáo">
                          GV
                        </span>
                      )}
                    </button>

                    {/* Teacher Quick Record Button */}
                    {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                      <button
                        onClick={(e) => handleTeacherRecordClick(e, letter, `Âm / Vần: ${letter}`, 'letter')}
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md transition-all active:scale-90 cursor-pointer ${
                          isTeacherVoiceEditMode ? 'opacity-100 scale-100' : 'opacity-0 group-hover/card:opacity-100 scale-90 group-hover/card:scale-100'
                        } ${hasTeacherAudio ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                        title={hasTeacherAudio ? `Thu lại giọng mẫu cho "${letter}"` : `Thu âm giọng mẫu cô giáo cho "${letter}"`}
                      >
                        <Mic className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Spelling Model (Mô hình ghép âm - chuẩn SGK) */}
            {lesson.part2_SyllablesAndWords.models && lesson.part2_SyllablesAndWords.models.length > 0 && (
              <div className="mt-4 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div>
                    <div className="text-xs font-bold text-orange-900 flex items-center gap-1.5">
                      <span>Mô hình tiếng:</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Bé bấm vào ô để nghe mẫu hoặc bấm Luyện đọc mô hình tiếng
                    </div>
                  </div>
                  {onOpenVoiceRecorder && (
                    <button
                      id="record-all-spelling-models-btn"
                      onClick={() => {
                        const modelsResults = (lesson.part2_SyllablesAndWords.models || []).map(m => m.result);
                        const readingSyllables = lesson.part2_SyllablesAndWords.readingSyllables || [];
                        const targetSyllables = modelsResults.length > 0
                          ? modelsResults.join(', ')
                          : readingSyllables.join(', ');
                        onOpenVoiceRecorder({
                          volume: 'vol1',
                          lessonId: lesson.id,
                          lessonNumber: lesson.lessonNumber,
                          lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                          sectionTitle: 'Phần 1: Luyện đọc Mô hình tiếng',
                          targetText: targetSyllables
                        });
                      }}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                      title="Bé luyện đọc các tiếng theo mô hình"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Luyện đọc mô hình tiếng</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10 py-3 bg-gradient-to-b from-orange-50/40 via-amber-50/20 to-transparent rounded-2xl border border-orange-100/80 p-4 sm:p-5">
                  {lesson.part2_SyllablesAndWords.models.map((model, idx) => {
                    const hasTeacherAudio = teacherAudioService.hasAudioForText(model.result, 'syllable', lesson.id);
                    const toneSymbol = getToneSymbol(model.tone);
                    const normLetters = (lesson.part1_Letters?.letters || []).map(l => l.toLowerCase().trim());
                    const initialIsHighlight = normLetters.includes((model.initial || '').toLowerCase().trim());
                    const vowelIsHighlight = normLetters.includes((model.vowel || '').toLowerCase().trim());
                    const steps = generateSpellingSteps(model);

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSpellingModel(model, idx, lesson.id)}
                        className={`group relative flex flex-col items-center cursor-pointer p-3 sm:p-4 rounded-2xl transition-all duration-200 select-none ${
                          spellingActiveIdx === idx
                            ? 'bg-amber-100/90 ring-4 ring-amber-400 shadow-md scale-105'
                            : 'bg-white hover:bg-emerald-50/40 hover:shadow-md border border-slate-200/90 hover:border-emerald-300'
                        }`}
                        title={`Bé bấm để nghe đánh vần: ${steps.join(' - ')}`}
                      >
                        {/* Teacher Audio Indicator */}
                        {hasTeacherAudio && (
                          <span
                            className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-3xs"
                            title="Đã có giọng đọc mẫu cô giáo"
                          >
                            GV
                          </span>
                        )}

                        {/* Teacher Quick Record Button */}
                        {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                          <button
                            onClick={(e) => handleTeacherRecordClick(e, model.result, `Mô hình: ${model.result}`, 'syllable')}
                            className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs transition-all active:scale-90 cursor-pointer ${
                              isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            } ${hasTeacherAudio ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                            title={`Thu âm giọng mẫu cho tiếng "${model.result}"`}
                          >
                            <Mic className="w-3 h-3" />
                          </button>
                        )}

                        {/* Dấu thanh ở trên nếu có (e.g. dấu huyền ` màu đỏ như SGK) */}
                        <div className="h-7 sm:h-8 flex items-center justify-center text-2xl sm:text-3xl font-bold font-sgk text-[#e11d48]">
                          {toneSymbol || '\u00A0'}
                        </div>

                        {/* Khối mô hình 2 tầng chuẩn SGK (nền xanh ngọc nhạt #daf0ee) */}
                        <div className="w-32 sm:w-36 md:w-40 bg-[#daf0ee] rounded-md p-0.5 shadow-2xs border border-[#bce3de]">
                          {/* Hàng 1: 2 ô (Âm đầu | Âm chính / Vần) */}
                          <div className="grid grid-cols-2 gap-[2px]">
                            <div className="h-11 sm:h-12 bg-[#daf0ee] flex items-center justify-center text-xl sm:text-2xl font-sgk font-bold">
                              <span className={initialIsHighlight ? 'text-[#e11d48]' : 'text-slate-900'}>
                                {model.initial || '—'}
                              </span>
                            </div>
                            <div className="h-11 sm:h-12 bg-[#daf0ee] flex items-center justify-center text-xl sm:text-2xl font-sgk font-bold">
                              <span className={vowelIsHighlight ? 'text-[#e11d48]' : 'text-slate-900'}>
                                {model.vowel}
                              </span>
                            </div>
                          </div>

                          {/* Hàng 2: 1 ô trải dài (Tiếng ghép thành) */}
                          <div className="mt-[2px] h-11 sm:h-12 bg-[#daf0ee] flex items-center justify-center text-xl sm:text-2xl font-sgk font-bold">
                            {renderResultColored(model, lesson.part1_Letters?.letters || [])}
                          </div>
                        </div>

                        {/* Nhãn đánh vần gợi ý bên dưới */}
                        <div className="mt-2.5 text-xs font-semibold text-slate-500 flex items-center gap-1 group-hover:text-orange-600 transition-colors">
                          <Play className="w-3 h-3 text-orange-500 fill-orange-500" />
                          <span>{steps.join(' - ')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reading Syllables (Các tiếng đọc thêm - nếu có) */}
            {lesson.part2_SyllablesAndWords.readingSyllables && lesson.part2_SyllablesAndWords.readingSyllables.length > 0 && (
              <div className="pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div>
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Các tiếng luyện đọc:</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Bé bấm vào từng tiếng để nghe đọc hoặc bấm Luyện đọc các tiếng
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speechService.speak(lesson.part2_SyllablesAndWords.readingSyllables.join(', '))}
                      className="p-1.5 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 text-xs transition-all shadow-2xs cursor-pointer"
                      title="Nghe phát âm tất cả các tiếng"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    {onOpenVoiceRecorder && (
                      <button
                        id="record-all-syllables-btn"
                        onClick={() => {
                          onOpenVoiceRecorder({
                            volume: 'vol1',
                            lessonId: lesson.id,
                            lessonNumber: lesson.lessonNumber,
                            lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                            sectionTitle: 'Phần 1: Luyện đọc các tiếng trong bài',
                            targetText: lesson.part2_SyllablesAndWords.readingSyllables.join(', ')
                          });
                        }}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                        title="Bé ghi âm luyện đọc tất cả các tiếng này"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Luyện đọc các tiếng</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {lesson.part2_SyllablesAndWords.readingSyllables.map((syl, i) => {
                    const hasTeacherAudio = teacherAudioService.hasAudioForText(syl, 'syllable', lesson.id);
                    return (
                      <div key={i} className="relative group/syl">
                        <button
                          onClick={() => speechService.speak(syl, undefined, undefined, 'syllable', lesson.id)}
                          className="px-3.5 py-1.5 bg-slate-50 hover:bg-amber-100/80 hover:text-amber-950 text-slate-800 font-bold rounded-xl border border-slate-200/80 transition-all shadow-2xs font-sgk cursor-pointer active:scale-95 text-base sm:text-lg flex items-center gap-1.5"
                        >
                          <span>{syl}</span>
                          {hasTeacherAudio && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">GV</span>
                          )}
                        </button>
                        {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                          <button
                            onClick={(e) => handleTeacherRecordClick(e, syl, `Tiếng: ${syl}`, 'syllable')}
                            className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs transition-all active:scale-90 cursor-pointer ${
                              isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover/syl:opacity-100'
                            } ${hasTeacherAudio ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                            title={`Thu âm giọng mẫu cho tiếng "${syl}"`}
                          >
                            <Mic className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              PHẦN 2: TỪ NGỮ (TỪ ỨNG DỤNG)
             ======================================================== */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-blue-600 font-serif">
                  Từ ngữ
                </h2>
                <button
                  id="speak-p2-instruction-btn"
                  onClick={() => handleReadPrompt('p2_title', 'Phần hai: Đọc tiếng và từ ngữ. Bé hãy đánh vần theo mô hình và luyện đọc trơn các tiếng, từ ngữ dưới đây nhé!')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    readingPromptKey === 'p2_title'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-200'
                  }`}
                  title="AI đọc giúp bé yêu cầu phần từ ngữ"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI đọc yêu cầu</span>
                </button>
              </div>

              {/* Action Buttons for Section 2 */}
              <div className="flex items-center gap-2">
                <button
                  id="speak-all-words-btn"
                  onClick={() => speechService.speak(lesson.part2_SyllablesAndWords.words.map(w => w.word).join(', '))}
                  className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white hover:bg-blue-50 text-blue-500 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  title="Nghe đọc tất cả các từ ngữ"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {onOpenVoiceRecorder && (
                  <button
                    id="record-words-btn"
                    onClick={() => {
                      onOpenVoiceRecorder({
                        volume: 'vol1',
                        lessonId: lesson.id,
                        lessonNumber: lesson.lessonNumber,
                        lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                        sectionTitle: 'Phần 2: Luyện đọc Từ ngữ',
                        targetText: wordsText
                      });
                    }}
                    className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Ghi âm và nộp bài luyện đọc từ ngữ"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Luyện đọc</span>
                  </button>
                )}
              </div>
            </div>

            {/* Words Row with Subtle Bottom Highlight */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              {lesson.part2_SyllablesAndWords.words.map((item, idx) => {
                const hasTeacherAudio = teacherAudioService.hasAudioForText(item.word, 'word', lesson.id);
                return (
                  <div key={idx} className="relative group/word">
                    <button
                      id={`word-item-${idx}`}
                      onClick={() => speechService.speak(item.word, undefined, undefined, 'word', lesson.id)}
                      className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-slate-50/70 hover:bg-blue-50/90 border-b-2 border-blue-200 hover:border-blue-500 text-blue-700 font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer font-sgk flex items-center gap-2 ${wordFontSizeClass}`}
                      title={item.meaning ? `${item.word}: ${item.meaning}` : `Bấm để nghe: ${item.word}`}
                    >
                      {item.illustrationIcon && (
                        <span className="text-base sm:text-lg">{item.illustrationIcon}</span>
                      )}
                      <span>{item.word}</span>
                      {hasTeacherAudio && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">GV</span>
                      )}
                    </button>
                    {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                      <button
                        onClick={(e) => handleTeacherRecordClick(e, item.word, `Từ ngữ: ${item.word}`, 'word')}
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs transition-all active:scale-90 cursor-pointer ${
                          isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover/word:opacity-100'
                        } ${hasTeacherAudio ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                        title={`Thu âm giọng mẫu cô giáo cho từ "${item.word}"`}
                      >
                        <Mic className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              PHẦN 3: LUYỆN ĐỌC ĐOẠN VĂN (CÂU & ĐOẠN VĂN)
             ======================================================== */}
          <div className="bg-[#f4fbf7] rounded-3xl p-5 sm:p-7 border border-emerald-100/90 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  3
                </span>
                <h2 className="text-base sm:text-lg font-bold text-emerald-700 font-serif">
                  Luyện đọc đoạn văn
                </h2>
                <button
                  id="speak-p3-instruction-btn"
                  onClick={() => handleReadPrompt('p3_title', 'Phần ba: Luyện đọc đoạn văn. Bé hãy chỉ tay vào từng chữ, lắng nghe và đọc to theo từng câu văn nhé!')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    readingPromptKey === 'p3_title'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-200'
                  }`}
                  title="AI đọc giúp bé yêu cầu phần đoạn văn"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI đọc yêu cầu</span>
                </button>
              </div>

              {/* Action Buttons for Section 3 */}
              <div className="flex items-center gap-2">
                <button
                  id="speak-passage-btn"
                  onClick={() => speechService.speak(lesson.part3_SentenceAndPractice.readingPassage, undefined, undefined, 'passage', lesson.id)}
                  className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white hover:bg-emerald-50 text-emerald-600 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  title="Nghe đọc toàn bộ đoạn văn"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                  <button
                    onClick={(e) => handleTeacherRecordClick(e, lesson.part3_SentenceAndPractice.readingPassage, 'Toàn bộ đoạn văn', 'passage')}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Thu âm giọng đọc mẫu cả đoạn văn cho học sinh"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Thu âm mẫu cả đoạn</span>
                  </button>
                )}

                {onOpenVoiceRecorder && (
                  <button
                    id="record-passage-btn"
                    onClick={() => {
                      onOpenVoiceRecorder({
                        volume: 'vol1',
                        lessonId: lesson.id,
                        lessonNumber: lesson.lessonNumber,
                        lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                        sectionTitle: 'Phần 3: Luyện đọc đoạn văn',
                        targetText: passageText
                      });
                    }}
                    className="flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Ghi âm và nộp bài đọc cả đoạn văn"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Đọc cả đoạn</span>
                  </button>
                )}
              </div>
            </div>

            {/* Reading Sentences Cards with Green Left Accent Bar */}
            <div className="space-y-3 pt-1">
              {passageSentences.map((sentence, sIdx) => {
                const hasTeacherAudio = teacherAudioService.hasAudioForText(sentence, 'sentence', lesson.id);
                return (
                  <div
                    key={sIdx}
                    id={`sentence-card-${sIdx}`}
                    onClick={() => speechService.speak(sentence, undefined, undefined, 'sentence', lesson.id)}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all relative pl-6 flex items-center justify-between group cursor-pointer"
                    title={hasTeacherAudio ? `Giọng đọc mẫu Cô giáo: ${sentence}` : `Bấm để nghe đọc câu: ${sentence}`}
                  >
                    {/* Left rounded emerald bar */}
                    <div className="absolute left-2.5 top-3.5 bottom-3.5 w-1.5 bg-emerald-500 rounded-full group-hover:w-2 transition-all" />
                    
                    <div className="flex-1 pr-2">
                      <p className={`font-medium text-slate-800 font-reading leading-relaxed pl-2 ${passageFontSizeClass}`}>
                        {sentence}
                      </p>
                      {hasTeacherAudio && (
                        <span className="inline-block ml-2 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          🎙️ Giọng cô giáo
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                        <button
                          onClick={(e) => handleTeacherRecordClick(e, sentence, `Câu ${sIdx + 1}: ${sentence.substring(0, 30)}...`, 'sentence')}
                          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            hasTeacherAudio ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          } ${isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          title={`Thu âm giọng mẫu cho câu ${sIdx + 1}`}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      )}
                      <div className="opacity-40 group-hover:opacity-100 transition-opacity text-emerald-600">
                        <Volume2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              PHẦN PHỤ TRỢ: TẬP VIẾT & KỂ CHUYỆN (NẾU CÓ TRONG BÀI)
             ======================================================== */}
          {lesson.part3_SentenceAndPractice.writingSamples && lesson.part3_SentenceAndPractice.writingSamples.length > 0 && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <div className="flex flex-wrap items-center gap-3">
                <PenTool className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-900 uppercase">Tập viết:</span>
                <button
                  id="speak-writing-instruction-btn"
                  onClick={() => handleReadPrompt('writing', 'Tập viết: Bé hãy cầm bút đúng tư thế và luyện viết các mẫu chữ dưới đây vào vở ô ly nhé!')}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    readingPromptKey === 'writing'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-200'
                  }`}
                  title="AI đọc giúp bé yêu cầu tập viết"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI đọc yêu cầu</span>
                </button>
                <div className="flex flex-wrap gap-2">
                  {lesson.part3_SentenceAndPractice.writingSamples.map((w, i) => (
                    <span key={i} className="px-3 py-1 bg-white font-handwriting text-xl font-bold text-purple-900 rounded-lg border border-purple-200 shadow-2xs">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => onOpenWritingPractice(lesson.part3_SentenceAndPractice.writingSamples!.join(' '))}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Mở Vở Ô Ly</span>
                <span>✍️</span>
              </button>
            </div>
          )}

          {/* Story for Review lessons */}
          {lesson.part3_SentenceAndPractice.story && (
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🦊</span>
                  <h3 className="font-bold text-amber-950 text-base font-serif">
                    Kể chuyện: {lesson.part3_SentenceAndPractice.story.title}
                  </h3>
                  <button
                    onClick={() => handleReadPrompt('story', `Kể chuyện: ${lesson.part3_SentenceAndPractice.story!.title}. Bé hãy bấm vào từng bức tranh để nghe kể từng đoạn hoặc bấm nút Kể toàn truyện nhé!`)}
                    className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      readingPromptKey === 'story'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    }`}
                    title="AI đọc hướng dẫn kể chuyện cho bé"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI đọc yêu cầu</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    const allText = lesson.part3_SentenceAndPractice.story!.pictures.map(p => `Tranh ${p.id}: ${p.content}`).join('. ');
                    speechService.speak(`Câu chuyện: ${lesson.part3_SentenceAndPractice.story!.title}. ${allText}`);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Kể toàn truyện</span>
                </button>
              </div>

              {/* Picture Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {lesson.part3_SentenceAndPractice.story.pictures.map((pic) => (
                  <button
                    key={pic.id}
                    onClick={() => setActiveStoryPic(pic.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      activeStoryPic === pic.id
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-white text-amber-900 border border-amber-200'
                    }`}
                  >
                    Tranh {pic.id}
                  </button>
                ))}
              </div>

              {/* Active Picture Story Content */}
              {(() => {
                const currentPic = lesson.part3_SentenceAndPractice.story.pictures.find(p => p.id === activeStoryPic) || lesson.part3_SentenceAndPractice.story.pictures[0];
                return (
                  <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs text-sm space-y-2">
                    <p className="text-slate-700 leading-relaxed font-serif">{currentPic.content}</p>
                    <button
                      onClick={() => speechService.speak(currentPic.content)}
                      className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe đoạn này</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Mini Quiz: Thử thách vui */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50 to-orange-50/60 p-5 sm:p-6 rounded-3xl border-2 border-yellow-300 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-yellow-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-xs">
                    🏆
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md">
                        Phần vui thử thách
                      </span>
                      <span className="text-xs font-bold text-amber-800">
                        ({lesson.quiz.length} câu hỏi)
                      </span>
                    </div>
                    <h3 className="font-black text-amber-950 text-base sm:text-lg font-serif mt-0.5">
                      Thử Thách Vui Dành Cho Bé
                    </h3>
                  </div>
                </div>

                {/* AI Read Instructions for Quiz */}
                <button
                  id="speak-quiz-instruction-btn"
                  onClick={() => handleReadPrompt('quiz_header', 'Thử thách vui: Bé hãy bấm nút chiếc loa bên cạnh mỗi câu hỏi để nghe AI đọc câu hỏi, sau đó bấm chọn đáp án đúng nhất nhé!')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-2xs self-start sm:self-auto ${
                    readingPromptKey === 'quiz_header'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                      : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-300'
                  }`}
                  title="AI đọc hướng dẫn cách làm thử thách vui"
                >
                  <Bot className="w-4 h-4 text-amber-700" />
                  <span>{readingPromptKey === 'quiz_header' ? 'AI đang đọc hướng dẫn...' : 'AI đọc hướng dẫn thử thách'}</span>
                </button>
              </div>

              <div className="space-y-4">
                {lesson.quiz.map((q, qIdx) => {
                  const userSelected = selectedQuizAnswers[q.id];
                  const isCorrect = answeredCorrectly[q.id];
                  const isWrong = userSelected !== undefined && !isCorrect;
                  const targetCorrectIndex = (q as any).correctIndex ?? (q as any).correctAnswer ?? 0;
                  const isReadingThisQ = readingPromptKey === `q_${q.id}`;

                  return (
                    <div
                      key={q.id}
                      className={`bg-white p-4 sm:p-5 rounded-2xl border-2 transition-all shadow-xs space-y-3 ${
                        isCorrect
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : isWrong
                          ? 'border-rose-300 bg-rose-50/20'
                          : 'border-yellow-200'
                      }`}
                    >
                      {/* Question Header with AI Voice Button */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-500 text-white'
                              : isWrong
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}>
                            {qIdx + 1}
                          </span>
                          <div className="text-sm sm:text-base font-bold text-slate-900 font-serif leading-snug">
                            {q.question}
                          </div>
                        </div>

                        {/* AI Read Question Button */}
                        <button
                          type="button"
                          id={`speak-quiz-q-${q.id}`}
                          onClick={() => {
                            const optionsText = q.options.map((opt, oIdx) => `Lựa chọn ${oIdx + 1}: ${opt}`).join('. ');
                            handleReadPrompt(`q_${q.id}`, `Câu hỏi số ${qIdx + 1}: ${q.question}. ${optionsText}`);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs self-start sm:self-auto shrink-0 ${
                            isReadingThisQ
                              ? 'bg-orange-600 text-white ring-2 ring-orange-300 animate-pulse'
                              : 'bg-amber-50 hover:bg-orange-100 text-orange-950 border border-orange-300'
                          }`}
                          title="Bấm để AI đọc to câu hỏi và các lựa chọn cho bé nghe"
                        >
                          <Volume2 className={`w-3.5 h-3.5 text-orange-600 ${isReadingThisQ ? 'animate-bounce text-white' : ''}`} />
                          <span>{isReadingThisQ ? 'AI đang đọc câu hỏi...' : 'AI đọc câu hỏi'}</span>
                        </button>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, optIdx) => {
                          const isOptSelected = userSelected === optIdx;
                          const isThisCorrect = optIdx === targetCorrectIndex;

                          let btnStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-slate-200';
                          if (isOptSelected) {
                            btnStyle = isThisCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600 font-black shadow-sm ring-2 ring-emerald-300'
                              : 'bg-rose-500 text-white border-rose-600 font-black shadow-sm ring-2 ring-rose-300';
                          } else if (isCorrect && isThisCorrect) {
                            btnStyle = 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              id={`quiz-${q.id}-opt-${optIdx}`}
                              onClick={() => handleAnswerQuiz(q.id, optIdx, targetCorrectIndex)}
                              className={`p-3 rounded-2xl border-2 text-xs sm:text-sm text-left transition-all cursor-pointer font-serif flex items-center justify-between gap-2 active:scale-95 ${btnStyle}`}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ${
                                  isOptSelected ? 'bg-white/30 text-white' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </span>

                              {isOptSelected && (
                                isThisCorrect ? (
                                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-white shrink-0" />
                                )
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Answer Feedback Banner */}
                      {userSelected !== undefined && (
                        <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-200 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>🎉 Chính xác! Bé trả lời rất giỏi (+1 ⭐)</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>Chưa đúng rồi! Bé hãy bấm "AI đọc câu hỏi" để nghe lại và chọn đáp án khác nhé.</span>
                              </>
                            )}
                          </div>

                          {q.explanation && isCorrect && (
                            <span className="text-[11px] font-normal text-emerald-800 italic hidden sm:inline">
                              💡 {q.explanation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Previous / Next Lesson Navigation Bar */}
      <div className="flex items-center justify-between gap-4 mt-6">
        {hasPrevious && onPreviousLesson ? (
          <button
            id="prev-lesson-bottom-btn"
            onClick={onPreviousLesson}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>Bài trước</span>
          </button>
        ) : <div />}

        {hasNext && onNextLesson && (
          <button
            id="next-lesson-bottom-btn"
            onClick={onNextLesson}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer ml-auto"
          >
            <span>Bài tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
