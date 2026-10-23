import React, { useState, useEffect } from 'react';
import { AppUserProfile } from '../types';
import { userProfileService, AVATAR_OPTIONS } from '../services/userProfileService';
import { speechService } from '../services/speechService';
import { X, LogIn, Users, Search, UserPlus, Check, Sparkles, Cloud, ArrowLeft } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  roleType?: 'student' | 'parent';
  onClose: () => void;
  onLoginSuccess: (student: AppUserProfile) => void;
}

// Chuẩn hóa mã lớp để so sánh (VD: "Lớp 1A2" -> "1A2", "1a1" -> "1A1")
const normalizeClassCode = (raw: string): string => {
  return raw
    .trim()
    .toUpperCase()
    .replace(/^LỚP\s*/i, '')
    .replace(/^LOP\s*/i, '')
    .replace(/\s+/g, '');
};

// Kiểm tra mã lớp hợp lệ cho toàn Khối 1 (VD: 1A, 1B, 1C, 1D, 1E, 1A1..1A9, KHOI1)
const isValidGrade1ClassCode = (code: string): boolean => {
  if (!code) return false;
  if (code === 'KHOI1' || code === 'KHỐI1' || code === '1') return true;
  // Chấp nhận mọi mã lớp bắt đầu bằng số 1 (VD: 1A, 1B, 1C, 1A1, 1A2, 1A3, 1A4, 1A5...)
  return /^1[A-Z0-9]{1,4}$/.test(code);
};

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  roleType = 'student',
  onClose,
  onLoginSuccess
}) => {
  const [classCode, setClassCode] = useState('');
  const [verifiedClassCode, setVerifiedClassCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [codeError, setCodeError] = useState('');

  const [students, setStudents] = useState<AppUserProfile[]>(() =>
    userProfileService.getUsersByRole('student')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // New student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClassroom, setNewStudentClassroom] = useState('Lớp 1A2');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('male');
  const [newStudentAvatar, setNewStudentAvatar] = useState(AVATAR_OPTIONS.student[0]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setStudents(userProfileService.getUsersByRole('student'));
    const unsubscribe = userProfileService.subscribe(() => {
      setStudents(userProfileService.getUsersByRole('student'));
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalizeClassCode(classCode);
    if (isValidGrade1ClassCode(cleaned)) {
      const finalCode = cleaned === '1' || cleaned === 'KHỐI1' ? 'KHOI1' : cleaned;
      setVerifiedClassCode(finalCode);
      setNewStudentClassroom(finalCode === 'KHOI1' ? 'Lớp 1A2' : `Lớp ${finalCode}`);
      setIsCodeValid(true);
      setCodeError('');
      setSearchQuery('');
      setIsAddingStudent(false);
      speechService.playSoundEffect('correct');
    } else {
      setCodeError('Mã lớp chưa đúng. Em hãy nhập mã lớp thuộc Khối 1 (VD: 1A2, 1A1, 1A3, 1A, 1B...) hoặc hỏi Cô giáo nhé!');
      speechService.playSoundEffect('tryAgain');
    }
  };

  // Lọc học sinh theo Mã lớp đã nhập + Từ khóa tìm kiếm tên
  const filteredStudents = students.filter((st) => {
    const stClassNorm = normalizeClassCode(st.classroom || '1A2');
    let matchesClass = false;

    if (verifiedClassCode === 'KHOI1') {
      matchesClass = true; // Xem toàn bộ học sinh Khối 1
    } else if (verifiedClassCode === '1A2' || verifiedClassCode === '1A') {
      // Danh sách mặc định (classroom = 'Lớp 1', 'Lớp 1A', 'Lớp 1A2') thuộc lớp cô Hiền Phan
      matchesClass =
        stClassNorm === verifiedClassCode ||
        stClassNorm === '1' ||
        stClassNorm === '1A' ||
        stClassNorm === '1A2';
    } else {
      matchesClass = stClassNorm === verifiedClassCode;
    }

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      st.name.toLowerCase().includes(q) ||
      (st.studentCode && st.studentCode.toLowerCase().includes(q));

    return matchesClass && matchesSearch;
  });

  const handleSelectStudent = (student: AppUserProfile) => {
    userProfileService.switchUser(student.id);
    speechService.playSoundEffect('fanfare');
    onLoginSuccess(student);
  };

  const handleCreateNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newStudentName.trim();
    if (!cleanName) {
      setFormError('Vui lòng nhập họ và tên của học sinh.');
      return;
    }

    const targetClassroom =
      newStudentClassroom.trim() ||
      (verifiedClassCode && verifiedClassCode !== 'KHOI1' ? `Lớp ${verifiedClassCode}` : 'Lớp 1A2');

    const created = userProfileService.createUser({
      name: cleanName,
      role: 'student',
      avatar: newStudentAvatar,
      classroom: targetClassroom,
      gender: newStudentGender
    });

    setNewStudentName('');
    setFormError('');
    setIsAddingStudent(false);
    speechService.playSoundEffect('fanfare');
    onLoginSuccess(created);
  };

  const handleResetClassCode = () => {
    setIsCodeValid(false);
    setIsAddingStudent(false);
    setSearchQuery('');
    setCodeError('');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const displayClassTitle =
    verifiedClassCode === 'KHOI1' ? 'Toàn Khối 1' : `Lớp ${verifiedClassCode}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-[28px] sm:rounded-[32px] w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 sm:p-6 text-white text-center relative shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold mb-2">
            <Cloud className="w-3.5 h-3.5 text-emerald-300" />
            <span>Hệ thống Đa người dùng – Toàn Khối 1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-serif flex items-center justify-center gap-2">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            {roleType === 'parent' ? 'Cổng Phụ Huynh' : 'Cổng Học Sinh'}
          </h2>
          <p className="text-blue-100 text-sm font-medium mt-1">
            {!isCodeValid
              ? 'Vui lòng nhập Mã lớp của em để vào danh sách lớp học nhé!'
              : roleType === 'parent'
              ? `Đang xem ${displayClassTitle} – Bố/mẹ tìm và bấm vào tên của con nhé!`
              : `Chào mừng em đến với ${displayClassTitle} – Hãy tìm và bấm vào tên của em nhé!`}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* STEP 1: NHẬP MÃ LỚP */}
        {!isCodeValid ? (
          <div className="p-6 sm:p-8 overflow-y-auto">
            <form onSubmit={handleVerifyCode} className="space-y-6 max-w-md mx-auto py-4">
              <div>
                <label className="block text-center text-slate-700 font-extrabold mb-3 text-lg">
                  Mã lớp của em là gì?
                </label>
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => {
                    setClassCode(e.target.value);
                    if (codeError) setCodeError('');
                  }}
                  placeholder="Nhập mã lớp (VD: 1A2)"
                  className="w-full mx-auto block text-center text-3xl font-black text-blue-700 uppercase placeholder:normal-case placeholder:text-slate-300 placeholder:text-lg bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                  autoFocus
                />
                <p className="text-center text-xs text-slate-500 mt-2.5 leading-relaxed">
                  Hỗ trợ học sinh tất cả các lớp trong Khối 1:{' '}
                  <span className="font-bold text-slate-700">1A1, 1A2, 1A3, 1A4, 1A5</span> (hoặc{' '}
                  <span className="font-bold text-slate-700">1A, 1B, 1C, 1D, KHOI1</span>)
                </p>
              </div>

              {codeError && (
                <p className="text-center text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm font-bold animate-pulse">
                  {codeError}
                </p>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-3.5 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  Vào lớp
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* STEP 2: TÌM KIẾM & CHỌN TÊN HỌC SINH TRONG LỚP */
          <>
            <div className="px-4 sm:px-6 pt-4 pb-3 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetClassCode}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Đổi mã lớp
                  </button>
                  <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                    Mã lớp: {verifiedClassCode} ({filteredStudents.length} học sinh)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAddingStudent(!isAddingStudent);
                    setFormError('');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAddingStudent
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  {isAddingStudent ? 'Quay lại danh sách' : `+ Thêm HS vào ${displayClassTitle}`}
                </button>
              </div>

              {!isAddingStudent && (
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Tìm nhanh tên học sinh trong ${displayClassTitle} (VD: Hoài An, HS01)...`}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {isAddingStudent ? (
                <form
                  onSubmit={handleCreateNewStudent}
                  className="max-w-lg mx-auto bg-blue-50/60 border-2 border-blue-100 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 text-blue-900 font-extrabold text-base">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Thêm học sinh mới vào {displayClassTitle}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên học sinh *
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nhập họ và tên (VD: Lò Văn Minh)"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Lớp học (Khối 1)
                      </label>
                      <input
                        type="text"
                        value={newStudentClassroom}
                        onChange={(e) => setNewStudentClassroom(e.target.value)}
                        placeholder="VD: Lớp 1A2"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Giới tính
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewStudentGender('male')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            newStudentGender === 'male'
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          👦 Nam
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewStudentGender('female')}
                          className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            newStudentGender === 'female'
                              ? 'bg-pink-600 text-white border-pink-600'
                              : 'bg-white text-slate-700 border-slate-300'
                          }`}
                        >
                          👧 Nữ
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Chọn biểu tượng yêu thích của em:
                    </label>
                    <div className="grid grid-cols-8 sm:grid-cols-11 gap-1.5 bg-white p-2.5 rounded-xl border border-slate-200">
                      {AVATAR_OPTIONS.student.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewStudentAvatar(emoji)}
                          className={`text-2xl p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            newStudentAvatar === emoji
                              ? 'bg-amber-100 ring-2 ring-amber-500 scale-110'
                              : 'hover:bg-slate-100'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <p className="text-xs font-bold text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      {formError}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingStudent(false)}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      Tạo hồ sơ & Vào học ngay
                    </button>
                  </div>
                </form>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 px-4">
                  <p className="text-slate-700 font-bold mb-1">
                    {searchQuery
                      ? `Không tìm thấy học sinh "${searchQuery}" trong ${displayClassTitle}.`
                      : `${displayClassTitle} hiện chưa có danh sách học sinh.`}
                  </p>
                  <p className="text-xs text-slate-500 mb-4">
                    Em có thể bấm nút bên dưới để thêm tên của mình vào {displayClassTitle} và bắt đầu học ngay!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (searchQuery) setNewStudentName(searchQuery);
                      setIsAddingStudent(true);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md cursor-pointer"
                  >
                    + Thêm tên học sinh vào {displayClassTitle}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-blue-50 border-2 border-slate-100 hover:border-blue-400 rounded-2xl transition-all shadow-sm hover:shadow-md group active:scale-95 cursor-pointer relative"
                    >
                      {student.studentCode && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                          {student.studentCode}
                        </span>
                      )}
                      {(student.starsCount || 0) > 0 && (
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          ⭐ {student.starsCount}
                        </span>
                      )}
                      <span className="text-4xl mb-2 mt-2 group-hover:scale-110 transition-transform">
                        {student.avatar}
                      </span>
                      <span className="text-sm font-bold text-slate-800 text-center leading-tight group-hover:text-blue-700">
                        {student.name}
                      </span>
                      {student.classroom && (
                        <span className="text-[11px] text-slate-500 mt-0.5">
                          {student.classroom === 'Lớp 1' ? 'Lớp 1A2' : student.classroom}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
