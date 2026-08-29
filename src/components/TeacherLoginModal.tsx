import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  X, 
  LogIn, 
  AlertCircle, 
  Check, 
  Cloud,
  HelpCircle,
  Settings
} from 'lucide-react';
import { userProfileService } from '../services/userProfileService';
import { teacherAuthService } from '../services/teacherAuthService';
import { googleWorkspaceService } from '../services/googleWorkspaceService';
import { speechService } from '../services/speechService';
import { AppUserProfile } from '../types';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (teacher: AppUserProfile) => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoggingInGoogle, setIsLoggingInGoogle] = useState<boolean>(false);
  const [teachers, setTeachers] = useState<AppUserProfile[]>([]);

  // Change PIN Sub-mode
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const list = userProfileService.getUsersByRole('teacher');
      setTeachers(list);
      if (list.length > 0) {
        setSelectedTeacherId(list[0].id);
      }
      setPin('');
      setErrorMessage(null);
      setIsChangingPin(false);
      setPinChangeSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginWithPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const result = teacherAuthService.loginWithPin(pin, selectedTeacherId, rememberMe);
    if (result.success && result.teacher) {
      speechService.playSoundEffect('correct');
      onSuccess(result.teacher);
      onClose();
    } else {
      speechService.playSoundEffect('wrong');
      setErrorMessage(result.error || 'Mã PIN không chính xác. Mã PIN mặc định là: 1234');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingInGoogle(true);
    setErrorMessage(null);
    try {
      const googleAccount = await googleWorkspaceService.signIn();
      const result = teacherAuthService.loginWithGoogle(googleAccount, rememberMe);
      if (result.success && result.teacher) {
        speechService.playSoundEffect('correct');
        onSuccess(result.teacher);
        onClose();
      } else {
        setErrorMessage(result.error || 'Không thể xác thực tài khoản Google.');
      }
    } catch (err: any) {
      console.error('Google Teacher Login Error:', err);
      setErrorMessage(err?.message || 'Đăng nhập Google chưa thành công. Bạn có thể dùng Mã PIN 1234 để vào ngay.');
    } finally {
      setIsLoggingInGoogle(false);
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 8) {
      setPin(prev => prev + digit);
    }
  };

  const handleKeypadDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setPin('');
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPinChangeSuccess(null);

    if (newPin !== confirmPin) {
      setErrorMessage('Mã PIN mới và xác nhận mã PIN không khớp nhau.');
      return;
    }

    if (newPin.trim().length < 4) {
      setErrorMessage('Mã PIN mới phải có ít nhất 4 ký tự.');
      return;
    }

    const teacherId = selectedTeacherId || (teachers[0] ? teachers[0].id : '');
    const result = teacherAuthService.changePin(teacherId, oldPin, newPin);

    if (result.success) {
      speechService.playSoundEffect('fanfare');
      setPinChangeSuccess('Đổi mã PIN Giáo Viên thành công! Hãy dùng mã PIN mới để đăng nhập.');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => {
        setIsChangingPin(false);
        setPinChangeSuccess(null);
      }, 2000);
    } else {
      setErrorMessage(result.error || 'Không thể đổi mã PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-4 sm:p-5 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
              👩‍🏫
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                Cổng Giáo Viên & Quản Lý
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 border border-white/30 uppercase tracking-wide font-bold">
                  Bảo mật
                </span>
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                {isChangingPin ? 'Thay đổi mã PIN Giáo Viên' : 'Vui lòng xác thực quyền Giáo Viên'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {pinChangeSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-start gap-2">
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1 font-bold">{pinChangeSuccess}</div>
            </div>
          )}

          {!isChangingPin ? (
            <>
              {/* Form standard PIN Login */}
              <form onSubmit={handleLoginWithPin} className="space-y-4">
                
                {/* Select Teacher Profile if multiple exist */}
                {teachers.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Chọn hồ sơ Giáo Viên:
                    </label>
                    <select
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.avatar?.startsWith('data:') || t.avatar?.startsWith('http') ? '👩‍🏫' : t.avatar} {t.name} ({t.classroom || 'Lớp 1'})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* PIN / Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      Mã PIN / Mật khẩu Giáo Viên:
                    </label>
                    <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Mặc định: 1234
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Nhập mã PIN (ví dụ: 1234)"
                      autoFocus
                      maxLength={16}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl text-base font-black tracking-widest text-slate-800 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal focus:outline-hidden transition-all text-center"
                    />
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Numeric Keypad for fast touch on tablet / smart TV */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1.5">
                  <div className="text-[10px] text-slate-500 font-bold text-center mb-1">
                    Bàn phím số nhanh:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleKeypadPress(num)}
                        className="py-2 bg-white hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-300 rounded-xl font-black text-base text-slate-700 active:scale-95 transition-all shadow-2xs cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleKeypadClear}
                      className="py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 active:scale-95 transition-all cursor-pointer"
                    >
                      Xóa hết
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="py-2 bg-white hover:bg-amber-50 hover:text-amber-700 border border-slate-200 hover:border-amber-300 rounded-xl font-black text-base text-slate-700 active:scale-95 transition-all shadow-2xs cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleKeypadDelete}
                      className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      ⌫ Xóa
                    </button>
                  </div>
                </div>

                {/* Remember Me checkbox & change PIN link */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    Ghi nhớ đăng nhập
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(true);
                      setErrorMessage(null);
                    }}
                    className="text-amber-700 hover:text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Đổi mã PIN
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng Nhập Vào Trang Giáo Viên
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-xs font-semibold">hoặc</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Google Workspace One-Click Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingInGoogle}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-slate-300 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Cloud className="w-4 h-4 text-blue-500" />
                {isLoggingInGoogle ? 'Đang kết nối Google...' : 'Đăng nhập với Google Giáo Viên'}
              </button>
            </>
          ) : (
            /* Change PIN Sub-form */
            <form onSubmit={handleChangePinSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 font-medium">
                🔒 Thầy/Cô có thể đặt mã PIN từ 4 đến 8 chữ số để bảo vệ Trang Giáo Viên khỏi học sinh tự ý vào.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã PIN hiện tại:
                </label>
                <input
                  type="password"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="Mã PIN cũ (mặc định là 1234)"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã PIN mới (tối thiểu 4 số):
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Nhập mã PIN mới"
                  required
                  maxLength={12}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Xác nhận mã PIN mới:
                </label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Nhập lại mã PIN mới"
                  required
                  maxLength={12}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPin(false);
                    setErrorMessage(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  Lưu Mã PIN Mới
                </button>
              </div>
            </form>
          )}

          {/* Quick Help for Teachers */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-600 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              Chế độ bảo mật giúp ngăn học sinh chỉnh sửa bài học và xóa dữ liệu.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
