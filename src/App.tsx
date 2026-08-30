import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileNavBar } from './components/MobileNavBar';
import { Volume1Grid } from './components/Volume1Grid';
import { Volume1LessonView } from './components/Volume1LessonView';
import { Volume2Grid } from './components/Volume2Grid';
import { Volume2LessonView } from './components/Volume2LessonView';
import { AlphabetBoard } from './components/AlphabetBoard';
import { WritingBoard } from './components/WritingBoard';
import { IntroView } from './components/IntroView';
import { TeacherPortalView } from './components/TeacherPortalView';
import { ParentPortalView } from './components/ParentPortalView';
import { TeacherManagementModal } from './components/TeacherManagementModal';
import { TeacherLessonEditorModal } from './components/TeacherLessonEditorModal';
import { TeacherAudioRecorderModal, TeacherAudioTarget } from './components/TeacherAudioRecorderModal';
import { TeacherAudioStudioModal } from './components/TeacherAudioStudioModal';
import { StudentVoiceRecorderModal } from './components/StudentVoiceRecorderModal';
import { AchievementModal } from './components/AchievementModal';
import { AchievementUnlockModal } from './components/AchievementUnlockModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { Volume1Lesson, Volume2Lesson, RecordingTargetInfo, AchievementBadge, UserRole, AppUserProfile } from './types';
import { lessonStorageService } from './services/lessonStorageService';
import { teacherAudioService } from './services/teacherAudioService';
import { achievementService } from './services/achievementService';
import { userProfileService } from './services/userProfileService';
import { teacherAuthService } from './services/teacherAuthService';
import { speechService } from './services/speechService';
import confetti from 'canvas-confetti';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { BookOpen, Sparkles, Home, ArrowLeft, Mic, Trophy } from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Active User Profile & Multi-User State
  const [activeUser, setActiveUser] = useState<AppUserProfile>(() => userProfileService.getActiveUser());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isGoogleWorkspaceOpen, setIsGoogleWorkspaceOpen] = useState<boolean>(false);

  // Teacher Authentication & Login Modal State
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState<boolean>(false);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => teacherAuthService.isAuthenticated());

  // Role State (Student, Teacher, Parent)
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const active = userProfileService.getActiveUser();
    if (active.role === 'teacher' && !teacherAuthService.isAuthenticated()) {
      return 'student'; // fallback to student if not authenticated
    }
    return active.role || 'student';
  });

  const [currentTab, setCurrentTab] = useState<'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice'>('volume1');
  const [selectedVol1Lesson, setSelectedVol1Lesson] = useState<Volume1Lesson | null>(null);
  const [selectedVol2Lesson, setSelectedVol2Lesson] = useState<Volume2Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [writingSampleText, setWritingSampleText] = useState<string>('a ă â b c d đ');
  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('tv1_stars');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Achievement & Badges Modal States
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState<boolean>(false);
  const [unlockedBadgesToCelebrate, setUnlockedBadgesToCelebrate] = useState<AchievementBadge[]>([]);

  // Voice Recording Modal State
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState<boolean>(false);
  const [voiceRecorderTarget, setVoiceRecorderTarget] = useState<RecordingTargetInfo | null>(null);

  // Teacher Mode Modals State
  const [isTeacherMgmtOpen, setIsTeacherMgmtOpen] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorVolume, setEditorVolume] = useState<'vol1' | 'vol2'>('vol1');
  const [editingVol1Lesson, setEditingVol1Lesson] = useState<Volume1Lesson | undefined>(undefined);
  const [editingVol2Lesson, setEditingVol2Lesson] = useState<Volume2Lesson | undefined>(undefined);
  const [customizedCount, setCustomizedCount] = useState<number>(() => lessonStorageService.getStats().totalCustomCount);

  // Teacher Audio Studio & Recorder State
  const [isTeacherAudioStudioOpen, setIsTeacherAudioStudioOpen] = useState<boolean>(false);
  const [teacherAudioTarget, setTeacherAudioTarget] = useState<TeacherAudioTarget | null>(null);
  const [isTeacherAudioRecorderOpen, setIsTeacherAudioRecorderOpen] = useState<boolean>(false);
  const [teacherAudioCount, setTeacherAudioCount] = useState<number>(() => teacherAudioService.getCount());

  const handleSelectRole = (role: UserRole) => {
    if (role === 'teacher') {
      if (!teacherAuthService.isAuthenticated()) {
        setIsTeacherLoginOpen(true);
        return;
      }
      navigate('/teacher');
    } else if (role === 'parent') {
      navigate('/parent');
    } else {
      navigate('/student');
    }
    setUserRole(role);
    localStorage.setItem('tv1_user_role', role);
    speechService.playSoundEffect('pop');
  };

  const handleTeacherLogout = () => {
    teacherAuthService.logout();
    setIsTeacherAuthenticated(false);
    setUserRole('student');
    navigate('/');
    speechService.playSoundEffect('pop');
  };

  const handleTeacherLoginSuccess = (teacher: AppUserProfile) => {
    setIsTeacherAuthenticated(true);
    setActiveUser(teacher);
    setUserRole('teacher');
    localStorage.setItem('tv1_user_role', 'teacher');
    navigate('/teacher');
  };

  useEffect(() => {
    if (location.pathname.startsWith('/teacher')) {
       setUserRole('teacher');
    } else if (location.pathname.startsWith('/parent')) {
       setUserRole('parent');
    } else if (location.pathname.startsWith('/student')) {
       setUserRole('student');
    }
  }, [location.pathname]);

  // Subscribe to storage & achievement & teacher audio changes
  useEffect(() => {
    const unsubscribeLessons = lessonStorageService.subscribe(() => {
      setCustomizedCount(lessonStorageService.getStats().totalCustomCount);
      
      if (selectedVol1Lesson) {
        const fresh = lessonStorageService.getVolume1Lesson(selectedVol1Lesson.id);
        if (fresh) setSelectedVol1Lesson(fresh);
      }
      if (selectedVol2Lesson) {
        const fresh = lessonStorageService.getVolume2Lesson(selectedVol2Lesson.id);
        if (fresh) setSelectedVol2Lesson(fresh);
      }
    });

    const unsubscribeTeacherAudio = teacherAudioService.subscribe(() => {
      setTeacherAudioCount(teacherAudioService.getCount());
    });

    const unsubscribeAchievements = achievementService.subscribe((state, newBadges) => {
      if (newBadges.length > 0) {
        setUnlockedBadgesToCelebrate(newBadges);
        speechService.playSoundEffect('fanfare');
      }
      setStarsCount(state.starsCount);
    });

    const unsubscribeUserProfile = userProfileService.subscribe((current) => {
      setActiveUser(current);
      if (current.role) {
        if (current.role === 'teacher' && !teacherAuthService.isAuthenticated()) {
          setUserRole('student');
        } else {
          setUserRole(current.role);
        }
      }
      if (current.role === 'student') {
        setStarsCount(current.starsCount || 0);
      }
    });

    const unsubscribeTeacherAuth = teacherAuthService.subscribe((session) => {
      setIsTeacherAuthenticated(session !== null && session.isAuthenticated);
      if (!session || !session.isAuthenticated) {
        if (userRole === 'teacher') {
          setUserRole('student');
        }
      }
    });

    return () => {
      unsubscribeLessons();
      unsubscribeTeacherAudio();
      unsubscribeAchievements();
      unsubscribeUserProfile();
      unsubscribeTeacherAuth();
    };
  }, [selectedVol1Lesson?.id, selectedVol2Lesson?.id, userRole]);

  const handleAddStar = () => {
    setStarsCount(prev => {
      const next = prev + 1;
      localStorage.setItem('tv1_stars', next.toString());
      return next;
    });

    if (activeUser.role === 'student') {
      userProfileService.updateUser(activeUser.id, {
        starsCount: (activeUser.starsCount || 0) + 1
      });
    }

    // Trigger confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleOpenWritingPractice = (sampleText: string) => {
    setWritingSampleText(sampleText);
    setCurrentTab('practice');
    speechService.playSoundEffect('pop');
  };

  const handleTabChange = (tab: 'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice') => {
    setCurrentTab(tab);
    // Reset selected lessons when clicking main tabs for high level overview
    if (tab === 'volume1') setSelectedVol1Lesson(null);
    if (tab === 'volume2') setSelectedVol2Lesson(null);
    speechService.playSoundEffect('pop');
  };

  // Open editor for Volume 1 lesson
  const handleOpenEditVol1 = (lesson: Volume1Lesson) => {
    setEditorVolume('vol1');
    setEditingVol1Lesson(lesson);
    setEditingVol2Lesson(undefined);
    setIsEditorOpen(true);
  };

  // Open editor for Volume 2 lesson
  const handleOpenEditVol2 = (lesson: Volume2Lesson) => {
    setEditorVolume('vol2');
    setEditingVol2Lesson(lesson);
    setEditingVol1Lesson(undefined);
    setIsEditorOpen(true);
  };

  // When editor saves successfully
  const handleEditorSaveSuccess = (updatedLesson: Volume1Lesson | Volume2Lesson) => {
    if (editorVolume === 'vol1') {
      if (selectedVol1Lesson?.id === updatedLesson.id) {
        setSelectedVol1Lesson(updatedLesson as Volume1Lesson);
      }
    } else {
      if (selectedVol2Lesson?.id === updatedLesson.id) {
        setSelectedVol2Lesson(updatedLesson as Volume2Lesson);
      }
    }
  };

  // Volume 1 previous / next navigation
  const allVol1Lessons = lessonStorageService.getVolume1Lessons();
  const vol1CurrentIndex = selectedVol1Lesson
    ? allVol1Lessons.findIndex(l => l.id === selectedVol1Lesson.id)
    : -1;
  const vol1HasPrevious = vol1CurrentIndex > 0;
  const vol1HasNext = vol1CurrentIndex !== -1 && vol1CurrentIndex < allVol1Lessons.length - 1;

  const handleVol1Prev = () => {
    if (vol1HasPrevious) {
      setSelectedVol1Lesson(allVol1Lessons[vol1CurrentIndex - 1]);
      speechService.playSoundEffect('pop');
    }
  };

  const handleVol1Next = () => {
    if (vol1HasNext) {
      setSelectedVol1Lesson(allVol1Lessons[vol1CurrentIndex + 1]);
      speechService.playSoundEffect('pop');
    }
  };

  // Volume 2 previous / next navigation across topics
  const allVol2Lessons = lessonStorageService.getTopicGroups().flatMap(g => g.lessons);
  const vol2CurrentIndex = selectedVol2Lesson
    ? allVol2Lessons.findIndex(l => l.id === selectedVol2Lesson.id)
    : -1;
  const vol2HasPrevious = vol2CurrentIndex > 0;
  const vol2HasNext = vol2CurrentIndex !== -1 && vol2CurrentIndex < allVol2Lessons.length - 1;

  const handleVol2Prev = () => {
    if (vol2HasPrevious) {
      setSelectedVol2Lesson(allVol2Lessons[vol2CurrentIndex - 1]);
      speechService.playSoundEffect('pop');
    }
  };

  const handleVol2Next = () => {
    if (vol2HasNext) {
      setSelectedVol2Lesson(allVol2Lessons[vol2CurrentIndex + 1]);
      speechService.playSoundEffect('pop');
    }
  };

  // Voice Recorder Handlers
  const handleOpenVoiceRecorder = (target: RecordingTargetInfo) => {
    setVoiceRecorderTarget(target);
    setIsVoiceRecorderOpen(true);
    speechService.playSoundEffect('pop');
  };

  const handleOpenTeacherRecorder = (target: TeacherAudioTarget) => {
    setTeacherAudioTarget(target);
    setIsTeacherAudioRecorderOpen(true);
    speechService.playSoundEffect('pop');
  };

  const handleOpenVoiceStudio = () => {
    if (selectedVol1Lesson) {
      setVoiceRecorderTarget({
        volume: 'vol1',
        lessonId: selectedVol1Lesson.id,
        lessonNumber: selectedVol1Lesson.lessonNumber,
        lessonTitle: `Bài ${selectedVol1Lesson.lessonNumber}: ${selectedVol1Lesson.title}`,
        sectionTitle: 'Bài đọc luyện tập',
        targetText: `${selectedVol1Lesson.part1_Letters.recognitionSentence}\n\n${selectedVol1Lesson.part3_SentenceAndPractice.readingPassage}`
      });
    } else if (selectedVol2Lesson) {
      setVoiceRecorderTarget({
        volume: 'vol2',
        lessonId: selectedVol2Lesson.id,
        lessonNumber: selectedVol2Lesson.lessonNumber,
        lessonTitle: `${selectedVol2Lesson.title} (${selectedVol2Lesson.topicTitle})`,
        sectionTitle: 'Toàn bộ bài đọc',
        targetText: `${selectedVol2Lesson.reading.title}\n\n${selectedVol2Lesson.reading.content.join('\n\n')}`,
        referenceAudioText: `${selectedVol2Lesson.reading.title}. ${selectedVol2Lesson.reading.content.join(' ')}`
      });
    } else {
      // Default to Lesson 1 if not inside a specific lesson
      const defaultL1 = lessonStorageService.getVolume1Lesson(1);
      if (defaultL1) {
        setVoiceRecorderTarget({
          volume: 'vol1',
          lessonId: defaultL1.id,
          lessonNumber: defaultL1.lessonNumber,
          lessonTitle: `Bài ${defaultL1.lessonNumber}: ${defaultL1.title}`,
          sectionTitle: 'Luyện đọc cơ bản',
          targetText: `${defaultL1.part1_Letters.recognitionSentence}\n\n${defaultL1.part3_SentenceAndPractice.readingPassage}`
        });
      }
    }
    setIsVoiceRecorderOpen(true);
    speechService.playSoundEffect('pop');
  };

  if (location.pathname === '/') {
    return <LandingPage onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      
      {/* Global Navigation Header with Role Selector */}
      <Header
        userRole={userRole}
        onSelectRole={handleSelectRole}
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        starsCount={starsCount}
        customizedCount={customizedCount}
        teacherAudioCount={teacherAudioCount}
        activeUser={activeUser}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onTeacherLogout={handleTeacherLogout}
        onOpenTeacherLogin={() => setIsTeacherLoginOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenGoogleWorkspace={() => setIsGoogleWorkspaceOpen(true)}
        onOpenTeacherManagement={() => setIsTeacherMgmtOpen(true)}
        onOpenTeacherAudioStudio={() => setIsTeacherAudioStudioOpen(true)}
        onOpenVoiceStudio={handleOpenVoiceStudio}
        onOpenAchievements={() => setIsAchievementModalOpen(true)}
      />

      {/* Main View Area based on User Role */}
      <main className="flex-1 pb-20 md:pb-12">
        <Routes>
          {/* 1. TEACHER PORTAL */}
          <Route path="/teacher/*" element={
            <TeacherPortalView
              onSelectVol1Lesson={(lesson) => {
                navigate('/student');
                setUserRole('student');
                setCurrentTab('volume1');
                setSelectedVol1Lesson(lesson);
              }}
              onSelectVol2Lesson={(lesson) => {
                navigate('/student');
                setUserRole('student');
                setCurrentTab('volume2');
                setSelectedVol2Lesson(lesson);
              }}
              onOpenVol1Editor={handleOpenEditVol1}
              onOpenVol2Editor={handleOpenEditVol2}
              onOpenTeacherRecorder={handleOpenTeacherRecorder}
              onSwitchToStudentView={() => handleSelectRole('student')}
              onOpenGoogleWorkspace={() => setIsGoogleWorkspaceOpen(true)}
              onLogout={handleTeacherLogout}
              onOpenTeacherLogin={() => setIsTeacherLoginOpen(true)}
            />
          } />

          {/* 2. PARENT PORTAL */}
          <Route path="/parent/*" element={
            <ParentPortalView
              starsCount={starsCount}
              onOpenAchievements={() => setIsAchievementModalOpen(true)}
              onOpenVoiceStudio={handleOpenVoiceStudio}
              onOpenGoogleWorkspace={() => setIsGoogleWorkspaceOpen(true)}
              onSelectVolume1={() => {
                navigate('/student');
                setUserRole('student');
                setCurrentTab('volume1');
                setSelectedVol1Lesson(null);
              }}
              onSelectVolume2={() => {
                navigate('/student');
                setUserRole('student');
                setCurrentTab('volume2');
                setSelectedVol2Lesson(null);
              }}
            />
          } />

          {/* 3. STUDENT PORTAL (Interactive Lessons & Practice) */}
          <Route path="/student/*" element={
            <>
              {/* Teacher banner indicator if teacher is previewing in student role */}
              {isTeacherAuthenticated && (
                <div className="bg-purple-50 border-b border-purple-200/80 px-4 py-2 text-xs text-purple-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white px-2 py-0.5 rounded-md font-bold text-[11px]">
                      👩‍🏫 Quyền Giáo Viên
                    </span>
                    <span>Đang mở giao diện học sinh (Bạn có thể bấm <strong>"Sửa bài"</strong> hoặc <strong>"Sửa giọng GV"</strong> ở từng bài học).</span>
                  </div>
                  <button
                    onClick={() => handleSelectRole('teacher')}
                    className="font-bold text-purple-700 hover:text-purple-900 underline ml-2 cursor-pointer whitespace-nowrap"
                  >
                    Về Cổng Giáo Viên →
                  </button>
                </div>
              )}

              {currentTab === 'intro' && (
                <IntroView
                  onOpenWritingPractice={handleOpenWritingPractice}
                  onAddStar={handleAddStar}
                />
              )}

              {currentTab === 'volume1' && (
                selectedVol1Lesson ? (
                  <Volume1LessonView
                    lesson={selectedVol1Lesson}
                    onPreviousLesson={handleVol1Prev}
                    onNextLesson={handleVol1Next}
                    hasPrevious={vol1HasPrevious}
                    hasNext={vol1HasNext}
                    onOpenWritingPractice={handleOpenWritingPractice}
                    onAddStar={handleAddStar}
                    onEditLesson={isTeacherAuthenticated ? () => handleOpenEditVol1(selectedVol1Lesson) : undefined}
                    onOpenVoiceRecorder={handleOpenVoiceRecorder}
                    onOpenTeacherRecorder={isTeacherAuthenticated ? handleOpenTeacherRecorder : undefined}
                    onUnlockBadges={(newBadges) => setUnlockedBadgesToCelebrate(newBadges)}
                    onBackToList={() => {
                      setSelectedVol1Lesson(null);
                      speechService.playSoundEffect('pop');
                    }}
                  />
                ) : (
                  <Volume1Grid
                    onSelectLesson={(lesson) => setSelectedVol1Lesson(lesson)}
                    onEditLesson={isTeacherAuthenticated ? handleOpenEditVol1 : undefined}
                    searchQuery={searchQuery}
                  />
                )
              )}

              {currentTab === 'volume2' && (
                selectedVol2Lesson ? (
                  <Volume2LessonView
                    lesson={selectedVol2Lesson}
                    onPreviousLesson={handleVol2Prev}
                    onNextLesson={handleVol2Next}
                    hasPrevious={vol2HasPrevious}
                    hasNext={vol2HasNext}
                    onOpenWritingPractice={handleOpenWritingPractice}
                    onAddStar={handleAddStar}
                    onEditLesson={isTeacherAuthenticated ? () => handleOpenEditVol2(selectedVol2Lesson) : undefined}
                    onOpenVoiceRecorder={handleOpenVoiceRecorder}
                    onOpenTeacherRecorder={isTeacherAuthenticated ? handleOpenTeacherRecorder : undefined}
                    onBackToList={() => {
                      setSelectedVol2Lesson(null);
                      speechService.playSoundEffect('pop');
                    }}
                  />
                ) : (
                  <Volume2Grid
                    onSelectLesson={(lesson) => setSelectedVol2Lesson(lesson)}
                    onEditLesson={isTeacherAuthenticated ? handleOpenEditVol2 : undefined}
                    searchQuery={searchQuery}
                  />
                )
              )}

              {currentTab === 'alphabet' && (
                <AlphabetBoard
                  onOpenTeacherRecorder={isTeacherAuthenticated ? handleOpenTeacherRecorder : undefined}
                />
              )}

              {currentTab === 'practice' && (
                <div className="py-6 px-4">
                  <WritingBoard
                    initialSampleText={writingSampleText}
                    onSuccessReward={handleAddStar}
                  />
                </div>
              )}
            </>
          } />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Teacher Global Management Modal */}
      <TeacherManagementModal
        isOpen={isTeacherMgmtOpen}
        onClose={() => setIsTeacherMgmtOpen(false)}
        onSelectEditVol1={(lesson) => {
          setIsTeacherMgmtOpen(false);
          handleOpenEditVol1(lesson);
        }}
        onSelectEditVol2={(lesson) => {
          setIsTeacherMgmtOpen(false);
          handleOpenEditVol2(lesson);
        }}
        onDataChanged={() => {
          setCustomizedCount(lessonStorageService.getStats().totalCustomCount);
        }}
      />

      {/* Teacher Lesson Editor Modal */}
      <TeacherLessonEditorModal
        isOpen={isEditorOpen}
        volume={editorVolume}
        vol1Lesson={editingVol1Lesson}
        vol2Lesson={editingVol2Lesson}
        onClose={() => setIsEditorOpen(false)}
        onSaveSuccess={(updated) => {
          handleEditorSaveSuccess(updated);
        }}
        onOpenTeacherRecorder={handleOpenTeacherRecorder}
      />

      {/* Teacher Audio Studio Management Modal */}
      <TeacherAudioStudioModal
        isOpen={isTeacherAudioStudioOpen}
        onClose={() => setIsTeacherAudioStudioOpen(false)}
        onOpenRecorder={handleOpenTeacherRecorder}
      />

      {/* Teacher Audio Single Item Recorder Modal */}
      <TeacherAudioRecorderModal
        isOpen={isTeacherAudioRecorderOpen}
        onClose={() => setIsTeacherAudioRecorderOpen(false)}
        target={teacherAudioTarget}
      />

      {/* Student Voice Studio & Recorder Modal */}
      <StudentVoiceRecorderModal
        isOpen={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
        targetInfo={voiceRecorderTarget}
        onAddStar={handleAddStar}
      />

      {/* Multi-User Profile Switcher & Manager Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUserSwitched={(user) => {
          if (user.role === 'teacher' && !teacherAuthService.isAuthenticated()) {
            setIsProfileModalOpen(false);
            setIsTeacherLoginOpen(true);
            return;
          }
          setActiveUser(user);
          setUserRole(user.role);
          if (user.role === 'student') {
            setStarsCount(user.starsCount || 0);
          }
        }}
      />

      {/* Teacher Authentication / PIN Login Modal */}
      <TeacherLoginModal
        isOpen={isTeacherLoginOpen}
        onClose={() => setIsTeacherLoginOpen(false)}
        onSuccess={handleTeacherLoginSuccess}
      />

      {/* Google Workspace Cloud Sync & Drive/Sheets/Classroom Modal */}
      <GoogleWorkspaceModal
        isOpen={isGoogleWorkspaceOpen}
        onClose={() => setIsGoogleWorkspaceOpen(false)}
      />

      {/* Achievement Collection & Celebration Modals */}
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
      />

      {unlockedBadgesToCelebrate.length > 0 && (
        <AchievementUnlockModal
          badges={unlockedBadgesToCelebrate}
          onClose={() => setUnlockedBadgesToCelebrate([])}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-amber-100 py-6 text-center text-xs text-amber-900/80 mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-950 font-serif">Tiếng Việt Lớp 1</span>
            <span>•</span>
            <span>Bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)</span>
          </div>
          <div className="text-slate-500">
            Tập 1: 83 bài học Âm - Tiếng - Từ - Câu • Tập 2: 8 Chủ điểm Đọc hiểu & Luyện tập
          </div>
        </div>
      </footer>

      {/* Mobile Floating Ergonomic Bottom Bar */}
      <MobileNavBar
        userRole={userRole}
        onSelectRole={handleSelectRole}
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        onOpenAchievements={() => setIsAchievementModalOpen(true)}
        onOpenVoiceStudio={handleOpenVoiceStudio}
        starsCount={starsCount}
        activeUser={activeUser}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

    </div>
  );
}
