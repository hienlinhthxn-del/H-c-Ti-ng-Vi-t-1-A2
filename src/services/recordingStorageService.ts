import { StudentRecording, RecordingTargetInfo } from '../types';
import { db } from './firebaseConfig';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query } from 'firebase/firestore';

const DB_NAME = 'tieng_viet_1_recordings_db';
const DB_VERSION = 1;
const STORE_NAME = 'student_recordings';
const CLOUD_COLLECTION = 'student_recordings';

class RecordingStorageService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryRecordings: StudentRecording[] = [];
  private cloudRecordingsMap: Map<string, StudentRecording> = new Map();
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      if ('indexedDB' in window) {
        this.initDB();
      }
      this.initFirebaseSync();
    }
  }

  private initFirebaseSync() {
    try {
      const q = query(collection(db, CLOUD_COLLECTION));
      onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data() as StudentRecording;
            if (change.type === 'removed') {
              this.cloudRecordingsMap.delete(change.doc.id);
              this.memoryRecordings = this.memoryRecordings.filter((r) => r.id !== change.doc.id);
            } else if (data && data.id) {
              const hydrated: StudentRecording = {
                ...data,
                audioBlobUrl: data.audioBase64 || data.audioBlobUrl
              };
              this.cloudRecordingsMap.set(data.id, hydrated);
            }
          });
          this.mergeCloudIntoMemory();
          this.notify();
        },
        (err) => {
          console.warn('Firebase sync warning for student recordings:', err);
        }
      );
    } catch (err) {
      console.warn('Could not initialize Firebase sync for student recordings:', err);
    }
  }

  private mergeCloudIntoMemory() {
    const mergedMap = new Map<string, StudentRecording>();
    this.memoryRecordings.forEach((rec) => {
      mergedMap.set(rec.id, rec);
    });
    this.cloudRecordingsMap.forEach((cloudRec, id) => {
      const existing = mergedMap.get(id);
      if (existing) {
        mergedMap.set(id, {
          ...existing,
          ...cloudRec,
          audioBlobUrl: existing.audioBlobUrl || cloudRec.audioBase64 || cloudRec.audioBlobUrl
        });
      } else {
        mergedMap.set(id, cloudRec);
      }
    });
    const list = Array.from(mergedMap.values());
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.memoryRecordings = list;
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  private sanitizeForFirestore<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
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
        const idb = (event.target as IDBOpenDBRequest).result;
        if (!idb.objectStoreNames.contains(STORE_NAME)) {
          const store = idb.createObjectStore(STORE_NAME, { keyPath: 'id' });
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
    durationSeconds: number,
    aiEvaluation?: StudentRecording['aiEvaluation'],
    studentName?: string,
    studentId?: string,
    studentCode?: string
  ): Promise<StudentRecording> {
    const id = 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const audioBlobUrl = URL.createObjectURL(audioBlob);
    let audioBase64: string | undefined;
    try {
      audioBase64 = await this.blobToBase64(audioBlob);
    } catch (e) {
      console.warn('Could not encode audioBlob to base64:', e);
    }
    
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
      audioBase64,
      mimeType: audioBlob.type || 'audio/webm',
      durationSeconds: Math.round(durationSeconds),
      createdAt: new Date().toISOString(),
      feedback,
      aiEvaluation,
      studentName,
      studentId,
      studentCode
    };

    // Keep in memory
    this.memoryRecordings.unshift(recording);
    this.cloudRecordingsMap.set(id, recording);

    // Save to IndexedDB with Blob
    try {
      const idb = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const itemToStore = {
          ...recording,
          audioBlob
        };
        const req = store.put(itemToStore);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to save recording to IndexedDB, fallback to memory:', err);
    }

    // Sync to Firebase Cloud for multi-user / multi-device access
    try {
      const cloudDoc: StudentRecording = { ...recording };
      delete cloudDoc.audioBlobUrl; // Do not store temporary local blob:// URL in cloud
      const cleanDoc = this.sanitizeForFirestore(cloudDoc);
      await setDoc(doc(db, CLOUD_COLLECTION, id), cleanDoc);
    } catch (err) {
      console.warn('Failed to sync recording to Firebase Cloud:', err);
    }

    this.notify();
    return recording;
  }

  // Fetch all recordings
  async getAllRecordings(): Promise<StudentRecording[]> {
    try {
      const idb = await this.initDB();
      const items = await new Promise<any[]>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      // Map back to StudentRecording with object URLs
      const localResults: StudentRecording[] = items.map(item => {
        let audioBlobUrl = item.audioBlobUrl;
        if (item.audioBlob instanceof Blob) {
          audioBlobUrl = URL.createObjectURL(item.audioBlob);
        } else if (item.audioBase64) {
          audioBlobUrl = item.audioBase64;
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
          audioBase64: item.audioBase64,
          mimeType: item.mimeType || 'audio/webm',
          durationSeconds: item.durationSeconds || 0,
          createdAt: item.createdAt || new Date().toISOString(),
          feedback: item.feedback,
          aiEvaluation: item.aiEvaluation,
          teacherComment: item.teacherComment,
          teacherScore: item.teacherScore,
          reviewedAt: item.reviewedAt,
          studentName: item.studentName,
          studentId: item.studentId,
          studentCode: item.studentCode
        };
      });

      // Merge local IndexedDB recordings and Cloud Firestore recordings
      const mergedMap = new Map<string, StudentRecording>();
      localResults.forEach((r) => mergedMap.set(r.id, r));
      this.cloudRecordingsMap.forEach((cloudRec, id) => {
        const local = mergedMap.get(id);
        if (local) {
          mergedMap.set(id, {
            ...local,
            ...cloudRec,
            audioBlobUrl: local.audioBlobUrl || cloudRec.audioBase64 || cloudRec.audioBlobUrl
          });
        } else {
          mergedMap.set(id, cloudRec);
        }
      });

      const results = Array.from(mergedMap.values());
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.memoryRecordings = results;
      return results;
    } catch (err) {
      console.warn('Failed to get recordings from IndexedDB, returning memory:', err);
      this.mergeCloudIntoMemory();
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
    this.cloudRecordingsMap.delete(id);

    try {
      const idb = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to delete recording from IndexedDB:', err);
    }

    try {
      await deleteDoc(doc(db, CLOUD_COLLECTION, id));
    } catch (err) {
      console.warn('Failed to delete recording from Firebase Cloud:', err);
    }

    this.notify();
    return true;
  }

  // Update teacher review & comment (and optionally adjusted AI evaluation)
  async updateTeacherReview(
    id: string,
    comment: string,
    score: number = 5,
    updatedAiEvaluation?: StudentRecording['aiEvaluation']
  ): Promise<boolean> {
    const reviewedAt = new Date().toISOString();
    const item = this.memoryRecordings.find(r => r.id === id);
    if (item) {
      item.teacherComment = comment;
      item.teacherScore = score;
      item.reviewedAt = reviewedAt;
      if (updatedAiEvaluation) {
        item.aiEvaluation = updatedAiEvaluation;
      }
    }
    const cloudItem = this.cloudRecordingsMap.get(id);
    if (cloudItem) {
      cloudItem.teacherComment = comment;
      cloudItem.teacherScore = score;
      cloudItem.reviewedAt = reviewedAt;
      if (updatedAiEvaluation) {
        cloudItem.aiEvaluation = updatedAiEvaluation;
      }
    }

    try {
      const idb = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          const record = getReq.result;
          if (record) {
            record.teacherComment = comment;
            record.teacherScore = score;
            record.reviewedAt = reviewedAt;
            if (updatedAiEvaluation) {
              record.aiEvaluation = updatedAiEvaluation;
            }
            const putReq = store.put(record);
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          } else {
            resolve();
          }
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch (err) {
      console.warn('Failed to update teacher review in IndexedDB:', err);
    }

    try {
      const targetRec = item || cloudItem;
      if (targetRec) {
        const copy = { ...targetRec };
        delete copy.audioBlobUrl;
        await setDoc(doc(db, CLOUD_COLLECTION, id), this.sanitizeForFirestore(copy), { merge: true });
      }
    } catch (err) {
      console.warn('Failed to update teacher review in Firebase Cloud:', err);
    }

    this.notify();
    return true;
  }

  // Update AI evaluation directly (e.g. when teacher overrides word status or score)
  async updateAiEvaluation(
    id: string,
    aiEvaluation: StudentRecording['aiEvaluation']
  ): Promise<boolean> {
    if (!aiEvaluation) return false;
    const item = this.memoryRecordings.find(r => r.id === id);
    if (item) {
      item.aiEvaluation = aiEvaluation;
    }
    const cloudItem = this.cloudRecordingsMap.get(id);
    if (cloudItem) {
      cloudItem.aiEvaluation = aiEvaluation;
    }

    try {
      const idb = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          const record = getReq.result;
          if (record) {
            record.aiEvaluation = aiEvaluation;
            const putReq = store.put(record);
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          } else {
            resolve();
          }
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch (err) {
      console.warn('Failed to update AI evaluation in IndexedDB:', err);
    }

    try {
      const targetRec = item || cloudItem;
      if (targetRec) {
        const copy = { ...targetRec };
        delete copy.audioBlobUrl;
        await setDoc(doc(db, CLOUD_COLLECTION, id), this.sanitizeForFirestore(copy), { merge: true });
      }
    } catch (err) {
      console.warn('Failed to update AI evaluation in Firebase Cloud:', err);
    }

    this.notify();
    return true;
  }

  // Update recording student assignment
  async updateRecordingStudent(
    id: string,
    studentId: string,
    studentName: string,
    studentCode?: string
  ): Promise<boolean> {
    const item = this.memoryRecordings.find(r => r.id === id);
    if (item) {
      item.studentId = studentId;
      item.studentName = studentName;
      item.studentCode = studentCode;
    }
    const cloudItem = this.cloudRecordingsMap.get(id);
    if (cloudItem) {
      cloudItem.studentId = studentId;
      cloudItem.studentName = studentName;
      cloudItem.studentCode = studentCode;
    }

    try {
      const idb = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          const record = getReq.result;
          if (record) {
            record.studentId = studentId;
            record.studentName = studentName;
            record.studentCode = studentCode;
            const putReq = store.put(record);
            putReq.onsuccess = () => resolve();
            putReq.onerror = () => reject(putReq.error);
          } else {
            resolve();
          }
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch (err) {
      console.warn('Failed to update recording student in IndexedDB:', err);
    }

    try {
      const targetRec = item || cloudItem;
      if (targetRec) {
        const copy = { ...targetRec };
        delete copy.audioBlobUrl;
        await setDoc(doc(db, CLOUD_COLLECTION, id), this.sanitizeForFirestore(copy), { merge: true });
      }
    } catch (err) {
      console.warn('Failed to update recording student in Firebase Cloud:', err);
    }

    this.notify();
    return true;
  }

  // Clear all recordings
  async clearAllRecordings(): Promise<boolean> {
    const idsToDelete = Array.from(new Set([
      ...this.memoryRecordings.map(r => r.id),
      ...Array.from(this.cloudRecordingsMap.keys())
    ]));
    this.memoryRecordings = [];
    this.cloudRecordingsMap.clear();
    try {
      const idb = await this.initDB();
      await new Promise<void>((resolve, reject) => {
        const tx = idb.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Failed to clear recordings:', err);
    }

    try {
      await Promise.all(idsToDelete.map(id => deleteDoc(doc(db, CLOUD_COLLECTION, id))));
    } catch (err) {
      console.warn('Failed to clear recordings in Firebase Cloud:', err);
    }

    this.notify();
    return true;
  }

  // Generate encouraging pedagogical feedback
  private generateCheeringFeedback(
    targetText: string,
    durationSeconds: number
  ): { starsEarned: number; cheeringMessage: string; fluencyRating: 'excellent' | 'great' | 'good' } {
    const wordCount = (targetText || '').trim().split(/\s+/).filter(Boolean).length || 1;
    
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
    const href = recording.audioBlobUrl || recording.audioBase64;
    if (!href) return;
    const a = document.createElement('a');
    a.href = href;
    const dateStr = new Date(recording.createdAt).toLocaleDateString('vi-VN').replace(/\//g, '-');
    const safeTitle = (recording.lessonTitle || 'bai_doc').replace(/\s+/g, '_').toLowerCase();
    a.download = `Ghi_am_${safeTitle}_${dateStr}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export const recordingStorageService = new RecordingStorageService();
