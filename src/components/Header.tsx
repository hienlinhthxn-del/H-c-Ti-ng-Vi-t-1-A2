import React from 'react';
import { BookOpen, BookCheck, Volume2, Sparkles, Search, Feather, Edit3, Settings, Mic, Trophy, Award } from 'lucide-react';
import { achievementService } from '../services/achievementService';

interface HeaderProps {
  currentTab: 'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice';
  onSelectTab: (tab: 'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  starsCount: number;
  customizedCount?: number;
  onOpenTeacherManagement?: () => void;
  onOpenVoiceStudio?: () => void;
  onOpenAchievements?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  starsCount,
  customizedCount = 0,
  onOpenTeacherManagement,
  onOpenVoiceStudio,
  onOpenAchievements
}) => {
  const titleInfo = achievementService.getCurrentTitle();
  const stats = achievementService.getStats();
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo and branding */}
          <div 
            id="brand-logo-btn"
            onClick={() => onSelectTab('volume1')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent font-serif">
                  Tiếng Việt 1
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  KNTT
                </span>
              </div>
              <p className="text-xs text-amber-700 font-medium hidden sm:block">
                Kết nối tri thức với cuộc sống • Bộ GD&ĐT
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input
                id="search-lessons-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm bài học, âm, vần, từ ngữ (vd: bài 5, hoa xoan, chong chóng)..."
                className="w-full pl-10 pr-4 py-2 bg-amber-50/60 hover:bg-amber-50 focus:bg-white text-sm text-amber-950 placeholder-amber-400/80 rounded-xl border border-amber-200/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600 hover:text-amber-900 bg-amber-200/60 rounded-full px-1.5 py-0.5"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons (Achievements, Voice, Teacher, Star counter) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Academic Title & Badges Trophy button */}
            {onOpenAchievements && (
              <button
                id="achievement-trophy-btn"
                onClick={onOpenAchievements}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer border border-amber-300 group"
                title="Bảng Vàng Danh Hiệu & Bộ Sưu Tập Huy Hiệu Của Bé"
              >
                <span className="text-base leading-none group-hover:scale-110 transition-transform">
                  {titleInfo.icon}
                </span>
                <span className="hidden md:inline font-serif">{titleInfo.title}</span>
                <span className="md:hidden">Danh hiệu</span>
                <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px] font-black text-amber-100">
                  {stats.unlockedBadges}/{stats.totalBadges}
                </span>
              </button>
            )}

            {/* Voice Studio / Recording Archive button */}
            {onOpenVoiceStudio && (
              <button
                id="voice-studio-btn"
                onClick={onOpenVoiceStudio}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-orange-100 hover:from-rose-100 hover:to-orange-200 border border-orange-300 text-orange-950 rounded-xl font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Phòng thu âm và sổ tay bài đọc của bé"
              >
                <Mic className="w-4 h-4 text-rose-500 animate-bounce" />
                <span className="hidden sm:inline">Phòng Thu Âm</span>
                <span className="sm:hidden">Thu âm</span>
              </button>
            )}

            {/* Teacher Menu button */}
            {onOpenTeacherManagement && (
              <button
                id="teacher-management-btn"
                onClick={onOpenTeacherManagement}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-orange-50 to-amber-100 hover:from-orange-100 hover:to-amber-200 border border-amber-300/90 text-amber-950 rounded-xl font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Bảng quản lý giáo án và chỉnh sửa bài học cho giáo viên"
              >
                <span className="text-base leading-none">👩‍🏫</span>
                <span className="hidden lg:inline">Quản lý Giáo án</span>
                {customizedCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-orange-500 text-white">
                    {customizedCount}
                  </span>
                )}
              </button>
            )}

            {/* Star counter */}
            <div 
              id="star-reward-counter"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-xl shadow-xs"
              title="Sao thưởng học tập của bạn"
            >
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="font-black text-amber-900 text-xs sm:text-sm">{starsCount}</span>
              <span className="text-xs text-amber-700 font-semibold hidden sm:inline">Sao</span>
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 border-t border-amber-50 no-scrollbar">
          <button
            id="tab-intro-btn"
            onClick={() => onSelectTab('intro')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentTab === 'intro'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100/70 bg-amber-50/50'
            }`}
          >
            <Feather className="w-4 h-4" />
            Bài mở đầu (Làm quen)
          </button>

          <button
            id="tab-volume1-btn"
            onClick={() => onSelectTab('volume1')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentTab === 'volume1'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-orange-950 hover:bg-orange-100/70 bg-orange-50/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Tập 1: 83 Bài học Âm - Vần
          </button>

          <button
            id="tab-volume2-btn"
            onClick={() => onSelectTab('volume2')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentTab === 'volume2'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-950 hover:bg-emerald-100/70 bg-emerald-50/50'
            }`}
          >
            <BookCheck className="w-4 h-4" />
            Tập 2: 8 Chủ điểm Đọc hiểu
          </button>

          <button
            id="tab-alphabet-btn"
            onClick={() => onSelectTab('alphabet')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentTab === 'alphabet'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-950 hover:bg-blue-100/70 bg-blue-50/50'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            Bảng âm chữ & Dấu thanh
          </button>

          <button
            id="tab-practice-btn"
            onClick={() => onSelectTab('practice')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              currentTab === 'practice'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-950 hover:bg-purple-100/70 bg-purple-50/50'
            }`}
          >
            <span className="text-base leading-none">✍️</span>
            Vở Tập Viết Ô Ly
          </button>
        </div>

      </div>
    </header>
  );
};
