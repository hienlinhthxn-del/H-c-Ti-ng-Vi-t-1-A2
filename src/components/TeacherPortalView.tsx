import React, { useState, useEffect } from 'react';
import { 
  Volume1Lesson, 
  Volume2Lesson, 
  StudentRecording,
  TeacherAudioTarget 
} from '../types';
import { lessonStorageService } from '../services/lessonStorageService';
import { teacherAudioService, TeacherAudioItem } from '../services/teacherAudioService';
import { recordingStorageService } from '../services/recordingStorageService';
import { classAnalyticsService } from '../services/classAnalyticsService';
import { speechService } from '../services/speechService';
import { userProfileService } from '../services/userProfileService';
import { UserAvatar } from './UserAvatar';
import { ClassAnalyticsView } from './ClassAnalyticsView';
import { 
  BookOpen, 
  Mic, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  RotateCcw, 
  Play, 
  Square, 
  Trash2, 
  Download, 
  Upload, 
  Calendar, 
  Star, 
  MessageSquare, 
  Award, 
  Eye, 
  FileText, 
  Volume2, 
  Layers,
  ChevronRight,
  Filter,
  RefreshCw,
  Clock,
  HelpCircle,
  Users,
  BarChart2,
  Cloud,
  FileSpreadsheet
} from 'lucide-react';

interface TeacherPortalViewProps {
  onSelectVol1Lesson: (lesson: Volume1Lesson) => void;
  onSelectVol2Lesson: (lesson: Volume2Lesson) => void;
  onOpenVol1Editor: (lesson: Volume1Lesson) => void;
  onOpenVol2Editor: (lesson: Volume2Lesson) => void;
  onOpenTeacherRecorder: (target: TeacherAudioTarget) => void;
  onSwitchToStudentView: () => void;
  onOpenGoogleWorkspace?: () => void;
  onLogout?: () => void;
  onOpenTeacherLogin?: () => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({
  onSelectVol1Lesson,
  onSelectVol2Lesson,
  onOpenVol1Editor,
  onOpenVol2Editor,
  onOpenTeacherRecorder,
  onSwitchToStudentView,
  onOpenGoogleWorkspace,
  onLogout,
  onOpenTeacherLogin
}) => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'voice_studio' | 'class_analytics' | 'gradebook' | 'curriculum' | 'backup'>('class_analytics');
  
  // Lessons Management State
  const [lessonVolume, setLessonVolume] = useState<'vol1' | 'vol2'>('vol1');
  const [searchLessonQuery, setSearchLessonQuery] = useState<string>('');
  const [vol1Lessons, setVol1Lessons] = useState<Volume1Lesson[]>(() => lessonStorageService.getVolume1Lessons());
  const [vol2Lessons, setVol2Lessons] = useState<Volume2Lesson[]>(() => 
    lessonStorageService.getTopicGroups().flatMap(g => g.lessons)
  );
  const [filterCustomOnly, setFilterCustomOnly] = useState<boolean>(false);

