import React, { useState, useEffect } from 'react';
import { 
  X, Mic, Volume2, Play, Pause, Trash2, Download, Upload, 
  RotateCcw, Sparkles, CheckCircle2, Bot, User, Search, 
  Filter, Layers, BookOpen, Music, AlertCircle
} from 'lucide-react';
import { teacherAudioService, TeacherAudioItem } from '../services/teacherAudioService';
import { lessonStorageService } from '../services/lessonStorageService';
import { speechService } from '../services/speechService';
import { TeacherAudioTarget } from './TeacherAudioRecorderModal';

interface TeacherAudioStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRecorder: (target: TeacherAudioTarget) => void;
}

export const TeacherAudioStudioModal: React.FC<TeacherAudioStudioModalProps> = ({
  isOpen,
  onClose,
  onOpenRecorder
}) => {
  const [audios, setAudios] = useState<TeacherAudioItem[]>(() => teacherAudioService.getAllAudios());
  const [preferTeacherVoice, setPreferTeacherVoice] = useState<boolean>(() => teacherAudioService.isPreferTeacherVoice());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [filterVolume, setFilterVolume] = useState<'all' | 'vol1' | 'vol2'>('all');
  const [activeTab, setActiveTab] = useState<'recorded' | 'lesson_matrix' | 'import_export'>('recorded');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    const unsub = teacherAudioService.subscribe(() => {
      setAudios(teacherAudioService.getAllAudios());
      setPreferTeacherVoice(teacherAudioService.isPreferTeacherVoice());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const vol1Lessons = lessonStorageService.getVolume1Lessons();
  const currentVol1Lesson = vol1Lessons.find(l => l.id === selectedLessonId) || vol1Lessons[0];

  const handleToggleVoicePreference = (enabled: boolean) => {
    teacherAudioService.setPreferTeacherVoice(enabled);
    setPreferTeacherVoice(enabled);
    speechService.playSoundEffect('pop');
  };

  const handlePlayAudio = (item: TeacherAudioItem) => {
    if (playingKey === item.key) {
      teacherAudioService.stopCurrentAudio();
      setPlayingKey(null);
      return;
    }

    speechService.stop();
    setPlayingKey(item.key);
    teacherAudioService.playAudio(item.text, () => {
      setPlayingKey(null);
    });
  };

  const handleDelete = (item: TeacherAudioItem) => {
    if (window.confirm(`Bạn có chắc muốn xoá giọng đọc mẫu của "${item.text}"?`)) {
      teacherAudioService.deleteAudioById(item.id);
      speechService.playSoundEffect('pop');
      setStatusMessage({ text: `Đã xoá giọng mẫu của "${item.text}"`, isError: false });
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  const handleExportJSON = () => {
    try {
      const jsonStr = teacherAudioService.exportToJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GiongDocMau_GiaoVien_TiengViet1_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      speechService.playSoundEffect('success');
      setStatusMessage({ text: 'Đã xuất tệp sao lưu giọng đọc mẫu thành công!', isError: false });
    } catch (e) {
      setStatusMessage({ text: 'Không thể xuất tệp âm thanh.', isError: true });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = teacherAudioService.importFromJson(content);
        if (result.success) {
          speechService.playSoundEffect('success');
          setStatusMessage({ text: result.message, isError: false });
        } else {
          speechService.playSoundEffect('pop');
          setStatusMessage({ text: result.message, isError: true });
        }
      }
    };
    reader.readAsText(file);
  };

  const filteredAudios = audios.filter(item => {
    if (filterVolume === 'vol1' && item.volume !== 'vol1') return false;
    if (filterVolume === 'vol2' && item.volume !== 'vol2') return false;
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return true;
    return (item.text || '').toLowerCase().includes(q) || Boolean(item.teacherName && item.teacherName.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        id="teacher-audio-studio-modal"
        className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs text-white">
              <Music className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl font-serif">
                  Studio Âm thanh & Giọng đọc mẫu của Giáo viên
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900">
                  {audios.length} bản thu
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                Thu âm giọng đọc chuẩn của cô giáo để thay thế phát âm AI cho học sinh lớp 1
              </p>
            </div>
          </div>
          <button
            id="close-audio-studio-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Priority Switch Bar */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950">Chế độ phát âm học sinh nghe:</span>
            <div className="inline-flex rounded-xl bg-white p-1 border border-amber-300 shadow-2xs">
              <button
                onClick={() => handleToggleVoicePreference(true)}
                className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  preferTeacherVoice
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Ưu tiên giọng cô giáo 👩‍🏫</span>
              </button>
              <button
                onClick={() => handleToggleVoicePreference(false)}
                className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  !preferTeacherVoice
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Chỉ dùng giọng AI 🤖</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('recorded')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'recorded'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
              }`}
            >
              Danh sách bản thu ({audios.length})
            </button>
            <button
              onClick={() => setActiveTab('lesson_matrix')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'lesson_matrix'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
              }`}
            >
              Thu âm theo từng bài học
            </button>
            <button
              onClick={() => setActiveTab('import_export')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'import_export'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
              }`}
            >
              Sao lưu & Nhập xuất
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className={`mx-6 mt-3 p-3 rounded-2xl flex items-center gap-2 text-xs font-bold ${
            statusMessage.isError
              ? 'bg-rose-50 border border-rose-300 text-rose-900'
              : 'bg-emerald-50 border border-emerald-300 text-emerald-900'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* TAB 1: ALL RECORDED AUDIOS LIST */}
          {activeTab === 'recorded' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm từ ngữ, âm, vần đã thu âm..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600">Lọc tập:</span>
                  <select
                    value={filterVolume}
                    onChange={(e) => setFilterVolume(e.target.value as 'all' | 'vol1' | 'vol2')}
                    className="bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                  >
                    <option value="all">Tất cả bài học</option>
                    <option value="vol1">Tập 1 (Âm - Vần)</option>
                    <option value="vol2">Tập 2 (Đọc hiểu)</option>
                  </select>
                </div>
              </div>

              {/* List of items */}
              {filteredAudios.length === 0 ? (
                <div className="p-12 text-center bg-slate-50/60 rounded-3xl border border-dashed border-slate-300 space-y-3">
                  <Mic className="w-12 h-12 text-amber-500/50 mx-auto" />
                  <h4 className="font-bold text-slate-700 text-base">Chưa có bản thu âm mẫu nào</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Cô giáo có thể bấm vào bất kỳ âm, vần, tiếng, từ ngữ hoặc câu trong bài học để thu âm giọng đọc mẫu trực tiếp.
                  </p>
                  <button
                    onClick={() => setActiveTab('lesson_matrix')}
                    className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Mở bảng thu âm theo bài học 🎙️
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredAudios.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-bold">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
                            {item.section || 'Phát âm'}
                          </span>
                          <span>{item.teacherName || 'Cô giáo'}</span>
                        </div>
                        <div className="text-xl font-black text-slate-900 font-reading py-1">
                          {item.text}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handlePlayAudio(item)}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              playingKey === item.key
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}
                            title="Nghe giọng cô"
                          >
                            {playingKey === item.key ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            <span>{playingKey === item.key ? 'Dừng' : 'Nghe'}</span>
                          </button>

                          <button
                            onClick={() => onOpenRecorder({
                              text: item.text,
                              volume: item.volume,
                              lessonId: item.lessonId,
                              section: item.section
                            })}
                            className="p-2 bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-950 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            title="Thu âm lại"
                          >
                            <Mic className="w-3.5 h-3.5 text-orange-500" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="Xoá giọng mẫu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LESSON MATRIX RECORDING */}
          {activeTab === 'lesson_matrix' && (
            <div className="space-y-4">
              {/* Select Lesson Selector */}
              <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                <label className="text-xs font-bold text-amber-950 whitespace-nowrap">
                  Chọn bài học Tập 1 để duyệt giọng mẫu:
                </label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(parseInt(e.target.value, 10))}
                  className="flex-1 bg-white px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-slate-900"
                >
                  {vol1Lessons.map(l => (
                    <option key={l.id} value={l.id}>
                      Bài {l.lessonNumber}: {l.title} ({l.part1_Letters.letters.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Lesson Breakdown */}
              <div className="space-y-4">
                {/* 1. Letters / Phonics */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-2">
                    <span>1. Âm / Chữ cái / Vần của bài</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {currentVol1Lesson.part1_Letters.letters.map((letter, idx) => {
                      const hasAudio = teacherAudioService.hasAudioForText(letter, 'letter', currentVol1Lesson.id);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                            hasAudio ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="text-2xl font-black font-reading text-slate-900">{letter}</div>
                            <span className="text-[10px] font-bold text-slate-500">
                              {hasAudio ? 'Đã có giọng cô 🌟' : 'Giọng AI'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {hasAudio && (
                              <>
                                <button
                                  onClick={() => {
                                    if (playingKey === letter) {
                                      teacherAudioService.stopCurrentAudio();
                                      setPlayingKey(null);
                                    } else {
                                      speechService.stop();
                                      setPlayingKey(letter);
                                      teacherAudioService.playAudio(letter, () => setPlayingKey(null));
                                    }
                                  }}
                                  className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  title="Nghe thử giọng mẫu đã thu"
                                >
                                  {playingKey === letter ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Xóa giọng mẫu của "${letter}" khi chưa ưng ý và chuyển về phát âm AI?`)) {
                                      teacherAudioService.deleteAudioByText(letter, 'letter', currentVol1Lesson.id);
                                      speechService.playSoundEffect('pop');
                                      setStatusMessage({ text: `Đã xóa giọng mẫu của "${letter}"`, isError: false });
                                      setTimeout(() => setStatusMessage(null), 2500);
                                    }
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs transition-all cursor-pointer"
                                  title="Xóa giọng mẫu khi chưa ưng ý"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => onOpenRecorder({
                                text: letter,
                                volume: 'vol1',
                                lessonId: currentVol1Lesson.id,
                                lessonTitle: `Bài ${currentVol1Lesson.lessonNumber}: ${currentVol1Lesson.title}`,
                                section: 'letter'
                              })}
                              className="p-1.5 bg-white hover:bg-orange-100 text-orange-600 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
                              title={hasAudio ? "Thu lại giọng mẫu" : "Thu âm mẫu cho âm này"}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Reading Words */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
                    <span>2. Từ ngữ & Tiếng ứng dụng</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {currentVol1Lesson.part2_SyllablesAndWords.words.map((item, idx) => {
                      const hasAudio = teacherAudioService.hasAudioForText(item.word, 'word', currentVol1Lesson.id);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                            hasAudio ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="text-base font-bold font-reading text-slate-900">{item.word}</div>
                            <span className="text-[10px] font-bold text-slate-500">
                              {hasAudio ? 'Đã có giọng cô 🌟' : 'Giọng AI'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {hasAudio && (
                              <>
                                <button
                                  onClick={() => {
                                    if (playingKey === item.word) {
                                      teacherAudioService.stopCurrentAudio();
                                      setPlayingKey(null);
                                    } else {
                                      speechService.stop();
                                      setPlayingKey(item.word);
                                      teacherAudioService.playAudio(item.word, () => setPlayingKey(null));
                                    }
                                  }}
                                  className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                  title="Nghe thử giọng mẫu"
                                >
                                  {playingKey === item.word ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Xóa giọng mẫu của từ "${item.word}" khi chưa ưng ý?`)) {
                                      teacherAudioService.deleteAudioByText(item.word, 'word', currentVol1Lesson.id);
                                      speechService.playSoundEffect('pop');
                                      setStatusMessage({ text: `Đã xóa giọng mẫu của "${item.word}"`, isError: false });
                                      setTimeout(() => setStatusMessage(null), 2500);
                                    }
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs transition-all cursor-pointer"
                                  title="Xóa giọng mẫu khi chưa ưng ý"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => onOpenRecorder({
                                text: item.word,
                                volume: 'vol1',
                                lessonId: currentVol1Lesson.id,
                                lessonTitle: `Bài ${currentVol1Lesson.lessonNumber}: ${currentVol1Lesson.title}`,
                                section: 'word'
                              })}
                              className="p-1.5 bg-white hover:bg-orange-100 text-orange-600 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
                              title={hasAudio ? "Thu lại từ này" : "Thu âm mẫu từ này"}
                            >
                              <Mic className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Reading Passage / Sentence */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                    <span>3. Câu & Đoạn văn tập đọc</span>
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-sm font-reading text-slate-800 leading-relaxed">
                      {currentVol1Lesson.part3_SentenceAndPractice.readingPassage}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {teacherAudioService.hasAudioForText(currentVol1Lesson.part3_SentenceAndPractice.readingPassage, 'passage', currentVol1Lesson.id) && (
                        <button
                          onClick={() => {
                            const text = currentVol1Lesson.part3_SentenceAndPractice.readingPassage;
                            if (window.confirm('Xóa giọng đọc mẫu đoạn văn này khi chưa ưng ý?')) {
                              teacherAudioService.deleteAudioByText(text, 'passage', currentVol1Lesson.id);
                              speechService.playSoundEffect('pop');
                              setStatusMessage({ text: 'Đã xóa giọng mẫu của đoạn văn', isError: false });
                              setTimeout(() => setStatusMessage(null), 2500);
                            }
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                          title="Xóa giọng mẫu đoạn văn khi chưa ưng ý"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Xóa giọng</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenRecorder({
                          text: currentVol1Lesson.part3_SentenceAndPractice.readingPassage,
                          volume: 'vol1',
                          lessonId: currentVol1Lesson.id,
                          lessonTitle: `Bài ${currentVol1Lesson.lessonNumber}: ${currentVol1Lesson.title}`,
                          section: 'passage'
                        })}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all shrink-0 cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>{teacherAudioService.hasAudioForText(currentVol1Lesson.part3_SentenceAndPractice.readingPassage, 'passage', currentVol1Lesson.id) ? 'Thu lại đoạn văn 🎙️' : 'Thu âm đoạn văn 🎙️'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT & EXPORT */}
          {activeTab === 'import_export' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Download className="w-4 h-4 text-orange-600" />
                    <span>Xuất tệp sao lưu giọng đọc</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Tải về toàn bộ các bản thu âm mẫu của giáo viên dạng tệp JSON an toàn để lưu trữ hoặc chia sẻ sang máy tính khác của giáo viên / học sinh.
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải về tệp giọng đọc ({audios.length} bản thu)</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Nhập tệp giọng đọc từ máy khác</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Nhập tệp sao lưu giọng đọc mẫu để nạp nhanh toàn bộ âm thanh chuẩn của giáo viên vào ứng dụng.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Chọn tệp JSON để nạp</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Clear All Warning Card */}
              <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 flex items-center justify-between gap-3">
                <div className="text-xs text-rose-900">
                  <strong>Xoá toàn bộ bản thu:</strong> Khôi phục toàn bộ phát âm về AI mặc định.
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn xoá toàn bộ các bản thu âm giọng đọc mẫu của giáo viên? Thao tác này không thể hoàn tác trừ khi bạn đã xuất tệp sao lưu.')) {
                      teacherAudioService.clearAll();
                      speechService.playSoundEffect('pop');
                      setStatusMessage({ text: 'Đã xoá toàn bộ bản thu âm mẫu.', isError: false });
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Xoá toàn bộ
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Học sinh sẽ nghe giọng cô giáo khi bấm nghe bất kỳ âm/từ nào đã thu âm.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            Đóng Studio
          </button>
        </div>
      </div>
    </div>
  );
};
