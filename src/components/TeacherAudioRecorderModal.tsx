import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, Square, Play, Pause, RotateCcw, Save, Trash2, 
  Volume2, CheckCircle2, AlertCircle, Sparkles, User, HelpCircle, Bot
} from 'lucide-react';
import { teacherAudioService, TeacherAudioItem } from '../services/teacherAudioService';
import { speechService } from '../services/speechService';

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

interface TeacherAudioRecorderModalProps {
  target: TeacherAudioTarget | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (item: TeacherAudioItem) => void;
}

export const TeacherAudioRecorderModal: React.FC<TeacherAudioRecorderModalProps> = ({
  target,
  isOpen,
  onClose,
  onSaved
}) => {
  const effectiveText = (target?.text || target?.targetText || '').trim();
  const effectiveDisplayTitle = target?.displayTitle || target?.sectionTitle || target?.lessonTitle || '';

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordDuration, setRecordDuration] = useState<number>(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [isPlayingAI, setIsPlayingAI] = useState<boolean>(false);
  const [isPlayingSavedTeacher, setIsPlayingSavedTeacher] = useState<boolean>(false);
  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem('tv1_teacher_name') || 'Cô giáo';
  });
  const [micError, setMicError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Existing audio if any
  const existingAudio = effectiveText ? teacherAudioService.getAudioByText(effectiveText) : undefined;

  useEffect(() => {
    setAudioBlobUrl(null);
    setAudioBase64(null);
    setRecordDuration(0);
    setIsRecording(false);
    setMicError(null);
    setToastMessage(null);

    return () => {
      stopRecordingCleanup();
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, [effectiveText]);

  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      } catch (e) {
        // ignore
      }
    }
  };

  const startRecording = async () => {
    setMicError(null);
    setAudioBlobUrl(null);
    setAudioBase64(null);
    setRecordDuration(0);
    speechService.stop();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);

        // Convert to Base64 for persistent localStorage storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBase64(base64data);
        };
        reader.readAsDataURL(audioBlob);

        // Stop media stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      speechService.playSoundEffect('pop');

      timerIntervalRef.current = window.setInterval(() => {
        setRecordDuration(prev => {
          if (prev >= 60) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: unknown) {
      console.error('Microphone access error:', err);
      const errMsg = err instanceof Error ? err.message : 'Không thể truy cập Microphone.';
      setMicError(`Vui lòng cấp quyền Microphone trong trình duyệt: ${errMsg}`);
    }
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    speechService.playSoundEffect('sparkle');
  };

  const playPreviewAudio = () => {
    if (!audioBlobUrl) return;
    if (isPlayingPreview && previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
      return;
    }

    speechService.stop();
    const audio = new Audio(audioBlobUrl);
    previewAudioRef.current = audio;
    setIsPlayingPreview(true);

    audio.onended = () => {
      setIsPlayingPreview(false);
    };
    audio.onerror = () => {
      setIsPlayingPreview(false);
    };
    audio.play();
  };

  const playSavedTeacherAudio = () => {
    if (!existingAudio || !effectiveText) return;
    if (isPlayingSavedTeacher) {
      teacherAudioService.stopCurrentAudio();
      setIsPlayingSavedTeacher(false);
      return;
    }

    speechService.stop();
    setIsPlayingSavedTeacher(true);
    teacherAudioService.playAudio(effectiveText, () => {
      setIsPlayingSavedTeacher(false);
    });
  };

  const playAISpeech = () => {
    if (!effectiveText) return;
    if (isPlayingAI) {
      speechService.stop();
      setIsPlayingAI(false);
      return;
    }
    setIsPlayingAI(true);
    speechService.speakWithAIOnly(effectiveText, () => {
      setIsPlayingAI(false);
    });
  };

  const handleSaveTeacherAudio = () => {
    if (!audioBase64 || !effectiveText) return;
    localStorage.setItem('tv1_teacher_name', teacherName.trim() || 'Cô giáo');

    const item = teacherAudioService.saveAudio({
      text: effectiveText,
      volume: target.volume,
      lessonId: target.lessonId,
      section: target.section,
      audioBase64,
      mimeType: 'audio/webm',
      durationSeconds: recordDuration || 2,
      teacherName: teacherName.trim() || 'Cô giáo'
    });

    speechService.playSoundEffect('success');
    setToastMessage('Đã lưu giọng đọc mẫu thành công! Học sinh khi bấm nghe từ này sẽ nghe giọng cô giáo.');
    
    if (onSaved) {
      onSaved(item);
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDeleteSavedAudio = () => {
    if (!effectiveText) return;
    if (window.confirm(`Bạn có chắc muốn xoá giọng đọc mẫu của "${effectiveText}" và quay lại phát âm AI mặc định?`)) {
      teacherAudioService.deleteAudioByText(effectiveText);
      speechService.playSoundEffect('pop');
      setToastMessage('Đã xoá giọng mẫu! Hệ thống sẽ dùng phát âm AI.');
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        id="teacher-audio-recorder-modal"
        className="bg-white rounded-3xl shadow-2xl border border-amber-200 w-full max-w-xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Mic className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight flex items-center gap-1.5 font-serif">
                <span>Chỉnh sửa Giọng đọc mẫu của Giáo viên</span>
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                {effectiveDisplayTitle || (target.lessonId ? `Bài ${target.lessonId}` : 'Luyện phát âm chuẩn')}
              </p>
            </div>
          </div>
          <button
            id="close-teacher-recorder-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-fadeIn shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Target Text Showcase Card */}
          <div className="bg-gradient-to-b from-amber-50/70 to-orange-50/40 rounded-2xl p-5 border border-amber-200 text-center relative overflow-hidden shadow-inner">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full inline-block mb-2">
              Nội dung giáo viên cần đọc mẫu
            </span>
            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-reading py-2 leading-relaxed">
              {effectiveText}
            </div>

            {/* Current Voice Status Badge */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-xs font-bold">
              {existingAudio ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Đã có giọng mẫu của {existingAudio.teacherName || 'Cô giáo'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-300">
                  <Bot className="w-3.5 h-3.5 text-blue-500" />
                  Đang dùng phát âm AI mặc định
                </span>
              )}
            </div>
          </div>

          {/* Listening & Comparison Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Listen to AI pronunciation */}
            <button
              id="listen-ai-btn"
              onClick={playAISpeech}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isPlayingAI 
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md animate-pulse'
                  : 'bg-blue-50 hover:bg-blue-100/80 text-blue-900 border-blue-200 shadow-2xs'
              }`}
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>{isPlayingAI ? 'Đang phát âm AI...' : 'Nghe phát âm AI 🤖'}</span>
            </button>

            {/* Listen to Existing Teacher Audio if recorded */}
            <button
              id="listen-existing-teacher-btn"
              onClick={playSavedTeacherAudio}
              disabled={!existingAudio}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                !existingAudio
                  ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-70'
                  : isPlayingSavedTeacher
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md animate-pulse cursor-pointer'
                  : 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border-emerald-200 shadow-2xs cursor-pointer'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>
                {isPlayingSavedTeacher 
                  ? 'Đang phát giọng cô...' 
                  : existingAudio 
                  ? `Nghe giọng mẫu đã lưu 👩‍🏫` 
                  : 'Chưa có giọng mẫu'}
              </span>
            </button>
          </div>

          {/* Microphone Error Warning */}
          {micError && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-2xl flex items-start gap-2.5 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{micError}</div>
            </div>
          )}

          {/* Teacher Recording Console */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold px-1">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-rose-500" />
                Thu âm giọng đọc chuẩn của giáo viên
              </span>
              <span className="font-mono text-slate-800 text-sm bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                {formatTime(recordDuration)}
              </span>
            </div>

            {/* Recording Controls */}
            <div className="flex flex-col items-center justify-center py-2">
              {!isRecording ? (
                <button
                  id="start-teacher-record-btn"
                  onClick={startRecording}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Mic className="w-5 h-5" />
                  <span>Bắt đầu thu âm mẫu 🎙️</span>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-rose-600 font-extrabold text-sm animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                    <span>Đang thu âm... Cô đọc to, rõ ràng từng âm tiết nhé</span>
                  </div>
                  <button
                    id="stop-teacher-record-btn"
                    onClick={stopRecording}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Dừng & Nghe lại ⏹️</span>
                  </button>
                </div>
              )}
            </div>

            {/* Preview of newly recorded audio */}
            {audioBlobUrl && !isRecording && (
              <div className="p-3.5 bg-white rounded-xl border border-amber-300 flex items-center justify-between gap-3 animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Bản thu mới ({formatTime(recordDuration)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="play-new-preview-btn"
                    onClick={playPreviewAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingPreview ? 'Tạm dừng' : 'Nghe thử'}</span>
                  </button>

                  <button
                    id="re-record-btn"
                    onClick={startRecording}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    title="Thu âm lại"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Thu lại</span>
                  </button>
                </div>
              </div>
            )}

            {/* Teacher Name Input */}
            <div className="pt-2 flex items-center gap-2 max-w-sm mx-auto">
              <label htmlFor="teacher-name-input" className="text-xs text-slate-600 font-bold whitespace-nowrap">
                Tên giáo viên:
              </label>
              <input
                id="teacher-name-input"
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="VD: Cô Linh, Cô Mai..."
                className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Explanatory Note for Teachers */}
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Lưu ý cho Giáo viên:</strong> Khi bạn lưu giọng đọc mẫu, mọi nút bấm phát âm (hình chiếc loa 🔊 hoặc khi bấm vào thẻ chữ/từ/câu) sẽ tự động phát giọng đọc của bạn thay vì giọng máy AI. Dữ liệu được lưu an toàn trên máy của bạn.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          {existingAudio ? (
            <button
              id="delete-teacher-audio-btn"
              onClick={handleDeleteSavedAudio}
              className="flex items-center gap-1.5 px-3.5 py-2 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xoá giọng mẫu & Dùng lại AI</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            <button
              id="cancel-teacher-audio-btn"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              Đóng
            </button>

            <button
              id="save-teacher-audio-btn"
              onClick={handleSaveTeacherAudio}
              disabled={!audioBase64}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all ${
                audioBase64
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Lưu giọng đọc mẫu ⭐</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