  // Voice Studio State
  const [teacherAudios, setTeacherAudios] = useState<TeacherAudioItem[]>(() => teacherAudioService.getAllAudios());
  const [audioSearchQuery, setAudioSearchQuery] = useState<string>('');
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);
  const [isTeacherVoiceEnabled, setIsTeacherVoiceEnabled] = useState<boolean>(() => teacherAudioService.isPreferTeacherVoice());

  // Gradebook State
  const [recordings, setRecordings] = useState<StudentRecording[]>([]);
  const [loadingRecordings, setLoadingRecordings] = useState<boolean>(true);
  const [selectedRecording, setSelectedRecording] = useState<StudentRecording | null>(null);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewScore, setReviewScore] = useState<number>(5);
  const [savingReview, setSavingReview] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Curriculum State
  const [selectedTerm, setSelectedTerm] = useState<'term1' | 'term2'>('term1');

  // Load recordings
  const refreshRecordings = async () => {
    setLoadingRecordings(true);
    try {
      const list = await recordingStorageService.getAllRecordings();
      setRecordings(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRecordings(false);
    }
  };

  useEffect(() => {
    refreshRecordings();

    const unsubLessons = lessonStorageService.subscribe(() => {
      setVol1Lessons(lessonStorageService.getVolume1Lessons());
      setVol2Lessons(lessonStorageService.getTopicGroups().flatMap(g => g.lessons));
    });

    const unsubAudio = teacherAudioService.subscribe(() => {
      setTeacherAudios(teacherAudioService.getAllAudios());
      setIsTeacherVoiceEnabled(teacherAudioService.isPreferTeacherVoice());
    });

    const unsubRecs = recordingStorageService.subscribe(() => {
      refreshRecordings();
    });

    return () => {
      unsubLessons();
      unsubAudio();
      unsubRecs();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter lessons
  const filteredVol1 = vol1Lessons.filter(l => {
    if (filterCustomOnly && !lessonStorageService.isVolume1Customized(l.id)) return false;
    if (!searchLessonQuery.trim()) return true;
    const q = searchLessonQuery.toLowerCase().trim();
    return (
      l.title.toLowerCase().includes(q) ||
      l.lessonNumber.toString() === q ||
      l.part1_Letters.letters.some(letter => letter.toLowerCase().includes(q))
    );
  });

  const filteredVol2 = vol2Lessons.filter(l => {
    if (filterCustomOnly && !lessonStorageService.isVolume2Customized(l.id)) return false;
    if (!searchLessonQuery.trim()) return true;
    const q = searchLessonQuery.toLowerCase().trim();
    return (
      l.title.toLowerCase().includes(q) ||
      l.topicTitle.toLowerCase().includes(q) ||
      l.lessonNumber.toString() === q
    );
  });

  // Filter audios
  const filteredAudios = teacherAudios.filter(a => {
    if (!audioSearchQuery.trim()) return true;
    const q = audioSearchQuery.toLowerCase().trim();
    return a.text.toLowerCase().includes(q) || (a.teacherName && a.teacherName.toLowerCase().includes(q));
  });

  // Audio actions
  const handlePlayAudio = (text: string) => {
    if (playingAudioKey === text) {
      teacherAudioService.stopCurrentAudio();
      setPlayingAudioKey(null);
      return;
    }
    setPlayingAudioKey(text);
    teacherAudioService.playAudio(text, () => {
      setPlayingAudioKey(null);
    });
  };

  const handleDeleteAudio = (text: string) => {
    if (window.confirm(`Xoá giọng đọc mẫu của từ "${text}"?`)) {
      teacherAudioService.deleteAudioByText(text);
      showToast('Đã xoá bản thu âm');
    }
  };

  // Review submission
  const handleSaveReview = async (rec: StudentRecording) => {
    setSavingReview(true);
    try {
      await recordingStorageService.updateTeacherReview(rec.id, reviewComment, reviewScore);
      showToast('Đã lưu nhận xét và gửi điểm cho học sinh!');
      await refreshRecordings();
      setSelectedRecording(null);
      setReviewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingReview(false);
    }
  };

  const handleResetVol1Lesson = (lessonId: number) => {
    if (window.confirm('Khôi phục bài học này về nội dung gốc chuẩn Bộ GD&ĐT?')) {
      lessonStorageService.resetVolume1Lesson(lessonId);
      showToast('Đã khôi phục bài học gốc!');
    }
  };

  const handleResetVol2Lesson = (lessonId: number) => {
    if (window.confirm('Khôi phục bài học này về nội dung gốc chuẩn Bộ GD&ĐT?')) {
      lessonStorageService.resetVolume2Lesson(lessonId);
      showToast('Đã khôi phục bài học gốc!');
    }
  };

  // Export / Import
  const handleExportData = () => {
    const json = lessonStorageService.exportAllToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Giao_an_Tieng_Viet_1_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất tệp giáo án thành công!');
  };

  const handleExportTeacherAudio = () => {
    const json = teacherAudioService.exportToJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Goi_Giong_Doc_Mau_GV_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất gói âm thanh giọng đọc mẫu!');
  };

  const stats = lessonStorageService.getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Banner Header for Teachers */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-100 border border-white/20">
                <span>👩‍🏫 Cổng Giáo Viên • Chuyên Môn Khối 1</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md text-xs font-bold text-emerald-100 border border-emerald-300/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Đã xác thực bảo mật</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3.5 bg-white/15 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/25 w-fit">
              <div className="w-12 h-12 rounded-2xl bg-white/20 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
                <UserAvatar 
                  avatar={userProfileService.getUsersByRole('teacher')[0]?.avatar} 
                  name={userProfileService.getUsersByRole('teacher')[0]?.name || 'Cô Hiền Phan'} 
                  size="lg" 
                />
              </div>
              <div>
                <div className="text-xs text-amber-200 font-bold uppercase tracking-wider">Giáo viên chủ nhiệm</div>
                <div className="text-base sm:text-lg font-black text-white">
                  {userProfileService.getUsersByRole('teacher')[0]?.name || 'Cô Hiền Phan'}
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-reading">
              Không Gian Dạy Học & Biên Soạn Giáo Án
            </h1>
            <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed">
              Dành riêng cho Thầy Cô: Soạn bài học theo SGK Kết nối tri thức, thu âm giọng đọc mẫu chuẩn thay thế giọng AI, chấm bài đọc của học sinh và tra cứu phân phối chương trình.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenGoogleWorkspace && (
              <button
                id="teacher-open-google-workspace-btn"
                onClick={onOpenGoogleWorkspace}
                className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg border border-emerald-300/40 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-white" />
                <span>Google Workspace</span>
              </button>
            )}

            {onOpenTeacherLogin && (
              <button
                id="teacher-change-pin-btn"
                onClick={onOpenTeacherLogin}
                className="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/30 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Đổi mã PIN / Mật khẩu Giáo Viên"
              >
                <span>🔑</span>
                <span>Đổi PIN</span>
              </button>
            )}

            {onLogout && (
              <button
                id="teacher-logout-portal-btn"
                onClick={onLogout}
                className="px-3.5 py-2.5 bg-black/30 hover:bg-black/50 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/30 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Đăng xuất và khóa Cổng Giáo Viên"
              >
                <span>🔒</span>
                <span>Khóa / Đăng Xuất</span>
              </button>
            )}

            <button
              id="teacher-switch-student-mode-btn"
              onClick={onSwitchToStudentView}
              className="px-3.5 py-2.5 bg-white text-orange-700 hover:bg-orange-50 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-orange-600" />
              <span>Xem Giao Diện HS</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-amber-200 font-medium">Học sinh lớp</div>
            <div className="text-2xl font-black text-white mt-1">{classAnalyticsService.getStudentsByClass().length} HS</div>
            <div className="text-[11px] text-amber-100">Tiến độ TB: {classAnalyticsService.getClassAnalyticsSummary().averageCompletionRate}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-amber-200 font-medium">Giáo án Tập 1 & 2</div>
            <div className="text-2xl font-black text-white mt-1">91 Bài</div>
            <div className="text-[11px] text-amber-100">83 bài T1 + 8 chủ điểm T2</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-amber-200 font-medium">Bài đã tùy biến</div>
            <div className="text-2xl font-black text-white mt-1">{stats.totalCustomCount} Bài</div>
            <div className="text-[11px] text-amber-100">{stats.vol1CustomCount} T1 • {stats.vol2CustomCount} T2</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <div className="text-xs text-amber-200 font-medium">Giọng đọc mẫu GV</div>
            <div className="text-2xl font-black text-white mt-1">{teacherAudios.length} Bản</div>
            <div className="text-[11px] text-amber-100">{isTeacherVoiceEnabled ? 'Đang bật ưu tiên' : 'Đang tắt'}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 col-span-2 sm:col-span-1">
            <div className="text-xs text-amber-200 font-medium">Bài đọc HS đã nộp</div>
            <div className="text-2xl font-black text-white mt-1">{recordings.length} Bài</div>
            <div className="text-[11px] text-amber-100">{recordings.filter(r => r.teacherComment).length} bài đã chấm</div>
          </div>
        </div>
      </div>

      {/* Main Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-amber-200">
        <button
          id="teacher-tab-lessons-btn"
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'lessons'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Quản lý & Soạn Giáo Án</span>
          {stats.totalCustomCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold">
              {stats.totalCustomCount}
            </span>
          )}
        </button>

        <button
          id="teacher-tab-voice-btn"
          onClick={() => setActiveTab('voice_studio')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'voice_studio'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>2. Studio Thu Giọng Đọc Mẫu</span>
          {teacherAudios.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
              {teacherAudios.length}
            </span>
          )}
        </button>

        <button
          id="teacher-tab-class-analytics-btn"
          onClick={() => setActiveTab('class_analytics')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'class_analytics'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-orange-500" />
          <span>3. Thống Kê Học Sinh Của Lớp</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-500 text-white font-bold">
            {classAnalyticsService.getStudentsByClass().length} HS
          </span>
        </button>

        <button
          id="teacher-tab-gradebook-btn"
          onClick={() => setActiveTab('gradebook')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'gradebook'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Sổ Chấm & Nhận Xét Bài Đọc HS</span>
          {recordings.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
              {recordings.length}
            </span>
          )}
        </button>

        <button
          id="teacher-tab-curriculum-btn"
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>5. Phân Phối Chương Trình 35 Tuần</span>
        </button>

        <button
          id="teacher-tab-backup-btn"
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>6. Sao Lưu & Đồng Bộ</span>
        </button>
      </div>

      {/* TAB 1: LESSONS MANAGEMENT */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex p-1 bg-amber-100/70 rounded-2xl">
                <button
                  id="teacher-vol1-toggle-btn"
                  onClick={() => setLessonVolume('vol1')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    lessonVolume === 'vol1' ? 'bg-orange-500 text-white shadow-xs' : 'text-amber-900 hover:text-orange-950'
                  }`}
                >
                  Tập 1: 83 Bài Âm - Vần
                </button>
                <button
                  id="teacher-vol2-toggle-btn"
                  onClick={() => setLessonVolume('vol2')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    lessonVolume === 'vol2' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-950 hover:text-emerald-950'
                  }`}
                >
                  Tập 2: 8 Chủ Điểm
                </button>
              </div>

              <button
                id="filter-custom-lessons-btn"
                onClick={() => setFilterCustomOnly(!filterCustomOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterCustomOnly 
                    ? 'bg-amber-500 text-white border-amber-600' 
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Chỉ hiện bài đã sửa ({stats.totalCustomCount})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input
                id="teacher-search-lessons"
                type="text"
                value={searchLessonQuery}
                onChange={(e) => setSearchLessonQuery(e.target.value)}
                placeholder="Tìm số bài, tên bài, âm chữ..."
                className="w-full pl-10 pr-4 py-2 bg-amber-50/50 hover:bg-amber-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Lessons Grid (Volume 1) */}
          {lessonVolume === 'vol1' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVol1.map(lesson => {
                const isCustom = lessonStorageService.isVolume1Customized(lesson.id);
                return (
                  <div 
                    key={lesson.id} 
                    className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                      isCustom ? 'border-orange-300 bg-orange-50/20' : 'border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-orange-100 text-orange-900 border border-orange-200">
                          Bài {lesson.lessonNumber}
                        </span>
                        {isCustom ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Đã biên soạn
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Chuẩn SGK
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-slate-900 font-reading">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          Âm vần: {lesson.part1_Letters.letters.join(', ')} • {lesson.part2_SyllablesAndWords.words.length} từ mẫu
                        </p>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900 font-medium">
                        <span className="font-bold">Đoạn đọc mẫu:</span> "{lesson.part3_SentenceAndPractice.readingPassage.slice(0, 45)}..."
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`teacher-edit-vol1-${lesson.id}`}
                          onClick={() => onOpenVol1Editor(lesson)}
                          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Soạn bài</span>
                        </button>
                        <button
                          id={`teacher-view-vol1-${lesson.id}`}
                          onClick={() => onSelectVol1Lesson(lesson)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem bài</span>
                        </button>
                      </div>

                      {isCustom && (
                        <button
                          id={`teacher-reset-vol1-${lesson.id}`}
                          onClick={() => handleResetVol1Lesson(lesson.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Khôi phục nội dung gốc"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lessons Grid (Volume 2) */}
          {lessonVolume === 'vol2' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVol2.map(lesson => {
                const isCustom = lessonStorageService.isVolume2Customized(lesson.id);
                return (
                  <div 
                    key={lesson.id} 
                    className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md flex flex-col justify-between ${
                      isCustom ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                          Chủ điểm: {lesson.topicTitle}
                        </span>
                        {isCustom ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Đã biên soạn
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Chuẩn SGK
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-slate-900 font-reading">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {lesson.reading.type === 'poem' ? '📝 Thơ' : '📖 Đoạn văn'} • {lesson.comprehensionQuestions.length} câu hỏi đọc hiểu
                        </p>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 font-medium">
                        <span className="font-bold">Đoạn trích:</span> "{lesson.reading.content[0]?.slice(0, 45)}..."
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`teacher-edit-vol2-${lesson.id}`}
                          onClick={() => onOpenVol2Editor(lesson)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Soạn bài</span>
                        </button>
                        <button
                          id={`teacher-view-vol2-${lesson.id}`}
                          onClick={() => onSelectVol2Lesson(lesson)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem bài</span>
                        </button>
                      </div>

                      {isCustom && (
                        <button
                          id={`teacher-reset-vol2-${lesson.id}`}
                          onClick={() => handleResetVol2Lesson(lesson.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Khôi phục nội dung gốc"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEACHER VOICE STUDIO */}
      {activeTab === 'voice_studio' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Mic className="w-6 h-6 text-orange-500" />
                  <span>Studio Thu Giọng Đọc Mẫu Của Thầy Cô</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Khi bật chế độ này, học sinh bấm nghe đọc ở bất kỳ bài nào sẽ được nghe trực tiếp giọng đọc ấm áp của giáo viên thay vì giọng đọc máy.
                </p>
              </div>

              {/* Master Voice Switch */}
              <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="text-xs font-bold text-amber-950">Ưu tiên giọng Thầy Cô:</span>
                <button
                  id="teacher-voice-toggle-btn"
                  onClick={() => {
                    const next = !isTeacherVoiceEnabled;
                    teacherAudioService.setPreferTeacherVoice(next);
                    setIsTeacherVoiceEnabled(next);
                    showToast(next ? 'Đã bật ưu tiên giọng đọc Thầy Cô!' : 'Đã chuyển về giọng đọc AI!');
                  }}
                  className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    isTeacherVoiceEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                </button>
              </div>
            </div>

            {/* Search Audio Box */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <input
                  id="teacher-search-audio"
                  type="text"
                  value={audioSearchQuery}
                  onChange={(e) => setAudioSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm từ, câu, âm vần đã thu âm..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                id="teacher-quick-record-btn"
                onClick={() => onOpenTeacherRecorder({
                  text: 'A',
                  displayTitle: 'Thu âm mẫu chữ A',
                  section: 'letter'
                })}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>+ Thu âm nội dung mới</span>
              </button>
            </div>
          </div>

          {/* Audio Cards */}
          {filteredAudios.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-amber-200 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-2xl">
                🎙️
              </div>
              <h3 className="text-lg font-bold text-slate-800">Chưa có bản thu âm giọng mẫu nào</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Thầy cô hãy bấm vào biểu tượng Micro bên cạnh từng chữ cái, từ ngữ hoặc câu văn trong bài học để bắt đầu thu âm giọng đọc mẫu cho học sinh nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAudios.map(audio => {
                const isPlaying = playingAudioKey === audio.text;
                return (
                  <div key={audio.id} className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {audio.section || 'Mục đọc'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(audio.updatedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>

                      <div className="text-2xl font-black text-slate-900 font-reading py-1">
                        "{audio.text}"
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span>Cô giáo:</span>
                        <span className="font-bold text-amber-900">{audio.teacherName || 'Cô giáo'}</span>
                        {audio.lessonTitle && <span>• {audio.lessonTitle}</span>}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          id={`play-teacher-audio-${audio.id}`}
                          onClick={() => handlePlayAudio(audio.text)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isPlaying 
                              ? 'bg-rose-500 text-white animate-pulse' 
                              : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                          }`}
                        >
                          {isPlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-amber-950" />}
                          <span>{isPlaying ? 'Dừng' : 'Nghe thử'}</span>
                        </button>

                        <button
                          id={`re-record-teacher-audio-${audio.id}`}
                          onClick={() => onOpenTeacherRecorder({
                            text: audio.text,
                            displayTitle: `Ghi đè: ${audio.text}`,
                            section: audio.section
                          })}
                          className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                          title="Thu âm lại"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        id={`delete-teacher-audio-${audio.id}`}
                        onClick={() => handleDeleteAudio(audio.text)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Xoá giọng đọc mẫu này"
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

      {/* TAB 2: VOICE STUDIO (giữ nguyên) */}

      {/* TAB 3: CLASS & STUDENT LEARNING ANALYTICS */}
      {activeTab === 'class_analytics' && (
        <ClassAnalyticsView 
          onSelectVol1Lesson={(lessonNum) => {
            const l = vol1Lessons.find(item => item.lessonNumber === lessonNum);
            if (l) onSelectVol1Lesson(l);
          }}
          onSelectVol2Lesson={(lessonNum) => {
            const l = vol2Lessons.find(item => item.lessonNumber === lessonNum);
            if (l) onSelectVol2Lesson(l);
          }}
        />
      )}

      {/* TAB 4: GRADEBOOK & STUDENT RECORDINGS REVIEW */}
      {activeTab === 'gradebook' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                <span>Sổ Chấm Bài & Lời Nhận Xét Của Giáo Viên</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Nghe lại bài đọc của học sinh đã nộp từ phòng thu âm, chấm điểm và để lại lời khen gửi đến học sinh và phụ huynh.
              </p>
            </div>

            <button
              id="refresh-recordings-btn"
              onClick={refreshRecordings}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 border border-amber-200 transition-all cursor-pointer self-start md:self-auto"
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>Làm mới danh sách</span>
            </button>
          </div>

          {loadingRecordings ? (
            <div className="p-12 text-center text-slate-500">Đang tải danh sách bài nộp của học sinh...</div>
          ) : recordings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-amber-200 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-2xl">
                📝
              </div>
              <h3 className="text-lg font-bold text-slate-800">Chưa có bài đọc nào được học sinh nộp</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Khi học sinh luyện đọc và lưu bài ghi âm trong "Phòng Thu Âm của Bé", bài nộp sẽ tự động hiển thị ở đây để Thầy Cô chấm điểm và gửi lời khen!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recordings List (Left 2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                {recordings.map(rec => {
                  const isSelected = selectedRecording?.id === rec.id;
                  return (
                    <div 
                      key={rec.id} 
                      className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md ${
                        isSelected ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/10' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl text-xs font-black bg-orange-100 text-orange-950 border border-orange-200">
                              {rec.lessonTitle}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(rec.createdAt).toLocaleTimeString('vi-VN')} • {new Date(rec.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className="text-lg font-black text-slate-900 font-reading mt-2">
                            "{rec.targetText}"
                          </div>
                        </div>

                        {/* Player / Audio control */}
                        {rec.audioBlobUrl && (
                          <audio 
                            controls 
                            src={rec.audioBlobUrl} 
                            className="h-10 w-full sm:w-60"
                          />
                        )}
                      </div>

                      {/* AI Evaluation */}
                      {rec.feedback && (
                        <div className="mt-3 p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-xs flex items-center justify-between">
                          <span className="text-amber-900 font-medium">{rec.feedback.cheeringMessage}</span>
                          <span className="font-black text-amber-700 flex items-center gap-1">
                            ⭐ +{rec.feedback.starsEarned} Sao
                          </span>
                        </div>
                      )}

                      {/* Teacher Existing Review */}
                      {rec.teacherComment && (
                        <div className="mt-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-emerald-900">
                            <span>👩‍🏫 Lời nhận xét của Cô giáo:</span>
                            <span className="text-amber-600 font-black">{rec.teacherScore || 5} ⭐</span>
                          </div>
                          <p className="text-emerald-950 italic">"{rec.teacherComment}"</p>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          id={`review-rec-btn-${rec.id}`}
                          onClick={() => {
                            setSelectedRecording(rec);
                            setReviewComment(rec.teacherComment || '');
                            setReviewScore(rec.teacherScore || 5);
                          }}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{rec.teacherComment ? 'Sửa nhận xét' : 'Chấm điểm & Nhận xét'}</span>
                        </button>

                        <button
                          id={`download-rec-${rec.id}`}
                          onClick={() => recordingStorageService.downloadRecording(rec)}
                          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Tải file ghi âm
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Review Sidebar Form (Right 1 col) */}
              <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm h-fit sticky top-24 space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span>Bảng Chấm & Nhận Xét Bài</span>
                </h3>

                {selectedRecording ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 text-xs space-y-1">
                      <div className="font-bold text-amber-900">{selectedRecording.lessonTitle}</div>
                      <div className="text-slate-700 italic">"{selectedRecording.targetText}"</div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Chấm điểm / Đánh giá sao:
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setReviewScore(num)}
                            className={`p-2 rounded-xl border text-base transition-all ${
                              reviewScore >= num 
                                ? 'bg-amber-400 border-amber-500 text-amber-950 scale-105' 
                                : 'bg-slate-100 border-slate-200 text-slate-400'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Lời khen & Nhận xét của Cô giáo:
                      </label>
                      <textarea
                        rows={4}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="VD: Cô khen con đọc rất to, rõ ràng, ngắt nghỉ đúng dấu chấm. Chăm chỉ phát huy nhé!..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="save-teacher-review-btn"
                        disabled={savingReview || !reviewComment.trim()}
                        onClick={() => handleSaveReview(selectedRecording)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {savingReview ? 'Đang lưu...' : 'Gửi Nhận Xét'}
                      </button>
                      <button
                        onClick={() => setSelectedRecording(null)}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                    <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
                    <p>Hãy bấm nút "Chấm điểm & Nhận xét" trên bất kỳ bài nộp nào của học sinh để gửi lời khen đến bé và phụ huynh.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CURRICULUM & 35 WEEKS SYLLABUS */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-amber-600" />
                  <span>Phân Phối Chương Trình 35 Tuần Môn Tiếng Việt Lớp 1</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Khung kế hoạch bài dạy chuẩn theo Bộ Sách "Kết Nối Tri Thức Với Cuộc Sống" (12 tiết / tuần).
                </p>
              </div>

              <div className="inline-flex p-1 bg-amber-100/70 rounded-2xl self-start sm:self-auto">
                <button
                  id="term1-syllabus-btn"
                  onClick={() => setSelectedTerm('term1')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    selectedTerm === 'term1' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-900'
                  }`}
                >
                  Học Kỳ 1 (Tuần 1 - 18)
                </button>
                <button
                  id="term2-syllabus-btn"
                  onClick={() => setSelectedTerm('term2')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    selectedTerm === 'term2' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-950'
                  }`}
                >
                  Học Kỳ 2 (Tuần 19 - 35)
                </button>
              </div>
            </div>

            {/* Term 1 Details */}
            {selectedTerm === 'term1' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs sm:text-sm text-orange-950 space-y-1">
                  <div className="font-black text-orange-900 flex items-center gap-2">
                    <span>📌 Trọng Tâm Học Kỳ 1: Giai Đoạn Học Âm Chữ & Ghép Vần</span>
                  </div>
                  <p>
                    Học sinh học 83 bài học Âm - Vần (Tập 1), nhận biết mặt chữ cái, cách ghép âm đầu với vần và dấu thanh, luyện viết ô ly 2 li, đọc trơn câu ngắn và bước đầu kể chuyện theo tranh.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-500 text-white font-black text-xs">
                        <th className="p-3 rounded-tl-xl">Tuần</th>
                        <th className="p-3">Bài học trong tuần</th>
                        <th className="p-3">Âm / Vần trọng tâm</th>
                        <th className="p-3">Mục tiêu Đọc & Viết</th>
                        <th className="p-3 rounded-tr-xl">Luyện nói & Kể chuyện</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 border border-amber-200">
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-bold text-amber-900">Tuần 1 - 2</td>
                        <td className="p-3">Bài mở đầu & Bài 1 đến 8</td>
                        <td className="p-3 font-medium">A a, B b, C c, D d, Đ đ, E e, Ê ê, G g, H h, I i, K k</td>
                        <td className="p-3 text-slate-600">Làm quen các nét cơ bản, đọc các âm đầu đơn giản, viết chữ cỡ vừa.</td>
                        <td className="p-3 text-slate-600">Chào hỏi, giới thiệu bản thân trước lớp.</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-bold text-amber-900">Tuần 3 - 6</td>
                        <td className="p-3">Bài 9 đến 28</td>
                        <td className="p-3 font-medium">L, M, N, O, Ô, Ơ, P, Q, R, S, T, U, Ư, V, X, Y và các âm ghép ch, gh, kh, nh, ng, ngh, ph, qu, th, tr</td>
                        <td className="p-3 text-slate-600">Quy tắc chính tả k/gh/ngh, đánh vần tiếng có dấu thanh (sắc, huyền, hỏi, ngã, nặng).</td>
                        <td className="p-3 text-slate-600">Kể chuyện: Chú đỗ con, Ba cô gái.</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-bold text-amber-900">Tuần 7 - 12</td>
                        <td className="p-3">Bài 29 đến 56</td>
                        <td className="p-3 font-medium">Vần có âm cuối n, m, p, t, c, ch (an, at, am, ap, ac, ach...)</td>
                        <td className="p-3 text-slate-600">Đọc trơn câu 5-7 chữ, đọc đoạn văn ngắn 2-3 câu, viết chính tả cụm từ.</td>
                        <td className="p-3 text-slate-600">Nói về đồ chơi yêu thích, người thân trong gia đình.</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50">
                        <td className="p-3 font-bold text-amber-900">Tuần 13 - 17</td>
                        <td className="p-3">Bài 57 đến 83</td>
                        <td className="p-3 font-medium">Vần có âm đệm o, u (oa, oe, uê, uơ, oang, oac, uy, uyn...)</td>
                        <td className="p-3 text-slate-600">Đọc lưu loát đoạn văn 20-30 tiếng, ngắt nghỉ đúng dấu phẩy, dấu chấm.</td>
                        <td className="p-3 text-slate-600">Kể chuyện tranh hoàn chỉnh, đóng vai nhân vật.</td>
                      </tr>
                      <tr className="hover:bg-amber-50/50 bg-amber-50/80">
                        <td className="p-3 font-black text-orange-900">Tuần 18</td>
                        <td className="p-3 font-bold" colSpan={4}>Ôn tập Cuối Học Kỳ 1 & Đánh giá năng lực đọc viết</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Term 2 Details */}
            {selectedTerm === 'term2' && (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1">
                  <div className="font-black text-emerald-900 flex items-center gap-2">
                    <span>📌 Trọng Tâm Học Kỳ 2: 8 Chủ Điểm Luyện Đọc Hiểu & Mở Rộng Vốn Từ</span>
                  </div>
                  <p>
                    Học sinh chuyển sang đọc các văn bản hoàn chỉnh (văn xuôi, bài thơ ngắn 50-80 tiếng), trả lời câu hỏi đọc hiểu, viết câu sáng tạo và phát triển năng lực giao tiếp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 1, title: 'Tôi là học sinh', weeks: 'Tuần 19 - 20', desc: 'Trường lớp, bạn bè, thầy cô giáo' },
                    { id: 2, title: 'Mái ấm gia đình', weeks: 'Tuần 21 - 22', desc: 'Tình cảm gia đình, ông bà, cha mẹ' },
                    { id: 3, title: 'Bạn bè bốn phương', weeks: 'Tuần 23 - 24', desc: 'Tình bạn bè, giúp đỡ lẫn nhau' },
                    { id: 4, title: 'Thiên nhiên kì thú', weeks: 'Tuần 25 - 26', desc: 'Thời tiết, cây cối, bốn mùa' },
                    { id: 5, title: 'Thế giới động vật', weeks: 'Tuần 27 - 28', desc: 'Các loài thú cưng, chim muông' },
                    { id: 6, title: 'Cuộc sống quanh em', weeks: 'Tuần 29 - 30', desc: 'Làng xóm, phố phường, nghề nghiệp' },
                    { id: 7, title: 'Đất nước muôn màu', weeks: 'Tuần 31 - 32', desc: 'Cảnh đẹp quê hương, Thủ đô Hà Nội' },
                    { id: 8, title: 'Bác Hồ kính yêu', weeks: 'Tuần 33 - 34', desc: 'Bác Hồ với thiếu nhi và bài học làm theo Bác' },
                  ].map(t => (
                    <div key={t.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <div className="text-[10px] font-black text-emerald-700">{t.weeks}</div>
                      <div className="text-sm font-black text-slate-900">Chủ điểm {t.id}: {t.title}</div>
                      <p className="text-xs text-slate-500">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: BACKUP & SHARE */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Export Card */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Xuất Dữ Liệu Giáo Án & Âm Thanh</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Lưu trữ toàn bộ nội dung bài học đã soạn và các bản thu âm giọng đọc mẫu của cô giáo thành tệp dự phòng.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  id="teacher-export-lessons-btn"
                  onClick={handleExportData}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất Tệp Giáo Án Đã Soạn (.JSON)</span>
                </button>

                <button
                  id="teacher-export-audio-btn"
                  onClick={handleExportTeacherAudio}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Xuất Gói Giọng Đọc Mẫu Thầy Cô (.JSON)</span>
                </button>
              </div>
            </div>

            {/* Reset Defaults Card */}
            <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Khôi Phục Chuẩn Ban Đầu</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Đưa toàn bộ nội dung Tập 1 và Tập 2 về chuẩn gốc của Nhà xuất bản Giáo dục Việt Nam (Bộ Kết Nối Tri Thức).
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="teacher-reset-all-lessons-btn"
                  onClick={() => {
                    if (window.confirm('Bạn có chắc muốn khôi phục TẤT CẢ các bài học về nội dung gốc chuẩn SGK?')) {
                      lessonStorageService.resetAllLessons();
                      showToast('Đã khôi phục toàn bộ bài học về mặc định!');
                    }
                  }}
                  className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Khôi Phục Toàn Bộ Về Mặc Định Chuẩn</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
