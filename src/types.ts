export type VolumeType = 'tap1' | 'tap2' | 'intro';

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

export interface AchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  category: 'total_reading' | 'vol1_lessons' | 'vol2_lessons' | 'practice' | 'voice_recording';
  requirementType: 'lessons_completed' | 'vol1_lessons' | 'vol2_lessons' | 'practice_count' | 'recordings_count';
  requiredCount: number;
  rewardStars: number;
  unlockedAt?: string;
}

export interface StudentTitleInfo {
  title: string;
  subtitle: string;
  icon: string;
  level: number;
  color: string;
  nextBadge?: AchievementBadge;
  unlockedCount: number;
  totalBadgesCount: number;
}
