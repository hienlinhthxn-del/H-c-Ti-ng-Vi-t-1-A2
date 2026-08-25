import { Volume1Lesson, Volume2Lesson, TopicGroup } from '../types';
import { VOLUME_1_LESSONS as DEFAULT_VOL1_LESSONS } from '../data/lessonsVolume1';
import { TOPIC_GROUPS as DEFAULT_TOPIC_GROUPS } from '../data/lessonsVolume2';

const VOL1_STORAGE_KEY = 'tv1_custom_vol1_lessons';
const VOL2_STORAGE_KEY = 'tv1_custom_vol2_lessons';
const TEACHER_MODE_KEY = 'tv1_teacher_mode_active';

class LessonStorageService {
  private listeners: (() => void)[] = [];

  // Subscribe to storage changes
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
        console.error('Error in lesson storage subscriber:', err);
      }
    });
  }

  // Teacher mode preference
  isTeacherModeActive(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(TEACHER_MODE_KEY) === 'true';
  }

  setTeacherModeActive(active: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TEACHER_MODE_KEY, active ? 'true' : 'false');
    this.notify();
  }

  // Get customized maps from LocalStorage
  private getCustomVol1Map(): Record<number, Volume1Lesson> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(VOL1_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse custom vol1 lessons from localStorage', e);
      return {};
    }
  }

  private getCustomVol2Map(): Record<number, Volume2Lesson> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(VOL2_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse custom vol2 lessons from localStorage', e);
      return {};
    }
  }

  // Get active Volume 1 Lessons (Defaults merged with custom overrides)
  getVolume1Lessons(): Volume1Lesson[] {
    const customMap = this.getCustomVol1Map();
    return DEFAULT_VOL1_LESSONS.map(defaultLesson => {
      if (customMap[defaultLesson.id]) {
        return customMap[defaultLesson.id];
      }
      return defaultLesson;
    });
  }

  // Get Volume 1 Lesson by ID
  getVolume1Lesson(id: number): Volume1Lesson | undefined {
    const lessons = this.getVolume1Lessons();
    return lessons.find(l => l.id === id);
  }

  // Get active Topic Groups & Volume 2 Lessons
  getTopicGroups(): TopicGroup[] {
    const customMap = this.getCustomVol2Map();
    return DEFAULT_TOPIC_GROUPS.map(group => {
      return {
        ...group,
        lessons: group.lessons.map(defaultLesson => {
          if (customMap[defaultLesson.id]) {
            return customMap[defaultLesson.id];
          }
          return defaultLesson;
        })
      };
    });
  }

  // Get Volume 2 Lesson by ID
  getVolume2Lesson(id: number): Volume2Lesson | undefined {
    const customMap = this.getCustomVol2Map();
    if (customMap[id]) return customMap[id];

    for (const group of DEFAULT_TOPIC_GROUPS) {
      const found = group.lessons.find(l => l.id === id);
      if (found) return found;
    }
    return undefined;
  }

  // Check if a specific lesson is customized
  isVolume1Customized(id: number): boolean {
    const map = this.getCustomVol1Map();
    return Boolean(map[id]);
  }

  isVolume2Customized(id: number): boolean {
    const map = this.getCustomVol2Map();
    return Boolean(map[id]);
  }

  // Save custom Volume 1 lesson
  saveVolume1Lesson(lesson: Volume1Lesson): void {
    if (typeof window === 'undefined') return;
    const map = this.getCustomVol1Map();
    map[lesson.id] = lesson;
    localStorage.setItem(VOL1_STORAGE_KEY, JSON.stringify(map));
    this.notify();
  }

  // Save custom Volume 2 lesson
  saveVolume2Lesson(lesson: Volume2Lesson): void {
    if (typeof window === 'undefined') return;
    const map = this.getCustomVol2Map();
    map[lesson.id] = lesson;
    localStorage.setItem(VOL2_STORAGE_KEY, JSON.stringify(map));
    this.notify();
  }

  // Reset a Volume 1 lesson back to textbook original
  resetVolume1Lesson(id: number): void {
    if (typeof window === 'undefined') return;
    const map = this.getCustomVol1Map();
    if (map[id]) {
      delete map[id];
      localStorage.setItem(VOL1_STORAGE_KEY, JSON.stringify(map));
      this.notify();
    }
  }

  // Reset a Volume 2 lesson back to textbook original
  resetVolume2Lesson(id: number): void {
    if (typeof window === 'undefined') return;
    const map = this.getCustomVol2Map();
    if (map[id]) {
      delete map[id];
      localStorage.setItem(VOL2_STORAGE_KEY, JSON.stringify(map));
      this.notify();
    }
  }

  // Reset all custom lessons
  resetAllLessons(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(VOL1_STORAGE_KEY);
    localStorage.removeItem(VOL2_STORAGE_KEY);
    this.notify();
  }

  // Get default textbook original lesson
  getDefaultVolume1Lesson(id: number): Volume1Lesson | undefined {
    return DEFAULT_VOL1_LESSONS.find(l => l.id === id);
  }

  getDefaultVolume2Lesson(id: number): Volume2Lesson | undefined {
    for (const group of DEFAULT_TOPIC_GROUPS) {
      const found = group.lessons.find(l => l.id === id);
      if (found) return found;
    }
    return undefined;
  }

  // Stats
  getStats(): { vol1CustomCount: number; vol2CustomCount: number; totalCustomCount: number } {
    const vol1Map = this.getCustomVol1Map();
    const vol2Map = this.getCustomVol2Map();
    const vol1CustomCount = Object.keys(vol1Map).length;
    const vol2CustomCount = Object.keys(vol2Map).length;
    return {
      vol1CustomCount,
      vol2CustomCount,
      totalCustomCount: vol1CustomCount + vol2CustomCount
    };
  }

  // Export custom lessons to JSON
  exportAllToJson(): string {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      source: 'TiengViet1_KNTT_TeacherEditor',
      customVol1Lessons: this.getCustomVol1Map(),
      customVol2Lessons: this.getCustomVol2Map()
    };
    return JSON.stringify(data, null, 2);
  }

  // Import custom lessons from JSON
  importFromJson(jsonStr: string): { success: boolean; message: string; vol1Count: number; vol2Count: number } {
    try {
      const parsed = JSON.parse(jsonStr);
      let vol1Count = 0;
      let vol2Count = 0;

      if (parsed.customVol1Lessons && typeof parsed.customVol1Lessons === 'object') {
        const currentVol1 = this.getCustomVol1Map();
        const mergedVol1 = { ...currentVol1, ...parsed.customVol1Lessons };
        localStorage.setItem(VOL1_STORAGE_KEY, JSON.stringify(mergedVol1));
        vol1Count = Object.keys(parsed.customVol1Lessons).length;
      }

      if (parsed.customVol2Lessons && typeof parsed.customVol2Lessons === 'object') {
        const currentVol2 = this.getCustomVol2Map();
        const mergedVol2 = { ...currentVol2, ...parsed.customVol2Lessons };
        localStorage.setItem(VOL2_STORAGE_KEY, JSON.stringify(mergedVol2));
        vol2Count = Object.keys(parsed.customVol2Lessons).length;
      }

      this.notify();
      return {
        success: true,
        message: `Đã nhập thành công ${vol1Count} bài Tập 1 và ${vol2Count} bài Tập 2!`,
        vol1Count,
        vol2Count
      };
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Định dạng tệp JSON không hợp lệ.';
      return {
        success: false,
        message: `Lỗi khi nhập tệp: ${errMsg}`,
        vol1Count: 0,
        vol2Count: 0
      };
    }
  }
}

export const lessonStorageService = new LessonStorageService();
