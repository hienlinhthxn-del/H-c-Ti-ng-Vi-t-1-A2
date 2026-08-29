import { AppUserProfile, UserRole } from '../types';
import { achievementService } from './achievementService';

const USERS_STORAGE_KEY = 'tiengviet1_multi_users_v1';
const ACTIVE_USER_ID_KEY = 'tiengviet1_active_user_id_v1';

export const AVATAR_OPTIONS = {
  student: ['🐰', '🐻', '🐱', '🐼', '🦁', '🚀', '🦄', '🐯', '🦊', '🐶', '🐸', '🐨', '🐥', '🦖', '🌟'],
  teacher: ['👩‍🏫', '👨‍🏫', '🎓', '📚', '🖋️'],
  parent: ['👨‍👩‍👧', '👩‍👧', '👨‍👦', '🏡', '❤️', '🌟']
};

const DEFAULT_PROFILES: AppUserProfile[] = [
  {
    id: 'student_dieulinh',
    name: 'Bé Diệu Linh',
    role: 'student',
    avatar: '🐰',
    studentCode: 'HS01',
    classroom: 'Lớp 1A',
    gender: 'female',
    starsCount: 18,
    completedLessonKeys: [
      'vol1_1', 'vol1_2', 'vol1_3', 'vol1_4', 'vol1_5',
      'vol1_6', 'vol1_7', 'vol1_8', 'vol1_9', 'vol1_10',
      'vol1_11', 'vol1_12', 'vol1_13', 'vol1_14', 'vol1_15',
      'vol1_16', 'vol1_17', 'vol1_18'
    ],
    unlockedBadgeIds: ['first_lesson', 'reading_3', 'reading_5', 'reading_10', 'rec_first'],
    totalRecordingsCount: 3,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'student_baonam',
    name: 'Bé Bảo Nam',
    role: 'student',
    avatar: '🦁',
    studentCode: 'HS02',
    classroom: 'Lớp 1A',
    gender: 'male',
    starsCount: 28,
    completedLessonKeys: [
      'vol1_1', 'vol1_2', 'vol1_3', 'vol1_4', 'vol1_5',
      'vol1_6', 'vol1_7', 'vol1_8', 'vol1_9', 'vol1_10',
      'vol1_11', 'vol1_12', 'vol1_13', 'vol1_14', 'vol1_15',
      'vol1_16', 'vol1_17', 'vol1_18', 'vol1_19', 'vol1_20',
      'vol1_21', 'vol1_22', 'vol1_23', 'vol1_24', 'vol1_25',
      'vol1_26', 'vol1_27', 'vol1_28'
    ],
    unlockedBadgeIds: ['first_lesson', 'reading_3', 'reading_5', 'reading_10', 'reading_20', 'vol1_champion', 'rec_first', 'rec_5'],
    totalRecordingsCount: 6,
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'student_tuankiet',
    name: 'Bé Tuấn Kiệt',
    role: 'student',
    avatar: '🚀',
    studentCode: 'HS03',
    classroom: 'Lớp 1A',
    gender: 'male',
    starsCount: 6,
    completedLessonKeys: ['vol1_1', 'vol1_2', 'vol1_3', 'vol1_4', 'vol1_5', 'vol1_6'],
    unlockedBadgeIds: ['first_lesson', 'reading_3', 'reading_5'],
    totalRecordingsCount: 1,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'teacher_mailinh',
    name: 'Cô Mai Linh',
    role: 'teacher',
    avatar: '👩‍🏫',
    classroom: 'Lớp 1A - Trường Tiểu học Chu Văn An',
    pinCode: '',
    starsCount: 0,
    completedLessonKeys: [],
    unlockedBadgeIds: [],
    totalRecordingsCount: 0,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'parent_dieulinh',
    name: 'Mẹ bé Diệu Linh',
    role: 'parent',
    avatar: '👨‍👩‍👧',
    classroom: 'Lớp 1A',
    linkedStudentIds: ['student_dieulinh'],
    starsCount: 0,
    completedLessonKeys: [],
    unlockedBadgeIds: [],
    totalRecordingsCount: 0,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    lastActiveAt: new Date().toISOString()
  }
];

type UserChangeListener = (activeUser: AppUserProfile, allUsers: AppUserProfile[]) => void;

class UserProfileService {
  private users: AppUserProfile[] = [];
  private activeUserId: string = 'student_dieulinh';
  private listeners: UserChangeListener[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        this.users = DEFAULT_PROFILES;
        this.saveUsers();
      }

