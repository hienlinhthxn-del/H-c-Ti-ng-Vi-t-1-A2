import React, { useState, useEffect } from 'react';
import { Volume2Lesson, RecordingTargetInfo, AchievementBadge } from '../types';
import { speechService } from '../services/speechService';
import { lessonStorageService } from '../services/lessonStorageService';
import { achievementService } from '../services/achievementService';
import { VoiceRecordButton } from './VoiceRecordButton';
import { Volume2, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, BookOpen, PenTool, HelpCircle, Lightbulb, Edit3, Mic, Type, Check } from 'lucide-react';

interface Volume2LessonViewProps {
  lesson: Volume2Lesson;
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

export const Volume2LessonView: React.FC<Volume2LessonViewProps> = ({
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
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'huge'>('normal');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [showAnswerFor, setShowAnswerFor] = useState<{ [key: string]: boolean }>({});
  const [spellingSelections, setSpellingSelections] = useState<{ [key: number]: string }>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(() => achievementService.isLessonCompleted('vol2', lesson.id));

  useEffect(() => {
    setIsCompleted(achievementService.isLessonCompleted('vol2', lesson.id));
  }, [lesson.id]);

  const isCustomized = lessonStorageService.isVolume2Customized(lesson.id);

  const handleToggleCompletion = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    const { newlyCompleted, newBadges } = achievementService.setLessonCompleted('vol2', lesson.id, nextState);
    
    if (newlyCompleted) {
      speechService.playSoundEffect('fanfare');
      speechService.speak('Chúc mừng bé đã hoàn thành bài đọc hiểu Tập 2!');
      onAddStar();

      if (newBadges.length > 0 && onUnlockBadges) {
        onUnlockBadges(newBadges);
      }
    } else {
      speechService.playSoundEffect('pop');
    }
  };

  const handleSelectQuiz = (qId: string, optIdx: number, correctOpt: number | undefined) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    if (correctOpt !== undefined && optIdx === correctOpt) {
      speechService.playSoundEffect('success');
      onAddStar();
    } else {
      speechService.playSoundEffect('pop');
    }
  };

  const handleReadFullArticle = () => {
    const fullText = `${lesson.reading.title}. Tác giả: ${lesson.reading.author || 'Sách giáo khoa'}. ${lesson.reading.content.join(' ')}`;
    speechService.speak(fullText);
  };

  // Dynamic font sizing
  const readingFontSizeClass = fontSizeMode === 'huge'
    ? 'text-2xl sm:text-3xl md:text-4xl leading-[2.4] tracking-wide'
    : fontSizeMode === 'large'
    ? 'text-xl sm:text-2xl md:text-3xl leading-[2.3] tracking-wide'
    : 'text-lg sm:text-xl md:text-2xl leading-[2.2] tracking-wide';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sgk">
      
