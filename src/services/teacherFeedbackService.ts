import { TeacherParentFeedback } from '../types';

const FEEDBACK_STORAGE_KEY = 'tiengviet1_teacher_parent_feedbacks_v1';

// Sample initial feedbacks from Homeroom Teacher
const DEFAULT_FEEDBACKS: TeacherParentFeedback[] = [
  {
    id: 'fb_init_1',
    studentId: 'student_1',
    studentName: 'Tòng Hoài An',
    studentCode: 'HS01',
    teacherName: 'Cô Hiền Phan (GVCN Lớp 1A)',
    category: 'praise',
    title: 'Khen ngợi tinh thần học tập trên lớp',
    content: 'Cô khen Hoài An tuần này rất chăm chỉ, phát biểu to, rõ ràng và đã thuộc hết các âm vần chặng 1. Con đọc bài lưu loát và viết nét chữ rất đều. Bố Mẹ tiếp tục đồng hành và động viên con nhé!',
    score: 5,
    lessonTitle: 'Bài 15: Ôn tập âm chữ',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    isReadByParent: false
  },
  {
    id: 'fb_init_2',
    studentId: 'student_hs_hs01',
    studentName: 'Tòng Hoài An',
    studentCode: 'HS01',
    teacherName: 'Cô Hiền Phan (GVCN Lớp 1A)',
    category: 'homework',
    title: 'Dặn dò phụ huynh cùng con luyện đọc ở nhà',
    content: 'Kính gửi Bố Mẹ: Tối nay Bố Mẹ hãy mở mục "Luyện đọc cùng bé" cho con nghe lại mẫu âm "ng - ngh", sau đó cho con tự thu âm và bấm nộp bài để cô chấm điểm sao nhé! Chúc gia đình buổi tối vui vẻ!',
    score: 5,
    lessonTitle: 'Bài 24: ng, ngh',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    isReadByParent: false
  }
];

class TeacherFeedbackService {
  private feedbacks: TeacherParentFeedback[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (stored) {
        this.feedbacks = JSON.parse(stored);
      } else {
        this.feedbacks = DEFAULT_FEEDBACKS;
        this.save();
      }
    } catch (e) {
      console.warn('Failed to load teacher feedbacks from localStorage:', e);
      this.feedbacks = DEFAULT_FEEDBACKS;
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(this.feedbacks));
      this.notify();
    } catch (e) {
      console.error('Failed to save teacher feedbacks:', e);
    }
  }

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
      } catch (err) {
        console.error('Error in feedback listener:', err);
      }
    });
  }

  public getAllFeedbacks(): TeacherParentFeedback[] {
    return [...this.feedbacks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getFeedbacksForStudent(studentId: string, studentName?: string): TeacherParentFeedback[] {
    const list = this.getAllFeedbacks();
    return list.filter(f => {
      if (f.studentId === studentId) return true;
      // Match by normalized name or code if IDs differ between subsystems
      if (studentName && f.studentName.toLowerCase().trim() === studentName.toLowerCase().trim()) return true;
      if (studentId.includes('student_1') && (f.studentId === 'student_hs_hs01' || f.studentId === 'student_1')) return true;
      if (studentId.includes('hs01') && (f.studentCode === 'HS01' || f.studentId.includes('hs01'))) return true;
      return false;
    });
  }

  public getUnreadCount(studentId?: string, studentName?: string): number {
    if (!studentId && !studentName) {
      return this.feedbacks.filter(f => !f.isReadByParent).length;
    }
    const studentList = this.getFeedbacksForStudent(studentId || '', studentName);
    return studentList.filter(f => !f.isReadByParent).length;
  }

  public sendFeedback(
    data: Omit<TeacherParentFeedback, 'id' | 'createdAt' | 'isReadByParent'>
  ): TeacherParentFeedback {
    const newFeedback: TeacherParentFeedback = {
      ...data,
      id: 'fb_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      isReadByParent: false
    };

    this.feedbacks.unshift(newFeedback);
    this.save();
    return newFeedback;
  }

  public markAsRead(feedbackId: string): void {
    const fb = this.feedbacks.find(f => f.id === feedbackId);
    if (fb && !fb.isReadByParent) {
      fb.isReadByParent = true;
      this.save();
    }
  }

  public markAllAsReadForStudent(studentId: string, studentName?: string): void {
    let changed = false;
    const studentList = this.getFeedbacksForStudent(studentId, studentName);
    studentList.forEach(item => {
      if (!item.isReadByParent) {
        item.isReadByParent = true;
        changed = true;
      }
    });
    if (changed) {
      this.save();
    }
  }

  public acknowledgeFeedback(feedbackId: string, replyMessage?: string): void {
    const fb = this.feedbacks.find(f => f.id === feedbackId);
    if (fb) {
      fb.isReadByParent = true;
      fb.parentAcknowledgedAt = new Date().toISOString();
      if (replyMessage) {
        fb.parentReply = replyMessage;
      }
      this.save();
    }
  }

  public deleteFeedback(feedbackId: string): void {
    this.feedbacks = this.feedbacks.filter(f => f.id !== feedbackId);
    this.save();
  }
}

export const teacherFeedbackService = new TeacherFeedbackService();
