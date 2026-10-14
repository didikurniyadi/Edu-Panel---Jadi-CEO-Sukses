import React, { useState, useEffect, useCallback } from 'react';
import { MATERI_SLIDES } from '../data/materiData';
import { StrokeData } from '../types';
import { CollaborativeWhiteboard } from './CollaborativeWhiteboard';
import {
  ChevronLeft,
  ChevronRight,
  PenTool,
  Sparkles,
  Maximize2,
  Minimize2,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  Store,
  Award,
  Coins,
  BookOpen,
} from 'lucide-react';

interface MateriSlideViewerProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
  strokes: StrokeData[];
  onDrawStroke: (stroke: StrokeData) => void;
  onUndoStroke: () => void;
  onClearCanvas: () => void;
  laserPointer: { x: number; y: number; active: boolean; author: string } | null;
  onLaserMove: (point: { x: number; y: number; active: boolean; author: string } | null) => void;
  authorName: string;
}

export const MateriSlideViewer: React.FC<MateriSlideViewerProps> = ({
  currentSlide,
  onSlideChange,
  strokes,
  onDrawStroke,
  onUndoStroke,
  onClearCanvas,
  laserPointer,
  onLaserMove,
  authorName,
}) => {
  const [showAnnotationOverlay, setShowAnnotationOverlay] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeSlide = MATERI_SLIDES[currentSlide] || MATERI_SLIDES[0];

  const handleNext = useCallback(() => {
    if (currentSlide < MATERI_SLIDES.length - 1) {
      onSlideChange(currentSlide + 1);
    }
  }, [currentSlide, onSlideChange]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    }
  }, [currentSlide, onSlideChange]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // In sandboxed iframes, native fullscreen may be blocked;
          // in-app full screen state (fixed inset-0) ensures 100% full screen coverage.
        });
      }
    } else {
      setIsFullscreen(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [isFullscreen]);

  // Sync with native fullscreen changes (e.g. user pressing ESC in browser)
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Keyboard navigation for teachers / clickers / IFP remotes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrev, toggleFullscreen, isFullscreen]);

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'target':
        return <Target className="w-5 h-5 text-blue-500" />;
      case 'chart':
        return <BarChart3 className="w-5 h-5 text-emerald-500" />;
      case 'users':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'store':
        return <Store className="w-5 h-5 text-sky-500" />;
      case 'award':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'coins':
        return <Coins className="w-5 h-5 text-emerald-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div
      className={`relative flex flex-col bg-slate-100 dark:bg-slate-950 select-none overflow-hidden transition-all duration-200 ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'h-full w-full'
      }`}
    >
      {/* Top Slide Navigation Bar */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            Slide {currentSlide + 1} / {MATERI_SLIDES.length}
          </span>
          {isFullscreen && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Layar Penuh IFP
            </span>
          )}
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline truncate max-w-[200px] md:max-w-xs">
            {activeSlide.badge}
          </span>
        </div>

        {/* Thumbnail Selector Pills */}
        <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-xl xl:max-w-2xl py-0.5">
          {MATERI_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => onSlideChange(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition shrink-0 ${
                currentSlide === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {idx + 1}. {slide.shortTitle || slide.title.slice(0, 14)}
            </button>
          ))}
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowAnnotationOverlay(!showAnnotationOverlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              showAnnotationOverlay
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600'
            }`}
            title="Anotasi Coretan Langsung di Layar IFP"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{showAnnotationOverlay ? 'Tutup Coretan' : 'Anotasi Layar'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              isFullscreen
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-md'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
            title={isFullscreen ? 'Keluar Layar Penuh (Esc)' : 'Tampilan Layar Penuh IFP'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Keluar' : 'Layar Penuh'}</span>
          </button>
        </div>
      </div>

      {/* Main Single-Screen Viewport: Fits entirely without vertical scrolling */}
      <div className="relative flex-1 min-h-0 overflow-hidden px-3 md:px-6 py-2 md:py-2.5 flex flex-col justify-between max-w-7xl mx-auto w-full">
        {/* Header Banner - Compact & Crisp */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white px-4 py-2.5 md:px-5 md:py-3 shadow-md shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
              {activeSlide.badge}
            </span>
            {activeSlide.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/25 text-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-base md:text-xl lg:text-2xl font-black tracking-tight leading-tight">
            {activeSlide.title}
          </h1>
          <p className="mt-0.5 text-xs md:text-sm text-blue-100 font-medium line-clamp-1 md:line-clamp-none">
            {activeSlide.subtitle}
          </p>
        </div>

        {/* Slide Body Sections Grid: Flexibly fills available vertical height */}
        <div
          className={`grid grid-cols-1 ${
            activeSlide.sections.length > 1 ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto w-full'
          } gap-2.5 md:gap-3.5 my-1.5 md:my-2 flex-1 min-h-0`}
        >
          {activeSlide.sections.map((section, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 md:p-3.5 shadow-sm min-h-0 overflow-y-auto"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    {renderIcon(section.iconType)}
                  </div>
                  <h2 className="text-xs md:text-sm lg:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {section.heading}
                  </h2>
                </div>

                <p className="text-xs md:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.description}
                </p>

                {section.bullets && (
                  <ul className="space-y-1 mt-1.5">
                    {section.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-1.5 text-[11px] md:text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-1.5 md:p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 leading-snug"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {section.highlight && (
                <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-[11px] md:text-xs text-amber-900 dark:text-amber-200 font-medium leading-snug shrink-0">
                  💡 <span className="font-semibold">Catatan Kunci:</span> {section.highlight}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quote / Summary Banner - Compact */}
        {activeSlide.quoteOrSummary && (
          <div className="rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-3.5 py-1.5 md:py-2 shadow-sm border border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <p className="text-[11px] md:text-xs italic font-serif text-slate-200 truncate md:whitespace-normal">
                {activeSlide.quoteOrSummary.text}
              </p>
            </div>
            <span className="text-[10px] font-mono font-semibold text-blue-300 uppercase tracking-wider whitespace-nowrap bg-blue-900/50 px-2 py-0.5 rounded border border-blue-700/50 shrink-0">
              {activeSlide.quoteOrSummary.authorOrSource}
            </span>
          </div>
        )}
      </div>

      {/* Side Quick Touch Chevrons on IFP */}
      {currentSlide > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition shadow-lg opacity-60 hover:opacity-100 active:scale-90"
          title="Slide Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentSlide < MATERI_SLIDES.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition shadow-lg opacity-60 hover:opacity-100 active:scale-90"
          title="Slide Berikutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Bottom Navigation Dock: Always pinned at bottom */}
      <div className="px-3 md:px-5 py-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-3.5 md:px-5 py-1.5 md:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shadow-sm"
            title="Slide Sebelumnya (Panah Kiri)"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-1.5 md:gap-2">
            {MATERI_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => onSlideChange(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === idx
                    ? 'w-7 md:w-8 bg-blue-600'
                    : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Ke slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlide === MATERI_SLIDES.length - 1}
            className="flex items-center gap-1.5 px-4 md:px-6 py-1.5 md:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 shadow-md shadow-blue-500/20"
            title="Slide Berikutnya (Panah Kanan / Spasi)"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Floating Whiteboard Overlay directly on top of slides */}
      {showAnnotationOverlay && (
        <div className="absolute inset-0 z-40">
          <CollaborativeWhiteboard
            strokes={strokes}
            onDrawStroke={onDrawStroke}
            onUndo={onUndoStroke}
            onClear={onClearCanvas}
            laserPointer={laserPointer}
            onLaserMove={onLaserMove}
            isOverlay={true}
            onCloseOverlay={() => setShowAnnotationOverlay(false)}
            authorName={authorName}
          />
        </div>
      )}
    </div>
  );
};