      {/* Thematic Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
                Tập 2 • {lesson.topicTitle}
              </span>
              <span className="bg-emerald-300 text-emerald-950 px-2.5 py-0.5 rounded-full text-xs font-bold">
                Trang {lesson.pageRange}
              </span>
              {isCustomized && (
                <span className="bg-white text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-500" />
                  Đã tùy chỉnh bởi GV
                </span>
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
                  fontSizeMode === 'normal' ? 'bg-white text-emerald-800 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
                title="Cỡ chữ chuẩn SGK"
              >
                Chuẩn SGK
              </button>
              <button
                onClick={() => setFontSizeMode('large')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSizeMode === 'large' ? 'bg-white text-emerald-800 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
                title="Cỡ chữ Lớn cho bé"
              >
                Lớn (A+)
              </button>
              <button
                onClick={() => setFontSizeMode('huge')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSizeMode === 'huge' ? 'bg-white text-emerald-800 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
                title="Cỡ chữ Rất Lớn"
              >
                Rất lớn (A++)
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sgk-title tracking-tight mt-1">
            {lesson.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Completion Toggle Button */}
            <button
              id="toggle-vol2-completed-btn"
              onClick={handleToggleCompletion}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer border ${
                isCompleted
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                  : 'bg-white/95 hover:bg-white text-emerald-950 border-white/60'
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
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Đánh dấu đã đọc</span>
                </>
              )}
            </button>

            {onOpenVoiceRecorder && (
              <VoiceRecordButton
                target={{
                  volume: 'vol2',
                  lessonId: lesson.id,
                  lessonNumber: lesson.lessonNumber,
                  lessonTitle: `${lesson.title} (${lesson.topicTitle})`,
                  sectionTitle: 'Toàn bộ bài đọc',
                  targetText: `${lesson.reading.title}\n\n${lesson.reading.content.join('\n\n')}`,
                  referenceAudioText: `${lesson.reading.title}. ${lesson.reading.content.join(' ')}`
                }}
                onOpenRecorder={onOpenVoiceRecorder}
                variant="pill"
                label="Bé thu âm cả bài đọc"
              />
            )}

            {onEditLesson && (
              <button
                id="edit-current-vol2-lesson-btn"
                onClick={onEditLesson}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-950/40 hover:bg-emerald-950/60 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md border border-white/25 transition-all active:scale-95 cursor-pointer"
                title="Chỉnh sửa nội dung bài học Tập 2 này (dành cho giáo viên)"
              >
                <Edit3 className="w-4 h-4 text-emerald-300" />
                <span>Chỉnh sửa bài</span>
              </button>
            )}

            <button
              id="read-full-story-btn"
              onClick={handleReadFullArticle}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <span>Nghe đọc toàn bộ bài</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* ========================================================
            1. KHỞI ĐỘNG (WARM UP)
           ======================================================== */}
        {lesson.warmup && (
          <div className="bg-amber-50/70 rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Khởi động & Liên hệ trải nghiệm</span>
            </div>
            <p className="text-base sm:text-lg text-slate-900 font-reading leading-relaxed">
              {lesson.warmup.prompt}
            </p>
          </div>
        )}

        {/* ========================================================
            2. ĐỌC VĂN BẢN / BÀI THƠ / TRUYỆN
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-100 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-sm font-sgk-title">
                📖
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sgk-title">
                  {lesson.reading.title}
                </h2>
                {lesson.reading.author && (
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                    Tác giả: {lesson.reading.author}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reading Body */}
          <div className="space-y-4 my-4">
            {lesson.reading.content.map((paragraph, idx) => (
              <div
                key={idx}
                className="group relative p-5 rounded-2xl bg-emerald-50/20 hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200 transition-all"
              >
                <p className={`text-slate-900 font-reading whitespace-pre-line ${readingFontSizeClass}`}>
                  {paragraph}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {onOpenVoiceRecorder && (
                    <VoiceRecordButton
                      target={{
                        volume: 'vol2',
                        lessonId: lesson.id,
                        lessonNumber: lesson.lessonNumber,
                        lessonTitle: `${lesson.title} (${lesson.topicTitle})`,
                        sectionTitle: `Đoạn ${idx + 1}`,
                        targetText: paragraph
                      }}
                      onOpenRecorder={onOpenVoiceRecorder}
                      size="sm"
                      variant="emerald"
                      label={`Thu âm đoạn ${idx + 1}`}
                    />
                  )}

                  <button
                    onClick={() => speechService.speak(paragraph)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-xl border border-emerald-200 transition-all shadow-xs cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Đọc đoạn {idx + 1}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Vocabulary helper */}
          {lesson.reading.vocabulary && lesson.reading.vocabulary.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3">
                📚 Giải nghĩa từ ngữ mới:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {lesson.reading.vocabulary.map((vocab, vIdx) => (
                  <div
                    key={vIdx}
                    onClick={() => speechService.speak(vocab.word)}
                    className="cursor-pointer p-3.5 rounded-2xl bg-emerald-50/40 hover:bg-emerald-100/60 border border-emerald-200 transition-colors"
                  >
                    <div className="font-bold text-emerald-950 text-base font-sgk-title flex items-center justify-between">
                      <span>{vocab.word}</span>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-xs text-slate-600 mt-1 leading-normal font-sgk">
                      {vocab.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phonics focus if available */}
          {lesson.reading.phonicsFocus && (
            <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center gap-3">
              <span className="text-xs font-bold text-blue-900">Vần mới cần chú ý:</span>
              <div className="flex gap-2">
                {lesson.reading.phonicsFocus.map((ph, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => speechService.speak(`Vần ${ph}`)}
                    className="px-3 py-1 bg-white text-blue-900 font-bold text-xs rounded-xl border border-blue-300 shadow-xs hover:bg-blue-600 hover:text-white transition-colors cursor-pointer font-sgk"
                  >
                    {ph} 🔊
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            3. TRẢ LỜI CÂU HỎI ĐỌC HIỂU
           ======================================================== */}
        {lesson.comprehensionQuestions && lesson.comprehensionQuestions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-emerald-100">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-black text-slate-900 font-sgk-title">
                Trả lời câu hỏi đọc hiểu văn bản
              </h3>
            </div>

            <div className="space-y-4">
              {lesson.comprehensionQuestions.map((q, qIdx) => {
                const userSelected = selectedAnswers[q.id];
                const isShowingAnswer = showAnswerFor[q.id];

                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-base sm:text-lg font-bold text-slate-900 mb-3 font-reading">
                      Câu {qIdx + 1}: {q.question}
                    </div>

                    {/* If multiple choice options exist */}
                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectQuiz(q.id, oIdx, q.correctOption)}
                            className={`p-3.5 rounded-xl text-left text-sm font-semibold transition-all border font-reading cursor-pointer ${
                              userSelected === oIdx
                                ? oIdx === q.correctOption
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                                  : 'bg-rose-100 border-rose-400 text-rose-950'
                                : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{opt}</span>
                              {userSelected === oIdx && oIdx === q.correctOption && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Sample answer toggle */}
                    {q.sampleAnswer && (
                      <div>
                        <button
                          onClick={() => setShowAnswerFor(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline decoration-dashed cursor-pointer"
                        >
                          {isShowingAnswer ? 'Ẩn gợi ý trả lời' : '💡 Xem câu trả lời mẫu'}
                        </button>
                        {isShowingAnswer && (
                          <div className="mt-2 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-sm sm:text-base text-emerald-950 font-reading leading-relaxed">
                            {q.sampleAnswer}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            4. LUYỆN TẬP: CHÍNH TẢ & TẬP CHÉP
           ======================================================== */}
        {lesson.practice && (
          <div className="bg-purple-50/50 rounded-3xl p-6 sm:p-7 shadow-sm border border-purple-200 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-purple-200">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-purple-700" />
                <h3 className="text-xl font-black text-purple-950 font-sgk-title">
                  Luyện tập chính tả & Tập chép
                </h3>
              </div>

              {lesson.practice.dictationText && (
                <button
                  id="open-dictation-board-btn"
                  onClick={() => onOpenWritingPractice(lesson.practice!.dictationText!)}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Mở Vở Ô Ly Tập Chép</span>
                  <span>✍️</span>
                </button>
              )}
            </div>

            {/* Dictation Text */}
            {lesson.practice.dictationText && (
              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                    📝 Đoạn văn / câu tập chép vào vở:
                  </span>
                  <button
                    onClick={() => speechService.speak(lesson.practice!.dictationText!)}
                    className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Đọc đoạn chép
                  </button>
                </div>
                <p className="text-xl sm:text-2xl text-slate-800 font-reading leading-relaxed bg-purple-50/40 p-4 rounded-xl border border-purple-100">
                  "{lesson.practice.dictationText}"
                </p>
              </div>
            )}

            {/* Spelling exercise */}
            {lesson.practice.spellingExercise && (
              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs">
                <div className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2">
                  ✨ {lesson.practice.spellingExercise.prompt}
                </div>

                {lesson.practice.spellingExercise.pairs && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {lesson.practice.spellingExercise.pairs.map((pair, pIdx) => (
                      <div key={pIdx} className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-between">
                        <span className="text-base font-bold text-slate-800 font-reading">
                          {pair.textWithBlank}
                        </span>
                        <div className="flex gap-1.5">
                          {pair.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setSpellingSelections(prev => ({ ...prev, [pIdx]: opt }));
                                if (opt === pair.answer) {
                                  speechService.playSoundEffect('success');
                                  onAddStar();
                                } else {
                                  speechService.playSoundEffect('pop');
                                }
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer font-sgk ${
                                spellingSelections[pIdx] === opt
                                  ? opt === pair.answer
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-rose-500 text-white'
                                  : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            LESSON COMPLETION & BADGE REWARD BANNER (VOL 2)
           ======================================================== */}
        <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 rounded-3xl p-5 sm:p-7 border-2 border-emerald-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-sm shrink-0">
              {isCompleted ? '🎖️' : '📖'}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-emerald-950 font-serif">
                {isCompleted ? 'Bé đã hoàn thành xuất sắc bài đọc hiểu Tập 2 này!' : 'Bé đã đọc hiểu và trả lời xong các câu hỏi?'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 font-medium mt-0.5">
                {isCompleted
                  ? 'Thành tích đã được cộng vào Bảng Vàng Danh Hiệu của bé!'
                  : 'Bấm nút để đánh dấu hoàn thành và nhận Ngôi Sao Thưởng nhé!'}
              </p>
            </div>
          </div>

          <button
            id="vol2-bottom-toggle-complete-btn"
            onClick={handleToggleCompletion}
            className={`px-5 py-3 rounded-2xl font-black text-sm sm:text-base shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 ${
              isCompleted
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
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

      {/* Footer Nav */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-emerald-200">
        <button
          onClick={onPreviousLesson}
          disabled={!hasPrevious}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            hasPrevious
              ? 'bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 shadow-xs'
              : 'opacity-40 cursor-not-allowed text-slate-400'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bài trước</span>
        </button>

        <span className="text-xs font-bold text-emerald-950">
          {lesson.topicTitle} • Bài {lesson.lessonNumber}
        </span>

        <button
          onClick={onNextLesson}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all ${
            hasNext
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
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
