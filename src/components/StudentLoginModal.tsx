import React, { useState } from 'react';
import { AppUserProfile } from '../types';
import { userProfileService } from '../services/userProfileService';
import { speechService } from '../services/speechService';
import { X, LogIn, Users } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  roleType?: 'student' | 'parent';
  onClose: () => void;
  onLoginSuccess: (student: AppUserProfile) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({ isOpen, roleType = 'student', onClose, onLoginSuccess }) => {
  const [classCode, setClassCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const students = userProfileService.getUsersByRole('student');

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (classCode.trim().toUpperCase() === '1A2') {
      setIsCodeValid(true);
      setError('');
      speechService.playSoundEffect('correct');
    } else {
      setError('Mã lứp không chính xác. Hëy họi Cô giáo nhé!');
      speechService.playSoundEffect('tryAgain');
    }
  };

  const handleSelectStudent = (student: AppUserProfile) => {
    userProfileService.switchUser(student.id);
    speechService.playSoundEffect('fanfare');
    onLoginSuccess(student);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-blue-500 p-6 text-white text-center relative shrink-0">
          <h2 className="text-2xl font-black font-serif flex items-center justify-center gap-2">
            <Users className="w-7 h-7" />
            {roleType === 'parent' ? 'Cổng Phụ Huynh' : 'Cổng Học Sinh'}
          </h2>
          <p className="text-blue-100 font-medium mt-1">
            {!isCodeValid ? 'Vui lòng nhập Mã lứp dể ív`�o lứp học' : (roleType === 'parent' ? 'Bố/mẹ bấm vào tên của con mình nhé!' : 'Tìm và bấm vào tên của em nhé!')}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-90"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          %{!isCodeValid ? (
            <form onSubmit={handleVerifyCode} className="space-y-6 py-8">
              <div>
                <label className="block text-center text-slate-700 font-bold mb-4 text-lg">Mã lớp của em là gì?</label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  placeholder="Nhập mã lớp (VD: 1A2)"
                  className="w-full max-w-sm mx-auto block text-center text-3xl font-black text-blue-700 uppercase placeholder:normal-case placeholder:text-slate-300 placeholder:text-lg bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                  autoFocus
                />
              </div>
              {error && <p className="text-center text-red-500 font-bold animate-pulse">{error}</p>}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-3 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Vào lớp
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <h3 className="text-center font-bold text-blue-800 text-lg">Danh sách Lớp 1A2 ({students.length} học sinh)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {students.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-400 rounded-2xl transition-all shadow-sm hover:shadow-md group active:scale-95 cursor-pointer"
                  >
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">{student.avatar}</span>
                    <span className="text-sm font-bold text-slate-700 text-center leading-tight group-hover:text-blue-700">{student.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
