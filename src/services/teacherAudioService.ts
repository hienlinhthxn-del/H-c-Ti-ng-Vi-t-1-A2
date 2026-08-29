export interface TeacherAudioItem {
  id: string; // unique ID
  key: string; // normalized lookup key (e.g. clean lowercase text)
  text: string; // original text to pronounce (e.g. "ă", "con chuồn chuồn", "Bà bế bé.")
  volume?: 'vol1' | 'vol2';
  lessonId?: number;
  section?: 'letter' | 'syllable' | 'word' | 'sentence' | 'passage' | 'quiz' | 'general';
  audioBase64: string; // data:audio/webm;base64,...
  mimeType: string;
  durationSeconds: number;
  teacherName?: string;
  createdAt: string; // ISO String
  notes?: string;
}

const STORAGE_KEY = 'tv1_teacher_custom_audios';
const PREFER_TEACHER_VOICE_KEY = 'tv1_prefer_teacher_voice';

class TeacherAudioService {
  private listeners: (() => void)[] = [];
  private currentAudioElement: HTMLAudioElement | null = null;

  // Normalize text for reliable matching
  public normalizeKey(text: any): string {
    if (!text || typeof text !== 'string') return '';
    return text
      .trim()
      .toLowerCase()
      .replace(/[\s\t\n]+/g, ' ')
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'–—]/g, '');
  }

  // Subscribe to updates
  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (e) {
        console.error('Error in teacher audio listener:', e);
      }
    });
  }

  // Check if prefer teacher voice is enabled (default true)
  public isPreferTeacherVoice(): boolean {
    if (typeof window === 'undefined') return true;
    const val = localStorage.getItem(PREFER_TEACHER_VOICE_KEY);
    return val === null ? true : val === 'true';
  }

  public setPreferTeacherVoice(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PREFER_TEACHER_VOICE_KEY, enabled ? 'true' : 'false');
    this.notify();
  }

  // Get all saved teacher audios map
  private getAudiosMap(): Record<string, TeacherAudioItem> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to parse teacher audios from localStorage:', e);
      return {};
    }
  }

  private saveAudiosMap(map: Record<string, TeacherAudioItem>): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      this.notify();
    } catch (e) {
      console.error('Failed to save teacher audios to localStorage:', e);
    }
  }

  // Save or update an audio item
  public saveAudio(item: Omit<TeacherAudioItem, 'id' | 'key' | 'createdAt'> & { id?: string; createdAt?: string }): TeacherAudioItem {
    const key = this.normalizeKey(item.text);
    const id = item.id || `audio_${key}_${Date.now()}`;
    const fullItem: TeacherAudioItem = {
      ...item,
      id,
      key,
      createdAt: item.createdAt || new Date().toISOString(),
      teacherName: item.teacherName || 'Cô giáo'
    };

    const map = this.getAudiosMap();
    map[key] = fullItem;
    this.saveAudiosMap(map);
    return fullItem;
  }

  // Find custom audio by text
  public getAudioByText(text?: string): TeacherAudioItem | undefined {
    const key = this.normalizeKey(text);
    if (!key) return undefined;
    const map = this.getAudiosMap();
    return map[key];
  }

  // Check if custom audio exists for text
  public hasAudioForText(text?: string): boolean {
    const key = this.normalizeKey(text);
    if (!key) return false;
    const map = this.getAudiosMap();
    return Boolean(map[key] && map[key].audioBase64);
  }

  // Delete audio for text
  public deleteAudioByText(text?: string): void {
    const key = this.normalizeKey(text);
    if (!key) return;
    const map = this.getAudiosMap();
    if (map[key]) {
      delete map[key];
      this.saveAudiosMap(map);
    }
  }

  // Delete audio by ID
  public deleteAudioById(id: string): void {
    const map = this.getAudiosMap();
    let foundKey: string | null = null;
    for (const [k, item] of Object.entries(map)) {
      if (item.id === id) {
        foundKey = k;
        break;
      }
    }
    if (foundKey) {
      delete map[foundKey];
      this.saveAudiosMap(map);
    }
  }

  // Get all audio items as array
  public getAllAudios(): TeacherAudioItem[] {
    const map = this.getAudiosMap();
    return Object.values(map).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Get count of custom recordings
  public getCount(): number {
    return Object.keys(this.getAudiosMap()).length;
  }

  // Play custom audio for text
  public playAudio(text: string, onEnd?: () => void): HTMLAudioElement | null {
    const item = this.getAudioByText(text);
    if (!item || !item.audioBase64) return null;

    this.stopCurrentAudio();

    try {
      const audio = new Audio(item.audioBase64);
      this.currentAudioElement = audio;

      audio.onended = () => {
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (err) => {
        console.error('Error playing custom teacher audio:', err);
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };

      audio.play().catch(err => {
        console.warn('Audio play request failed or was interrupted:', err);
        if (onEnd) onEnd();
      });

      return audio;
    } catch (e) {
      console.error('Failed to create Audio instance:', e);
      if (onEnd) onEnd();
      return null;
    }
  }

  // Stop currently playing teacher audio
  public stopCurrentAudio(): void {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudioElement = null;
    }
  }

  // Export all teacher recordings to JSON backup
  public exportToJson(): string {
    const map = this.getAudiosMap();
    const payload = {
      version: '1.0',
      type: 'TiengViet1_TeacherCustomAudio',
      exportDate: new Date().toISOString(),
      totalAudios: Object.keys(map).length,
      audios: map
    };
    return JSON.stringify(payload, null, 2);
  }

  // Import teacher recordings from JSON
  public importFromJson(jsonStr: string): { success: boolean; count: number; message: string } {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.audios || typeof parsed.audios !== 'object') {
        return { success: false, count: 0, message: 'Tệp không chứa dữ liệu âm thanh đọc mẫu hợp lệ.' };
      }

      const currentMap = this.getAudiosMap();
      const newAudios = parsed.audios as Record<string, TeacherAudioItem>;
      const count = Object.keys(newAudios).length;
      const merged = { ...currentMap, ...newAudios };

      this.saveAudiosMap(merged);
      return {
        success: true,
        count,
        message: `Đã nhập thành công ${count} bản thu âm giọng đọc mẫu của giáo viên!`
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Lỗi định dạng JSON.';
      return { success: false, count: 0, message: `Lỗi nhập tệp: ${msg}` };
    }
  }

  // Clear all recordings
  public clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    this.notify();
  }
}

export const teacherAudioService = new TeacherAudioService();
