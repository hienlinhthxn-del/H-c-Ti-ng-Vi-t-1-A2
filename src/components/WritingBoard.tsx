import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Volume2, Sparkles, Trophy } from 'lucide-react';
import { speechService } from '../services/speechService';
import { achievementService } from '../services/achievementService';
import { AchievementBadge } from '../types';

interface WritingBoardProps {
  initialSampleText?: string;
  onSuccessReward?: () => void;
  onUnlockBadges?: (badges: AchievementBadge[]) => void;
}

export const WritingBoard: React.FC<WritingBoardProps> = ({
  initialSampleText = 'a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y',
  onSuccessReward,
  onUnlockBadges
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sampleText, setSampleText] = useState(initialSampleText);
  const [inkColor, setInkColor] = useState('#5b21b6'); // Purple standard
  const [brushSize, setBrushSize] = useState(4);
  const [showSample, setShowSample] = useState(true);
  const [presetIndex, setPresetIndex] = useState(0);

  const presets = [
    { title: 'Chữ cái a b c', text: 'a ă â b c d đ' },
    { title: 'Chữ e ê g h', text: 'e ê g h i k l' },
    { title: 'Chữ m n o ô ơ', text: 'm n o ô ơ p q' },
    { title: 'Chữ r s t u ư', text: 'r s t u ư v x y' },
    { title: 'Âm ghép ch th ph', text: 'ch gh gi kh nh ng' },
    { title: 'Từ ngữ: ba bà bố mẹ', text: 'ba bà bố mẹ bé' },
    { title: 'Từ ngữ: hoa đào, quả na', text: 'hoa đào quả na' },
    { title: 'Câu: Em yêu trường em', text: 'Em yêu trường em.' }
  ];

  useEffect(() => {
    if (initialSampleText) {
      setSampleText(initialSampleText);
    }
  }, [initialSampleText]);

  useEffect(() => {
    drawGrid();
  }, []);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset & clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paper background
    ctx.fillStyle = '#fbfdf9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridSize = 25; // 25px per small square
    
    // Draw vertical sub-lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw horizontal sub-lines
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw main guideline rows (every 4 squares = 1 row ô ly)
    const rowHeight = gridSize * 4;
    for (let y = rowHeight; y < canvas.height; y += rowHeight) {
      // Main baseline
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      // Top line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, y - gridSize * 2);
      ctx.lineTo(canvas.width, y - gridSize * 2);
      ctx.stroke();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    speechService.playSoundEffect('pop');
    drawGrid();
  };

  const handleSelectPreset = (idx: number) => {
    setPresetIndex(idx);
    setSampleText(presets[idx].text);
    speechService.speak(presets[idx].text);
  };

  const handleFinish = () => {
    speechService.playSoundEffect('fanfare');
    speechService.speak('Khen ngợi bé đã chăm chỉ luyện viết chữ đẹp!');
    if (onSuccessReward) onSuccessReward();
    
    const { newBadges } = achievementService.incrementPracticeCount();
    if (newBadges.length > 0 && onUnlockBadges) {
      onUnlockBadges(newBadges);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-amber-100 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-serif">
              Vở Tập Viết Ô Ly 4 Hàng
            </h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Lớp 1 Chuẩn
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Bé dùng chuột hoặc ngón tay để luyện viết chữ nét thanh, nét đậm trên lưới ô ly.
          </p>
        </div>

        {/* Quick Speak button */}
        <div className="flex items-center gap-2">
          <button
            id="speak-sample-text-btn"
            onClick={() => speechService.speak(sampleText)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs transition-colors"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            Đọc mẫu chữ
          </button>
          <button
            id="reward-writing-btn"
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Hoàn thành bài viết
          </button>
        </div>
      </div>

      {/* Sample presets */}
      <div className="mb-4">
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Chọn bài mẫu tập viết:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-writing-${idx}`}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                presetIndex === idx
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-purple-50 text-slate-700 border border-slate-200'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Custom sample text input */}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-2">
        <div className="w-full flex-1 flex items-center gap-2 bg-amber-50/70 p-2 rounded-2xl border border-amber-200/80">
          <span className="text-xs font-bold text-amber-900 whitespace-nowrap pl-2">Mẫu chữ:</span>
          <input
            id="custom-sample-text-input"
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="flex-1 bg-white px-3 py-1.5 rounded-xl text-sm font-semibold text-purple-900 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Nhập chữ cái hoặc từ cần tập viết..."
          />
        </div>

        <button
          id="toggle-sample-overlay-btn"
          onClick={() => setShowSample(!showSample)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            showSample
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'bg-slate-100 text-slate-600 border border-slate-300'
          }`}
        >
          {showSample ? '👁️ Ẩn mẫu nét đứt' : '👁️ Hiện mẫu nét đứt'}
        </button>
      </div>

      {/* Drawing Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 mb-3">
        {/* Colors */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Màu mực:</span>
          {[
            { name: 'Mực tím', color: '#5b21b6', label: 'Tím' },
            { name: 'Mực xanh', color: '#1d4ed8', label: 'Xanh' },
            { name: 'Mực đen', color: '#0f172a', label: 'Đen' },
            { name: 'Mực đỏ', color: '#dc2626', label: 'Đỏ' }
          ].map((item) => (
            <button
              key={item.color}
              id={`color-pick-${item.label}`}
              onClick={() => setInkColor(item.color)}
              className={`w-7 h-7 rounded-full transition-transform border-2 ${
                inkColor === item.color ? 'scale-110 border-amber-500 ring-2 ring-amber-300' : 'border-white'
              }`}
              style={{ backgroundColor: item.color }}
              title={item.name}
            />
          ))}
        </div>

        {/* Brush sizes */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Cỡ nét:</span>
          {[3, 5, 8].map((size) => (
            <button
              key={size}
              id={`brush-size-${size}`}
              onClick={() => setBrushSize(size)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                brushSize === size
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {size === 3 ? 'Nhỏ' : size === 5 ? 'Vừa' : 'Đậm'}
            </button>
          ))}
        </div>

        {/* Clear */}
        <button
          id="clear-canvas-btn"
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Xoá viết lại
        </button>
      </div>

      {/* Interactive Writing Canvas with background guide */}
      <div className="relative border-2 border-blue-200 rounded-2xl overflow-hidden shadow-inner bg-[#fbfdf9]">
        {/* Sample text watermark overlay */}
        {showSample && sampleText && (
          <div 
            className="absolute inset-0 pointer-events-none select-none flex flex-col justify-around px-8 py-6 opacity-30 text-purple-900 font-serif"
            style={{ fontFamily: '"Comic Sans MS", "Arial Rounded MT Bold", sans-serif', letterSpacing: '0.25em' }}
          >
            <div className="text-4xl sm:text-5xl font-normal leading-relaxed border-b-2 border-dashed border-purple-300 pb-2">
              {sampleText}
            </div>
            <div className="text-4xl sm:text-5xl font-normal leading-relaxed border-b-2 border-dashed border-purple-300 pb-2">
              {sampleText}
            </div>
            <div className="text-4xl sm:text-5xl font-normal leading-relaxed">
              {sampleText}
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          id="writing-grid-canvas"
          width={960}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-80 sm:h-96 cursor-crosshair touch-none"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-2">
        <span>💡 Mẹo: Bố mẹ có thể cầm tay hướng dẫn bé rê ngón tay theo đường nét chữ mẫu.</span>
        <span>Lưới ô li chuẩn tiểu học</span>
      </div>
    </div>
  );
};
