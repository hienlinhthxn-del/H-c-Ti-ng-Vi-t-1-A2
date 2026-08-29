import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  ClassRoom, 
  ClassAnalyticsSummary, 
  StudentStatus,
  StudentCompletedLesson
} from '../types';
import { classAnalyticsService } from '../services/classAnalyticsService';
import { userProfileService } from '../services/userProfileService';
import { speechService } from '../services/speechService';
import { UserAvatar } from './UserAvatar';
import { 
  Users, 
  BookOpen, 
  Mic, 
  PenTool, 
  Star, 
  Award, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  UserPlus, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  X, 
  Save, 
  Eye, 
  BarChart2, 
  Grid, 
  Trophy, 
  Layers,
  ArrowUpDown,
  RotateCcw,
  Check,
  CheckSquare
} from 'lucide-react';

interface ClassAnalyticsViewProps {
  onSelectVol1Lesson?: (lessonNumber: number) => void;
  onSelectVol2Lesson?: (lessonNumber: number) => void;
}

export const ClassAnalyticsView: React.FC<ClassAnalyticsViewProps> = () => {
  const [classes, setClasses] = useState<ClassRoom[]>(() => classAnalyticsService.getAllClasses());
  const [currentClassId, setCurrentClassId] = useState<string>(() => classAnalyticsService.getCurrentClassId());
  const [students, setStudents] = useState<StudentProfile[]>(() => classAnalyticsService.getStudentsByClass(currentClassId));
  const [summary, setSummary] = useState<ClassAnalyticsSummary>(() => classAnalyticsService.getClassAnalyticsSummary(currentClassId));
  
  // Navigation subtabs inside Analytics
  const [subTab, setSubTab] = useState<'roster' | 'matrix' | 'leaderboard' | 'needs_support'>('roster');
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | StudentStatus>('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'progress' | 'stars' | 'recs'>('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Matrix Tab state
  const [matrixVolume, setMatrixVolume] = useState<'vol1' | 'vol2'>('vol1');
  const [selectedMatrixLesson, setSelectedMatrixLesson] = useState<{
    lessonNumber: number;
    lessonKey: string;
    completedStudents: string[];
    completedCount: number;
    completionRate: number;
  } | null>(null);

  // Modals
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<StudentProfile | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(false);
  const [isBatchLessonModalOpen, setIsBatchLessonModalOpen] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    studentCode: string;
    gender: 'male' | 'female';
    status: StudentStatus;
    teacherNotes: string;
    dob: string;
  }>({
    name: '',
    studentCode: '',
    gender: 'male',
    status: 'good',
    teacherNotes: '',
    dob: '2018-01-01'
  });

  const [batchLessonNum, setBatchLessonNum] = useState<number>(1);
  const [batchVolume, setBatchVolume] = useState<'vol1' | 'vol2'>('vol1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reload data
  const refreshData = () => {
    const clsList = classAnalyticsService.getAllClasses();
    setClasses(clsList);
    const currId = classAnalyticsService.getCurrentClassId();
    setCurrentClassId(currId);
    setStudents(classAnalyticsService.getStudentsByClass(currId));
    setSummary(classAnalyticsService.getClassAnalyticsSummary(currId));
  };

  useEffect(() => {
    const unsub = classAnalyticsService.subscribe(() => {
      refreshData();
    });
    return unsub;
  }, []);

  const handleSwitchClass = (classId: string) => {
    classAnalyticsService.setCurrentClassId(classId);
    setCurrentClassId(classId);
    setStudents(classAnalyticsService.getStudentsByClass(classId));
    setSummary(classAnalyticsService.getClassAnalyticsSummary(classId));
    speechService.playSoundEffect('pop');
  };

  const currentClass = classes.find(c => c.id === currentClassId) || classes[0];

  // Filter and sort students
  const filteredStudents = students.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return s.name.toLowerCase().includes(q) || s.studentCode.toLowerCase().includes(q);
  }).sort((a, b) => {
    let comp = 0;
    if (sortBy === 'code') comp = a.studentCode.localeCompare(b.studentCode);
    else if (sortBy === 'name') comp = a.name.localeCompare(b.name, 'vi');
    else if (sortBy === 'progress') comp = a.completedLessons.length - b.completedLessons.length;
    else if (sortBy === 'stars') comp = a.starsCount - b.starsCount;
    else if (sortBy === 'recs') comp = a.recordingsCount - b.recordingsCount;
    return sortOrder === 'desc' ? -comp : comp;
  });

  // Export CSV
  const handleExportCsv = () => {
    const csvContent = classAnalyticsService.exportClassCsv(currentClassId);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Theo_Doi_Hoc_Tap_${currentClass?.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất file báo cáo lớp ${currentClass?.name}!`);
  };

  // Matrix data
  const matrixData = classAnalyticsService.getLessonCompletionMatrix(currentClassId, matrixVolume, matrixVolume === 'vol1' ? 83 : 8);

  // Status badge helper
  const getStatusBadge = (status: StudentStatus, completedCount?: number) => {
    if (completedCount === 0) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">🌱 Mới bắt đầu</span>;
    }
    switch (status) {
      case 'excellent':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">⭐ Xuất sắc</span>;
      case 'good':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">👍 Khá - Tốt</span>;
      case 'average':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-900 border border-sky-300">🌱 Đạt yêu cầu</span>;
      case 'needs_support':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">🆘 Cần hỗ trợ</span>;
    }
  };

  // Add student submit
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const nextNum = students.length + 1;
    const code = formData.studentCode.trim() || `HS${nextNum < 10 ? '0' + nextNum : nextNum}`;
    
    classAnalyticsService.addStudent({
      name: formData.name.trim(),
      studentCode: code,
      gender: formData.gender,
      classId: currentClassId,
      avatar: formData.gender === 'female' ? '👧' : '👦',
      dob: formData.dob,
      status: formData.status,
      teacherNotes: formData.teacherNotes
    });

    setIsAddStudentOpen(false);
    setFormData({
      name: '',
      studentCode: '',
      gender: 'male',
      status: 'good',
      teacherNotes: '',
      dob: '2018-01-01'
    });
    showToast('Đã thêm học sinh mới vào lớp!');
  };

  // Edit student submit
  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentDetail) return;

    classAnalyticsService.updateStudent(selectedStudentDetail.id, {
      name: formData.name.trim(),
      studentCode: formData.studentCode.trim(),
      gender: formData.gender,
      status: formData.status,
      teacherNotes: formData.teacherNotes,
      dob: formData.dob
    });

    setIsEditStudentOpen(false);
    setSelectedStudentDetail(prev => prev ? {
      ...prev,
      name: formData.name.trim(),
      studentCode: formData.studentCode.trim(),
      gender: formData.gender,
      status: formData.status,
      teacherNotes: formData.teacherNotes,
      dob: formData.dob
    } : null);

    showToast('Đã lưu thông tin học sinh!');
  };

  // Quick mark lesson for whole class
  const handleBatchLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = `${batchVolume}_${batchLessonNum}`;
    const title = batchVolume === 'vol1' ? `Bài ${batchLessonNum}` : `Chủ điểm ${batchLessonNum}`;
    classAnalyticsService.markLessonForWholeClass(currentClassId, key, batchVolume, batchLessonNum, title);
    setIsBatchLessonModalOpen(false);
    showToast(`Đã ghi nhận hoàn thành ${title} cho tất cả học sinh lớp ${currentClass?.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-400/30 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Class Selector */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-amber-100 border border-white/20 mb-3">
              <BarChart2 className="w-4 h-4 text-amber-200" />
              <span>Sổ Điểm Điện Tử & Báo Cáo Chuyên Môn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-reading flex items-center gap-3">
              <span>Thống Kê Tiến Độ Học Tập Của Lớp</span>
              <span className="px-3 py-1 rounded-xl bg-white text-orange-700 text-sm font-extrabold shadow-sm">
                {currentClass?.name}
              </span>
            </h2>
            <p className="text-sm text-amber-100 mt-2 max-w-2xl leading-relaxed">
              Theo dõi chi tiết số bài học sinh đã hoàn thành, số bài đọc thu âm nộp cho cô, số bài luyện viết ô ly và danh sách học sinh cần phụ đạo theo chuẩn Chương trình SGK Kết nối tri thức.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="analytics-export-csv-btn"
              onClick={handleExportCsv}
              className="px-4 py-2.5 bg-white text-slate-800 hover:bg-amber-50 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Xuất Bảng Excel (CSV)</span>
            </button>

            <button
              id="analytics-print-btn"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-sm border border-white/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-200" />
              <span>In Phiếu Theo Dõi</span>
            </button>

            <button
              id="analytics-batch-lesson-btn"
              onClick={() => setIsBatchLessonModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 text-amber-950 hover:bg-amber-300 font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Ghi Nhận Bài Dạy Cả Lớp</span>
            </button>

            <button
              id="analytics-reset-zero-btn"
              onClick={() => {
                if (window.confirm('Thầy Cô có muốn đặt lại toàn bộ tiến độ của lớp về 0 (chỉ giữ danh sách tên học sinh) không?')) {
                  classAnalyticsService.resetToDefaultData();
                  userProfileService.resetAllProgress();
                  showToast('Đã đặt lại tiến độ cả lớp về 0!');
                }
              }}
              className="px-3 py-2.5 bg-white/15 hover:bg-rose-500/80 text-white font-bold text-xs rounded-2xl backdrop-blur-sm border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Đặt lại tất cả số bài và số sao về 0 (chỉ giữ tên học sinh)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đặt Lại Về 0</span>
            </button>
          </div>
        </div>

        {/* Class Selection & Homeroom Info */}
        <div className="mt-6 pt-6 border-t border-white/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-amber-100 font-bold whitespace-nowrap">Chọn Lớp:</span>
            {classes.map(c => (
              <button
                key={c.id}
                id={`select-class-btn-${c.id}`}
                onClick={() => handleSwitchClass(c.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  c.id === currentClassId
                    ? 'bg-white text-orange-700 shadow-md scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {c.name} ({classAnalyticsService.getStudentsByClass(c.id).length} HS)
              </button>
            ))}
          </div>

          <div className="text-xs text-amber-100 font-medium flex items-center gap-4">
            <span>GVCN: <strong className="text-white">{currentClass?.homeroomTeacher}</strong></span>
            <span>•</span>
            <span>Năm học: <strong className="text-white">{currentClass?.schoolYear}</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Big KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Sĩ số & Tích cực */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sĩ Số Học Sinh</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800">
            {summary.totalStudents} <span className="text-sm font-semibold text-slate-500">em</span>
          </div>
          <div className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{summary.activeStudentsCount}/{summary.totalStudents} em học tích cực tuần này</span>
          </div>
        </div>

        {/* Metric 2: Tiến độ học tập trung bình */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tiến Độ Cả Lớp</span>
            <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-orange-600">
            {summary.averageCompletionRate}%
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${summary.averageCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Bài đọc thu âm đã nộp */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Bài Thu Âm Nộp</span>
            <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800">
            {summary.totalRecordingsSubmitted} <span className="text-sm font-semibold text-slate-500">bài</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            Kèm <strong className="text-slate-800">{summary.totalWritingSubmitted} bài</strong> luyện viết chữ
          </div>
        </div>

        {/* Metric 4: Điểm sao & Khen thưởng */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Điểm Sao Trung Bình</span>
            <div className="w-9 h-9 rounded-2xl bg-yellow-100 text-amber-700 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            {summary.averageStars} ⭐
          </div>
          <div className="text-xs text-slate-500 font-medium mt-2 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
              {summary.statusBreakdown.excellent} em Xuất Sắc
            </span>
          </div>
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            id="analytics-subtab-roster-btn"
            onClick={() => setSubTab('roster')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              subTab === 'roster'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. Danh Sách & Sổ Theo Dõi ({students.length} HS)</span>
          </button>

          <button
            id="analytics-subtab-matrix-btn"
            onClick={() => setSubTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              subTab === 'matrix'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>2. Bản Đồ Tiến Độ 83 Bài Học (SGK)</span>
          </button>

          <button
            id="analytics-subtab-leaderboard-btn"
            onClick={() => setSubTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              subTab === 'leaderboard'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-amber-50 border border-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>3. Bảng Tuyên Dương Chăm Ngoan</span>
          </button>

          <button
            id="analytics-subtab-support-btn"
            onClick={() => setSubTab('needs_support')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
              subTab === 'needs_support'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>4. Cần Phụ Đạo & Kèm Cặp ({summary.statusBreakdown.needs_support} em)</span>
          </button>
        </div>

        {/* Add Student Button */}
        <button
          id="analytics-add-student-btn"
          onClick={() => {
            setFormData({
              name: '',
              studentCode: `HS${students.length + 1 < 10 ? '0' + (students.length + 1) : students.length + 1}`,
              gender: 'male',
              status: 'good',
              teacherNotes: '',
              dob: '2018-01-01'
            });
            setIsAddStudentOpen(true);
          }}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm Học Sinh</span>
        </button>
      </div>

      {/* --- SUBTAB 1: ROSTER & GRADEBOOK TABLE --- */}
      {subTab === 'roster' && (
        <div className="space-y-4">
          {/* Filter & Search Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="analytics-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm học sinh theo tên, mã số..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
                <span className="text-slate-400 pl-2">Lọc:</span>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Tất cả ({students.length})
                </button>
                <button
                  onClick={() => setStatusFilter('excellent')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    statusFilter === 'excellent' ? 'bg-amber-100 text-amber-900 shadow-xs font-black' : 'text-slate-500'
                  }`}
                >
                  Xuất sắc ({summary.statusBreakdown.excellent})
                </button>
                <button
                  onClick={() => setStatusFilter('needs_support')}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    statusFilter === 'needs_support' ? 'bg-rose-100 text-rose-900 shadow-xs font-black' : 'text-slate-500'
                  }`}
                >
                  Cần hỗ trợ ({summary.statusBreakdown.needs_support})
                </button>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="analytics-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none text-slate-700 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="progress">Xếp theo: Tiến độ bài học</option>
                  <option value="stars">Xếp theo: Điểm sao</option>
                  <option value="recs">Xếp theo: Số bài thu âm</option>
                  <option value="name">Xếp theo: Tên (A-Z)</option>
                  <option value="code">Xếp theo: Mã học sinh</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="text-slate-400 hover:text-slate-700 px-1 font-bold"
                  title="Đảo chiều sắp xếp"
                >
                  {sortOrder === 'desc' ? '⬇️' : '⬆️'}
                </button>
              </div>
            </div>
          </div>

          {/* Roster Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider">
                    <th className="py-4 px-4 text-center w-12">STT</th>
                    <th className="py-4 px-4">Học Sinh</th>
                    <th className="py-4 px-3 text-center">Tiến Độ T1 (83 bài)</th>
                    <th className="py-4 px-3 text-center">Tiến Độ T2 (8 bài)</th>
                    <th className="py-4 px-3 text-center">Thu Âm</th>
                    <th className="py-4 px-3 text-center">Viết Ô Ly</th>
                    <th className="py-4 px-3 text-center">Điểm Sao</th>
                    <th className="py-4 px-4 text-center">Đánh Giá</th>
                    <th className="py-4 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Không tìm thấy học sinh nào phù hợp với bộ lọc.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, idx) => {
                      const vol1Count = student.completedLessons.filter(l => l.volume === 'vol1').length;
                      const vol2Count = student.completedLessons.filter(l => l.volume === 'vol2').length;
                      const vol1Percent = Math.min(100, Math.round((vol1Count / 83) * 100));

                      return (
                        <tr 
                          key={student.id}
                          className="hover:bg-amber-50/50 transition-colors group cursor-pointer"
                          onClick={() => setSelectedStudentDetail(student)}
                        >
                          <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                            {idx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                                <UserAvatar avatar={student.avatar} name={student.name} size="md" />
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                                  <span>{student.name}</span>
                                  <span className="text-[11px] font-mono text-slate-400 font-semibold">{student.studentCode}</span>
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px] sm:max-w-xs">
                                  {student.teacherNotes || 'Chưa có ghi chú đặc biệt'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Progress Vol 1 */}
                          <td className="py-3.5 px-3 text-center">
                            <div className="inline-flex flex-col items-center">
                              <div className="font-black text-slate-800 text-xs">
                                {vol1Count}/83 <span className="text-[11px] text-slate-400 font-semibold">({vol1Percent}%)</span>
                              </div>
                              <div className="w-20 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                <div 
                                  className="bg-amber-500 h-full rounded-full" 
                                  style={{ width: `${vol1Percent}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Progress Vol 2 */}
                          <td className="py-3.5 px-3 text-center">
                            <span className="font-bold text-slate-700 text-xs">
                              {vol2Count}/8 chủ điểm
                            </span>
                          </td>

                          {/* Recordings */}
                          <td className="py-3.5 px-3 text-center">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs">
                              <Mic className="w-3.5 h-3.5" />
                              <span>{student.recordingsCount}</span>
                            </div>
                          </td>

                          {/* Writing */}
                          <td className="py-3.5 px-3 text-center">
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs">
                              <PenTool className="w-3.5 h-3.5" />
                              <span>{student.writingCount}</span>
                            </div>
                          </td>

                          {/* Stars */}
                          <td className="py-3.5 px-3 text-center">
                            <span className="font-black text-amber-600 text-xs flex items-center justify-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{student.starsCount}</span>
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center">
                            {getStatusBadge(student.status, student.completedLessons.length)}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`view-student-detail-${student.id}`}
                                onClick={() => setSelectedStudentDetail(student)}
                                className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-100 rounded-xl transition-all"
                                title="Xem hồ sơ chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                id={`edit-student-btn-${student.id}`}
                                onClick={() => {
                                  setSelectedStudentDetail(student);
                                  setFormData({
                                    name: student.name,
                                    studentCode: student.studentCode,
                                    gender: student.gender,
                                    status: student.status,
                                    teacherNotes: student.teacherNotes || '',
                                    dob: student.dob || '2018-01-01'
                                  });
                                  setIsEditStudentOpen(true);
                                }}
                                className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-100 rounded-xl transition-all"
                                title="Chỉnh sửa thông tin & nhận xét"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: LESSON COMPLETION MATRIX (HEATMAP 83 BÀI) --- */}
      {subTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Grid className="w-5 h-5 text-amber-600" />
                  <span>Ma Trận Tỉ Lệ Hoàn Thành Từng Bài Học Trong Sách</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Bấm vào từng ô bài học để xem chi tiết danh sách em nào trong lớp đã học xong và em nào cần học bù.
                </p>
              </div>

              {/* Volume Switcher */}
              <div className="inline-flex p-1 bg-slate-100 rounded-2xl">
                <button
                  onClick={() => setMatrixVolume('vol1')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    matrixVolume === 'vol1' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tập 1: 83 Bài Âm - Vần
                </button>
                <button
                  onClick={() => setMatrixVolume('vol2')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    matrixVolume === 'vol2' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tập 2: 8 Chủ Điểm
                </button>
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
              <span className="text-slate-400">Chú thích tỉ lệ lớp:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-emerald-600 inline-block"></span>
                <span>100% Đã học</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-emerald-400 inline-block"></span>
                <span>75% - 99%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-amber-400 inline-block"></span>
                <span>50% - 74%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-orange-300 inline-block"></span>
                <span>1% - 49%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-md bg-slate-100 border border-slate-300 inline-block"></span>
                <span>Chưa có HS học</span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 pt-4">
              {matrixData.map(item => {
                let colorClass = 'bg-slate-100 text-slate-400 border border-slate-200';
                if (item.completionRate === 100) {
                  colorClass = 'bg-emerald-600 text-white shadow-xs font-black';
                } else if (item.completionRate >= 75) {
                  colorClass = 'bg-emerald-400 text-slate-900 font-bold';
                } else if (item.completionRate >= 50) {
                  colorClass = 'bg-amber-400 text-amber-950 font-bold';
                } else if (item.completionRate > 0) {
                  colorClass = 'bg-orange-300 text-orange-950 font-bold';
                }

                return (
                  <button
                    key={item.lessonKey}
                    id={`matrix-lesson-btn-${item.lessonKey}`}
                    onClick={() => setSelectedMatrixLesson(item)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer ${colorClass}`}
                    title={`${matrixVolume === 'vol1' ? 'Bài' : 'Chủ điểm'} ${item.lessonNumber}: ${item.completedCount}/${students.length} em (${item.completionRate}%)`}
                  >
                    <span className="text-[10px] uppercase opacity-80">
                      {matrixVolume === 'vol1' ? 'B.' : 'CĐ'}
                    </span>
                    <span className="text-sm font-black">{item.lessonNumber}</span>
                    <span className="text-[10px] mt-0.5">{item.completionRate}%</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matrix Lesson Drilldown Popup/Modal */}
          {selectedMatrixLesson && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-lg">
                      {selectedMatrixLesson.lessonNumber}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        {matrixVolume === 'vol1' ? `Bài ${selectedMatrixLesson.lessonNumber} (Tập 1)` : `Chủ điểm ${selectedMatrixLesson.lessonNumber} (Tập 2)`}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Tiến độ lớp: <strong className="text-emerald-600">{selectedMatrixLesson.completedCount}/{students.length} em</strong> ({selectedMatrixLesson.completionRate}%)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMatrixLesson(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Students list who completed vs not completed */}
                <div className="py-4 space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  <div>
                    <h5 className="text-xs font-black uppercase text-emerald-700 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã hoàn thành ({selectedMatrixLesson.completedStudents.length} em)</span>
                    </h5>
                    {selectedMatrixLesson.completedStudents.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Chưa có học sinh nào hoàn thành bài này.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMatrixLesson.completedStudents.map(name => (
                          <span key={name} className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs">
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="text-xs font-black uppercase text-rose-700 mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Chưa hoàn thành ({students.length - selectedMatrixLesson.completedStudents.length} em)</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {students
                        .filter(s => !selectedMatrixLesson.completedStudents.includes(s.name))
                        .map(s => (
                          <span key={s.id} className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 font-bold text-xs">
                            {s.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const key = selectedMatrixLesson.lessonKey;
                      const title = matrixVolume === 'vol1' ? `Bài ${selectedMatrixLesson.lessonNumber}` : `Chủ điểm ${selectedMatrixLesson.lessonNumber}`;
                      classAnalyticsService.markLessonForWholeClass(currentClassId, key, matrixVolume, selectedMatrixLesson.lessonNumber, title);
                      showToast(`Đã đánh dấu 100% học sinh hoàn thành ${title}!`);
                      setSelectedMatrixLesson(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Đánh dấu cả lớp đã học</span>
                  </button>

                  <button
                    onClick={() => setSelectedMatrixLesson(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB 3: LEADERBOARD & REWARDS --- */}
      {subTab === 'leaderboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top 1: Trạng Nguyên Đọc Bài */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
                👑
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Trạng Nguyên Nhí</h4>
                <p className="text-xs text-slate-500">Đọc và hoàn thành nhiều bài nhất</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {[...students]
                .sort((a, b) => b.completedLessons.length - a.completedLessons.length)
                .slice(0, 5)
                .map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        idx === 0 ? 'bg-amber-400 text-amber-950 font-black' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs">{s.name}</span>
                    </div>
                    <span className="font-black text-amber-600 text-xs">
                      {s.completedLessons.length} bài
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top 2: Họa Mi Nhí (Thu Âm Nhiều Nhất) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl">
                🎙️
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Họa Mi Luyện Đọc</h4>
                <p className="text-xs text-slate-500">Nộp nhiều bài đọc thu âm nhất</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {[...students]
                .sort((a, b) => b.recordingsCount - a.recordingsCount)
                .slice(0, 5)
                .map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        idx === 0 ? 'bg-rose-400 text-white font-black' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs">{s.name}</span>
                    </div>
                    <span className="font-black text-rose-600 text-xs">
                      {s.recordingsCount} bản thu
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Top 3: Vở Sạch Chữ Đẹp */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl">
                ✍️
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Vở Sạch Chữ Đẹp</h4>
                <p className="text-xs text-slate-500">Tích cực luyện viết nét chữ ô ly</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {[...students]
                .sort((a, b) => b.writingCount - a.writingCount)
                .slice(0, 5)
                .map((s, idx) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        idx === 0 ? 'bg-sky-400 text-white font-black' : idx === 1 ? 'bg-slate-300 text-slate-800' : idx === 2 ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-slate-800 text-xs">{s.name}</span>
                    </div>
                    <span className="font-black text-sky-600 text-xs">
                      {s.writingCount} bài viết
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: NEEDS SUPPORT / SPECIAL ATTENTION --- */}
      {subTab === 'needs_support' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl shrink-0">
                🆘
              </div>
              <div>
                <h3 className="text-lg font-black text-rose-950">
                  Danh Sách Học Sinh Cần Kèm Cặp & Phụ Đạo ({students.filter(s => s.status === 'needs_support' || s.status === 'average').length} em)
                </h3>
                <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
                  Các em có tiến độ học chậm hơn phân phối chương trình, còn nhầm lẫn một số âm vần khó (như s/x, tr/ch, gi/d, các vần có âm đệm o/u). Thầy Cô có thể ghi chú kế hoạch dạy bù hoặc gửi phiếu bài tập cho phụ huynh.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students
              .filter(s => s.status === 'needs_support' || s.status === 'average')
              .map(student => (
                <div key={student.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-xl">
                        {student.avatar}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <span>{student.name}</span>
                          <span className="text-xs font-mono text-slate-400">({student.studentCode})</span>
                        </h4>
                        <div className="text-xs text-slate-500">
                          Đã học: <strong>{student.completedLessons.length} bài</strong> • Thu âm: <strong>{student.recordingsCount} bài</strong>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(student.status, student.completedLessons.length)}
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-xs text-amber-950">
                    <strong className="font-bold text-amber-900">Vấn đề cần hỗ trợ: </strong>
                    <span>{student.teacherNotes || 'Cần theo dõi thêm trong giờ đọc trên lớp.'}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedStudentDetail(student)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Xem Hồ Sơ Chi Tiết
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudentDetail(student);
                        setFormData({
                          name: student.name,
                          studentCode: student.studentCode,
                          gender: student.gender,
                          status: student.status,
                          teacherNotes: student.teacherNotes || '',
                          dob: student.dob || '2018-01-01'
                        });
                        setIsEditStudentOpen(true);
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Cập Nhật Kế Hoạch Bồi Dưỡng
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- MODAL 1: STUDENT PROFILE DETAIL MODAL --- */}
      {selectedStudentDetail && !isEditStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-amber-100 flex items-center justify-center shadow-xs overflow-hidden">
                  <UserAvatar avatar={selectedStudentDetail.avatar} name={selectedStudentDetail.name} size="xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{selectedStudentDetail.name}</h3>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-bold">
                      {selectedStudentDetail.studentCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Lớp: <strong>{currentClass?.name}</strong></span>
                    <span>•</span>
                    <span>Giới tính: <strong>{selectedStudentDetail.gender === 'female' ? 'Nữ' : 'Nam'}</strong></span>
                    <span>•</span>
                    {getStatusBadge(selectedStudentDetail.status, selectedStudentDetail.completedLessons.length)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Stats of Student */}
            <div className="grid grid-cols-4 gap-3 my-5">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <div className="text-[11px] font-bold text-amber-800">Tập 1</div>
                <div className="text-lg font-black text-amber-950">
                  {selectedStudentDetail.completedLessons.filter(l => l.volume === 'vol1').length}/83
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-center">
                <div className="text-[11px] font-bold text-orange-800">Tập 2</div>
                <div className="text-lg font-black text-orange-950">
                  {selectedStudentDetail.completedLessons.filter(l => l.volume === 'vol2').length}/8
                </div>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-center">
                <div className="text-[11px] font-bold text-rose-800">Thu Âm</div>
                <div className="text-lg font-black text-rose-950">
                  {selectedStudentDetail.recordingsCount} bài
                </div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-200 text-center">
                <div className="text-[11px] font-bold text-yellow-800">Tổng Sao</div>
                <div className="text-lg font-black text-amber-700">
                  {selectedStudentDetail.starsCount} ⭐
                </div>
              </div>
            </div>

            {/* Teacher Notes */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 mb-5">
              <div className="text-xs font-black uppercase text-slate-700 flex items-center justify-between">
                <span>📝 Nhận Xét & Đánh Giá Của Giáo Viên:</span>
                <button
                  onClick={() => {
                    setFormData({
                      name: selectedStudentDetail.name,
                      studentCode: selectedStudentDetail.studentCode,
                      gender: selectedStudentDetail.gender,
                      status: selectedStudentDetail.status,
                      teacherNotes: selectedStudentDetail.teacherNotes || '',
                      dob: selectedStudentDetail.dob || '2018-01-01'
                    });
                    setIsEditStudentOpen(true);
                  }}
                  className="text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa Nhận Xét</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "{selectedStudentDetail.teacherNotes || 'Chưa có ghi chú đặc biệt'}"
              </p>
            </div>

            {/* List of completed lessons */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-600">
                  Danh Sách Bài Học Đã Chinh Phục ({selectedStudentDetail.completedLessons.length} bài)
                </h4>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1">
                {selectedStudentDetail.completedLessons.map((cl, i) => (
                  <div key={i} className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <div className="text-xs font-black text-emerald-950">{cl.lessonTitle}</div>
                    <div className="text-[10px] text-emerald-700 flex items-center justify-center gap-0.5 mt-0.5">
                      <span>{cl.scoreStars} ⭐</span>
                      <span>•</span>
                      <span>{cl.practiceType === 'recording' ? '🎙️' : cl.practiceType === 'writing' ? '✍️' : '📖'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm(`Bạn có chắc muốn xóa học sinh ${selectedStudentDetail.name} khỏi lớp?`)) {
                    classAnalyticsService.deleteStudent(selectedStudentDetail.id);
                    setSelectedStudentDetail(null);
                    showToast('Đã xóa học sinh khỏi danh sách lớp.');
                  }
                }}
                className="px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa Học Sinh</span>
              </button>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-2xl cursor-pointer"
              >
                Đóng Hồ Sơ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT STUDENT MODAL --- */}
      {(isAddStudentOpen || isEditStudentOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {isAddStudentOpen ? 'Thêm Học Sinh Mới Vào Lớp' : 'Chỉnh Sửa Hồ Sơ & Nhận Xét'}
              </h3>
              <button
                onClick={() => {
                  setIsAddStudentOpen(false);
                  setIsEditStudentOpen(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isAddStudentOpen ? handleAddStudentSubmit : handleEditStudentSubmit} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Họ và Tên Học Sinh *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Gia Bảo"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Mã Học Sinh</label>
                  <input
                    type="text"
                    value={formData.studentCode}
                    onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                    placeholder="HS01"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Giới Tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    <option value="male">Nam 👦</option>
                    <option value="female">Nữ 👧</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Xếp Loại / Trạng Thái Học Tập</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="excellent">⭐ Xuất Sắc</option>
                  <option value="good">👍 Khá - Tốt</option>
                  <option value="average">🌱 Đạt Yêu Cầu</option>
                  <option value="needs_support">🆘 Cần Hỗ Trợ / Phụ Đạo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Lời Nhận Xét & Ghi Chú Của Giáo Viên</label>
                <textarea
                  rows={3}
                  value={formData.teacherNotes}
                  onChange={(e) => setFormData({ ...formData, teacherNotes: e.target.value })}
                  placeholder="Ghi chú về phát âm, vần hay nhầm, mức độ chuyên cần..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddStudentOpen(false);
                    setIsEditStudentOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAddStudentOpen ? 'Thêm Vào Lớp' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: BATCH RECORD LESSON FOR CLASS --- */}
      {isBatchLessonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-600" />
                <span>Ghi Nhận Bài Dạy Cả Lớp</span>
              </h3>
              <button
                onClick={() => setIsBatchLessonModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchLessonSubmit} className="py-4 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Sau mỗi tiết học trên lớp, Thầy Cô có thể đánh dấu bài học vừa dạy để tự động cộng điểm và cập nhật tiến độ cho toàn bộ học sinh lớp <strong>{currentClass?.name}</strong>.
              </p>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Tập Sách</label>
                <select
                  value={batchVolume}
                  onChange={(e) => {
                    setBatchVolume(e.target.value as any);
                    setBatchLessonNum(1);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="vol1">Tập 1: Âm - Vần (83 Bài)</option>
                  <option value="vol2">Tập 2: Đọc Hiểu Chủ Điểm (8 Bài)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  {batchVolume === 'vol1' ? 'Chọn Bài Số (1 - 83):' : 'Chọn Chủ Điểm (1 - 8):'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={batchVolume === 'vol1' ? 83 : 8}
                  value={batchLessonNum}
                  onChange={(e) => setBatchLessonNum(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                Sẽ ghi nhận hoàn thành <strong>{batchVolume === 'vol1' ? `Bài ${batchLessonNum}` : `Chủ điểm ${batchLessonNum}`}</strong> cho toàn bộ <strong>{students.length} học sinh</strong> của lớp {currentClass?.name}.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchLessonModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận & Cập Nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: PRINT READY CLASS REPORT --- */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-slate-900">Phiếu Theo Dõi Kết Quả Học Tập (Chuẩn In Báo Cáo)</h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Content Frame */}
            <div className="py-6 space-y-4 text-slate-900" id="printable-class-report">
              <div className="text-center space-y-1">
                <div className="text-xs uppercase font-bold tracking-wider text-slate-500">PHÒNG GIÁO DỤC & ĐÀO TẠO • TRƯỜNG TIỂU HỌC</div>
                <h2 className="text-xl font-black font-reading uppercase">
                  BÁO CÁO TIẾN ĐỘ & KẾT QUẢ HỌC TẬP MÔN TIẾNG VIỆT 1
                </h2>
                <div className="text-xs font-semibold text-slate-600">
                  Lớp: <strong className="text-slate-900">{currentClass?.name}</strong> • Năm học: <strong>{currentClass?.schoolYear}</strong> • Giáo viên chủ nhiệm: <strong>{currentClass?.homeroomTeacher}</strong>
                </div>
              </div>

              {/* Mini Summary */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs py-3 border-y border-slate-200">
                <div>Sĩ số: <strong>{summary.totalStudents} HS</strong></div>
                <div>Tiến độ TB: <strong>{summary.averageCompletionRate}%</strong></div>
                <div>Tổng bài thu âm: <strong>{summary.totalRecordingsSubmitted}</strong></div>
                <div>Học sinh xuất sắc: <strong>{summary.statusBreakdown.excellent}</strong></div>
              </div>

              {/* Print Table */}
              <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                    <th className="p-2 border-r border-slate-300 text-center w-8">STT</th>
                    <th className="p-2 border-r border-slate-300">Họ và Tên</th>
                    <th className="p-2 border-r border-slate-300 text-center">Tập 1</th>
                    <th className="p-2 border-r border-slate-300 text-center">Tập 2</th>
                    <th className="p-2 border-r border-slate-300 text-center">Thu Âm</th>
                    <th className="p-2 border-r border-slate-300 text-center">Xếp Loại</th>
                    <th className="p-2">Nhận Xét Của Giáo Viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((s, idx) => (
                    <tr key={s.id}>
                      <td className="p-1.5 border-r border-slate-300 text-center">{idx + 1}</td>
                      <td className="p-1.5 border-r border-slate-300 font-bold">{s.name}</td>
                      <td className="p-1.5 border-r border-slate-300 text-center">{s.completedLessons.filter(l => l.volume === 'vol1').length}/83</td>
                      <td className="p-1.5 border-r border-slate-300 text-center">{s.completedLessons.filter(l => l.volume === 'vol2').length}/8</td>
                      <td className="p-1.5 border-r border-slate-300 text-center">{s.recordingsCount}</td>
                      <td className="p-1.5 border-r border-slate-300 text-center font-bold">
                        {s.status === 'excellent' ? 'Xuất sắc' : s.status === 'good' ? 'Tốt' : s.status === 'average' ? 'Đạt' : 'Cần hỗ trợ'}
                      </td>
                      <td className="p-1.5 italic text-slate-700">{s.teacherNotes || 'Đạt chuẩn kiến thức kỹ năng'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="pt-8 flex items-center justify-between text-xs text-center">
                <div>
                  <div className="font-bold">HIỆU TRƯỞNG</div>
                  <div className="text-slate-400 italic mt-12">(Ký và ghi rõ họ tên)</div>
                </div>
                <div>
                  <div className="italic text-slate-500">Ngày ..... tháng ..... năm 202...</div>
                  <div className="font-bold mt-1">GIÁO VIÊN CHỦ NHIỆM</div>
                  <div className="font-bold mt-12 text-slate-800">{currentClass?.homeroomTeacher}</div>
                </div>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-2xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
