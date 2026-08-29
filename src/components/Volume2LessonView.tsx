import React, { useState, useEffect } from 'react';
import { Volume2Lesson, RecordingTargetInfo, AchievementBadge } from '../types';
import { speechService } from '../services/speechService';
import { lessonStorageService } from '../services/lessonStorageService';
import { teacherAudioService } from '../services/teacherAudioService';
import { achievementService } from '../services/achievementService';
import { userProfileService } from '../services/userProfileService';
import { TeacherAudioTarget } from './TeacherAudioRecorderModal';
import {
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  PenTool,
  HelpCircle,
  Lightbulb,
  Edit3,
  Mic,
  Type,
  Check
} from 'lucide-react';

interface Volume2LessonViewProps {
  lesson: Volume2Lesson;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onOpenWritingPractice: (text: string) => void;
  onAddStar: () => void;
  onUnlockBadges?: (badges: AchievementBadge[]) => void;
  onEditLesson?: () => void;
  onOpenVoiceRecorder?: (target: RecordingTargetInfo) => void;
  onOpenTeacherRecorder?: (target: TeacherAudioTarget) => void;
  onBackToList?: () => void;
}

export const Volume2LessonView: React.FC<Volume2LessonViewProps> = ({
  lesson,
  onPreviousLesson,
  onNextLesson,
  hasPrevious,
  hasNext,
  onOpenWritingPractice,
  onAddStar,
  onUnlockBadges,
  onEditLesson,
  onOpenVoiceRecorder,
  onOpenTeacherRecorder,
  onBackToList
}) => {
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'huge'>('normal');
  const [isTeacherVoiceEditMode, setIsTeacherVoiceEditMode] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [showAnswerFor, setShowAnswerFor] = useState<{ [key: string]: boolean }>({});
  const [spellingSelections, setSpellingSelections] = useState<{ [key: number]: string }>({});
  const [, setAudioVersion] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(() => achievementService.isLessonCompleted('vol2', lesson.id));

  // Sync completion state when lesson changes
  useEffect(() => {
    setIsCompleted(achievementService.isLessonCompleted('vol2', lesson.id));
    setSelectedAnswers({});
    setShowAnswerFor({});
  }, [lesson.id]);

  // Subscribe to teacher audio changes
  useEffect(() => {
    const unsub = teacherAudioService.subscribe(() => {
      setAudioVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const isCustomized = lessonStorageService.isVolume2Customized(lesson.id);

  const handleToggleCompletion = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    const { newlyCompleted, newBadges } = achievementService.setLessonCompleted('vol2', lesson.id, nextState);
    
    // Sync to user profile & class statistics in real time
    userProfileService.recordLessonCompletion(`vol2_${lesson.id}`, nextState, {
      volume: 'vol2',
      lessonNumber: lesson.lessonNumber,
      lessonTitle: `Bài ${lesson.lessonNumber}: ${lesson.title}`,
      practiceType: 'reading'
    });

    if (newlyCompleted) {
      speechService.playSoundEffect('fanfare');
      speechService.speak('Hoan hô bé đã hoàn thành bài tập đọc này!');
      onAddStar();

      if (newBadges.length > 0 && onUnlockBadges) {
        onUnlockBadges(newBadges);
      }
    } else {
      speechService.playSoundEffect('pop');
    }
  };

  const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string) => {
    e.stopPropagation();
    if (onOpenTeacherRecorder) {
      onOpenTeacherRecorder({
        targetText: text,
        volume: 'vol2',
        lessonId: lesson.id,
        lessonNumber: lesson.lessonNumber,
        lessonTitle: `${lesson.title} (${lesson.topicTitle})`,
        sectionTitle
      });
    }
  };

  const handleSelectQuiz = (qId: string, optIdx: number, correctOpt: number | undefined) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIdx }));
    if (correctOpt !== undefined && optIdx === correctOpt) {
      const alreadyAnswered = selectedAnswers[qId] === correctOpt;
      if (!alreadyAnswered) {
        const nextAnswers = { ...selectedAnswers, [qId]: optIdx };
        const questions = lesson.comprehensionQuestions || [];
        const answeredCount = questions.filter(
          q => q.correctOption !== undefined && nextAnswers[q.id] === q.correctOption
        ).length;

        if (questions.length > 0 && answeredCount === questions.length) {
          speechService.playSoundEffect('sectionComplete');
          setTimeout(() => {
            speechService.speak('Hoan hô bé! Bé đã trả lời đúng toàn bộ câu hỏi đọc hiểu!');
          }, 500);
        } else {
          speechService.playSoundEffect('correct');
        }
        onAddStar();
      } else {
        speechService.playSoundEffect('correct');
      }
    } else {
      speechService.playSoundEffect('tryAgain');
    }
  };

  const handleReadFullArticle = () => {
    const fullText = `${lesson.reading.title}. Tác giả: ${lesson.reading.author || 'Sách giáo khoa'}. ${lesson.reading.content.join(' ')}`;
    speechService.speak(fullText);
  };

  // Dynamic font sizing
  const readingFontSizeClass = fontSizeMode === 'huge'
    ? 'text-2xl sm:text-3xl leading-[2.3]'
    : fontSizeMode === 'large'
    ? 'text-xl sm:text-2xl leading-[2.2]'
    : 'text-lg sm:text-xl leading-[2.1]';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 font-sgk">
      
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {onBackToList ? (
          <button
            id="back-to-vol2-list-btn"
            onClick={onBackToList}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-700 hover:text-teal-800 bg-white hover:bg-teal-50/70 border border-teal-200/80 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại chủ điểm Tập 2</span>
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
                fontSizeMode === 'normal' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Cỡ chữ chuẩn SGK"
            >
              Chuẩn
            </button>
            <button
              onClick={() => setFontSizeMode('large')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'large' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Cỡ chữ Lớn"
            >
              Lớn
            </button>
            <button
              onClick={() => setFontSizeMode('huge')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontSizeMode === 'huge' ? 'bg-teal-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Cỡ chữ Rất Lớn"
            >
              Rất lớn
            </button>
          </div>

          {/* Toggle Teacher Voice Recording / Editing Mode */}
          {onOpenTeacherRecorder && (
            <button
              id="toggle-vol2-teacher-voice-mode-btn"
              onClick={() => {
                setIsTeacherVoiceEditMode(!isTeacherVoiceEditMode);
                speechService.playSoundEffect('pop');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer border ${
                isTeacherVoiceEditMode
                  ? 'bg-teal-700 hover:bg-teal-800 text-white border-teal-800 ring-2 ring-teal-300'
                  : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-300/80'
              }`}
              title="Bật/tắt chế độ cho phép Giáo viên thu âm giọng mẫu chuẩn cho từng đoạn văn, từ vựng và câu hỏi"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isTeacherVoiceEditMode ? 'Đang sửa giọng GV' : 'Sửa giọng mẫu GV'}</span>
            </button>
          )}

          {/* Edit Lesson Button */}
          {onEditLesson && (
            <button
              id="edit-current-vol2-lesson-btn"
              onClick={onEditLesson}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Chỉnh sửa bài học Tập 2 này"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Sửa bài</span>
            </button>
          )}

          {/* Mark completed button */}
          <button
            id="toggle-vol2-completed-btn"
            onClick={handleToggleCompletion}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer border ${
              isCompleted
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400'
                : 'bg-white hover:bg-teal-50 text-slate-700 border-slate-200'
            }`}
            title={isCompleted ? 'Bé đã hoàn thành bài tập đọc này' : 'Bấm để đánh dấu đã đọc xong'}
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
      <div className="bg-white rounded-[28px] sm:rounded-[32px] shadow-lg shadow-teal-900/5 border border-teal-200/70 overflow-hidden relative border-t-4 border-t-teal-600">
        <div className="p-5 sm:p-8 lg:p-10 space-y-8 sm:space-y-10">
          
          {/* Lesson Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded-full">
                {lesson.topicTitle}
              </span>
              {isCustomized && (
                <span className="bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-teal-600 fill-teal-500" />
                  Đã tùy chỉnh bởi GV
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
              Bài {lesson.lessonNumber}: {lesson.title}
            </h1>
            <p className="text-sm font-medium text-teal-700 italic mt-1 font-serif">
              Trang {lesson.pageRange} • Tập 2
            </p>
          </div>

          {/* 1. KHỞI ĐỘNG */}
          {lesson.warmup && (
            <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Khởi động & Trò chuyện</span>
              </div>
              <p className="text-base text-slate-800 font-serif leading-relaxed">
                {lesson.warmup.prompt}
              </p>
            </div>
          )}

          {/* 2. BÀI ĐỌC CHÍNH */}
          <div className="bg-[#f2faf7] rounded-3xl p-5 sm:p-7 border border-teal-100 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  1
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-teal-800 font-serif">
                    {lesson.reading.title}
                  </h2>
                  {lesson.reading.author && (
                    <p className="text-xs text-slate-500 font-medium">
                      Tác giả: {lesson.reading.author}
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  id="speak-vol2-reading-btn"
                  onClick={handleReadFullArticle}
                  className="w-9 h-9 rounded-xl border border-slate-200/80 bg-white hover:bg-teal-50 text-teal-600 flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  title="Nghe đọc toàn bộ bài đọc"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                  <button
                    onClick={(e) => handleTeacherRecordClick(e, `${lesson.reading.title}. ${lesson.reading.content.join(' ')}`, 'Toàn bộ bài đọc')}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Thu âm giọng đọc mẫu cô giáo cho cả bài đọc"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Thu mẫu cả bài</span>
                  </button>
                )}

                {onOpenVoiceRecorder && (
                  <button
                    id="record-vol2-reading-btn"
                    onClick={() => {
                      onOpenVoiceRecorder({
                        volume: 'vol2',
                        lessonId: lesson.id,
                        lessonNumber: lesson.lessonNumber,
                        lessonTitle: `${lesson.title} (${lesson.topicTitle})`,
                        sectionTitle: 'Toàn bộ bài đọc',
                        targetText: `${lesson.reading.title}\n\n${lesson.reading.content.join('\n\n')}`,
                        referenceAudioText: `${lesson.reading.title}. ${lesson.reading.content.join(' ')}`
                      });
                    }}
                    className="flex items-center gap-1.5 bg-[#0d9488] hover:bg-[#0f766e] active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                    title="Ghi âm và nộp bài đọc"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Luyện đọc</span>
                  </button>
                )}
              </div>
            </div>

            {/* Paragraph Cards */}
            <div className="space-y-3 pt-1">
              {lesson.reading.content.map((paragraph, idx) => {
                const hasTeacherAudio = teacherAudioService.hasAudioForText(paragraph);
                return (
                  <div
                    key={idx}
                    onClick={() => speechService.speak(paragraph)}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-teal-300 shadow-2xs hover:shadow-xs transition-all relative pl-6 flex items-center justify-between group cursor-pointer"
                    title={hasTeacherAudio ? `Giọng đọc mẫu Cô giáo: ${paragraph}` : `Bấm để nghe đọc đoạn này`}
                  >
                    <div className="absolute left-2.5 top-3.5 bottom-3.5 w-1.5 bg-teal-500 rounded-full group-hover:w-2 transition-all" />
                    
                    <div className="flex-1 pr-2">
                      <p className={`font-medium text-slate-800 font-serif leading-relaxed pl-2 whitespace-pre-line ${readingFontSizeClass}`}>
                        {paragraph}
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
                          onClick={(e) => handleTeacherRecordClick(e, paragraph, `Đoạn ${idx + 1}: ${paragraph.substring(0, 30)}...`)}
                          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            hasTeacherAudio ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          } ${isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                          title={`Thu âm giọng mẫu cho đoạn ${idx + 1}`}
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                      )}
                      <div className="opacity-40 group-hover:opacity-100 transition-opacity text-teal-600">
                        <Volume2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vocabulary words */}
            {lesson.reading.vocabulary && lesson.reading.vocabulary.length > 0 && (
              <div className="pt-3 border-t border-teal-100">
                <div className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">
                  Giải nghĩa từ:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lesson.reading.vocabulary.map((vocab, vIdx) => {
                    const hasTeacherAudio = teacherAudioService.hasAudioForText(vocab.word);
                    return (
                      <div
                        key={vIdx}
                        onClick={() => speechService.speak(vocab.word)}
                        className="p-3 rounded-xl bg-white border border-teal-100 hover:border-teal-300 transition-all cursor-pointer shadow-2xs flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-teal-900 text-sm font-serif flex items-center gap-1.5">
                            <span>{vocab.word}</span>
                            {hasTeacherAudio && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">GV</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">{vocab.meaning}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                            <button
                              onClick={(e) => handleTeacherRecordClick(e, vocab.word, `Từ vựng: ${vocab.word}`)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                hasTeacherAudio ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              } ${isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                              title={`Thu âm giọng mẫu cho từ "${vocab.word}"`}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. TRẢ LỜI CÂU HỎI ĐỌC HIỂU */}
          {lesson.comprehensionQuestions && lesson.comprehensionQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm font-serif shadow-2xs">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-blue-600 font-serif">
                  Trả lời câu hỏi
                </h2>
              </div>

              <div className="space-y-3">
                {lesson.comprehensionQuestions.map((q, qIdx) => {
                  const userSelected = selectedAnswers[q.id];
                  const isShowingAnswer = showAnswerFor[q.id];

                  return (
                    <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="text-sm sm:text-base font-bold text-slate-800 font-serif">
                        Câu {qIdx + 1}: {q.question}
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectQuiz(q.id, oIdx, q.correctOption)}
                              className={`p-3 rounded-xl text-left text-xs sm:text-sm font-semibold transition-all border font-serif cursor-pointer ${
                                userSelected === oIdx
                                  ? oIdx === q.correctOption
                                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                                    : 'bg-rose-100 border-rose-400 text-rose-950'
                                  : 'bg-white hover:bg-teal-50 border-slate-200 text-slate-800'
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

                      {q.sampleAnswer && (
                        <div>
                          <button
                            onClick={() => setShowAnswerFor(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                            className="text-xs font-bold text-teal-700 hover:text-teal-900 underline decoration-dashed cursor-pointer"
                          >
                            {isShowingAnswer ? 'Ẩn câu trả lời mẫu' : '💡 Xem câu trả lời mẫu'}
                          </button>
                          {isShowingAnswer && (
                            <div className="mt-2 p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs sm:text-sm text-teal-950 font-serif leading-relaxed">
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

          {/* 4. LUYỆN VIẾT CHÍNH TẢ */}
          {lesson.practice && lesson.practice.dictationText && (
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3">
                <PenTool className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-900 uppercase">Tập chép:</span>
                <span className="text-sm font-serif font-bold text-purple-950">
                  "{lesson.practice.dictationText.slice(0, 40)}..."
                </span>
              </div>
              <button
                onClick={() => onOpenWritingPractice(lesson.practice!.dictationText!)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Mở Vở Ô Ly Tập Chép</span>
                <span>✍️</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between gap-4 mt-6">
        {hasPrevious && onPreviousLesson ? (
          <button
            onClick={onPreviousLesson}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>Bài trước</span>
          </button>
        ) : <div />}

        {hasNext && onNextLesson && (
          <button
            onClick={onNextLesson}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer ml-auto"
          >
            <span>Bài tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
