import { AchievementBadge } from '../types';
import { speechService } from './speechService';

const COMPLETED_VOL1_KEY = 'tv1_completed_vol1_lessons';
const COMPLETED_VOL2_KEY = 'tv1_completed_vol2_lessons';
const UNLOCKED_BADGES_KEY = 'tv1_unlocked_badges_data';
const PRACTICE_COUNT_KEY = 'tv1_practice_writing_count';
const RECORDINGS_COUNT_KEY = 'tv1_voice_recordings_count';

export const BADGE_DEFINITIONS: Omit<AchievementBadge, 'unlockedAt'>[] = [
  {
    id: 'first_step',
    title: 'Mầm Xanh Chăm Chỉ',
    subtitle: 'Hoàn thành 1 bài đọc đầu tiên',
    description: 'Bé đã bắt đầu bước chân đầu tiên vào thế giới chữ cái và âm vần rực rỡ!',
    icon: '🌱',
    color: 'from-emerald-400 to-teal-500',
    category: 'total_reading',
    requirementType: 'lessons_completed',
    requiredCount: 1,
    rewardStars: 3
  },
  {
    id: 'confident_reader_5',
    title: 'Bé Đọc Tự Tin',
    subtitle: 'Hoàn thành 5 bài đọc',
    description: 'Đọc to, rõ ràng và trôi chảy 5 bài học vần đầu tiên. Rất đáng khen ngợi!',
    icon: '⭐',
    color: 'from-amber-400 to-orange-500',
    category: 'total_reading',
    requirementType: 'lessons_completed',
    requiredCount: 5,
    rewardStars: 5
  },
  {
    id: 'phonics_detective_10',
    title: 'Thám Tử Âm Vần',
    subtitle: 'Hoàn thành 10 bài đọc',
    description: 'Nhận diện nhanh như chớp các âm đầu, âm chính và dấu thanh quen thuộc!',
    icon: '🔍',
    color: 'from-blue-400 to-indigo-600',
    category: 'vol1_lessons',
    requirementType: 'vol1_lessons',
    requiredCount: 10,
    rewardStars: 6
  },
  {
    id: 'vietnamese_star_20',
    title: 'Ngôi Sao Âm Vần',
    subtitle: 'Hoàn thành 20 bài đọc',
    description: 'Làm chủ 20 bài học vần, ghép tiếng và đọc câu lưu loát như học sinh gương mẫu!',
    icon: '🌟',
    color: 'from-yellow-400 to-amber-600',
    category: 'vol1_lessons',
    requirementType: 'vol1_lessons',
    requiredCount: 20,
    rewardStars: 8
  },
  {
    id: 'reading_knight_35',
    title: 'Dũng Sĩ Đọc Sách',
    subtitle: 'Hoàn thành 35 bài đọc',
    description: 'Chinh phục gần nửa chặng đường Tập 1! Bé ngày càng thông minh và yêu sách!',
    icon: '🛡️',
    color: 'from-rose-400 to-red-600',
    category: 'vol1_lessons',
    requirementType: 'vol1_lessons',
    requiredCount: 35,
    rewardStars: 10
  },
  {
    id: 'wise_owl_50',
    title: 'Nhà Thông Thái Nhí',
    subtitle: 'Hoàn thành 50 bài đọc',
    description: 'Hiểu bài sâu sắc, phát âm chuẩn xác hơn 50 bài học vần phức tạp!',
    icon: '🦉',
    color: 'from-purple-400 to-indigo-600',
    category: 'vol1_lessons',
    requirementType: 'vol1_lessons',
    requiredCount: 50,
    rewardStars: 12
  },
  {
    id: 'grandmaster_70',
    title: 'Đại Kiện Tướng Đọc',
    subtitle: 'Hoàn thành 70 bài đọc',
    description: 'Khả năng đọc lưu loát, vượt trội, sẵn sàng bước vào chặng về đích!',
    icon: '🏆',
    color: 'from-cyan-400 to-blue-600',
    category: 'vol1_lessons',
    requirementType: 'vol1_lessons',
    requiredCount: 70,
    rewardStars: 15
  },
  {
    id: 'scholar_vol1_83',
    title: 'Trạng Nguyên Tập 1',
    subtitle: 'Hoàn thành trọn vẹn 83 bài Tập 1',
    description: 'Vinh quang bảng vàng! Bé đã hoàn thành xuất sắc toàn bộ 83 bài học vần!',
    icon: '👑',
    color: 'from-amber-300 via-yellow-400 to-orange-500',
    category: 'vol1_lessons',
    requirementType: 'vol1_lessons',
    requiredCount: 83,
    rewardStars: 25
  },
  {
    id: 'world_explorer_vol2_5',
    title: 'Nhà Thám Hiểm Tập 2',
    subtitle: 'Hoàn thành 5 bài đọc hiểu Tập 2',
    description: 'Khám phá những câu chuyện và bài thơ ý nghĩa về mái trường, gia đình và thiên nhiên!',
    icon: '🌈',
    color: 'from-emerald-400 to-teal-600',
    category: 'vol2_lessons',
    requirementType: 'vol2_lessons',
    requiredCount: 5,
    rewardStars: 8
  },
  {
    id: 'handwriting_artist_5',
    title: 'Nét Chữ Nết Người',
    subtitle: 'Luyện viết 5 lần trên Vở Ô Ly',
    description: 'Chăm chỉ nắn nót từng con chữ ngay ngắn, sạch đẹp trên trang vở ô ly!',
    icon: '✍️',
    color: 'from-pink-400 to-rose-500',
    category: 'practice',
    requirementType: 'practice_count',
    requiredCount: 5,
    rewardStars: 5
  },
  {
    id: 'golden_voice_3',
    title: 'Giọng Đọc Họa Mi',
    subtitle: 'Thu âm 3 bài đọc trong Phòng Thu',
    description: 'Tự tin cất cao giọng đọc truyền cảm, lưu giữ những bản thu âm tuyệt vời!',
    icon: '🎙️',
    color: 'from-violet-400 to-purple-600',
    category: 'voice_recording',
    requirementType: 'recordings_count',
    requiredCount: 3,
    rewardStars: 6
  },
  {
    id: 'supreme_champion_100',
    title: 'Trạng Nguyên Toàn Năng',
    subtitle: 'Đạt mốc 90 bài học hoàn thành',
    description: 'Thành tích siêu đẳng! Bé là tấm gương sáng học giỏi môn Tiếng Việt!',
    icon: '🥇',
    color: 'from-amber-400 via-rose-500 to-purple-600',
    category: 'total_reading',
    requirementType: 'lessons_completed',
    requiredCount: 90,
    rewardStars: 30
  }
];

