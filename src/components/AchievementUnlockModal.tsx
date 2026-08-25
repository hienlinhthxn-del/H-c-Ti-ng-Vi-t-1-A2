import React, { useEffect } from 'react';
import { AchievementBadge } from '../types';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Check, X, Award, Star } from 'lucide-react';

interface AchievementUnlockModalProps {
  badge: AchievementBadge | null;
  onClose: () => void;
  onOpenAllBadges?: () => void;
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  badge,
  onClose,
  onOpenAllBadges
}) => {
  useEffect(() => {
    if (badge) {
      // Trigger festive sound
      speechService.playSoundEffect('fanfare');
      
      // Voice cheering
      setTimeout(() => {
        speechService.speak(`Hoan hô! Bé đã đạt danh hiệu mới: ${badge.title}!`);
      }, 400);

      // Trigger Confetti cannons
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 300);
      } catch (e) {
        console.error('Confetti error:', e);
      }
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center overflow-hidden animate-scale-up">
        
        {/* Background glow & sparkles */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-amber-300/40 via-yellow-200/30 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-yellow-200 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider mb-4 shadow-xs">
          <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>Vinh Danh Danh Hiệu Mới!</span>
        </div>

        {/* Big Bouncy Badge Icon */}
        <div className="relative my-4 flex justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 p-1.5 shadow-xl rotate-3 hover:rotate-0 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-50 to-transparent opacity-80" />
              <span className="text-5xl sm:text-6xl filter drop-shadow-md z-10 animate-bounce">
                {badge.icon}
              </span>
            </div>
          </div>
          
          <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full font-black text-xs shadow-md border-2 border-white flex items-center gap-1 animate-pulse">
            <Star className="w-3.5 h-3.5 fill-amber-950" />
            <span>+{badge.rewardStars} Sao</span>
          </div>
        </div>

        {/* Badge Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif tracking-tight mt-2">
          {badge.title}
        </h2>
        <div className="text-sm font-bold text-orange-600 mt-1">
          {badge.subtitle}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-serif mt-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70">
          "{badge.description}"
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          {onOpenAllBadges && (
            <button
              onClick={() => {
                onClose();
                onOpenAllBadges();
              }}
              className="w-full py-3 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-2xl font-black text-sm transition-all border border-amber-300 shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>Xem Bảng Vàng Danh Hiệu</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Tuyệt vời, Bé học tiếp!</span>
          </button>
        </div>

      </div>
    </div>
  );
};
