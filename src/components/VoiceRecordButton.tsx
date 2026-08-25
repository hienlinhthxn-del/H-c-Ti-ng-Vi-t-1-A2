import React from 'react';
import { Mic, Sparkles } from 'lucide-react';
import { speechService } from '../services/speechService';
import { RecordingTargetInfo } from '../types';

interface VoiceRecordButtonProps {
  target: RecordingTargetInfo;
  onOpenRecorder: (target: RecordingTargetInfo) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'orange' | 'emerald' | 'amber' | 'blue' | 'pill';
  label?: string;
  className?: string;
}

export const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({
  target,
  onOpenRecorder,
  size = 'md',
  variant = 'orange',
  label = 'Bé đọc & Ghi âm',
  className = ''
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.playSoundEffect('pop');
    onOpenRecorder(target);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-xl',
    md: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2 rounded-2xl',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 rounded-2xl'
  }[size];

  const variantClasses = {
    orange: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-sm shadow-orange-500/20 border border-orange-400',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm shadow-emerald-500/20 border border-emerald-400',
    amber: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-2xs',
    blue: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm shadow-blue-500/20 border border-blue-400',
    pill: 'bg-white hover:bg-orange-50 text-orange-600 hover:text-orange-700 border border-orange-200 shadow-2xs'
  }[variant];

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center font-bold tracking-tight active:scale-95 transition-all cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      title="Mở phòng thu âm để bé đọc bài này"
    >
      <Mic className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{label}</span>
      <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5 text-yellow-300' : 'w-3 h-3 text-yellow-300'} />
    </button>
  );
};
