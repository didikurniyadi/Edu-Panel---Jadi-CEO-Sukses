import React, { useState } from 'react';
import { StudentSubmission, GroupResult, CategoryLevel } from '../types';
import {
  CATEGORY_DEFINITIONS,
  calculateDimensions,
  SAMPLE_STUDENTS,
} from '../data/assessmentData';
import {
  Users,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  RotateCcw,
  Search,
  Filter,
  Eye,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Trash2,
} from 'lucide-react';

interface AsesmenAnalisisProps {
  submissions: StudentSubmission[];
  groups: GroupResult[];
  onLoadSample: () => void;
  onResetData: () => void;
  onOpenSpreadsheetModal: () => void;
}

export const AsesmenAnalisis: React.FC<AsesmenAnalisisProps> = ({
  submissions,
  groups,
  onLoadSample,
  onResetData,
  onOpenSpreadsheetModal,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterGender, setFilterGender] = useState<'Semua' | 'Laki-laki' | 'Perempuan'>('Semua');
  const [filterCategory, setFilterCategory] = useState<'Semua' | CategoryLevel>('Semua');
  const [selectedStudent, setSelectedStudent] = useState<StudentSubmission | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [showResetSuccessToast, setShowResetSuccessToast] = useState<boolean>(false);

  // Class statistics
  const totalStudents = submissions.length;
  const maleCount = submissions.filter((s) => s.gender === 'Laki-laki').length;
  const femaleCount = submissions.filter((s) => s.gender === 'Perempuan').length;

  const avgScore =
    totalStudents > 0
      ? Number((submissions.reduce((sum, s) => sum + s.totalScore, 0) / totalStudents).toFixed(1))
      : 0;

  // Category counts
  const categoryCounts: Record<CategoryLevel, number> = {
    Tinggi: submissions.filter((s) => s.kategori === 'Tinggi').length,
    Sedang: submissions.filter((s) => s.kategori === 'Sedang').length,
    Rendah: submissions.filter((s) => s.kategori === 'Rendah').length,
    'Sangat Rendah': submissions.filter((s) => s.kategori === 'Sangat Rendah').length,
  };

  // Class average dimension scores
  const sampleAnswersAverage: Record<number, number> = {};
  for (let q = 1; q <= 10; q++) {
    if (totalStudents > 0) {
      const sum = submissions.reduce((acc, s) => acc + (s.answers[q] || 0), 0);
      sampleAnswersAverage[q] = Math.round(sum / totalStudents);
    } else {
      sampleAnswersAverage[q] = 0;
    }
  }
  const classDimensions = calculateDimensions(sampleAnswersAverage);

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'Semua' || s.gender === filterGender;
    const matchesCategory = filterCategory === 'Semua' || s.kategori === filterCategory;
    return matchesSearch && matchesGender && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Control Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            Dasbor Analisis IFP
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Analisis Asesmen Minat Kewirausahaan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Evaluasi diagnostik kemampuan & profil siswa secara langsung dari modul MGBK Banyumas
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {submissions.length === 0 && (
            <button
              onClick={onLoadSample}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm shadow-md transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Muat 24 Siswa Sampel (Demo)</span>
            </button>
          )}

          <button
            onClick={onOpenSpreadsheetModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor / Link Spreadsheet</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (submissions.length === 0) return;
              setShowResetConfirmModal(true);
            }}
            disabled={submissions.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
              submissions.length === 0
                ? 'text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900 shadow-sm cursor-pointer'
            }`}
            title={submissions.length === 0 ? "Data asesmen sudah kosong" : "Reset Data Asesmen"}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Responden</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {totalStudents}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>👦 Laki-laki: {maleCount}</span>
            <span>•</span>
            <span>👧 Perempuan: {femaleCount}</span>
          </div>
        </div>

        {/* Class Average Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata Kelas</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono">
            {avgScore}{' '}
            <span className="text-lg font-normal text-slate-400">/ 50</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Status:{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {avgScore >= 46
                ? 'Tinggi'
                : avgScore >= 36
                ? 'Sedang'
                : avgScore >= 26
                ? 'Rendah'
                : 'Sangat Rendah'}
            </span>
          </div>
        </div>

        {/* Gender Balance Indicator */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Keseimbangan Gender</span>
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-3 flex items-center gap-1.5 h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <div
              className="bg-blue-600 h-full transition-all"
              style={{
                width: totalStudents > 0 ? `${(maleCount / totalStudents) * 100}%` : '50%',
              }}
              title={`Laki-laki: ${maleCount}`}
            />
            <div
              className="bg-pink-500 h-full transition-all"
              style={{
                width: totalStudents > 0 ? `${(femaleCount / totalStudents) * 100}%` : '50%',
              }}
              title={`Perempuan: ${femaleCount}`}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-500 mt-2">
            <span className="text-blue-600">
              Putra: {totalStudents > 0 ? Math.round((maleCount / totalStudents) * 100) : 0}%
            </span>
            <span className="text-pink-500">
              Putri: {totalStudents > 0 ? Math.round((femaleCount / totalStudents) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Groups Formed Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Kelompok Terbentuk</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {groups.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {groups.filter((g) => g.gender === 'Laki-laki').length} Kelompok Putra •{' '}
            {groups.filter((g) => g.gender === 'Perempuan').length} Kelompok Putri
          </div>
        </div>
      </div>

      {/* Category Distribution Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Distribusi Kategori Minat Wirausaha Siswa (Pedoman Halaman 16 Modul)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['Tinggi', 'Sedang', 'Rendah', 'Sangat Rendah'] as CategoryLevel[]).map((cat) => {
            const count = categoryCounts[cat];
            const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
            const def = CATEGORY_DEFINITIONS[cat];

            return (
              <div
                key={cat}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${def.badgeColor}`}>
                    {cat}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                    {count} Siswa ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className={`h-full ${def.bgColor}`} style={{ width: `${percent}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {def.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Dimensions of Entrepreneurial Behavior */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Analisis 6 Dimensi Perilaku Kewirausahaan Kelas</span>
          </h2>
          <span className="text-xs text-slate-400">Berdasarkan pemetaan 10 soal asesmen</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classDimensions.map((dim, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {dim.name}
                </span>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {dim.percentage}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                  style={{ width: `${dim.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {dim.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Students Submissions List Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Daftar Responden Asesmen ({filteredSubmissions.length} dari {submissions.length})
          </h2>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama / NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>

            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="Semua">Semua Gender</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Tinggi">Tinggi (46-50)</option>
              <option value="Sedang">Sedang (36-45)</option>
              <option value="Rendah">Rendah (26-35)</option>
              <option value="Sangat Rendah">Sangat Rendah (16-25)</option>
            </select>

            {(searchTerm !== '' || filterGender !== 'Semua' || filterCategory !== 'Semua') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterGender('Semua');
                  setFilterCategory('Semua');
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 transition active:scale-95"
                title="Reset Filter Pencarian"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold">
                <th className="py-3 px-3">No</th>
                <th className="py-3 px-3">Nama Siswa</th>
                <th className="py-3 px-3">NIS</th>
                <th className="py-3 px-3">Gender</th>
                <th className="py-3 px-3 text-center">Total Skor</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Refleksi / Ide</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Belum ada data asesmen murid yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((s, idx) => {
                  const def = CATEGORY_DEFINITIONS[s.kategori];
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {s.nama}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">{s.nis}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            s.gender === 'Laki-laki'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                              : 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300'
                          }`}
                        >
                          {s.gender === 'Laki-laki' ? '👦 Putra' : '👧 Putri'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-base text-blue-600 dark:text-blue-400">
                        {s.totalScore}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${def.badgeColor}`}
                        >
                          {s.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-xs text-slate-500 max-w-xs truncate">
                        {s.refleksi || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 transition"
                          title="Lihat Detail Jawaban 10 Soal"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center font-black text-xl">
                {selectedStudent.nama.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedStudent.nama}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedStudent.gender} • NIS: {selectedStudent.nis} • {selectedStudent.kelas}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Total Skor</span>
                <div className="text-3xl font-black text-blue-600 font-mono">
                  {selectedStudent.totalScore} / 50
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  CATEGORY_DEFINITIONS[selectedStudent.kategori].badgeColor
                }`}
              >
                Kategori: {selectedStudent.kategori}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Skor 10 Pernyataan Modul AKSES:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((qId) => (
                  <div
                    key={qId}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex justify-between items-center"
                  >
                    <span className="text-slate-500">Pernyataan #{qId}</span>
                    <span className="font-mono font-bold text-blue-600">
                      Skor {selectedStudent.answers[qId] || 0} / 5
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedStudent.refleksi && (
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold block mb-1">Refleksi / Ide Usaha Murid:</span>
                "{selectedStudent.refleksi}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Resetting Assessment Data */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Reset Seluruh Data Asesmen?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Konfirmasi pengosongan data respon & skor
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
              Tindakan ini akan mengosongkan seluruh data responden (<strong>{submissions.length} siswa</strong>), perolehan skor, analisis 6 dimensi, serta pembagian kelompok yang telah terbentuk di room ini.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setSearchTerm('');
                  setFilterGender('Semua');
                  setFilterCategory('Semua');
                  setShowResetConfirmModal(false);
                  setShowResetSuccessToast(true);
                  setTimeout(() => setShowResetSuccessToast(false), 3000);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Reset Semua Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback for Successful Reset */}
      {showResetSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Seluruh data asesmen dan skor berhasil direset!</span>
        </div>
      )}
    </div>
  );
};
