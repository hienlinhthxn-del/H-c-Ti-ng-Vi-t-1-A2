import React, { useState } from 'react';
import { Volume1Lesson, Volume2Lesson, SyllableModel, WordItem, QuizQuestion } from '../types';
import { speechService } from '../services/speechService';
import { lessonStorageService } from '../services/lessonStorageService';
import { 
  X, Save, RotateCcw, Volume2, Plus, Trash2, Edit3, 
  HelpCircle, BookOpen, PenTool, Sparkles, Check, 
  ChevronRight, AlertCircle, Info, Layers
} from 'lucide-react';

interface TeacherLessonEditorModalProps {
  volume: 'vol1' | 'vol2';
  vol1Lesson?: Volume1Lesson;
  vol2Lesson?: Volume2Lesson;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedLesson: Volume1Lesson | Volume2Lesson) => void;
}

export const TeacherLessonEditorModal: React.FC<TeacherLessonEditorModalProps> = ({
  volume,
  vol1Lesson,
  vol2Lesson,
  isOpen,
  onClose,
  onSaveSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {volume === 'vol1' && vol1Lesson && (
          <Volume1Editor 
            initialLesson={vol1Lesson} 
            onClose={onClose} 
            onSaveSuccess={onSaveSuccess} 
          />
        )}
        {volume === 'vol2' && vol2Lesson && (
          <Volume2Editor 
            initialLesson={vol2Lesson} 
            onClose={onClose} 
            onSaveSuccess={onSaveSuccess} 
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// VOLUME 1 EDITOR COMPONENT
// ============================================================================
interface Volume1EditorProps {
  initialLesson: Volume1Lesson;
  onClose: () => void;
  onSaveSuccess: (lesson: Volume1Lesson) => void;
}

const Volume1Editor: React.FC<Volume1EditorProps> = ({ initialLesson, onClose, onSaveSuccess }) => {
  const [activeTab, setActiveTab] = useState<'info_p1' | 'part2' | 'part3' | 'quiz'>('info_p1');
  const [lesson, setLesson] = useState<Volume1Lesson>(() => JSON.parse(JSON.stringify(initialLesson)));
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const isCustomized = lessonStorageService.isVolume1Customized(lesson.id);

  const handleSave = () => {
    lessonStorageService.saveVolume1Lesson(lesson);
    speechService.playSoundEffect('success');
    setSaveToast('Đã lưu bài học thành công!');
    setTimeout(() => {
      onSaveSuccess(lesson);
      onClose();
    }, 600);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục nội dung bài học về bản gốc sách giáo khoa chuẩn? Mọi chỉnh sửa tùy biến của bài này sẽ bị xóa.')) {
      lessonStorageService.resetVolume1Lesson(lesson.id);
      const defaultLesson = lessonStorageService.getDefaultVolume1Lesson(lesson.id);
      if (defaultLesson) {
        setLesson(JSON.parse(JSON.stringify(defaultLesson)));
      }
      speechService.playSoundEffect('pop');
      setSaveToast('Đã khôi phục về bản gốc SGK!');
      setTimeout(() => setSaveToast(null), 2500);
    }
  };

  // Helper to add a syllable model
  const handleAddSyllableModel = () => {
    const newModel: SyllableModel = {
      initial: '',
      vowel: '',
      result: '',
      spellingSteps: []
    };
    setLesson(prev => ({
      ...prev,
      part2_SyllablesAndWords: {
        ...prev.part2_SyllablesAndWords,
        models: [...prev.part2_SyllablesAndWords.models, newModel]
      }
    }));
  };

  // Helper to remove a syllable model
  const handleRemoveSyllableModel = (index: number) => {
    setLesson(prev => ({
      ...prev,
      part2_SyllablesAndWords: {
        ...prev.part2_SyllablesAndWords,
        models: prev.part2_SyllablesAndWords.models.filter((_, i) => i !== index)
      }
    }));
  };

  // Helper to add word item
  const handleAddWord = () => {
    const newWord: WordItem = {
      word: '',
      highlightPart: '',
      meaning: '',
      illustrationIcon: '📘',
      imageDesc: ''
    };
    setLesson(prev => ({
      ...prev,
      part2_SyllablesAndWords: {
        ...prev.part2_SyllablesAndWords,
        words: [...prev.part2_SyllablesAndWords.words, newWord]
      }
    }));
  };

  // Helper to remove word item
  const handleRemoveWord = (index: number) => {
    setLesson(prev => ({
      ...prev,
      part2_SyllablesAndWords: {
        ...prev.part2_SyllablesAndWords,
        words: prev.part2_SyllablesAndWords.words.filter((_, i) => i !== index)
      }
    }));
  };

  // Helper to add quiz question
  const handleAddQuiz = () => {
    const newQ: QuizQuestion = {
      id: 'q_' + Date.now(),
      question: 'Tiếng nào sau đây có âm ' + (lesson.part1_Letters.letters[0] || 'a') + '?',
      options: ['Tiếng mẫu 1', 'Tiếng mẫu 2', 'Tiếng mẫu 3'],
      correctIndex: 0,
      explanation: 'Giải thích đáp án đúng cho học sinh.'
    };
    setLesson(prev => ({
      ...prev,
      quiz: [...(prev.quiz || []), newQ]
    }));
  };

  const handleRemoveQuiz = (index: number) => {
    setLesson(prev => ({
      ...prev,
      quiz: (prev.quiz || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
            ✏️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-serif tracking-tight">
                Biên Soạn & Chỉnh Sửa Bài Học Tập 1
              </h2>
              {isCustomized && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-300 text-amber-950">
                  Đã tùy chỉnh
                </span>
              )}
            </div>
            <p className="text-xs text-orange-100">
              Bài {lesson.lessonNumber}: {lesson.title} (Trang {lesson.pageRange})
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 px-6 py-2.5 bg-amber-50/70 border-b border-amber-100 overflow-x-auto text-xs sm:text-sm font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('info_p1')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'info_p1'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-amber-900 hover:bg-amber-200/60 bg-white/60'
          }`}
        >
          <span>1. Thông tin & Nhận biết</span>
        </button>

        <button
          onClick={() => setActiveTab('part2')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'part2'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-amber-900 hover:bg-amber-200/60 bg-white/60'
          }`}
        >
          <span>2. Đọc Âm, Tiếng & Từ</span>
        </button>

        <button
          onClick={() => setActiveTab('part3')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'part3'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-amber-900 hover:bg-amber-200/60 bg-white/60'
          }`}
        >
          <span>3. Đọc câu & Viết / Nói</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'quiz'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-amber-900 hover:bg-amber-200/60 bg-white/60'
          }`}
        >
          <span>4. Trắc nghiệm ({lesson.quiz?.length || 0})</span>
        </button>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="mx-6 mt-3 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Tab Body Contents */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* ================================================================= */}
        {/* TAB 1: THÔNG TIN BÀI & PHẦN 1: NHẬN BIẾT */}
        {/* ================================================================= */}
        {activeTab === 'info_p1' && (
          <div className="space-y-6">
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-4">
              <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Thông Tin Chung Bài Học
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Tên bài học (Title)
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="vd: A a hoặc B b `"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Số bài (Lesson Number)
                  </label>
                  <input
                    type="number"
                    value={lesson.lessonNumber}
                    onChange={(e) => setLesson({ ...lesson, lessonNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Trang sách (Page Range)
                  </label>
                  <input
                    type="text"
                    value={lesson.pageRange}
                    onChange={(e) => setLesson({ ...lesson, pageRange: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="vd: 12 - 13"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Loại bài học
                </label>
                <select
                  value={lesson.type}
                  onChange={(e) => setLesson({ ...lesson, type: e.target.value as any })}
                  className="w-full sm:w-64 px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="phonics">Bài học âm - vần mới</option>
                  <option value="review">Bài ôn tập và kể chuyện</option>
                  <option value="spelling_practice">Bài luyện chính tả</option>
                </select>
              </div>
            </div>

            {/* PHẦN 1: NHẬN BIẾT */}
            <div className="bg-orange-50/40 p-5 rounded-2xl border border-orange-200 space-y-4">
              <h3 className="text-sm font-black text-orange-950 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Phần 1: Nhận Biết (Âm / Vần / Câu Tranh)
              </h3>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Tiêu đề phần 1
                </label>
                <input
                  type="text"
                  value={lesson.part1_Letters.title}
                  onChange={(e) => setLesson({
                    ...lesson,
                    part1_Letters: { ...lesson.part1_Letters, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Chữ cái / Âm / Vần trọng tâm (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={lesson.part1_Letters.letters.join(', ')}
                  onChange={(e) => {
                    const letters = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setLesson({
                      ...lesson,
                      part1_Letters: { ...lesson.part1_Letters, letters }
                    });
                  }}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="vd: a, A hoặc b, B, `"
                />
                <p className="text-[11px] text-amber-700 mt-1">
                  Ví dụ: <code className="bg-amber-100 px-1 py-0.5 rounded">a, A</code> hoặc <code className="bg-amber-100 px-1 py-0.5 rounded">c, C</code>
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-amber-900">
                    Câu nhận biết gắn với tranh (Recognition Sentence)
                  </label>
                  <button
                    type="button"
                    onClick={() => speechService.speak(lesson.part1_Letters.recognitionSentence)}
                    className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-1 font-bold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe đọc thử
                  </button>
                </div>
                <input
                  type="text"
                  value={lesson.part1_Letters.recognitionSentence}
                  onChange={(e) => setLesson({
                    ...lesson,
                    part1_Letters: { ...lesson.part1_Letters, recognitionSentence: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="vd: Nam và Hà ca hát."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Từ khóa nổi bật trong câu nhận biết (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={lesson.part1_Letters.recognitionKeywords?.join(', ') || ''}
                  onChange={(e) => {
                    const kws = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setLesson({
                      ...lesson,
                      part1_Letters: { ...lesson.part1_Letters, recognitionKeywords: kws }
                    });
                  }}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="vd: Nam, Hà, ca, hát"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PHẦN 2: ĐỌC ÂM, TIẾNG, TỪ NGỮ */}
        {/* ================================================================= */}
        {activeTab === 'part2' && (
          <div className="space-y-6">
            
            {/* Mô hình đánh vần */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-600" />
                    Mô Hình Ghép Âm & Đánh Vần
                  </h3>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Cấu trúc: Âm đầu + Âm chính/Vần (+ Dấu thanh) = Tiếng hoàn chỉnh
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddSyllableModel}
                  className="flex items-center gap-1 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm mô hình
                </button>
              </div>

              {lesson.part2_SyllablesAndWords.models.length === 0 ? (
                <div className="p-4 bg-white/70 rounded-xl border border-dashed border-amber-300 text-center text-xs text-amber-700">
                  Chưa có mô hình đánh vần (phù hợp với bài đầu tiên làm quen chữ cái như Bài 1). Nhấn <strong>Thêm mô hình</strong> nếu muốn tạo mô hình ghép âm.
                </div>
              ) : (
                <div className="space-y-3">
                  {lesson.part2_SyllablesAndWords.models.map((model, idx) => (
                    <div key={idx} className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-900">
                          Mô hình #{idx + 1}:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => speechService.spellOut(model.spellingSteps, model.result)}
                            className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-1 font-bold bg-orange-50 px-2 py-1 rounded-lg"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            Nghe đánh vần
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSyllableModel(idx)}
                            className="text-xs text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-amber-800">Âm đầu</label>
                          <input
                            type="text"
                            value={model.initial}
                            onChange={(e) => {
                              const models = [...lesson.part2_SyllablesAndWords.models];
                              models[idx].initial = e.target.value;
                              setLesson({
                                ...lesson,
                                part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, models }
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs font-bold text-amber-950"
                            placeholder="vd: b"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-amber-800">Âm chính/Vần</label>
                          <input
                            type="text"
                            value={model.vowel}
                            onChange={(e) => {
                              const models = [...lesson.part2_SyllablesAndWords.models];
                              models[idx].vowel = e.target.value;
                              setLesson({
                                ...lesson,
                                part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, models }
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs font-bold text-amber-950"
                            placeholder="vd: a"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-amber-800">Dấu thanh (nếu có)</label>
                          <input
                            type="text"
                            value={model.tone || ''}
                            onChange={(e) => {
                              const models = [...lesson.part2_SyllablesAndWords.models];
                              models[idx].tone = e.target.value;
                              setLesson({
                                ...lesson,
                                part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, models }
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs font-bold text-amber-950"
                            placeholder="vd: sắc"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-amber-800">Tiếng kết quả</label>
                          <input
                            type="text"
                            value={model.result}
                            onChange={(e) => {
                              const models = [...lesson.part2_SyllablesAndWords.models];
                              models[idx].result = e.target.value;
                              setLesson({
                                ...lesson,
                                part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, models }
                              });
                            }}
                            className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs font-bold text-amber-950"
                            placeholder="vd: ba"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-amber-800">
                          Các bước đọc đánh vần (ngăn cách bằng dấu phẩy)
                        </label>
                        <input
                          type="text"
                          value={model.spellingSteps?.join(', ') || ''}
                          onChange={(e) => {
                            const steps = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            const models = [...lesson.part2_SyllablesAndWords.models];
                            models[idx].spellingSteps = steps;
                            setLesson({
                              ...lesson,
                              part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, models }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs text-amber-950"
                          placeholder="vd: b - a - ba hoặc c - a - ca - sắc - cá"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Danh sách tiếng đọc */}
            <div className="bg-orange-50/40 p-5 rounded-2xl border border-orange-200 space-y-4">
              <h3 className="text-sm font-black text-orange-950 uppercase tracking-wide">
                Danh Sách Tiếng Luyện Đọc (Reading Syllables)
              </h3>
              <p className="text-xs text-amber-700">
                Nhập danh sách các tiếng học sinh cần đọc trơn trong bài (ngăn cách bằng dấu cách hoặc dấu phẩy).
              </p>
              <textarea
                rows={2}
                value={lesson.part2_SyllablesAndWords.readingSyllables.join(' ')}
                onChange={(e) => {
                  const syllables = e.target.value
                    .replace(/,/g, ' ')
                    .split(/\s+/)
                    .map(s => s.trim())
                    .filter(Boolean);
                  setLesson({
                    ...lesson,
                    part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, readingSyllables: syllables }
                  });
                }}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="vd: ba bà bá bả bã bạ ca cà cá"
              />
              <div className="flex flex-wrap gap-1.5">
                {lesson.part2_SyllablesAndWords.readingSyllables.map((syl, i) => (
                  <span
                    key={i}
                    onClick={() => speechService.speak(syl)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs font-bold text-amber-900 cursor-pointer hover:bg-orange-100"
                    title="Bấm để nghe phát âm"
                  >
                    <span>{syl}</span>
                    <Volume2 className="w-3 h-3 text-orange-500" />
                  </span>
                ))}
              </div>
            </div>

            {/* Danh sách từ ngữ ứng dụng */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                  Từ Ngữ Ứng Dụng & Tranh Minh Họa
                </h3>
                <button
                  type="button"
                  onClick={handleAddWord}
                  className="flex items-center gap-1 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm từ ngữ
                </button>
              </div>

              <div className="space-y-3">
                {lesson.part2_SyllablesAndWords.words.map((w, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{w.illustrationIcon || '📘'}</span>
                        <span className="text-xs font-black text-amber-950">{w.word || '(Từ mới)'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speechService.speak(w.word)}
                          className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-1 font-bold bg-orange-50 px-2 py-1 rounded-lg"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          Nghe đọc
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveWord(idx)}
                          className="text-xs text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-amber-800">Từ ngữ (Word)</label>
                        <input
                          type="text"
                          value={w.word}
                          onChange={(e) => {
                            const words = [...lesson.part2_SyllablesAndWords.words];
                            words[idx].word = e.target.value;
                            setLesson({
                              ...lesson,
                              part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, words }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs font-bold text-amber-950"
                          placeholder="vd: cá cờ"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-amber-800">Âm/Vần nổi bật</label>
                        <input
                          type="text"
                          value={w.highlightPart || ''}
                          onChange={(e) => {
                            const words = [...lesson.part2_SyllablesAndWords.words];
                            words[idx].highlightPart = e.target.value;
                            setLesson({
                              ...lesson,
                              part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, words }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs text-amber-950"
                          placeholder="vd: c hoặc a"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-amber-800">Biểu tượng Emoji</label>
                        <input
                          type="text"
                          value={w.illustrationIcon || ''}
                          onChange={(e) => {
                            const words = [...lesson.part2_SyllablesAndWords.words];
                            words[idx].illustrationIcon = e.target.value;
                            setLesson({
                              ...lesson,
                              part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, words }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs text-amber-950"
                          placeholder="vd: 🐟 hoặc 🐔"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-amber-800">Giải nghĩa từ</label>
                        <input
                          type="text"
                          value={w.meaning || ''}
                          onChange={(e) => {
                            const words = [...lesson.part2_SyllablesAndWords.words];
                            words[idx].meaning = e.target.value;
                            setLesson({
                              ...lesson,
                              part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, words }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs text-amber-950"
                          placeholder="vd: loài cá nhỏ có màu sắc sặc sỡ"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-amber-800">Mô tả tranh ảnh</label>
                        <input
                          type="text"
                          value={w.imageDesc || ''}
                          onChange={(e) => {
                            const words = [...lesson.part2_SyllablesAndWords.words];
                            words[idx].imageDesc = e.target.value;
                            setLesson({
                              ...lesson,
                              part2_SyllablesAndWords: { ...lesson.part2_SyllablesAndWords, words }
                            });
                          }}
                          className="w-full px-2.5 py-1.5 bg-amber-50/40 border border-amber-300 rounded-lg text-xs text-amber-950"
                          placeholder="vd: chú cá cờ bơi lội dưới nước"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PHẦN 3: ĐỌC CÂU, LUYỆN VIẾT, LUYỆN NÓI */}
        {/* ================================================================= */}
        {activeTab === 'part3' && (
          <div className="space-y-6">
            
            {/* Câu/Đoạn văn đọc */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  Câu / Đoạn Văn Đọc Ứng Dụng (Reading Passage)
                </h3>
                <button
                  type="button"
                  onClick={() => speechService.speak(lesson.part3_SentenceAndPractice.readingPassage)}
                  className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-1 font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe đọc đoạn văn
                </button>
              </div>

              <textarea
                rows={3}
                value={lesson.part3_SentenceAndPractice.readingPassage}
                onChange={(e) => setLesson({
                  ...lesson,
                  part3_SentenceAndPractice: {
                    ...lesson.part3_SentenceAndPractice,
                    readingPassage: e.target.value
                  }
                })}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none font-serif leading-relaxed"
                placeholder="vd: Ba có cá. / Bà bế bé."
              />
              <p className="text-[11px] text-amber-700">
                Lưu ý: Chỉ sử dụng các âm, vần và dấu thanh học sinh đã được học tính đến bài này theo chương trình.
              </p>
            </div>

            {/* Chữ mẫu luyện viết */}
            <div className="bg-orange-50/40 p-5 rounded-2xl border border-orange-200 space-y-3">
              <h3 className="text-sm font-black text-orange-950 uppercase tracking-wide flex items-center gap-2">
                <PenTool className="w-4 h-4 text-orange-600" />
                Mẫu Chữ Luyện Viết Ô Li (Writing Samples)
              </h3>
              <p className="text-xs text-amber-700">
                Nhập danh sách chữ hoặc tiếng mẫu để học sinh luyện viết trên bảng ô ly (ngăn cách bằng dấu phẩy).
              </p>
              <input
                type="text"
                value={lesson.part3_SentenceAndPractice.writingSamples.join(', ')}
                onChange={(e) => {
                  const samples = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setLesson({
                    ...lesson,
                    part3_SentenceAndPractice: {
                      ...lesson.part3_SentenceAndPractice,
                      writingSamples: samples
                    }
                  });
                }}
                className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm font-bold text-amber-950 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="vd: a, A, ca hoặc c, cá, cà"
              />
            </div>

            {/* Chủ đề Luyện nói */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-4">
              <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide">
                Chủ Đề Luyện Nói (Speaking Topic)
              </h3>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Tên chủ đề nói
                </label>
                <input
                  type="text"
                  value={lesson.part3_SentenceAndPractice.speakingTopic?.title || ''}
                  onChange={(e) => setLesson({
                    ...lesson,
                    part3_SentenceAndPractice: {
                      ...lesson.part3_SentenceAndPractice,
                      speakingTopic: {
                        title: e.target.value,
                        prompt: lesson.part3_SentenceAndPractice.speakingTopic?.prompt || '',
                        questions: lesson.part3_SentenceAndPractice.speakingTopic?.questions || []
                      }
                    }
                  })}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm text-amber-950 font-bold"
                  placeholder="vd: Chào hỏi hoặc Cảm ơn, xin lỗi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Gợi ý nội dung nói theo tranh
                </label>
                <textarea
                  rows={2}
                  value={lesson.part3_SentenceAndPractice.speakingTopic?.prompt || ''}
                  onChange={(e) => setLesson({
                    ...lesson,
                    part3_SentenceAndPractice: {
                      ...lesson.part3_SentenceAndPractice,
                      speakingTopic: {
                        title: lesson.part3_SentenceAndPractice.speakingTopic?.title || '',
                        prompt: e.target.value,
                        questions: lesson.part3_SentenceAndPractice.speakingTopic?.questions || []
                      }
                    }
                  })}
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-sm text-amber-950"
                  placeholder="vd: Quan sát tranh bạn nhỏ chào bố mẹ khi đi học và chào cô giáo khi vào lớp..."
                />
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: TRẮC NGHIỆM VUI (QUIZ) */}
        {/* ================================================================= */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-orange-600" />
                  Câu Hỏi Trắc Nghiệm Tương Tác
                </h3>
                <p className="text-xs text-amber-700">
                  Tạo câu hỏi củng cố bài học cho học sinh trả lời và nhận thưởng sao.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuiz}
                className="flex items-center gap-1 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm câu hỏi
              </button>
            </div>

            {(!lesson.quiz || lesson.quiz.length === 0) ? (
              <div className="p-6 bg-amber-50/50 rounded-2xl border border-dashed border-amber-300 text-center space-y-2">
                <p className="text-sm text-amber-800 font-bold">Chưa có câu hỏi trắc nghiệm nào cho bài học này.</p>
                <button
                  type="button"
                  onClick={handleAddQuiz}
                  className="text-xs font-bold text-orange-600 hover:text-orange-800 underline"
                >
                  Nhấn vào đây để thêm câu hỏi đầu tiên
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {lesson.quiz.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="p-4 bg-white rounded-2xl border border-amber-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-orange-700 uppercase">
                        Câu hỏi #{qIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuiz(qIdx)}
                        className="text-xs text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-amber-900 block mb-1">
                        Nội dung câu hỏi
                      </label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => {
                          const quiz = [...(lesson.quiz || [])];
                          quiz[qIdx].question = e.target.value;
                          setLesson({ ...lesson, quiz });
                        }}
                        className="w-full px-3 py-2 bg-amber-50/30 border border-amber-300 rounded-xl text-sm font-bold text-amber-950"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-amber-900 block">
                        Các lựa chọn (Tích chọn vào ô tròn của đáp án đúng):
                      </label>
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct_q_${qIdx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => {
                              const quiz = [...(lesson.quiz || [])];
                              quiz[qIdx].correctIndex = optIdx;
                              setLesson({ ...lesson, quiz });
                            }}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const quiz = [...(lesson.quiz || [])];
                              quiz[qIdx].options[optIdx] = e.target.value;
                              setLesson({ ...lesson, quiz });
                            }}
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold ${
                              q.correctIndex === optIdx
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : 'bg-white border-amber-200 text-amber-950'
                            }`}
                            placeholder={`Lựa chọn ${optIdx + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-amber-900 block mb-1">
                        Lời giải thích ngắn gọn
                      </label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => {
                          const quiz = [...(lesson.quiz || [])];
                          quiz[qIdx].explanation = e.target.value;
                          setLesson({ ...lesson, quiz });
                        }}
                        className="w-full px-3 py-1.5 bg-amber-50/20 border border-amber-200 rounded-lg text-xs text-amber-950"
                        placeholder="Giải thích vì sao đáp án này chính xác..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal Footer Controls */}
      <div className="bg-amber-50 px-6 py-4 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isCustomized && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục bản gốc SGK</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi bài học</span>
          </button>
        </div>
      </div>
    </>
  );
};


// ============================================================================
// VOLUME 2 EDITOR COMPONENT
// ============================================================================
interface Volume2EditorProps {
  initialLesson: Volume2Lesson;
  onClose: () => void;
  onSaveSuccess: (lesson: Volume2Lesson) => void;
}

const Volume2Editor: React.FC<Volume2EditorProps> = ({ initialLesson, onClose, onSaveSuccess }) => {
  const [activeTab, setActiveTab] = useState<'info_warmup' | 'reading' | 'comprehension' | 'practice'>('info_warmup');
  const [lesson, setLesson] = useState<Volume2Lesson>(() => JSON.parse(JSON.stringify(initialLesson)));
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const isCustomized = lessonStorageService.isVolume2Customized(lesson.id);

  const handleSave = () => {
    lessonStorageService.saveVolume2Lesson(lesson);
    speechService.playSoundEffect('success');
    setSaveToast('Đã lưu bài học Tập 2 thành công!');
    setTimeout(() => {
      onSaveSuccess(lesson);
      onClose();
    }, 600);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục bài học Tập 2 này về bản gốc sách giáo khoa chuẩn?')) {
      lessonStorageService.resetVolume2Lesson(lesson.id);
      const defaultLesson = lessonStorageService.getDefaultVolume2Lesson(lesson.id);
      if (defaultLesson) {
        setLesson(JSON.parse(JSON.stringify(defaultLesson)));
      }
      speechService.playSoundEffect('pop');
      setSaveToast('Đã khôi phục về bản gốc SGK!');
      setTimeout(() => setSaveToast(null), 2500);
    }
  };

  // Vocabulary handlers
  const handleAddVocab = () => {
    setLesson(prev => ({
      ...prev,
      reading: {
        ...prev.reading,
        vocabulary: [...prev.reading.vocabulary, { word: '', meaning: '' }]
      }
    }));
  };

  const handleRemoveVocab = (idx: number) => {
    setLesson(prev => ({
      ...prev,
      reading: {
        ...prev.reading,
        vocabulary: prev.reading.vocabulary.filter((_, i) => i !== idx)
      }
    }));
  };

  // Question handlers
  const handleAddQuestion = () => {
    setLesson(prev => ({
      ...prev,
      comprehensionQuestions: [
        ...prev.comprehensionQuestions,
        {
          id: 'c_' + Date.now(),
          question: 'Câu hỏi đọc hiểu mới?',
          sampleAnswer: 'Câu trả lời mẫu cho học sinh tham khảo.'
        }
      ]
    }));
  };

  const handleRemoveQuestion = (idx: number) => {
    setLesson(prev => ({
      ...prev,
      comprehensionQuestions: prev.comprehensionQuestions.filter((_, i) => i !== idx)
    }));
  };

  return (
    <>
      {/* Modal Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-700 px-6 py-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
            ✏️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-serif tracking-tight">
                Biên Soạn & Chỉnh Sửa Bài Học Tập 2
              </h2>
              {isCustomized && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-300 text-emerald-950">
                  Đã tùy chỉnh
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-100">
              {lesson.topicTitle} • {lesson.title} (Trang {lesson.pageRange})
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50/70 border-b border-emerald-100 overflow-x-auto text-xs sm:text-sm font-bold no-scrollbar">
        <button
          onClick={() => setActiveTab('info_warmup')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'info_warmup'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-900 hover:bg-emerald-200/60 bg-white/60'
          }`}
        >
          <span>1. Thông tin & Khởi động</span>
        </button>

        <button
          onClick={() => setActiveTab('reading')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'reading'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-900 hover:bg-emerald-200/60 bg-white/60'
          }`}
        >
          <span>2. Bài đọc & Từ ngữ</span>
        </button>

        <button
          onClick={() => setActiveTab('comprehension')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'comprehension'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-900 hover:bg-emerald-200/60 bg-white/60'
          }`}
        >
          <span>3. Câu hỏi đọc hiểu ({lesson.comprehensionQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'practice'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-900 hover:bg-emerald-200/60 bg-white/60'
          }`}
        >
          <span>4. Luyện tập & Chính tả</span>
        </button>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="mx-6 mt-3 px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Tab Body Contents */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* ================================================================= */}
        {/* TAB 1: THÔNG TIN & KHỞI ĐỘNG */}
        {/* ================================================================= */}
        {activeTab === 'info_warmup' && (
          <div className="space-y-6">
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Thông Tin Bài Học Tập 2
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Tiêu đề bài học (Title)
                  </label>
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="vd: Bài 1: Tôi là học sinh lớp 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Tên chủ điểm (Topic Title)
                  </label>
                  <input
                    type="text"
                    value={lesson.topicTitle}
                    onChange={(e) => setLesson({ ...lesson, topicTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="vd: Tôi và các bạn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Số bài (Lesson Number)
                  </label>
                  <input
                    type="number"
                    value={lesson.lessonNumber}
                    onChange={(e) => setLesson({ ...lesson, lessonNumber: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Trang sách (Page Range)
                  </label>
                  <input
                    type="text"
                    value={lesson.pageRange}
                    onChange={(e) => setLesson({ ...lesson, pageRange: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="vd: 4 - 7"
                  />
                </div>
              </div>
            </div>

            {/* KHỞI ĐỘNG */}
            <div className="bg-teal-50/40 p-5 rounded-2xl border border-teal-200 space-y-4">
              <h3 className="text-sm font-black text-teal-950 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Hoạt Động Khởi Động Trước Bài Đọc
              </h3>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Câu hỏi / Gợi ý khởi động
                </label>
                <textarea
                  rows={2}
                  value={lesson.warmup.prompt}
                  onChange={(e) => setLesson({
                    ...lesson,
                    warmup: { ...lesson.warmup, prompt: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="vd: Quan sát tranh và trao đổi với bạn về..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: BÀI ĐỌC & TỪ NGỮ */}
        {/* ================================================================= */}
        {activeTab === 'reading' && (
          <div className="space-y-6">
            
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Văn Bản Bài Đọc
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Tên bài đọc (Reading Title)
                  </label>
                  <input
                    type="text"
                    value={lesson.reading.title}
                    onChange={(e) => setLesson({
                      ...lesson,
                      reading: { ...lesson.reading, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-900 mb-1">
                    Tác giả (Author)
                  </label>
                  <input
                    type="text"
                    value={lesson.reading.author || ''}
                    onChange={(e) => setLesson({
                      ...lesson,
                      reading: { ...lesson.reading, author: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm text-emerald-950"
                    placeholder="vd: Trần Đăng Khoa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Thể loại bài đọc
                </label>
                <select
                  value={lesson.reading.type}
                  onChange={(e) => setLesson({
                    ...lesson,
                    reading: { ...lesson.reading, type: e.target.value as any }
                  })}
                  className="w-full sm:w-64 px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm font-bold text-emerald-950"
                >
                  <option value="story">Truyện kể / Văn xuôi</option>
                  <option value="poem">Bài thơ / Đồng dao</option>
                  <option value="article">Văn bản nhật dụng / Tin tức</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-emerald-900">
                    Nội dung văn bản (Mỗi đoạn văn hoặc khổ thơ cách nhau bởi dòng mới)
                  </label>
                  <button
                    type="button"
                    onClick={() => speechService.speak(lesson.reading.content.join(' '))}
                    className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe đọc toàn bài
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={lesson.reading.content.join('\n\n')}
                  onChange={(e) => {
                    const paragraphs = e.target.value.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
                    setLesson({
                      ...lesson,
                      reading: { ...lesson.reading, content: paragraphs }
                    });
                  }}
                  className="w-full px-3 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm text-emerald-950 leading-relaxed font-serif focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Nhập nội dung bài đọc..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Vần trọng tâm cần chú ý (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={lesson.reading.phonicsFocus?.join(', ') || ''}
                  onChange={(e) => {
                    const foci = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setLesson({
                      ...lesson,
                      reading: { ...lesson.reading, phonicsFocus: foci }
                    });
                  }}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm text-emerald-950"
                  placeholder="vd: uây, oang, uyt"
                />
              </div>
            </div>

            {/* Từ mới & Giải nghĩa */}
            <div className="bg-teal-50/40 p-5 rounded-2xl border border-teal-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-teal-950 uppercase tracking-wide">
                  Từ Mới & Giải Nghĩa (Vocabulary)
                </h3>
                <button
                  type="button"
                  onClick={handleAddVocab}
                  className="flex items-center gap-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm từ mới
                </button>
              </div>

              <div className="space-y-2.5">
                {lesson.reading.vocabulary.map((vocab, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-2.5 bg-white rounded-xl border border-emerald-200">
                    <input
                      type="text"
                      value={vocab.word}
                      onChange={(e) => {
                        const vocabulary = [...lesson.reading.vocabulary];
                        vocabulary[idx].word = e.target.value;
                        setLesson({
                          ...lesson,
                          reading: { ...lesson.reading, vocabulary }
                        });
                      }}
                      className="w-full sm:w-48 px-2.5 py-1.5 bg-emerald-50/40 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950"
                      placeholder="Từ mới (vd: hãnh diện)"
                    />
                    <input
                      type="text"
                      value={vocab.meaning}
                      onChange={(e) => {
                        const vocabulary = [...lesson.reading.vocabulary];
                        vocabulary[idx].meaning = e.target.value;
                        setLesson({
                          ...lesson,
                          reading: { ...lesson.reading, vocabulary }
                        });
                      }}
                      className="flex-1 w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs text-emerald-950"
                      placeholder="Giải nghĩa từ..."
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVocab(idx)}
                      className="text-xs text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CÂU HỎI ĐỌC HIỂU */}
        {/* ================================================================= */}
        {activeTab === 'comprehension' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  Hệ Thống Câu Hỏi Đọc Hiểu & Gợi Ý Trả Lời
                </h3>
                <p className="text-xs text-emerald-700">
                  Học sinh luyện tập trả lời câu hỏi đọc hiểu văn bản theo đúng chuẩn SGK.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm câu hỏi
              </button>
            </div>

            <div className="space-y-4">
              {lesson.comprehensionQuestions.map((q, qIdx) => (
                <div key={q.id || qIdx} className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-700 uppercase">
                      Câu hỏi #{qIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-xs text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-emerald-900 block mb-1">
                      Nội dung câu hỏi
                    </label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const comprehensionQuestions = [...lesson.comprehensionQuestions];
                        comprehensionQuestions[qIdx].question = e.target.value;
                        setLesson({ ...lesson, comprehensionQuestions });
                      }}
                      className="w-full px-3 py-2 bg-emerald-50/30 border border-emerald-300 rounded-xl text-sm font-bold text-emerald-950"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-emerald-900 block mb-1">
                      Gợi ý câu trả lời mẫu cho học sinh
                    </label>
                    <textarea
                      rows={2}
                      value={q.sampleAnswer}
                      onChange={(e) => {
                        const comprehensionQuestions = [...lesson.comprehensionQuestions];
                        comprehensionQuestions[qIdx].sampleAnswer = e.target.value;
                        setLesson({ ...lesson, comprehensionQuestions });
                      }}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-emerald-950 font-serif leading-relaxed"
                      placeholder="Câu trả lời đầy đủ..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: LUYỆN TẬP & CHÍNH TẢ */}
        {/* ================================================================= */}
        {activeTab === 'practice' && (
          <div className="space-y-6">
            
            {/* Chính tả */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                Bài Tập Chính Tả (Spelling Exercise)
              </h3>

              <div>
                <label className="block text-xs font-bold text-emerald-900 mb-1">
                  Yêu cầu bài tập (Prompt)
                </label>
                <input
                  type="text"
                  value={lesson.practice.spellingExercise?.prompt || ''}
                  onChange={(e) => setLesson({
                    ...lesson,
                    practice: {
                      ...lesson.practice,
                      spellingExercise: {
                        type: lesson.practice.spellingExercise?.type || 'fill_letter',
                        prompt: e.target.value,
                        pairs: lesson.practice.spellingExercise?.pairs || []
                      }
                    }
                  })}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm text-emerald-950"
                  placeholder="vd: Chọn s hay x thay cho ô trống..."
                />
              </div>
            </div>

            {/* Đoạn văn Nghe - Viết */}
            <div className="bg-teal-50/40 p-5 rounded-2xl border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-teal-950 uppercase tracking-wide">
                  Đoạn Văn Nghe - Viết (Chính Tả)
                </h3>
                {lesson.practice.dictationText && (
                  <button
                    type="button"
                    onClick={() => speechService.speak(lesson.practice.dictationText || '')}
                    className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-bold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Nghe đọc chính tả
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                value={lesson.practice.dictationText || ''}
                onChange={(e) => setLesson({
                  ...lesson,
                  practice: {
                    ...lesson.practice,
                    dictationText: e.target.value
                  }
                })}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm text-emerald-950 font-serif leading-relaxed"
                placeholder="vd: Nam đã đọc được truyện tranh. Nam còn biết làm toán nữa."
              />
            </div>

            {/* Viết vào vở */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-3">
              <h3 className="text-sm font-black text-emerald-950 uppercase tracking-wide">
                Luyện Viết Câu Vào Vở (Writing Prompt)
              </h3>
              <input
                type="text"
                value={lesson.practice.writingPrompt || ''}
                onChange={(e) => setLesson({
                  ...lesson,
                  practice: {
                    ...lesson.practice,
                    writingPrompt: e.target.value
                  }
                })}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-sm text-emerald-950"
                placeholder="vd: Viết câu trả lời cho câu hỏi c ở mục 3 vào vở."
              />
            </div>

          </div>
        )}

      </div>

      {/* Modal Footer Controls */}
      <div className="bg-emerald-50 px-6 py-4 border-t border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isCustomized && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục bản gốc SGK</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Lưu thay đổi bài học</span>
          </button>
        </div>
      </div>
    </>
  );
};
