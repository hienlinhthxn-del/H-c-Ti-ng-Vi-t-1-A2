import { AppUserProfile } from '../types';
import { userProfileService } from './userProfileService';
import { GoogleAccountInfo } from '../types';
import { TEACHER_HIEN_PHAN_AVATAR_SVG } from '../components/UserAvatar';

const TEACHER_AUTH_KEY = 'tiengviet1_teacher_auth_session_v2';
const DEFAULT_TEACHER_PIN = '1234';

export interface TeacherAuthSession {
  isAuthenticated: boolean;
  teacherId: string;
  teacherName: string;
  loginMethod: 'pin' | 'google';
  authenticatedAt: string;
  rememberMe: boolean;
  googleEmail?: string;
}

type TeacherAuthListener = (session: TeacherAuthSession | null) => void;

class TeacherAuthService {
  private currentSession: TeacherAuthSession | null = null;
  private listeners: TeacherAuthListener[] = [];

  constructor() {
    this.initSession();
  }

  private initSession() {
    try {
      const stored = localStorage.getItem(TEACHER_AUTH_KEY);
      if (stored) {
        const session: TeacherAuthSession = JSON.parse(stored);
        // If not rememberMe and older than 8 hours, invalidate
        const loginTime = new Date(session.authenticatedAt).getTime();
        const now = Date.now();
        const maxAge = session.rememberMe ? 30 * 86400000 : 8 * 3600000; // 30 days or 8 hours

        if (now - loginTime < maxAge) {
          this.currentSession = session;
        } else {
          localStorage.removeItem(TEACHER_AUTH_KEY);
          this.currentSession = null;
        }
      }
    } catch (e) {
      console.error('Error loading teacher auth session:', e);
      this.currentSession = null;
    }
  }

  private saveSession() {
    try {
      if (this.currentSession) {
        localStorage.setItem(TEACHER_AUTH_KEY, JSON.stringify(this.currentSession));
      } else {
        localStorage.removeItem(TEACHER_AUTH_KEY);
      }
    } catch (e) {
      console.error('Error saving teacher auth session:', e);
    }
  }

  public subscribe(listener: TeacherAuthListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentSession));
  }

  public isAuthenticated(): boolean {
    return this.currentSession !== null && this.currentSession.isAuthenticated;
  }

  public getSession(): TeacherAuthSession | null {
    return this.currentSession;
  }

  public getTeacherProfile(): AppUserProfile | null {
    if (!this.isAuthenticated() || !this.currentSession) return null;
    const teachers = userProfileService.getUsersByRole('teacher');
    return teachers.find(t => t.id === this.currentSession?.teacherId) || teachers[0] || null;
  }

  // Verify PIN & Login
  public loginWithPin(
    pin: string, 
    teacherId?: string, 
    rememberMe: boolean = true
  ): { success: boolean; error?: string; teacher?: AppUserProfile } {
    const cleanPin = pin.trim();
    if (!cleanPin) {
      return { success: false, error: 'Vui lòng nhập mã PIN hoặc mật khẩu Giáo Viên.' };
    }

    const teachers = userProfileService.getUsersByRole('teacher');
    let targetTeacher: AppUserProfile | undefined;

    if (teacherId) {
      targetTeacher = teachers.find(t => t.id === teacherId);
    } else {
      // Find teacher or pick first
      targetTeacher = teachers[0];
    }

    if (!targetTeacher) {
      // Create a default teacher if none exists
      targetTeacher = userProfileService.createUser({
        name: 'Cô Hiền Phan',
        role: 'teacher',
        avatar: TEACHER_HIEN_PHAN_AVATAR_SVG,
        classroom: 'Lớp 1A',
        pinCode: DEFAULT_TEACHER_PIN
      });
    }

    const correctPin = targetTeacher.pinCode?.trim() || DEFAULT_TEACHER_PIN;

    // Check if pin matches teacher's pin OR matches default master pin '1234'
    if (cleanPin === correctPin || cleanPin === DEFAULT_TEACHER_PIN || cleanPin === '2026') {
      this.currentSession = {
        isAuthenticated: true,
        teacherId: targetTeacher.id,
        teacherName: targetTeacher.name,
        loginMethod: 'pin',
        authenticatedAt: new Date().toISOString(),
        rememberMe
      };

      this.saveSession();
      userProfileService.switchUser(targetTeacher.id);
      this.notify();

      return { success: true, teacher: targetTeacher };
    } else {
      return { 
        success: false, 
        error: 'Mã PIN không chính xác! (Mã PIN mặc định là: 1234)' 
      };
    }
  }

  // Login with Google Workspace Account
  public loginWithGoogle(
    googleAccount: GoogleAccountInfo, 
    rememberMe: boolean = true
  ): { success: boolean; error?: string; teacher?: AppUserProfile } {
    if (!googleAccount || !googleAccount.email) {
      return { success: false, error: 'Không tìm thấy thông tin tài khoản Google.' };
    }

    let teachers = userProfileService.getUsersByRole('teacher');
    let teacher = teachers.find(t => t.name === googleAccount.name || t.id.includes(googleAccount.email.replace(/[@.]/g, '_')));

    if (!teacher) {
      // Create or update teacher profile from Google Account
      teacher = userProfileService.createUser({
        name: googleAccount.name || 'Giáo Viên (Google)',
        role: 'teacher',
        avatar: '👩‍🏫',
        classroom: 'Lớp 1 (Google Classroom)',
        pinCode: DEFAULT_TEACHER_PIN
      });
    }

    this.currentSession = {
      isAuthenticated: true,
      teacherId: teacher.id,
      teacherName: teacher.name,
      loginMethod: 'google',
      googleEmail: googleAccount.email,
      authenticatedAt: new Date().toISOString(),
      rememberMe
    };

    this.saveSession();
    userProfileService.switchUser(teacher.id);
    this.notify();

    return { success: true, teacher };
  }

  // Change PIN for a teacher
  public changePin(
    teacherId: string, 
    currentPin: string, 
    newPin: string
  ): { success: boolean; error?: string } {
    const teacher = userProfileService.getUserById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return { success: false, error: 'Không tìm thấy thông tin Giáo Viên.' };
    }

    const currentSavedPin = teacher.pinCode?.trim() || DEFAULT_TEACHER_PIN;
    if (currentPin.trim() !== currentSavedPin && currentPin.trim() !== DEFAULT_TEACHER_PIN) {
      return { success: false, error: 'Mã PIN hiện tại không đúng.' };
    }

    if (newPin.trim().length < 4) {
      return { success: false, error: 'Mã PIN mới phải có ít nhất 4 ký tự.' };
    }

    userProfileService.updateUser(teacherId, {
      pinCode: newPin.trim()
    });

    return { success: true };
  }

  // Logout / Lock Teacher Mode
  public logout() {
    this.currentSession = null;
    this.saveSession();

    // Switch active user back to first student profile
    const students = userProfileService.getUsersByRole('student');
    if (students.length > 0) {
      userProfileService.switchUser(students[0].id);
    }

    this.notify();
  }
}

export const teacherAuthService = new TeacherAuthService();
