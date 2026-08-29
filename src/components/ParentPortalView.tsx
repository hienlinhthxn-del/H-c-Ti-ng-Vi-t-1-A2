import React, { useState, useEffect } from 'react';
import { StudentRecording, AchievementState, AcademicRank, AppUserProfile } from '../types';
import { recordingStorageService } from '../services/recordingStorageService';
import { achievementService, ACADEMIC_RANKS } from '../services/achievementService';
import { lessonStorageService } from '../services/lessonStorageService';
import { userProfileService } from '../services/userProfileService';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Award, 
  Mic, 
  Clock, 
  CheckCircle2, 
  Play, 
  Square, 
  Volume2, 
  Star, 
  Lightbulb, 
  HelpCircle, 
  BookCheck, 
  Eye, 
  Smile, 
  Flame, 
  Calendar,
  AlertCircle,
  Download,
  Info,
  Timer,
  Cloud
} from 'lucide-react';

interface ParentPortalViewProps {
  onOpenAchievements: () => void;
  onOpenVoiceStudio: () => void;
  onSelectVolume1: () => void;
  onSelectVolume2: () => void;
  starsCount: number;
  onOpenGoogleWorkspace?: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  onOpenAchievements,
  onOpenVoiceStudio,
  onSelectVolume1,
  onSelectVolume2,
  starsCount,
  onOpenGoogleWorkspace
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recordings' | 'handbook' | 'timer'>('dashboard');
  const [recordings, setRecordings] = useState<StudentRecording[]>([]);
  const [achievementState, setAchievementState] = useState<AchievementState>(() => achievementService.getState());
  const [currentRank, setCurrentRank] = useState<AcademicRank>(() => achievementService.getCurrentRank());
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const [handbookTopic, setHandbookTopic] = useState<'spelling_rules' | 'phonics_method' | 'posture_grip' | 'daily_routine'>('phonics_method');

