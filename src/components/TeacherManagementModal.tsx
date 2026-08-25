import React, { useState } from 'react';
import { Volume1Lesson, Volume2Lesson } from '../types';
import { lessonStorageService } from '../services/lessonStorageService';
import { speechService } from '../services/speechService';
import { 
  X, Download, Upload, RotateCcw, Edit3, BookOpen, 
  Sparkles, Check, AlertCircle, FileText, CheckCircle2 
} from 'lucide-react';

interface TeacherManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEditVol1: (lesson: Volume1Lesson) => void;
  onSelectEditVol2: (lesson: Volume2Lesson) => void;
  onDataChanged: () => void;
}

export const TeacherManagementModal: React.FC<TeacherManagementModalProps> = ({
  isOpen,
  onClose,
  onSelectEditVol1,
  onSelectEditVol2,
  onDataChanged
}) => {
  const [importText, setImportText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [showImportArea, setShowImportArea] = useState<boolean>(false);

  if (!isOpen) return null;

  const stats = lessonStorageService.getStats();
  const allVol1 = lessonStorageService.getVolume1Lessons();
  const allVol2Topics = lessonStorageService.getTopicGroups();

  const customVol1Lessons = allVol1.filter(l => lessonStorageService.isVolume1Customized(l.id));
  const customVol2Lessons = allVol2Topics
    .flatMap(g => g.lessons)
    .filter(l => lessonStorageService.isVolume2Customized(l.id));

  // Export JSON file
  const handleExportJSON = () => {
    try {
      const jsonStr = lessonStorageService.exportAllToJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GiaoAn_TiengViet1_KNTT_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      speechService.playSoundEffect('success');
      setStatusMessage({ text: 'Đã xuất tệp giáo án thành công!', isError: false });
    } catch (e) {
      setStatusMessage({ text: 'Không thể xuất tệp giáo án.', isError: true });
    }
  };

  // Import JSON file via input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = lessonStorageService.importFromJson(content);
        if (result.success) {
          speechService.playSoundEffect('success');
          setStatusMessage({ text: result.message, isError: false });
          onDataChanged();
        } else {
          speechService.playSoundEffect('pop');
          setStatusMessage({ text: result.message, isError: true });
        }
      }
    };
    reader.readAsText(file);
  };

  // Import JSON via textarea
  const handleImportPastedJSON = () => {
    if (!importText.trim()) return;
    const result = lessonStorageService.importFromJson(importText.trim());
    if (result.success) {
      speechService.playSoundEffect('success');
      setStatusMessage({ text: result.message, isError: false });
      setImportText('');
      setShowImportArea(false);
      onDataChanged();
    } else {
      speechService.playSoundEffect('pop');
      setStatusMessage({ text: result.message, isError: true });
    }
  };

  // Reset all
  const handleResetAll = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ khôi phục toàn bộ bài học (Tập 1 & Tập 2) về chuẩn SGK gốc. Mọi bài học bạn đã tùy chỉnh sẽ bị xóa. Bạn có chắc chắn không?')) {
      lessonStorageService.resetAllLessons();
      speechService.playSoundEffect('pop');
      setStatusMessage({ text: 'Đã khôi phục toàn bộ chương trình về chuẩn gốc SGK!', isError: false });
      onDataChanged();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl">
              👩‍🏫
            </div>
            <div>
              <h2 className="text-xl font-black font-serif tracking-tight">
                Không Gian Quản Lý Giáo Án & Bài Giảng
              </h2>
              <p className="text-xs text-amber-100">
                Tùy chỉnh nội dung, sao lưu và nhập xuất giáo án Tiếng Việt 1
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

        {/* Status Message */}
        {statusMessage && (
          <div className={`mx-6 mt-4 p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 ${
            statusMessage.isError
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.isError ? <AlertCircle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700">✕</button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Quick Action Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Export */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-amber-950 font-black text-sm mb-1">
                  <Download className="w-4 h-4 text-orange-600" />
                  <span>Xuất Tệp Giáo Án</span>
                </div>
                <p className="text-xs text-amber-800">
                  Tải về tệp JSON chứa toàn bộ bài học đã được bạn biên soạn để lưu trữ hoặc gửi cho đồng nghiệp.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp (.json)</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-emerald-950 font-black text-sm mb-1">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Nhập Giáo Án</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Nhập bài soạn từ tệp JSON đã lưu hoặc dán mã giáo án trực tiếp.
                </p>
              </div>
              <div className="flex gap-2">
                <label className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn tệp</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setShowImportArea(!showImportArea)}
                  className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-all"
                  title="Dán mã JSON"
                >
                  Dán mã
                </button>
              </div>
            </div>

            {/* Reset */}
            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-rose-950 font-black text-sm mb-1">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Khôi Phục Gốc SGK</span>
                </div>
                <p className="text-xs text-rose-800">
                  Xóa tất cả các tùy chỉnh và đặt lại mọi bài học về nguyên bản chuẩn sách giáo khoa Kết nối tri thức.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetAll}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục toàn bộ</span>
              </button>
            </div>

          </div>

          {/* Collapsible Paste JSON Area */}
          {showImportArea && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
              <label className="block text-xs font-bold text-slate-800">
                Dán chuỗi nội dung JSON của giáo án vào đây:
              </label>
              <textarea
                rows={4}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"version": "1.0", "customVol1Lessons": {...}}'
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImportArea(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-bold rounded-lg text-slate-700"
                >
                  Đóng
                </button>
                <button
                  onClick={handleImportPastedJSON}
                  className="px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Xác nhận nhập dữ liệu
                </button>
              </div>
            </div>
          )}

          {/* List of customized lessons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-amber-950 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Danh Sách Bài Học Đã Tùy Chỉnh ({stats.totalCustomCount})
              </h3>
            </div>

            {stats.totalCustomCount === 0 ? (
              <div className="p-8 bg-amber-50/40 rounded-2xl border border-dashed border-amber-300 text-center space-y-2">
                <div className="text-3xl">📖</div>
                <p className="text-sm font-bold text-amber-900">
                  Chưa có bài học nào được tùy chỉnh riêng
                </p>
                <p className="text-xs text-amber-700 max-w-md mx-auto">
                  Tất cả bài học hiện đang ở chế độ chuẩn SGK Kết nối tri thức. Khi bạn mở một bài học bất kỳ và bấm nút <strong>"✏️ Chỉnh sửa bài học"</strong>, nội dung tùy chỉnh sẽ xuất hiện tại đây.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Volume 1 customized */}
                {customVol1Lessons.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-orange-900 uppercase">
                      Tập 1 ({customVol1Lessons.length} bài)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {customVol1Lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between shadow-2xs hover:bg-amber-100/50 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-orange-700">
                                Bài {lesson.lessonNumber}:
                              </span>
                              <span className="text-sm font-bold text-amber-950 font-serif">
                                {lesson.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-800 mt-0.5 truncate max-w-[220px]">
                              {lesson.part1_Letters.recognitionSentence}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                onSelectEditVol1(lesson);
                                onClose();
                              }}
                              className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Khôi phục Bài ${lesson.lessonNumber} về nguyên bản SGK?`)) {
                                  lessonStorageService.resetVolume1Lesson(lesson.id);
                                  speechService.playSoundEffect('pop');
                                  onDataChanged();
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                              title="Khôi phục bài này"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volume 2 customized */}
                {customVol2Lessons.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-emerald-900 uppercase">
                      Tập 2 ({customVol2Lessons.length} bài)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {customVol2Lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between shadow-2xs hover:bg-emerald-100/50 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-emerald-700">
                                Bài {lesson.lessonNumber}:
                              </span>
                              <span className="text-sm font-bold text-emerald-950 font-serif">
                                {lesson.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-800 mt-0.5 truncate max-w-[220px]">
                              {lesson.topicTitle}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                onSelectEditVol2(lesson);
                                onClose();
                              }}
                              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Khôi phục bài học về nguyên bản SGK?`)) {
                                  lessonStorageService.resetVolume2Lesson(lesson.id);
                                  speechService.playSoundEffect('pop');
                                  onDataChanged();
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                              title="Khôi phục bài này"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="bg-amber-50 px-6 py-4 border-t border-amber-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all"
          >
            Đóng bảng quản lý
          </button>
        </div>

      </div>
    </div>
  );
};
