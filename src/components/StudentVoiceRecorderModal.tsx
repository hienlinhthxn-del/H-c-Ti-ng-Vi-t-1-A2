import React, { useState, useEffect, useRef } from 'react';
import { RecordingTargetInfo, StudentRecording, AchievementBadge } from '../types';
import { speechService } from '../services/speechService';
import { recordingStorageService } from '../services/recordingStorageService';
import { achievementService } from '../services/achievementService';
import confetti from 'canvas-confetti';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Download,
  Trash2,
  Volume2,
  Sparkles,
  X,
  Clock,
  Award,
  CheckCircle2,
  FolderHeart,
  Radio,
  AlertCircle,
  HelpCircle,
  Trophy
} from 'lucide-react';

interface StudentVoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetInfo: RecordingTargetInfo | null;
  onAddStar?: () => void;
  onUnlockBadges?: (badges: AchievementBadge[]) => void;
}

export const StudentVoiceRecorderModal: React.FC<StudentVoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  targetInfo,
  onAddStar,
  onUnlockBadges
}) => {
  const [activeTab, setActiveTab] = useState<'record' | 'history'>('record');
  const [recordings, setRecordings] = useState<StudentRecording[]>([]);
  
  // Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentRecordingSaved, setCurrentRecordingSaved] = useState<StudentRecording | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(16).fill(10));
  
  // Audio playback of the recorded voice
  const [isPlayingRecorded, setIsPlayingRecorded] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackCurrentTime, setPlaybackCurrentTime] = useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = useState<number>(0);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState<boolean>(false);

  // Active playing history item
  const [playingHistoryId, setPlayingHistoryId] = useState<string | null>(null);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const historyAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Load history on open or change
  useEffect(() => {
    if (isOpen) {
      loadRecordings();
    } else {
      cleanupAudioStream();
      resetRecordingState();
    }
  }, [isOpen]);

  // Subscribe to storage updates
  useEffect(() => {
    const unsubscribe = recordingStorageService.subscribe(() => {
      loadRecordings();
    });
    return unsubscribe;
  }, []);

  const loadRecordings = async () => {
    const all = await recordingStorageService.getAllRecordings();
    setRecordings(all);
  };

  const cleanupAudioStream = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    if (historyAudioPlayerRef.current) {
      historyAudioPlayerRef.current.pause();
    }
  };

  const resetRecordingState = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setCurrentRecordingSaved(null);
    setPermissionError(null);
    setIsPlayingRecorded(false);
    setPlaybackProgress(0);
    setPlaybackCurrentTime(0);
    setPlaybackDuration(0);
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      setPermissionError(null);
      resetRecordingState();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Trình duyệt chưa hỗ trợ ghi âm microphone. Vui lòng thử trên Chrome hoặc Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      // Setup Web Audio Analyser for live frequency visualization
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start visualizer loop
      const updateVisualizer = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Take 16 frequency points
        const levels: number[] = [];
        const step = Math.floor(dataArray.length / 16);
        for (let i = 0; i < 16; i++) {
          const val = dataArray[i * step] || 0;
          levels.push(Math.max(10, Math.min(100, Math.round((val / 255) * 100))));
        }
        setAudioLevels(levels);
        animFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      updateVisualizer();

      // Detect best supported mime type
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
      let selectedMimeType = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMimeType = mime;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop stream and analyser
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }

        // Save automatically
        if (targetInfo && blob.size > 0) {
          const saved = await recordingStorageService.saveRecording(
            targetInfo,
            blob,
            recordingSeconds
          );
          setCurrentRecordingSaved(saved);
          
          // Sound & Star & Confetti celebration
          speechService.playSoundEffect('fanfare');
          if (onAddStar) {
            onAddStar();
          }
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 }
          });

          // Track achievement & check for unlocked badges
          const { newBadges } = achievementService.incrementRecordingsCount();
          if (newBadges.length > 0 && onUnlockBadges) {
            onUnlockBadges(newBadges);
          }
        }
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setIsPaused(false);
      speechService.playSoundEffect('pop');

      // Start stopwatch
      setRecordingSeconds(0);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Error starting recording:', err);
      setPermissionError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Ứng dụng cần quyền sử dụng Microphone để bé đọc bài. Hãy cho phép microphone trên trình duyệt nhé!'
          : 'Không thể khởi động microphone: ' + (err.message || 'Lỗi thiết bị')
      );
    }
  };

  // Pause or Resume
  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    speechService.playSoundEffect('pop');
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  // Play/Pause recorded student audio
  const togglePlayRecorded = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingRecorded) {
      audioPlayerRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  // Play teacher reference audio
  const handleListenTeacherModel = () => {
    if (!targetInfo) return;
    setIsTeacherSpeaking(true);
    const textToSpeak = targetInfo.referenceAudioText || targetInfo.targetText;
    speechService.speak(textToSpeak, () => {
      setIsTeacherSpeaking(false);
    });
  };

  // Play history item
  const handleTogglePlayHistory = (item: StudentRecording) => {
    if (!item.audioBlobUrl) return;

    if (playingHistoryId === item.id) {
      if (historyAudioPlayerRef.current) {
        historyAudioPlayerRef.current.pause();
      }
      setPlayingHistoryId(null);
    } else {
      setPlayingHistoryId(item.id);
      if (historyAudioPlayerRef.current) {
        historyAudioPlayerRef.current.src = item.audioBlobUrl;
        historyAudioPlayerRef.current.play().catch(err => console.error('Play history error:', err));
      }
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    if (confirm('Bé có muốn xóa bản ghi âm này không?')) {
      if (playingHistoryId === id) {
        if (historyAudioPlayerRef.current) {
          historyAudioPlayerRef.current.pause();
        }
        setPlayingHistoryId(null);
      }
      await recordingStorageService.deleteRecording(id);
      loadRecordings();
    }
  };

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const currentLessonRecordings = targetInfo
    ? recordings.filter(r => r.volume === targetInfo.volume && r.lessonId === targetInfo.lessonId)
    : recordings;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      
      {/* Hidden Audio Elements */}
      <audio
        ref={audioPlayerRef}
        src={audioUrl || undefined}
        onTimeUpdate={() => {
          if (audioPlayerRef.current) {
            setPlaybackCurrentTime(audioPlayerRef.current.currentTime);
            setPlaybackProgress(
              (audioPlayerRef.current.currentTime / (audioPlayerRef.current.duration || 1)) * 100
            );
          }
        }}
        onLoadedMetadata={() => {
          if (audioPlayerRef.current) {
            setPlaybackDuration(audioPlayerRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          setIsPlayingRecorded(false);
          setPlaybackProgress(0);
          setPlaybackCurrentTime(0);
        }}
      />

      <audio
        ref={historyAudioPlayerRef}
        onEnded={() => setPlayingHistoryId(null)}
      />

      {/* Main Studio Modal Card */}
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 sm:p-5 text-white flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-2xl">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide uppercase bg-black/20 px-2.5 py-0.5 rounded-full">
                  Phòng Thu Âm Của Bé
                </span>
                {targetInfo && (
                  <span className="text-xs font-bold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                    {targetInfo.volume === 'vol1' ? 'Tập 1' : 'Tập 2'}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black font-serif mt-0.5 line-clamp-1">
                {targetInfo?.lessonTitle || 'Luyện đọc Tiếng Việt 1'}
              </h2>
            </div>
          </div>

          <button
            id="close-recorder-modal-btn"
            onClick={() => {
              cleanupAudioStream();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            title="Đóng phòng thu âm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher: Luyện đọc & Thu âm vs Nhật ký đã lưu */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-3 pb-2 border-b border-amber-100 bg-amber-50/40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('record')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'record'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100/70 bg-white border border-amber-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Luyện đọc & Ghi âm</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100/70 bg-white border border-amber-200'
              }`}
            >
              <FolderHeart className="w-4 h-4" />
              <span>Sổ tay bài thu ({recordings.length})</span>
            </button>
          </div>

          {targetInfo?.sectionTitle && (
            <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg hidden sm:inline-block">
              {targetInfo.sectionTitle}
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 bg-gradient-to-b from-amber-50/20 to-white">
          
          {activeTab === 'record' ? (
            <>
              {/* Target Reading Card */}
              {targetInfo && (
                <div className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-yellow-50 rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                        📖 Bài đọc của bé
                      </span>
                      <span className="text-xs text-slate-500">
                        (Bé hãy đọc to, rõ ràng và ngắt nghỉ đúng nhịp nhé)
                      </span>
                    </div>

                    {/* Teacher Reference Speech button */}
                    <button
                      id="listen-teacher-speech-btn"
                      onClick={handleListenTeacherModel}
                      disabled={isRecording}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isTeacherSpeaking
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                      } ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title="Nghe cô giáo đọc mẫu"
                    >
                      <Volume2 className="w-4 h-4 text-orange-500" />
                      <span>{isTeacherSpeaking ? 'Đang đọc mẫu...' : 'Nghe cô đọc mẫu'}</span>
                    </button>
                  </div>

                  {/* Target Text Box */}
                  <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-5 border border-amber-100 shadow-inner">
                    <p className="text-xl sm:text-2xl font-serif text-slate-900 leading-relaxed sm:leading-loose text-center font-bold tracking-wide whitespace-pre-line">
                      {targetInfo.targetText}
                    </p>
                  </div>
                </div>
              )}

              {/* Permission Error Banner */}
              {permissionError && (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 flex items-start gap-3 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Chưa thể ghi âm:</strong>
                    <p>{permissionError}</p>
                  </div>
                </div>
              )}

              {/* RECORDING STUDIO CONSOLE */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-orange-200 shadow-md flex flex-col items-center justify-center text-center">
                
                {/* 1. STATE: RECORDING ACTIVE */}
                {isRecording ? (
                  <div className="w-full space-y-5">
                    
                    {/* Pulsing On-Air Indicator & Timer */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-black animate-pulse">
                        <Radio className="w-4 h-4 text-rose-600" />
                        <span>ĐANG GHI ÂM</span>
                      </div>
                      
                      <div className="text-2xl sm:text-3xl font-black font-mono text-slate-800">
                        {formatTime(recordingSeconds)}
                      </div>
                    </div>

                    {/* Live Audio Visualizer Bars */}
                    <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 flex items-end justify-center gap-1.5 sm:gap-2 h-28 sm:h-32 shadow-inner">
                      {audioLevels.map((level, idx) => (
                        <div
                          key={idx}
                          className="w-2.5 sm:w-3.5 rounded-t-full transition-all duration-75"
                          style={{
                            height: `${Math.max(12, level)}%`,
                            backgroundColor:
                              level > 60
                                ? '#f43f5e'
                                : level > 30
                                ? '#fbbf24'
                                : '#10b981'
                          }}
                        />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                      🎤 Bé hãy nhìn vào bài đọc ở trên và đọc thật to, dõng dạc nhé!
                    </p>

                    {/* Recording Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        id="pause-recording-btn"
                        onClick={togglePauseRecording}
                        className="px-4 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                      >
                        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
                      </button>

                      <button
                        id="finish-recording-btn"
                        onClick={stopRecording}
                        className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
                      >
                        <Square className="w-5 h-5 fill-white" />
                        <span>HOÀN THÀNH BÀI ĐỌC</span>
                      </button>
                    </div>

                  </div>
                ) : audioUrl ? (
                  /* 2. STATE: RECORDED COMPLETED / REVIEW */
                  <div className="w-full space-y-5">
                    
                    {/* Encouraging Feedback & Star Award Banner */}
                    <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-3xl p-5 text-amber-950 shadow-md relative overflow-hidden text-left">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center shrink-0 text-2xl shadow-xs">
                          ⭐
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase bg-white/60 px-2.5 py-0.5 rounded-full">
                              Khen thưởng bé
                            </span>
                            <span className="text-xs font-bold text-amber-900">
                              +1 Ngôi sao chăm ngoan!
                            </span>
                          </div>
                          <p className="text-base sm:text-lg font-black font-serif mt-1">
                            {currentRecordingSaved?.feedback?.cheeringMessage || 'Bé đã hoàn thành bài đọc rất xuất sắc!'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Audio Player Card */}
                    <div className="bg-orange-50/70 rounded-2xl p-4 sm:p-5 border border-orange-200 flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Bản ghi âm giọng đọc của bé</span>
                        <span className="font-mono text-orange-700 font-black">
                          {formatTime(playbackCurrentTime)} / {formatTime(playbackDuration || recordingSeconds)}
                        </span>
                      </div>

                      {/* Custom Playback Progress Bar */}
                      <div
                        onClick={(e) => {
                          if (!audioPlayerRef.current || !playbackDuration) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = e.clientX - rect.left;
                          const newPct = clickX / rect.width;
                          audioPlayerRef.current.currentTime = newPct * playbackDuration;
                        }}
                        className="w-full h-3 bg-orange-200/80 rounded-full overflow-hidden cursor-pointer relative"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all"
                          style={{ width: `${playbackProgress}%` }}
                        />
                      </div>

                      {/* Player controls */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          id="play-recorded-audio-btn"
                          onClick={togglePlayRecorded}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                        >
                          {isPlayingRecorded ? (
                            <>
                              <Pause className="w-5 h-5" />
                              <span>Tạm dừng</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5 fill-white" />
                              <span>Nghe lại bài đọc</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-2">
                          {currentRecordingSaved && (
                            <button
                              id="download-recording-btn"
                              onClick={() => recordingStorageService.downloadRecording(currentRecordingSaved)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-orange-100 text-orange-900 border border-orange-200 font-semibold text-xs transition-all cursor-pointer"
                              title="Tải tệp ghi âm về máy để gửi thầy cô"
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Tải về máy</span>
                            </button>
                          )}

                          <button
                            id="rerecord-btn"
                            onClick={startRecording}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                            title="Ghi âm lại lần nữa"
                          >
                            <RotateCcw className="w-4 h-4 text-orange-500" />
                            <span>Đọc lại lần nữa</span>
                          </button>
                        </div>
                      </div>

                    </div>

                  </div>
                ) : (
                  /* 3. STATE: IDLE READY TO RECORD */
                  <div className="py-6 sm:py-8 space-y-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/25 animate-bounce">
                      <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-black font-serif text-slate-900">
                        Sẵn sàng luyện đọc cùng cô!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                        Bấm nút bên dưới, sau đó nhìn vào bài đọc và cất giọng thật to, rõ ràng từng tiếng nhé!
                      </p>
                    </div>

                    <button
                      id="start-recording-btn"
                      onClick={startRecording}
                      className="px-8 py-4 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black text-base sm:text-lg shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto cursor-pointer"
                    >
                      <Mic className="w-6 h-6" />
                      <span>BẮT ĐẦU ĐỌC & GHI ÂM</span>
                    </button>
                  </div>
                )}

              </div>
            </>
          ) : (
            /* TAB: HISTORY OF RECORDINGS */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 font-serif">
                    Sổ tay ghi âm bài đọc ({recordings.length} bài)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Nơi lưu giữ các bài đọc của bé để phụ huynh và giáo viên lắng nghe lại
                  </p>
                </div>

                {recordings.length > 0 && (
                  <button
                    onClick={async () => {
                      if (confirm('Bé có chắc muốn xóa tất cả các bài ghi âm cũ không?')) {
                        await recordingStorageService.clearAllRecordings();
                        loadRecordings();
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {recordings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-amber-200 p-6">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto mb-3">
                    🎙️
                  </div>
                  <h4 className="text-base font-bold text-slate-800 font-serif">
                    Bé chưa có bài thu âm nào
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Hãy bấm vào tab "Luyện đọc & Ghi âm" và đọc to bài học để lưu lại giọng đọc đáng yêu của mình nhé!
                  </p>
                  <button
                    onClick={() => setActiveTab('record')}
                    className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md hover:bg-orange-600 cursor-pointer"
                  >
                    Bắt đầu ghi âm ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recordings.map((rec) => {
                    const isItemPlaying = playingHistoryId === rec.id;
                    const dateFormatted = new Date(rec.createdAt).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });

                    return (
                      <div
                        key={rec.id}
                        className="p-4 rounded-2xl bg-white border border-amber-200 hover:border-orange-400 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              {rec.volume === 'vol1' ? 'Tập 1' : 'Tập 2'}
                            </span>
                            {rec.sectionTitle && (
                              <span className="text-[11px] font-semibold text-slate-500">
                                • {rec.sectionTitle}
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                              <Clock className="w-3 h-3" />
                              {dateFormatted}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                            {rec.lessonTitle}
                          </h4>

                          <p className="text-xs text-slate-600 font-serif line-clamp-1 mt-0.5 italic">
                            "{rec.targetText}"
                          </p>

                          {rec.feedback && (
                            <p className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                              <span>⭐</span>
                              <span>{rec.feedback.cheeringMessage}</span>
                            </p>
                          )}
                        </div>

                        {/* Item actions */}
                        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-amber-100">
                          <button
                            onClick={() => handleTogglePlayHistory(rec)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              isItemPlaying
                                ? 'bg-rose-500 text-white shadow-xs'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                            }`}
                          >
                            {isItemPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                            <span>{isItemPlaying ? 'Dừng' : 'Nghe'}</span>
                            <span className="font-mono text-[10px] opacity-80">({formatTime(rec.durationSeconds)})</span>
                          </button>

                          <button
                            onClick={() => recordingStorageService.downloadRecording(rec)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
                            title="Tải tệp ghi âm"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteHistoryItem(rec.id)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Xóa bản ghi này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-amber-100 bg-amber-50/50 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="text-base">💡</span>
            <span>Gợi ý: Bé hãy ngồi trong phòng yên tĩnh và phát âm dứt khoát nhé!</span>
          </div>

          <button
            onClick={() => {
              cleanupAudioStream();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 transition-colors cursor-pointer"
          >
            Đóng lại
          </button>
        </div>

      </div>

    </div>
  );
};
