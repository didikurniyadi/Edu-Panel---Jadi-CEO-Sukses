import React, { useState } from 'react';
import { StudentSubmission, GroupResult, Gender } from '../types';
import { CATEGORY_DEFINITIONS } from '../data/assessmentData';
import {
  Users,
  Sliders,
  Sparkles,
  Shuffle,
  ShieldAlert,
  ArrowRightLeft,
  FileSpreadsheet,
  CheckCircle2,
  Award,
  Compass,
  Megaphone,
  Coins,
  Palette,
  Briefcase,
  Printer,
} from 'lucide-react';

interface PembagianKelompokProps {
  groups: GroupResult[];
  submissions: StudentSubmission[];
  groupSettings: {
    targetGroupSize: number;
    distributionMode: 'balanced' | 'homogeneous';
  };
  onUpdateSettings: (settings: { targetGroupSize: number; distributionMode: 'balanced' | 'homogeneous' }) => void;
  onManualOverride: (groups: GroupResult[]) => void;
  onOpenSpreadsheetModal: () => void;
}

export const PembagianKelompok: React.FC<PembagianKelompokProps> = ({
  groups,
  submissions,
  groupSettings,
  onUpdateSettings,
  onManualOverride,
  onOpenSpreadsheetModal,
}) => {
  const [selectedStudentForSwap, setSelectedStudentForSwap] = useState<{
    groupId: string;
    student: StudentSubmission;
  } | null>(null);

  const maleGroups = groups.filter((g) => g.gender === 'Laki-laki');
  const femaleGroups = groups.filter((g) => g.gender === 'Perempuan');

  const maleCount = submissions.filter((s) => s.gender === 'Laki-laki').length;
  const femaleCount = submissions.filter((s) => s.gender === 'Perempuan').length;

  const handleGroupSizeChange = (newSize: number) => {
    onUpdateSettings({
      ...groupSettings,
      targetGroupSize: newSize,
    });
  };

  const handleModeChange = (mode: 'balanced' | 'homogeneous') => {
    onUpdateSettings({
      ...groupSettings,
      distributionMode: mode,
    });
  };

  // Assign recommended dynamic roles for students in a group
  const getRoleRecommendation = (member: StudentSubmission, index: number, totalMembers: number) => {
    if (index === 0) {
      return {
        role: 'Ketua / Manajer Tim',
        icon: <Award className="w-3.5 h-3.5 text-amber-500" />,
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
      };
    } else if (index === 1) {
      return {
        role: 'Perancang Produk & Ide',
        icon: <Palette className="w-3.5 h-3.5 text-blue-500" />,
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
      };
    } else if (index === 2) {
      return {
        role: 'Pemasaran & Promosi',
        icon: <Megaphone className="w-3.5 h-3.5 text-emerald-500" />,
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
      };
    } else {
      return {
        role: 'Keuangan & Logistik',
        icon: <Coins className="w-3.5 h-3.5 text-purple-500" />,
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300',
      };
    }
  };

  // Swap students between groups manually on the IFP
  const handleSwapClick = (groupId: string, student: StudentSubmission) => {
    if (!selectedStudentForSwap) {
      setSelectedStudentForSwap({ groupId, student });
      return;
    }

    // Must be same gender to preserve gender segregation rule!
    if (selectedStudentForSwap.student.gender !== student.gender) {
      alert('Sesuai aturan, pertukaran murid hanya dapat dilakukan antar kelompok yang memiliki gender sama (Laki-laki dengan Laki-laki, Perempuan dengan Perempuan).');
      setSelectedStudentForSwap(null);
      return;
    }

    if (selectedStudentForSwap.groupId === groupId) {
      setSelectedStudentForSwap(null);
      return;
    }

    // Execute swap
    const nextGroups = groups.map((g) => {
      let nextMembers = [...g.members];
      if (g.id === selectedStudentForSwap.groupId) {
        nextMembers = nextMembers.map((m) =>
          m.id === selectedStudentForSwap.student.id ? student : m
        );
      } else if (g.id === groupId) {
        nextMembers = nextMembers.map((m) =>
          m.id === student.id ? selectedStudentForSwap.student : m
        );
      }
      const avg =
        nextMembers.length > 0
          ? Number((nextMembers.reduce((sum, m) => sum + m.totalScore, 0) / nextMembers.length).toFixed(1))
          : 0;
      return { ...g, members: nextMembers, avgScore: avg };
    });

    onManualOverride(nextGroups);
    setSelectedStudentForSwap(null);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Settings Toolbar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Otomatisasi Pembagian Kelompok
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                Pemisahan Gender Aktif
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Kelompok Belajar Wirausaha Dinamis
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Dikelompokkan secara real-time berdasarkan skor kemampuan dengan gender terpisah: Laki-laki dengan Laki-laki, Perempuan dengan Perempuan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSpreadsheetModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md transition active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Kelompok ke Sheets</span>
            </button>
          </div>
        </div>

        {/* Configuration Controls Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          {/* Target Group Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Ukuran Kelompok Target (Pedoman Modul: 4–5 Murid)
            </label>
            <div className="flex items-center gap-2">
              {[3, 4, 5, 6].map((size) => (
                <button
                  key={size}
                  onClick={() => handleGroupSizeChange(size)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    groupSettings.targetGroupSize === size
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 dark:ring-blue-800'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {size} Siswa
                </button>
              ))}
            </div>
          </div>

          {/* Ability Distribution Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Profil Kemampuan / Distribusi Skor
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleModeChange('balanced')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  groupSettings.distributionMode === 'balanced'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 dark:ring-blue-800'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                }`}
                title="Menyeimbangkan murid skor tinggi, sedang, dan rendah di setiap tim"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heterogen (Seimbang)</span>
              </button>

              <button
                onClick={() => handleModeChange('homogeneous')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  groupSettings.distributionMode === 'homogeneous'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 dark:ring-blue-800'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100'
                }`}
                title="Mengelompokkan murid dengan rentang skor yang serupa"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Homogen (Setara)</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Statistik Kelas Saat Ini
            </span>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
              <div>
                👦 Putra:{' '}
                <span className="font-bold font-mono text-blue-600">
                  {maleCount} siswa ({maleGroups.length} kelompok)
                </span>
              </div>
              <div>
                👧 Putri:{' '}
                <span className="font-bold font-mono text-pink-600">
                  {femaleCount} siswa ({femaleGroups.length} kelompok)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Help Tip */}
        {selectedStudentForSwap && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 animate-pulse">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-600" />
              <span>
                Sedang memindahkan: <strong>{selectedStudentForSwap.student.nama}</strong> ({selectedStudentForSwap.student.gender}). Klik murid lain di kelompok sesama gender untuk menukar posisi!
              </span>
            </div>
            <button
              onClick={() => setSelectedStudentForSwap(null)}
              className="px-2.5 py-1 rounded-lg bg-amber-200 text-amber-900 font-bold hover:bg-amber-300"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      {/* No Students Alert */}
      {submissions.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Belum Ada Data Asesmen Murid
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Buka menu <strong>"Analisis Asesmen"</strong> dan klik <strong>"Muat 24 Siswa Sampel"</strong>, atau minta murid memindai kode QR untuk mengisi asesmen awal.
          </p>
        </div>
      )}

      {/* Section 1: KELOMPOK PUTRA (LAKI-LAKI DENGAN LAKI-LAKI) */}
      {maleGroups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              👦
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Kelompok Belajar Putra (Laki-laki)
              </h2>
              <p className="text-xs text-slate-500">
                Total {maleCount} siswa terbagi ke dalam {maleGroups.length} kelompok dengan profil kemampuan seimbang
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {maleGroups.map((group, gIdx) => (
              <div
                key={group.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Group Card Header */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-blue-950/40 border-b border-blue-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      Kelompok Putra #{gIdx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-blue-600 text-white shadow-sm">
                      Rata-Rata: {group.avgScore}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {group.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {group.members.length} Anggota Tim
                  </div>
                </div>

                {/* Members List */}
                <div className="p-4 space-y-2.5 flex-1">
                  {group.members.map((member, mIdx) => {
                    const roleInfo = getRoleRecommendation(member, mIdx, group.members.length);
                    const def = CATEGORY_DEFINITIONS[member.kategori];
                    const isSelected = selectedStudentForSwap?.student.id === member.id;

                    return (
                      <div
                        key={member.id}
                        onClick={() => handleSwapClick(group.id, member)}
                        className={`p-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 ring-2 ring-amber-400'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                        }`}
                        title="Klik untuk menukar anggota dengan kelompok lain"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {member.nama}
                          </span>
                          <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">
                            Skor: {member.totalScore}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {/* Role Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${roleInfo.badge}`}
                          >
                            {roleInfo.icon}
                            <span>{roleInfo.role}</span>
                          </span>

                          {/* Category Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${def.badgeColor}`}
                          >
                            {member.kategori}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Play Therapy Task Hint */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Stand Pasar Kreatif #{gIdx + 1}</span>
                  <span className="text-blue-600 font-semibold">Tugas: Rancang Produk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: KELOMPOK PUTRI (PEREMPUAN DENGAN PEREMPUAN) */}
      {femaleGroups.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-sm">
              👧
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Kelompok Belajar Putri (Perempuan)
              </h2>
              <p className="text-xs text-slate-500">
                Total {femaleCount} siswa terbagi ke dalam {femaleGroups.length} kelompok dengan profil kemampuan seimbang
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {femaleGroups.map((group, gIdx) => (
              <div
                key={group.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900/60 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                {/* Group Card Header */}
                <div className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-slate-800/80 dark:to-pink-950/40 border-b border-pink-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider">
                      Kelompok Putri #{gIdx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-pink-600 text-white shadow-sm">
                      Rata-Rata: {group.avgScore}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {group.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {group.members.length} Anggota Tim
                  </div>
                </div>

                {/* Members List */}
                <div className="p-4 space-y-2.5 flex-1">
                  {group.members.map((member, mIdx) => {
                    const roleInfo = getRoleRecommendation(member, mIdx, group.members.length);
                    const def = CATEGORY_DEFINITIONS[member.kategori];
                    const isSelected = selectedStudentForSwap?.student.id === member.id;

                    return (
                      <div
                        key={member.id}
                        onClick={() => handleSwapClick(group.id, member)}
                        className={`p-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 ring-2 ring-amber-400'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-pink-50/50 dark:hover:bg-slate-800'
                        }`}
                        title="Klik untuk menukar anggota dengan kelompok lain"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {member.nama}
                          </span>
                          <span className="text-xs font-mono font-black text-pink-600 dark:text-pink-400">
                            Skor: {member.totalScore}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {/* Role Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${roleInfo.badge}`}
                          >
                            {roleInfo.icon}
                            <span>{roleInfo.role}</span>
                          </span>

                          {/* Category Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${def.badgeColor}`}
                          >
                            {member.kategori}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Play Therapy Task Hint */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Stand Pasar Kreatif #{gIdx + 1}</span>
                  <span className="text-pink-600 font-semibold">Tugas: Rancang Produk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
