import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  FileSpreadsheet, 
  HardDrive, 
  GraduationCap, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  UploadCloud, 
  Lock, 
  Share2, 
  Sparkles, 
  Volume2, 
  FolderPlus, 
  BookOpen, 
  Send,
  AlertCircle,
  Users,
  Download,
  Copy,
  Check,
  Settings,
  HelpCircle,
  Info
} from 'lucide-react';
import { googleWorkspaceService } from '../services/googleWorkspaceService';
import { userProfileService } from '../services/userProfileService';
import { recordingStorageService } from '../services/recordingStorageService';
import { GoogleAccountInfo, GoogleSheetsSyncStatus, GoogleDriveSyncStatus, GoogleClassroomCourse, StudentRecording } from '../types';
import { VOLUME_1_LESSONS } from '../data/lessonsVolume1';
import { TOPIC_GROUPS } from '../data/lessonsVolume2';

const VOLUME_2_LESSONS = TOPIC_GROUPS.flatMap(g => g.lessons);

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'drive' | 'classroom'>('sheets');
  const [account, setAccount] = useState<GoogleAccountInfo | null>(googleWorkspaceService.getAccount());
  const [sheetsStatus, setSheetsStatus] = useState<GoogleSheetsSyncStatus>(googleWorkspaceService.getSheetsStatus());
  const [driveStatus, setDriveStatus] = useState<GoogleDriveSyncStatus>(googleWorkspaceService.getDriveStatus());
  const [recordings, setRecordings] = useState<StudentRecording[]>([]);
  
  // Loading & Action states
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isBackingUpAudio, setIsBackingUpAudio] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Origin mismatch & Client ID settings
  const [showConfigGuide, setShowConfigGuide] = useState<boolean>(false);
  const [customClientIdInput, setCustomClientIdInput] = useState<string>(googleWorkspaceService.getActiveClientId());
  const [isCopiedDomain, setIsCopiedDomain] = useState<boolean>(false);

  // Classroom state
  const [courses, setCourses] = useState<GoogleClassroomCourse[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedVolume, setSelectedVolume] = useState<'tap1' | 'tap2'>('tap1');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [assignmentInstructions, setAssignmentInstructions] = useState<string>(
    'Các con hãy mở bài học trên ứng dụng Tiếng Việt 1, luyện đọc phát âm to rõ ràng và bấm Thu âm giọng đọc để nộp bài cho cô nhé!'
  );
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [createdAssignmentLink, setCreatedAssignmentLink] = useState<string | null>(null);

  useEffect(() => {
    const unsub = googleWorkspaceService.subscribe(() => {
      setAccount(googleWorkspaceService.getAccount());
      setSheetsStatus(googleWorkspaceService.getSheetsStatus());
      setDriveStatus(googleWorkspaceService.getDriveStatus());
    });

    const loadRecs = async () => {
      const recs = await recordingStorageService.getAllRecordings();
      setRecordings(recs);
    };
    loadRecs();

    return () => {
      unsub();
    };
  }, [isOpen]);

  // Load classroom courses when classroom tab is selected and connected
  useEffect(() => {
    if (activeTab === 'classroom' && account?.accessToken) {
      loadClassroomCourses();
    }
  }, [activeTab, account]);

  const loadClassroomCourses = async () => {
    setIsLoadingCourses(true);
    setErrorMsg(null);
    try {
      const list = await googleWorkspaceService.listClassroomCourses();
      setCourses(list);
      if (list.length > 0 && !selectedCourseId) {
        setSelectedCourseId(list[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Không thể tải danh sách lớp học Google Classroom');
    } finally {
      setIsLoadingCourses(false);
    }
  };

  if (!isOpen) return null;

  const isConnected = !!(account && account.accessToken);

  const currentOrigin = typeof window !== 'undefined' && window.location?.origin 
    ? window.location.origin 
    : 'https://h-c-ti-ng-vi-t-1-a2.vercel.app';

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentOrigin).then(() => {
      setIsCopiedDomain(true);
      setTimeout(() => setIsCopiedDomain(false), 2500);
    }).catch(() => {
      // Fallback
    });
  };

  const handleSaveCustomClientId = () => {
    googleWorkspaceService.setCustomClientId(customClientIdInput);
    setSyncSuccessMsg('Đã lưu cấu hình Google Client ID mới!');
    setTimeout(() => setSyncSuccessMsg(null), 3000);
  };

  const handleResetClientId = () => {
    googleWorkspaceService.resetCustomClientId();
    setCustomClientIdInput(googleWorkspaceService.getDefaultClientId());
    setSyncSuccessMsg('Đã khôi phục Client ID mặc định!');
    setTimeout(() => setSyncSuccessMsg(null), 3000);
  };

  // Handle Instant Gradebook Export to CSV
  const handleExportCSV = () => {
    try {
      const studentProfiles = userProfileService.getAllProfiles().filter(p => p.role === 'student');
      if (studentProfiles.length === 0) {
        setErrorMsg('Không tìm thấy dữ liệu học sinh để xuất file');
        return;
      }

      const rows: string[] = [];
      const header = [
        'STT',
        'Mã Học Sinh',
        'Họ Và Tên Học Sinh',
        'Lớp Học',
        'Biểu Tượng Avatar',
        'Số Sao Tích Lũy ⭐',
        'Số Bài Hoàn Thành 📖',
        'Số Bài Đã Thu Âm 🎙️',
        'Tiến Độ SGK (%)',
        'Đánh Giá Xếp Loại',
        'Ngày Giờ Xuất Báo Cáo',
        'Danh Sách Mã Bài Đã Học'
      ];
      rows.push(header.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));

      studentProfiles.forEach((student, index) => {
        const studentRecs = recordings.filter(r => r.studentId === student.id);
        const totalSGKLessons = 70;
        const progressPercent = Math.min(100, Math.round(((student.completedLessonKeys?.length || 0) / totalSGKLessons) * 100));
        const rating = progressPercent >= 50 ? 'Xuất sắc ⭐⭐⭐' : progressPercent >= 25 ? 'Tiến bộ tốt ⭐⭐' : 'Đang rèn luyện ⭐';
        const recCount = student.totalRecordingsCount || studentRecs.length;
        const completedKeys = (student.completedLessonKeys || []).join('; ');
        const exportTime = new Date().toLocaleString('vi-VN');

        const row = [
          index + 1,
          student.studentCode || `HS0${index + 1}`,
          student.name,
          student.classroom || 'Lớp 1A2',
          student.avatar || '🐰',
          student.starsCount || 0,
          student.completedLessonKeys?.length || 0,
          recCount,
          `${progressPercent}%`,
          rating,
          exportTime,
          completedKeys
        ];
        rows.push(row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));
      });

      // Prepend UTF-8 BOM so Microsoft Excel & Google Sheets display Vietnamese characters properly
      const csvContent = '\uFEFF' + rows.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const now = new Date();
      const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      link.href = url;
      link.download = `Bang_Diem_Lop_1A2_Tieng_Viet_1_${dateString}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSyncSuccessMsg(`Đã tải về máy thành công bảng điểm ${studentProfiles.length} học sinh (.CSV). Bạn có thể mở trực tiếp bằng Excel hoặc tải lên Google Sheets!`);
      setTimeout(() => setSyncSuccessMsg(null), 6000);
    } catch (err: any) {
      setErrorMsg('Không thể xuất tệp CSV: ' + (err?.message || 'Lỗi không xác định'));
    }
  };

  // Handle Google Sign In
  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      await googleWorkspaceService.signIn();
      setSyncSuccessMsg('Đăng nhập Google thành công! Bạn có thể bắt đầu đồng bộ.');
      setShowConfigGuide(false);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    } catch (err: any) {
      const msg = err.message || 'Đăng nhập Google thất bại';
      setErrorMsg(msg);
      if (msg.includes('origin_mismatch') || msg.includes('400') || msg.includes('45s') || msg.includes('đóng')) {
        setShowConfigGuide(true);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Google Sign Out
  const handleSignOut = () => {
    googleWorkspaceService.signOut();
  };

  // Handle Sync to Sheets
  const handleSyncSheets = async () => {
    setIsSyncingSheets(true);
    setErrorMsg(null);
    setSyncSuccessMsg(null);
    try {
      const allProfiles = userProfileService.getAllProfiles();
      const allRecs = await recordingStorageService.getAllRecordings();
      const result = await googleWorkspaceService.syncProfilesToSheet(allProfiles, allRecs);
      setSyncSuccessMsg(`Đã đồng bộ thành công ${result.totalSynced} học sinh và ${allRecs.length} bài thu âm vào Google Sheets!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Đồng bộ Google Sheets thất bại');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Handle Create/Connect Drive Folder
  const handleConnectDriveFolder = async () => {
    setIsCreatingFolder(true);
    setErrorMsg(null);
    try {
      await googleWorkspaceService.getOrCreateAppFolder();
      setSyncSuccessMsg('Đã kết nối thư mục Google Drive thành công!');
      setTimeout(() => setSyncSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tạo thư mục Google Drive');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Handle Backup All Audio to Drive
  const handleBackupAllAudio = async () => {
    if (recordings.length === 0) {
      setErrorMsg('Chưa có bài thu âm nào của học sinh để tải lên');
      return;
    }
    setIsBackingUpAudio(true);
    setErrorMsg(null);
    try {
      let uploadedCount = 0;
      const currentProfile = userProfileService.getActiveProfile();
      for (const rec of recordings) {
        if (rec.audioBlobUrl) {
          const res = await fetch(rec.audioBlobUrl);
          const blob = await res.blob();
          await googleWorkspaceService.uploadAudioToDrive(rec, blob, currentProfile.name);
          uploadedCount++;
        }
      }
      setSyncSuccessMsg(`Đã tải an toàn ${uploadedCount} bài thu âm lên Google Drive!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải bài thu âm lên Google Drive');
    } finally {
      setIsBackingUpAudio(false);
    }
  };

  // Handle Create Classroom Assignment
  const handleCreateAssignment = async () => {
    if (!selectedCourseId) {
      setErrorMsg('Vui lòng chọn lớp học trên Google Classroom');
      return;
    }
    setIsCreatingAssignment(true);
    setErrorMsg(null);
    setCreatedAssignmentLink(null);
    try {
      let lessonTitle = '';
      if (selectedVolume === 'tap1') {
        const l = VOLUME_1_LESSONS.find(item => item.id === selectedLessonId);
        lessonTitle = `Tập 1 - Bài ${l?.lessonNumber || selectedLessonId}: ${l?.title || ''}`;
      } else {
        const l = VOLUME_2_LESSONS.find(item => item.id === selectedLessonId);
        lessonTitle = `Tập 2 - Bài ${l?.lessonNumber || selectedLessonId}: ${l?.title || ''}`;
      }

      const appUrl = window.location.origin;
      const result = await googleWorkspaceService.createClassroomAssignment(
        selectedCourseId,
        lessonTitle,
        assignmentInstructions,
        appUrl
      );

      setCreatedAssignmentLink(result.alternateLink || 'https://classroom.google.com');
      setSyncSuccessMsg(`Đã giao bài "${lessonTitle}" thành công lên Google Classroom!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Giao bài lên Google Classroom thất bại');
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  const currentProfile = userProfileService.getActiveProfile();
  const allProfiles = userProfileService.getAllProfiles().filter(p => p.role === 'student');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-white">
              <Cloud className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-comfortaa">
                  Đồng bộ Google Workspace
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/30 text-white border border-white/20">
                  Miễn phí 100%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                Lưu trữ vĩnh viễn bảng điểm vào Google Sheets, lưu âm thanh vào Drive & giao bài qua Classroom
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Account Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {isConnected ? (
            <div className="flex items-center gap-3">
              {account?.picture ? (
                <img src={account.picture} alt={account.name} className="w-9 h-9 rounded-full border-2 border-emerald-500 shadow-sm" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center">
                  {account?.name?.charAt(0) || 'G'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-sm">{account?.name}</span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Đã kết nối Google
                  </span>
                </div>
                <span className="text-xs text-slate-500">{account?.email}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Chưa kết nối tài khoản Google để đồng bộ dữ liệu đám mây</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showConfigGuide
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
              }`}
              title="Cấu hình Google Cloud hoặc sửa Lỗi 400 origin_mismatch"
            >
              <Settings className="w-3.5 h-3.5 text-amber-600" />
              <span>{showConfigGuide ? 'Đóng cấu hình' : 'Sửa Lỗi 400'}</span>
            </button>

            {isConnected ? (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
              >
                Đăng xuất
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang kết nối...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>Đăng nhập bằng Google</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Notifications & Alerts */}
        {syncSuccessMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{syncSuccessMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mx-4 sm:mx-6 mt-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start justify-between gap-3 shrink-0">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">{errorMsg}</span>
                {(errorMsg.includes('origin_mismatch') || errorMsg.includes('400') || errorMsg.includes('45s')) && (
                  <p className="text-[11px] text-rose-700">
                    💡 Nguyên nhân: Tên miền <code className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-rose-200">{currentOrigin}</code> chưa được thêm vào mục <strong>Authorized JavaScript origins</strong> trong Google Cloud Console.
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowConfigGuide(true)}
              className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs shrink-0 cursor-pointer transition border border-rose-300"
            >
              Xem cách sửa
            </button>
          </div>
        )}

        {/* Guide & Fix for Lỗi 400 origin_mismatch */}
        {showConfigGuide && (
          <div className="mx-4 sm:mx-6 mt-3 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-800 text-xs sm:text-sm space-y-3 shrink-0 shadow-sm animate-fadeIn">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <h4 className="font-bold text-amber-950 text-sm sm:text-base">
                  Hướng Dẫn Khắc Phục "Lỗi 400: origin_mismatch"
                </h4>
              </div>
              <button
                onClick={() => setShowConfigGuide(false)}
                className="text-amber-700 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-100 transition cursor-pointer"
                aria-label="Đóng hướng dẫn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-amber-900 leading-relaxed">
              Google OAuth 2.0 yêu cầu tên miền đang chạy ứng dụng phải được thêm vào danh sách <strong className="font-bold">"Mã nguồn JavaScript được ủy quyền" (Authorized JavaScript origins)</strong> trong Google Cloud Console để đảm bảo an toàn.
            </p>

            {/* Domain Box with 1-Click Copy */}
            <div className="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-slate-700 shrink-0 text-xs uppercase tracking-wide">Domain ứng dụng:</span>
                <code className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded font-mono font-bold text-xs truncate border border-amber-200">
                  {currentOrigin}
                </code>
              </div>
              <button
                onClick={handleCopyDomain}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center gap-1.5 transition shrink-0 cursor-pointer shadow-sm"
              >
                {isCopiedDomain ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép Domain</span>
                  </>
                )}
              </button>
            </div>

            {/* Steps Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold inline-flex items-center justify-center text-xs">1</span>
                  <strong className="font-bold text-slate-800">Mở Google Cloud:</strong>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Truy cập trang cấu hình Google Cloud của bạn:{' '}
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:underline font-bold inline-flex items-center gap-0.5"
                  >
                    Google Cloud Credentials <ExternalLink className="w-3 h-3 inline" />
                  </a>
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold inline-flex items-center justify-center text-xs">2</span>
                  <strong className="font-bold text-slate-800">Thêm Authorized Origin:</strong>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Nhấn vào tên <em>OAuth 2.0 Client ID</em> của bạn. Tại mục <strong>"Mã nguồn JavaScript được ủy quyền"</strong>, bấm <strong>+ THÊM URI</strong> và dán URL vừa sao chép ở trên vào, sau đó bấm <strong>LƯU (SAVE)</strong>.
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold inline-flex items-center justify-center text-xs">3</span>
                  <strong className="font-bold text-slate-800">Hoàn tất & Đăng nhập:</strong>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Chờ khoảng 1 - 3 phút để máy chủ Google áp dụng tên miền mới, sau đó quay lại đây và nhấn nút <strong>"Đăng nhập bằng Google"</strong>.
                </p>
              </div>
            </div>

            {/* Quick Export Advice */}
            <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-emerald-900">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs">
                  <strong>Khuyên dùng:</strong> Giáo viên có thể bấm <strong>"Xuất Excel / CSV (28 bé)"</strong> để tải toàn bộ bảng điểm ngay lập tức mà không cần cài đặt Google Cloud!
                </span>
              </div>
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 flex items-center justify-center gap-1 transition cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải CSV Bảng Điểm Ngay</span>
              </button>
            </div>

            {/* Custom Client ID Settings */}
            <div className="pt-1 border-t border-amber-200">
              <details className="group">
                <summary className="text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer flex items-center gap-1">
                  <span>⚙️ Cài đặt Google Client ID riêng (Dành cho Quản Trị Viên)</span>
                </summary>
                <div className="mt-2.5 p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                  <label className="block text-xs text-slate-600">
                    Nhập Client ID Google Cloud OAuth của bạn nếu muốn sử dụng dự án GCP cá nhân:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={customClientIdInput}
                      onChange={(e) => setCustomClientIdInput(e.target.value)}
                      placeholder="VD: 123456789-xxx.apps.googleusercontent.com"
                      className="grow p-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleSaveCustomClientId}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer shrink-0"
                    >
                      Lưu Client ID
                    </button>
                    {googleWorkspaceService.isUsingCustomClientId() && (
                      <button
                        onClick={handleResetClientId}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shrink-0"
                      >
                        Khôi phục mặc định
                      </button>
                    )}
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="px-4 sm:px-6 pt-3 flex border-b border-slate-100 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Bảng Điểm Google Sheets</span>
            {sheetsStatus.status === 'synced' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'drive'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDrive className="w-4 h-4 text-teal-600" />
            <span>Lưu Âm Thanh Google Drive</span>
            {driveStatus.status === 'synced' && (
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('classroom')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'classroom'
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-cyan-600" />
            <span>Giao Bài Google Classroom</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-6">

          {/* TAB 1: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    Bảng Điểm & Báo Cáo Học Sinh Đám Mây
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                    Tất cả danh sách học sinh, điểm sao ⭐, số bài hoàn thành và nhật ký đọc đều được tự động lưu vào tệp Google Sheets trên tài khoản Google của bạn.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {sheetsStatus.spreadsheetUrl && (
                    <a
                      href={sheetsStatus.spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 flex items-center gap-1.5 shadow-sm transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Mở Google Sheet</span>
                    </a>
                  )}

                  <button
                    onClick={handleExportCSV}
                    className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-emerald-800 border-2 border-emerald-300 hover:bg-emerald-50 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                    title="Tải về file bảng điểm để mở bằng Excel hoặc Google Sheets ngay mà không cần tài khoản Google Cloud"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Xuất Excel / CSV ({allProfiles.length} bé)</span>
                  </button>

                  <button
                    onClick={handleSyncSheets}
                    disabled={!isConnected || isSyncingSheets}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {isSyncingSheets ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang đồng bộ...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Đồng bộ ngay ({allProfiles.length} học sinh)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                  <span className="text-xs text-slate-500 font-medium">Trạng thái Bảng tính</span>
                  <div className="mt-1 flex items-center gap-2">
                    {sheetsStatus.status === 'synced' ? (
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đã kết nối & đồng bộ
                      </span>
                    ) : sheetsStatus.status === 'syncing' ? (
                      <span className="text-sm font-bold text-blue-600 flex items-center gap-1">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang cập nhật...
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-slate-600">Sẵn sàng đồng bộ</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                  <span className="text-xs text-slate-500 font-medium">Học sinh trong lớp</span>
                  <div className="mt-1 font-bold text-slate-800 text-base">
                    {allProfiles.length} bé trong danh sách
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                  <span className="text-xs text-slate-500 font-medium">Lần đồng bộ gần nhất</span>
                  <div className="mt-1 font-medium text-slate-700 text-xs sm:text-sm">
                    {sheetsStatus.lastSyncedAt
                      ? new Date(sheetsStatus.lastSyncedAt).toLocaleString('vi-VN')
                      : 'Chưa đồng bộ'}
                  </div>
                </div>
              </div>

              {/* Live Preview Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Xem trước dữ liệu sẽ đồng bộ vào Google Sheet:
                  </h4>
                  <span className="text-xs text-slate-500">Tự động nạp từ bộ hồ sơ học sinh</span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">STT</th>
                        <th className="p-2.5">Mã HS</th>
                        <th className="p-2.5">Học sinh</th>
                        <th className="p-2.5">Lớp</th>
                        <th className="p-2.5">Sao đạt ⭐</th>
                        <th className="p-2.5">Bài hoàn thành</th>
                        <th className="p-2.5">Bài thu âm 🎙️</th>
                        <th className="p-2.5">Tiến độ SGK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {allProfiles.map((p, idx) => {
                        const percent = Math.min(100, Math.round((p.completedLessonKeys.length / 70) * 100));
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-medium text-slate-500">{idx + 1}</td>
                            <td className="p-2.5 font-mono text-emerald-700 font-semibold">{p.studentCode || `HS0${idx + 1}`}</td>
                            <td className="p-2.5 font-bold text-slate-800 flex items-center gap-1.5">
                              <span>{p.avatar}</span>
                              <span>{p.name}</span>
                            </td>
                            <td className="p-2.5 text-slate-600">{p.classroom || 'Lớp 1A'}</td>
                            <td className="p-2.5 font-bold text-amber-500">{p.starsCount} ⭐</td>
                            <td className="p-2.5 text-slate-700">{p.completedLessonKeys.length} bài</td>
                            <td className="p-2.5 text-slate-700">{p.totalRecordingsCount || 0} bài</td>
                            <td className="p-2.5">
                              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                              </div>
                              <span className="text-[10px] text-slate-500 font-medium">{percent}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE */}
          {activeTab === 'drive' && (
            <div className="space-y-6">
              <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-teal-900 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-teal-600" />
                    Thư Mục Google Drive Lưu Trữ Giọng Đọc
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-700 mt-1">
                    Âm thanh luyện đọc của bé được nén nhẹ (100KB/bài) và tải an toàn lên thư mục Google Drive của bạn. Dung lượng 15GB miễn phí đủ dùng trong hơn 10 năm học.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {driveStatus.folderUrl ? (
                    <a
                      href={driveStatus.folderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 flex items-center gap-1.5 shadow-sm transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Mở Thư Mục Drive</span>
                    </a>
                  ) : (
                    <button
                      onClick={handleConnectDriveFolder}
                      disabled={!isConnected || isCreatingFolder}
                      className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-50"
                    >
                      <FolderPlus className="w-4 h-4" />
                      <span>Tạo Thư Mục Trên Drive</span>
                    </button>
                  )}

                  <button
                    onClick={handleBackupAllAudio}
                    disabled={!isConnected || isBackingUpAudio || recordings.length === 0}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-2 shadow-md shadow-teal-700/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {isBackingUpAudio ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang tải lên Drive...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Tải toàn bộ ({recordings.length}) bản thu âm lên Drive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recordings List */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-teal-600" />
                  Danh sách bài đọc & file ghi âm của học sinh:
                </h4>

                {recordings.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm">
                    Chưa có bài thu âm nào. Học sinh có thể nhấn nút Micro 🎙️ trong từng bài học để thu âm giọng đọc.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {recordings.map((rec) => (
                      <div key={rec.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-xs sm:text-sm">
                              {rec.lessonTitle} - <span className="text-teal-700">"{rec.targetText}"</span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>Thời lượng: {rec.durationSeconds} giây</span>
                              <span>•</span>
                              <span>{new Date(rec.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rec.audioBlobUrl && (
                            <audio src={rec.audioBlobUrl} controls className="h-8 w-36 sm:w-48" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE CLASSROOM */}
          {activeTab === 'classroom' && (
            <div className="space-y-6">
              <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-4">
                <h3 className="text-base font-bold text-cyan-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-600" />
                  Giao Bài Tập Đọc Về Nhà Lên Google Classroom
                </h3>
                <p className="text-xs sm:text-sm text-cyan-700 mt-1">
                  Giáo viên có thể chọn bài học bất kỳ từ SGK Tiếng Việt 1 (Tập 1 hoặc Tập 2) và giao trực tiếp cho cả lớp trên Google Classroom chỉ với 1 cú nhấp chuột.
                </p>
              </div>

              {!isConnected ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-slate-600 text-sm mb-4">Vui lòng bấm nút <b>Đăng nhập bằng Google</b> ở góc trên để kết nối với lớp học trên Google Classroom của bạn.</p>
                  <button
                    onClick={handleSignIn}
                    className="px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer"
                  >
                    Đăng nhập Google để kết nối lớp học
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Step 1: Select Classroom */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      1. Chọn Lớp Học Trên Google Classroom
                    </label>
                    {isLoadingCourses ? (
                      <div className="flex items-center gap-2 text-sm text-slate-500 p-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" />
                        <span>Đang tải danh sách lớp học...</span>
                      </div>
                    ) : courses.length === 0 ? (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
                        Không tìm thấy lớp học nào trên Google Classroom. Bạn có thể vào <a href="https://classroom.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold">classroom.google.com</a> để tạo lớp học mới trước.
                      </div>
                    ) : (
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.name} {course.section ? `(${course.section})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Step 2: Choose Lesson */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        2. Chọn Tập SGK
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVolume('tap1');
                            setSelectedLessonId(1);
                          }}
                          className={`p-2.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                            selectedVolume === 'tap1'
                              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Tập 1 (Âm & Vần)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVolume('tap2');
                            setSelectedLessonId(1);
                          }}
                          className={`p-2.5 rounded-xl font-bold text-xs border transition cursor-pointer ${
                            selectedVolume === 'tap2'
                              ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Tập 2 (Đọc Hiểu)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        3. Chọn Bài Học Cần Giao
                      </label>
                      <select
                        value={selectedLessonId}
                        onChange={(e) => setSelectedLessonId(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        {selectedVolume === 'tap1'
                          ? VOLUME_1_LESSONS.map(l => (
                              <option key={l.id} value={l.id}>
                                Bài {l.lessonNumber}: {l.title}
                              </option>
                            ))
                          : VOLUME_2_LESSONS.map(l => (
                              <option key={l.id} value={l.id}>
                                Bài {l.lessonNumber}: {l.title}
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      4. Lời Dặn Của Giáo Viên (Hướng dẫn làm bài)
                    </label>
                    <textarea
                      rows={3}
                      value={assignmentInstructions}
                      onChange={(e) => setAssignmentInstructions(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {createdAssignmentLink && (
                      <a
                        href={createdAssignmentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-cyan-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Xem bài tập vừa giao trên Google Classroom</span>
                      </a>
                    )}

                    <button
                      onClick={handleCreateAssignment}
                      disabled={isCreatingAssignment || !selectedCourseId}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                    >
                      {isCreatingAssignment ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Đang tạo bài tập...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Giao Bài Lên Google Classroom</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Dữ liệu được bảo mật an toàn theo tiêu chuẩn Google Workspace</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
