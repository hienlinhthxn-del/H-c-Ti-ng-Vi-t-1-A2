import React from 'react';
import { AchievementBadge, AcademicRank, AchievementState } from '../types';
import { achievementService, ACADEMIC_RANKS } from '../services/achievementService';
import { X, Award, Star, BookOpen, Mic, Sparkles, CheckCircle2, Lock, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const state = achievementService.getState();
  const badges = achievementService.getBadgesWithStatus();
  const currentRank = achievementService.getCurrentRank();
  const nextRank = achievementService.getNextRank();

  const totalLessons = state.completedLessonKeys.length;
  const vol1Count = achievementService.getCompletedLessonsCount('vol1');
  const vol2Count = achievementService.getCompletedLessonsCount('vol2');
  const unlockedBadgesCount = badges.filter(b => b.unlockedAt).length;

  // Calculate percentage to next rank
  let progressToNext = 100;
  let lessonsNeeded = 0;
  if (nextRank) {
    const currentMin = currentRank.minCompletedLessons;
    const nextMin = nextRank.minCompletedLessons;
    const progress = totalLessons - currentMin;
    const totalSpan = nextMin - currentMin;
    progressToNext = Math.min(100, Math.max(5, Math.round((progress / totalSpan) * 100)));
    lessonsNeeded = nextMin - totalLessons;
  }

  const triggerCheer = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 sm:p-6 text-white flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-3">
            <div 
              onClick={triggerCheer}
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              title="Bấm để tung pháo hoa chúc mừng!"
            >
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide uppercase bg-black/20 px-2.5 py-0.5 rounded-full">
                  Bảng Vàng Thi Đua & Huy Hiệu
                </span>
                <span className="text-xs font-bold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                  Cấp {currentRank.level}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-serif mt-0.5">
                Thành Tích Học Tập Của Bé
              </h2>
            </div>
          </div>

          <button
            id="close-achievement-modal-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            title="Đóng bảng thành tích"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-gradient-to-b from-amber-50/30 to-white">
          
          {/* CURRENT ACADEMIC RANK HERO BANNER */}
          <div className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-r ${currentRank.color} text-white shadow-lg relative overflow-hidden`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center text-4xl sm:text-5xl shadow-md">
                  {currentRank.badgeIcon}
                </div>
                <div>
                  <span className="text-xs uppercase font-black tracking-widest text-white/80">
                    Danh hiệu hiện tại
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-serif">
                    {currentRank.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 font-medium max-w-md mt-1">
                    {currentRank.description}
                  </p>
                </div>
              </div>

              {/* Progress to next rank */}
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl w-full sm:w-64 border border-white/20 shrink-0">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span>{nextRank ? `Tiến lên: ${nextRank.title}` : 'Đạt cấp độ Tối Đa!'}</span>
                  <span>{progressToNext}%</span>
                </div>
                
                <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-300 to-amber-200 rounded-full transition-all duration-500"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>

                {nextRank && (
                  <p className="text-[11px] text-white/80 mt-1.5 text-center">
                    Cần hoàn thành thêm <strong>{lessonsNeeded} bài đọc</strong> nữa để thăng cấp!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* QUICK STATS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center text-xl shrink-0">
                📚
              </div>
              <div>
                <span className="text-xs text-amber-800 font-bold block">Bài đọc hoàn thành</span>
                <span className="text-xl sm:text-2xl font-black text-amber-950 font-serif">
                  {totalLessons} bài
                </span>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-200/80 text-orange-800 flex items-center justify-center text-xl shrink-0">
                ⭐
              </div>
              <div>
                <span className="text-xs text-orange-800 font-bold block">Sao chăm ngoan</span>
                <span className="text-xl sm:text-2xl font-black text-orange-950 font-serif">
                  {state.starsCount} sao
                </span>
              </div>
            </div>

            <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-200/80 text-rose-800 flex items-center justify-center text-xl shrink-0">
                🎙️
              </div>
              <div>
                <span className="text-xs text-rose-800 font-bold block">Bài thu âm đã nộp</span>
                <span className="text-xl sm:text-2xl font-black text-rose-950 font-serif">
                  {state.totalRecordingsCount} bài
                </span>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-200/80 text-purple-800 flex items-center justify-center text-xl shrink-0">
                🎖️
              </div>
              <div>
                <span className="text-xs text-purple-800 font-bold block">Huy hiệu đạt được</span>
                <span className="text-xl sm:text-2xl font-black text-purple-950 font-serif">
                  {unlockedBadgesCount} / {badges.length}
                </span>
              </div>
            </div>
          </div>

          {/* BADGES SHOWCASE GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎖️</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif">
                  Tủ Huy Hiệu Vinh Danh ({unlockedBadgesCount}/{badges.length} đã mở khóa)
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Chăm chỉ đọc bài để thu thập trọn bộ huy hiệu nhé!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {badges.map((badge) => {
                const isUnlocked = !!badge.unlockedAt;

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border-2 transition-all relative flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/60 border-amber-300 shadow-sm hover:scale-[1.02]'
                        : 'bg-slate-50/80 border-slate-200 opacity-65 grayscale-[40%]'
                    }`}
                  >
                    {/* Badge Icon Bubble */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-300 to-orange-400 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      {badge.icon}
                    </div>

                    {/* Badge Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-black text-slate-900 font-serif line-clamp-1">
                          {badge.title}
                        </h4>
                        {isUnlocked ? (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Đã nhận
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" />
                            Chưa mở
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {badge.description}
                      </p>

                      <div className="mt-2 text-[11px] font-bold text-amber-800">
                        Mục tiêu: {badge.requiredCount} {badge.category === 'recording_count' ? 'bài thu âm' : 'bài học'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ALL RANKS ROADMAP */}
          <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200">
            <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-700" />
              <span>Hành trình các Cấp bậc Danh hiệu</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {ACADEMIC_RANKS.map((rank) => {
                const isCurrent = rank.level === currentRank.level;
                const isPassed = rank.level < currentRank.level;

                return (
                  <div
                    key={rank.level}
                    className={`p-3 rounded-2xl text-center border-2 transition-all ${
                      isCurrent
                        ? 'bg-orange-500 text-white border-orange-600 shadow-md scale-105 ring-2 ring-orange-300'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{rank.badgeIcon}</div>
                    <div className="text-xs font-black line-clamp-1">{rank.title}</div>
                    <div className={`text-[10px] mt-0.5 font-bold ${isCurrent ? 'text-orange-100' : 'text-slate-500'}`}>
                      {rank.minCompletedLessons === 0 ? 'Khởi đầu' : `Từ ${rank.minCompletedLessons} bài`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-amber-100 bg-amber-50/40 flex items-center justify-between text-xs text-slate-600">
          <span>💡 Hãy kiên trì luyện đọc mỗi ngày để nhận danh hiệu Trạng Nguyên Nhí nhé!</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold transition-all cursor-pointer shadow-md"
          >
            Tiếp tục học bài
          </button>
        </div>

      </div>
    </div>
  );
};
