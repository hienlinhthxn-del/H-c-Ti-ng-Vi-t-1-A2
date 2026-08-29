import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Filter, Mic } from 'lucide-react';
import { speechService } from '../services/speechService';
import { teacherAudioService } from '../services/teacherAudioService';
import { TeacherAudioTarget } from './TeacherAudioRecorderModal';

interface AlphabetBoardProps {
  onOpenTeacherRecorder?: (target: TeacherAudioTarget) => void;
}

export const AlphabetBoard: React.FC<AlphabetBoardProps> = ({ onOpenTeacherRecorder }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'single' | 'compound' | 'tones' | 'rhymes'>('all');
  const [isTeacherVoiceEditMode, setIsTeacherVoiceEditMode] = useState<boolean>(false);
  const [, setAudioVersion] = useState<number>(0);

  useEffect(() => {
    const unsub = teacherAudioService.subscribe(() => {
      setAudioVersion(v => v + 1);
    });
    return unsub;
  }, []);

  const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string) => {
    e.stopPropagation();
    if (onOpenTeacherRecorder) {
      onOpenTeacherRecorder({
        targetText: text,
        volume: 'vol1',
        lessonId: 'alphabet-board',
        lessonNumber: 0,
        lessonTitle: 'Bảng Chữ Cái Tiếng Việt',
        sectionTitle
      });
    }
  };

  const singleLetters = [
    { letter: 'a', upper: 'A', name: 'a', example: 'quả na', icon: '🍐' },
    { letter: 'ă', upper: 'Ă', name: 'á', example: 'con trăn', icon: '🐍' },
    { letter: 'â', upper: 'Â', name: 'ớ', example: 'cây nấm', icon: '🍄' },
    { letter: 'b', upper: 'B', name: 'bê (bờ)', example: 'quả bơ', icon: '🥑' },
    { letter: 'c', upper: 'C', name: 'xê (cờ)', example: 'con cá', icon: '🐟' },
    { letter: 'd', upper: 'D', name: 'dê (dờ)', example: 'quả dưa', icon: '🍈' },
    { letter: 'đ', upper: 'Đ', name: 'đê (đờ)', example: 'hoa đào', icon: '🌸' },
    { letter: 'e', upper: 'E', name: 'e', example: 'con me (bê)', icon: '🐮' },
    { letter: 'ê', upper: 'Ê', name: 'ê', example: 'con ếch', icon: '🐸' },
    { letter: 'g', upper: 'G', name: 'giê (gờ)', example: 'con gà', icon: '🐔' },
    { letter: 'h', upper: 'H', name: 'hát (hờ)', example: 'hoa hồng', icon: '🌹' },
    { letter: 'i', upper: 'I', name: 'i ngắn', example: 'viên bi', icon: '🔮' },
    { letter: 'k', upper: 'K', name: 'ca (cờ)', example: 'cái kéo', icon: '✂️' },
    { letter: 'l', upper: 'L', name: 'e-lờ (lờ)', example: 'quả lê', icon: '🍐' },
    { letter: 'm', upper: 'M', name: 'e-mờ (mờ)', example: 'con mèo', icon: '🐱' },
    { letter: 'n', upper: 'N', name: 'e-nờ (nờ)', example: 'cái nơ', icon: '🎀' },
    { letter: 'o', upper: 'O', name: 'o', example: 'con ong', icon: '🐝' },
    { letter: 'ô', upper: 'Ô', name: 'ô', example: 'cái ô', icon: '☂️' },
    { letter: 'ơ', upper: 'Ơ', name: 'ơ', example: 'lá cờ', icon: '🚩' },
    { letter: 'p', upper: 'P', name: 'pê (pờ)', example: 'đèn pin', icon: '🔦' },
    { letter: 'q', upper: 'Q', name: 'quy (cu)', example: 'quả quế', icon: '🌿' },
    { letter: 'r', upper: 'R', name: 'e-rờ (rờ)', example: 'con rùa', icon: '🐢' },
    { letter: 's', upper: 'S', name: 'ét-sì (sờ)', example: 'ngôi sao', icon: '⭐' },
    { letter: 't', upper: 'T', name: 'tê (tờ)', example: 'con tàu', icon: '🚢' },
    { letter: 'u', upper: 'U', name: 'u', example: 'chim cú', icon: '🦉' },
    { letter: 'ư', upper: 'Ư', name: 'ư', example: 'con mực', icon: '🦑' },
    { letter: 'v', upper: 'V', name: 'vê (vờ)', example: 'con voi', icon: '🐘' },
    { letter: 'x', upper: 'X', name: 'ích-xì (xờ)', example: 'xe máy', icon: '🛵' },
    { letter: 'y', upper: 'Y', name: 'i dài', example: 'y tá', icon: '👩‍⚕️' }
  ];

  const compoundSounds = [
    { sound: 'ch', name: 'chờ', example: 'chú chó', icon: '🐕' },
    { sound: 'gh', name: 'gờ kép', example: 'cái ghế', icon: '🪑' },
    { sound: 'gi', name: 'giê (gi)', example: 'cơn gió', icon: '💨' },
    { sound: 'kh', name: 'khờ', example: 'con khỉ', icon: '🐒' },
    { sound: 'nh', name: 'nhờ', example: 'ngôi nhà', icon: '🏠' },
    { sound: 'ng', name: 'ngờ đơn', example: 'bắp ngô', icon: '🌽' },
    { sound: 'ngh', name: 'ngờ kép', example: 'chú nghé', icon: '🐃' },
    { sound: 'ph', name: 'phờ', example: 'đường phố', icon: '🏘️' },
    { sound: 'qu', name: 'quờ', example: 'quả quýt', icon: '🍊' },
    { sound: 'th', name: 'thờ', example: 'con thỏ', icon: '🐇' },
    { sound: 'tr', name: 'trờ', example: 'mặt trời', icon: '☀️' }
  ];

  const tones = [
    { name: 'Thanh ngang (Không dấu)', sign: '—', sample: 'ba', desc: 'Giọng đọc đều, bằng phẳng' },
    { name: 'Dấu Huyền ( ` )', sign: '`', sample: 'bà', desc: 'Giọng đi xuống thấp nhẹ nhàng' },
    { name: 'Dấu Sắc ( ´ )', sign: '´', sample: 'bá', desc: 'Giọng vút lên cao' },
    { name: 'Dấu Hỏi ( ? )', sign: '?', sample: 'bả', desc: 'Giọng trầm xuống rồi hơi cong lên' },
    { name: 'Dấu Ngã ( ~ )', sign: '~', sample: 'bã', desc: 'Giọng cong lên và có độ nhấn cao' },
    { name: 'Dấu Nặng ( . )', sign: '.', sample: 'bạ', desc: 'Giọng nhấn sâu, ngắt đột ngột' }
  ];

  const commonRhymes = [
    'an', 'at', 'am', 'ap', 'ac', 'ach', 'ai', 'ay', 'ao', 'au',
    'en', 'et', 'em', 'ep', 'ec', 'êch', 'on', 'ot', 'om', 'op',
    'in', 'it', 'im', 'ip', 'un', 'ut', 'um', 'up', 'ương', 'ươc',
    'iên', 'iêc', 'iêp', 'iêng', 'uôi', 'uôm', 'uôn', 'uông', 'oan', 'oat'
  ];

  const handlePlayLetter = (text: string) => {
    speechService.playSoundEffect('pop');
    speechService.speak(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100 mb-6">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔤</span>
              <h1 className="text-2xl sm:text-3xl font-black text-amber-950 font-serif">
                Bảng 29 Chữ Cái & Âm Thanh Tiếng Việt
              </h1>
            </div>
            <p className="text-slate-600 text-sm mt-1">
              Bấm vào từng chữ cái, âm ghép hoặc dấu thanh để lắng nghe giọng phát âm chuẩn tiếng Việt.
            </p>
          </div>

          {/* Filter tabs & Teacher Voice Mode */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenTeacherRecorder && (
              <button
                id="toggle-alphabet-teacher-voice-btn"
                onClick={() => {
                  setIsTeacherVoiceEditMode(!isTeacherVoiceEditMode);
                  speechService.playSoundEffect('pop');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer border ${
                  isTeacherVoiceEditMode
                    ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-300'
                    : 'bg-amber-100/70 hover:bg-amber-200 text-amber-900 border-amber-300'
                }`}
                title="Thu âm giọng đọc mẫu của cô giáo cho 29 chữ cái và âm ghép"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isTeacherVoiceEditMode ? 'Đang sửa giọng GV' : 'Sửa giọng mẫu GV'}</span>
              </button>
            )}

            <div className="flex flex-wrap gap-1.5 bg-amber-50 p-1.5 rounded-2xl border border-amber-200/80">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'single', label: '29 Chữ cái' },
                { id: 'compound', label: '11 Âm ghép' },
                { id: 'tones', label: '5 Dấu thanh' },
                { id: 'rhymes', label: 'Vần phổ biến' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`filter-alphabet-${tab.id}`}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 29 Single Letters */}
        {(activeCategory === 'all' || activeCategory === 'single') && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                29 Chữ Cái Tiếng Việt (Chữ thường & Chữ hoa)
              </h2>
              <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2.5 py-1 rounded-full">
                29 Chữ cái
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {singleLetters.map((item) => {
                const hasTeacherAudio = teacherAudioService.hasAudioForText(item.letter);
                return (
                  <div
                    key={item.letter}
                    id={`single-letter-card-${item.letter}`}
                    onClick={() => handlePlayLetter(`${item.letter}, ${item.example}`)}
                    className="group cursor-pointer bg-gradient-to-b from-amber-50/50 to-orange-50/30 hover:to-orange-100/60 p-4 rounded-2xl border border-amber-200/70 hover:border-orange-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-between relative"
                  >
                    {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                      <button
                        onClick={(e) => handleTeacherRecordClick(e, `${item.letter}, ${item.example}`, `Chữ cái: ${item.letter.toUpperCase()} (${item.letter})`)}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs transition-all active:scale-90 cursor-pointer ${
                          isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        } ${hasTeacherAudio ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                        title={`Thu âm giọng đọc mẫu cô giáo cho chữ "${item.letter}"`}
                      >
                        <Mic className="w-3 h-3" />
                      </button>
                    )}

                    <span className="text-2xl mb-1 group-hover:scale-125 transition-transform">{item.icon}</span>
                    <div className="flex items-baseline gap-1.5 my-1">
                      <span className="text-3xl font-black text-amber-950 font-serif group-hover:text-orange-600">
                        {item.letter}
                      </span>
                      <span className="text-xl font-bold text-amber-700 font-serif">
                        {item.upper}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">
                      {item.example}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Volume2 className="w-3 h-3" />
                      <span>{hasTeacherAudio ? 'Giọng GV' : 'Đọc'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 11 Compound Consonants */}
        {(activeCategory === 'all' || activeCategory === 'compound') && (
          <div className="mt-10 pt-8 border-t border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                11 Âm Ghép Tiếng Việt (Phụ âm ghép)
              </h2>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-1 rounded-full">
                11 Âm ghép
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {compoundSounds.map((item) => {
                const hasTeacherAudio = teacherAudioService.hasAudioForText(item.name);
                return (
                  <div
                    key={item.sound}
                    id={`compound-sound-card-${item.sound}`}
                    onClick={() => handlePlayLetter(`${item.name}, ${item.example}`)}
                    className="group cursor-pointer bg-gradient-to-b from-emerald-50/50 to-teal-50/30 hover:to-emerald-100/60 p-4 rounded-2xl border border-emerald-200/70 hover:border-emerald-500 hover:shadow-md transition-all text-center flex flex-col items-center justify-between relative"
                  >
                    {(isTeacherVoiceEditMode || onOpenTeacherRecorder) && (
                      <button
                        onClick={(e) => handleTeacherRecordClick(e, `${item.name}, ${item.example}`, `Âm ghép: ${item.sound}`)}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs transition-all active:scale-90 cursor-pointer ${
                          isTeacherVoiceEditMode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        } ${hasTeacherAudio ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'}`}
                        title={`Thu âm giọng mẫu cho âm ghép "${item.sound}"`}
                      >
                        <Mic className="w-3 h-3" />
                      </button>
                    )}

                    <span className="text-2xl mb-1 group-hover:scale-125 transition-transform">{item.icon}</span>
                    <div className="text-3xl font-black text-emerald-950 font-serif group-hover:text-emerald-600 my-1">
                      {item.sound}
                    </div>
                    <div className="text-xs font-semibold text-slate-600">
                      {item.example}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Volume2 className="w-3 h-3" />
                      <span>{hasTeacherAudio ? 'Giọng GV' : item.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5 Tones */}
        {(activeCategory === 'all' || activeCategory === 'tones') && (
          <div className="mt-10 pt-8 border-t border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                6 Thanh Điệu (5 Dấu Thanh)
              </h2>
              <span className="text-xs text-rose-700 font-semibold bg-rose-100 px-2.5 py-1 rounded-full">
                6 Thanh điệu
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tones.map((t, idx) => (
                <div
                  key={idx}
                  id={`tone-card-${idx}`}
                  onClick={() => handlePlayLetter(`${t.name}. Ví dụ: ${t.sample}`)}
                  className="group cursor-pointer bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 p-4 rounded-2xl border border-rose-200 hover:border-rose-400 hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl font-black font-serif shadow-xs group-hover:scale-105 transition-transform">
                    {t.sample}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-rose-950 text-sm">{t.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{t.desc}</div>
                  </div>
                  <Volume2 className="w-4 h-4 text-rose-600 group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rhymes */}
        {(activeCategory === 'all' || activeCategory === 'rhymes') && (
          <div className="mt-10 pt-8 border-t border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Bảng Vần Thông Dụng Lớp 1
              </h2>
              <span className="text-xs text-blue-700 font-semibold bg-blue-100 px-2.5 py-1 rounded-full">
                Âm vần
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {commonRhymes.map((rhyme) => (
                <button
                  key={rhyme}
                  id={`rhyme-btn-${rhyme}`}
                  onClick={() => handlePlayLetter(`vần ${rhyme}`)}
                  className="px-4 py-2 bg-blue-50/70 hover:bg-blue-600 hover:text-white text-blue-950 font-bold text-sm rounded-xl border border-blue-200 transition-all group flex items-center gap-1.5"
                >
                  <span>{rhyme}</span>
                  <Volume2 className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
