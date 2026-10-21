import React from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Cpu, 
  BookOpen, 
  FileText,
  School,
  ExternalLink
} from 'lucide-react';

interface AIContestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIContestInfoModal: React.FC<AIContestInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-600 p-5 text-white flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full">
                  Sáng kiến Chuyển đổi số & AI 2026
                </span>
                <span className="text-[11px] font-bold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                  Điện Biên
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-serif mt-0.5">
                Ngày Hội "Nhà Giáo Sáng Tạo Với Công Nghệ Số & AI"
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 text-sm">
          {/* Banner Document Reference */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3">
            <School className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-950 font-bold text-sm sm:text-base">
                Căn cứ Công văn số 4786/SGDĐT-QLCL - Sở GD&ĐT tỉnh Điện Biên
              </strong>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Thực hiện chỉ đạo của Bộ Giáo dục và Đào tạo về ngày hội <em>"Nhà giáo sáng tạo với công nghệ số và trí tuệ nhân tạo năm 2026"</em>. Sản phẩm ứng dụng giải pháp công nghệ số và AI nhằm nâng cao năng lực đọc - viết tiếng Việt cho học sinh lớp 1, đặc biệt là học sinh vùng cao và dân tộc thiểu số.
              </p>
            </div>
          </div>

          {/* Key Pillars */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900 font-serif flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-600" />
              <span>Các Trụ Cột Công Nghệ & Trí Tuệ Nhân Tạo (AI) Nổi Bật</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <div className="flex items-center gap-2 font-bold text-purple-900 mb-1.5">
                  <Bot className="w-5 h-5 text-purple-700" />
                  <span>Trợ Lý AI Chấm Phát Âm</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tích hợp công nghệ nhận diện giọng nói tiếng Việt (Web Speech AI & Phonetic Alignment), tự động so khớp giọng đọc của bé với ngữ liệu SGK Lớp 1, chấm điểm độ chính xác (%), tô màu từng từ đọc đúng/sai và đưa ra lời khuyên sửa ngọng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200">
                <div className="flex items-center gap-2 font-bold text-orange-900 mb-1.5">
                  <Sparkles className="w-5 h-5 text-orange-700" />
                  <span>Âm Thanh Mẫu Của Giáo Viên</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cho phép chính giáo viên giảng dạy thu âm giọng đọc mẫu bản ngữ truyền cảm của mình. Hệ thống tự động ưu tiên phát giọng cô giáo thay cho giọng máy AI, tạo sự gần gũi, ấm áp cho học sinh.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1.5">
                  <BookOpen className="w-5 h-5 text-emerald-700" />
                  <span>Vở Tập Viết Ô Ly Chuẩn</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mô phỏng bảng con và vở ô ly 4 dòng kẻ chuẩn tiểu học Việt Nam. Học sinh luyện viết nét chữ, tải ảnh tác phẩm để nộp cho thầy cô giáo nhận xét.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-2 font-bold text-blue-900 mb-1.5">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                  <span>Bảo Vệ Quyền Riêng Tư (Mục 5.b)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tuân thủ nghiêm ngặt quy định bảo vệ dữ liệu cá nhân học sinh (Nghị định 13/2023/NĐ-CP). Dữ liệu thu âm và học tập được lưu trữ an toàn, phi thương mại.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Value for Dien Bien */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-500" />
              <span>Giá Trị Thực Tiễn Với Học Sinh Tỉnh Điện Biên</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Học sinh lớp 1 tại các xã, bản vùng cao khi bước vào trường tiểu học thường gặp khó khăn về rào cản tiếng phổ thông (nói ngọng, lẫn lộn thanh điệu, thiếu tự tin). Ứng dụng đóng vai trò là một <strong>"Gia sư AI kiên nhẫn"</strong> và <strong>"Cầu nối số giữa cô giáo và học sinh"</strong>, giúp các em có thể luyện đọc chuẩn mọi lúc mọi nơi ngay tại gia đình.
            </p>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-3 space-y-1">
            <p>
              <strong>Bản quyền ngữ liệu:</strong> Biên soạn theo cấu trúc SGK Tiếng Việt 1 - Bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam), phục vụ nghiên cứu và sáng tạo giáo dục phi thương mại.
            </p>
            <p>
              <strong>Kênh nộp hồ sơ chính thức:</strong> Cổng thông tin Hội thi tại{' '}
              <a href="https://www.ieeai.net" target="_blank" rel="noreferrer" className="text-purple-600 underline font-bold">
                https://www.ieeai.net
              </a>{' '}
              (Hạn cuối: 23:59 ngày 25/10/2026).
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
          >
            Đã hiểu & Tiếp tục trải nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
