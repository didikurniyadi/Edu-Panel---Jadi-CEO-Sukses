import React, { useState, useEffect, useRef } from 'react';
import { LKPDData, GroupResult, LKPDItemHPP } from '../types';
import { SEKTOR_OPTIONS, INITIAL_LKPD_DATA, DEMO_LKPD_EXAMPLES, createBlankLKPD } from '../data/lkpdData';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Printer,
  Sparkles,
  Users,
  CheckCircle2,
  PenTool,
  RotateCcw,
  Check,
  TrendingUp,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface LKPDViewerProps {
  lkpdByGroup: Record<string, LKPDData>;
  onUpdateLKPD: (groupId: string, data: LKPDData) => void;
  groups: GroupResult[];
  userRole: 'teacher' | 'student';
  currentStudentName?: string;
  onOpenSpreadsheetModal: () => void;
}

export const LKPDViewer: React.FC<LKPDViewerProps> = ({
  lkpdByGroup,
  onUpdateLKPD,
  groups,
  userRole,
  currentStudentName = 'Siswa',
  onOpenSpreadsheetModal,
}) => {
  // Available groups: either from formed groups in App, or default 6 groups from PDF
  const groupKeys = Object.keys(lkpdByGroup);
  const defaultKeys = ['kelompok-1', 'kelompok-2', 'kelompok-3', 'kelompok-4', 'kelompok-5', 'kelompok-6'];

  // Ensure default groups exist
  const combinedGroupKeys = Array.from(new Set([...groupKeys, ...defaultKeys]));

  const [activeGroupId, setActiveGroupId] = useState<string>(combinedGroupKeys[0] || 'kelompok-1');
  const [showSignatureModal, setShowSignatureModal] = useState<'ketua' | 'guru' | null>(null);
  const [signatureCanvasColor, setSignatureCanvasColor] = useState<string>('#1e3a8a');
  const [autoSavedNotice, setAutoSavedNotice] = useState<boolean>(false);

  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSig, setIsDrawingSig] = useState<boolean>(false);

  // Get active LKPD data or create default blank
  const activeLKPD: LKPDData =
    lkpdByGroup[activeGroupId] ||
    INITIAL_LKPD_DATA[activeGroupId] ||
    createBlankLKPD(activeGroupId, Number(activeGroupId.replace(/\D/g, '')) || 1);

  const activeSektorObj = SEKTOR_OPTIONS.find((s) => s.id === activeLKPD.sektorUsaha) || SEKTOR_OPTIONS[0];

  const handleFieldChange = (field: keyof LKPDData, value: any) => {
    const updated: LKPDData = {
      ...activeLKPD,
      [field]: value,
      updatedAt: Date.now(),
    };
    onUpdateLKPD(activeGroupId, updated);
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setAutoSavedNotice(true);
    setTimeout(() => setAutoSavedNotice(false), 2000);
  };

  // Reset isian kelompok menjadi kosong bersih dengan panduan samar-samar
  const handleResetBlank = () => {
    const num = Number(activeGroupId.replace(/\D/g, '')) || 1;
    const blank = createBlankLKPD(activeGroupId, num, activeLKPD.sektorUsaha, activeLKPD.varianGambar);
    onUpdateLKPD(activeGroupId, blank);
    triggerAutoSave();
  };

  // Muat contoh pengisian untuk demonstrasi guru pada layar IFP
  const handleLoadDemoExample = () => {
    const demo = DEMO_LKPD_EXAMPLES[activeLKPD.sektorUsaha] || DEMO_LKPD_EXAMPLES['1. USAHA KULINER LOKAL'];
    const updated: LKPDData = {
      ...activeLKPD,
      ...demo,
      updatedAt: Date.now(),
    };
    onUpdateLKPD(activeGroupId, updated);
    triggerAutoSave();
  };

  // Table HPP operations (dimulai dari kosong)
  const handleAddRowHPP = () => {
    const newRow: LKPDItemHPP = {
      id: `row-${Date.now()}`,
      namaProduk: '',
      modalHpp: 0,
      hargaJual: 0,
    };
    handleFieldChange('tabelHpp', [...activeLKPD.tabelHpp, newRow]);
  };

  const handleUpdateRowHPP = (index: number, field: keyof LKPDItemHPP, val: any) => {
    const nextTable = [...activeLKPD.tabelHpp];
    nextTable[index] = {
      ...nextTable[index],
      [field]: val,
    };
    handleFieldChange('tabelHpp', nextTable);
  };

  const handleDeleteRowHPP = (index: number) => {
    if (activeLKPD.tabelHpp.length <= 1) return;
    const nextTable = activeLKPD.tabelHpp.filter((_, idx) => idx !== index);
    handleFieldChange('tabelHpp', nextTable);
  };

  // HPP Total calculations
  const totalModalAwal = activeLKPD.tabelHpp.reduce((acc, row) => acc + (Number(row.modalHpp) || 0), 0);
  const totalNilaiPenjualan = activeLKPD.tabelHpp.reduce((acc, row) => acc + (Number(row.hargaJual) || 0), 0);
  const totalLabaKotor = totalNilaiPenjualan - totalModalAwal;
  const avgMargin = totalNilaiPenjualan > 0 ? Math.round((totalLabaKotor / totalNilaiPenjualan) * 100) : 0;

  // Rubrik Total Score
  const totalNilaiLKPD =
    (activeLKPD.skorOrisinalitas || 0) +
    (activeLKPD.skorKearifanLokal || 0) +
    (activeLKPD.skorKelayakanBiaya || 0) +
    (activeLKPD.skorKolaborasi || 0);

  // Predikat status
  const getPredikat = (score: number) => {
    if (score >= 90) return { label: 'Sangat Memuaskan (A+)', color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300' };
    if (score >= 80) return { label: 'Memuaskan (A)', color: 'text-blue-700 bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300' };
    if (score >= 70) return { label: 'Cukup Baik (B)', color: 'text-amber-700 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300' };
    return { label: 'Perlu Bimbingan (C)', color: 'text-rose-700 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300' };
  };

  // Signature canvas handlers
  useEffect(() => {
    if (showSignatureModal && sigCanvasRef.current) {
      const canvas = sigCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [showSignatureModal]);

  const handleStartSig = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    setIsDrawingSig(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMoveSig = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = signatureCanvasColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleEndSig = () => {
    setIsDrawingSig(false);
  };

  const handleClearSig = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSaveSig = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (showSignatureModal === 'ketua') {
      handleFieldChange('tandaTanganKetua', dataUrl);
    } else if (showSignatureModal === 'guru') {
      handleFieldChange('tandaTanganGuru', dataUrl);
    }
    setShowSignatureModal(null);
  };

  // Print document
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Top Controller Bar (IFP Touch-Friendly) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              Dokumen Resmi Proyek Kelompok PKWU
            </span>
            {autoSavedNotice && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                <Check className="w-3.5 h-3.5" /> Tersimpan Real-Time
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Lembar Kerja Peserta Didik (LKPD) Kolaboratif
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Siswa dapat berkolaborasi langsung pada layar Interactive Flat Panel (IFP) atau gawai kelompok
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Reset Bersih & Contoh Panduan */}
          <button
            onClick={handleResetBlank}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-bold transition border border-slate-200 dark:border-slate-700"
            title="Kosongkan semua isian agar lembar kerja bersih untuk dikerjakan siswa"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kosongkan Form</span>
          </button>

          <button
            onClick={handleLoadDemoExample}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold transition border border-amber-300 dark:border-amber-800"
            title="Muat contoh lengkap untuk demonstrasi guru pada layar IFP"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contoh Panduan</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
            title="Cetak Berkas LKPD Resmi A4"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Dokumen</span>
          </button>

          <button
            onClick={onOpenSpreadsheetModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
            title="Sinkronkan dengan Google Sheets"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Tautkan Sheets</span>
          </button>
        </div>
      </div>

      {/* Group Selector Bar (Interactive Touch Tabs on IFP) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none print:hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap pl-1">
          Pilih Kelompok:
        </span>
        {combinedGroupKeys.map((key, idx) => {
          const lkpd = lkpdByGroup[key] || INITIAL_LKPD_DATA[key];
          const name = lkpd && lkpd.groupName && lkpd.groupName.trim() ? lkpd.groupName : `Kelompok ${idx + 1}`;
          const isSelected = activeGroupId === key;

          return (
            <button
              key={key}
              onClick={() => setActiveGroupId(key)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN DOCUMENT CONTAINER (Styled identically to the uploaded PDF LKPD) */}
      <div className="bg-white text-slate-900 border-2 border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none">
        <div className="space-y-6">
          {/* Kop Surat Resmi */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                ⚡
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Pemerintah Kabupaten Banyumas • Dinas Pendidikan
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">
                  SMP NEGERI 2 KEMRANJEN
                </h2>
                <div className="text-xs font-extrabold uppercase text-slate-800 tracking-wide">
                  LEMBAR KERJA PESERTA DIDIK (LKPD) • PRAKARYA & KEWIRAUSAHAAN (PKWU)
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 rounded-lg border-2 border-slate-800 text-xs font-black uppercase tracking-wider bg-amber-100 text-slate-900">
                FASE D / E • SMP-SMA
              </span>
              <div className="text-[10px] font-bold text-slate-500 mt-1">
                Dokumen Terpadu (Satu Halaman Penuh)
              </div>
            </div>
          </div>

          {/* Identitas Kelompok Box */}
          <div className="rounded-2xl border-2 border-slate-800 p-4 bg-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kolom Kiri: Nama Kelompok, Sektor, Tanggal */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700">
                  Nama Kelompok:
                </label>
                <input
                  type="text"
                  value={activeLKPD.groupName || ''}
                  onChange={(e) => handleFieldChange('groupName', e.target.value)}
                  placeholder=""
                  className="w-full font-bold text-sm bg-white p-2 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700">
                  Sektor Usaha:
                </label>
                <select
                  value={activeLKPD.sektorUsaha}
                  onChange={(e) => {
                    const newSektor = e.target.value;
                    const matched = SEKTOR_OPTIONS.find((s) => s.id === newSektor);
                    const defaultVar = matched ? matched.defaultVarian : '';
                    handleFieldChange('sektorUsaha', newSektor);
                    if (defaultVar) handleFieldChange('varianGambar', defaultVar);
                  }}
                  className="w-full font-bold text-xs bg-slate-900 text-white p-2 rounded-xl border border-slate-800 outline-none"
                >
                  {SEKTOR_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700">
                  Tanggal Asesmen:
                </label>
                <input
                  type="text"
                  value={activeLKPD.tanggalAsesmen || ''}
                  onChange={(e) => handleFieldChange('tanggalAsesmen', e.target.value)}
                  placeholder=""
                  className="w-full text-xs font-semibold bg-white p-2 rounded-xl border border-slate-300 outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Kolom Kanan: Anggota Kelompok (Dibiarkan Kosong Bersih) */}
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-700 mb-1.5">
                Daftar Nama Anggota Kelompok:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-600 w-4">{idx + 1}.</span>
                    <input
                      type="text"
                      value={activeLKPD.members[idx] || ''}
                      onChange={(e) => {
                        const nextMembers = [...activeLKPD.members];
                        nextMembers[idx] = e.target.value;
                        handleFieldChange('members', nextMembers);
                        if (idx === 0) handleFieldChange('ketuaNama', e.target.value);
                      }}
                      placeholder=""
                      className="w-full p-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium outline-none text-slate-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

            {/* Petunjuk Pengerjaan */}
            <div className="p-3.5 rounded-xl border-l-4 border-amber-500 bg-amber-50 text-xs text-amber-900 font-medium">
              <span className="font-bold">📖 Petunjuk Pengerjaan LKPD Kolaborasi:</span> Diskusikan
              bersama kelompokmu untuk menganalisis stimulus gambar, merancang ide produk baru berbasis
              potensi lokal, menghitung biaya modal, dan merumuskan strategi pemasaran di bawah ini.
            </div>

            {/* BAGIAN 1: STIMULUS GAMBAR PRODUK & ANALISIS POTENSI BAHAN LOKAL */}
            <div className="rounded-2xl border-2 border-slate-800 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                    1
                  </span>
                  <h3 className="font-black text-sm md:text-base uppercase tracking-tight text-slate-950">
                    STIMULUS GAMBAR PRODUK & ANALISIS POTENSI BAHAN LOKAL
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Pilih Varian Gambar:</span>
                  <select
                    value={activeLKPD.varianGambar}
                    onChange={(e) => handleFieldChange('varianGambar', e.target.value)}
                    className="text-xs font-bold bg-white p-1.5 rounded-lg border border-slate-400 outline-none"
                  >
                    {activeSektorObj.varians.map((v) => (
                      <option key={v.label} value={v.label}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visual Stimulus & Form Questions */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Gambar Stimulus Banner */}
                <div className="md:col-span-5 rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-900 text-white p-4 flex flex-col justify-between h-full min-h-[200px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-blue-300 font-bold uppercase">
                      <span>{activeSektorObj.icon} {activeLKPD.sektorUsaha}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-900/60 font-mono">Banyumas</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center space-y-1">
                      <div className="text-4xl mb-1">{activeSektorObj.icon}</div>
                      <h4 className="font-black text-sm text-amber-300">{activeLKPD.varianGambar}</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {activeSektorObj.varians.find((v) => v.label === activeLKPD.varianGambar)?.deskripsi ||
                          'Inovasi produk berbasis kekayaan kearifan lokal daerah Kabupaten Banyumas.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-center text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-2">
                    Gambar 1.1: Referensi Sektor {activeLKPD.sektorUsaha.replace(/^\d+\.\s*/, '')}
                  </div>
                </div>

                {/* Question Inputs 1.1 & 1.2 */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      1.1. Latar Belakang Masalah di Lingkungan Sekitar:
                    </label>
                    <textarea
                      rows={3}
                      value={activeLKPD.latarBelakangMasalah || ''}
                      onChange={(e) => handleFieldChange('latarBelakangMasalah', e.target.value)}
                      placeholder=""
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed outline-none focus:border-blue-600 text-slate-900 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-900 mb-1">
                      1.2. Potensi Bahan Baku Lokal & Kearifan Daerah yang Diangkat:
                    </label>
                    <textarea
                      rows={3}
                      value={activeLKPD.potensiBahanBaku || ''}
                      onChange={(e) => handleFieldChange('potensiBahanBaku', e.target.value)}
                      placeholder=""
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed outline-none focus:border-blue-600 text-slate-900 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BAGIAN 2: PERANCANGAN KONSEP BISNIS BARU & TARGET KONSUMEN */}
            <div className="rounded-2xl border-2 border-slate-800 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  2
                </span>
                <h3 className="font-black text-sm md:text-base uppercase tracking-tight text-slate-950">
                  PERANCANGAN KONSEP BISNIS BARU & TARGET KONSUMEN
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">
                    2.1. Nama Merek / Brand Produk Baru:
                  </label>
                  <input
                    type="text"
                    value={activeLKPD.namaMerek || ''}
                    onChange={(e) => handleFieldChange('namaMerek', e.target.value)}
                    placeholder=""
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold outline-none focus:border-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">
                    2.2. Slogan Promosi / Tagline Usaha:
                  </label>
                  <input
                    type="text"
                    value={activeLKPD.sloganPromosi || ''}
                    onChange={(e) => handleFieldChange('sloganPromosi', e.target.value)}
                    placeholder=""
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold outline-none focus:border-blue-600 text-slate-900 italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">
                    2.3. Target Konsumen Utama (Siapa yang membeli?):
                  </label>
                  <textarea
                    rows={2}
                    value={activeLKPD.targetKonsumen || ''}
                    onChange={(e) => handleFieldChange('targetKonsumen', e.target.value)}
                    placeholder=""
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed outline-none focus:border-blue-600 text-slate-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-900 mb-1">
                    2.4. Strategi Pemasaran & Media Promosi:
                  </label>
                  <textarea
                    rows={2}
                    value={activeLKPD.strategiPemasaran || ''}
                    onChange={(e) => handleFieldChange('strategiPemasaran', e.target.value)}
                    placeholder=""
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed outline-none focus:border-blue-600 text-slate-900 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* BAGIAN 3: PERHITUNGAN ANGGARAN MODAL (HPP) & PENETAPAN HARGA JUAL */}
            <div className="rounded-2xl border-2 border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                    3
                  </span>
                  <h3 className="font-black text-sm md:text-base uppercase tracking-tight text-slate-950">
                    PERHITUNGAN ANGGARAN MODAL (HPP) & PENETAPAN HARGA JUAL
                  </h3>
                </div>

                <button
                  onClick={handleAddRowHPP}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris</span>
                </button>
              </div>

              {/* Tabel HPP */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-slate-800 font-black text-slate-800 text-[11px] uppercase">
                      <th className="py-2.5 px-2 w-10">No</th>
                      <th className="py-2.5 px-2">Nama Produk / Varian Kemasan</th>
                      <th className="py-2.5 px-2 w-32">Modal HPP (Rp)</th>
                      <th className="py-2.5 px-2 w-32">Harga Jual (Rp)</th>
                      <th className="py-2.5 px-2 w-28">Laba / Unit</th>
                      <th className="py-2.5 px-2 w-20">Margin</th>
                      <th className="py-2.5 px-2 w-12 text-center">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeLKPD.tabelHpp.map((row, idx) => {
                      const laba = (Number(row.hargaJual) || 0) - (Number(row.modalHpp) || 0);
                      const marginPct =
                        Number(row.hargaJual) > 0 ? Math.round((laba / Number(row.hargaJual)) * 100) : 0;

                      return (
                        <tr key={row.id} className="hover:bg-slate-50">
                          <td className="py-2 px-2 font-mono font-bold text-slate-500">{idx + 1}.</td>
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={row.namaProduk || ''}
                              onChange={(e) => handleUpdateRowHPP(idx, 'namaProduk', e.target.value)}
                              placeholder=""
                              className="w-full p-1.5 rounded-lg border border-slate-300 bg-white font-medium outline-none text-slate-900"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={row.modalHpp === 0 ? '' : row.modalHpp}
                              onChange={(e) =>
                                handleUpdateRowHPP(
                                    idx,
                                  'modalHpp',
                                  e.target.value === '' ? 0 : Number(e.target.value)
                                )
                              }
                              placeholder=""
                              className="w-full p-1.5 rounded-lg border border-slate-300 bg-white font-mono text-right font-bold outline-none text-slate-900"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={row.hargaJual === 0 ? '' : row.hargaJual}
                              onChange={(e) =>
                                handleUpdateRowHPP(
                                  idx,
                                  'hargaJual',
                                  e.target.value === '' ? 0 : Number(e.target.value)
                                )
                              }
                              placeholder=""
                              className="w-full p-1.5 rounded-lg border border-slate-300 bg-white font-mono text-right font-bold outline-none text-slate-900"
                            />
                          </td>
                          <td className="py-2 px-2 font-mono font-bold text-emerald-700 whitespace-nowrap">
                            Rp {laba.toLocaleString('id-ID')}
                          </td>
                          <td className="py-2 px-2 font-mono font-bold text-slate-700 whitespace-nowrap">
                            {marginPct}%
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => handleDeleteRowHPP(idx)}
                              disabled={activeLKPD.tabelHpp.length <= 1}
                              className="p-1 text-rose-500 hover:text-rose-700 disabled:opacity-30"
                              title="Hapus baris"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Ringkasan Perhitungan Modal & Estimasi Laba */}
              <div className="p-3.5 rounded-xl border border-slate-300 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                <div>
                  Total Modal Awal:{' '}
                  <span className="font-mono text-blue-700 text-sm">
                    Rp {totalModalAwal.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  Total Nilai Penjualan:{' '}
                  <span className="font-mono text-slate-900 text-sm">
                    Rp {totalNilaiPenjualan.toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  Estimasi Laba Kotor:{' '}
                  <span className="font-mono text-emerald-700 text-sm">
                    Rp {totalLabaKotor.toLocaleString('id-ID')} ({avgMargin}%)
                  </span>
                </div>
              </div>
            </div>

            {/* BAGIAN 4: REFLEKSI KOLABORASI KELOMPOK & RUBRIK PENILAIAN GURU */}
            <div className="rounded-2xl border-2 border-slate-800 p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-300 pb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                  4
                </span>
                <h3 className="font-black text-sm md:text-base uppercase tracking-tight text-slate-950">
                  REFLEKSI KOLABORASI KELOMPOK & RUBRIK PENILAIAN GURU
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 4.1. Kesimpulan & Refleksi Kelompok */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-900">
                    4.1. Kesimpulan & Refleksi Kelompok:
                  </label>
                  <textarea
                    rows={5}
                    value={activeLKPD.kesimpulanRefleksi || ''}
                    onChange={(e) => handleFieldChange('kesimpulanRefleksi', e.target.value)}
                    placeholder=""
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs leading-relaxed outline-none focus:border-blue-600 text-slate-900 resize-none"
                  />
                </div>

                {/* 4.2. Rubrik Penilaian Guru Pembimbing (Maksimal 100) */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-300">
                  <div className="flex items-center justify-between text-xs font-black text-slate-900 border-b border-slate-200 pb-1.5">
                    <span>4.2. Rubrik Penilaian Guru Pembimbing (Maksimal 100):</span>
                    <span className="font-mono text-blue-700">Skor (0-25)</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">1. Orisinalitas & Inovasi Ide (Maks 25):</span>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={activeLKPD.skorOrisinalitas}
                        onChange={(e) => handleFieldChange('skorOrisinalitas', Number(e.target.value))}
                        className="w-16 p-1 rounded border border-slate-400 bg-white font-mono text-center font-bold"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">2. Pemanfaatan Kearifan Lokal (Maks 25):</span>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={activeLKPD.skorKearifanLokal}
                        onChange={(e) => handleFieldChange('skorKearifanLokal', Number(e.target.value))}
                        className="w-16 p-1 rounded border border-slate-400 bg-white font-mono text-center font-bold"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">3. Kelayakan Rencana Biaya & Laba (Maks 25):</span>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={activeLKPD.skorKelayakanBiaya}
                        onChange={(e) => handleFieldChange('skorKelayakanBiaya', Number(e.target.value))}
                        className="w-16 p-1 rounded border border-slate-400 bg-white font-mono text-center font-bold"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">4. Kolaborasi & Kelengkapan LKPD (Maks 25):</span>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        value={activeLKPD.skorKolaborasi}
                        onChange={(e) => handleFieldChange('skorKolaborasi', Number(e.target.value))}
                        className="w-16 p-1 rounded border border-slate-400 bg-white font-mono text-center font-bold"
                      />
                    </div>
                  </div>

                  {/* Total Nilai LKPD */}
                  <div className="pt-2 border-t border-slate-300 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-slate-900 block">TOTAL NILAI LKPD:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPredikat(totalNilaiLKPD).color}`}>
                        {getPredikat(totalNilaiLKPD).label}
                      </span>
                    </div>
                    <div className="font-mono font-black text-xl text-blue-700">
                      {totalNilaiLKPD} <span className="text-xs font-normal text-slate-500">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BAGIAN TANDA TANGAN & PENGESAHAN */}
            <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
              {/* Ketua Kelompok */}
              <div className="space-y-2">
                <div className="font-bold text-slate-700">Ketua Kelompok Kerja,</div>
                <div
                  onClick={() => setShowSignatureModal('ketua')}
                  className="h-20 max-w-[200px] mx-auto border-b-2 border-dashed border-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition rounded-lg"
                  title="Klik untuk tanda tangan digital di IFP"
                >
                  {activeLKPD.tandaTanganKetua ? (
                    <img
                      src={activeLKPD.tandaTanganKetua}
                      alt="Tanda Tangan Ketua"
                      className="max-h-16 object-contain"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5" /> Sentuh untuk Tanda Tangan
                    </span>
                  )}
                </div>
                <div className="font-black text-slate-900 underline text-sm">
                  {activeLKPD.ketuaNama || activeLKPD.members[0] || '( ........................................ )'}
                </div>
                <div className="text-[10px] text-slate-500">Ketua Kelompok Siswa</div>
              </div>

              {/* Guru Pembimbing */}
              <div className="space-y-2">
                <div className="font-bold text-slate-700">Guru Pembimbing Kewirausahaan,</div>
                <div
                  onClick={() => setShowSignatureModal('guru')}
                  className="h-20 max-w-[200px] mx-auto border-b-2 border-dashed border-slate-400 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition rounded-lg"
                  title="Klik untuk tanda tangan digital Guru"
                >
                  {activeLKPD.tandaTanganGuru ? (
                    <img
                      src={activeLKPD.tandaTanganGuru}
                      alt="Tanda Tangan Guru"
                      className="max-h-16 object-contain"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5" /> (Tanda Tangan & Cap Guru)
                    </span>
                  )}
                </div>
                <div className="font-black text-slate-900 underline text-sm">
                  {activeLKPD.guruNama}
                </div>
                <div className="text-[10px] text-slate-500">NIP. Guru Pengampu PKWU</div>
              </div>
            </div>

            {/* Footer Dokumen Resmi */}
            <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200">
              Dokumen resmi Lembar Kerja Peserta Didik (LKPD) Kewirausahaan • Cikal Wirausahawan Muda • SMP Negeri 2 Kemranjen
            </div>
          </div>
        </div>

      {/* MODAL TANDA TANGAN DIGITAL SENTUH PADA IFP */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {showSignatureModal === 'ketua'
                    ? 'Tanda Tangan Ketua Kelompok'
                    : 'Tanda Tangan & Pengesahan Guru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Goreskan tanda tangan langsung dengan jari atau pena stylus IFP
                </p>
              </div>

              {/* Color Selector */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSignatureCanvasColor('#1e3a8a')}
                  className={`w-6 h-6 rounded-full bg-blue-900 border-2 ${signatureCanvasColor === '#1e3a8a' ? 'ring-2 ring-blue-500' : ''}`}
                />
                <button
                  onClick={() => setSignatureCanvasColor('#0f172a')}
                  className={`w-6 h-6 rounded-full bg-slate-900 border-2 ${signatureCanvasColor === '#0f172a' ? 'ring-2 ring-blue-500' : ''}`}
                />
              </div>
            </div>

            {/* Signature Canvas Box */}
            <div className="border-2 border-slate-800 rounded-2xl overflow-hidden bg-white shadow-inner">
              <canvas
                ref={sigCanvasRef}
                width={380}
                height={180}
                onPointerDown={handleStartSig}
                onPointerMove={handleMoveSig}
                onPointerUp={handleEndSig}
                onPointerCancel={handleEndSig}
                className="w-full h-44 block touch-none cursor-crosshair bg-white"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={handleClearSig}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold border border-rose-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hapus Goresan</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSignatureModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveSig}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Tanda Tangan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
