import React, { useState } from 'react';
import { StudentSubmission, GroupResult, LKPDData } from '../types';
import {
  X,
  FileSpreadsheet,
  Copy,
  Check,
  Download,
  ExternalLink,
  Send,
  Code,
  CheckCircle,
  AlertCircle,
  Sparkles,
  FileText,
} from 'lucide-react';

interface SpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: StudentSubmission[];
  groups: GroupResult[];
  lkpdByGroup?: Record<string, LKPDData>;
}

export const SpreadsheetModal: React.FC<SpreadsheetModalProps> = ({
  isOpen,
  onClose,
  submissions,
  groups,
  lkpdByGroup = {},
}) => {
  const [activeSheetTab, setActiveSheetTab] = useState<'asesmen' | 'lkpd'>('asesmen');
  const [copied, setCopied] = useState<boolean>(false);
  const [webhookUrl, setWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('edupanel_sheets_webhook') || '';
  });
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [pushStatus, setPushStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showScriptGuide, setShowScriptGuide] = useState<boolean>(false);

  if (!isOpen) return null;

  // Find assigned group name for each student
  const getStudentGroup = (subId: string): string => {
    for (const g of groups) {
      if (g.members.some((m) => m.id === subId)) {
        return g.name;
      }
    }
    return 'Belum Ditentukan';
  };

  // Generate Tab-Separated Values (TSV) for seamless Google Sheets Ctrl+V paste
  const generateTSV = (): string => {
    if (activeSheetTab === 'lkpd') {
      const headers = [
        'No',
        'Nama Kelompok',
        'Sektor Usaha',
        'Tanggal Asesmen',
        'Ketua Kelompok',
        'Anggota Tim',
        'Nama Merek / Brand',
        'Slogan Promosi',
        'Target Konsumen',
        'Strategi Pemasaran',
        'Total Modal (HPP)',
        'Total Nilai Penjualan',
        'Estimasi Laba Kotor',
        'Margin (%)',
        'Skor Orisinalitas',
        'Skor Kearifan Lokal',
        'Skor Kelayakan Biaya',
        'Skor Kolaborasi',
        'TOTAL NILAI LKPD',
        'Refleksi Kelompok',
      ];

      const lkpdList = Object.values(lkpdByGroup);
      const rows = lkpdList.map((lkpd, idx) => {
        const totalModal = lkpd.tabelHpp.reduce((sum, r) => sum + (Number(r.modalHpp) || 0), 0);
        const totalJual = lkpd.tabelHpp.reduce((sum, r) => sum + (Number(r.hargaJual) || 0), 0);
        const laba = totalJual - totalModal;
        const margin = totalJual > 0 ? Math.round((laba / totalJual) * 100) : 0;
        const totalNilai =
          (lkpd.skorOrisinalitas || 0) +
          (lkpd.skorKearifanLokal || 0) +
          (lkpd.skorKelayakanBiaya || 0) +
          (lkpd.skorKolaborasi || 0);

        return [
          idx + 1,
          lkpd.groupName,
          lkpd.sektorUsaha,
          lkpd.tanggalAsesmen,
          lkpd.ketuaNama,
          `"${lkpd.members.filter(Boolean).join(', ')}"`,
          lkpd.namaMerek,
          lkpd.sloganPromosi,
          `"${(lkpd.targetKonsumen || '').replace(/"/g, '""')}"`,
          `"${(lkpd.strategiPemasaran || '').replace(/"/g, '""')}"`,
          totalModal,
          totalJual,
          laba,
          `${margin}%`,
          lkpd.skorOrisinalitas || 0,
          lkpd.skorKearifanLokal || 0,
          lkpd.skorKelayakanBiaya || 0,
          lkpd.skorKolaborasi || 0,
          totalNilai,
          `"${(lkpd.kesimpulanRefleksi || '').replace(/"/g, '""')}"`,
        ];
      });

      return [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    }

    const headers = [
      'No',
      'NIS/NISN',
      'Nama Lengkap',
      'Jenis Kelamin',
      'Kelas',
      'Sekolah',
      'Q1',
      'Q2',
      'Q3',
      'Q4',
      'Q5',
      'Q6',
      'Q7',
      'Q8',
      'Q9',
      'Q10',
      'Total Skor',
      'Kategori Minat',
      'Kelompok Belajar',
      'Refleksi Siswa',
      'Waktu Pengisian',
    ];

    const rows = submissions.map((s, idx) => [
      idx + 1,
      s.nis,
      s.nama,
      s.gender,
      s.kelas,
      s.sekolah,
      s.answers[1] || 0,
      s.answers[2] || 0,
      s.answers[3] || 0,
      s.answers[4] || 0,
      s.answers[5] || 0,
      s.answers[6] || 0,
      s.answers[7] || 0,
      s.answers[8] || 0,
      s.answers[9] || 0,
      s.answers[10] || 0,
      s.totalScore,
      s.kategori,
      getStudentGroup(s.id),
      `"${(s.refleksi || '').replace(/"/g, '""')}"`,
      s.waktu,
    ]);

    return [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  };

  const handleCopyTSV = async () => {
    try {
      const tsv = generateTSV();
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadCSV = () => {
    const tsv = generateTSV();
    // Convert tabs to commas for standard CSV
    const csvContent =
      '\uFEFF' +
      tsv
        .split('\n')
        .map((row) =>
          row
            .split('\t')
            .map((col) => (col.includes(',') ? `"${col.replace(/"/g, '""')}"` : col))
            .join(',')
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Asesmen_Wirausaha_Banyumas_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePushToWebhook = async () => {
    if (!webhookUrl.trim()) {
      setPushStatus({
        success: false,
        message: 'Masukkan URL Webhook Google Apps Script terlebih dahulu.',
      });
      return;
    }

    setIsPushing(true);
    setPushStatus(null);
    localStorage.setItem('edupanel_sheets_webhook', webhookUrl.trim());

    try {
      const payload = {
        timestamp: new Date().toISOString(),
        totalStudents: submissions.length,
        submissions: submissions.map((s) => ({
          ...s,
          kelompok: getStudentGroup(s.id),
        })),
      };

      const res = await fetch('/api/spreadsheet-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim(), payload }),
      });

      const data = await res.json();
      if (data.success) {
        setPushStatus({
          success: true,
          message: 'Data berhasil disinkronkan langsung ke Google Sheets Anda!',
        });
      } else {
        setPushStatus({
          success: false,
          message: data.error || 'Gagal mengirim data ke Google Sheets.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Koneksi gagal.';
      setPushStatus({ success: false, message: msg });
    } finally {
      setIsPushing(false);
    }
  };

  const sampleAppsScriptCode = `// Buka Google Sheets -> Ekstensi (Extensions) -> Apps Script
// Ganti seluruh isi kode dengan skrip di bawah ini, lalu klik Deploy -> Web App (Akses: Anyone/Siapa Saja)
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["No", "NIS", "Nama Lengkap", "Gender", "Kelas", "Sekolah", "Total Skor", "Kategori", "Kelompok", "Refleksi", "Waktu"]);
  }
  
  var students = data.submissions || [];
  for (var i = 0; i < students.length; i++) {
    var s = students[i];
    sheet.appendRow([i + 1, s.nis, s.nama, s.gender, s.kelas, s.sekolah, s.totalScore, s.kategori, s.kelompok, s.refleksi, s.waktu]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              Integrasi Google Spreadsheets
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Pilih data yang ingin diekspor atau disalin ke spreadsheet Anda
            </p>
          </div>
        </div>

        {/* Tab Selector: Asesmen Individu vs LKPD Kelompok */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveSheetTab('asesmen')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSheetTab === 'asesmen'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Data Asesmen Individu ({submissions.length} Siswa)</span>
          </button>

          <button
            onClick={() => setActiveSheetTab('lkpd')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSheetTab === 'lkpd'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>Data LKPD Proyek ({Object.keys(lkpdByGroup).length} Kelompok)</span>
          </button>
        </div>

        {/* Action 1: Instant Copy TSV & Open Sheets */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Opsi 1: Salin Instan & Tempel di Google Sheets
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Paling Praktis</span>
          </div>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
            Klik tombol di bawah untuk menyalin seluruh baris data terformat lengkap dengan nama,
            jawaban 10 soal, kategori, dan kelompok belajar. Lalu buka spreadsheet dan tekan{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">
              Ctrl+V
            </kbd>
            .
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleCopyTSV}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Berhasil Disalin ke Clipboard!' : 'Salin untuk Google Spreadsheet'}</span>
            </button>

            <a
              href="https://sheets.new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs md:text-sm transition"
            >
              <span>Buka Google Sheets Baru</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs md:text-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File CSV</span>
            </button>
          </div>
        </div>

        {/* Action 2: Direct Automated Webhook */}
        <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Opsi 2: Sinkronisasi Otomatis Real-time (Webhook Google Apps Script)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Hubungkan URL Webhook Google Apps Script Anda agar setiap data siswa langsung masuk
            secara otomatis ke lembar spreadsheet tanpa perlu salin manual.
          </p>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              URL Web App Google Apps Script
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handlePushToWebhook}
                disabled={isPushing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md disabled:opacity-50 shrink-0 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPushing ? 'Mengirim...' : 'Kirim Sekarang'}</span>
              </button>
            </div>
          </div>

          {pushStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                pushStatus.success
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300'
              }`}
            >
              {pushStatus.success ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{pushStatus.message}</span>
            </div>
          )}

          {/* Toggle Script Code Guide */}
          <div className="pt-1">
            <button
              onClick={() => setShowScriptGuide(!showScriptGuide)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showScriptGuide ? 'Sembunyikan' : 'Lihat Kode Google Apps Script (30 Detik)'}</span>
            </button>

            {showScriptGuide && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2 border border-slate-800">
                <div className="text-[11px] text-slate-400">
                  Salin skrip di bawah ke Editor Apps Script spreadsheet Anda:
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-300">
                  {sampleAppsScriptCode}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Data Preview Summary */}
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          Total Baris Siap Ekspor: <span className="font-bold text-slate-800 dark:text-slate-200">{submissions.length} siswa</span> •
          Laki-laki: <span className="font-bold">{submissions.filter((s) => s.gender === 'Laki-laki').length}</span> •
          Perempuan: <span className="font-bold">{submissions.filter((s) => s.gender === 'Perempuan').length}</span>
        </div>
      </div>
    </div>
  );
};
