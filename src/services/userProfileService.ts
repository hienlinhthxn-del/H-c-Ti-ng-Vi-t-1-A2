import { AppUserProfile, UserRole } from '../types';
import { achievementService } from './achievementService';
import { classAnalyticsService } from './classAnalyticsService';
import { TEACHER_HIEN_PHAN_AVATAR_SVG } from '../components/UserAvatar';
import { db } from './firebaseConfig';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

const USERS_STORAGE_KEY = 'tiengviet1_multi_users_v4';
const ACTIVE_USER_ID_KEY = 'tiengviet1_active_user_id_v4';
const CLOUD_USERS_COLLECTION = 'app_users';

export const AVATAR_OPTIONS = {
  student: ['🐰', '🐻', '🐱', '🐼', '🦁', '🚀', '🦄', '🐯', '🦊', '🐶', '🐸', '🐨', '🐥', '🦖', '🌟', '🌸', '💎', '🌿', '🎀', '🌻', '🐲', '📚'],
  teacher: [TEACHER_HIEN_PHAN_AVATAR_SVG, '👩‍🏫', '👨‍🏫', '🎓', '📚', '🖋️'],
  parent: ['👨‍👩‍👧', '👩‍👧', '👨‍👦', '🏡', '❤️', '🌟']
};

export const CLASS_ROSTER_STUDENTS = [
  { code: 'HS01', name: 'Tòng Hoài An', gender: 'male' as const, avatar: '🐰' },
  { code: 'HS02', name: 'Lò Huyền Anh', gender: 'female' as const, avatar: '🌸' },
  { code: 'HS03', name: 'Nguyễn Hoàng Tú Anh', gender: 'male' as const, avatar: '🚀' },
  { code: 'HS04', name: 'Nguyễn Phương Anh', gender: 'female' as const, avatar: '🐱' },
  { code: 'HS05', name: 'Mùa Ngọc Bích', gender: 'female' as const, avatar: '💎' },
  { code: 'HS06', name: 'Nguyễn Ngọc Diệp', gender: 'female' as const, avatar: '🌿' },
  { code: 'HS07', name: 'Lê Nguyễn Linh Đan', gender: 'female' as const, avatar: '🦄' },
  { code: 'HS08', name: 'Nguyễn Hải Đăng', gender: 'male' as const, avatar: '🦁' },
  { code: 'HS09', name: 'Tô Hải Đăng', gender: 'male' as const, avatar: '🌟' },
  { code: 'HS10', name: 'Giàng Hương Giang', gender: 'female' as const, avatar: '🐻' },
  { code: 'HS11', name: 'Lò Thị Ngọc Hân', gender: 'female' as const, avatar: '🎀' },
  { code: 'HS12', name: 'Giàng Ngọc Bảo Hân', gender: 'female' as const, avatar: '🦊' },
  { code: 'HS13', name: 'Nguyễn Văn Khải', gender: 'male' as const, avatar: '🐯' },
  { code: 'HS14', name: 'Nguyễn Khang', gender: 'male' as const, avatar: '🚀' },
  { code: 'HS15', name: 'Tòng Minh Khôi', gender: 'male' as const, avatar: '🐶' },
  { code: 'HS16', name: 'Đặng Anh Khôi', gender: 'male' as const, avatar: '🐼' },
  { code: 'HS17', name: 'Khoàng Trang Lê', gender: 'female' as const, avatar: '🌻' },
  { code: 'HS18', name: 'Đoàn Khánh Linh', gender: 'female' as const, avatar: '🐰' },
  { code: 'HS19', name: 'Nguyễn Hoàng Long', gender: 'male' as const, avatar: '🐲' },
  { code: 'HS20', name: 'Nông Ngọc Khải Minh', gender: 'male' as const, avatar: '🐨' },
  { code: 'HS21', name: 'Phạm Hải Nam', gender: 'male' as const, avatar: '🦁' },
  { code: 'HS22', name: 'Tòng Thị Kim Ngân', gender: 'female' as const, avatar: '🐥' },
  { code: 'HS23', name: 'Trần Bảo Ngân', gender: 'female' as const, avatar: '🌸' },
  { code: 'HS24', name: 'Cao Đăng Phúc', gender: 'male' as const, avatar: '🐸' },
  { code: 'HS25', name: 'Nguyễn Ngọc Anh Tú', gender: 'male' as const, avatar: '🌟' },
  { code: 'HS26', name: 'Vừ Chí Thiện', gender: 'male' as const, avatar: '🦖' },
  { code: 'HS27', name: 'Sùng Minh Thư', gender: 'female' as const, avatar: '📚' },
  { code: 'HS28', name: 'Lò Nhã Uyên', gender: 'female' as const, avatar: '🐱' }
];

