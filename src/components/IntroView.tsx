import React, { useState } from 'react';
import { INTRO_SECTIONS, IntroSection } from '../data/introLessons';
import { speechService } from '../services/speechService';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface IntroViewProps {
  onOpenWritingPractice: (text: string) => void;
  onAddStar: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onOpenWritingPractice, onAddStar }) => {
  const [activeIntroId, setActiveIntroId] = useState<string>(INTRO_SECTIONS[0].id);
  const currentIntro = INTRO_SECTIONS.find(i => i.id === activeIntroId) || INTRO_SECTIONS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-md mb-6">
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase">
          Khởi đầu năm học
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight mt-2">
          Bài Mở Đầu: Làm Quen Với Tiếng Việt 1
        </h1>
        <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl">
          Chào đón các em bước vào lớp 1! Hãy cùng tìm hiểu về ngôi trường thân thương, đồ dùng học tập, các nét viết và tư thế ngồi học chuẩn.
        </p>

        {/* Intro Tab Selector */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/20">
          {INTRO_SECTIONS.map((item) => (
            <button
              key={item.id}
              id={`intro-tab-${item.id}`}
              onClick={() => setActiveIntroId(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                activeIntroId === item.id
                  ? 'bg-white text-orange-600 shadow-md scale-102'
                  : 'bg-black/10 hover:bg-black/20 text-white'
              }`}
            >
              <span>{item.title.split('.')[1] || item.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content for Current Intro Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-serif">
              {currentIntro.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 font-medium mt-0.5">
              {currentIntro.subtitle}
            </p>
          </div>

          <button
            onClick={() => speechService.speak(`${currentIntro.title}. ${currentIntro.description}`)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors self-start sm:self-auto"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>Nghe giới thiệu</span>
          </button>
        </div>

        <p className="text-base text-slate-700 font-serif leading-relaxed mb-6">
          {currentIntro.description}
        </p>

        {/* Detailed Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {currentIntro.items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => speechService.speak(item.audioText || `${item.title}. ${item.description}`)}
              className="cursor-pointer group p-5 rounded-2xl bg-gradient-to-b from-amber-50/40 to-orange-50/20 hover:to-orange-100/50 border border-amber-200/80 hover:border-orange-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl group-hover:scale-125 transition-transform">
                    {item.symbol || '📖'}
                  </span>
                  <Volume2 className="w-4 h-4 text-amber-600 opacity-60 group-hover:opacity-100" />
                </div>
                <h3 className="font-bold text-amber-950 text-base group-hover:text-orange-600 font-serif">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-amber-100 text-[11px] font-bold text-orange-700 flex items-center justify-between">
                <span>Khám phá</span>
                <span>▶ Nghe</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Em đã nắm vững bài mở đầu chuẩn bị cho các bài học âm vần!</span>
          </div>

          <button
            onClick={() => {
              speechService.playSoundEffect('success');
              onAddStar();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Nhận sao khen thưởng
          </button>
        </div>
      </div>

    </div>
  );
};
