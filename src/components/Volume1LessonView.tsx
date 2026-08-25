import React, { useState, useEffect } from 'react';
import { Volume1Lesson, RecordingTargetInfo, AchievementBadge } from '../types';
import { speechService } from '../services/speechService';
import { lessonStorageService } from '../services/lessonStorageService';
import { achievementService } from '../services/achievementService';
import { VoiceRecordButton } from './VoiceRecordButton';
import { Volume2, Play, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, BookOpen, PenTool, MessageSquare, Award, Edit3, Mic, Type, Trophy, Check } from 'lucide-react';

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
  onUnlockBadges?: (badges: AchievementBadge[]) => void;
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
  onUnlockBadges
}) => {
  const [activePart, setActivePart] = useState<'all' | 'part1' | 'part2' | 'part3' | 'quiz'>('all');
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'huge'>('normal');
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [key: string]: number }>({});
  const [answeredCorrectly, setAnsweredCorrectly] = useState<{ [key: string]: boolean }>({});
  const [activeStoryPic, setActiveStoryPic] = useState<number>(1);
  const [spellingActiveIdx, setSpellingActiveIdx] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => achievementService.isLessonCompleted('vol1', lesson.id));

  useEffect(() => {
    setIsCompleted(achievementService.isLessonCompleted('vol1', lesson.id));
  }, [lesson.id]);

  const isCustomized = lessonStorageService.isVolume1Customized(lesson.id);

  const handleToggleCompletion = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    const { newlyCompleted, newBadges } = achievementService.setLessonCompleted('vol1', lesson.id, nextState);
    
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
    speechService.spellOut(steps, fullResult);
    setTimeout(() => {
      setSpellingActiveIdx(null);
    }, (steps ? steps.length * 750 : 1000) + 1200);
  };

  const handleAnswerQuiz = (quizId: string, optionIdx: number, correctIdx: number) => {
    setSelectedQuizAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
    const isCorrect = optionIdx === correctIdx;
    if (isCorrect && !answeredCorrectly[quizId]) {
      setAnsweredCorrectly(prev => ({ ...prev, [quizId]: true }));
      speechService.playSoundEffect('success');
      onAddStar();
    } else if (!isCorrect) {
      speechService.playSoundEffect('pop');
    }
  };

  // Dynamic font size classes for Grade 1 textbook feel
  const sentenceFontSizeClass = fontSizeMode === 'huge'
    ? 'text-2xl sm:text-3xl md:text-4xl leading-[2.3]'
    : fontSizeMode === 'large'
    ? 'text-xl sm:text-2xl md:text-3xl leading-[2.2]'
    : 'text-lg sm:text-xl md:text-2xl leading-[2.1]';

  const passageFontSizeClass = fontSizeMode === 'huge'
    ? 'text-2xl sm:text-3xl md:text-4xl leading-[2.4] tracking-wide'
    : fontSizeMode === 'large'
    ? 'text-xl sm:text-2xl md:text-3xl leading-[2.3] tracking-wide'
    : 'text-lg sm:text-xl md:text-2xl leading-[2.2] tracking-wide';

  const syllableFontSizeClass = fontSizeMode === 'huge'
    ? 'text-2xl sm:text-3xl px-5 py-3'
    : fontSizeMode === 'large'
    ? 'text-xl sm:text-2xl px-4 py-2.5'
    : 'text-lg sm:text-xl px-3.5 py-2';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sgk">
      
      {/* Lesson Header Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
                Tập 1 • Bài {lesson.lessonNumber}
              </span>
              <span className="bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full text-xs font-bold">
                Trang {lesson.pageRange}
              </span>
              {isCustomized && (
                <span className="bg-white text-orange-700 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-orange-500 fill-orange-400" />
                  Đã tùy chỉnh bởi GV
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sgk-title tracking-tight drop-shadow-xs">
              {lesson.title}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Completion Toggle Button */}
            <button
              id="toggle-vol1-completed-btn"
              onClick={handleToggleCompletion}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer border ${
                isCompleted
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                  : 'bg-white/90 hover:bg-white text-orange-950 border-white/60'
              }`}
              title={isCompleted ? 'Bé đã hoàn thành bài học này (bấm để hủy)' : 'Bấm để đánh dấu đã đọc xong bài này'}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 fill-emerald-600" />
                  <span>Đã đọc xong ⭐</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-orange-600" />
                  <span>Đánh dấu đã đọc</span>
                </>
              )}
            </button>

            {onOpenVoiceRecorder && (
              <VoiceRecordButton
                target={{
                  volume: 'vol1',
                  lessonId: lesson.id,
                  lessonNumber: lesson.lessonNumber,
                  lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                  sectionTitle: 'Toàn bộ bài học',
                  targetText: `${lesson.part1_Letters.recognitionSentence}\n\n${lesson.part3_SentenceAndPractice.readingPassage}`
                }}
                onOpenRecorder={onOpenVoiceRecorder}
                variant="pill"
                label="Bé thu âm đọc bài"
              />
            )}

            {onEditLesson && (
              <button
                id="edit-current-lesson-btn"
                onClick={onEditLesson}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-950/40 hover:bg-amber-950/60 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md border border-white/25 transition-all active:scale-95 cursor-pointer"
                title="Chỉnh sửa nội dung bài học này (dành cho giáo viên)"
              >
                <Edit3 className="w-4 h-4 text-amber-300" />
                <span>Chỉnh sửa bài</span>
              </button>
            )}

            <button
              id="read-lesson-title-btn"
              onClick={() => speechService.speak(`Bài ${lesson.lessonNumber}: ${lesson.title}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 hover:bg-orange-50 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Đọc tên bài</span>
            </button>
          </div>
        </div>

        {/* Lesson Sub-Nav Buttons & Font Size Control */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-white/20 text-xs sm:text-sm font-bold">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePart('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePart === 'all' ? 'bg-white text-orange-600 shadow-xs' : 'bg-black/10 hover:bg-black/20 text-white'
              }`}
            >
              Tất cả 3 phần
            </button>
            <button
              onClick={() => setActivePart('part1')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePart === 'part1' ? 'bg-white text-orange-600 shadow-xs' : 'bg-black/10 hover:bg-black/20 text-white'
              }`}
            >
              1. Nhận biết
            </button>
            <button
              onClick={() => setActivePart('part2')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePart === 'part2' ? 'bg-white text-orange-600 shadow-xs' : 'bg-black/10 hover:bg-black/20 text-white'
              }`}
            >
              2. Đọc âm vần & từ
            </button>
            <button
              onClick={() => setActivePart('part3')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activePart === 'part3' ? 'bg-white text-orange-600 shadow-xs' : 'bg-black/10 hover:bg-black/20 text-white'
              }`}
            >
              3. Đọc câu & Luyện viết
            </button>
            {lesson.quiz && lesson.quiz.length > 0 && (
              <button
                onClick={() => setActivePart('quiz')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activePart === 'quiz' ? 'bg-amber-300 text-amber-950 shadow-xs' : 'bg-amber-400/30 hover:bg-amber-400/50 text-white'
                }`}
              >
                ⭐ Trắc nghiệm vui
              </button>
            )}
          </div>

          {/* Quick Font Size Switcher for Textbook Reading */}
          <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl backdrop-blur-xs">
            <span className="text-white/80 text-[11px] px-1.5 flex items-center gap-1">
              <Type className="w-3.5 h-3.5" />
              <span>Cỡ chữ:</span>
            </span>
            <button
              onClick={() => setFontSizeMode('normal')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'normal' ? 'bg-white text-orange-700 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
              title="Cỡ chữ chuẩn SGK"
            >
              Chuẩn SGK
            </button>
            <button
              onClick={() => setFontSizeMode('large')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'large' ? 'bg-white text-orange-700 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
              title="Cỡ chữ Lớn cho bé"
            >
              Lớn (A+)
            </button>
            <button
              onClick={() => setFontSizeMode('huge')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'huge' ? 'bg-white text-orange-700 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
              title="Cỡ chữ Rất Lớn"
            >
              Rất lớn (A++)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        
        {/* ========================================================
            PHẦN 1: NHẬN BIẾT
           ======================================================== */}
        {(activePart === 'all' || activePart === 'part1') && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-amber-100 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-sm font-sgk-title">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-sgk-title">
                  Nhận biết âm và chữ
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {onOpenVoiceRecorder && (
                  <VoiceRecordButton
                    target={{
                      volume: 'vol1',
                      lessonId: lesson.id,
                      lessonNumber: lesson.lessonNumber,
                      lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                      sectionTitle: 'Phần 1: Nhận biết câu',
                      targetText: lesson.part1_Letters.recognitionSentence
                    }}
                    onOpenRecorder={onOpenVoiceRecorder}
                    size="sm"
                    variant="orange"
                    label="Ghi âm câu này"
                  />
                )}

                <button
                  id="speak-part1-sentence-btn"
                  onClick={() => speechService.speak(lesson.part1_Letters.recognitionSentence)}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-700" />
                  Nghe câu nhận biết
                </button>
              </div>
            </div>

            {/* Large Letters Display */}
            <div className="my-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {lesson.part1_Letters.letters.map((letter, idx) => (
                <div
                  key={idx}
                  id={`letter-bubble-${idx}`}
                  onClick={() => speechService.speak(letter)}
                  className="group cursor-pointer flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-orange-500 hover:scale-105 transition-all shadow-sm"
                >
                  <span className="text-4xl sm:text-5xl font-black text-amber-950 font-sgk-title group-hover:text-orange-600 tracking-tight">
                    {letter}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-1 opacity-70 group-hover:opacity-100">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recognition Sentence */}
            <div className="bg-amber-50/70 p-5 sm:p-6 rounded-2xl border border-amber-200/80 shadow-xs">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                Câu nhận biết trong bài:
              </div>
              <p className={`font-bold text-slate-900 font-reading ${sentenceFontSizeClass}`}>
                "{lesson.part1_Letters.recognitionSentence}"
              </p>
              {lesson.part1_Letters.recognitionKeywords && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-amber-800">Từ khóa trọng tâm:</span>
                  {lesson.part1_Letters.recognitionKeywords.map((kw, i) => (
                    <button
                      key={i}
                      onClick={() => speechService.speak(kw)}
                      className="px-3 py-1 rounded-xl bg-white text-sm font-bold text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer font-sgk"
                    >
                      {kw} 🔊
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            PHẦN 2: ĐỌC ÂM VẦN, TIẾNG, TỪ NGỮ
           ======================================================== */}
        {(activePart === 'all' || activePart === 'part2') && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-amber-100 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-sm font-sgk-title">
                  2
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-sgk-title">
                  Đọc âm vần, ghép tiếng và từ ngữ
                </h2>
              </div>
            </div>

            {/* Spelling Models (Mô hình ghép vần & đánh vần) */}
            {lesson.part2_SyllablesAndWords.models && lesson.part2_SyllablesAndWords.models.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Mô hình đánh vần mẫu (Bấm để nghe từng bước):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.part2_SyllablesAndWords.models.map((model, idx) => (
                    <div
                      key={idx}
                      id={`spelling-model-${idx}`}
                      onClick={() => handleSpellingModel(model.spellingSteps, model.result, idx)}
                      className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        spellingActiveIdx === idx
                          ? 'bg-amber-100 border-amber-500 scale-[1.02] ring-2 ring-amber-300'
                          : 'bg-orange-50/50 hover:bg-orange-100/60 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 text-xl font-black text-amber-950 font-sgk">
                        <span className="px-3 py-1 bg-white rounded-xl shadow-xs text-orange-600 border border-orange-200">
                          {model.initial || '—'}
                        </span>
                        <span className="text-orange-400">+</span>
                        <span className="px-3 py-1 bg-white rounded-xl shadow-xs text-amber-600 border border-amber-200">
                          {model.vowel}
                        </span>
                        {model.tone && (
                          <>
                            <span className="text-orange-400">+</span>
                            <span className="text-sm font-bold text-slate-600">
                              (thanh {model.tone})
                            </span>
                          </>
                        )}
                        <span className="text-orange-400">=</span>
                        <span className="text-2xl sm:text-3xl font-black text-orange-600 px-3.5 py-1 bg-white rounded-xl shadow-xs border-2 border-orange-400 font-sgk-title">
                          {model.result}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-orange-700 bg-white px-2.5 py-1.5 rounded-xl shadow-xs">
                        <Play className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
                        <span>Đánh vần</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reading Syllables (Các tiếng đọc) */}
            {lesson.part2_SyllablesAndWords.readingSyllables && (
              <div className="mb-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  Các tiếng ứng dụng (Bấm để nghe đọc):
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {lesson.part2_SyllablesAndWords.readingSyllables.map((syl, i) => (
                    <button
                      key={i}
                      id={`syllable-btn-${i}`}
                      onClick={() => speechService.speak(syl)}
                      className={`bg-white hover:bg-amber-500 hover:text-white text-slate-900 font-black rounded-xl border border-slate-200 transition-all shadow-xs active:scale-95 font-sgk cursor-pointer ${syllableFontSizeClass}`}
                    >
                      {syl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Illustrated Words (Từ ngữ ứng dụng kèm tranh minh họa) */}
            <div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                Từ ngữ mở rộng kèm hình ảnh minh họa:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {lesson.part2_SyllablesAndWords.words.map((item, idx) => (
                  <div
                    key={idx}
                    id={`word-card-${idx}`}
                    onClick={() => speechService.speak(item.word)}
                    className="group cursor-pointer bg-gradient-to-b from-white to-amber-50/40 hover:to-orange-100/50 p-4 sm:p-5 rounded-2xl border border-amber-200 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                        {item.illustrationIcon || '📖'}
                      </div>
                      <Volume2 className="w-4 h-4 text-orange-600 opacity-60 group-hover:opacity-100" />
                    </div>

                    <div>
                      <div className="text-xl sm:text-2xl font-black text-amber-950 font-sgk-title group-hover:text-orange-600">
                        {item.word}
                      </div>
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {item.meaning}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-100/80 flex items-center justify-between text-[11px] font-bold text-orange-700">
                      <span>{item.imageDesc ? `Tranh: ${item.imageDesc}` : 'Tập đọc'}</span>
                      <span className="text-orange-500 group-hover:translate-x-0.5 transition-transform">▶ Đọc</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            PHẦN 3: ĐỌC ĐOẠN VĂN / BÀI THƠ & LUYỆN VIẾT, LUYỆN NÓI
           ======================================================== */}
        {(activePart === 'all' || activePart === 'part3') && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-amber-100 transition-all space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-sm font-sgk-title">
                  3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-sgk-title">
                  Đọc đoạn văn, Luyện viết & Luyện nói
                </h2>
              </div>
            </div>

            {/* Reading Passage */}
            <div className="bg-amber-50/50 p-5 sm:p-6 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  📖 Bài đọc luyện tập:
                </span>
                
                <div className="flex items-center gap-2">
                  {onOpenVoiceRecorder && (
                    <VoiceRecordButton
                      target={{
                        volume: 'vol1',
                        lessonId: lesson.id,
                        lessonNumber: lesson.lessonNumber,
                        lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
                        sectionTitle: 'Phần 3: Bài đọc luyện tập',
                        targetText: lesson.part3_SentenceAndPractice.readingPassage
                      }}
                      onOpenRecorder={onOpenVoiceRecorder}
                      size="sm"
                      variant="orange"
                      label="Bé thu âm bài đọc này"
                    />
                  )}

                  <button
                    id="speak-reading-passage-btn"
                    onClick={() => speechService.speak(lesson.part3_SentenceAndPractice.readingPassage)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    Đọc cả bài văn
                  </button>
                </div>
              </div>

              <div className={`text-slate-900 font-reading whitespace-pre-line bg-white p-5 sm:p-6 rounded-2xl border border-amber-200 shadow-inner ${passageFontSizeClass}`}>
                {lesson.part3_SentenceAndPractice.readingPassage}
              </div>
            </div>

            {/* Writing Samples & Quick Canvas Link */}
            {lesson.part3_SentenceAndPractice.writingSamples && (
              <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                      Mẫu chữ tập viết vào vở:
                    </span>
                  </div>
                  <button
                    id="open-writing-board-btn"
                    onClick={() => onOpenWritingPractice(lesson.part3_SentenceAndPractice.writingSamples!.join(' '))}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Mở Vở Ô Ly Viết</span>
                    <span>✍️</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {lesson.part3_SentenceAndPractice.writingSamples.map((sample, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 bg-white text-purple-950 font-bold font-handwriting text-2xl sm:text-3xl rounded-xl border border-purple-200 shadow-xs"
                    >
                      {sample}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speaking Topic (Luyện nói) */}
            {lesson.part3_SentenceAndPractice.speakingTopic && (
              <div className="bg-teal-50/60 p-5 rounded-2xl border border-teal-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                    Chủ đề luyện nói: {lesson.part3_SentenceAndPractice.speakingTopic.title}
                  </span>
                </div>
                <p className="text-base text-teal-950 font-medium font-reading leading-relaxed">
                  {lesson.part3_SentenceAndPractice.speakingTopic.prompt}
                </p>
              </div>
            )}

            {/* Story for Review lessons */}
            {lesson.part3_SentenceAndPractice.story && (
              <div className="bg-orange-50/60 p-5 sm:p-6 rounded-2xl border border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🦊</span>
                    <h3 className="font-bold text-orange-950 text-base sm:text-lg font-sgk-title">
                      Kể chuyện: {lesson.part3_SentenceAndPractice.story.title}
                    </h3>
                  </div>
                  <button
                    id="speak-story-all-btn"
                    onClick={() => {
                      const allText = lesson.part3_SentenceAndPractice.story!.pictures.map(p => `Tranh ${p.id}: ${p.content}`).join('. ');
                      speechService.speak(`Câu chuyện: ${lesson.part3_SentenceAndPractice.story!.title}. ${allText}`);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Kể toàn bộ truyện
                  </button>
                </div>

                {/* Picture selector tabs */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                  {lesson.part3_SentenceAndPractice.story.pictures.map((pic) => (
                    <button
                      key={pic.id}
                      onClick={() => setActiveStoryPic(pic.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        activeStoryPic === pic.id
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white text-orange-900 border border-orange-200'
                      }`}
                    >
                      Tranh {pic.id}
                    </button>
                  ))}
                </div>

                {/* Active Picture Content */}
                {(() => {
                  const currentPic = lesson.part3_SentenceAndPractice.story.pictures.find(p => p.id === activeStoryPic) || lesson.part3_SentenceAndPractice.story.pictures[0];
                  return (
                    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-orange-200 shadow-xs">
                      <div className="text-xs font-bold text-orange-700 mb-1">
                        ❓ Câu hỏi gợi ý theo tranh {currentPic.id}:
                      </div>
                      <div className="text-sm font-bold text-slate-800 mb-2">
                        {currentPic.question}
                      </div>
                      <div className="text-xs font-bold text-emerald-800 mb-1">
                        💡 Nội dung câu chuyện tranh {currentPic.id}:
                      </div>
                      <p className="text-base text-slate-700 font-serif leading-relaxed">
                        {currentPic.content}
                      </p>
                      <button
                        onClick={() => speechService.speak(currentPic.content)}
                        className="mt-3 flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100/70 hover:bg-orange-200 px-2.5 py-1 rounded-lg"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Nghe kể đoạn này
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

          </div>
        )}

        {/* ========================================================
            MINI QUIZ / THỬ THÁCH VUI
           ======================================================== */}
        {(activePart === 'all' || activePart === 'quiz') && lesson.quiz && lesson.quiz.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 sm:p-7 shadow-sm border border-amber-200 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-black text-amber-950 font-serif">
                Thử thách vui: Đố bạn biết?
              </h2>
            </div>

            <div className="space-y-4">
              {lesson.quiz.map((q) => {
                const userSelected = selectedQuizAnswers[q.id];
                const isCorrect = answeredCorrectly[q.id];

                return (
                  <div key={q.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
                    <div className="text-base font-bold text-amber-950 mb-3">
                      {q.question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = userSelected === optIdx;
                        const isThisCorrect = optIdx === q.correctIndex;

                        return (
                          <button
                            key={optIdx}
                            id={`quiz-${q.id}-opt-${optIdx}`}
                            onClick={() => handleAnswerQuiz(q.id, optIdx, q.correctIndex)}
                            className={`p-3 rounded-xl text-left text-sm font-semibold transition-all border ${
                              isThisSelected
                                ? isThisCorrect
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                                  : 'bg-rose-100 border-rose-400 text-rose-950'
                                : 'bg-slate-50 hover:bg-amber-100/50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt}</span>
                              {isThisSelected && isThisCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {isCorrect && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Đúng rồi! Bạn được tặng 1 Ngôi Sao Thưởng. {q.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        {/* ========================================================
            LESSON COMPLETION & BADGE REWARD BANNER
           ======================================================== */}
        <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-sm shrink-0">
              {isCompleted ? '🎖️' : '📖'}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-amber-950 font-serif">
                {isCompleted ? 'Bé đã hoàn thành xuất sắc bài học này!' : 'Bé đã luyện đọc xong toàn bộ bài học?'}
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 font-medium mt-0.5">
                {isCompleted
                  ? 'Tuyệt vời! Thành tích đã được ghi nhận vào Bảng Vàng Danh Hiệu.'
                  : 'Bấm nút bên cạnh để nhận Ngôi Sao Thưởng và tích lũy huy hiệu học tập nhé!'}
              </p>
            </div>
          </div>

          <button
            id="bottom-toggle-complete-btn"
            onClick={handleToggleCompletion}
            className={`px-5 py-3 rounded-2xl font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>Đã Hoàn Thành (Bấm để hủy)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-200 fill-yellow-300 animate-spin" />
                <span>Bé Đã Đọc Xong ⭐ Nhận Thưởng</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Footer Navigation (Bài trước / Bài tiếp) */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-amber-200">
        <button
          id="prev-lesson-btn"
          onClick={onPreviousLesson}
          disabled={!hasPrevious}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            hasPrevious
              ? 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 shadow-xs'
              : 'opacity-40 cursor-not-allowed text-slate-400'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bài trước</span>
        </button>

        <span className="text-xs font-bold text-amber-900">
          Bài {lesson.lessonNumber} / 83
        </span>

        <button
          id="next-lesson-btn"
          onClick={onNextLesson}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            hasNext
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
              : 'opacity-40 cursor-not-allowed text-slate-400'
          }`}
        >
          <span>Bài tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
