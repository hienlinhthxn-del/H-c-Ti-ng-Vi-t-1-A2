import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Volume2, Sparkles, Undo, Download, CheckCircle2 } from 'lucide-react';
import { speechService } from '../services/speechService';

interface WritingBoardProps {
  initialSampleText?: string;
  onSuccessReward?: () => void;
}

export const WritingBoard: React.FC<WritingBoardProps> = ({
  initialSampleText = 'a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y',
  onSuccessReward
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sampleText, setSampleText] = useState(initialSampleText);
  const [inkColor, setInkColor] = useState('#5b21b6'); // Purple standard
  const [brushSize, setBrushSize] = useState(4);
  const [showSample, setShowSample] = useState(true);
  const [presetIndex, setPresetIndex] = useState(0);
  const [historyStack, setHistoryStack] = useState<ImageData[]>([]);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 960, height: 480 });

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

  // Redraw ô ly grid
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#fbfdf9';
    ctx.fillRect(0, 0, width, height);

    const gridSize = 25; // 25px per small square
    
    // Draw vertical sub-lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal sub-lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw main guideline rows (every 4 squares = 1 row ô ly)
    const rowHeight = gridSize * 4;
    for (let y = rowHeight; y < height; y += rowHeight) {
      // Main baseline
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Top line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, y - gridSize * 2);
      ctx.lineTo(width, y - gridSize * 2);
      ctx.stroke();
    }
  }, []);

  // Initialize and handle responsive resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGrid(ctx, canvas.width, canvas.height);
  }, [drawGrid]);

  // Save state for undo
  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistoryStack(prev => [...prev.slice(-15), imageData]);
    } catch {
      // Ignore if tainted or unavailable
    }
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...historyStack];
    const previous = newHistory.pop();
    setHistoryStack(newHistory);

    if (previous) {
      ctx.putImageData(previous, 0, 0);
    } else {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    speechService.playSoundEffect('pop');
  };

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  // Pointer event handlers (works for Mouse, Touch, Apple Pencil, Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture pointer to avoid losing drawing during fast movements
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    saveStateToHistory();
    setIsDrawing(true);

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
    // Pressure sensitivity if available
    const dynamicSize = e.pressure && e.pressure > 0 ? brushSize * (0.6 + e.pressure * 0.8) : brushSize;
    ctx.lineWidth = dynamicSize;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleClear = () => {
    speechService.playSoundEffect('pop');
    saveStateToHistory();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGrid(ctx, canvas.width, canvas.height);
  };

  const handleSelectPreset = (idx: number) => {
    setPresetIndex(idx);
    setSampleText(presets[idx].text);
    speechService.speak(presets[idx].text);
  };

  const handleFinish = () => {
    speechService.playSoundEffect('sectionComplete');
    speechService.speak('Hoan hô bé đã luyện viết rất chăm chỉ và hoàn thành bài viết!');
    if (onSuccessReward) onSuccessReward();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `bai-tap-viet-lop1-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    speechService.playSoundEffect('correct');
  };

  return (
    <div ref={containerRef} className="bg-white rounded-3xl p-3 sm:p-6 shadow-md border border-amber-100 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">📝</span>
            <h2 className="text-lg sm:text-2xl font-black text-amber-950 font-serif">
              Vở Tập Viết Ô Ly 4 Hàng
            </h2>
            <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
              Chuẩn SGK
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Luyện viết chữ trên màn hình cảm ứng điện thoại, iPad, máy tính bảng hoặc bảng thông minh.
          </p>
        </div>

        {/* Quick Speak & Finish Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="speak-sample-text-btn"
            onClick={() => speechService.speak(sampleText)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>Đọc mẫu chữ</span>
          </button>
          <button
            id="reward-writing-btn"
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>Hoàn thành bài viết ⭐</span>
          </button>
        </div>
      </div>

      {/* Sample presets */}
      <div className="mb-3">
        <label className="text-xs font-bold text-slate-700 block mb-1.5">
          Chọn bài mẫu tập viết:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-writing-${idx}`}
              onClick={() => handleSelectPreset(idx)}
              className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
      <div className="mb-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200/80">
          <span className="text-xs font-bold text-amber-900 whitespace-nowrap pl-2">Mẫu chữ:</span>
          <input
            id="custom-sample-text-input"
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="flex-1 bg-white px-3 py-1 rounded-xl text-xs sm:text-sm font-semibold text-purple-900 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Nhập chữ cái hoặc từ cần tập viết..."
          />
        </div>

        <button
          id="toggle-sample-overlay-btn"
          onClick={() => setShowSample(!showSample)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            showSample
              ? 'bg-purple-100 text-purple-900 border border-purple-300'
              : 'bg-slate-100 text-slate-600 border border-slate-300'
          }`}
        >
          {showSample ? '👁️ Ẩn mẫu nét đứt' : '👁️ Hiện mẫu nét đứt'}
        </button>
      </div>

      {/* Drawing Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 mb-3">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 mr-0.5">Mực:</span>
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
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-transform border-2 cursor-pointer ${
                inkColor === item.color ? 'scale-110 border-amber-500 ring-2 ring-amber-300' : 'border-white shadow-2xs'
              }`}
              style={{ backgroundColor: item.color }}
              title={item.name}
            />
          ))}
        </div>

        {/* Brush sizes */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-600 mr-0.5">Nét:</span>
          {[3, 5, 8].map((size) => (
            <button
              key={size}
              id={`brush-size-${size}`}
              onClick={() => setBrushSize(size)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                brushSize === size
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {size === 3 ? 'Nhỏ' : size === 5 ? 'Vừa' : 'Đậm'}
            </button>
          ))}
        </div>

        {/* Undo, Clear & Export Actions */}
        <div className="flex items-center gap-1.5">
          <button
            id="undo-canvas-btn"
            onClick={handleUndo}
            disabled={historyStack.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Quay lại nét trước"
          >
            <Undo className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hoàn tác</span>
          </button>

          <button
            id="clear-canvas-btn"
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Xoá sạch trang viết"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xoá</span>
          </button>

          <button
            id="download-canvas-btn"
            onClick={handleDownload}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Lưu ảnh bài viết về máy"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lưu ảnh</span>
          </button>
        </div>
      </div>

      {/* Interactive Writing Canvas with background guide */}
      <div className="relative border-2 border-blue-200 rounded-2xl overflow-hidden shadow-inner bg-[#fbfdf9] touch-none">
        {/* Sample text watermark overlay */}
        {showSample && sampleText && (
          <div 
            className="absolute inset-0 pointer-events-none select-none flex flex-col justify-around px-4 sm:px-8 py-4 opacity-30 text-purple-900 font-serif"
            style={{ fontFamily: '"Comic Sans MS", "Arial Rounded MT Bold", sans-serif', letterSpacing: '0.2em' }}
          >
            <div className="text-3xl sm:text-5xl font-normal leading-relaxed border-b-2 border-dashed border-purple-300 pb-1 sm:pb-2 truncate">
              {sampleText}
            </div>
            <div className="text-3xl sm:text-5xl font-normal leading-relaxed border-b-2 border-dashed border-purple-300 pb-1 sm:pb-2 truncate">
              {sampleText}
            </div>
            <div className="text-3xl sm:text-5xl font-normal leading-relaxed truncate">
              {sampleText}
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          id="writing-grid-canvas"
          width={960}
          height={480}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-72 sm:h-96 cursor-crosshair touch-none select-none"
          style={{ touchAction: 'none' }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 px-1">
        <span>💡 Mẹo: Dùng ngón tay, bút cảm ứng hoặc chuột để luyện viết theo đường nét mẫu.</span>
        <span className="hidden sm:inline font-semibold">Lưới ô ly chuẩn tiểu học</span>
      </div>
    </div>
  );
};
