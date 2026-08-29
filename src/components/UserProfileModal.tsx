import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Users, 
  UserPlus, 
  GraduationCap, 
  Sparkles, 
  Check, 
  Edit2, 
  Trash2, 
  Download, 
  Upload, 
  Lock, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Search
} from 'lucide-react';
import { AppUserProfile, UserRole } from '../types';
import { userProfileService, AVATAR_OPTIONS } from '../services/userProfileService';
import { speechService } from '../services/speechService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSwitched: (user: AppUserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onUserSwitched
}) => {
  const [users, setUsers] = useState<AppUserProfile[]>(userProfileService.getAllUsers());
  const [activeUser, setActiveUser] = useState<AppUserProfile>(userProfileService.getActiveUser());
  const [activeTab, setActiveTab] = useState<'profiles' | 'add_new' | 'sync'>('profiles');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'parent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New user form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('student');
  const [newAvatar, setNewAvatar] = useState('🐰');
  const [newClassroom, setNewClassroom] = useState('Lớp 1A');
  const [newGender, setNewGender] = useState<'male' | 'female'>('male');
  const [newPinCode, setNewPinCode] = useState('');
  
  // Editing state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('🐰');
  const [editClassroom, setEditClassroom] = useState('');

  // Sync / Transfer state
  const [importJsonText, setImportJsonText] = useState('');
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const unsubscribe = userProfileService.subscribe((current, all) => {
      setActiveUser(current);
      setUsers(all);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleSelectUser = (user: AppUserProfile) => {
    const updated = userProfileService.switchUser(user.id);
    if (updated) {
      speechService.playSoundEffect('correct');
      speechService.speak(`Xin chào ${updated.name}!`);
      onUserSwitched(updated);
      onClose();
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created = userProfileService.createUser({
      name: newName.trim(),
      role: newRole,
      avatar: newAvatar,
      classroom: newClassroom.trim() || 'Lớp 1A',
      gender: newGender,
      pinCode: newPinCode.trim()
    });

    speechService.playSoundEffect('sectionComplete');
    speechService.speak(`Đã tạo hồ sơ cho ${created.name}!`);
    onUserSwitched(created);
    
    // Reset form
    setNewName('');
    setNewPinCode('');
    setActiveTab('profiles');
  };

  const handleSaveEdit = (userId: string) => {
    if (!editName.trim()) return;
    userProfileService.updateUser(userId, {
      name: editName.trim(),
      avatar: editAvatar,
      classroom: editClassroom.trim()
    });
    setEditingUserId(null);
    speechService.playSoundEffect('pop');
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Bạn có chắc chắn muốn xoá hồ sơ "${userName}" không?`)) {
      const ok = userProfileService.deleteUser(userId);
      if (ok) {
        speechService.playSoundEffect('pop');
      } else {
        alert('Không thể xoá hồ sơ duy nhất còn lại!');
      }
    }
  };

  const handleExportData = () => {
    const dataStr = userProfileService.exportUsersPackage();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiengviet1-danh-sach-nguoi-dung-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSyncMessage({ type: 'success', text: 'Đã xuất tệp hồ sơ thành công!' });
  };

  const handleImportData = () => {
    if (!importJsonText.trim()) return;
    const res = userProfileService.importUsersPackage(importJsonText);
    if (res.success) {
      setSyncMessage({ type: 'success', text: `Đã nhập thành công ${res.count} hồ sơ!` });
      setImportJsonText('');
      speechService.playSoundEffect('sectionComplete');
    } else {
      setSyncMessage({ type: 'error', text: res.error || 'Nhập dữ liệu thất bại' });
    }
  };

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = u.name.toLowerCase().includes(q);
      const matchCode = u.studentCode?.toLowerCase().includes(q);
      const matchClass = u.classroom?.toLowerCase().includes(q);
      return matchName || matchCode || matchClass;
    }
    return true;
  });

  return (
    <div 
      id="user-profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="user-profile-modal-content"
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              {activeUser.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">Danh Sách Học Sinh & Người Dùng</h2>
                <span className="bg-white/25 px-2 py-0.5 rounded-full text-[11px] font-bold">
                  {users.length} Hồ sơ
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                Đang dùng: <span className="font-bold underline">{activeUser.name}</span> ({activeUser.role === 'teacher' ? 'Giáo Viên' : activeUser.role === 'parent' ? 'Phụ Huynh' : 'Học Sinh'})
              </p>
            </div>
          </div>

          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 p-3 bg-amber-50/60 border-b border-amber-100 overflow-x-auto no-scrollbar">
          <button
            id="tab-view-profiles-btn"
            onClick={() => setActiveTab('profiles')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profiles'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-amber-100/50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh Sách Lớp ({users.filter(u => u.role === 'student').length} HS)</span>
          </button>

          <button
            id="tab-add-profile-btn"
            onClick={() => setActiveTab('add_new')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add_new'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-amber-100/50 border border-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm Học Sinh Mới</span>
          </button>

          <button
            id="tab-sync-profiles-btn"
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-amber-100/50 border border-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Sao Lưu & Chuyển Máy</span>
          </button>
        </div>

        {/* Tab 1: Profiles List */}
        {activeTab === 'profiles' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-user-profile-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Tìm nhanh theo tên học sinh (vd: Hoài An, Phương Anh, Diệp, Phúc...)"
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl text-xs sm:text-sm font-medium transition-all outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter by Role */}
            <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-600">Lọc:</span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'student', label: `🎒 Học sinh (${users.filter(u => u.role === 'student').length})` },
                  { id: 'teacher', label: '👩‍🏫 Giáo viên' },
                  { id: 'parent', label: '👨‍👩‍👧 Phụ huynh' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setRoleFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      roleFilter === f.id
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Tìm thấy: <span className="font-bold text-amber-700">{filteredUsers.length}</span> hồ sơ
              </span>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredUsers.map((user) => {
                const isActive = user.id === activeUser.id;
                const isEditing = editingUserId === user.id;

                if (isEditing) {
                  return (
                    <div 
                      key={user.id} 
                      className="p-4 rounded-2xl border-2 border-amber-400 bg-amber-50/70 space-y-3 col-span-1 sm:col-span-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">Chỉnh sửa hồ sơ</span>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Huỷ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Tên:</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Lớp / Đơn vị:</label>
                          <input
                            type="text"
                            value={editClassroom}
                            onChange={(e) => setEditClassroom(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Biểu tượng Avatar:</label>
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                            {(AVATAR_OPTIONS[user.role] || AVATAR_OPTIONS.student).map((av) => (
                              <button
                                key={av}
                                type="button"
                                onClick={() => setEditAvatar(av)}
                                className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${
                                  editAvatar === av ? 'bg-amber-500 shadow-xs scale-110' : 'bg-white border border-slate-200'
                                }`}
                              >
                                {av}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleSaveEdit(user.id)}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Lưu thay đổi
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={user.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-50/80 border-amber-400 shadow-md ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {user.avatar}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-sm text-slate-900 truncate">
                            {user.name}
                          </span>
                          {isActive && (
                            <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-2xs">
                              Đang dùng
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span className="font-medium">{user.classroom || 'Lớp 1A'}</span>
                          <span>•</span>
                          <span className="capitalize font-bold text-amber-700">
                            {user.role === 'teacher' ? '👩‍🏫 Giáo viên' : user.role === 'parent' ? '👨‍👩‍👧 Phụ huynh' : '🎒 Học sinh'}
                          </span>
                        </div>

                        {user.role === 'student' && (
                          <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-slate-600">
                            <span className="text-amber-600">⭐ {user.starsCount || 0} sao</span>
                            <span>•</span>
                            <span className="text-emerald-700">📖 {user.completedLessonKeys?.length || 0} bài</span>
                            {user.totalRecordingsCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-rose-600">🎙️ {user.totalRecordingsCount} bản thu</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditName(user.name);
                            setEditAvatar(user.avatar);
                            setEditClassroom(user.classroom || '');
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {users.length > 1 && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xoá hồ sơ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {isActive ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Đang hoạt động
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSelectUser(user)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          Chuyển sang hồ sơ này
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 2: Create New Profile */}
        {activeTab === 'add_new' && (
          <form onSubmit={handleCreateUser} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Tạo Hồ Sơ Người Dùng Mới</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Thêm bạn học mới trong lớp, hoặc thêm hồ sơ cho các bé cùng học chung trên 1 thiết bị.
              </p>
            </div>

            {/* Select Role */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Vai trò:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'student', title: 'Học sinh', icon: '🎒', desc: 'Luyện đọc, bài tập, tích lũy sao' },
                  { id: 'teacher', title: 'Giáo viên', icon: '👩‍🏫', desc: 'Soạn bài, chấm điểm, quản lý lớp' },
                  { id: 'parent', title: 'Phụ huynh', icon: '👨‍👩‍👧', desc: 'Theo dõi tiến độ con em' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setNewRole(r.id as UserRole);
                      setNewAvatar(AVATAR_OPTIONS[r.id as UserRole][0]);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      newRole === r.id
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-2xl">{r.icon}</div>
                    <div className="font-bold text-xs text-slate-900 mt-1">{r.title}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name and Classroom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Họ và tên <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Bé Bảo Trâm, Cô Lan..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lớp / Trường học:
                </label>
                <input
                  type="text"
                  value={newClassroom}
                  onChange={(e) => setNewClassroom(e.target.value)}
                  placeholder="Ví dụ: Lớp 1A, Tiểu học Thăng Long..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Chọn biểu tượng đại diện (Avatar):
              </label>
              <div className="flex items-center gap-2 overflow-x-auto p-2 bg-amber-50/60 rounded-2xl border border-amber-200 no-scrollbar">
                {(AVATAR_OPTIONS[newRole] || AVATAR_OPTIONS.student).map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      newAvatar === av
                        ? 'bg-amber-500 shadow-md scale-110 ring-2 ring-amber-300'
                        : 'bg-white border border-slate-200 hover:scale-105'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('profiles')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Tạo và Đăng Nhập Ngay 🚀
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Backup & Sync */}
        {activeTab === 'sync' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">Sao Lưu & Chuyển Đổi Thiết Bị</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Xuất toàn bộ danh sách hồ sơ học sinh, sao thưởng và tiến độ bài học để chuyển sang máy tính bảng, điện thoại hoặc máy tính khác mà không bị mất dữ liệu.
              </p>
            </div>

            {syncMessage && (
              <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                syncMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {syncMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{syncMessage.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Export Box */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-xs text-amber-950">1. Tải về tệp hồ sơ (.json)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Lưu trữ danh sách {users.length} hồ sơ của lớp hiện tại về máy tính.
                </p>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Xuất Tệp Hồ Sơ Lớp 📥
                </button>
              </div>

              {/* Reset to Samples */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-slate-600" />
                  <span className="font-bold text-xs text-slate-900">2. Nạp lại hồ sơ mẫu</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Tải lại 5 hồ sơ mẫu chuẩn (Bé Diệu Linh, Bé Bảo Nam, Bé Tuấn Kiệt, Cô Mai Linh...).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Khôi phục về danh sách hồ sơ mẫu chuẩn?')) {
                      userProfileService.resetToDefaultProfiles();
                      setSyncMessage({ type: 'success', text: 'Đã nạp lại danh sách người dùng mẫu!' });
                    }
                  }}
                  className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Khôi Phục Hồ Sơ Mẫu
                </button>
              </div>
            </div>

            {/* Import Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">3. Nhập dữ liệu hồ sơ từ máy khác</span>
              </div>
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Dán mã dữ liệu JSON vào đây..."
                rows={3}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleImportData}
                disabled={!importJsonText.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Nhập Hồ Sơ Vào Ứng Dụng
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
