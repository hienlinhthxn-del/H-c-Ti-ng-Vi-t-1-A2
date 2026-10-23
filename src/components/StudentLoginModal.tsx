import React, { useState, useEffect } from 'react';
import { AppUserProfile } from '../types';
import { userProfileService, AVATAR_OPTIONS } from '../services/userProfileService';
import { speechService } from '../services/speechService';
import { X, Users, Search, UserPlus, Check, Sparkles, Cloud } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  roleType?: 'student' | 'parent';
  onClose: () => void;
  onLoginSuccess: (student: AppUserProfile) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  roleType = 'student',
  onClose,
  onLoginSuccess
}) => {
  const [students, setStudents] = useState<AppUserProfile[]>(() =>
    userProfileService.getUsersByRole('student')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [isAddingStudent, setIsAddingStudent] = useState(false);

  // New student form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClassroom, setNewStudentClassroom] = useState('Lớp 1A');
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

  const classrooms = Array.from(
    new Set(students.map((s) => (s.classroom || 'Lớp 1').trim()).filter(Boolean))
  );

  const filteredStudents = students.filter((st) => {
    const matchesClass =
      selectedClassFilter === 'ALL' || (st.classroom || 'Lớp 1').trim() === selectedClassFilter;
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

    const created = userProfileService.createUser({
      name: cleanName,
      role: 'student',
      avatar: newStudentAvatar,
      classroom: newStudentClassroom.trim() || 'Lớp 1A',
      gender: newStudentGender
    });

    setNewStudentName('');
    setFormError('');
    setIsAddingStudent(false);
    speechService.playSoundEffect('fanfare');
    onLoginSuccess(created);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
            <span>Đồng bộ đa người dùng trực tuyến</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-serif flex items-center justify-center gap-2">
            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            {roleType === 'parent' ? 'Cổng Phụ Huynh – Chọn Tên Con' : 'Cổng Học Sinh – Chọn Tài Khoản'}
          </h2>
          <p className="text-blue-100 text-sm font-medium mt-1">
            {roleType === 'parent'
              ? 'Bố/mẹ bấm vào tên của con để xem tiến độ học tập và nhận xét của Cô giáo nhé!'
              : 'Em hãy bấm vào tên của mình (hoặc thêm tên mới) để bắt đầu học và luyện đọc nhé!'}
          </p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-90 cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Toolbar: Search + Add New Student Button */}
        <div className="px-4 sm:px-6 pt-4 pb-3 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm nhanh theo tên học sinh hoặc mã HS (VD: Hoài An, HS01)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setIsAddingStudent(!isAddingStudent);
                setFormError('');
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                isAddingStudent
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {isAddingStudent ? 'Quay lại danh sách' : '+ Thêm Học sinh mới'}
            </button>
          </div>

          {/* Class filter pills if multiple classes exist */}
          {!isAddingStudent && classrooms.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedClassFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedClassFilter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tất cả ({students.length})
              </button>
              {classrooms.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClassFilter(cls)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedClassFilter === cls
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {isAddingStudent ? (
            <form
              onSubmit={handleCreateNewStudent}
              className="max-w-lg mx-auto bg-blue-50/60 border-2 border-blue-100 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center gap-2 text-blue-900 font-extrabold text-base">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Tạo hồ sơ Học sinh mới (Đồng bộ cho cả lớp & Giáo viên)</span>
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
                    Lớp học
                  </label>
                  <input
                    type="text"
                    value={newStudentClassroom}
                    onChange={(e) => setNewStudentClassroom(e.target.value)}
                    placeholder="VD: Lớp 1A"
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
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-blue-900 text-sm sm:text-base">
                  Danh sách học sinh ({filteredStudents.length} học sinh)
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Bấm vào tên học sinh để vào bài học
                </span>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-600 font-semibold mb-3">
                    Không tìm thấy học sinh phù hợp với từ khóa "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudentName(searchQuery);
                      setIsAddingStudent(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 cursor-pointer"
                  >
                    + Thêm "{searchQuery}" vào danh sách lớp
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
                          {student.classroom}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
