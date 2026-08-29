export type VolumeType = 'tap1' | 'tap2' | 'intro';
export type UserRole = 'student' | 'teacher' | 'parent';

export interface PhonicItem {
  letter: string;
  uppercase: string;
  name: string; // Tên chữ cái/vần
  exampleWord: string;
  exampleImage?: string;
  strokeGuide?: string;
}

export interface SyllableModel {
  initial: string; // Âm đầu (ví dụ: b)
  vowel: string;   // Âm chính/vần (ví dụ: a)
  tone?: string;    // Dấu thanh (ví dụ: sắc, huyền)
  result: string;  // Tiếng hoàn chỉnh (ví dụ: ba, bà, cá)
  spellingSteps?: string[]; // ["bê", "a", "ba"] hoặc ["b", "a", "ba", "huyền", "bà"]
}

export interface WordItem {
  word: string;
  highlightPart?: string;
  meaning?: string;
  illustrationIcon?: string;
  imageDesc?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Volume1Lesson {
  id: number;
  lessonNumber: number;
  title: string; // ví dụ: "A a" hoặc "B b ` " hoặc "Ôn tập và kể chuyện"
  type: 'phonics' | 'review' | 'spelling_practice';
  pageRange: string;
  // Phần 1: Đọc âm, vần (Nhận biết)
  part1_Letters: {
    title: string;
    letters: string[];
    recognitionSentence: string; // ví dụ: "Nam và Hà ca hát."
    recognitionKeywords?: string[];
  };
  // Phần 2: Đọc tiếng, từ ngữ
  part2_SyllablesAndWords: {
    title: string;
    models: SyllableModel[];
    readingSyllables: string[]; // ví dụ: ["bò", "bó", "bỏ", "cò", "có", "cỏ"]
    words: WordItem[]; // ví dụ: [{word: "bò", imageDesc: "con bò"}, {word: "cò", imageDesc: "con cò"}]
    gridWords?: string[][]; // Bảng ghép vần ở bài ôn tập
  };
  // Phần 3: Đọc câu, đoạn văn & Luyện nói / Viết
  part3_SentenceAndPractice: {
    title: string;
    readingPassage: string; // ví dụ: "Bà bế bé." hoặc đoạn văn ngắn
    writingSamples: string[]; // Mẫu viết trên ô li (ví dụ: ["b", "ba", "bà"])
    speakingTopic?: {
      title: string;
      prompt: string;
      questions?: string[];
    };
    story?: {
      title: string;
      pictures: {
        id: number;
        question: string;
        content?: string;
      }[];
    };
  };
  quiz: QuizQuestion[];
}

export interface Volume2Lesson {
  id: number;
  lessonNumber: number;
  topicId: number;
  topicTitle: string;
  title: string; // ví dụ: "Tôi là học sinh lớp 1"
  pageRange: string;
  isReview?: boolean;
  // Khởi động
  warmup: {
    prompt: string;
    subQuestions?: string[];
  };
  // Bài đọc (Thơ hoặc Văn xuôi)
  reading: {
    title: string;
    author?: string;
    type: 'poem' | 'story' | 'article';
    content: string[]; // Các dòng thơ hoặc các đoạn văn
    vocabulary: { word: string; meaning: string }[];
    phonicsFocus?: string[]; // Các vần cần chú ý ví dụ: ["uây", "oang", "uyt"]
  };
  // Trả lời câu hỏi đọc hiểu
  comprehensionQuestions: {
    id: string;
    question: string;
    options?: string[];
    correctOption?: number;
    sampleAnswer: string;
  }[];
  // Luyện tập chính tả / Luyện từ và câu
  practice: {
    spellingExercise?: {
      type: 'fill_letter' | 'choose_sound' | 'find_words';
      prompt: string;
      pairs?: { options: string[]; textWithBlank: string; answer: string }[];
      rhymeMatching?: { word: string; rhymingWith: string }[];
    };
    writingPrompt?: string; // Viết vào vở câu trả lời...
    dictationText?: string; // Nghe viết
    speakingActivity?: {
      title: string;
      prompt: string;
    };
    crossword?: {
      hintWords: { number: number; hint: string; answer: string }[];
      secretWord: string;
    };
  };
}

export interface TopicGroup {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Volume2Lesson[];
}

export interface StudentRecording {
  id: string;
  volume: 'vol1' | 'vol2';
  lessonId: number;
  lessonNumber?: number;
  lessonTitle: string;
  sectionTitle?: string;
  targetText: string;
  audioBlobUrl?: string;
  audioBase64?: string;
  mimeType: string;
  durationSeconds: number;
  createdAt: string; // ISO string
  feedback?: {
    starsEarned: number;
    cheeringMessage: string;
    fluencyRating: 'excellent' | 'great' | 'good';
  };
  teacherComment?: string;
  teacherScore?: number;
  reviewedAt?: string;
}

export interface RecordingTargetInfo {
  volume: 'vol1' | 'vol2';
  lessonId: number;
  lessonNumber?: number;
  lessonTitle: string;
  sectionTitle?: string;
  targetText: string;
  referenceAudioText?: string;
}

export interface TeacherAudioTarget {
  text?: string;
  targetText?: string;
  displayTitle?: string;
  sectionTitle?: string;
  volume?: 'vol1' | 'vol2';
  lessonId?: number;
  lessonNumber?: number;
  lessonTitle?: string;
  section?: 'letter' | 'syllable' | 'word' | 'sentence' | 'passage' | 'quiz' | 'general';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'reading_count' | 'volume_completion' | 'recording_count' | 'streak';
  requiredCount: number;
  unlockedAt?: string; // ISO string if unlocked
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export interface AcademicRank {
  level: number;
  title: string;
  minCompletedLessons: number;
  badgeIcon: string;
  color: string;
  description: string;
}

export interface AchievementState {
  completedLessonKeys: string[]; // e.g. ["vol1_1", "vol1_2", "vol2_1"]
  unlockedBadgeIds: string[];
  totalRecordingsCount: number;
  starsCount: number;
}

export type StudentStatus = 'excellent' | 'good' | 'average' | 'needs_support';

export interface StudentCompletedLesson {
  lessonKey: string; // "vol1_1" or "vol2_1"
  volume: 'vol1' | 'vol2';
  lessonNumber: number;
  lessonTitle: string;
  completedAt: string; // ISO string
  scoreStars: number;
  practiceType: 'reading' | 'writing' | 'recording';
}

export interface StudentProfile {
  id: string;
  studentCode: string; // e.g. "HS01"
  name: string;
  gender: 'male' | 'female';
  classId: string;
  avatar: string;
  dob?: string;
  completedLessons: StudentCompletedLesson[];
  recordingsCount: number;
  writingCount: number;
  starsCount: number;
  streakDays: number;
  status: StudentStatus;
  teacherNotes: string;
  lastActiveAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  schoolYear: string;
  homeroomTeacher: string;
  totalStudents: number;
  currentTargetLesson: number; // e.g. lesson number currently teaching (e.g. 45)
}

export interface ClassAnalyticsSummary {
  totalStudents: number;
  activeStudentsCount: number;
  averageCompletionRate: number; // 0 - 100%
  totalLessonsCompleted: number;
  totalRecordingsSubmitted: number;
  totalWritingSubmitted: number;
  averageStars: number;
  statusBreakdown: {
    excellent: number;
    good: number;
    average: number;
    needs_support: number;
  };
  mostCompletedLessons: {
    lessonKey: string;
    lessonTitle: string;
    completedCount: number;
    percentage: number;
  }[];
  leastCompletedLessons: {
    lessonKey: string;
    lessonTitle: string;
    completedCount: number;
    percentage: number;
  }[];
}

export interface AppUserProfile {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  studentCode?: string;
  classroom?: string;
  gender?: 'male' | 'female';
  pinCode?: string;
  linkedStudentIds?: string[];
  starsCount: number;
  completedLessonKeys: string[];
  unlockedBadgeIds: string[];
  totalRecordingsCount: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface GoogleAccountInfo {
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  expiresAt: number;
}

export interface GoogleSheetsSyncStatus {
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  lastSyncedAt?: string;
  totalRowsSynced?: number;
  status: 'idle' | 'syncing' | 'synced' | 'error';
  errorMessage?: string;
}

export interface GoogleDriveSyncStatus {
  folderId?: string;
  folderUrl?: string;
  lastSyncedAt?: string;
  totalFilesUploaded?: number;
  status: 'idle' | 'syncing' | 'synced' | 'error';
  errorMessage?: string;
}

export interface GoogleClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  alternateLink?: string;
}

export interface GoogleClassroomAssignment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state?: string;
  alternateLink?: string;
  maxPoints?: number;
  dueDate?: { year: number; month: number; day: number };
}


