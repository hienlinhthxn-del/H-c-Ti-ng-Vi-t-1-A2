import React from 'react';

interface UserAvatarProps {
  avatar?: string;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  role?: 'student' | 'teacher' | 'parent';
}

export const TEACHER_HIEN_PHAN_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160"><defs><radialGradient id="bgG" cx="50%" cy="30%" r="70%"><stop offset="0%" stop-color="%23fed7aa"/><stop offset="100%" stop-color="%23fb923c"/></radialGradient><linearGradient id="aoDai" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23dc2626"/><stop offset="100%" stop-color="%23991b1b"/></linearGradient><linearGradient id="hairG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23331b14"/><stop offset="100%" stop-color="%231a0e0a"/></linearGradient><linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23ffeedd"/><stop offset="100%" stop-color="%23fcd5b8"/></linearGradient></defs><circle cx="80" cy="80" r="78" fill="url(%23bgG)" stroke="%23ea580c" stroke-width="3"/><path d="M42 160 C 42 118, 55 106, 80 106 C 105 106, 118 118, 118 160 Z" fill="url(%23aoDai)"/><path d="M72 106 L80 120 L88 106 Z" fill="%23fcd5b8"/><circle cx="68" cy="112" r="2" fill="%23ffffff"/><circle cx="74" cy="116" r="2" fill="%23ffffff"/><circle cx="80" cy="118" r="2" fill="%23ffffff"/><circle cx="86" cy="116" r="2" fill="%23ffffff"/><circle cx="92" cy="112" r="2" fill="%23ffffff"/><g transform="translate(62, 126) scale(0.65)"><circle cx="12" cy="12" r="5" fill="%23f59e0b"/><path d="M12 2 C12 6, 8 7, 12 12 C16 7, 12 6, 12 2" fill="%23fef08a"/><path d="M12 22 C12 18, 8 17, 12 12 C16 17, 12 18, 12 22" fill="%23fef08a"/><path d="M2 12 C6 12, 7 8, 12 12 C7 16, 6 12, 2 12" fill="%23fef08a"/><path d="M22 12 C18 12, 17 8, 12 12 C17 16, 18 12, 22 12" fill="%23fef08a"/><circle cx="12" cy="12" r="2" fill="%23b45309"/></g><path d="M70 90 L70 110 C70 115, 90 115, 90 110 L90 90 Z" fill="url(%23skinG)"/><ellipse cx="80" cy="74" rx="28" ry="32" fill="url(%23skinG)"/><path d="M50 72 C46 54, 52 36, 80 34 C108 36, 114 54, 110 72 C114 85, 106 95, 102 96 C98 84, 106 65, 102 52 C95 44, 65 44, 58 52 C54 65, 62 84, 58 96 C54 95, 46 85, 50 72 Z" fill="url(%23hairG)"/><path d="M54 50 C 65 42, 85 45, 106 52 C 95 48, 75 44, 60 55 Z" fill="%2326140d"/><path d="M64 66 Q71 63 76 66" stroke="%233a1e14" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M84 66 Q89 63 96 66" stroke="%233a1e14" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="70" cy="71" rx="4" ry="4.5" fill="%232b1810"/><ellipse cx="90" cy="71" rx="4" ry="4.5" fill="%232b1810"/><circle cx="71" cy="70" r="1.5" fill="%23ffffff"/><circle cx="91" cy="70" r="1.5" fill="%23ffffff"/><rect x="62" y="65" width="16" height="11" rx="3" fill="none" stroke="%23b91c1c" stroke-width="1.8"/><rect x="82" y="65" width="16" height="11" rx="3" fill="none" stroke="%23b91c1c" stroke-width="1.8"/><path d="M78 69 L82 69" stroke="%23b91c1c" stroke-width="1.8"/><path d="M78 76 Q80 81 82 76" stroke="%23e2a27b" stroke-width="1.8" fill="none"/><path d="M72 87 Q80 94 88 87 Q80 91 72 87 Z" fill="%23e11d48"/><circle cx="61" cy="80" r="4" fill="%23f472b6" opacity="0.35"/><circle cx="99" cy="80" r="4" fill="%23f472b6" opacity="0.35"/></svg>`;

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name = '',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
    xl: 'w-16 h-16 text-3xl',
    '2xl': 'w-24 h-24 text-5xl'
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  if (!avatar) {
    return (
      <div className={`inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold shrink-0 ${currentSizeClass} ${className}`}>
        {name ? name.charAt(0).toUpperCase() : '👤'}
      </div>
    );
  }

  // Check if avatar is an image URL or base64/SVG data URI
  const isImage = 
    avatar.startsWith('data:image/') || 
    avatar.startsWith('http://') || 
    avatar.startsWith('https://') || 
    avatar.startsWith('/') ||
    avatar.startsWith('blob:');

  if (isImage) {
    return (
      <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 bg-amber-50 border border-amber-200/80 shadow-2xs ${currentSizeClass} ${className}`}>
        <img
          src={avatar}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Emoji or text avatar
  return (
    <div className={`inline-flex items-center justify-center rounded-full select-none shrink-0 ${currentSizeClass} ${className}`}>
      <span>{avatar}</span>
    </div>
  );
};
