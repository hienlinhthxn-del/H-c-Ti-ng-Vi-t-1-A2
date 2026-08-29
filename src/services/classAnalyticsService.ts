import { 
  StudentProfile, 
  ClassRoom, 
  ClassAnalyticsSummary, 
  StudentCompletedLesson,
  StudentStatus 
} from '../types';

const CLASSES_STORAGE_KEY = 'tiengviet1_classes_list_v1';
const STUDENTS_STORAGE_KEY = 'tiengviet1_students_roster_v1';
const CURRENT_CLASS_KEY = 'tiengviet1_current_class_id_v1';

// Initial Sample Classes
const DEFAULT_CLASSES: ClassRoom[] = [
  {
    id: 'lop-1a1',
    name: 'Lớp 1A1',
    grade: 'Khối 1',
    schoolYear: '2024 - 2025',
    homeroomTeacher: 'Cô Nguyễn Thị Lan',
    totalStudents: 18,
    currentTargetLesson: 45
  },
  {
    id: 'lop-1a2',
    name: 'Lớp 1A2',
    grade: 'Khối 1',
    schoolYear: '2024 - 2025',
    homeroomTeacher: 'Cô Trần Hải Yến',
    totalStudents: 16,
    currentTargetLesson: 42
  }
];

// Generate realistic default student roster with varied progress for demo/real classroom usage
const generateDefaultStudents = (): StudentProfile[] => {
  const avatars = ['👦', '👧', '🧒', '👶'];
  
  const studentNames = [
    { code: 'HS01', name: 'Nguyễn Gia Bảo', gender: 'male', status: 'excellent', lessonsCount: 46, recs: 14, writes: 32, stars: 138, note: 'Đọc to, rõ ràng, phát âm chuẩn các âm khó gi/d, tr/ch.' },
    { code: 'HS02', name: 'Trần Bảo Anh', gender: 'female', status: 'excellent', lessonsCount: 45, recs: 15, writes: 35, stars: 142, note: 'Giọng đọc truyền cảm, ngắt nghỉ đúng dấu câu, viết chữ đều nét.' },
    { code: 'HS03', name: 'Lê Minh Khang', gender: 'male', status: 'good', lessonsCount: 42, recs: 11, writes: 28, stars: 118, note: 'Chăm chỉ luyện đọc, cần rèn thêm vần uy/uya.' },
    { code: 'HS04', name: 'Phạm Ngọc Mai', gender: 'female', status: 'excellent', lessonsCount: 48, recs: 18, writes: 38, stars: 156, note: 'Trạng nguyên nhí của lớp, đọc lưu loát mọi bài thơ văn.' },
    { code: 'HS05', name: 'Hoàng Đức Anh', gender: 'male', status: 'good', lessonsCount: 39, recs: 8, writes: 24, stars: 102, note: 'Đọc tiến bộ rõ rệt, nét chữ rê bút chưa thật mềm.' },
    { code: 'HS06', name: 'Vũ Quỳnh Chi', gender: 'female', status: 'good', lessonsCount: 41, recs: 10, writes: 27, stars: 112, note: 'Thuộc bảng chữ cái nhanh, giọng đọc vang và tự tin.' },
    { code: 'HS07', name: 'Đặng Tuấn Kiệt', gender: 'male', status: 'needs_support', lessonsCount: 22, recs: 4, writes: 12, stars: 58, note: 'Hay nhầm lẫn dấu hỏi/ngã và âm s/x. Cần kèm thêm 15p sau giờ học.' },
    { code: 'HS08', name: 'Bùi Thảo Linh', gender: 'female', status: 'good', lessonsCount: 40, recs: 9, writes: 29, stars: 115, note: 'Đọc tốt phần từ ngữ ứng dụng, chữ viết sạch sẽ.' },
    { code: 'HS09', name: 'Ngô Quang Huy', gender: 'male', status: 'average', lessonsCount: 32, recs: 6, writes: 18, stars: 84, note: 'Đọc còn hơi chậm, cần luyện ghép vần có âm đệm o/u.' },
    { code: 'HS10', name: 'Đỗ Hà My', gender: 'female', status: 'excellent', lessonsCount: 44, recs: 12, writes: 31, stars: 130, note: 'Phát âm chuẩn âm đầu và thanh điệu, tích cực phát biểu.' },
    { code: 'HS11', name: 'Dương Tiến Dũng', gender: 'male', status: 'needs_support', lessonsCount: 19, recs: 3, writes: 10, stars: 49, note: 'Chưa vững vần đôi iê/yê, ươ, uô. Cần hỗ trợ thẻ từ tại nhà.' },
    { code: 'HS12', name: 'Lý Kim Ngân', gender: 'female', status: 'good', lessonsCount: 38, recs: 8, writes: 26, stars: 105, note: 'Đọc trôi chảy các bài văn ngắn, ngoan ngoãn.' },
    { code: 'HS13', name: 'Trịnh Đình Trọng', gender: 'male', status: 'average', lessonsCount: 30, recs: 5, writes: 16, stars: 76, note: 'Cần chú ý tư thế ngồi viết và cách cầm bút 3 ngón.' },
    { code: 'HS14', name: 'Võ Phương Linh', gender: 'female', status: 'excellent', lessonsCount: 43, recs: 13, writes: 33, stars: 135, note: 'Giọng đọc ngọt ngào, đọc thơ có ngữ điệu diễn cảm.' },
    { code: 'HS15', name: 'Mai Văn Hùng', gender: 'male', status: 'good', lessonsCount: 37, recs: 7, writes: 23, stars: 98, note: 'Đọc to dõng dạc, cần lưu ý ngắt giọng ở dấu phẩy.' },
    { code: 'HS16', name: 'Chu Thu Trang', gender: 'female', status: 'good', lessonsCount: 39, recs: 8, writes: 25, stars: 108, note: 'Nhớ bài lâu, hoàn thành đầy đủ bài tập cô giao.' },
    { code: 'HS17', name: 'Phan Quốc Bảo', gender: 'male', status: 'average', lessonsCount: 28, recs: 4, writes: 14, stars: 70, note: 'Đọc câu dài còn ngắt quãng, đang cải thiện tốt.' },
    { code: 'HS18', name: 'Lương Ánh Tuyết', gender: 'female', status: 'good', lessonsCount: 41, recs: 11, writes: 30, stars: 122, note: 'Nắm chắc cấu tạo tiếng và mô hình đánh vần KNTT.' }
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
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load students from storage:', e);
    }
    return generateDefaultStudents();
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
