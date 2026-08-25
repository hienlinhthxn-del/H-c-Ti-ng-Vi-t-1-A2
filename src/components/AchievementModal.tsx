import React, { useState } from 'react';
import { AchievementBadge } from '../types';
import { achievementService } from '../services/achievementService';
import { speechService } from '../services/speechService';
import { Trophy, Award, Star, CheckCircle2, Lock, Sparkles, X, Printer, Volume2, BookOpen, Feather, Mic } from 'lucide-react';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  starsCount: number;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  starsCount
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked' | 'certificate'>('all');
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('tv1_student_name') || 'Bé Chăm Ngoan';
  });
  const [selectedBadgeForDetail, setSelectedBadgeForDetail] = useState<AchievementBadge | null>(null);

  if (!isOpen) return null;

  const allBadges = achievementService.getAllBadges();
  const titleInfo = achievementService.getCurrentTitle();
  const stats = achievementService.getStats();

  const unlockedBadges = allBadges.filter(b => !!b.unlockedAt);
  const lockedBadges = allBadges.filter(b => !b.unlockedAt);

  const displayedBadges = activeTab === 'all'
    ? allBadges
    : activeTab === 'unlocked'
    ? unlockedBadges
    : activeTab === 'locked'
    ? lockedBadges
    : [];

  const handleSaveStudentName = (name: string) => {
    setStudentName(name);
    localStorage.setItem('tv1_student_name', name);
  };

  const handleSpeakCheer = () => {
    speechService.speak(
      `Chào bé ${studentName}! Hiện tại bé đang giữ danh hiệu ${titleInfo.title} với ${stats.unlockedBadges} huy hiệu danh dự và ${stats.totalCompleted} bài học đã hoàn thành. Cô khen ngợi tinh thần chăm chỉ của bé!`
    );
  };

  const handleBadgeClick = (badge: AchievementBadge) => {
    setSelectedBadgeForDetail(badge);
    if (badge.unlockedAt) {
      speechService.playSoundEffect('success');
      speechService.speak(`Huy hiệu ${badge.title}: ${badge.subtitle}. ${badge.description}`);
    } else {
      speechService.playSoundEffect('pop');
      speechService.speak(`Huy hiệu ${badge.title}. Yêu cầu: ${badge.subtitle}. Cố gắng lên nhé!`);
    }
  };

  // Helper to compute progress count for a badge
  const getBadgeCurrentProgress = (badge: AchievementBadge) => {
    switch (badge.requirementType) {
      case 'lessons_completed':
        return Math.min(stats.totalCompleted, badge.requiredCount);
      case 'vol1_lessons':
        return Math.min(stats.vol1Completed, badge.requiredCount);
      case 'vol2_lessons':
        return Math.min(stats.vol2Completed, badge.requiredCount);
      case 'practice_count':
        return Math.min(stats.practiceCount, badge.requiredCount);
      case 'recordings_count':
        return Math.min(stats.recordingsCount, badge.requiredCount);
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Header / Top Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 sm:p-6 text-white relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4 pointer-events-none">
            <Trophy className="w-48 h-48" />
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
                🏆
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                  Bảng Vàng Danh Hiệu & Huy Hiệu Của Bé
                </h2>
                <p className="text-xs sm:text-sm text-amber-100 font-medium">
                  Vinh danh thành tích học tập, đọc bài và rèn luyện môn Tiếng Việt 1
                </p>
              </div>
            </div>

            <button
              id="close-achievement-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Academic Rank Card */}
          <div className="mt-4 bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white text-3xl flex items-center justify-center shadow-md shrink-0">
                {titleInfo.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                    Cấp độ {titleInfo.level}
                  </span>
                  <span className="text-xs text-amber-100 font-bold">
                    Danh hiệu hiện tại:
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-white mt-0.5">
                  {titleInfo.title}
                </h3>
                <p className="text-xs text-amber-100">
                  {titleInfo.subtitle}
                </p>
              </div>
            </div>

            {/* Quick stats and Voice Cheer */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                id="voice-cheer-btn"
                onClick={handleSpeakCheer}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-orange-700 hover:bg-amber-50 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                title="Nghe lời khen thưởng từ cô giáo"
              >
                <Volume2 className="w-4 h-4 text-orange-600 animate-pulse" />
                <span>Cô giáo khen bé</span>
              </button>

              <div className="bg-black/20 px-3 py-1.5 rounded-xl text-center border border-white/10">
                <div className="text-sm font-black text-amber-200">{stats.unlockedBadges}/{stats.totalBadges}</div>
                <div className="text-[10px] text-white/80 font-bold">Huy hiệu</div>
              </div>
              <div className="bg-black/20 px-3 py-1.5 rounded-xl text-center border border-white/10">
                <div className="text-sm font-black text-amber-200">{stats.totalCompleted}</div>
                <div className="text-[10px] text-white/80 font-bold">Bài đã đọc</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-amber-50/70 border-b border-amber-200 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar shrink-0">
          <button
            id="tab-badges-all"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all' ? 'bg-amber-500 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-100'
            }`}
          >
            🌟 Tất cả huy hiệu ({allBadges.length})
          </button>
          <button
            id="tab-badges-unlocked"
            onClick={() => setActiveTab('unlocked')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'unlocked' ? 'bg-emerald-600 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-100'
            }`}
          >
            ✅ Đã đạt được ({unlockedBadges.length})
          </button>
          <button
            id="tab-badges-locked"
            onClick={() => setActiveTab('locked')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'locked' ? 'bg-orange-500 text-white shadow-xs' : 'text-amber-950 hover:bg-amber-100'
            }`}
          >
            🎯 Đang phấn đấu ({lockedBadges.length})
          </button>
          <button
            id="tab-badges-certificate"
            onClick={() => setActiveTab('certificate')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'certificate' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-950 hover:bg-rose-100 bg-rose-50 border border-rose-200'
            }`}
          >
            📜 Giấy Khen Điện Tử
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">

          {/* ========================================================
              TAB: BADGES GRID (ALL / UNLOCKED / LOCKED)
             ======================================================== */}
          {activeTab !== 'certificate' && (
            <div>
              {displayedBadges.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs max-w-sm mx-auto my-6">
                  <div className="text-4xl mb-3">🐣</div>
                  <h4 className="font-bold text-slate-800 font-serif">Chưa có huy hiệu nào ở mục này</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Hãy đọc bài học và thu âm đọc bài để mở khóa thật nhiều huy hiệu danh giá nhé!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {displayedBadges.map((badge) => {
                    const isUnlocked = !!badge.unlockedAt;
                    const curProgress = getBadgeCurrentProgress(badge);
                    const percent = Math.min(100, Math.round((curProgress / badge.requiredCount) * 100));

                    return (
                      <div
                        key={badge.id}
                        onClick={() => handleBadgeClick(badge)}
                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isUnlocked
                            ? 'bg-white hover:border-amber-400 hover:shadow-md border-amber-200/90'
                            : 'bg-slate-100/70 border-slate-200 opacity-80 hover:opacity-100'
                        }`}
                      >
                        {/* Status Badge Tag */}
                        <div className="flex items-start justify-between gap-2">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs transition-transform group-hover:scale-105 ${
                            isUnlocked ? `bg-gradient-to-br ${badge.color} text-white` : 'bg-slate-200 text-slate-400 grayscale'
                          }`}>
                            {badge.icon}
                          </div>

                          <div className="flex flex-col items-end">
                            {isUnlocked ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Đã đạt
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                                <Lock className="w-3 h-3" />
                                Chưa mở
                              </span>
                            )}
                            <div className="flex items-center gap-0.5 text-[11px] font-black text-amber-600 mt-1">
                              <Star className="w-3 h-3 fill-amber-500" />
                              <span>+{badge.rewardStars} Sao</span>
                            </div>
                          </div>
                        </div>

                        {/* Title & Info */}
                        <div className="my-2.5">
                          <h4 className={`text-base font-black font-serif ${isUnlocked ? 'text-amber-950 group-hover:text-orange-600' : 'text-slate-700'}`}>
                            {badge.title}
                          </h4>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">
                            {badge.subtitle}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {badge.description}
                          </p>
                        </div>

                        {/* Progress Bar (if locked) or Unlock date (if unlocked) */}
                        <div className="pt-2 border-t border-slate-100 mt-1">
                          {isUnlocked ? (
                            <div className="text-[10px] text-emerald-700 font-semibold flex items-center justify-between">
                              <span>🌟 Đã vinh danh</span>
                              <span>Bấm để nghe đọc</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                                <span>Tiến độ: {curProgress}/{badge.requiredCount}</span>
                                <span>{percent}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB: DIGITAL CERTIFICATE OF MERIT (GIẤY KHEN ĐIỆN TỬ)
             ======================================================== */}
          {activeTab === 'certificate' && (
            <div className="space-y-4">
              
              {/* Student Name Input & Print Bar */}
              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-700 shrink-0">Họ và tên học sinh:</span>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => handleSaveStudentName(e.target.value)}
                    placeholder="Nhập tên của bé..."
                    className="px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full sm:w-64"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="print-certificate-btn"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>In / Lưu Giấy Khen</span>
                  </button>
                </div>
              </div>

              {/* Printable Certificate Frame */}
              <div className="relative bg-[#fffdf8] rounded-3xl p-6 sm:p-10 border-8 border-amber-300 shadow-xl overflow-hidden text-center text-slate-800">
                
                {/* Decorative border corners */}
                <div className="absolute top-2 left-2 text-2xl text-amber-400">❖</div>
                <div className="absolute top-2 right-2 text-2xl text-amber-400">❖</div>
                <div className="absolute bottom-2 left-2 text-2xl text-amber-400">❖</div>
                <div className="absolute bottom-2 right-2 text-2xl text-amber-400">❖</div>

                <div className="border-2 border-dashed border-amber-300/80 rounded-2xl p-6 sm:p-8">
                  
                  {/* Top National Emblem / Department Header */}
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-900/80 mb-1">
                    BỘ GIÁO DỤC VÀ ĐÀO TẠO • TIẾNG VIỆT 1 (KNTT)
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 mb-4">
                    CHƯƠNG TRÌNH PHÁT TRIỂN NĂNG LỰC ĐỌC & VIẾT LỚP 1
                  </div>

                  {/* Big Gold Title */}
                  <h2 className="text-2xl sm:text-4xl font-black text-rose-700 font-serif uppercase tracking-tight drop-shadow-xs mb-1">
                    GIẤY CHỨNG NHẬN DANH HIỆU
                  </h2>
                  <div className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-widest mb-6">
                    ★ HỌC SINH CHĂM NGOAN - HỌC GIỎI ★
                  </div>

                  {/* Awardee Name */}
                  <div className="my-4">
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Trân trọng tuyên dương và trao tặng em:</p>
                    <div className="text-2xl sm:text-3xl font-black text-amber-950 font-serif underline decoration-amber-400 decoration-2 underline-offset-8 mt-1">
                      {studentName || 'Bé Chăm Ngoan'}
                    </div>
                  </div>

                  {/* Title & Achievements */}
                  <div className="max-w-xl mx-auto my-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">{titleInfo.icon}</span>
                      <span className="text-lg sm:text-xl font-black text-orange-700 font-serif">
                        Danh hiệu: {titleInfo.title}
                      </span>
                    </div>
                    <p>
                      Đã có thành tích xuất sắc: Hoàn thành <b>{stats.totalCompleted} bài học đọc hiểu</b> ({stats.vol1Completed} bài Tập 1, {stats.vol2Completed} bài Tập 2), xuất sắc thu thập <b>{stats.unlockedBadges} Huy hiệu vinh danh</b> và <b>{starsCount} Ngôi Sao Thưởng</b> môn Tiếng Việt Lớp 1.
                    </p>
                  </div>

                  {/* Signatures & Golden Seal */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-amber-200/60 text-xs text-slate-600">
                    <div className="text-left">
                      <div className="font-bold text-amber-950">GIÁO VIÊN CHỦ NHIỆM</div>
                      <div className="italic text-[11px] text-slate-500 mt-1">Ký và chúc mừng em</div>
                      <div className="text-lg font-script text-slate-700 mt-2">Cô Giáo Lớp 1</div>
                    </div>

                    {/* Golden Ribbon Stamp */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 border-4 border-amber-600 shadow-md flex flex-col items-center justify-center text-amber-950 font-black text-[9px] sm:text-[10px] uppercase text-center p-1 transform rotate-6">
                      <span>★ TIẾNG VIỆT 1 ★</span>
                      <span className="text-base sm:text-lg">🎖️</span>
                      <span>XUẤT SẮC</span>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-amber-950">NGÀY VINH DANH</div>
                      <div className="italic text-[11px] text-slate-500 mt-1">Năm học 2024 - 2025</div>
                      <div className="font-semibold text-slate-700 mt-2">Học kỳ Tiếng Việt 1</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-white px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1 text-amber-900 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Mỗi bài học bạn hoàn thành sẽ giúp mở khóa thêm nhiều Huy Hiệu quý giá!</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Đóng bảng vàng
          </button>
        </div>

      </div>
    </div>
  );
};
