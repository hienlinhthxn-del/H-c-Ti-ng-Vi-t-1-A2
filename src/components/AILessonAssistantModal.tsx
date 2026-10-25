import React, { useState } from 'react';
import { Volume1Lesson, Volume2Lesson } from '../types';
import { lessonStorageService } from '../services/lessonStorageService';
import { speechService } from '../services/speechService';
import { 
  X, 
  Sparkles, 
  Bot, 
  Copy, 
  Check, 
  BookOpen, 
  HelpCircle, 
  TreePine, 
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AILessonAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToLesson?: (lessonId: number, newPassage: string) => void;
}

export const AILessonAssistantModal: React.FC<AILessonAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyToLesson
}) => {
  const [selectedVol, setSelectedVol] = useState<'vol1' | 'vol2'>('vol1');
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const vol1Lessons = lessonStorageService.getVolume1Lessons();
  const vol2Lessons = lessonStorageService.getTopicGroups().flatMap(g => g.lessons);

  const currentVol1 = vol1Lessons.find(l => l.id === selectedLessonId) || vol1Lessons[0];
  const currentVol2 = vol2Lessons.find(l => l.id === selectedLessonId) || vol2Lessons[0];

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    speechService.playSoundEffect('pop');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate specialized educational suggestions dynamically based on the exact selected lesson
  const buildVol1AssistantData = (lesson: Volume1Lesson) => {
    const letters = (lesson.part1_Letters.letters || []).join(', ');
    const wordsList = lesson.part2_SyllablesAndWords.words || [];
    const syllablesList = lesson.part2_SyllablesAndWords.readingSyllables || [];
    const modelsList = lesson.part2_SyllablesAndWords.models || [];
    const recSentence = lesson.part1_Letters.recognitionSentence || '';
    const recKeywords = lesson.part1_Letters.recognitionKeywords || [];

    // Pick best target words from the lesson for the riddle
    const primaryWordObj = wordsList.find(w => w.word && w.word.length > 1) || wordsList[0];
    const primaryWord = primaryWordObj?.word || recKeywords[0] || syllablesList[0] || lesson.title;
    const primaryMeaning = primaryWordObj?.meaning || primaryWordObj?.imageDesc || `từ ngữ có chứa âm/vần ${letters}`;
    const primaryIcon = primaryWordObj?.illustrationIcon || '🌟';

    // All answer hints from this lesson's vocabulary
    const answerHints = Array.from(
      new Set([
        ...wordsList.map(w => w.word).filter(Boolean),
        ...recKeywords.filter(Boolean),
        ...syllablesList.slice(0, 4).filter(Boolean)
      ])
    ).slice(0, 5);

    // Build a custom 4-line poetic riddle tailored to this lesson's words, meaning, and recognition sentence
    let riddleLines: string[] = [];
    if (lesson.lessonNumber === 1) {
      riddleLines = [
        'Miệng tròn há rộng thật tươi',
        'Nam, Hà ca hát vui cười ngân nga',
        'Đầu bảng chữ cái mở ra',
        `Đố bé chữ gì đọc là "${letters}"?`
      ];
    } else if (recSentence && primaryWordObj?.meaning) {
      riddleLines = [
        `${primaryIcon} Nhìn tranh nhớ câu: "${recSentence}"`,
        `Có "${primaryMeaning}" thật là thân quen`,
        `Ghép âm, ghép vần đọc lên`,
        `Có âm "${letters}" bé tìm từ chi?`
      ];
    } else if (primaryWordObj?.meaning) {
      riddleLines = [
        `${primaryIcon} Đố bé: Thấy hình "${primaryMeaning}"`,
        `Trong Bài ${lesson.lessonNumber} chúng mình cùng chăm`,
        `Đánh vần tiếng mới thật nhanh`,
        `Có âm "${letters}" đọc thành từ chi?`
      ];
    } else {
      riddleLines = [
        `🌟 Bài ${lesson.lessonNumber} vui học hôm nay`,
        `Cùng nhau ghép tiếng bàn tay chỉ đều`,
        `Đố bé tìm tiếng thân yêu`,
        `Chứa âm "${letters}" đọc nhiều nhớ lâu?`
      ];
    }

    const answerHintStr = answerHints.length > 0 ? answerHints.join(' / ') : primaryWord;

    // Level 1 (Basic phonics & words from THIS lesson)
    const modelResults = modelsList.map(m => m.result).filter(Boolean);
    const wordTexts = wordsList.map(w => w.word).filter(Boolean);
    const level1Items = Array.from(
      new Set([
        ...modelResults,
        ...syllablesList.slice(0, 4),
        ...wordTexts
      ])
    ).slice(0, 8);
    const level1Text = level1Items.length > 0 ? level1Items.join(' - ') : letters;

    // Level 2 (Fluency passage & recognition sentence from THIS lesson)
    const passage = lesson.part3_SentenceAndPractice.readingPassage || '';
    const level2Text = passage && passage.length > 5
      ? passage
      : [recSentence, passage].filter(Boolean).join(' ');

    // Card 3: Speaking topic & Writing samples from THIS lesson + Nature/Highland integration
    const speakingTitle = lesson.part3_SentenceAndPractice.speakingTopic?.title || `Luyện nói theo Bài ${lesson.lessonNumber}`;
    const speakingPrompt = lesson.part3_SentenceAndPractice.speakingTopic?.prompt || '';
    const speakingQuestions = lesson.part3_SentenceAndPractice.speakingTopic?.questions || [];
    const writingText = (lesson.part3_SentenceAndPractice.writingSamples || []).join(', ');
    const sampleWordsInline = wordTexts.slice(0, 3).join(', ') || primaryWord;

    const activityText = [
      speakingPrompt ? `• Chủ đề luyện nói (${speakingTitle}): ${speakingPrompt}` : '',
      speakingQuestions.length > 0 ? `• Câu hỏi gợi mở cho HS: ${speakingQuestions.join(' / ')}` : '',
      writingText ? `• Mẫu chữ tập viết ô ly trong bài: ${writingText}` : '',
      `• Câu mở rộng gắn với thiên nhiên & bản làng (chứa từ trong bài): "Ở bản em, cảnh vật thật tươi đẹp. Chúng em cùng nhau luyện đọc từ mới (${sampleWordsInline}) và giữ gìn trường lớp xanh - sạch - đẹp."`
    ].filter(Boolean).join('\n');

    return {
      riddleLines,
      answerHintStr,
      level1Text,
      level2Text,
      speakingTitle,
      speakingPrompt,
      speakingQuestions,
      writingText,
      sampleWordsInline,
      activityText
    };
  };

  const buildVol2AssistantData = (lesson: Volume2Lesson) => {
    const vocabList = lesson.reading.vocabulary || [];
    const firstVocab = vocabList[0];
    const secondVocab = vocabList[1];
    const warmupPrompt = lesson.warmup?.prompt || '';
    const firstQuestion = lesson.comprehensionQuestions?.[0];

    const riddleLines = [
      `📖 Chủ điểm "${lesson.topicTitle}" thân thương`,
      warmupPrompt ? `Khởi động: ${warmupPrompt}` : `Cùng đọc bài "${lesson.reading.title}" hôm nay`,
      firstVocab ? `Từ mới "${firstVocab.word}" (${firstVocab.meaning})` : `Đố bé câu hỏi thú vị này:`,
      firstQuestion ? `Đố bé: ${firstQuestion.question}` : `Đố bé điều hay trong bài là gì?`
    ];

    const answerHintStr = firstQuestion?.sampleAnswer || vocabList.map(v => v.word).join(' / ') || lesson.reading.title;
    const level1Text = vocabList.length > 0
      ? vocabList.map(v => `${v.word} (${v.meaning})`).join(' • ')
      : (lesson.reading.phonicsFocus || []).join(' - ') || lesson.reading.title;
    const level2Text = lesson.practice?.dictationText || lesson.reading.content?.[0] || '';
    const activityText = [
      lesson.practice?.writingPrompt ? `• Luyện viết: ${lesson.practice.writingPrompt}` : '',
      lesson.practice?.spellingExercise?.prompt ? `• Bài tập chính tả: ${lesson.practice.spellingExercise.prompt}` : '',
      secondVocab ? `• Mở rộng từ vựng: "${secondVocab.word}" – ${secondVocab.meaning}` : ''
    ].filter(Boolean).join('\n');

    return {
      riddleLines,
      answerHintStr,
      level1Text,
      level2Text,
      speakingTitle: lesson.topicTitle,
      speakingPrompt: warmupPrompt,
      speakingQuestions: (lesson.comprehensionQuestions || []).map(q => q.question),
      writingText: lesson.practice?.writingPrompt || '',
      sampleWordsInline: vocabList.map(v => v.word).join(', '),
      activityText
    };
  };

  const activeData = selectedVol === 'vol1'
    ? buildVol1AssistantData(currentVol1)
    : buildVol2AssistantData(currentVol2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 text-white flex items-center justify-between relative shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
                  Trợ Lý AI Giáo Viên 4.0
                </span>
                <span className="text-[11px] font-bold bg-amber-300 text-amber-950 px-2 py-0.5 rounded-full">
                  Soạn Bài & Phân Hóa Học Tập
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-serif mt-0.5">
                Gợi Ý Ngữ Liệu & Câu Đố Tương Tác Tiếng Việt 1
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lesson Selector Bar */}
        <div className="p-4 bg-amber-50/60 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-950">Chọn tập:</span>
            <div className="inline-flex rounded-xl bg-white p-1 border border-amber-200 shadow-2xs">
              <button
                onClick={() => {
                  setSelectedVol('vol1');
                  setSelectedLessonId(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedVol === 'vol1' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tập 1 (83 bài Âm - Vần)
              </button>
              <button
                onClick={() => {
                  setSelectedVol('vol2');
                  setSelectedLessonId(vol2Lessons[0]?.id || 201);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedVol === 'vol2' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tập 2 (8 Chủ điểm)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
            <span className="text-xs font-bold text-amber-950 shrink-0">Chọn bài:</span>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(Number(e.target.value))}
              className="w-full p-2 bg-white rounded-xl border border-amber-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-2xs"
            >
              {selectedVol === 'vol1' ? (
                vol1Lessons.map(l => (
                  <option key={l.id} value={l.id}>
                    Bài {l.lessonNumber}: {l.title} (Âm: {l.part1_Letters.letters.join(', ')})
                  </option>
                ))
              ) : (
                vol2Lessons.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.topicTitle})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-gradient-to-b from-amber-50/20 to-white text-slate-800 text-xs sm:text-sm">
          
          {/* Card 1: Câu đố vui tương tác khởi động tiết học số */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-700 font-bold">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-black uppercase">1. Câu Đố Vui & Khởi Động Theo Đúng Nội Dung Bài Học</span>
              </div>
              <button
                onClick={() => handleCopy(
                  `${activeData.riddleLines.join('\n')}\n➔ Đáp án / Từ khóa trong bài: ${activeData.answerHintStr}`,
                  'riddle'
                )}
                className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'riddle' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'riddle' ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 font-reading font-medium leading-relaxed text-slate-800 space-y-1">
              {activeData.riddleLines.map((line, idx) => (
                <div key={idx} className="italic">
                  {line}
                </div>
              ))}
              <span className="text-emerald-700 font-bold not-italic pt-1.5 block">
                ➔ Gợi ý đáp án & từ khóa trong bài: {activeData.answerHintStr}
              </span>
            </div>
          </div>

          {/* Card 2: Ngữ liệu phân hóa (Dành cho học sinh rụt rè / Học sinh dân tộc thiểu số rèn âm) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-purple-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-800 font-bold">
                <Layers className="w-4 h-4" />
                <span className="text-sm font-black uppercase">2. Từ Ngữ & Câu Đọc Phân Hóa Theo Bài Học</span>
              </div>
              <button
                onClick={() => handleCopy(
                  `Mức 1 (Luyện tiếng & từ ngữ trong bài): ${activeData.level1Text}\nMức 2 (Luyện đọc câu/đoạn trong bài): ${activeData.level2Text}`,
                  'diff'
                )}
                className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'diff' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'diff' ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
                <span className="font-bold text-purple-950 block text-xs">Mức 1: Tiếng & Từ ngữ trọng tâm của bài (Rèn phát âm)</span>
                <p className="text-slate-700 font-reading font-medium">
                  Luyện phát âm chậm, tròn môi: <strong className="text-purple-800">{activeData.level1Text}</strong>
                </p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 block text-xs">Mức 2: Đọc trơn câu nhận biết & đoạn văn trong bài</span>
                <p className="text-slate-700 font-reading font-medium">
                  Đọc diễn cảm cả câu: <strong className="text-emerald-800">{activeData.level2Text}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Gợi ý Luyện nói, Tập viết & Mở rộng theo đúng bài học */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <TreePine className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-black uppercase">3. Hoạt Động Luyện Nói, Tập Viết & Mở Rộng Theo Bài</span>
              </div>
              <button
                onClick={() => handleCopy(activeData.activityText, 'green')}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedKey === 'green' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'green' ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
            
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/80 font-reading font-medium leading-relaxed text-slate-800 whitespace-pre-line">
              {activeData.activityText}
            </div>
            <p className="text-[11px] text-emerald-800">
              💡 <em>Khi Thầy Cô đổi sang bài học khác ở góc trên bên phải, AI sẽ tự động trích xuất đúng âm vần, từ ngữ, câu đố và chủ đề luyện nói của bài học đó.</em>
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
