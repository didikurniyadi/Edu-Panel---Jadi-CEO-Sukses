import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Database } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Mode Offline Aktif — Materi & Asesmen tetap dapat diakses dari cache lokal PWA.</span>
    </div>
  );
};
