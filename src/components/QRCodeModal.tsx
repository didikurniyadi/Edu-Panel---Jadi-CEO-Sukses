import React, { useEffect, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode as QrIcon, Smartphone, Share2 } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, roomCode }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const studentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?room=${encodeURIComponent(roomCode)}&role=student`
    : `https://edupanel.app?room=${roomCode}&role=student`;

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(
      studentUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#1e3a8a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isOpen, studentUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(studentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-md my-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl text-center flex flex-col max-h-[92vh] overflow-y-auto scrollbar-thin"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        {/* Close Button - prominent, easy to click on IFP/touch/desktop */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm transition active:scale-95 z-10"
          aria-label="Tutup jendela QR code"
          title="Tutup (Esc)"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-10 text-left mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <QrIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 id="qr-modal-title" className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Pindai QR Kode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arahkan kamera ponsel/tablet untuk sinkronisasi
            </p>
          </div>
        </div>

        {/* Room Code Badge */}
        <div className="my-2.5 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 self-center">
          <span className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
            Kode Ruang:
          </span>
          <span className="text-base font-black text-blue-600 dark:text-blue-400 tracking-widest font-mono">
            {roomCode}
          </span>
        </div>

        {/* QR Code Container - Proportional Sizing */}
        <div className="my-2 flex justify-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-blue-500/20 shadow-md inline-block">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code Ruang ${roomCode}`}
                className="w-40 h-40 sm:w-44 sm:h-44 object-contain mx-auto rounded-lg block"
              />
            ) : (
              <div className="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center text-xs text-slate-400">
                Membuat QR Code...
              </div>
            )}
          </div>
        </div>

        {/* Step Guide - Compact & Clear */}
        <div className="grid grid-cols-3 gap-2 my-2.5 text-[11px] text-slate-600 dark:text-slate-400 text-left bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0">1</span>
            <span className="leading-tight">Pindai QR di gawai siswa</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0">2</span>
            <span className="leading-tight">Isi nama & asesmen awal</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[9px] shrink-0">3</span>
            <span className="leading-tight">Terhubung ke IFP kelas</span>
          </div>
        </div>

        {/* Share & Copy Link */}
        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={studentUrl}
            className="w-full text-xs font-mono py-2 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 select-all"
            aria-label="Tautan gabung siswa"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition shrink-0 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin'}
          </button>
        </div>

        {/* Bottom Close Button for extra IFP / touch accessibility */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition active:scale-95"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};

