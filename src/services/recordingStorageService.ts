import { StudentRecording, RecordingTargetInfo } from '../types';

const DB_NAME = 'tieng_viet_1_recordings_db';
const DB_VERSION = 1;
const STORE_NAME = 'student_recordings';

class RecordingStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryRecordings: StudentRecording[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB();
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
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('lessonId', 'lessonId', { unique: false });
          store.createIndex('volume', 'volume', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // Subscribe to changes
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
        console.error('Error in recording listener:', err);
      }
    });
  }

  // Save a new recording
  async saveRecording(
    target: RecordingTargetInfo,
    audioBlob: Blob,
    durationSeconds: number
  ): Promise<StudentRecording> {
    const id = 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const audioBlobUrl = URL.createObjectURL(audioBlob);
    
    // Generate feedback for 1st grader
    const feedback = this.generateCheeringFeedback(target.targetText, durationSeconds);

    const recording: StudentRecording = {
      id,
      volume: target.volume,
      lessonId: target.lessonId,
      lessonNumber: target.lessonNumber,
      lessonTitle: target.lessonTitle,
      sectionTitle: target.sectionTitle,
      targetText: target.targetText,
      audioBlobUrl,
      mimeType: audioBlob.type || 'audio/webm',
      durationSeconds: Math.round(durationSeconds),
      createdAt: new Date().toISOString(),
      feedback
    };

    // Keep in memory
    this.memoryRecordings.unshift(recording);

    // Save to IndexedDB with Blob
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        // We store with blob data directly in IndexedDB
        const itemToStore = {
          ...recording,
          audioBlob // Raw blob persists perfectly in IndexedDB
        };
        const req = store.put(itemToStore);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to save recording to IndexedDB, fallback to memory:', err);
    }

    this.notify();
    return recording;
  }

  // Fetch all recordings
  async getAllRecordings(): Promise<StudentRecording[]> {
    try {
      const db = await this.initDB();
      const items = await new Promise<any[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      // Map back to StudentRecording with object URLs
      const results: StudentRecording[] = items.map(item => {
        let audioBlobUrl = item.audioBlobUrl;
        if (item.audioBlob instanceof Blob) {
          audioBlobUrl = URL.createObjectURL(item.audioBlob);
        }
        return {
          id: item.id,
          volume: item.volume,
          lessonId: item.lessonId,
          lessonNumber: item.lessonNumber,
          lessonTitle: item.lessonTitle,
          sectionTitle: item.sectionTitle,
          targetText: item.targetText,
          audioBlobUrl,
          mimeType: item.mimeType || 'audio/webm',
          durationSeconds: item.durationSeconds || 0,
          createdAt: item.createdAt || new Date().toISOString(),
          feedback: item.feedback
        };
      });

      // Sort newest first
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.memoryRecordings = results;
      return results;
    } catch (err) {
      console.warn('Failed to get recordings from IndexedDB, returning memory:', err);
      return this.memoryRecordings;
    }
  }

  // Get recordings for specific lesson
  async getRecordingsForLesson(volume: 'vol1' | 'vol2', lessonId: number): Promise<StudentRecording[]> {
    const all = await this.getAllRecordings();
    return all.filter(r => r.volume === volume && r.lessonId === lessonId);
  }

  // Delete a recording
  async deleteRecording(id: string): Promise<boolean> {
    this.memoryRecordings = this.memoryRecordings.filter(r => r.id !== id);

    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      this.notify();
      return true;
    } catch (err) {
      console.warn('Failed to delete recording from IndexedDB:', err);
      this.notify();
      return true;
    }
  }

  // Clear all recordings
  async clearAllRecordings(): Promise<boolean> {
    this.memoryRecordings = [];
    try {
      const db = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      this.notify();
      return true;
    } catch (err) {
      console.warn('Failed to clear recordings:', err);
      this.notify();
      return true;
    }
  }

  // Generate encouraging pedagogical feedback
  private generateCheeringFeedback(
    targetText: string,
    durationSeconds: number
  ): { starsEarned: number; cheeringMessage: string; fluencyRating: 'excellent' | 'great' | 'good' } {
    const wordCount = targetText.trim().split(/\s+/).length;
    
    const messages = [
      '🎉 Hoan hô bé! Giọng đọc rất to, rõ ràng và phát âm tròn vành rõ chữ!',
      '⭐ Tuyệt vời! Bé đọc rất lưu loát, ngắt nghỉ câu rất tự tin và truyền cảm!',
      '🌟 Giỏi quá! Giọng đọc của bé rất trong trẻo, xứng đáng nhận Ngôi sao chăm ngoan!',
      '👏 Xuất sắc! Bé đã làm chủ các âm vần và đọc bài rất trôi chảy!',
      '✨ Chúc mừng bé! Từng tiếng đọc đều chuẩn xác, hãy tiếp tục phát huy nhé!'
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    return {
      starsEarned: 1,
      cheeringMessage: randomMsg,
      fluencyRating: durationSeconds >= Math.max(2, wordCount * 0.4) ? 'excellent' : 'great'
    };
  }

  // Download recording audio file
  downloadRecording(recording: StudentRecording) {
    if (!recording.audioBlobUrl) return;
    const a = document.createElement('a');
    a.href = recording.audioBlobUrl;
    const dateStr = new Date(recording.createdAt).toLocaleDateString('vi-VN').replace(/\//g, '-');
    const safeTitle = (recording.lessonTitle || 'bai_doc').replace(/\s+/g, '_').toLowerCase();
    a.download = `Ghi_am_${safeTitle}_${dateStr}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export const recordingStorageService = new RecordingStorageService();
