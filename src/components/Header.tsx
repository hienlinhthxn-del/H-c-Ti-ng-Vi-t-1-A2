import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  BookCheck, 
  Volume2, 
  Sparkles, 
  Search, 
  Feather, 
  Edit3, 
  Settings, 
  Mic, 
  Award, 
  GraduationCap, 
  Users,
  Maximize2,
  Minimize2,
  Tv,
  X,
  Cloud
} from 'lucide-react';
import { UserRole, AppUserProfile } from '../types';
import { UserAvatar } from './UserAvatar';

interface HeaderProps {
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentTab: 'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice';
  onSelectTab: (tab: 'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  starsCount: number;
  customizedCount?: number;
  teacherAudioCount?: number;
  activeUser?: AppUserProfile;
  isTeacherAuthenticated?: boolean;
  onTeacherLogout?: () => void;
  onOpenTeacherLogin?: () => void;
  onOpenProfileModal?: () => void;
  onOpenGoogleWorkspace?: () => void;
  onOpenTeacherManagement?: () => void;
  onOpenTeacherAudioStudio?: () => void;
  onOpenVoiceStudio?: () => void;
  onOpenAchievements?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  onSelectRole,
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  starsCount,
  customizedCount = 0,
  teacherAudioCount = 0,
  activeUser,
  isTeacherAuthenticated = false,
  onTeacherLogout,
  onOpenTeacherLogin,
  onOpenProfileModal,
  onOpenGoogleWorkspace,
  onOpenTeacherManagement,
  onOpenTeacherAudioStudio,
  onOpenVoiceStudio,
  onOpenAchievements
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs safe-area-top">
      
      {/* Top Role Selector Bar - Optimized for Mobile, Tablet & Interactive TV */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-2 sm:px-4 py-1 sm:py-1.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-1 font-bold">
            <span className="hidden sm:inline">✨ Chế độ:</span>
            <span className="sm:hidden text-[11px] font-extrabold">✨ Phân hệ:</span>
          </div>

          <div className="inline-flex p-0.5 bg-black/20 backdrop-blur-md rounded-xl border border-white/20 overflow-x-auto max-w-full no-scrollbar">
            <button
              id="role-switch-student-btn"
              onClick={() => onSelectRole('student')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-black text-[11px] sm:text-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
                userRole === 'student'
                  ? 'bg-white text-orange-950 shadow-xs'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <span>🎒</span>
              <span className="hidden sm:inline">1. Trang Học Sinh</span>
              <span className="sm:hidden">Học Sinh</span>
            </button>

            <button
              id="role-switch-teacher-btn"
              onClick={() => onSelectRole('teacher')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-black text-[11px] sm:text-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
                userRole === 'teacher'
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-amber-100 hover:text-white'
              }`}
              title={isTeacherAuthenticated ? "Đã đăng nhập Giáo Viên" : "Cần đăng nhập / PIN để vào Trang Giáo Viên"}
            >
              <span>👩‍🏫</span>
              <span className="hidden sm:inline">2. Trang Giáo Viên</span>
              <span className="sm:hidden">Giáo Viên</span>
              {!isTeacherAuthenticated && (
                <span className="text-[10px] opacity-90" title="Cần mật khẩu">🔒</span>
              )}
              {customizedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500 text-white font-bold">
                  {customizedCount}
                </span>
              )}
            </button>

            <button
              id="role-switch-parent-btn"
              onClick={() => onSelectRole('parent')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-black text-[11px] sm:text-xs transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap ${
                userRole === 'parent'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <span>👨‍👩‍👧</span>
              <span className="hidden sm:inline">3. Trang Phụ Huynh</span>
              <span className="sm:hidden">Phụ Huynh</span>
            </button>
          </div>

          {/* Quick Lock / Logout Teacher button when in teacher role */}
          {userRole === 'teacher' && onTeacherLogout && (
            <button
              id="header-teacher-logout-btn"
              onClick={onTeacherLogout}
              className="flex items-center gap-1 px-2.5 py-1 bg-black/30 hover:bg-black/50 text-white rounded-xl text-[11px] font-bold border border-white/30 backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0"
              title="Đăng xuất và khóa Trang Giáo Viên"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Khóa Cổng GV</span>
              <span className="sm:hidden">Khóa</span>
            </button>
          )}

          {/* Google Workspace Sync Button */}
          {onOpenGoogleWorkspace && (
            <button
              id="open-google-workspace-top-btn"
              onClick={onOpenGoogleWorkspace}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600/60 hover:bg-emerald-600/90 text-white rounded-xl text-[11px] font-black border border-emerald-300/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0"
              title="Đồng bộ bảng điểm Google Sheets, lưu âm thanh Google Drive & giao bài Classroom"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Google Sync</span>
              <span className="sm:hidden">Đồng bộ</span>
            </button>
          )}

          {/* User Profile Quick Switcher Button */}
          {onOpenProfileModal && (
            <button
              id="open-profile-manager-btn"
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[11px] font-black border border-white/30 backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0"
              title="Quản lý đa người dùng, chuyển đổi tài khoản học sinh / giáo viên"
            >
              <UserAvatar avatar={activeUser?.avatar} name={activeUser?.name} size="xs" />
              <span className="max-w-[80px] sm:max-w-[120px] truncate">{activeUser?.name || 'Đa người dùng'}</span>
              <span className="text-[10px] opacity-80 hidden sm:inline">🔄 Đổi</span>
            </button>
          )}

          {/* Fullscreen Smartboard Mode Toggle button for Classroom TV / Displays */}
          <div className="hidden lg:flex items-center">
            <button
              id="toggle-smartboard-fullscreen-btn"
              onClick={toggleFullscreen}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] transition-all cursor-pointer"
              title={isFullscreen ? "Thoát chế độ toàn màn hình" : "Mở chế độ trình chiếu màn hình lớn / TV Lớp học"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'Thu nhỏ' : '🖥️ Trình Chiếu TV'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 gap-2 sm:gap-4">
          
          {/* Logo and branding */}
          <div 
            id="brand-logo-btn"
            onClick={() => {
              if (userRole === 'student') onSelectTab('volume1');
            }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="font-extrabold text-base sm:text-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent font-serif truncate">
                  Tiếng Việt 1
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                  KNTT
                </span>
              </div>
              <p className="text-[11px] text-amber-700 font-medium hidden md:block truncate">
                Bộ sách Kết Nối Tri Thức Với Cuộc Sống
              </p>
            </div>
          </div>

          {/* Search bar for Desktop & Tablets */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input
                id="search-lessons-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm bài học, âm, vần, từ ngữ (vd: bài 5, hoa xoan)..."
                className="w-full pl-10 pr-4 py-2 bg-amber-50/60 hover:bg-amber-50 focus:bg-white text-xs sm:text-sm text-amber-950 placeholder-amber-400/80 rounded-xl border border-amber-200/80 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner"
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

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Mobile Search Button */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2 text-amber-800 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
              title="Tìm kiếm bài học"
            >
              <Search className="w-4 h-4 text-amber-600" />
            </button>

            {/* Fullscreen button on Tablet / Mobile */}
            <button
              id="tablet-fullscreen-btn"
              onClick={toggleFullscreen}
              className="lg:hidden p-2 text-amber-800 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-700" /> : <Maximize2 className="w-4 h-4 text-amber-700" />}
            </button>

            {/* Achievement & Badges button */}
            {onOpenAchievements && (
              <button
                id="open-achievements-btn"
                onClick={onOpenAchievements}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 hover:from-amber-500 hover:to-orange-500 text-amber-950 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                title="Bảng vàng thành tích & Tủ huy hiệu của bé"
              >
                <span className="text-sm sm:text-base leading-none">🏆</span>
                <span className="hidden sm:inline">Tủ Huy Hiệu</span>
              </button>
            )}

            {/* Voice Studio / Recording Archive button */}
            {onOpenVoiceStudio && (
              <button
                id="voice-studio-btn"
                onClick={onOpenVoiceStudio}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-50 to-orange-100 hover:from-rose-100 hover:to-orange-200 border border-orange-300 text-orange-950 rounded-xl font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Phòng thu âm và sổ tay bài đọc của bé"
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>Phòng Thu Âm</span>
              </button>
            )}

            {/* Star counter */}
            <div 
              id="star-reward-counter"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-xl shadow-xs"
              title="Sao thưởng học tập của bạn"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="font-black text-amber-900 text-xs sm:text-sm">{starsCount}</span>
              <span className="text-xs text-amber-700 font-semibold hidden sm:inline">Sao</span>
            </div>
          </div>

        </div>

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input
                id="mobile-search-lessons-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm bài học, âm, vần (vd: bài 5, hoa xoan)..."
                className="w-full pl-10 pr-9 py-2 bg-amber-50 text-xs text-amber-950 placeholder-amber-400 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
              <button
                id="close-mobile-search-btn"
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  onSearchChange('');
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation for Student View (Desktop & Tablet) */}
        {userRole === 'student' && (
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 sm:py-2.5 border-t border-amber-100 no-scrollbar">
            <button
              id="tab-intro-btn"
              onClick={() => onSelectTab('intro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'intro'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100/70 bg-amber-50/50'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Bài mở đầu (Làm quen)</span>
            </button>

            <button
              id="tab-volume1-btn"
              onClick={() => onSelectTab('volume1')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'volume1'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-orange-950 hover:bg-orange-100/70 bg-orange-50/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tập 1: 83 Bài Âm - Vần</span>
            </button>

            <button
              id="tab-volume2-btn"
              onClick={() => onSelectTab('volume2')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'volume2'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-950 hover:bg-emerald-100/70 bg-emerald-50/50'
              }`}
            >
              <BookCheck className="w-3.5 h-3.5" />
              <span>Tập 2: 8 Chủ điểm Đọc hiểu</span>
            </button>

            <button
              id="tab-alphabet-btn"
              onClick={() => onSelectTab('alphabet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'alphabet'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-950 hover:bg-blue-100/70 bg-blue-50/50'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Bảng âm chữ & Dấu thanh</span>
            </button>

            <button
              id="tab-practice-btn"
              onClick={() => onSelectTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'practice'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-950 hover:bg-purple-100/70 bg-purple-50/50'
              }`}
            >
              <span className="text-sm leading-none">✍️</span>
              <span>Vở Tập Viết Ô Ly</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