      const storedActiveId = localStorage.getItem(ACTIVE_USER_ID_KEY);
      if (storedActiveId && this.users.some(u => u.id === storedActiveId)) {
        this.activeUserId = storedActiveId;
      } else if (this.users.length > 0) {
        this.activeUserId = this.users[0].id;
      }
    } catch (e) {
      console.error('Error initializing UserProfileService:', e);
      this.users = DEFAULT_PROFILES;
      this.activeUserId = 'student_dieulinh';
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }
  }

  private saveActiveUserId() {
    try {
      localStorage.setItem(ACTIVE_USER_ID_KEY, this.activeUserId);
    } catch (e) {
      console.error('Error saving active user ID:', e);
    }
  }

  public subscribe(listener: UserChangeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const active = this.getActiveUser();
    this.listeners.forEach(l => l(active, this.getAllUsers()));
  }

  public getAllUsers(): AppUserProfile[] {
    return [...this.users];
  }

  public getAllProfiles(): AppUserProfile[] {
    return this.getAllUsers();
  }

  public getUsersByRole(role: UserRole): AppUserProfile[] {
    return this.users.filter(u => u.role === role);
  }

  public getActiveUser(): AppUserProfile {
    let user = this.users.find(u => u.id === this.activeUserId);
    if (!user) {
      user = this.users[0] || DEFAULT_PROFILES[0];
      this.activeUserId = user.id;
    }
    return user;
  }

  public getActiveProfile(): AppUserProfile {
    return this.getActiveUser();
  }

  public getUserById(id: string): AppUserProfile | undefined {
    return this.users.find(u => u.id === id);
  }

  public switchUser(userId: string): AppUserProfile | null {
    const target = this.users.find(u => u.id === userId);
    if (!target) return null;

    // Update last active
    target.lastActiveAt = new Date().toISOString();
    this.activeUserId = userId;
    this.saveActiveUserId();
    this.saveUsers();

    // Sync student achievement state if it's a student
    if (target.role === 'student') {
      try {
        // Update achievements service state
        const achievementState = {
          completedLessonKeys: target.completedLessonKeys || [],
          unlockedBadgeIds: target.unlockedBadgeIds || [],
          totalRecordingsCount: target.totalRecordingsCount || 0,
          starsCount: target.starsCount || (target.completedLessonKeys ? target.completedLessonKeys.length : 0)
        };
        localStorage.setItem('tiengviet1_achievements_v1', JSON.stringify(achievementState));
      } catch (e) {
        console.error('Failed to sync achievement state on user switch:', e);
      }
    }

    this.notify();
    return target;
  }

  public setActiveUser(userId: string): AppUserProfile | null {
    return this.switchUser(userId);
  }

  public createUser(data: {
    name: string;
    role: UserRole;
    avatar?: string;
    classroom?: string;
    gender?: 'male' | 'female';
    studentCode?: string;
    pinCode?: string;
    linkedStudentIds?: string[];
  }): AppUserProfile {
    const id = `${data.role}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Choose appropriate default avatar if not supplied
    let defaultAvatar = '🐰';
    if (data.avatar) {
      defaultAvatar = data.avatar;
    } else if (data.role === 'teacher') {
      defaultAvatar = '👩‍🏫';
    } else if (data.role === 'parent') {
      defaultAvatar = '👨‍👩‍👧';
    }

    const newUser: AppUserProfile = {
      id,
      name: data.name.trim(),
      role: data.role,
      avatar: defaultAvatar,
      studentCode: data.studentCode || (data.role === 'student' ? `HS${String(this.getUsersByRole('student').length + 1).padStart(2, '0')}` : undefined),
      classroom: data.classroom?.trim() || 'Lớp 1A',
      gender: data.gender || 'male',
      pinCode: data.pinCode || '',
      linkedStudentIds: data.linkedStudentIds || [],
      starsCount: 0,
      completedLessonKeys: [],
      unlockedBadgeIds: [],
      totalRecordingsCount: 0,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    this.switchUser(newUser.id);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<AppUserProfile>): AppUserProfile | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updates,
      lastActiveAt: new Date().toISOString()
    };

    this.saveUsers();
    this.notify();
    return this.users[index];
  }

  public deleteUser(id: string): boolean {
    if (this.users.length <= 1) {
      return false; // Can't delete the only user
    }

    this.users = this.users.filter(u => u.id !== id);
    if (this.activeUserId === id) {
      this.activeUserId = this.users[0].id;
      this.saveActiveUserId();
    }

    this.saveUsers();
    this.notify();
    return true;
  }

  // Update current active student progress
  public recordLessonCompletion(lessonKey: string, isCompleted: boolean) {
    const active = this.getActiveUser();
    if (active.role !== 'student') return;

    const completed = new Set(active.completedLessonKeys || []);
    if (isCompleted) {
      completed.add(lessonKey);
    } else {
      completed.delete(lessonKey);
    }

    active.completedLessonKeys = Array.from(completed);
    active.starsCount = active.completedLessonKeys.length;
    this.saveUsers();
    this.notify();
  }

  // Record student recording activity
  public recordRecordingAdded() {
    const active = this.getActiveUser();
    if (active.role !== 'student') return;

    active.totalRecordingsCount = (active.totalRecordingsCount || 0) + 1;
    this.saveUsers();
    this.notify();
  }

  // Export all users & data package for classroom multi-device transfer
  public exportUsersPackage(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      users: this.users
    };
    return JSON.stringify(data, null, 2);
  }

  // Import users package
  public importUsersPackage(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.users || !Array.isArray(data.users)) {
        return { success: false, count: 0, error: 'Dữ liệu hồ sơ không đúng định dạng.' };
      }

      // Merge or replace
      const validUsers: AppUserProfile[] = data.users.filter((u: any) => u.id && u.name && u.role);
      if (validUsers.length === 0) {
        return { success: false, count: 0, error: 'Không tìm thấy hồ sơ hợp lệ trong tệp.' };
      }

      // Merge preserving existing IDs
      const userMap = new Map<string, AppUserProfile>();
      this.users.forEach(u => userMap.set(u.id, u));
      validUsers.forEach(u => userMap.set(u.id, u));

      this.users = Array.from(userMap.values());
      this.saveUsers();
      this.notify();

      return { success: true, count: validUsers.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message || 'Lỗi đọc tệp dữ liệu' };
    }
  }

  // Reset to sample profiles
  public resetToDefaultProfiles() {
    this.users = [...DEFAULT_PROFILES];
    this.activeUserId = 'student_dieulinh';
    this.saveUsers();
    this.saveActiveUserId();
    this.notify();
  }
}

export const userProfileService = new UserProfileService();
