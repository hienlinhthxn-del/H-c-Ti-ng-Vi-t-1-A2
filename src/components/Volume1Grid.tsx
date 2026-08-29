import React, { useState } from 'react';
import { lessonStorageService } from '../services/lessonStorageService';
import { Volume1Lesson } from '../types';
import { BookOpen, Sparkles, Search, Volume2, Filter, Edit3 } from 'lucide-react';
import { speechService } from '../services/speechService';

interface Volume1GridProps {
  onSelectLesson: (lesson: Volume1Lesson) => void;
  onEditLesson?: (lesson: Volume1Lesson) => void;
  searchQuery: string;
}

export const Volume1Grid: React.FC<Volume1GridProps> = ({ onSelectLesson, onEditLesson, searchQuery }) => {
  const [filterPart, setFilterPart] = useState<'all' | 'part1' | 'part2' | 'part3' | 'reviews' | 'customized'>('all');

  const allLessons = lessonStorageService.getVolume1Lessons();

  const filteredLessons = allLessons.filter(lesson => {
    const q = (searchQuery || '').trim().toLowerCase();
    // Search query filter
    const matchesSearch = !q || (
      (lesson.title || '').toLowerCase().includes(q) ||
      lesson.lessonNumber?.toString() === q ||
      (lesson.part1_Letters?.letters || []).some(l => (l || '').toLowerCase().includes(q)) ||
      (lesson.part2_SyllablesAndWords?.words || []).some(w => (w?.word || '').toLowerCase().includes(q)) ||
      (lesson.part3_SentenceAndPractice?.readingPassage || '').toLowerCase().includes(q)
    );

    if (!matchesSearch) return false;

    // Part range filter
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
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
              Chương trình Học kì 1
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight mt-2">
              Tập 1: Toàn Bộ 83 Bài Học Âm - Chữ - Vần
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Mỗi bài học được xây dựng chuẩn mực theo 3 phần: (1) Nhận biết âm/chữ, (2) Đọc âm vần, ghép tiếng và từ ngữ, (3) Đọc câu/đoạn văn, Luyện viết & Luyện nói.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center">
              <div className="text-2xl sm:text-3xl font-black">{allLessons.length}</div>
              <div className="text-xs text-amber-100 font-bold">Bài học đầy đủ</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/20 text-xs sm:text-sm font-bold">
          {[
            { id: 'all', label: 'Tất cả 83 bài' },
            { id: 'part1', label: 'Bài 1 - 30 (Âm chữ cái & âm ghép)' },
            { id: 'part2', label: 'Bài 31 - 60 (Vần đơn & vần đôi)' },
            { id: 'part3', label: 'Bài 61 - 83 (Vần phức & Ôn tập)' },
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
            return (
              <div
                key={lesson.id}
                id={`lesson-card-${lesson.lessonNumber}`}
                onClick={() => {
                  speechService.playSoundEffect('pop');
                  onSelectLesson(lesson);
                }}
                className="group cursor-pointer bg-white hover:bg-gradient-to-b hover:from-white hover:to-orange-50/50 p-5 rounded-3xl border border-amber-200/80 hover:border-orange-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-8 h-8 rounded-2xl bg-orange-100 text-orange-800 font-black text-xs flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        {lesson.lessonNumber}
                      </span>
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
                    <span>Học bài</span>
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