  // Multi-user child profiles
  const [allStudents, setAllStudents] = useState<AppUserProfile[]>(() => 
    userProfileService.getAllUsers().filter(u => u.role === 'student')
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    const active = userProfileService.getActiveUser();
    if (active.role === 'student') return active.id;
    const students = userProfileService.getAllUsers().filter(u => u.role === 'student');
    return students[0]?.id || '';
  });

  // Study Timer (Eye Care Pomodoro)
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerFinished, setTimerFinished] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      const list = await recordingStorageService.getAllRecordings();
      setRecordings(list);
      setAllStudents(userProfileService.getAllUsers().filter(u => u.role === 'student'));
    };
    loadData();

    const unsubRecs = recordingStorageService.subscribe(async () => {
      const list = await recordingStorageService.getAllRecordings();
      setRecordings(list);
    });

    const unsubAchieve = achievementService.subscribe((state) => {
      setAchievementState(state);
      setCurrentRank(achievementService.getCurrentRank());
    });

    const unsubUsers = userProfileService.subscribe(() => {
      setAllStudents(userProfileService.getAllUsers().filter(u => u.role === 'student'));
    });

    return () => {
      unsubRecs();
      unsubAchieve();
      unsubUsers();
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerFinished(true);
            speechService.playSoundEffect('fanfare');
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft]);

  const startTimer = (mins: number) => {
    setTimerMinutes(mins);
    setTimerSecondsLeft(mins * 60);
    setIsTimerRunning(true);
    setTimerFinished(false);
    speechService.playSoundEffect('pop');
  };

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
    speechService.playSoundEffect('pop');
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerMinutes * 60);
    setTimerFinished(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedVol1Count = achievementState.completedLessonKeys.filter(k => k.startsWith('vol1_')).length;
  const completedVol2Count = achievementState.completedLessonKeys.filter(k => k.startsWith('vol2_')).length;
  const totalCompleted = achievementState.completedLessonKeys.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* Parent Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-amber-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-emerald-100 border border-white/20">
              <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
              <span>Cổng Phụ Huynh • Đồng Hành Cùng Con Vào Lớp 1</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-reading">
              Sổ Tay Theo Dõi & Phương Pháp Dạy Con
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
              Dành riêng cho Bố Mẹ: Nắm bắt tiến độ học tập hàng ngày của con, nghe lại các bài đọc con đã tự luyện tại nhà, xem lời nhận xét của cô giáo và tra cứu phương pháp đánh vần chuẩn SGK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onOpenGoogleWorkspace && (
              <button
                id="parent-open-google-workspace-btn"
                onClick={onOpenGoogleWorkspace}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg border border-emerald-300/40 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-white" />
                <span>Sao Lưu Lên Google Drive / Sheets</span>
              </button>
            )}

            <button
              id="parent-view-achievements-btn"
              onClick={onOpenAchievements}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Xem Tủ Huy Hiệu Của Con</span>
            </button>
          </div>
        </div>

        {/* Child's Progress Metric Cards */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-emerald-200 font-medium">Danh hiệu hiện tại</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-1.5">
              <span>{currentRank.badgeIcon}</span>
              <span className="truncate">{currentRank.title}</span>
            </div>
            <div className="text-[11px] text-emerald-100">Cấp {currentRank.level} / 8</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-emerald-200 font-medium">Sao thưởng tích lũy</div>
            <div className="text-2xl font-black text-amber-300 mt-1 flex items-center gap-1">
              <span>⭐</span>
              <span>{starsCount}</span>
            </div>
            <div className="text-[11px] text-emerald-100">Bé rất chăm ngoan!</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-emerald-200 font-medium">Bài đã hoàn thành</div>
            <div className="text-2xl font-black text-white mt-1">
              {totalCompleted} <span className="text-xs text-emerald-200 font-normal">/ 91 bài</span>
            </div>
            <div className="text-[11px] text-emerald-100">{completedVol1Count} Tập 1 • {completedVol2Count} Tập 2</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-emerald-200 font-medium">Bản thu âm của con</div>
            <div className="text-2xl font-black text-white mt-1">{recordings.length} Bài</div>
            <div className="text-[11px] text-emerald-100">{recordings.filter(r => r.teacherComment).length} bài có lời cô khen</div>
          </div>
        </div>
      </div>

      {/* Child Profile Switcher bar for Multi-child families */}
      {allStudents.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
            <span>🧒 Hồ sơ các bé đang theo dõi:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {allStudents.map(student => {
              const isSelected = student.id === selectedStudentId;
              return (
                <button
                  key={student.id}
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    userProfileService.setActiveUser(student.id);
                    speechService.playSoundEffect('pop');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <span>{student.avatar}</span>
                  <span>{student.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-emerald-800 text-amber-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    ⭐ {student.starsCount || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-emerald-200">
        <button
          id="parent-tab-dashboard-btn"
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
          }`}
        >
          <BookCheck className="w-4 h-4" />
          <span>1. Tiến Trình Học Của Con</span>
        </button>

        <button
          id="parent-tab-recordings-btn"
          onClick={() => setActiveTab('recordings')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'recordings'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>2. Sổ Tay Giọng Đọc Của Con</span>
          {recordings.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
              {recordings.length}
            </span>
          )}
        </button>

        <button
          id="parent-tab-handbook-btn"
          onClick={() => setActiveTab('handbook')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'handbook'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>3. Cẩm Nang & Phương Pháp Dạy Con</span>
        </button>

        <button
          id="parent-tab-timer-btn"
          onClick={() => setActiveTab('timer')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'timer'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>4. Hẹn Giờ Học & Bảo Vệ Mắt</span>
        </button>
      </div>

      {/* TAB 1: DASHBOARD & PROGRESS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Milestone Stepper */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>🗺️ Lộ Trình 4 Chặng Chinh Phục Tiếng Việt Lớp 1</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Theo dõi hành trình phát triển từ nhận biết âm chữ đến đọc trôi chảy các bài văn, bài thơ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              {[
                { 
                  step: 1, 
                  title: 'Chặng 1: Âm Chữ & Thanh Điệu', 
                  desc: 'Bài 1 đến Bài 30 (A, B, C, D, Đ, dấu thanh...)', 
                  status: completedVol1Count >= 10 ? 'complete' : 'in_progress',
                  color: 'from-amber-500 to-orange-500',
                  target: 'Nắm vững 29 chữ cái & 5 dấu thanh'
                },
                { 
                  step: 2, 
                  title: 'Chặng 2: Vần Cơ Bản', 
                  desc: 'Bài 31 đến Bài 60 (Vần có âm cuối n, m, p, t, c, ch)', 
                  status: completedVol1Count >= 35 ? 'complete' : (completedVol1Count >= 10 ? 'in_progress' : 'locked'),
                  color: 'from-orange-500 to-rose-500',
                  target: 'Đánh vần và đọc trơn từ 2-3 tiếng'
                },
                { 
                  step: 3, 
                  title: 'Chặng 3: Vần Nâng Cao', 
                  desc: 'Bài 61 đến Bài 83 (Vần có âm đệm o, u và vần khó)', 
                  status: completedVol1Count >= 60 ? 'complete' : (completedVol1Count >= 35 ? 'in_progress' : 'locked'),
                  color: 'from-rose-500 to-purple-600',
                  target: 'Đọc lưu loát đoạn văn ngắn 20-30 chữ'
                },
                { 
                  step: 4, 
                  title: 'Chặng 4: 8 Chủ Điểm Đọc Hiểu', 
                  desc: 'Tập 2: Đọc hiểu truyện, thơ và trả lời câu hỏi', 
                  status: completedVol2Count >= 4 ? 'complete' : (completedVol1Count >= 60 ? 'in_progress' : 'locked'),
                  color: 'from-emerald-500 to-teal-600',
                  target: 'Đọc diễn cảm và hiểu nội dung bài học'
                }
              ].map(st => (
                <div 
                  key={st.step} 
                  className={`p-4 rounded-2xl border transition-all ${
                    st.status === 'complete' 
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : st.status === 'in_progress'
                      ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400'
                      : 'bg-slate-50 border-slate-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                      st.status === 'complete' ? 'bg-emerald-600 text-white' : st.status === 'in_progress' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      Chặng {st.step}
                    </span>
                    {st.status === 'complete' ? (
                      <span className="text-emerald-700 font-black flex items-center gap-1">✓ Đã đạt</span>
                    ) : st.status === 'in_progress' ? (
                      <span className="text-amber-700 font-black animate-pulse">⚡ Đang học</span>
                    ) : (
                      <span className="text-slate-400 font-medium">Chưa mở</span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{st.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{st.desc}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-slate-700 font-medium">
                    🎯 <span className="font-bold">Mục tiêu:</span> {st.target}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation for Parents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-3xl border border-orange-200 flex items-center justify-between">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-black rounded-xl">Tập 1: 83 Bài Âm - Vần</span>
                <h3 className="text-lg font-black text-orange-950 font-reading">Học Âm, Vần & Đánh Vần</h3>
                <p className="text-xs text-orange-800">Cùng con luyện nhận biết mặt chữ, ghép vần và dấu thanh.</p>
                <button
                  id="parent-go-vol1-btn"
                  onClick={onSelectVolume1}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Mở bài học Tập 1 →
                </button>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-orange-200 text-orange-700 flex items-center justify-center text-3xl shrink-0">
                📖
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-100 p-6 rounded-3xl border border-emerald-200 flex items-center justify-between">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-xl">Tập 2: 8 Chủ Điểm</span>
                <h3 className="text-lg font-black text-emerald-950 font-reading">Luyện Đọc Hiểu & Trả Lời Câu Hỏi</h3>
                <p className="text-xs text-emerald-800">Cùng con đọc thơ, truyện ngắn và rèn luyện tư duy ngôn ngữ.</p>
                <button
                  id="parent-go-vol2-btn"
                  onClick={onSelectVolume2}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Mở bài học Tập 2 →
                </button>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-200 text-emerald-700 flex items-center justify-center text-3xl shrink-0">
                📚
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CHILD'S VOICE RECORDINGS */}
      {activeTab === 'recordings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Mic className="w-6 h-6 text-rose-500" />
                <span>Sổ Tay Bản Thu Âm Giọng Đọc Của Con</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lưu giữ những khoảnh khắc đầu đời khi con tập đánh vần và đọc từng câu thơ, bài văn; xem lời nhận xét động viên từ cô giáo.
              </p>
            </div>

            <button
              id="parent-open-recorder-btn"
              onClick={onOpenVoiceStudio}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Mic className="w-4 h-4" />
              <span>Mở Phòng Thu Âm Cho Con</span>
            </button>
          </div>

          {recordings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-emerald-200 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-2xl">
                🎙️
              </div>
              <h3 className="text-lg font-bold text-slate-800">Con chưa có bản thu âm nào</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Bố Mẹ hãy mở bất kỳ bài đọc nào và bấm nút Micro 🎙️ "Luyện đọc cùng bé" để con thử sức tự thu âm giọng đọc và nhận sao thưởng nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recordings.map(rec => {
                return (
                  <div key={rec.id} className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs hover:shadow-md transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl text-xs font-black bg-orange-100 text-orange-950 border border-orange-200">
                        {rec.lessonTitle}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(rec.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(rec.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <div className="text-lg font-black text-slate-900 font-reading">
                      "{rec.targetText}"
                    </div>

                    {/* Audio Player */}
                    {rec.audioBlobUrl && (
                      <audio controls src={rec.audioBlobUrl} className="w-full h-10 mt-1" />
                    )}

                    {/* AI Feedback */}
                    {rec.feedback && (
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs flex items-center justify-between">
                        <span className="text-amber-900 font-medium">{rec.feedback.cheeringMessage}</span>
                        <span className="font-black text-amber-700 whitespace-nowrap">⭐ +{rec.feedback.starsEarned}</span>
                      </div>
                    )}

                    {/* Teacher Feedback if any */}
                    {rec.teacherComment && (
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-emerald-900">
                          <span>👩‍🏫 Lời nhận xét của Cô giáo:</span>
                          <span className="text-amber-600 font-black">{rec.teacherScore || 5} ⭐</span>
                        </div>
                        <p className="text-emerald-950 italic">"{rec.teacherComment}"</p>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => recordingStorageService.downloadRecording(rec)}
                        className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium"
                      >
                        <Download className="w-3.5 h-3.5" /> Lưu bản ghi âm về máy
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HANDBOOK & TEACHING METHODS */}
      {activeTab === 'handbook' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-500" />
                <span>Cẩm Nang Phương Pháp Đồng Hành Cùng Con Lớp 1</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tổng hợp các quy tắc chuẩn sư phạm theo bộ sách Kết Nối Tri Thức giúp Bố Mẹ hướng dẫn con tự tin, đúng chuẩn và không gây áp lực.
              </p>
            </div>

            {/* Handbook Sub-Nav */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t pt-3">
              {[
                { id: 'phonics_method', label: '1. Cách Đánh Vần Chuẩn KNTT', icon: '🔤' },
                { id: 'spelling_rules', label: '2. Các Quy Tắc Chính Tả Trọng Tâm', icon: '✍️' },
                { id: 'posture_grip', label: '3. Tư Thế Ngồi & Cách Cầm Bút', icon: '🪑' },
                { id: 'daily_routine', label: '4. Lộ Trình 15 Phút/Ngày', icon: '⏱️' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setHandbookTopic(item.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                    handbookTopic === item.id 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Content: Phonics Method */}
            {handbookTopic === 'phonics_method' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
                  <div className="font-black text-amber-900 text-base flex items-center gap-2">
                    <span>📌 Mô hình đánh vần: Âm đầu + Vần + Thanh</span>
                  </div>
                  <p>
                    Theo chương trình GDPT 2018 (SGK Kết nối tri thức), học sinh đánh vần theo thứ tự: <strong>Đọc âm đầu → Đọc vần → Ghép tiếng trơn → Thêm dấu thanh</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-xl border border-amber-200">
                      <div className="font-bold text-emerald-800">✅ Cách đánh vần chuẩn mới:</div>
                      <div className="mt-1 text-slate-700">
                        • <strong>bà:</strong> "bê - a - ba - huyền - bà" (hoặc "b - a - ba - huyền - bà")<br/>
                        • <strong>tiếng:</strong> "tờ - iêng - tiêng - sắc - tiếng"<br/>
                        • <strong>hoa:</strong> "hờ - oa - hoa"
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-rose-200">
                      <div className="font-bold text-rose-800">❌ Tránh cách đánh vần rườm rà:</div>
                      <div className="mt-1 text-slate-700">
                        • Không đánh vần tách rời từng chữ trong vần (ví dụ: không đánh vần <i>i - ê - ngờ - iêng</i> rồi mới <i>tờ - iêng - tiêng</i> vì sẽ làm trẻ nhanh quên âm đầu).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content: Spelling Rules */}
            {handbookTopic === 'spelling_rules' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs sm:text-sm">
                    <div className="font-black text-blue-900 text-sm">1. Quy tắc K / C</div>
                    <p className="text-blue-950">
                      • <strong>k</strong> chỉ đi với các nguyên âm: <strong>i, e, ê</strong> (kể, kim, kem...)<br/>
                      • <strong>c</strong> đi với các nguyên âm còn lại: <strong>a, o, ô, ơ, u, ư</strong> (ca, cô, cơ...)
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs sm:text-sm">
                    <div className="font-black text-emerald-900 text-sm">2. Quy tắc GH / G</div>
                    <p className="text-emerald-950">
                      • <strong>gh</strong> chỉ đi với: <strong>i, e, ê</strong> (ghi, ghế, ghẹ...)<br/>
                      • <strong>g</strong> đi với các nguyên âm còn lại: <strong>a, o, ô, ơ, u, ư</strong> (gà, gỗ, gấu...)
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2 text-xs sm:text-sm">
                    <div className="font-black text-purple-900 text-sm">3. Quy tắc NGH / NG</div>
                    <p className="text-purple-950">
                      • <strong>ngh</strong> chỉ đi với: <strong>i, e, ê</strong> (nghỉ, nghe, nghề...)<br/>
                      • <strong>ng</strong> đi với các nguyên âm còn lại: <strong>a, o, ô, ơ, u, ư</strong> (ngủ, ngô, ngà...)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content: Posture & Grip */}
            {handbookTopic === 'posture_grip' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                    <div className="font-black text-amber-900 text-sm flex items-center gap-2">
                      <span>🪑 Tư thế ngồi viết chuẩn y khoa</span>
                    </div>
                    <ul className="space-y-1.5 text-amber-950 list-disc list-inside">
                      <li>Lưng thẳng, cột sống không bị vẹo.</li>
                      <li>Ngực không tì vào mép bàn (cách mép bàn 1 nắm tay).</li>
                      <li>Khoảng cách từ mắt đến trang vở: <strong>25 - 30 cm</strong>.</li>
                      <li>Hai chân chạm sàn thoải mái, vuông góc với đùi.</li>
                      <li>Ánh sáng chiếu từ phía trước hoặc bên trái sang (với trẻ thuận tay phải).</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-2">
                    <div className="font-black text-teal-900 text-sm flex items-center gap-2">
                      <span>✍️ Quy tắc cầm bút 3 ngón</span>
                    </div>
                    <ul className="space-y-1.5 text-teal-950 list-disc list-inside">
                      <li>Cầm bút bằng 3 ngón: <strong>Ngón cái, ngón trỏ và ngón giữa</strong>.</li>
                      <li>Đầu ngón trỏ cách đầu ngòi bút khoảng <strong>2.5 cm</strong>.</li>
                      <li>Thân bút nghiêng về phía bên phải một góc khoảng 45 độ so với mặt giấy.</li>
                      <li>Không cầm bút quá chặt gây mỏi tay và nghẽn cơ tay của trẻ.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Content: Daily Routine */}
            {handbookTopic === 'daily_routine' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3 text-xs sm:text-sm">
                  <div className="font-black text-emerald-900 text-sm">
                    ⏱️ Khung Kế Hoạch 15 Phút Đồng Hành Cùng Con Mỗi Tối
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-bold text-orange-600">Phút 1 - 5 (Khởi động)</div>
                      <p className="text-slate-600">Ôn lại bảng chữ cái hoặc 2-3 âm vần của bài hôm trước qua trò chơi nhỏ.</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-600">Phút 6 - 12 (Luyện đọc)</div>
                      <p className="text-slate-600">Bấm nghe cô giáo đọc mẫu, sau đó cho con tự đọc lại và thu âm trên ứng dụng.</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-bold text-purple-600">Phút 13 - 15 (Khen thưởng)</div>
                      <p className="text-slate-600">Xem số sao đạt được, mở khóa huy hiệu và tặng lời khen động viên con.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 4: EYE CARE TIMER */}
      {activeTab === 'timer' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-emerald-100 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center text-3xl">
              ⏰
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">
                Đồng Hồ Hẹn Giờ Học & Bảo Vệ Mắt
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Quy tắc 20-20-20: Mỗi phiên học 15-20 phút, hãy cho bé nhìn xa và vận động nhẹ để bảo vệ đôi mắt sáng khỏe!
              </p>
            </div>

            {/* Timer Presets */}
            <div className="flex items-center justify-center gap-3">
              {[10, 15, 20, 25].map(mins => (
                <button
                  key={mins}
                  onClick={() => startTimer(mins)}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    timerMinutes === mins && !isTimerRunning
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mins} Phút
                </button>
              ))}
            </div>

            {/* Visual Clock Display */}
            <div className="py-6">
              <div className="text-6xl sm:text-7xl font-black text-slate-900 font-mono tracking-widest">
                {formatTimer(timerSecondsLeft)}
              </div>
              <div className="mt-4 max-w-xs mx-auto bg-slate-100 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, Math.min(100, (timerSecondsLeft / (timerMinutes * 60)) * 100))}%`
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                id="parent-timer-toggle-btn"
                onClick={toggleTimer}
                className={`px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base text-white shadow-lg transition-all active:scale-95 cursor-pointer ${
                  isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isTimerRunning ? 'Tạm Dừng' : (timerSecondsLeft < timerMinutes * 60 ? 'Tiếp Tục' : 'Bắt Đầu Học')}
              </button>

              <button
                id="parent-timer-reset-btn"
                onClick={resetTimer}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-all cursor-pointer"
              >
                Đặt Lại
              </button>
            </div>

            {timerFinished && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-emerald-950 text-sm font-bold animate-bounce">
                🎉 Hoan hô! Con đã hoàn thành phiên học xuất sắc! Giờ hãy đứng dậy uống nước và thư giãn mắt nhé!
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
