import React, { useState } from 'react';
import { Volume1Lesson, Volume2Lesson } from '../types';
import { lessonStorageService } from '../services/lessonStorageService';
import { speechService } from '../services/speechService';
import { 
  X, 
  Sparkles, 
  Bot, 
  Copy, 
  Check, 
  BookOpen, 
  HelpCircle, 
  TreePine, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AILessonAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToLesson?: (lessonId: number, newPassage: string) => void;
}

export const AILessonAssistantModal: React.FC<AILessonAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyToLesson
}) => {
  const [selectedVol, setSelectedVol] = useState<'vol1' | 'vol2'>('vol1');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const vol1Lessons = lessonStorageService.getVolume1Lessons();
  const vol2Lessons = lessonStorageService.getTopicGroups().flatMap(g => g.lessons);

  const currentVol1 = vol1Lessons.find(l => l.id === selectedLessonId) || vol1Lessons[0];
  const currentVol2 = vol2Lessons.find(l => l.id === selectedLessonId) || vol2Lessons[0];

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    speechService.playSoundEffect('pop');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate specialized educational suggestions based on lesson phonics
  const letters = currentVol1.part1_Letters.letters.join(', ');
  const soundName = currentVol1.part1_Letters.letters[0] || 'a';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 text-white flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  Trợ Lý AI Giáo Viên 4.0
                </span>
                <span className="text-[11px] font-bold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                  Soạn Bài & Phân Hóa Học Tập
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-serif mt-0.5">
                Gợi Ý Ngữ Liệu & Câu Đố Tương Tác Tiếng Việt 1
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lesson Selector Bar */}
        <div className="p-4 bg-amber-50/60 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-950">Chọn tập:</span>
            <div className="inline-flex rounded-xl bg-white p-1 border border-amber-200 shadow-2xs">
              <button
                onClick={() => {
                  setSelectedVol('vol1');
                  setSelectedLessonId(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedVol === 'vol1' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tập 1 (83 bài Âm - Vần)
              </button>
              <button
                onClick={() => {
                  setSelectedVol('vol2');
                  setSelectedLessonId(vol2Lessons[0]?.id || 201);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedVol === 'vol2' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tập 2 (8 Chủ điểm)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
            <span className="text-xs font-bold text-amber-950 shrink-0">Chọn bài:</span>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(Number(e.target.value))}
              className="w-full p-2 bg-white rounded-xl border border-amber-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-2xs"
            >
              {selectedVol === 'vol1' ? (
                vol1Lessons.map(l => (
                  <option key={l.id} value={l.id}>
                    Bài {l.lessonNumber}: {l.title} (Âm: {l.part1_Letters.letters.join(', ')})
                  </option>
                ))
              ) : (
                vol2Lessons.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.topicTitle})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-gradient-to-b from-amber-50/20 to-white text-slate-800 text-xs sm:text-sm">
          
          {/* Card 1: Câu đố vui tương tác khởi động tiết học số */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-700 font-bold">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-black uppercase">1. Câu Đố Vui Khởi Động Tiết Học</span>
              </div>
              <button
                onClick={() => handleCopy(
                  `Con gì kêu cạp cạp\nBơi lội ở bờ ao\nĐố bé chữ gì nào\nCó âm "${soundName}" quen thuộc? (Con vịt)`,
                  'riddle'
                )}
                className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs flex items-center gap-1 transition-all"
              >
                {copiedKey === 'riddle' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'riddle' ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 font-reading font-medium leading-relaxed italic text-slate-800">
              "Con gì kêu cạp cạp<br />
              Bơi lội ở bờ ao<br />
              Đố bé chữ gì nào<br />
              Có âm <strong>"{letters}"</strong> quen thuộc?"<br />
              <span className="text-emerald-700 font-bold not-italic mt-1 block">➔ Gợi ý đáp án cho học sinh: Con vịt / Con cá / Quả na</span>
            </div>
          </div>

          {/* Card 2: Ngữ liệu phân hóa (Dành cho học sinh rụt rè / Học sinh dân tộc thiểu số rèn âm) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-purple-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-800 font-bold">
                <Layers className="w-4 h-4" />
                <span className="text-sm font-black uppercase">2. Ngữ Liệu Phân Hóa Rèn Luyện Theo Trình Độ</span>
              </div>
              <button
                onClick={() => handleCopy(
                  `Mức độ 1 (Rèn âm cơ bản): Bé đọc rõ tiếng chứa âm ${letters}.\nMức độ 2 (Đọc trơn câu): Bé chăm chỉ học bài cùng cô giáo và các bạn.`,
                  'diff'
                )}
                className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1 transition-all"
              >
                {copiedKey === 'diff' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'diff' ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
                <span className="font-bold text-purple-950 block text-xs">Mức 1: Cho học sinh cần rèn thêm âm (Vùng cao/DTTS)</span>
                <p className="text-slate-700 font-reading font-medium">
                  Luyện phát âm chậm, tròn môi: <strong className="text-purple-800">{currentVol1.part2_SyllablesAndWords.words.slice(0, 3).map(w => w.text).join(' - ') || 'ba, ba mẹ, bé'}</strong>
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 block text-xs">Mức 2: Cho học sinh đọc trôi chảy, đọc mở rộng</span>
                <p className="text-slate-700 font-reading font-medium">
                  Đọc diễn cảm cả câu: <strong className="text-emerald-800">{currentVol1.part3_SentenceAndPractice.readingPassage || 'Bé chăm chỉ đến trường.'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Ngữ liệu tích hợp Giáo Dục Môi Trường & Thiên Nhiên (Theo tiêu chí khuyến khích của Công văn) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-black uppercase">3. Ngữ Liệu Lồng Ghép Bảo Vệ Môi Trường & Rừng Cây</span>
              </div>
              <button
                onClick={() => handleCopy(
                  `Cây xanh tốt tươi cho bóng mát bờ ao. Em cùng các bạn giữ sạch trường lớp, bảo vệ nguồn nước quê hương.`,
                  'green'
                )}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1 transition-all"
              >
                {copiedKey === 'green' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'green' ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 font-reading font-medium leading-relaxed text-slate-800">
              "Cây xanh tốt tươi cho bóng mát bờ ao. Em cùng các bạn chăm chỉ tưới cây, giữ sạch nguồn nước và bảo vệ mái trường xanh - sạch - đẹp."
            </div>
            <p className="text-[11px] text-emerald-800">
              💡 <em>Thầy Cô có thể bấm nút "Sao chép" ở trên để đưa vào phần Luyện nói hoặc Luyện viết ô ly của bài học.</em>
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
