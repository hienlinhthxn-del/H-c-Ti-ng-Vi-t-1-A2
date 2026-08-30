import React from 'react';
import { BookOpen } from 'lucide-react';
import { UserRole } from '../types';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-xl mb-6">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent font-serif mb-3">
          Tiếng Việt 1
        </h1>
        <p className="text-amber-800 text-lg font-medium">Bạn muốn vào trang của ai?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        {/* Student */}
        <button
          onClick={() => onSelectRole('student')}
          className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg border-2 border-orange-100 hover:border-orange-400 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
        >
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-4xl">🎒</span>
          </div>
          <h2 className="text-2xl font-bold text-orange-950 mb-2">Học sinh</h2>
          <p className="text-orange-700/80 text-center text-sm">Vào học bài, luyện đọc và luyện viết chữ</p>
        </button>

        {/* Teacher */}
        <button
          onClick={() => onSelectRole('teacher')}
          className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg border-2 border-amber-100 hover:border-amber-400 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
        >
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-4xl">👩‍🏫</span>
          </div>
          <h2 className="text-2xl font-bold text-amber-950 mb-2">Giáo viên</h2>
          <p className="text-amber-700/80 text-center text-sm">Quản lý bài giảng, thu âm và chỉnh sửa</p>
        </button>

        {/* Parent */}
        <button
          onClick={() => onSelectRole('parent')}
          className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-4xl">👨‍👩‍👧</span>
          </div>
          <h2 className="text-2xl font-bold text-emerald-950 mb-2">Phụ huynh</h2>
          <p className="text-emerald-700/80 text-center text-sm">Xem tiến độ học tập và thành tích của con</p>
        </button>
      </div>
    </div>
  );
};
