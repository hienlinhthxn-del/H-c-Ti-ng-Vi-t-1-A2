import { 
  StudentProfile, 
  ClassRoom, 
  ClassAnalyticsSummary, 
  StudentCompletedLesson,
  StudentStatus 
} from '../types';

const CLASSES_STORAGE_KEY = 'tiengviet1_classes_list_v2';
const STUDENTS_STORAGE_KEY = 'tiengviet1_students_roster_v2';
const CURRENT_CLASS_KEY = 'tiengviet1_current_class_id_v2';

// Initial Sample Classes
const DEFAULT_CLASSES: ClassRoom[] = [
  {
    id: 'lop-1a1',
    name: 'Lớp 1A',
    grade: 'Khối 1',
    schoolYear: '2024 - 2025',
    homeroomTeacher: 'Cô Mai Linh',
    totalStudents: 28,
    currentTargetLesson: 35
  }
];

// Generate 28 students roster matching the official class image
const generateDefaultStudents = (): StudentProfile[] => {
  const studentNames = [
    { code: 'HS01', name: 'Tòng Hoài An', gender: 'male', status: 'excellent', lessonsCount: 32, recs: 10, writes: 24, stars: 96, note: 'Đọc to, rõ ràng, phát âm tốt.' },
    { code: 'HS02', name: 'Lò Huyền Anh', gender: 'female', status: 'excellent', lessonsCount: 30, recs: 12, writes: 25, stars: 92, note: 'Giọng đọc truyền cảm, nét chữ đều đẹp.' },
    { code: 'HS03', name: 'Nguyễn Hoàng Tú Anh', gender: 'male', status: 'good', lessonsCount: 28, recs: 9, writes: 22, stars: 84, note: 'Chăm chỉ luyện đọc bài mới.' },
    { code: 'HS04', name: 'Nguyễn Phương Anh', gender: 'female', status: 'excellent', lessonsCount: 33, recs: 14, writes: 28, stars: 102, note: 'Đọc diễn cảm, tích cực phát biểu.' },
    { code: 'HS05', name: 'Mùa Ngọc Bích', gender: 'female', status: 'good', lessonsCount: 27, recs: 8, writes: 20, stars: 80, note: 'Phát âm chuẩn âm đầu và dấu thanh.' },
    { code: 'HS06', name: 'Nguyễn Ngọc Diệp', gender: 'female', status: 'good', lessonsCount: 29, recs: 9, writes: 21, stars: 86, note: 'Nắm chắc bài, chữ viết sạch sẽ.' },
    { code: 'HS07', name: 'Lê Nguyễn Linh Đan', gender: 'female', status: 'excellent', lessonsCount: 34, recs: 15, writes: 29, stars: 105, note: 'Đọc lưu loát, giọng đọc trong trẻo.' },
    { code: 'HS08', name: 'Nguyễn Hải Đăng', gender: 'male', status: 'good', lessonsCount: 26, recs: 7, writes: 19, stars: 78, note: 'Có nhiều tiến bộ khi đọc từ ứng dụng.' },
    { code: 'HS09', name: 'Tô Hải Đăng', gender: 'male', status: 'good', lessonsCount: 28, recs: 8, writes: 20, stars: 82, note: 'Đọc to dõng dạc, tự tin.' },
    { code: 'HS10', name: 'Giàng Hương Giang', gender: 'female', status: 'good', lessonsCount: 25, recs: 7, writes: 18, stars: 74, note: 'Thuộc bảng âm vần nhanh.' },
    { code: 'HS11', name: 'Lò Thị Ngọc Hân', gender: 'female', status: 'good', lessonsCount: 27, recs: 8, writes: 21, stars: 81, note: 'Ngoan ngoãn, rèn đọc chăm chỉ.' },
    { code: 'HS12', name: 'Giàng Ngọc Bảo Hân', gender: 'female', status: 'excellent', lessonsCount: 31, recs: 11, writes: 26, stars: 94, note: 'Đọc trôi chảy, diễn cảm.' },
    { code: 'HS13', name: 'Nguyễn Văn Khải', gender: 'male', status: 'good', lessonsCount: 24, recs: 6, writes: 17, stars: 72, note: 'Cần chú ý thêm thanh hỏi/ngã.' },
    { code: 'HS14', name: 'Nguyễn Khang', gender: 'male', status: 'good', lessonsCount: 26, recs: 7, writes: 18, stars: 76, note: 'Đọc tốt tiếng có âm đệm.' },
    { code: 'HS15', name: 'Tòng Minh Khôi', gender: 'male', status: 'average', lessonsCount: 20, recs: 5, writes: 14, stars: 60, note: 'Đang tiến bộ dần từng ngày.' },
    { code: 'HS16', name: 'Đặng Anh Khôi', gender: 'male', status: 'good', lessonsCount: 27, recs: 8, writes: 20, stars: 80, note: 'Đọc tốt các câu ứng dụng ngắn.' },
    { code: 'HS17', name: 'Khoàng Trang Lê', gender: 'female', status: 'good', lessonsCount: 25, recs: 7, writes: 19, stars: 75, note: 'Chữ viết sạch đẹp, ngay ngắn.' },
    { code: 'HS18', name: 'Đoàn Khánh Linh', gender: 'female', status: 'excellent', lessonsCount: 32, recs: 12, writes: 27, stars: 98, note: 'Đọc bài lưu loát, giọng hay.' },
    { code: 'HS19', name: 'Nguyễn Hoàng Long', gender: 'male', status: 'good', lessonsCount: 26, recs: 7, writes: 18, stars: 78, note: 'Hăng hái đọc bài và luyện viết.' },
    { code: 'HS20', name: 'Nông Ngọc Khải Minh', gender: 'male', status: 'good', lessonsCount: 28, recs: 9, writes: 22, stars: 85, note: 'Nhớ mặt chữ nhanh, phát âm chuẩn.' },
    { code: 'HS21', name: 'Phạm Hải Nam', gender: 'male', status: 'good', lessonsCount: 27, recs: 8, writes: 20, stars: 80, note: 'Đọc tốt các bài tập đọc 1.' },
    { code: 'HS22', name: 'Tòng Thị Kim Ngân', gender: 'female', status: 'good', lessonsCount: 26, recs: 7, writes: 19, stars: 78, note: 'Đọc rõ ràng, ngắt nghỉ đúng chỗ.' },
    { code: 'HS23', name: 'Trần Bảo Ngân', gender: 'female', status: 'excellent', lessonsCount: 33, recs: 13, writes: 28, stars: 100, note: 'Đọc bài rất lưu loát và biểu cảm.' },
    { code: 'HS24', name: 'Cao Đăng Phúc', gender: 'male', status: 'good', lessonsCount: 24, recs: 6, writes: 17, stars: 72, note: 'Cần luyện thêm vần khó.' },
    { code: 'HS25', name: 'Nguyễn Ngọc Anh Tú', gender: 'male', status: 'good', lessonsCount: 29, recs: 10, writes: 23, stars: 88, note: 'Năng nổ, phát âm to rõ.' },
    { code: 'HS26', name: 'Vừ Chí Thiện', gender: 'male', status: 'average', lessonsCount: 21, recs: 5, writes: 15, stars: 62, note: 'Cần kèm thêm ghép âm cuối.' },
    { code: 'HS27', name: 'Sùng Minh Thư', gender: 'female', status: 'good', lessonsCount: 25, recs: 7, writes: 18, stars: 76, note: 'Tập trung học tập tốt.' },
    { code: 'HS28', name: 'Lò Nhã Uyên', gender: 'female', status: 'good', lessonsCount: 28, recs: 9, writes: 21, stars: 84, note: 'Đọc chuẩn tiếng và từ ngữ.' }
  ];

  return studentNames.map((s, idx) => {
    // Generate completed lessons
    const completedList: StudentCompletedLesson[] = [];
    for (let i = 1; i <= s.lessonsCount; i++) {
      completedList.push({
        lessonKey: `vol1_${i}`,
        volume: 'vol1',
        lessonNumber: i,
        lessonTitle: `Bài ${i}`,
        completedAt: new Date(Date.now() - (s.lessonsCount - i) * 86400000 * 1.5).toISOString(),
        scoreStars: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        practiceType: i % 3 === 0 ? 'recording' : i % 2 === 0 ? 'writing' : 'reading'
      });
    }

    return {
      id: `student_${idx + 1}`,
      studentCode: s.code,
      name: s.name,
      gender: s.gender as 'male' | 'female',
      classId: 'lop-1a1',
      avatar: s.gender === 'female' ? '👧' : '👦',
      dob: '2018-05-15',
      completedLessons: completedList,
      recordingsCount: s.recs,
      writingCount: s.writes,
      starsCount: s.stars,
      streakDays: Math.floor(Math.random() * 5) + 2,
      status: s.status as StudentStatus,
      teacherNotes: s.note,
      lastActiveAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString()
    };
  });
};

