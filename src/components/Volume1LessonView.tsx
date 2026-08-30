import React, { useState, useEffect } from 'react';
import { Volume1Lesson, RecordingTargetInfo, AchievementBadge } from '../types';
import { speechService } from '../services/speechService';
import { lessonStorageService } from '../services/lessonStorageService';
import { teacherAudioService } from '../services/teacherAudioService';
import { achievementService } from '../services/achievementService';
import { userProfileService } from '../services/userProfileService';
import { TeacherAudioTarget } from './TeacherAudioRecorderModal';
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
  Radio
} from 'lucide-react';

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

  const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string, section?: 'letter' | 'syllable' | 'word' | 'sentence' | 'passage' | 'quiz' | 'general') => {
    e.stopPropagation();
    if (onOpenTeacherRecorder) {
      onOpenTeacherRecorder({
        targetText: text,
        volume: 'vol1',
        lessonId: lesson.id,
        lessonNumber: lesson.lessonNumber,
        lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
        sectionTitle
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

  const handleSpellingModel = (steps: string[] | undefined, fullResult: string, idx: number) => {
    setSpellingActiveIdx(idx);
    speechService.spellOut(steps, fullResult, () => {
      speechService.playSoundEffect('sparkle');
    });
    setTimeout(() => {
      setSpellingActiveIdx(null);
    }, (steps ? steps.length * 750 : 1000) + 1200);
  };

  const handleAnswerQuiz = (quizId: string, optionIdx: number, correctIdx: number) => {
    setSelectedQuizAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
    const isCorrect = optionIdx === correctIdx;
    if (isCorrect) {
      if (!answeredCorrectly[quizId]) {
        const nextCorrectMap = { ...answeredCorrectly, [quizId]: true };
        setAnsweredCorrectly(nextCorrectMap);
        
        // Check if all quiz questions in this section/lesson are completed
        const totalQuizzes = lesson.quiz?.length || 0;
        const totalCompleted = Object.keys(nextCorrectMap).length;
        
        if (totalQuizzes > 0 && totalCompleted >= totalQuizzes) {
          // Play celebratory section complete chime
          speechService.playSoundEffect('sectionComplete');
          setTimeout(() => {
            speechService.speak('Hoan hô bé! Bé đã xuất sắc trả lời đúng tất cả câu hỏi thử thách!');
          }, 500);
        } else {
          // Play gentle pleasant correct chime
          speechService.playSoundEffect('correct');
        }
        onAddStar();
      } else {
        speechService.playSoundEffect('correct');
      }
    } else {
      // Play gentle encouraging sound
      speechService.playSoundEffect('tryAgain');
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
                <span className="bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-500 fill-orange-400" />
                  Đã tùy chỉnh bởi GV
                </span>
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  1
                </span>
                <h2 className="text-base sm:text-lg font-bold text-orange-600 font-serif">
                  Phát âm
                </h2>
              </div>

              {/* Action Buttons for Section 1 */}
              <div className="flex items-center gap-2">
                <button
                  id="speak-all-letters-btn"
                  onClick={() => speechService.speak(lesson.part1_Letters.letters.join(', '))}
                  className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white hover:bg-orange-50 text-orange-500 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  title="Nghe phát âm tất cả các âm vần"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {onOpenVoiceRecorder && (
                  <button
                    id="record-letters-btn"
                    onClick={() => {
                      onOpenVoiceRecorder({
                        volume: 'vol1',
                        lessonId: lesson.id,
                        lessonNumber: lesson.lessonNumber,
                        lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                        sectionTitle: 'Phần 1: Luyện đọc Phát âm',
                        targetText: lettersText
                      });
                    }}
                    className="flex items-center gap-1.5 bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Ghi âm và nộp bài luyện đọc phát âm"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Luyện đọc</span>
                  </button>
                )}
              </div>
            </div>

            {/* Letter Cards Grid */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              {lesson.part1_Letters.letters.map((letter, idx) => {
                const hasTeacherAudio = teacherAudioService.hasAudioForText(letter, 'letter');
                return (
                  <div key={idx} className="relative group/card">
                    <button
                      id={`letter-card-${idx}`}
                      onClick={() => speechService.speak(letter, undefined, undefined, 'letter')}
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

            {/* Spelling Model (Mô hình ghép âm - nếu có) */}
            {lesson.part2_SyllablesAndWords.models && lesson.part2_SyllablesAndWords.models.length > 0 && (
              <div className="mt-4 pt-2">
                <div className="text-xs font-semibold text-slate-500 mb-2">
                  Mô hình đánh vần:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {lesson.part2_SyllablesAndWords.models.map((model, idx) => {
                    const hasTeacherAudio = teacherAudioService.hasAudioForText(model.result, 'syllable');
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSpellingModel(model.spellingSteps, model.result, idx)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between group relative ${
                          spellingActiveIdx === idx
                            ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-300'
                            : 'bg-orange-50/40 hover:bg-orange-100/50 border-orange-200/70'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-800 font-sgk">
                          <span className="px-2 py-0.5 bg-white rounded-lg border border-orange-200 text-orange-700">
                            {model.initial || '—'}
                          </span>
                          <span className="text-orange-400">+</span>
                          <span className="px-2 py-0.5 bg-white rounded-lg border border-amber-200 text-amber-700">
                            {model.vowel}
                          </span>
                          {model.tone && (
                            <>
                              <span className="text-orange-400">+</span>
                              <span className="text-xs text-slate-500 font-normal">({model.tone})</span>
                            </>
                          )}
                          <span className="text-orange-400">=</span>
                          <span className="text-lg sm:text-xl font-extrabold text-orange-600 px-2.5 py-0.5 bg-white rounded-lg border border-orange-300 flex items-center gap-1">
                            <span>{model.result}</span>
                            {hasTeacherAudio && (
                              <span className="text-[10px] px-1 bg-emerald-100 text-emerald-800 rounded font-bold">GV</span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                            <button
                              onClick={(e) => handleTeacherRecordClick(e, model.result, `Mô hình: ${model.result}`)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                hasTeacherAudio ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              } ${isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                              title={`Thu âm giọng mẫu cho tiếng "${model.result}"`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Play className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
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
                <div className="text-xs font-semibold text-slate-500 mb-2">
                  Các tiếng luyện đọc:
                </div>
                <div className="flex flex-wrap gap-2">
                  {lesson.part2_SyllablesAndWords.readingSyllables.map((syl, i) => {
                    const hasTeacherAudio = teacherAudioService.hasAudioForText(syl, 'syllable');
                    return (
                      <div key={i} className="relative group/syl">
                        <button
                          onClick={() => speechService.speak(syl, undefined, undefined, 'syllable')}
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-blue-600 font-serif">
                  Từ ngữ
                </h2>
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
                const hasTeacherAudio = teacherAudioService.hasAudioForText(item.word, 'word');
                return (
                  <div key={idx} className="relative group/word">
                    <button
                      id={`word-item-${idx}`}
                      onClick={() => speechService.speak(item.word, undefined, undefined, 'word')}
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
                        onClick={(e) => handleTeacherRecordClick(e, item.word, `Từ ngữ: ${item.word}`)}
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
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  3
                </span>
                <h2 className="text-base sm:text-lg font-bold text-emerald-700 font-serif">
                  Luyện đọc đoạn văn
                </h2>
              </div>

              {/* Action Buttons for Section 3 */}
              <div className="flex items-center gap-2">
                <button
                  id="speak-passage-btn"
                  onClick={() => speechService.speak(lesson.part3_SentenceAndPractice.readingPassage, undefined, undefined, 'passage')}
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
                const hasTeacherAudio = teacherAudioService.hasAudioForText(sentence, 'sentence');
                return (
                  <div
                    key={sIdx}
                    id={`sentence-card-${sIdx}`}
                    onClick={() => speechService.speak(sentence, undefined, undefined, 'sentence')}
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
              <div className="flex items-center gap-3">
                <PenTool className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-900 uppercase">Tập viết:</span>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🦊</span>
                  <h3 className="font-bold text-amber-950 text-base font-serif">
                    Kể chuyện: {lesson.part3_SentenceAndPractice.story.title}
                  </h3>
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
                  <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-2xs text-sm">
                    <p className="text-slate-700 leading-relaxed font-serif">{currentPic.content}</p>
                    <button
                      onClick={() => speechService.speak(currentPic.content)}
                      className="mt-2 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe đoạn này</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Mini Quiz if present */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <div className="bg-yellow-50/60 p-5 rounded-2xl border border-yellow-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-950 text-base font-serif">
                  Thử thách vui
                </h3>
              </div>
              <div className="space-y-3">
                {lesson.quiz.map((q) => {
                  const userSelected = selectedQuizAnswers[q.id];
                  const isCorrect = answeredCorrectly[q.id];
                  return (
                    <div key={q.id} className="bg-white p-4 rounded-xl border border-yellow-200 shadow-2xs">
                      <div className="text-sm font-bold text-slate-800 mb-2 font-serif">{q.question}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptSelected = userSelected === optIdx;
                          const isThisCorrect = optIdx === q.correctAnswer;
                          let btnStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200';
                          if (isOptSelected) {
                            btnStyle = isThisCorrect
                              ? 'bg-emerald-500 text-white border-emerald-500 font-bold'
                              : 'bg-rose-500 text-white border-rose-500 font-bold';
                          }
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerQuiz(q.id, optIdx, q.correctAnswer)}
                              className={`p-2.5 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
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