const DEFAULT_PROFILES: AppUserProfile[] = [
  ...CLASS_ROSTER_STUDENTS.map((st) => ({
    id: `student_hs_${st.code.toLowerCase()}`,
    name: st.name,
    role: 'student' as UserRole,
    avatar: st.avatar,
    studentCode: st.code,
    classroom: 'Lớp 1A2',
    gender: st.gender,
    starsCount: 0,
    completedLessonKeys: [],
    unlockedBadgeIds: [],
    totalRecordingsCount: 0,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  })),
  {
    id: 'teacher_hienphan',
    name: 'Cô Hiền Phan',
    role: 'teacher',
    avatar: TEACHER_HIEN_PHAN_AVATAR_SVG,
    classroom: 'Lớp 1A2',
    pinCode: '1234',
    starsCount: 0,
    completedLessonKeys: [],
    unlockedBadgeIds: [],
    totalRecordingsCount: 0,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  },
  {
    id: 'parent_lop1',
    name: 'Phụ Huynh Học Sinh',
    role: 'parent',
    avatar: '👨‍👩‍👧',
    classroom: 'Lớp 1A2',
    linkedStudentIds: ['student_hs_hs01'],
    starsCount: 0,
    completedLessonKeys: [],
    unlockedBadgeIds: [],
    totalRecordingsCount: 0,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString()
  }
];

type UserChangeListener = (activeUser: AppUserProfile, allUsers: AppUserProfile[]) => void;

class UserProfileService {
  private users: AppUserProfile[] = [];
  private activeUserId: string = 'student_hs_hs01';
  private listeners: UserChangeListener[] = [];

  constructor() {
    this.init();
    if (typeof window !== 'undefined') {
      this.initFirebaseSync();
    }
  }

