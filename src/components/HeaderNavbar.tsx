import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Monitor,
  Smartphone,
  QrCode,
  Wifi,
  WifiOff,
  Maximize,
  Minimize,
  BookOpen,
  PenTool,
  ClipboardList,
  BarChart3,
  FileText,
  Users,
  Trophy,
  Sparkles,
  Layers,
} from 'lucide-react';

export type NavTab = 'materi' | 'whiteboard' | 'asesmen' | 'analisis' | 'kelompok' | 'lkpd';

interface HeaderNavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userRole: 'teacher' | 'student';
  onRoleChange: (role: 'teacher' | 'student') => void;
  roomCode: string;
  onRoomCodeChange: (code: string) => void;
  onOpenQR: () => void;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'offline';
  connectedCount: number;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  onTabChange,
  userRole,
  onRoleChange,
  roomCode,
  onRoomCodeChange,
  onOpenQR,
  connectionStatus,
  connectedCount,
}) => {
  const [isEditingRoom, setIsEditingRoom] = useState<boolean>(false);
  const [tempRoom, setTempRoom] = useState<string>(roomCode);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempRoom.trim()) {
      onRoomCodeChange(tempRoom.trim().toUpperCase());
      setIsEditingRoom(false);
    }
  };

  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'materi', label: 'Materi IFP', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'whiteboard', label: 'Papan Tulis', icon: <PenTool className="w-4 h-4" /> },
    { id: 'asesmen', label: 'Asesmen Awal', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'analisis', label: 'Analisis & Skor', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'kelompok', label: 'Pembagian Kelompok', icon: <Users className="w-4 h-4" /> },
    { id: 'lkpd', label: 'LKPD Kelompok', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
      {/* Top Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base md:text-lg text-slate-900 dark:text-white tracking-tight">
                EduPanel IFP
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                MGBK Banyumas
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Wirausaha Interaktif • Asesmen Diagnostik • Anotasi Kolaboratif
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Room Code Badge & QR Trigger */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-1">
            {isEditingRoom ? (
              <form onSubmit={handleSaveRoom} className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempRoom}
                  onChange={(e) => setTempRoom(e.target.value)}
                  className="w-20 px-2 py-1 text-xs font-mono font-bold uppercase rounded bg-white dark:bg-slate-900 border border-blue-500 outline-none text-slate-800 dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-[11px] bg-blue-600 text-white rounded font-bold"
                >
                  OK
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingRoom(true)}
                className="px-2.5 py-1 text-xs font-mono font-black text-blue-600 dark:text-blue-400 hover:underline"
                title="Klik untuk mengganti kode ruang"
              >
                Ruang: {roomCode}
              </button>
            )}

            <button
              onClick={onOpenQR}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition ml-1"
              title="Tampilkan QR Code untuk Siswa"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {/* Connected Count & Status */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
              connectionStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : connectionStatus === 'offline'
                ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {connectionStatus === 'connected' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
            <span>
              {connectionStatus === 'connected'
                ? `${connectedCount} Terhubung`
                : connectionStatus === 'offline'
                ? 'Offline'
                : 'Menghubungkan...'}
            </span>
          </div>

          {/* Role Switcher (Teacher IFP vs Student Device) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onRoleChange('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                userRole === 'teacher'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Tampilan Layar Utama IFP di Depan Kelas"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Layar IFP Guru</span>
            </button>

            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                userRole === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Tampilan Gawai Ponsel / Tablet Siswa"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mode Murid</span>
            </button>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            title="Layar Penuh IFP"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tab Navigation Row */}
      <div className="px-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex items-center gap-1 py-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
