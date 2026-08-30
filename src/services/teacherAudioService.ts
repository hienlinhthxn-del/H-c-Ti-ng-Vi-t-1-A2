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

const DB_NAME = 'tieng_viet_1_teacher_audio_db';
const DB_VERSION = 1;
const STORE_NAME = 'teacher_audios';
const PREFER_TEACHER_VOICE_KEY = 'tv1_prefer_teacher_voice';

class TeacherAudioService {
  private listeners: (() => void)[] = [];
  private currentAudioElement: HTMLAudioElement | null = null;
  private memoryMap: Record<string, TeacherAudioItem> = {};
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB().then(() => {
        this.loadAllFromDB();
      });
    }
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        reject(new Error('IndexedDB is not available'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  private async loadAllFromDB() {
    try {
      const db = await this.initDB();
      const items = await new Promise<TeacherAudioItem[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      const newMap: Record<string, TeacherAudioItem> = {};
      items.forEach(item => {
        const expectedKey = this.normalizeKey(item.text, item.section, item.lessonId);
        if (item.key !== expectedKey) {
          const oldKey = item.key;
          item.key = expectedKey;
          this.saveToDB(item);
          this.deleteFromDB(oldKey);
        }
        newMap[item.key] = item;
      });

      // Migrate from localStorage if this is the first time using IndexedDB
      try {
        const oldData = localStorage.getItem('tv1_teacher_custom_audios');
        if (oldData) {
          const oldMap = JSON.parse(oldData);
          let migrated = false;
          for (const key in oldMap) {
            if (!newMap[key]) {
              newMap[key] = oldMap[key];
              this.saveToDB(oldMap[key]); // Save migrated item asynchronously
              migrated = true;
            }
          }
          if (migrated) {
            localStorage.removeItem('tv1_teacher_custom_audios'); // Cleanup
          }
        }
      } catch (e) {
        console.warn('Error migrating old localStorage audio', e);
      }

      this.memoryMap = newMap;
      this.isInitialized = true;
      this.notify();
    } catch (e) {
      console.error('Failed to load teacher audios from IndexedDB', e);
      this.isInitialized = true; // allow app to continue
    }
  }

  private async saveToDB(item: TeacherAudioItem) {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('Failed to save teacher audio to IndexedDB', e);
    }
  }

  private async deleteFromDB(key: string) {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('Failed to delete teacher audio from IndexedDB', e);
    }
  }

  private async clearDB() {
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error('Failed to clear teacher audio from IndexedDB', e);
    }
  }

  // Normalize text for reliable matching
  public normalizeKey(text: any, context?: string, lessonId?: string | number): string {
    if (!text || typeof text !== 'string') return '';
    let key = text
      .trim()
      .toLowerCase()
      .replace(/[\s\t\n]+/g, ' ')
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'–—]/g, '');
    
    if (context) {
      key = `${context}:::${key}`;
    }
    if (lessonId !== undefined) {
      key = `${lessonId}:::${key}`;
    }
    return key;
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

  // Save or update an audio item
  public saveAudio(item: Omit<TeacherAudioItem, 'id' | 'key' | 'createdAt'> & { id?: string; createdAt?: string }): TeacherAudioItem {
    const key = this.normalizeKey(item.text, item.section, item.lessonId);
    const id = item.id || `audio_${key}_${Date.now()}`;
    const fullItem: TeacherAudioItem = {
      ...item,
      id,
      key,
      createdAt: item.createdAt || new Date().toISOString(),
      teacherName: item.teacherName || 'Cô giáo'
    };

    this.memoryMap[key] = fullItem;
    this.saveToDB(fullItem);
    this.notify();
    return fullItem;
  }

  // Find custom audio by text
  public getAudioByText(text?: string, context?: string, lessonId?: string | number): TeacherAudioItem | undefined {
    if (!text) return undefined;
    if (context && lessonId !== undefined) {
      const strictKey = this.normalizeKey(text, context, lessonId);
      if (this.memoryMap[strictKey]) return this.memoryMap[strictKey];
    }
    if (context) {
      const specificKey = this.normalizeKey(text, context);
      if (this.memoryMap[specificKey]) return this.memoryMap[specificKey];
    }
    const genericKey = this.normalizeKey(text);
    return this.memoryMap[genericKey];
  }

  // Check if custom audio exists for text
  public hasAudioForText(text?: string, context?: string, lessonId?: string | number): boolean {
    if (!text) return false;
    if (context && lessonId !== undefined) {
      const strictKey = this.normalizeKey(text, context, lessonId);
      if (this.memoryMap[strictKey] && this.memoryMap[strictKey].audioBase64) return true;
    }
    if (context) {
      const specificKey = this.normalizeKey(text, context);
      if (this.memoryMap[specificKey] && this.memoryMap[specificKey].audioBase64) return true;
    }
    const genericKey = this.normalizeKey(text);
    return Boolean(this.memoryMap[genericKey] && this.memoryMap[genericKey].audioBase64);
  }

  // Delete audio for text
  public deleteAudioByText(text?: string, context?: string, lessonId?: string | number): void {
    if (!text) return;
    if (context && lessonId !== undefined) {
      const strictKey = this.normalizeKey(text, context, lessonId);
      if (this.memoryMap[strictKey]) {
        delete this.memoryMap[strictKey];
        this.deleteFromDB(strictKey);
        this.notify();
        return;
      }
    }
    if (context) {
      const specificKey = this.normalizeKey(text, context);
      if (this.memoryMap[specificKey]) {
        delete this.memoryMap[specificKey];
        this.deleteFromDB(specificKey);
        this.notify();
        return;
      }
    }
    const genericKey = this.normalizeKey(text);
    if (this.memoryMap[genericKey]) {
      delete this.memoryMap[genericKey];
      this.deleteFromDB(genericKey);
      this.notify();
    }
  }

  // Delete audio by ID
  public deleteAudioById(id: string): void {
    let foundKey: string | null = null;
    for (const [k, item] of Object.entries(this.memoryMap)) {
      if (item.id === id) {
        foundKey = k;
        break;
      }
    }
    if (foundKey) {
      delete this.memoryMap[foundKey];
      this.deleteFromDB(foundKey);
      this.notify();
    }
  }

  // Get all audio items as array
  public getAllAudios(): TeacherAudioItem[] {
    return Object.values(this.memoryMap).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Get count of custom recordings
  public getCount(): number {
    return Object.keys(this.memoryMap).length;
  }

  // Play custom audio for text
  public playAudio(text: string, context?: string, lessonId?: string | number, onEnd?: () => void): HTMLAudioElement | null {
    let item = undefined;
    if (context && lessonId !== undefined) {
      const strictKey = this.normalizeKey(text, context, lessonId);
      item = this.memoryMap[strictKey];
    }
    if (!item && context) {
      const specificKey = this.normalizeKey(text, context);
      item = this.memoryMap[specificKey];
    }
    if (!item) {
      const genericKey = this.normalizeKey(text);
      item = this.memoryMap[genericKey];
    }
    
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
    const payload = {
      version: '1.0',
      type: 'TiengViet1_TeacherCustomAudio',
      exportDate: new Date().toISOString(),
      totalAudios: Object.keys(this.memoryMap).length,
      audios: this.memoryMap
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

      const newAudios = parsed.audios as Record<string, TeacherAudioItem>;
      const count = Object.keys(newAudios).length;
      
      for (const [key, item] of Object.entries(newAudios)) {
        this.memoryMap[key] = item;
        this.saveToDB(item);
      }

      this.notify();
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
    this.memoryMap = {};
    this.clearDB();
    this.notify();
  }
}

export const teacherAudioService = new TeacherAudioService();