  private initFirebaseSync() {
    try {
      const q = query(collection(db, CLOUD_USERS_COLLECTION));
      onSnapshot(
        q,
        (snapshot) => {
          let changed = false;
          const userMap = new Map<string, AppUserProfile>();
          this.users.forEach((u) => userMap.set(u.id, u));

          snapshot.docChanges().forEach((change) => {
            const cloudUser = change.doc.data() as AppUserProfile;
            if (change.type === 'removed') {
              if (userMap.has(change.doc.id) && userMap.size > 1) {
                userMap.delete(change.doc.id);
                changed = true;
              }
            } else if (cloudUser && cloudUser.id && cloudUser.name) {
              if (!cloudUser.classroom || cloudUser.classroom === 'Lớp 1' || cloudUser.classroom === 'Lớp 1A') {
                cloudUser.classroom = 'Lớp 1A2';
              }
              const local = userMap.get(cloudUser.id);
              if (!local) {
                userMap.set(cloudUser.id, cloudUser);
                changed = true;
              } else {
                // Merge progress across devices so no student progress is lost
                const mergedCompleted = Array.from(
                  new Set([...(local.completedLessonKeys || []), ...(cloudUser.completedLessonKeys || [])])
                );
                const mergedBadges = Array.from(
                  new Set([...(local.unlockedBadgeIds || []), ...(cloudUser.unlockedBadgeIds || [])])
                );
                const mergedStars = Math.max(local.starsCount || 0, cloudUser.starsCount || 0);
                const mergedRecs = Math.max(local.totalRecordingsCount || 0, cloudUser.totalRecordingsCount || 0);

                if (
                  mergedCompleted.length !== (local.completedLessonKeys || []).length ||
                  mergedStars !== (local.starsCount || 0) ||
                  mergedRecs !== (local.totalRecordingsCount || 0) ||
                  cloudUser.name !== local.name ||
                  cloudUser.classroom !== local.classroom ||
                  cloudUser.avatar !== local.avatar
                ) {
                  userMap.set(cloudUser.id, {
                    ...local,
                    ...cloudUser,
                    completedLessonKeys: mergedCompleted,
                    unlockedBadgeIds: mergedBadges,
                    starsCount: mergedStars,
                    totalRecordingsCount: mergedRecs
                  });
                  changed = true;
                }
              }
            }
          });

          if (changed) {
            this.users = Array.from(userMap.values());
            try {
              localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
            } catch (e) {}
            this.notify();
          }
        },
        (err) => {
          console.warn('Firebase sync warning for app_users:', err);
        }
      );
    } catch (err) {
      console.warn('Could not initialize Firebase sync for app_users:', err);
    }
  }

  private syncUserToCloud(user: AppUserProfile) {
    if (typeof window === 'undefined') return;
    try {
      const cleanUser = JSON.parse(JSON.stringify(user));
      setDoc(doc(db, CLOUD_USERS_COLLECTION, user.id), cleanUser, { merge: true }).catch((err) => {
        console.warn('Failed to sync user to cloud:', err);
      });
    } catch (e) {
      console.warn('Error syncing user to cloud:', e);
    }
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        // Normalize default classroom 'Lớp 1' / 'Lớp 1A' -> 'Lớp 1A2'
        let migrated = false;
        this.users = this.users.map(u => {
          if (!u.classroom || u.classroom === 'Lớp 1' || u.classroom === 'Lớp 1A') {
            migrated = true;
            return { ...u, classroom: 'Lớp 1A2' };
          }
          return u;
        });
        // If users list is outdated (doesn't have 28 students), merge/seed default roster
        if (this.users.filter(u => u.role === 'student').length < 10) {
          this.users = DEFAULT_PROFILES;
          migrated = true;
        }
        if (migrated) {
          this.saveUsers();
        }
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
      this.activeUserId = 'student_hs_hs01';
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
        // Force achievement service to reload from memory so UI updates immediately
        setTimeout(() => achievementService.reloadState(), 0);
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
      classroom: data.classroom?.trim() || 'Lớp 1A2',
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
    this.syncUserToCloud(newUser);

    // Also ensure new student exists in ClassAnalyticsService roster
    if (newUser.role === 'student') {
      try {
        const existingInClass = classAnalyticsService.findStudent({
          id: newUser.id,
          code: newUser.studentCode,
          name: newUser.name
        });
        if (!existingInClass) {
          const targetClassRoom = classAnalyticsService.findOrCreateClassByName(newUser.classroom || 'Lớp 1A2');
          classAnalyticsService.addStudent({
            studentCode: newUser.studentCode || 'HS99',
            name: newUser.name,
            gender: newUser.gender || 'male',
            classId: targetClassRoom.id,
            avatar: newUser.avatar,
            status: 'average',
            teacherNotes: ''
          });
        }
      } catch (e) {
        console.warn('Could not sync new student to ClassAnalyticsService:', e);
      }
    }

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
    this.syncUserToCloud(this.users[index]);
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
    try {
      deleteDoc(doc(db, CLOUD_USERS_COLLECTION, id)).catch(() => {});
    } catch (e) {}
    this.notify();
    return true;
  }