type ClassAnalyticsSubscriber = () => void;

class ClassAnalyticsService {
  private subscribers: ClassAnalyticsSubscriber[] = [];
  private classes: ClassRoom[];
  private students: StudentProfile[];
  private currentClassId: string;

  constructor() {
    this.classes = this.loadClasses();
    this.students = this.loadStudents();
    this.currentClassId = this.loadCurrentClassId();
  }

  private loadClasses(): ClassRoom[] {
    try {
      const raw = localStorage.getItem(CLASSES_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load classes from storage:', e);
    }
    return DEFAULT_CLASSES;
  }

  private loadStudents(): StudentProfile[] {
    try {
      const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load students from storage:', e);
    }
    const defaults = generateDefaultStudents();
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(defaults));
    } catch (e) {}
    return defaults;
  }

  private loadCurrentClassId(): string {
    const saved = localStorage.getItem(CURRENT_CLASS_KEY);
    if (saved && this.classes.some(c => c.id === saved)) {
      return saved;
    }
    return this.classes[0]?.id || 'lop-1a1';
  }

  private saveClasses() {
    try {
      localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(this.classes));
    } catch (e) {
      console.error('Failed to save classes:', e);
    }
    this.notify();
  }

  private saveStudents() {
    try {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(this.students));
    } catch (e) {
      console.error('Failed to save students:', e);
    }
    this.notify();
  }

  private saveCurrentClassId() {
    try {
      localStorage.setItem(CURRENT_CLASS_KEY, this.currentClassId);
    } catch (e) {
      console.error('Failed to save current class id:', e);
    }
    this.notify();
  }

  public subscribe(cb: ClassAnalyticsSubscriber): () => void {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== cb);
    };
  }

  private notify() {
    this.subscribers.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Error in subscriber:', err);
      }
    });
  }

  // --- Classes Management ---
  public getAllClasses(): ClassRoom[] {
    return [...this.classes];
  }

  public getCurrentClassId(): string {
    return this.currentClassId;
  }

  public setCurrentClassId(classId: string) {
    if (this.classes.some(c => c.id === classId)) {
      this.currentClassId = classId;
      this.saveCurrentClassId();
    }
  }

  public getCurrentClass(): ClassRoom | undefined {
    return this.classes.find(c => c.id === this.currentClassId) || this.classes[0];
  }

  public addClass(newClass: Omit<ClassRoom, 'id'>): ClassRoom {
    const id = `class_${Date.now()}`;
    const item: ClassRoom = { ...newClass, id };
    this.classes.push(item);
    this.saveClasses();
    return item;
  }

  public updateClass(id: string, updates: Partial<ClassRoom>) {
    this.classes = this.classes.map(c => c.id === id ? { ...c, ...updates } : c);
    this.saveClasses();
  }

  public deleteClass(id: string) {
    this.classes = this.classes.filter(c => c.id !== id);
    this.students = this.students.filter(s => s.classId !== id);
    if (this.currentClassId === id && this.classes.length > 0) {
      this.currentClassId = this.classes[0].id;
    }
    this.saveClasses();
    this.saveStudents();
  }

  // --- Students Management ---
  public getStudentsByClass(classId: string = this.currentClassId): StudentProfile[] {
    return this.students.filter(s => s.classId === classId);
  }

  public getStudentById(studentId: string): StudentProfile | undefined {
    return this.students.find(s => s.id === studentId);
  }

  public addStudent(studentData: Omit<StudentProfile, 'id' | 'completedLessons' | 'recordingsCount' | 'writingCount' | 'starsCount' | 'streakDays' | 'lastActiveAt'> & { completedLessons?: StudentCompletedLesson[] }): StudentProfile {
    const id = `student_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newStudent: StudentProfile = {
      ...studentData,
      id,
      completedLessons: studentData.completedLessons || [],
      recordingsCount: 0,
      writingCount: 0,
      starsCount: 10,
      streakDays: 1,
      lastActiveAt: new Date().toISOString()
    };
    this.students.push(newStudent);
    
    // Update class student count
    const cls = this.classes.find(c => c.id === newStudent.classId);
    if (cls) {
      cls.totalStudents = this.students.filter(s => s.classId === cls.id).length;
      this.saveClasses();
    }

    this.saveStudents();
    return newStudent;
  }

  public updateStudent(studentId: string, updates: Partial<StudentProfile>) {
    this.students = this.students.map(s => {
      if (s.id === studentId) {
        return { ...s, ...updates };
      }
      return s;
    });
    this.saveStudents();
  }

  public deleteStudent(studentId: string) {
    const student = this.students.find(s => s.id === studentId);
    this.students = this.students.filter(s => s.id !== studentId);
    if (student) {
      const cls = this.classes.find(c => c.id === student.classId);
      if (cls) {
        cls.totalStudents = this.students.filter(s => s.classId === cls.id).length;
        this.saveClasses();
      }
    }
    this.saveStudents();
  }

  // --- Mark Lesson Completed for a Student ---
  public markLessonCompletedForStudent(
    studentId: string, 
    lessonKey: string, 
    volume: 'vol1' | 'vol2', 
    lessonNumber: number, 
    lessonTitle: string, 
    scoreStars: number = 5,
    practiceType: 'reading' | 'writing' | 'recording' = 'reading'
  ) {
    this.students = this.students.map(s => {
      if (s.id !== studentId) return s;
      const already = s.completedLessons.find(cl => cl.lessonKey === lessonKey);
      let updatedList = [...s.completedLessons];
      if (already) {
        updatedList = updatedList.map(cl => cl.lessonKey === lessonKey ? { ...cl, scoreStars, completedAt: new Date().toISOString() } : cl);
      } else {
        updatedList.push({
          lessonKey,
          volume,
          lessonNumber,
          lessonTitle,
          completedAt: new Date().toISOString(),
          scoreStars,
          practiceType
        });
      }

      return {
        ...s,
        completedLessons: updatedList,
        starsCount: s.starsCount + scoreStars,
        lastActiveAt: new Date().toISOString()
      };
    });
    this.saveStudents();
  }

  // --- Toggle Lesson for a Student ---
  public toggleStudentLesson(studentId: string, lessonKey: string, volume: 'vol1' | 'vol2', lessonNumber: number, lessonTitle: string) {
    this.students = this.students.map(s => {
      if (s.id !== studentId) return s;
      const exists = s.completedLessons.some(cl => cl.lessonKey === lessonKey);
      let updatedList: StudentCompletedLesson[];
      let newStars = s.starsCount;

      if (exists) {
        updatedList = s.completedLessons.filter(cl => cl.lessonKey !== lessonKey);
        newStars = Math.max(0, newStars - 3);
      } else {
        updatedList = [
          ...s.completedLessons,
          {
            lessonKey,
            volume,
            lessonNumber,
            lessonTitle,
            completedAt: new Date().toISOString(),
            scoreStars: 5,
            practiceType: 'reading'
          }
        ];
        newStars += 3;
      }

      return {
        ...s,
        completedLessons: updatedList,
        starsCount: newStars,
        lastActiveAt: new Date().toISOString()
      };
    });
    this.saveStudents();
  }

  // --- Mark a lesson completed for the ENTIRE class ---
  public markLessonForWholeClass(
    classId: string, 
    lessonKey: string, 
    volume: 'vol1' | 'vol2', 
    lessonNumber: number, 
    lessonTitle: string
  ) {
    this.students = this.students.map(s => {
      if (s.classId !== classId) return s;
      const exists = s.completedLessons.some(cl => cl.lessonKey === lessonKey);
      if (exists) return s;
      return {
        ...s,
        completedLessons: [
          ...s.completedLessons,
          {
            lessonKey,
            volume,
            lessonNumber,
            lessonTitle,
            completedAt: new Date().toISOString(),
            scoreStars: 5,
            practiceType: 'reading'
          }
        ],
        starsCount: s.starsCount + 3,
        lastActiveAt: new Date().toISOString()
      };
    });
    this.saveStudents();
  }

  // --- Analytics Summary ---
  public getClassAnalyticsSummary(classId: string = this.currentClassId): ClassAnalyticsSummary {
    const classStudents = this.getStudentsByClass(classId);
    const total = classStudents.length;

    if (total === 0) {
      return {
        totalStudents: 0,
        activeStudentsCount: 0,
        averageCompletionRate: 0,
        totalLessonsCompleted: 0,
        totalRecordingsSubmitted: 0,
        totalWritingSubmitted: 0,
        averageStars: 0,
        statusBreakdown: { excellent: 0, good: 0, average: 0, needs_support: 0 },
        mostCompletedLessons: [],
        leastCompletedLessons: []
      };
    }

    const totalTargetLessons = 91; // 83 vol1 + 8 vol2
    let totalLessonsCount = 0;
    let totalRecsCount = 0;
    let totalWritesCount = 0;
    let totalStarsCount = 0;

    const statusMap = { excellent: 0, good: 0, average: 0, needs_support: 0 };
    const lessonCompletionCountMap: Record<string, { title: string; count: number }> = {};

    classStudents.forEach(s => {
      totalLessonsCount += s.completedLessons.length;
      totalRecsCount += s.recordingsCount;
      totalWritesCount += s.writingCount;
      totalStarsCount += s.starsCount;
      
      if (statusMap[s.status] !== undefined) {
        statusMap[s.status]++;
      }

      s.completedLessons.forEach(cl => {
        if (!lessonCompletionCountMap[cl.lessonKey]) {
          lessonCompletionCountMap[cl.lessonKey] = { title: cl.lessonTitle, count: 0 };
        }
        lessonCompletionCountMap[cl.lessonKey].count++;
      });
    });

    const avgLessons = totalLessonsCount / total;
    const avgRate = Math.min(100, Math.round((avgLessons / totalTargetLessons) * 100));

    // Sort lesson completions
    const lessonEntries = Object.entries(lessonCompletionCountMap).map(([key, val]) => ({
      lessonKey: key,
      lessonTitle: val.title,
      completedCount: val.count,
      percentage: Math.round((val.count / total) * 100)
    }));

    lessonEntries.sort((a, b) => b.completedCount - a.completedCount);

    const most = lessonEntries.slice(0, 5);
    const least = [...lessonEntries].reverse().slice(0, 5);

    return {
      totalStudents: total,
      activeStudentsCount: classStudents.filter(s => {
        const last = new Date(s.lastActiveAt).getTime();
        return Date.now() - last < 7 * 86400000; // active in last 7 days
      }).length,
      averageCompletionRate: avgRate,
      totalLessonsCompleted: totalLessonsCount,
      totalRecordingsSubmitted: totalRecsCount,
      totalWritingSubmitted: totalWritesCount,
      averageStars: Math.round(totalStarsCount / total),
      statusBreakdown: statusMap,
      mostCompletedLessons: most,
      leastCompletedLessons: least
    };
  }

  // --- Lesson matrix for heatmaps ---
  public getLessonCompletionMatrix(classId: string, volume: 'vol1' | 'vol2', maxLessons: number = 83) {
    const classStudents = this.getStudentsByClass(classId);
    const total = classStudents.length;
    const matrix: Array<{
      lessonNumber: number;
      lessonKey: string;
      completedStudents: string[]; // names
      completedCount: number;
      completionRate: number;
    }> = [];

    const limit = volume === 'vol1' ? maxLessons : 8;

    for (let i = 1; i <= limit; i++) {
      const key = `${volume}_${i}`;
      const completed = classStudents.filter(s => s.completedLessons.some(cl => cl.lessonKey === key));
      matrix.push({
        lessonNumber: i,
        lessonKey: key,
        completedStudents: completed.map(s => s.name),
        completedCount: completed.length,
        completionRate: total > 0 ? Math.round((completed.length / total) * 100) : 0
      });
    }

    return matrix;
  }

  // --- Reset & Import/Export ---
  public resetToDefaultData() {
    this.classes = DEFAULT_CLASSES;
    this.students = generateDefaultStudents();
    this.currentClassId = 'lop-1a1';
    this.saveClasses();
    this.saveStudents();
    this.saveCurrentClassId();
  }

  public exportAllToJson(): string {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      classes: this.classes,
      students: this.students
    }, null, 2);
  }

  public importFromJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.classes) && Array.isArray(data.students)) {
        this.classes = data.classes;
        this.students = data.students;
        if (this.classes.length > 0) {
          this.currentClassId = this.classes[0].id;
        }
        this.saveClasses();
        this.saveStudents();
        this.saveCurrentClassId();
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON data:', e);
    }
    return false;
  }

  // Generate CSV data for downloading class gradebook
  public exportClassCsv(classId: string = this.currentClassId): string {
    const cls = this.classes.find(c => c.id === classId) || this.classes[0];
    const students = this.getStudentsByClass(classId);

    const headers = [
      'STT',
      'Mã Học Sinh',
      'Họ và Tên',
      'Giới Tính',
      'Lớp',
      'Số Bài Đã Học (Tập 1)',
      'Số Bài Đã Học (Tập 2)',
      'Tổng Bài Hoàn Thành',
      'Số Bài Ghi Âm Nộp',
      'Số Bài Luyện Viết',
      'Tổng Sao Đạt Được',
      'Xếp Loại Tiến Độ',
      'Nhận Xét Của Giáo Viên',
      'Hoạt Động Gần Nhất'
    ];

    const rows = students.map((s, idx) => {
      const vol1Count = s.completedLessons.filter(cl => cl.volume === 'vol1').length;
      const vol2Count = s.completedLessons.filter(cl => cl.volume === 'vol2').length;
      const statusText = s.status === 'excellent' ? 'Xuất sắc' : s.status === 'good' ? 'Tốt' : s.status === 'average' ? 'Đạt' : 'Cần hỗ trợ';

      return [
        idx + 1,
        `"${s.studentCode}"`,
        `"${s.name}"`,
        s.gender === 'male' ? 'Nam' : 'Nữ',
        `"${cls?.name || 'Lớp 1'}"`,
        vol1Count,
        vol2Count,
        s.completedLessons.length,
        s.recordingsCount,
        s.writingCount,
        s.starsCount,
        `"${statusText}"`,
        `"${(s.teacherNotes || '').replace(/"/g, '""')}"`,
        `"${new Date(s.lastActiveAt).toLocaleDateString('vi-VN')}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}

export const classAnalyticsService = new ClassAnalyticsService();
