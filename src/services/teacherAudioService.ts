import { db } from './firebaseConfig';
import { collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, query } from 'firebase/firestore';

export interface TeacherAudioItem {
  id: string; // unique ID
  key: string; // normalized lookup key (e.g. clean lowercase text)
  text: string; // original text to pronounce
  volume: 'vol1' | 'vol2';
  lessonId?: string | number;
  section?: string;
  audioBase64: string; 
  mimeType: string;
  durationSeconds: number;
  createdAt: string;
  teacherName?: string;
}

const COLLECTION_NAME = 'teacher_audios';
const PREFER_TEACHER_VOICE_KEY = 'tv1_prefer_teacher_voice';

class TeacherAudioService {
  private listeners: (() => void)[] = [];
  private currentAudioElement: HTMLAudioElement | null = null;
  private memoryMap: Record<string, TeacherAudioItem> = {};
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initFirebaseSync();
    }
  }

  private initFirebaseSync() {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      onSnapshot(q, (snapshot) => {
        const newMap: Record<string, TeacherAudioItem> = {};
        snapshot.forEach((doc) => {
          const item = doc.data() as TeacherAudioItem;
          newMap[item.key] = item;
        });
        this.memoryMap = newMap;
        this.isInitialized = true;
        this.notify();
      }, (error) => {
        console.error('Lỗi khi đồng bộ âm thanh giáo viên từ Firebase:', error);
      });
    } catch (error) {
      console.error('Không thể khởi tạo Firebase Sync cho Teacher Audio:', error);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private normalizeKey(text: string, context?: string, lessonId?: string | number): string {
    let key = text.trim().toLowerCase();
    if (context) key = `${context}:::${key}`;
    if (lessonId !== undefined) key = `${lessonId}:::${key}`;
    return key;
  }

  public isPreferTeacherVoice(): boolean {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(PREFER_TEACHER_VOICE_KEY);
    if (stored === null) return true;
    return stored === 'true';
  }

  public setPreferTeacherVoice(prefer: boolean) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREFER_TEACHER_VOICE_KEY, prefer.toString());
      this.notify();
    }
  }

  public stopCurrentAudio() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
  }

  public async saveAudio(item: Omit<TeacherAudioItem, 'id' | 'key' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<TeacherAudioItem> {
    const key = this.normalizeKey(item.text, item.section, item.lessonId);
    const id = item.id || `audio_${Date.now()}`;
    const fullItem: TeacherAudioItem = {
      ...item,
      id,
      key,
      createdAt: item.createdAt || new Date().toISOString(),
      teacherName: item.teacherName || 'Cô giáo'
    };

    // Save to local memory immediately for fast UI
    this.memoryMap[key] = fullItem;
    this.notify();

    // Sync to Firebase
    try {
      await setDoc(doc(db, COLLECTION_NAME, id), fullItem);
    } catch (e) {
      console.error('Lỗi khi lưu âm thanh lên Đám mây:', e);
    }

    return fullItem;
  }

  public getAudioByText(text?: string, context?: string, lessonId?: string | number): TeacherAudioItem | undefined {
    if (!text) return undefined;
    if (context && lessonId !== undefined) {
      const strictKey = this.normalizeKey(text, context, lessonId);
      if (this.memoryMap[strictKey] && this.memoryMap[strictKey].audioBase64) return this.memoryMap[strictKey];
    }
    if (context) {
      const specificKey = this.normalizeKey(text, context);
      if (this.memoryMap[specificKey] && this.memoryMap[specificKey].audioBase64) return this.memoryMap[specificKey];
    }
    if (lessonId !== undefined) {
      const lessonOnlyKey = this.normalizeKey(text, undefined, lessonId);
      if (this.memoryMap[lessonOnlyKey] && this.memoryMap[lessonOnlyKey].audioBase64) return this.memoryMap[lessonOnlyKey];
    }
    const genericKey = this.normalizeKey(text);
    return Boolean(this.memoryMap[genericKey] && this.memoryMap[genericKey].audioBase64) ? this.memoryMap[genericKey] : undefined;
  }

  public hasAudioForText(text?: string, context?: string, lessonId?: string | number): boolean {
    return !!this.getAudioByText(text, context, lessonId);
  }

  public playAudioById(id: string, onEnd?: () => void): HTMLAudioElement | null {
    const item = Object.values(this.memoryMap).find(a => a.id === id);
    if (!item || !item.audioBase64) return null;

    this.stopCurrentAudio();
    try {
      const audio = new Audio(item.audioBase64);
      this.currentAudioElement = audio;
      audio.onended = () => {
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        console.error('Failed to play custom audio for id', id);
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };
      audio.play().catch(e => {
        console.error('Audio play blocked:', e);
        if (onEnd) onEnd();
      });
      return audio;
    } catch (e) {
      console.error('Error playing audio', e);
      return null;
    }
  }

  public async deleteAudioById(id: string): Promise<void> {
    let foundKey: string | null = null;
    for (const [k, item] of Object.entries(this.memoryMap)) {
      if (item.id === id) {
        foundKey = k;
        break;
      }
    }
    if (foundKey) {
      delete this.memoryMap[foundKey];
      this.notify();
    }
    
    // Delete from Firebase
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      console.error('Lỗi khi xóa âm thanh trên Đám mây:', e);
    }
  }

  public async deleteAudioByText(text?: string, context?: string, lessonId?: string | number): Promise<void> {
    if (!text) return;
    const item = this.getAudioByText(text, context, lessonId);
    if (item) {
      await this.deleteAudioById(item.id);
    }
  }

  public getCount(): number {
    return Object.keys(this.memoryMap).length;
  }

  public getAllAudios(): TeacherAudioItem[] {
    return Object.values(this.memoryMap).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      // Handle invalid dates gracefully
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateB - dateA;
    });
  }

    public exportToJson(): string {
    return JSON.stringify(Object.values(this.memoryMap));
  }

  public importFromJson(jsonStr: string): { success: boolean, count: number } {
    try {
      const items = JSON.parse(jsonStr) as TeacherAudioItem[];
      let count = 0;
      items.forEach(item => {
        if (item.text && item.audioBase64) {
          this.saveAudio(item);
          count++;
        }
      });
      return { success: true, count };
    } catch (e) {
      console.error('Import failed', e);
      return { success: false, count: 0 };
    }
  }

  public async clearAll(): Promise<void> {
    for (const item of Object.values(this.memoryMap)) {
      await this.deleteAudioById(item.id);
    }
  }

  public playAudio(text: string, context?: string, lessonId?: string | number, onEnd?: () => void): HTMLAudioElement | null {
    // Note: this is kept for backwards compatibility
    const item = this.getAudioByText(text, context, lessonId);
    if (!item || !item.audioBase64) return null;

    this.stopCurrentAudio();

    try {
      const audio = new Audio(item.audioBase64);
      this.currentAudioElement = audio;
      audio.onended = () => {
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };
      audio.onerror = () => {
        console.error('Failed to play custom audio for', text);
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };
      audio.play().catch(e => {
        console.error('Audio play blocked:', e);
        if (onEnd) onEnd();
      });
      return audio;
    } catch (e) {
      console.error('Error playing audio', e);
      return null;
    }
  }
}

export const teacherAudioService = new TeacherAudioService();