  // Update current active student progress
  public recordLessonCompletion(
    lessonKey: string, 
    isCompleted: boolean,
    lessonMeta?: {
      volume: 'vol1' | 'vol2';
      lessonNumber: number;
      lessonTitle: string;
      practiceType?: 'reading' | 'writing' | 'recording';
    }
  ) {
    const active = this.getActiveUser();
    if (active.role !== 'student') return;

    const completed = new Set(active.completedLessonKeys || []);
    if (isCompleted) {
      completed.add(lessonKey);
    } else {
      completed.delete(lessonKey);
    }

    active.completedLessonKeys = Array.from(completed);
    active.starsCount = Math.max(active.starsCount || 0, active.completedLessonKeys.length);
    active.lastActiveAt = new Date().toISOString();
    this.saveUsers();
    this.syncUserToCloud(active);
    this.notify();

    // Sync to Class Analytics Service for real-time gradebook and stats
    try {
      const volume = lessonMeta?.volume || (lessonKey.startsWith('vol2_') ? 'vol2' : 'vol1');
      const lessonNum = lessonMeta?.lessonNumber || parseInt(lessonKey.replace(/^[a-z0-9]+_/, ''), 10) || 1;
      const lessonTitle = lessonMeta?.lessonTitle || `Bài ${lessonNum}`;
      
      classAnalyticsService.recordStudentLessonActivity(
        { code: active.studentCode, id: active.id, name: active.name },
        {
          lessonKey,
          volume,
          lessonNumber: lessonNum,
          lessonTitle,
          isCompleted,
          scoreStars: 5,
          practiceType: lessonMeta?.practiceType || 'reading'
        }
      );
    } catch (e) {
      console.error('Failed to sync lesson completion to class analytics:', e);
    }
  }

  // Record student recording activity
  public recordRecordingAdded(info?: {
    lessonKey?: string;
    volume?: 'vol1' | 'vol2';
    lessonNumber?: number;
    lessonTitle?: string;
  }) {
    const active = this.getActiveUser();
    if (active.role !== 'student') return;

    active.totalRecordingsCount = (active.totalRecordingsCount || 0) + 1;
    active.starsCount = (active.starsCount || 0) + 1;
    active.lastActiveAt = new Date().toISOString();
    this.saveUsers();
    this.syncUserToCloud(active);
    this.notify();

    // Sync to Class Analytics
    try {
      classAnalyticsService.recordStudentVoiceSubmission(
        { code: active.studentCode, id: active.id, name: active.name },
        info || {}
      );
    } catch (e) {
      console.error('Failed to sync recording to class analytics:', e);
    }
  }

  // Record student writing activity
  public recordWritingAdded(sampleText?: string) {
    const active = this.getActiveUser();
    if (active.role !== 'student') return;

    active.starsCount = (active.starsCount || 0) + 1;
    active.lastActiveAt = new Date().toISOString();
    this.saveUsers();
    this.notify();

    // Sync to Class Analytics
    try {
      classAnalyticsService.recordStudentWritingSubmission(
        { code: active.studentCode, id: active.id, name: active.name },
        sampleText
      );
    } catch (e) {
      console.error('Failed to sync writing to class analytics:', e);
    }
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

  // Reset all student progress to 0 (clean slate with names preserved)
  public resetAllProgress() {
    this.users = this.users.map(u => {
      if (u.role === 'student') {
        return {
          ...u,
          starsCount: 0,
          completedLessonKeys: [],
          unlockedBadgeIds: [],
          totalRecordingsCount: 0,
          lastActiveAt: new Date().toISOString()
        };
      }
      return u;
    });
    this.saveUsers();
    this.notify();
  }

  // Reset to sample profiles
  public resetToDefaultProfiles() {
    this.users = [...DEFAULT_PROFILES];
    this.activeUserId = this.users[0]?.id || 'teacher_hienphan';
    this.saveUsers();
    this.saveActiveUserId();
    this.notify();
  }
}

export const userProfileService = new UserProfileService();
