import React from 'react';
import { AchievementBadge } from '../types';
import { X, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementUnlockModalProps {
  badges: AchievementBadge[];
  onClose: () => void;
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({ badges, onClose }) => {
  const currentBadge = badges && badges.length > 0 ? badges[0] : null;

  React.useEffect(() => {
    if (currentBadge) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  }, [currentBadge]);

  if (!badges || badges.length === 0 || !currentBadge) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-400 via-orange-400 to-rose-500 rounded-3xl p-1 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-[22px] p-6 sm:p-8 text-center relative overflow-hidden">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge icon celebration */}
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="absolute inset-0 rounded-full bg-amber-200 animate-ping opacity-40" />
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-5xl shadow-xl shadow-orange-500/30">
              {currentBadge.icon}
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Mở Khóa Huy Hiệu Mới!
          </span>

          <h3 className="text-2xl font-black font-serif text-slate-900 mb-2">
            {currentBadge.title}
          </h3>

          <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">
            {currentBadge.description}
          </p>

          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 active:scale-95 text-white font-black text-base shadow-lg shadow-orange-500/30 transition-all cursor-pointer"
          >
            Tuyệt vời! Nhận Thưởng ⭐
          </button>

        </div>
      </div>
    </div>
  );
};
