/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { HeaderNavbar, NavTab } from './components/HeaderNavbar';
import { QRCodeModal } from './components/QRCodeModal';
import { SpreadsheetModal } from './components/SpreadsheetModal';
import { CollaborativeWhiteboard } from './components/CollaborativeWhiteboard';
import { MateriSlideViewer } from './components/MateriSlideViewer';
import { AsesmenForm } from './components/AsesmenForm';
import { AsesmenAnalisis } from './components/AsesmenAnalisis';
import { PembagianKelompok } from './components/PembagianKelompok';
import { LKPDViewer } from './components/LKPDViewer';
import { OfflineBanner } from './components/OfflineBanner';
import { SAMPLE_STUDENTS } from './data/assessmentData';
import { StudentSubmission } from './types';
import {
  Sparkles,
  Smartphone,
  Monitor,
  Users,
  Trophy,
  ClipboardList,
  BookOpen,
  PenTool,
} from 'lucide-react';

export default function App() {
  // Read query params from URL
  const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialRoom = (queryParams.get('room') || 'WIRA-1').toUpperCase();
  const initialRole = queryParams.get('role') === 'student' ? 'student' : 'teacher';

  const [roomCode, setRoomCode] = useState<string>(initialRoom);
  const [userRole, setUserRole] = useState<'teacher' | 'student'>(initialRole);
  const [activeTab, setActiveTab] = useState<NavTab>('materi');
  const [isQROpen, setIsQROpen] = useState<boolean>(false);
  const [isSpreadsheetOpen, setIsSpreadsheetOpen] = useState<boolean>(false);

  // Student profile state (kosong secara default agar siswa mengetik sendiri)
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('edupanel_student_name') || '';
  });
  const [studentId, setStudentId] = useState<string>(() => {
    let id = localStorage.getItem('edupanel_student_id');
    if (!id) {
      id = `student-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      localStorage.setItem('edupanel_student_id', id);
    }
    return id;
  });

  // Real-time synchronization hook
  const {
    connectionStatus,
    connectedCount,
    currentSlide,
    sendSlideChange,
    strokes,
    sendDrawStroke,
    sendUndoStroke,
    sendClearCanvas,
    laserPointer,
    sendLaserMove,
    submissions,
    submitAssessment,
    groups,
    groupSettings,
    updateGroupSettings,
    manualOverrideGroups,
    loadSampleData,
    resetAssessmentData,
    lkpdByGroup,
    updateLKPD,
  } = useRealtimeSync(roomCode, userRole, userRole === 'teacher' ? 'Guru IFP' : studentName);

  // Find student's own group if in student mode
  const studentAssignedGroup = groups.find((g) =>
    g.members.some((m) => m.id === studentId || m.nama === studentName)
  );

  const handleAssessmentSubmit = (sub: StudentSubmission) => {
    setStudentName(sub.nama);
    localStorage.setItem('edupanel_student_name', sub.nama);
    submitAssessment(sub);
  };

  const handleLoadSample = () => {
    loadSampleData(SAMPLE_STUDENTS);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none">
      {/* Top Navigation Bar */}
      <HeaderNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
        onRoleChange={setUserRole}
        roomCode={roomCode}
        onRoomCodeChange={setRoomCode}
        onOpenQR={() => setIsQROpen(true)}
        connectionStatus={connectionStatus}
        connectedCount={connectedCount}
      />

      {/* Main Content Area */}
      <main className={`flex-1 relative ${activeTab === 'materi' || activeTab === 'whiteboard' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {/* TAB 1: Materi Presentasi IFP */}
        {activeTab === 'materi' && (
          <MateriSlideViewer
            currentSlide={currentSlide}
            onSlideChange={sendSlideChange}
            strokes={strokes}
            onDrawStroke={sendDrawStroke}
            onUndoStroke={sendUndoStroke}
            onClearCanvas={sendClearCanvas}
            laserPointer={laserPointer}
            onLaserMove={sendLaserMove}
            authorName={userRole === 'teacher' ? 'Guru IFP' : studentName}
          />
        )}

        {/* TAB 2: Papan Tulis Kolaboratif Digital */}
        {activeTab === 'whiteboard' && (
          <CollaborativeWhiteboard
            strokes={strokes}
            onDrawStroke={sendDrawStroke}
            onUndo={sendUndoStroke}
            onClear={sendClearCanvas}
            laserPointer={laserPointer}
            onLaserMove={sendLaserMove}
            isOverlay={false}
            authorName={userRole === 'teacher' ? 'Guru IFP' : studentName}
          />
        )}

        {/* TAB 3: Asesmen Awal (10 Soal Berdasarkan PDF) */}
        {activeTab === 'asesmen' && (
          <div className="py-6">
            <AsesmenForm
              onSubmit={handleAssessmentSubmit}
              defaultName={userRole === 'student' ? studentName : ''}
            />
          </div>
        )}

        {/* TAB 4: Analisis Asesmen & Skor */}
        {activeTab === 'analisis' && (
          <div className="py-6">
            <AsesmenAnalisis
              submissions={submissions}
              groups={groups}
              onLoadSample={handleLoadSample}
              onResetData={resetAssessmentData}
              onOpenSpreadsheetModal={() => setIsSpreadsheetOpen(true)}
            />
          </div>
        )}

        {/* TAB 5: Pembagian Kelompok Dinamis & Gender Terpisah */}
        {activeTab === 'kelompok' && (
          <div className="py-6">
            {/* If in student mode, highlight personal assigned group at top */}
            {userRole === 'student' && studentAssignedGroup && (
              <div className="max-w-7xl mx-auto px-4 md:px-8 mb-6">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">
                      Kelompok Belajar Anda Telah Ditentukan
                    </span>
                    <h2 className="text-2xl font-black mt-1">{studentAssignedGroup.name}</h2>
                    <p className="text-xs text-emerald-100 mt-1">
                      {studentAssignedGroup.members.length} Anggota • Rata-rata Skor Kelompok: {studentAssignedGroup.avgScore}
                    </p>
                  </div>
                  <div className="text-4xl font-black">🌟</div>
                </div>
              </div>
            )}

            <PembagianKelompok
              groups={groups}
              submissions={submissions}
              groupSettings={groupSettings}
              onUpdateSettings={updateGroupSettings}
              onManualOverride={manualOverrideGroups}
              onOpenSpreadsheetModal={() => setIsSpreadsheetOpen(true)}
            />
          </div>
        )}

        {/* TAB 6: LKPD Kolaborasi Kelompok */}
        {activeTab === 'lkpd' && (
          <div className="py-6">
            <LKPDViewer
              lkpdByGroup={lkpdByGroup}
              onUpdateLKPD={updateLKPD}
              groups={groups}
              userRole={userRole}
              currentStudentName={studentName}
              onOpenSpreadsheetModal={() => setIsSpreadsheetOpen(true)}
            />
          </div>
        )}
      </main>

      {/* QR Code Modal for IFP */}
      <QRCodeModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        roomCode={roomCode}
      />

      {/* Google Spreadsheets Integration Modal */}
      <SpreadsheetModal
        isOpen={isSpreadsheetOpen}
        onClose={() => setIsSpreadsheetOpen(false)}
        submissions={submissions}
        groups={groups}
        lkpdByGroup={lkpdByGroup}
      />

      {/* Offline Mode Indicator */}
      <OfflineBanner />
    </div>
  );
}
