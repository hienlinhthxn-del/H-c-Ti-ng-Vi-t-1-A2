import React, { useState } from 'react';
import { lessonStorageService } from '../services/lessonStorageService';
import { achievementService } from '../services/achievementService';
import { Volume1Lesson } from '../types';
import { BookOpen, Sparkles, Search, Volume2, Filter, Edit3, CheckCircle2, Trophy, Award } from 'lucide-react';
import { speechService } from '../services/speechService';

interface Volume1GridProps {
  onSelectLesson: (lesson: Volume1Lesson) => void;
  onEditLesson?: (lesson: Volume1Lesson) => void;
  searchQuery: string;
}

export const Volume1Grid: React.FC<Volume1GridProps> = ({ onSelectLesson, onEditLesson, searchQuery }) => {
  const [filterPart, setFilterPart] = useState<'all' | 'part1' | 'part2' | 'part3' | 'reviews' | 'completed' | 'uncompleted' | 'customized'>('all');

  const allLessons = lessonStorageService.getVolume1Lessons();
  const completedCount = allLessons.filter(l => achievementService.isLessonCompleted('vol1', l.id)).length;
  const progressPercent = Math.round((completedCount / allLessons.length) * 100);

  const filteredLessons = allLessons.filter(lesson => {
    const isCompleted = achievementService.isLessonCompleted('vol1', lesson.id);

    // Search query filter
    const matchesSearch = !searchQuery || (
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.lessonNumber.toString() === searchQuery.trim() ||
      lesson.part1_Letters.letters.some(l => l.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lesson.part2_SyllablesAndWords.words.some(w => w.word.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lesson.part3_SentenceAndPractice.readingPassage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!matchesSearch) return false;

    // Filter
    if (filterPart === 'completed') return isCompleted;
    if (filterPart === 'uncompleted') return !isCompleted;
    if (filterPart === 'part1') return lesson.lessonNumber >= 1 && lesson.lessonNumber <= 30;
    if (filterPart === 'part2') return lesson.lessonNumber >= 31 && lesson.lessonNumber <= 60;
    if (filterPart === 'part3') return lesson.lessonNumber >= 61 && lesson.lessonNumber <= 83;
    if (filterPart === 'reviews') return lesson.type === 'review';
    if (filterPart === 'customized') return lessonStorageService.isVolume1Customized(lesson.id);

    return true;
  });

  const customCount = allLessons.filter(l => lessonStorageService.isVolume1Customized(l.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero / Overview Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
                Chương trình Học kì 1
              </span>
              {completedCount > 0 && (
                <span className="bg-emerald-400 text-emerald-950 font-black px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã đọc xong {completedCount}/{allLessons.length} bài</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight mt-2">
              Tập 1: Toàn Bộ 83 Bài Học Âm - Chữ - Vần
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Mỗi bài học được xây dựng chuẩn mực theo 3 phần: (1) Nhận biết âm/chữ, (2) Đọc âm vần, ghép tiếng và từ ngữ, (3) Đọc câu/đoạn văn, Luyện viết & Luyện nói.
            </p>

            {/* Progress Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs font-bold text-amber-100 mb-1">
                <span>Tiến độ hoàn thành Tập 1</span>
                <span>{completedCount}/{allLessons.length} bài ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-300 to-emerald-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
              <div className="text-2xl sm:text-3xl font-black">{allLessons.length}</div>
              <div className="text-xs text-amber-100 font-bold">Bài học đầy đủ</div>
            </div>
            <div className="bg-emerald-500/30 backdrop-blur-md p-4 rounded-2xl border border-emerald-300/40 text-center min-w-[100px]">
              <div className="text-2xl sm:text-3xl font-black text-emerald-200">{completedCount}</div>
              <div className="text-xs text-emerald-100 font-bold">Đã hoàn thành</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/20 text-xs sm:text-sm font-bold">
          {[
            { id: 'all', label: 'Tất cả 83 bài' },
            { id: 'part1', label: 'Bài 1 - 30 (Âm chữ cái & ghép)' },
            { id: 'part2', label: 'Bài 31 - 60 (Vần đơn & đôi)' },
            { id: 'part3', label: 'Bài 61 - 83 (Vần phức & Ôn tập)' },
            { id: 'completed', label: `✅ Đã đọc xong (${completedCount})` },
            { id: 'uncompleted', label: `📖 Chưa đọc (${allLessons.length - completedCount})` },
            { id: 'reviews', label: '⭐ Ôn tập & Kể chuyện' },
            ...(customCount > 0 ? [{ id: 'customized', label: `✨ Đã tùy chỉnh (${customCount})` }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              id={`filter-vol1-${tab.id}`}
              onClick={() => setFilterPart(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterPart === tab.id
                  ? 'bg-white text-orange-600 shadow-md scale-102'
                  : 'bg-black/10 hover:bg-black/20 text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Lessons */}
      {filteredLessons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-sm max-w-md mx-auto">
          <span className="text-4xl mb-3 block">🔍</span>
          <h3 className="text-lg font-bold text-amber-950 font-serif">Không tìm thấy bài học phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng thử tìm kiếm với từ khóa khác như "bài 5", "ong", "hoa đào"...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredLessons.map((lesson) => {
            const isCustomized = lessonStorageService.isVolume1Customized(lesson.id);
            const isCompleted = achievementService.isLessonCompleted('vol1', lesson.id);
            return (
              <div
                key={lesson.id}
                id={`lesson-card-${lesson.lessonNumber}`}
                onClick={() => {
                  speechService.playSoundEffect('pop');
                  onSelectLesson(lesson);
                }}
                className={`group cursor-pointer bg-white hover:bg-gradient-to-b hover:from-white hover:to-orange-50/50 p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                    : 'border-amber-200/80 hover:border-orange-400 hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-8 h-8 rounded-2xl font-black text-xs flex items-center justify-center transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'bg-orange-100 text-orange-800 group-hover:bg-orange-500 group-hover:text-white'
                      }`}>
                        {lesson.lessonNumber}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đã đọc</span>
                        </span>
                      )}
                      {isCustomized && (
                        <span className="text-[10px] font-black bg-amber-100 text-orange-700 px-2 py-0.5 rounded-md border border-amber-300">
                          ✨ Tùy chỉnh
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Trang {lesson.pageRange}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-amber-950 font-serif group-hover:text-orange-600 transition-colors">
                    {lesson.title}
                  </h3>

                  {/* Phonics letters tags */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    {lesson.part1_Letters.letters.map((lettr, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold font-serif"
                      >
                        {lettr}
                      </span>
                    ))}
                  </div>

                  {/* Sample words preview */}
                  <p className="text-xs text-slate-500 line-clamp-1 italic">
                    {lesson.part2_SyllablesAndWords.words.map(w => w.word).join(', ')}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
                  <span className="flex items-center gap-1">
                    <span>{isCompleted ? 'Đọc lại' : 'Học bài'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>

                  {onEditLesson && (
                    <button
                      id={`edit-btn-${lesson.lessonNumber}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        speechService.playSoundEffect('pop');
                        onEditLesson(lesson);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-orange-500 text-amber-800 hover:text-white border border-amber-200 hover:border-orange-500 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                      title="Chỉnh sửa nội dung bài học"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Sửa bài</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
