import React, { useState } from 'react';
import { lessonStorageService } from '../services/lessonStorageService';
import { achievementService } from '../services/achievementService';
import { Volume2Lesson } from '../types';
import { BookCheck, BookOpen, ChevronRight, Sparkles, Edit3, CheckCircle2, Trophy } from 'lucide-react';
import { speechService } from '../services/speechService';

interface Volume2GridProps {
  onSelectLesson: (lesson: Volume2Lesson) => void;
  onEditLesson?: (lesson: Volume2Lesson) => void;
  searchQuery: string;
}

export const Volume2Grid: React.FC<Volume2GridProps> = ({ onSelectLesson, onEditLesson, searchQuery }) => {
  const [activeTopicId, setActiveTopicId] = useState<number>(1);

  const topicGroups = lessonStorageService.getTopicGroups();
  const allVol2Lessons = lessonStorageService.getVolume2Lessons();
  const currentTopic = topicGroups.find(g => g.id === activeTopicId) || topicGroups[0];

  const totalCompletedVol2 = allVol2Lessons.filter(l => achievementService.isLessonCompleted('vol2', l.id)).length;
  const vol2ProgressPercent = Math.round((totalCompletedVol2 / (allVol2Lessons.length || 1)) * 100);

  const filteredLessons = currentTopic.lessons.filter(lesson => {
    if (!searchQuery) return true;
    return (
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.reading.content.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
                Chương trình Học kì 2
              </span>
              {totalCompletedVol2 > 0 && (
                <span className="bg-amber-300 text-amber-950 font-black px-2.5 py-0.5 rounded-full text-xs flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã đọc xong {totalCompletedVol2}/{allVol2Lessons.length} bài</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight mt-2">
              Tập 2: 8 Chủ Điểm Đọc Hiểu & Luyện Viết
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl">
              Rèn luyện năng lực đọc hiểu văn bản, cảm thụ bài thơ, truyện ngụ ngôn, chính tả và kĩ năng sống qua các chủ điểm phong phú.
            </p>

            {/* Progress Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs font-bold text-emerald-100 mb-1">
                <span>Tiến độ hoàn thành Tập 2</span>
                <span>{totalCompletedVol2}/{allVol2Lessons.length} bài ({vol2ProgressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-300 to-emerald-300 rounded-full transition-all duration-500"
                  style={{ width: `${vol2ProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[100px]">
              <div className="text-2xl sm:text-3xl font-black">{allVol2Lessons.length}</div>
              <div className="text-xs text-emerald-100 font-bold">Tổng bài đọc</div>
            </div>
            <div className="bg-amber-400/30 backdrop-blur-md p-4 rounded-2xl border border-amber-300/40 text-center min-w-[100px]">
              <div className="text-2xl sm:text-3xl font-black text-amber-200">{totalCompletedVol2}</div>
              <div className="text-xs text-amber-100 font-bold">Đã đọc xong</div>
            </div>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-white/20 overflow-x-auto pb-1 no-scrollbar">
          {topicGroups.map((group) => {
            const topicCompletedCount = group.lessons.filter(l => achievementService.isLessonCompleted('vol2', l.id)).length;
            return (
              <button
                key={group.id}
                id={`topic-tab-${group.id}`}
                onClick={() => setActiveTopicId(group.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  activeTopicId === group.id
                    ? 'bg-white text-emerald-900 shadow-md scale-102'
                    : 'bg-black/10 hover:bg-black/20 text-white'
                }`}
              >
                <span>{group.icon}</span>
                <span>{group.title.split(':')[0]}</span>
                {topicCompletedCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-emerald-700/60 text-white rounded-full text-[10px]">
                    {topicCompletedCount}/{group.lessons.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Details & Lesson List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-100 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentTopic.icon}</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
                {currentTopic.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {currentTopic.description}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full self-start sm:self-auto">
            {filteredLessons.length} bài đọc
          </span>
        </div>

        {/* Lessons in this Topic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => {
            const isCustomized = lessonStorageService.isVolume2Customized(lesson.id);
            const isCompleted = achievementService.isLessonCompleted('vol2', lesson.id);
            return (
              <div
                key={lesson.id}
                id={`vol2-lesson-card-${lesson.id}`}
                onClick={() => {
                  speechService.playSoundEffect('pop');
                  onSelectLesson(lesson);
                }}
                className={`group cursor-pointer p-5 rounded-3xl transition-all flex flex-col justify-between border ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                    : 'bg-gradient-to-b from-white to-emerald-50/30 hover:to-emerald-100/50 border-emerald-200/80 hover:border-emerald-500 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {lesson.reading.type === 'poem' ? 'Bài thơ' : lesson.reading.type === 'story' ? 'Câu chuyện' : 'Văn bản'}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Đã đọc</span>
                        </span>
                      )}
                      {isCustomized && (
                        <span className="text-[10px] font-black bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md border border-teal-300">
                          ✨ Tùy chỉnh
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">
                      Trang {lesson.pageRange}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 font-serif group-hover:text-emerald-700 transition-colors">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-serif leading-relaxed">
                    "{lesson.reading.content[0]}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span className="flex items-center gap-1">
                    <span>{isCompleted ? 'Học lại' : 'Học bài'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>

                  {onEditLesson && (
                    <button
                      id={`edit-vol2-btn-${lesson.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        speechService.playSoundEffect('pop');
                        onEditLesson(lesson);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                      title="Chỉnh sửa nội dung bài học Tập 2"
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
      </div>

    </div>
  );
};
