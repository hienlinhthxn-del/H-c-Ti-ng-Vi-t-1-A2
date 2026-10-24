import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Star, 
  Bot, 
  Heart, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare,
  Award
} from 'lucide-react';
import { FeedbackCategory, TeacherParentFeedback } from '../types';
import { teacherFeedbackService } from '../services/teacherFeedbackService';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';

interface SendParentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    studentCode?: string;
    avatar?: string;
    classId?: string;
  } | null;
  initialLessonTitle?: string;
  initialComment?: string;
  initialScore?: number;
  recordingId?: string;
  onSuccess?: () => void;
}

export const SendParentFeedbackModal: React.FC<SendParentFeedbackModalProps> = ({
  isOpen,
  onClose,
  student,
  initialLessonTitle,
  initialComment = '',
  initialScore = 5,
  recordingId,
  onSuccess
}) => {
  const [category, setCategory] = useState<FeedbackCategory>('praise');
  const [title, setTitle] = useState<string>('Khen ngợi học tập chăm ngoan');
  const [content, setContent] = useState<string>(initialComment);
  const [score, setScore] = useState<number>(initialScore);
  const [teacherName, setTeacherName] = useState<string>('Cô Hiền Phan (GVCN Lớp 1A2)');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [previousFeedbacks, setPreviousFeedbacks] = useState<TeacherParentFeedback[]>([]);

  useEffect(() => {
    if (student) {
      const history = teacherFeedbackService.getFeedbacksForStudent(student.id, student.name);
      setPreviousFeedbacks(history);
      
      if (initialComment) {
        setContent(initialComment);
      }
      if (initialScore) {
        setScore(initialScore);
      }
      if (initialLessonTitle) {
        setTitle(`Nhận xét bài đọc: ${initialLessonTitle}`);
        setCategory('recording_eval');
      }
    }
  }, [student, isOpen, initialComment, initialScore, initialLessonTitle]);

  if (!isOpen || !student) return null;

  const categories: { key: FeedbackCategory; label: string; icon: string; defaultTitle: string }[] = [
    { key: 'praise', label: 'Khen ngợi', icon: '🌟', defaultTitle: 'Khen ngợi con học tập chăm ngoan' },
    { key: 'recording_eval', label: 'Bài đọc & Thu âm', icon: '🎙️', defaultTitle: `Nhận xét bài đọc của con` },
    { key: 'homework', label: 'Dặn dò ôn bài', icon: '📝', defaultTitle: 'Dặn dò phụ huynh cùng con đọc bài ở nhà' },
    { key: 'weekly_review', label: 'Phiếu tuần', icon: '📅', defaultTitle: 'Phiếu nhận xét tiến độ học tập trong tuần' },
    { key: 'practice_needed', label: 'Cần hỗ trợ', icon: '💡', defaultTitle: 'Gợi ý rèn thêm âm vần khó tại nhà' }
  ];

  const handleSelectCategory = (cat: FeedbackCategory) => {
    setCategory(cat);
    const item = categories.find(c => c.key === cat);
    if (item) {
      setTitle(item.defaultTitle);
    }
  };

  const handleGenerateAISuggestion = () => {
    speechService.playSoundEffect('pop');
    const name = student.name || 'con';
    let suggestion = '';

    switch (category) {
      case 'praise':
        suggestion = `Cô khen ${name} tuần này đi học rất chuyên cần, đọc bài to, rõ ràng và rất tự giác luyện đọc trên lớp. Nét chữ của con cũng tròn đều và sạch đẹp. Bố Mẹ tiếp tục đồng hành và khen ngợi con nhé! ⭐`;
        break;
      case 'recording_eval':
        suggestion = `Cô đã nghe bản thu âm của ${name}. Con phát âm rất chuẩn xác các âm vần, ngắt nghỉ đúng dấu chấm. Cô cho con 5 sao xuất sắc, con nhớ giữ vững phong độ nhé! 👏`;
        break;
      case 'homework':
        suggestion = `Kính gửi Bố Mẹ: Tối nay Bố Mẹ dành 15 phút mở ứng dụng cho ${name} luyện đọc lại bài vừa học. Bố Mẹ chú ý nhắc con đọc tròn vành rõ chữ và bấm nút Micro thu âm nộp bài cho cô nhé! ❤️`;
        break;
      case 'weekly_review':
        suggestion = `Đánh giá tuần này: ${name} đã hoàn thành tốt các bài học theo đúng phân phối chương trình. Con hòa đồng, chăm chỉ và có tiến bộ vượt bậc về tốc độ đọc trơn. Chúc con và gia đình cuối tuần vui vẻ! 🌸`;
        break;
      case 'practice_needed':
        suggestion = `Thưa Bố Mẹ: Hiện ${name} vẫn còn hơi ngập ngừng ở một số âm vần khó. Bố Mẹ ở nhà cho con nghe mẫu của Cô giáo và luyện đọc chậm từng tiếng một, không cần vội. Cô tin con sẽ làm rất tốt! 💪`;
        break;
    }
    setContent(suggestion);
  };

  const quickTemplates = [
    '🌟 Cô khen con phát âm to, tròn vành rõ chữ, ngắt nghỉ câu tự nhiên.',
    '👏 Con có nhiều tiến bộ vượt bậc trong tuần này, tiếp tục phát huy nhé!',
    '📝 Bố Mẹ nhắc con luyện đọc thêm 15 phút mỗi tối trước khi đi ngủ.',
    '✍️ Chữ viết ô ly của con rất đều và sạch đẹp, cô khen con!',
    '💡 Con chú ý rèn thêm phân biệt âm L/N và dấu ngã/dấu hỏi nhé.'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);
    try {
      teacherFeedbackService.sendFeedback({
        studentId: student.id,
        studentName: student.name,
        studentCode: student.studentCode,
        teacherName: teacherName.trim() || 'Cô Hiền Phan',
        category,
        title: title.trim() || 'Lời nhận xét từ Cô giáo',
        content: content.trim(),
        score,
        lessonTitle: initialLessonTitle,
        recordingId
      });

      speechService.playSoundEffect('fanfare');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error sending teacher feedback:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-amber-100 animate-in fade-in zoom-in-95 duration-150 my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center text-xl shadow-sm">
              💌
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Gửi Nhận Xét Sang Cổng Phụ Huynh
              </h3>
              <p className="text-xs text-slate-500">
                Lời nhắn và đánh giá của Thầy Cô sẽ hiển thị trực tiếp trên trang phụ huynh của học sinh.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Mini Profile Info */}
        <div className="my-4 p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-xl shadow-2xs border border-amber-200">
              {student.avatar || '🧒'}
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>{student.name}</span>
                {student.studentCode && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-bold">
                    {student.studentCode}
                  </span>
                )}
              </div>
              <div className="text-xs text-amber-900 font-medium">
                Học sinh Lớp 1 • Nhận xét gửi tới Bố Mẹ bé
              </div>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
              Sổ Liên Lạc Điện Tử
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category Chips */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Loại nhận xét & dặn dò:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(c => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => handleSelectCategory(c.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    category === c.key
                      ? 'bg-amber-500 text-white shadow-xs scale-102 font-black'
                      : 'bg-slate-100 hover:bg-amber-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Star Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tiêu đề nhận xét:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Khen ngợi con đọc to rõ ràng..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Đánh giá sao:
              </label>
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 justify-around">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setScore(num)}
                    className={`text-base transition-transform cursor-pointer ${
                      score >= num ? 'scale-115 text-amber-500' : 'text-slate-300 opacity-60'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Suggestion & Quick Templates */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Nội dung gửi tới Phụ huynh:
              </label>
              <button
                type="button"
                onClick={handleGenerateAISuggestion}
                className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-amber-300" />
                <span>Trợ lý AI Gợi Ý</span>
              </button>
            </div>

            {/* Quick Template Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-2 no-scrollbar">
              {quickTemplates.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setContent(prev => prev ? `${prev} ${tpl}` : tpl)}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
                >
                  + {tpl.slice(0, 32)}...
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập lời khen ngợi, nhận xét chi tiết hoặc dặn dò phụ huynh cùng con luyện đọc ở nhà..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
              required
            />
          </div>

          {/* Teacher Signature */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Chữ ký Thầy / Cô gửi:
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSending || !content.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Đang gửi...' : 'Gửi Sang Cổng Phụ Huynh'}</span>
            </button>
          </div>
        </form>

        {/* Previous Message History */}
        {previousFeedbacks.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Lịch sử nhận xét đã gửi cho bé ({previousFeedbacks.length}):</span>
            </div>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {previousFeedbacks.slice(0, 3).map(fb => (
                <div key={fb.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate max-w-[200px]">{fb.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-1 italic text-[11px]">"{fb.content}"</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-600 font-black">{fb.score || 5} ⭐</span>
                    <span className={fb.isReadByParent ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                      {fb.isReadByParent ? '✓ Phụ huynh đã xem' : '○ Đang chờ phụ huynh xem'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
