import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Volume1Grid } from './components/Volume1Grid';
import { Volume1LessonView } from './components/Volume1LessonView';
import { Volume2Grid } from './components/Volume2Grid';
import { Volume2LessonView } from './components/Volume2LessonView';
import { AlphabetBoard } from './components/AlphabetBoard';
import { WritingBoard } from './components/WritingBoard';
import { IntroView } from './components/IntroView';
import { TeacherManagementModal } from './components/TeacherManagementModal';
import { TeacherLessonEditorModal } from './components/TeacherLessonEditorModal';
import { StudentVoiceRecorderModal } from './components/StudentVoiceRecorderModal';
import { AchievementModal } from './components/AchievementModal';
import { AchievementUnlockModal } from './components/AchievementUnlockModal';
import { Volume1Lesson, Volume2Lesson, RecordingTargetInfo, AchievementBadge } from './types';
import { lessonStorageService } from './services/lessonStorageService';
import { achievementService } from './services/achievementService';
import { speechService } from './services/speechService';
import confetti from 'canvas-confetti';
import { BookOpen, Sparkles, Home, ArrowLeft, Mic } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'intro' | 'volume1' | 'volume2' | 'alphabet' | 'practice'>('volume1');
  const [selectedVol1Lesson, setSelectedVol1Lesson] = useState<Volume1Lesson | null>(null);
  const [selectedVol2Lesson, setSelectedVol2Lesson] = useState<Volume2Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [writingSampleText, setWritingSampleText] = useState<string>('a ă â b c d đ');
  const [starsCount, setStarsCount] = useState<number>(() => {
    const saved = localStorage.getItem('tv1_stars');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Achievement Modals State
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState<boolean>(false);
  const [unlockedBadgeQueue, setUnlockedBadgeQueue] = useState<AchievementBadge[]>([]);

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

  // Subscribe to storage & achievement changes to update badges and active lesson
  useEffect(() => {
    const unsubLesson = lessonStorageService.subscribe(() => {
      setCustomizedCount(lessonStorageService.getStats().totalCustomCount);
      
      // If currently viewing a lesson, refresh it with latest customized version
      if (selectedVol1Lesson) {
        const fresh = lessonStorageService.getVolume1Lesson(selectedVol1Lesson.id);
        if (fresh) setSelectedVol1Lesson(fresh);
      }
      if (selectedVol2Lesson) {
        const fresh = lessonStorageService.getVolume2Lesson(selectedVol2Lesson.id);
        if (fresh) setSelectedVol2Lesson(fresh);
      }
    });

    const unsubAchievement = achievementService.subscribe(() => {
      // Force re-render if necessary for title & stats
    });

    return () => {
      unsubLesson();
      unsubAchievement();
    };
  }, [selectedVol1Lesson?.id, selectedVol2Lesson?.id]);

  const handleUnlockBadges = (newBadges: AchievementBadge[]) => {
    if (newBadges && newBadges.length > 0) {
      setUnlockedBadgeQueue(prev => [...prev, ...newBadges]);
    }
  };

  const handleDismissUnlockModal = () => {
    setUnlockedBadgeQueue(prev => prev.slice(1));
  };

  const handleJumpToLesson = (volume: 'vol1' | 'vol2', lessonId: number | string) => {
    setIsAchievementModalOpen(false);
    if (volume === 'vol1') {
      const lesson = lessonStorageService.getVolume1Lesson(lessonId);
      if (lesson) {
        setCurrentTab('volume1');
        setSelectedVol1Lesson(lesson);
        setSelectedVol2Lesson(null);
      }
    } else {
      const lesson = lessonStorageService.getVolume2Lesson(lessonId);
      if (lesson) {
        setCurrentTab('volume2');
        setSelectedVol2Lesson(lesson);
        setSelectedVol1Lesson(null);
      }
    }
  };

  const handleAddStar = () => {
    setStarsCount(prev => {
      const next = prev + 1;
      localStorage.setItem('tv1_stars', next.toString());
      return next;
    });

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

  return (
    <div className="min-h-screen bg-[#fffdfa] text-slate-800 flex flex-col font-sans selection:bg-amber-200">
      
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        starsCount={starsCount}
        customizedCount={customizedCount}
        onOpenTeacherManagement={() => setIsTeacherMgmtOpen(true)}
        onOpenVoiceStudio={handleOpenVoiceStudio}
        onOpenAchievements={() => setIsAchievementModalOpen(true)}
      />

      {/* Breadcrumb / Back Button when deep inside a lesson */}
      {(selectedVol1Lesson || selectedVol2Lesson) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
          <button
            id="back-to-grid-btn"
            onClick={() => {
              setSelectedVol1Lesson(null);
              setSelectedVol2Lesson(null);
              speechService.playSoundEffect('pop');
            }}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 bg-amber-100/70 hover:bg-amber-200/90 px-3.5 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {selectedVol1Lesson ? '← Quay lại danh sách 83 bài Tập 1' : '← Quay lại 8 Chủ điểm Tập 2'}
            </span>
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 pb-12">
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
              onEditLesson={() => handleOpenEditVol1(selectedVol1Lesson)}
              onOpenVoiceRecorder={handleOpenVoiceRecorder}
              onUnlockBadges={handleUnlockBadges}
            />
          ) : (
            <Volume1Grid
              onSelectLesson={(lesson) => setSelectedVol1Lesson(lesson)}
              onEditLesson={handleOpenEditVol1}
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
              onEditLesson={() => handleOpenEditVol2(selectedVol2Lesson)}
              onOpenVoiceRecorder={handleOpenVoiceRecorder}
              onUnlockBadges={handleUnlockBadges}
            />
          ) : (
            <Volume2Grid
              onSelectLesson={(lesson) => setSelectedVol2Lesson(lesson)}
              onEditLesson={handleOpenEditVol2}
              searchQuery={searchQuery}
            />
          )
        )}

        {currentTab === 'alphabet' && (
          <AlphabetBoard />
        )}

        {currentTab === 'practice' && (
          <div className="py-6 px-4">
            <WritingBoard
              initialSampleText={writingSampleText}
              onSuccessReward={handleAddStar}
              onUnlockBadges={handleUnlockBadges}
            />
          </div>
        )}
      </main>

      {/* Academic Honors & Badges Dashboard Modal */}
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        onSelectLesson={handleJumpToLesson}
      />

      {/* Celebratory Badge Unlock Modal */}
      <AchievementUnlockModal
        badge={unlockedBadgeQueue[0] || null}
        onClose={handleDismissUnlockModal}
        onOpenAllAchievements={() => {
          handleDismissUnlockModal();
          setIsAchievementModalOpen(true);
        }}
      />

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
      />

      {/* Student Voice Studio & Recorder Modal */}
      <StudentVoiceRecorderModal
        isOpen={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
        targetInfo={voiceRecorderTarget}
        onAddStar={handleAddStar}
        onUnlockBadges={handleUnlockBadges}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-amber-100 py-6 text-center text-xs text-amber-900/80">
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

    </div>
  );
}