class AchievementService {
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (err) {
        console.error('Error in achievement subscriber:', err);
      }
    });
  }

  // --- Completed Lessons Management ---
  getCompletedVol1Lessons(): number[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(COMPLETED_VOL1_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getCompletedVol2Lessons(): number[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(COMPLETED_VOL2_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isLessonCompleted(volume: 'vol1' | 'vol2', lessonId: number): boolean {
    const list = volume === 'vol1' ? this.getCompletedVol1Lessons() : this.getCompletedVol2Lessons();
    return list.includes(lessonId);
  }

  // Toggle or Mark Lesson Completion
  setLessonCompleted(volume: 'vol1' | 'vol2', lessonId: number, completed: boolean): { newlyCompleted: boolean; newBadges: AchievementBadge[] } {
    if (typeof window === 'undefined') return { newlyCompleted: false, newBadges: [] };

    const currentList = volume === 'vol1' ? this.getCompletedVol1Lessons() : this.getCompletedVol2Lessons();
    const isAlready = currentList.includes(lessonId);

    if (completed && !isAlready) {
      const updated = [...currentList, lessonId];
      localStorage.setItem(volume === 'vol1' ? COMPLETED_VOL1_KEY : COMPLETED_VOL2_KEY, JSON.stringify(updated));
      const newBadges = this.checkAndUnlockBadges();
      this.notify();
      return { newlyCompleted: true, newBadges };
    } else if (!completed && isAlready) {
      const updated = currentList.filter(id => id !== lessonId);
      localStorage.setItem(volume === 'vol1' ? COMPLETED_VOL1_KEY : COMPLETED_VOL2_KEY, JSON.stringify(updated));
      this.notify();
      return { newlyCompleted: false, newBadges: [] };
    }

    return { newlyCompleted: false, newBadges: [] };
  }

  // --- Practice & Recording Counters ---
  getPracticeCount(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const val = localStorage.getItem(PRACTICE_COUNT_KEY);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  incrementPracticeCount(): AchievementBadge[] {
    if (typeof window === 'undefined') return [];
    const current = this.getPracticeCount() + 1;
    localStorage.setItem(PRACTICE_COUNT_KEY, current.toString());
    const newBadges = this.checkAndUnlockBadges();
    this.notify();
    return newBadges;
  }

  getRecordingsCount(): number {
    if (typeof window === 'undefined') return 0;
    try {
      // Check stored audio recordings in localStorage if any, or counter
      const val = localStorage.getItem(RECORDINGS_COUNT_KEY);
      const audioList = localStorage.getItem('tv1_student_recordings');
      const countFromList = audioList ? JSON.parse(audioList).length : 0;
      return Math.max(val ? parseInt(val, 10) : 0, countFromList);
    } catch {
      return 0;
    }
  }

  incrementRecordingsCount(): AchievementBadge[] {
    if (typeof window === 'undefined') return [];
    const current = this.getRecordingsCount() + 1;
    localStorage.setItem(RECORDINGS_COUNT_KEY, current.toString());
    const newBadges = this.checkAndUnlockBadges();
    this.notify();
    return newBadges;
  }

  // --- Badges & Unlocks ---
  getUnlockedBadgesMap(): Record<string, string> { // badgeId -> unlockedAt ISO string
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(UNLOCKED_BADGES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  getAllBadges(): AchievementBadge[] {
    const unlockedMap = this.getUnlockedBadgesMap();
    return BADGE_DEFINITIONS.map(def => ({
      ...def,
      unlockedAt: unlockedMap[def.id]
    }));
  }

  // Check progress and award newly achieved badges
  checkAndUnlockBadges(): AchievementBadge[] {
    if (typeof window === 'undefined') return [];

    const unlockedMap = this.getUnlockedBadgesMap();
    const vol1Count = this.getCompletedVol1Lessons().length;
    const vol2Count = this.getCompletedVol2Lessons().length;
    const totalLessons = vol1Count + vol2Count;
    const practiceCount = this.getPracticeCount();
    const recordingsCount = this.getRecordingsCount();

    const newlyUnlocked: AchievementBadge[] = [];
    const now = new Date().toISOString();

    for (const def of BADGE_DEFINITIONS) {
      if (unlockedMap[def.id]) continue; // already unlocked

      let meetsRequirement = false;
      switch (def.requirementType) {
        case 'lessons_completed':
          meetsRequirement = totalLessons >= def.requiredCount;
          break;
        case 'vol1_lessons':
          meetsRequirement = vol1Count >= def.requiredCount;
          break;
        case 'vol2_lessons':
          meetsRequirement = vol2Count >= def.requiredCount;
          break;
        case 'practice_count':
          meetsRequirement = practiceCount >= def.requiredCount;
          break;
        case 'recordings_count':
          meetsRequirement = recordingsCount >= def.requiredCount;
          break;
      }

      if (meetsRequirement) {
        unlockedMap[def.id] = now;
        newlyUnlocked.push({ ...def, unlockedAt: now });
      }
    }

    if (newlyUnlocked.length > 0) {
      localStorage.setItem(UNLOCKED_BADGES_KEY, JSON.stringify(unlockedMap));
    }

    return newlyUnlocked;
  }

  // Current Academic Title / Rank
  getCurrentTitle(): {
    title: string;
    subtitle: string;
    icon: string;
    level: number;
    color: string;
    nextBadge?: AchievementBadge;
    unlockedCount: number;
    totalBadgesCount: number;
  } {
    const badges = this.getAllBadges();
    const unlocked = badges.filter(b => !!b.unlockedAt);
    const unlockedCount = unlocked.length;
    const totalBadgesCount = badges.length;

    // Find the next badge to achieve
    const nextBadge = badges.find(b => !b.unlockedAt);

    if (unlockedCount === 0) {
      return {
        title: 'Bạn Nhỏ Chăm Chỉ',
        subtitle: 'Bắt đầu đọc bài đầu tiên để mở khóa Huy Hiệu Mầm Xanh!',
        icon: '🐣',
        level: 1,
        color: 'from-amber-400 to-orange-400',
        nextBadge,
        unlockedCount,
        totalBadgesCount
      };
    }

    // Sort by requiredCount / level
    const latestUnlocked = unlocked[unlocked.length - 1];

    return {
      title: latestUnlocked.title,
      subtitle: latestUnlocked.subtitle,
      icon: latestUnlocked.icon,
      level: unlockedCount + 1,
      color: latestUnlocked.color,
      nextBadge,
      unlockedCount,
      totalBadgesCount
    };
  }

  // Get Summary Statistics
  getStats() {
    const vol1Completed = this.getCompletedVol1Lessons().length;
    const vol2Completed = this.getCompletedVol2Lessons().length;
    const unlockedBadges = Object.keys(this.getUnlockedBadgesMap()).length;
    const totalBadges = BADGE_DEFINITIONS.length;

    return {
      vol1Completed,
      vol2Completed,
      totalCompleted: vol1Completed + vol2Completed,
      unlockedBadges,
      totalBadges,
      practiceCount: this.getPracticeCount(),
      recordingsCount: this.getRecordingsCount()
    };
  }
}

export const achievementService = new AchievementService();
