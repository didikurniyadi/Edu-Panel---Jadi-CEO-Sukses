import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ASSESSMENT_QUESTIONS,
  SCALE_OPTIONS,
  CATEGORY_DEFINITIONS,
  getCategoryFromScore,
  calculateDimensions,
} from '../data/assessmentData';
import { StudentSubmission, Gender, CategoryLevel } from '../types';
import {
  CheckCircle2,
  Send,
  HelpCircle,
  Sparkles,
  BookCheck,
  User,
  GraduationCap,
  RotateCcw,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface AsesmenFormProps {
  onSubmit: (submission: StudentSubmission) => void;
  defaultGender?: Gender;
  defaultName?: string;
}

export const AsesmenForm: React.FC<AsesmenFormProps> = ({
  onSubmit,
  defaultGender = 'Laki-laki',
  defaultName = '',
}) => {
  // Identity fields
  const [nama, setNama] = useState<string>(defaultName);
  const [nis, setNis] = useState<string>('');
  const [gender, setGender] = useState<Gender>(defaultGender);
  const [sekolah, setSekolah] = useState<string>('');
  const [kelas, setKelas] = useState<string>('');

  // Answers state for questions 1 to 10
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [refleksi, setRefleksi] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<StudentSubmission | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Live Score Calculator
  const currentTotalScore = Object.values(answers).reduce((sum, v) => sum + v, 0);
  const answeredCount = Object.keys(answers).length;
  const currentCategory = answeredCount > 0 ? getCategoryFromScore(currentTotalScore) : null;

  const handleSelectAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      setValidationError('Mohon lengkapi Nama Lengkap Anda.');
      return;
    }

    if (answeredCount < 10) {
      setValidationError(
        `Mohon jawab seluruh 10 pernyataan (Baru dijawab: ${answeredCount} dari 10).`
      );
      return;
    }

    const total = currentTotalScore;
    const kategori = getCategoryFromScore(total);
    const submission: StudentSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      nama: nama.trim(),
      nis: nis.trim() || `NIS-${Math.floor(1000 + Math.random() * 9000)}`,
      gender,
      sekolah: sekolah.trim() || 'SMP Negeri Banyumas',
      kelas: kelas.trim() || 'Kelas IX',
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      answers,
      totalScore: total,
      kategori,
      refleksi: refleksi.trim() || 'Belum mengisi refleksi tambahan.',
    };

    setSubmittedData(submission);
    onSubmit(submission);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // confetti fallback
    }
  };

  const handleReset = () => {
    setSubmittedData(null);
    setAnswers({});
    setRefleksi('');
    setValidationError(null);
  };

  if (submittedData) {
    const categoryInfo = CATEGORY_DEFINITIONS[submittedData.kategori];
    const dimensions = calculateDimensions(submittedData.answers);

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 animate-in fade-in duration-300">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              Asesmen Awal Berhasil Dikirim & Terhubung ke Layar IFP
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
              Hasil Analisis Minat Berwirausaha
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {submittedData.nama} ({submittedData.gender}) • {submittedData.kelas} • {submittedData.sekolah}
            </p>
          </div>

          {/* Score & Category Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-900 text-center">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Total Skor Minat Wirausaha
            </div>
            <div className="text-5xl md:text-6xl font-black text-blue-700 dark:text-blue-400 my-2 font-mono">
              {submittedData.totalScore}{' '}
              <span className="text-2xl font-normal text-slate-400">/ 50</span>
            </div>
            <div className="inline-block mt-1">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-extrabold border ${categoryInfo.badgeColor}`}
              >
                Kategori: {submittedData.kategori}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>

          {/* Dimensions Breakdown */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Profil 6 Dimensi Perilaku Kewirausahaan</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dimensions.map((dim, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-200">{dim.name}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {dim.score} / {dim.maxScore} ({dim.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${dim.percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {dim.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Reflection */}
          {submittedData.refleksi && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Refleksi Diri / Catatan Siswa:
              </span>
              <p className="text-sm italic text-slate-700 dark:text-slate-300">
                "{submittedData.refleksi}"
              </p>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Isi Asesmen untuk Siswa Lain</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header Info */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
          <BookCheck className="w-4 h-4" />
          <span>MGBK Kabupaten Banyumas — Modul AKSES Halaman 14–16</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black">
          Instrumen Skala Minat Berwirausaha
        </h1>
        <p className="mt-2 text-sm md:text-base text-blue-100 max-w-2xl">
          Jawablah setiap pernyataan di bawah ini berdasarkan seberapa sering pernyataan tersebut
          mencerminkan sikap atau pendapat kamu dengan jujur dan apa adanya.
        </p>

        {/* Live Score Tracker Pill */}
        <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-white/20">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-xs font-semibold">
            Progress: <span className="font-mono font-bold">{answeredCount} / 10</span> Terjawab
          </div>
          {answeredCount > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm text-xs font-semibold">
              Skor Sementara: <span className="font-mono font-bold">{currentTotalScore} / 50</span>
              {currentCategory && (
                <span className="ml-1.5 font-bold underline">({currentCategory})</span>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Identitas Peserta Didik</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Nomor Induk Siswa (NIS/NISN)
              </label>
              <input
                type="text"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Jenis Kelamin (Gender) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('Laki-laki')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    gender === 'Laki-laki'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  👦 Laki-laki
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Perempuan')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                    gender === 'Perempuan'
                      ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                      : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  👧 Perempuan
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Nama Sekolah
              </label>
              <input
                type="text"
                value={sekolah}
                onChange={(e) => setSekolah(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Kelas / Tingkat
              </label>
              <input
                type="text"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                placeholder=""
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none font-normal"
              />
            </div>
          </div>
        </div>

        {/* 10 Assessment Statements from PDF */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span>10 Pernyataan Skala Minat Berwirausaha</span>
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              Skala 1 (Sangat Jarang) sampai 5 (Sangat Sering)
            </span>
          </div>

          {ASSESSMENT_QUESTIONS.map((q) => {
            const currentVal = answers[q.id];

            return (
              <div
                key={q.id}
                className={`rounded-2xl p-5 border transition-all ${
                  currentVal
                    ? 'bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900/60 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {q.id}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-semibold text-slate-800 dark:text-slate-200">
                      {q.text}
                    </p>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Dimensi: {q.dimension}
                    </span>

                    {/* Scale Radio Buttons (1 to 5) */}
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mt-3.5">
                      {SCALE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectAnswer(q.id, opt.value)}
                          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition ${
                            currentVal === opt.value
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300 dark:ring-blue-800'
                              : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-black">{opt.value}</span>
                          <span className="text-[10px] sm:text-xs font-medium truncate max-w-full">
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Refleksi Diri (sesuai Halaman 16 Modul AKSES) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Refleksi & Introspeksi Diri (Bagian B Modul)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            "Setelah mengetahui interpretasi skor, lakukan introspeksi diri. Tanyakan apakah kamu
            benar-benar berminat berwirausaha dan renungkan makna skor yang diperoleh. Tuliskan apa
            ide atau hal yang ada dalam benakmu."
          </p>
          <textarea
            rows={3}
            value={refleksi}
            onChange={(e) => setRefleksi(e.target.value)}
            placeholder=""
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-normal"
          />
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm font-semibold animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition transform active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span>Kirim & Analisis Hasil Asesmen</span>
          </button>
        </div>
      </form>
    </div>
  );
};
