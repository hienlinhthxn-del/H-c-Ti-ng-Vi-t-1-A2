import { AchievementBadge, AcademicRank, AchievementState } from '../types';

const STORAGE_KEY = 'tiengviet1_achievements_v1';

export const ALL_BADGES: AchievementBadge[] = [
  {
    id: 'first_lesson',
    title: 'Hạt Mầm Tri Thức',
    description: 'Hoàn thành bài đọc đầu tiên trên ứng dụng',
    icon: '🌱',
    category: 'reading_count',
    requiredCount: 1,
    tier: 'bronze'
  },
  {
    id: 'reading_3',
    title: 'Ngôi Sao Nhỏ',
    description: 'Đã hoàn thành xuất sắc 3 bài đọc',
    icon: '⭐',
    category: 'reading_count',
    requiredCount: 3,
    tier: 'bronze'
  },
  {
    id: 'reading_5',
    title: 'Bé Chăm Chỉ',
    description: 'Đã đọc và hoàn thành 5 bài học',
    icon: '📚',
    category: 'reading_count',
    requiredCount: 5,
    tier: 'bronze'
  },
  {
    id: 'reading_10',
    title: 'Dũng Sĩ Luyện Đọc',
    description: 'Hoàn thành 10 bài đọc Tiếng Việt',
    icon: '🏅',
    category: 'reading_count',
    requiredCount: 10,
    tier: 'silver'
  },
  {
    id: 'reading_20',
    title: 'Họa Mi Nhí',
    description: 'Chinh phục thành công 20 bài học',
    icon: '🦜',
    category: 'reading_count',
    requiredCount: 20,
    tier: 'silver'
  },
  {
    id: 'reading_35',
    title: 'Kiện Tướng Đọc Hay',
    description: 'Hoàn thành 35 bài đọc với thành tích cao',
    icon: '🏆',
    category: 'reading_count',
    requiredCount: 35,
    tier: 'gold'
  },
  {
    id: 'reading_50',
    title: 'Trạng Nguyên Nhí',
    description: 'Chinh phục 50 bài học xuất sắc',
    icon: '👑',
    category: 'reading_count',
    requiredCount: 50,
    tier: 'diamond'
  },
  {
    id: 'vol1_champion',
    title: 'Bậc Thầy Âm Vần (Tập 1)',
    description: 'Hoàn thành từ 25 bài đọc ở Tập 1',
    icon: '🥇',
    category: 'volume_completion',
    requiredCount: 25,
    tier: 'gold'
  },
  {
    id: 'vol2_champion',
    title: 'Nhà Thông Thái (Tập 2)',
    description: 'Hoàn thành từ 20 bài đọc ở Tập 2',
    icon: '🎖️',
    category: 'volume_completion',
    requiredCount: 20,
    tier: 'gold'
  },
  {
    id: 'rec_first',
    title: 'Phát Thanh Viên Đầu Tiên',
    description: 'Thu âm và nộp 1 bài đọc cho thầy cô',
    icon: '🎙️',
    category: 'recording_count',
    requiredCount: 1,
    tier: 'bronze'
  },
  {
    id: 'rec_5',
    title: 'Giọng Đọc Vàng',
    description: 'Thu âm và nộp 5 bài đọc xuất sắc',
    icon: '🌟',
    category: 'recording_count',
    requiredCount: 5,
    tier: 'silver'
  },
  {
    id: 'rec_15',
    title: 'Nghệ Sĩ Nhí Tỏa Sáng',
    description: 'Thu âm và nộp 15 bài đọc lưu loát',
    icon: '💎',
    category: 'recording_count',
    requiredCount: 15,
    tier: 'diamond'
  }
];

export const ACADEMIC_RANKS: AcademicRank[] = [
  {
    level: 1,
    title: 'Bé Mới Làm Quen',
    minCompletedLessons: 0,
    badgeIcon: '🐣',
    color: 'from-amber-400 to-yellow-500',
    description: 'Bé bắt đầu hành trình khám phá những con chữ đầu tiên!'
  },
  {
    level: 2,
    title: 'Bé Chăm Chỉ',
    minCompletedLessons: 3,
    badgeIcon: '🐥',
    color: 'from-emerald-400 to-teal-500',
    description: 'Bé đã quen dần với bảng chữ cái và các bài đọc!'
  },
  {
    level: 3,
    title: 'Chim Sơn Ca Nhí',
    minCompletedLessons: 8,
    badgeIcon: '🦜',
    color: 'from-sky-400 to-blue-500',
    description: 'Giọng đọc của bé trong trẻo và rành mạch như tiếng chim hót!'
  },
  {
    level: 4,
    title: 'Giọng Đọc Vàng',
    minCompletedLessons: 18,
    badgeIcon: '🌟',
    color: 'from-purple-400 to-indigo-500',
    description: 'Bé phát âm chuẩn, ngắt nghỉ đúng nhịp và tự tin!'
  },
  {
    level: 5,
    title: 'Trạng Nguyên Nhí',
    minCompletedLessons: 32,
    badgeIcon: '👑',
    color: 'from-amber-500 to-orange-600',
    description: 'Thành tích học tập vượt trội, đọc trôi chảy mọi bài văn thơ!'
  },
  {
    level: 6,
    title: 'Bậc Thầy Tiếng Việt 1',
    minCompletedLessons: 50,
    badgeIcon: '🏆',
    color: 'from-rose-500 via-pink-500 to-amber-400',
    description: 'Bé đã xuất sắc chinh phục trọn vẹn toàn bộ chương trình Tiếng Việt 1!'
  }
];

