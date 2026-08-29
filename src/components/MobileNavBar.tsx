import React from 'react';
import { BookOpen, BookCheck, Volume2, Edit3, Award, Users, GraduationCap, Sparkles } from 'lucide-react';
import { UserRole, AppUserProfile } from '../types';
import { UserAvatar } from './UserAvatar';

interface MobileNavBarProps {
  userRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentTab: 'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice';
  onSelectTab: (tab: 'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice') => void;
  onOpenAchievements?: () => void;
  onOpenVoiceStudio?: () => void;
  starsCount: number;
  activeUser?: AppUserProfile;
  onOpenProfileModal?: () => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  userRole,
  onSelectRole,
  currentTab,
  onSelectTab,
  onOpenAchievements,
  onOpenVoiceStudio,
  starsCount,
  activeUser,
  onOpenProfileModal
}) => {
  return (
    <nav 
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-amber-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pt-1.5 safe-area-bottom"
    >
      <div className="flex items-center justify-around gap-1 max-w-lg mx-auto">
        
        {/* Tab 1: Volume 1 */}
        <button
          id="mobile-nav-vol1"
          onClick={() => {
            if (userRole !== 'student') onSelectRole('student');
            onSelectTab('volume1');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            userRole === 'student' && currentTab === 'volume1'
              ? 'text-orange-600 font-black scale-105'
              : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            userRole === 'student' && currentTab === 'volume1'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-transparent text-slate-600'
          }`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Tập 1</span>
        </button>

        {/* Tab 2: Volume 2 */}
        <button
          id="mobile-nav-vol2"
          onClick={() => {
            if (userRole !== 'student') onSelectRole('student');
            onSelectTab('volume2');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            userRole === 'student' && currentTab === 'volume2'
              ? 'text-emerald-600 font-black scale-105'
              : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            userRole === 'student' && currentTab === 'volume2'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-transparent text-slate-600'
          }`}>
            <BookCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Tập 2</span>
        </button>

        {/* Tab 3: Alphabet & Tones */}
        <button
          id="mobile-nav-alphabet"
          onClick={() => {
            if (userRole !== 'student') onSelectRole('student');
            onSelectTab('alphabet');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            userRole === 'student' && currentTab === 'alphabet'
              ? 'text-blue-600 font-black scale-105'
              : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            userRole === 'student' && currentTab === 'alphabet'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-transparent text-slate-600'
          }`}>
            <Volume2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Bảng Âm</span>
        </button>

        {/* Tab 4: Writing Practice */}
        <button
          id="mobile-nav-practice"
          onClick={() => {
            if (userRole !== 'student') onSelectRole('student');
            onSelectTab('practice');
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            userRole === 'student' && currentTab === 'practice'
              ? 'text-purple-600 font-black scale-105'
              : 'text-slate-500 font-medium hover:text-slate-900'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            userRole === 'student' && currentTab === 'practice'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-transparent text-slate-600'
          }`}>
            <Edit3 className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Tập Viết</span>
        </button>

        {/* Tab 5: Profile switcher */}
        <button
          id="mobile-nav-profile-btn"
          onClick={onOpenProfileModal}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all text-amber-700 font-medium cursor-pointer"
        >
          <div className="p-0.5 rounded-xl bg-amber-100/90 text-amber-900 border border-amber-300/80 shadow-2xs overflow-hidden flex items-center justify-center">
            <UserAvatar avatar={activeUser?.avatar} name={activeUser?.name} size="xs" />
          </div>
          <span className="text-[9px] mt-0.5 whitespace-nowrap max-w-[48px] truncate font-bold">{activeUser?.name?.split(' ').pop() || 'Đổi hồ sơ'}</span>
        </button>

      </div>
    </nav>
  );
};
