import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StrokeData } from '../types';
import {
  Pen,
  Highlighter,
  Eraser,
  RotateCcw,
  Trash2,
  Download,
  Palette,
  Crosshair,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Move,
} from 'lucide-react';

interface WhiteboardProps {
  strokes: StrokeData[];
  onDrawStroke: (stroke: StrokeData) => void;
  onUndo: () => void;
  onClear: () => void;
  laserPointer: { x: number; y: number; active: boolean; author: string } | null;
  onLaserMove: (point: { x: number; y: number; active: boolean; author: string } | null) => void;
  isOverlay?: boolean;
  onCloseOverlay?: () => void;
  authorName?: string;
}

const COLORS = [
  { name: 'Merah', hex: '#ef4444' },
  { name: 'Biru', hex: '#3b82f6' },
  { name: 'Hijau', hex: '#10b981' },
  { name: 'Kuning Neon', hex: '#facc15' },
  { name: 'Ungu', hex: '#a855f7' },
  { name: 'Hitam / Putih', hex: '#1e293b' },
];

const STROKE_WIDTHS = [
  { label: 'Tipis', value: 3 },
  { label: 'Sedang', value: 7 },
  { label: 'Tebal', value: 14 },
];

export const CollaborativeWhiteboard: React.FC<WhiteboardProps> = ({
  strokes,
  onDrawStroke,
  onUndo,
  onClear,
  laserPointer,
  onLaserMove,
  isOverlay = false,
  onCloseOverlay,
  authorName = 'Guru IFP',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'eraser' | 'laser'>('pen');
  const [currentColor, setCurrentColor] = useState<string>('#ef4444');
  const [currentWidth, setCurrentWidth] = useState<number>(5);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentPoints, setCurrentPoints] = useState<number[]>([]);
  const [boardTheme, setBoardTheme] = useState<'transparent' | 'white' | 'dark' | 'chalk'>(
    isOverlay ? 'transparent' : 'white'
  );
  const [toolbarMinimized, setToolbarMinimized] = useState<boolean>(false);

  // Resize canvas according to container
  const updateCanvasDimensions = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // Redraw all strokes on canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // If not transparent overlay, fill background
    if (!isOverlay) {
      if (boardTheme === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      } else if (boardTheme === 'dark') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      } else if (boardTheme === 'chalk') {
        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 0, width, height);
      }
    }

    // Render strokes
    for (const stroke of strokes) {
      if (!stroke.points || stroke.points.length < 4) continue;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(stroke.points[0], stroke.points[1]);

      for (let i = 2; i < stroke.points.length; i += 2) {
        ctx.lineTo(stroke.points[i], stroke.points[i + 1]);
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'highlighter') {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width * 2.5;
        ctx.globalAlpha = 0.4;
      } else if (stroke.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = stroke.width * 3;
      } else {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.globalAlpha = 1.0;
      }

      ctx.stroke();
      ctx.restore();
    }

    // Render currently drawing active stroke
    if (isDrawing && currentPoints.length >= 4 && activeTool !== 'laser') {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(currentPoints[0], currentPoints[1]);
      for (let i = 2; i < currentPoints.length; i += 2) {
        ctx.lineTo(currentPoints[i], currentPoints[i + 1]);
      }
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (activeTool === 'highlighter') {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth * 2.5;
        ctx.globalAlpha = 0.4;
      } else if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = currentWidth * 3;
      } else {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth;
        ctx.globalAlpha = 1.0;
      }

      ctx.stroke();
      ctx.restore();
    }

    // Render Laser Pointer if active
    if (laserPointer && laserPointer.active) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(laserPointer.x, laserPointer.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f87171';
      ctx.shadowBlur = 15;
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(laserPointer.x, laserPointer.y, 20, 0, Math.PI * 2);
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      if (laserPointer.author) {
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.fillText(laserPointer.author, laserPointer.x + 16, laserPointer.y - 10);
      }
      ctx.restore();
    }
  }, [strokes, isDrawing, currentPoints, activeTool, currentColor, currentWidth, boardTheme, isOverlay, laserPointer]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'laser') {
      onLaserMove({ x, y, active: true, author: authorName });
      return;
    }

    setIsDrawing(true);
    setCurrentPoints([x, y]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'laser') {
      if (e.buttons > 0 || e.pointerType === 'touch') {
        onLaserMove({ x, y, active: true, author: authorName });
      }
      return;
    }

    if (!isDrawing) return;
    setCurrentPoints((prev) => [...prev, x, y]);
  };

  const handlePointerUp = () => {
    if (activeTool === 'laser') {
      setTimeout(() => onLaserMove(null), 800);
      return;
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPoints.length >= 4) {
      const stroke: StrokeData = {
        id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        tool: activeTool === 'highlighter' ? 'highlighter' : activeTool === 'eraser' ? 'eraser' : 'pen',
        color: currentColor,
        width: currentWidth,
        points: currentPoints,
        author: authorName,
        timestamp: Date.now(),
      };
      onDrawStroke(stroke);
    }
    setCurrentPoints([]);
  };

  // Download whiteboard image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Anotasi-IFP-Wirausaha-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none overflow-hidden ${
        isOverlay ? 'pointer-events-auto bg-transparent' : 'bg-slate-100 dark:bg-slate-950'
      }`}
    >
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full h-full block touch-none cursor-${
          activeTool === 'laser' ? 'crosshair' : activeTool === 'eraser' ? 'cell' : 'crosshair'
        }`}
      />

      {/* Floating Presenter Toolbar */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 ${
          toolbarMinimized ? 'translate-y-12 opacity-80 hover:translate-y-0 hover:opacity-100' : ''
        }`}
      >
        {/* Minimize / Maximize handle */}
        <button
          onClick={() => setToolbarMinimized(!toolbarMinimized)}
          title={toolbarMinimized ? 'Tampilkan Toolbar' : 'Sembunyikan'}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {toolbarMinimized ? <Eye className="w-5 h-5 text-blue-500" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Tools Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTool('pen')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${
              activeTool === 'pen'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
            title="Pena Digital"
          >
            <Pen className="w-4 h-4" />
            <span className="hidden md:inline">Pena</span>
          </button>

          <button
            onClick={() => setActiveTool('highlighter')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${
              activeTool === 'highlighter'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
            title="Stabilo / Penanda"
          >
            <Highlighter className="w-4 h-4" />
            <span className="hidden md:inline">Stabilo</span>
          </button>

          <button
            onClick={() => setActiveTool('eraser')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${
              activeTool === 'eraser'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
            title="Penghapus"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden md:inline">Hapus</span>
          </button>

          <button
            onClick={() => setActiveTool('laser')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs md:text-sm font-semibold transition ${
              activeTool === 'laser'
                ? 'bg-red-500 text-white shadow-sm ring-2 ring-red-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
            }`}
            title="Laser Pointer Interaktif"
          >
            <Crosshair className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="hidden md:inline">Laser</span>
          </button>
        </div>

        {/* Color Palette */}
        {activeTool !== 'eraser' && activeTool !== 'laser' && (
          <div className="flex items-center gap-1 px-1">
            {COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setCurrentColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-7 h-7 rounded-full border-2 transition transform active:scale-90 ${
                  currentColor === c.hex
                    ? 'border-white ring-2 ring-blue-500 scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                title={c.name}
              />
            ))}
          </div>
        )}

        {/* Thickness Selector */}
        {activeTool !== 'laser' && (
          <div className="hidden sm:flex items-center gap-1 px-1 border-l border-slate-200 dark:border-slate-800">
            {STROKE_WIDTHS.map((w) => (
              <button
                key={w.value}
                onClick={() => setCurrentWidth(w.value)}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  currentWidth === w.value
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        )}

        {/* Board Background Themes (when not overlay) */}
        {!isOverlay && (
          <div className="hidden lg:flex items-center gap-1 px-1 border-l border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setBoardTheme('white')}
              className={`w-5 h-5 rounded border ${
                boardTheme === 'white' ? 'ring-2 ring-blue-500 border-white' : 'border-slate-300'
              } bg-white`}
              title="Papan Putih"
            />
            <button
              onClick={() => setBoardTheme('dark')}
              className={`w-5 h-5 rounded border ${
                boardTheme === 'dark' ? 'ring-2 ring-blue-500 border-white' : 'border-slate-700'
              } bg-slate-900`}
              title="Papan Gelap"
            />
            <button
              onClick={() => setBoardTheme('chalk')}
              className={`w-5 h-5 rounded border ${
                boardTheme === 'chalk' ? 'ring-2 ring-blue-500 border-white' : 'border-emerald-800'
              } bg-emerald-900`}
              title="Papan Tulis Hijau"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-800">
          <button
            onClick={onUndo}
            disabled={strokes.length === 0}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl disabled:opacity-40 transition"
            title="Urungkan Coretan (Undo)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClear}
            disabled={strokes.length === 0}
            className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl disabled:opacity-40 transition"
            title="Bersihkan Semua Coretan"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition"
            title="Simpan Tangkapan Gambar"
          >
            <Download className="w-4 h-4" />
          </button>

          {isOverlay && onCloseOverlay && (
            <button
              onClick={onCloseOverlay}
              className="ml-1 px-3 py-1.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold"
            >
              Tutup Anotasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