type AchievementSubscriber = (state: AchievementState, newBadges: AchievementBadge[]) => void;

class AchievementService {
  private subscribers: AchievementSubscriber[] = [];
  private state: AchievementState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AchievementState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load achievements from localStorage:', e);
    }
    return {
      completedLessonKeys: [],
      unlockedBadgeIds: [],
      totalRecordingsCount: 0,
      starsCount: 0
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save achievements to localStorage:', e);
    }
  }

  public reloadState() {
    this.state = this.loadState();
    this.notify([]);
  }

  public getState(): AchievementState {
    return { ...this.state };
  }

  public subscribe(cb: AchievementSubscriber): () => void {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private notify(newlyUnlockedBadges: AchievementBadge[]) {
    this.subscribers.forEach(cb => cb(this.getState(), newlyUnlockedBadges));
  }

  public isLessonCompleted(volume: 'vol1' | 'vol2', lessonId: number): boolean {
    const key = `${volume}_${lessonId}`;
    return this.state.completedLessonKeys.includes(key);
  }

  public setLessonCompleted(
    volume: 'vol1' | 'vol2',
    lessonId: number,
    completed: boolean
  ): { newlyCompleted: boolean; newBadges: AchievementBadge[] } {
    const key = `${volume}_${lessonId}`;
    const exists = this.state.completedLessonKeys.includes(key);

    if (completed && !exists) {
      this.state.completedLessonKeys.push(key);
      this.state.starsCount += 1;
      const newlyUnlocked = this.checkAndUnlockBadges();
      this.saveState();
      this.notify(newlyUnlocked);
      return { newlyCompleted: true, newBadges: newlyUnlocked };
    } else if (!completed && exists) {
      this.state.completedLessonKeys = this.state.completedLessonKeys.filter(k => k !== key);
      this.saveState();
      this.notify([]);
      return { newlyCompleted: false, newBadges: [] };
    }

    return { newlyCompleted: false, newBadges: [] };
  }

  public recordSubmissionAdded(): AchievementBadge[] {
    this.state.totalRecordingsCount += 1;
    const newlyUnlocked = this.checkAndUnlockBadges();
    this.saveState();
    this.notify(newlyUnlocked);
    return newlyUnlocked;
  }

  public incrementRecordingsCount(): { newBadges: AchievementBadge[] } {
    const newBadges = this.recordSubmissionAdded();
    return { newBadges };
  }

  public getCompletedLessonsCount(volume?: 'vol1' | 'vol2'): number {
    if (!volume) {
      return this.state.completedLessonKeys.length;
    }
    return this.state.completedLessonKeys.filter(k => k.startsWith(`${volume}_`)).length;
  }

  public getCurrentRank(): AcademicRank {
    const count = this.state.completedLessonKeys.length;
    let currentRank = ACADEMIC_RANKS[0];
    for (const rank of ACADEMIC_RANKS) {
      if (count >= rank.minCompletedLessons) {
        currentRank = rank;
      }
    }
    return currentRank;
  }

  public getNextRank(): AcademicRank | null {
    const current = this.getCurrentRank();
    const nextIdx = ACADEMIC_RANKS.findIndex(r => r.level === current.level) + 1;
    return nextIdx < ACADEMIC_RANKS.length ? ACADEMIC_RANKS[nextIdx] : null;
  }

  public getBadgesWithStatus(): AchievementBadge[] {
    return ALL_BADGES.map(badge => ({
      ...badge,
      unlockedAt: this.state.unlockedBadgeIds.includes(badge.id) ? 'unlocked' : undefined
    }));
  }

  private checkAndUnlockBadges(): AchievementBadge[] {
    const newlyUnlocked: AchievementBadge[] = [];
    const totalCompleted = this.state.completedLessonKeys.length;
    const vol1Completed = this.getCompletedLessonsCount('vol1');
    const vol2Completed = this.getCompletedLessonsCount('vol2');
    const totalRecordings = this.state.totalRecordingsCount;

    for (const badge of ALL_BADGES) {
      if (this.state.unlockedBadgeIds.includes(badge.id)) {
        continue;
      }

      let isEligible = false;
      if (badge.id === 'first_lesson' && totalCompleted >= 1) isEligible = true;
      if (badge.id === 'reading_3' && totalCompleted >= 3) isEligible = true;
      if (badge.id === 'reading_5' && totalCompleted >= 5) isEligible = true;
      if (badge.id === 'reading_10' && totalCompleted >= 10) isEligible = true;
      if (badge.id === 'reading_20' && totalCompleted >= 20) isEligible = true;
      if (badge.id === 'reading_35' && totalCompleted >= 35) isEligible = true;
      if (badge.id === 'reading_50' && totalCompleted >= 50) isEligible = true;

      if (badge.id === 'vol1_champion' && vol1Completed >= 25) isEligible = true;
      if (badge.id === 'vol2_champion' && vol2Completed >= 20) isEligible = true;

      if (badge.id === 'rec_first' && totalRecordings >= 1) isEligible = true;
      if (badge.id === 'rec_5' && totalRecordings >= 5) isEligible = true;
      if (badge.id === 'rec_15' && totalRecordings >= 15) isEligible = true;

      if (isEligible) {
        this.state.unlockedBadgeIds.push(badge.id);
        newlyUnlocked.push(badge);
      }
    }

    return newlyUnlocked;
  }
}

export const achievementService = new AchievementService();
