import { StudentSubmission, CategoryLevel, DimensionScore } from '../types';

export interface AssessmentQuestionDef {
  id: number;
  text: string;
  dimension: string;
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestionDef[] = [
  {
    id: 1,
    text: 'Saya tertarik mempelajari bagaimana memulai dan mengembangkan bisnis',
    dimension: 'Minat Berwirausaha',
  },
  {
    id: 2,
    text: 'Saya ingin menciptakan sesuatu yang bermanfaat untuk orang lain melalui bisnis.',
    dimension: 'Orientasi Manfaat & Nilai',
  },
  {
    id: 3,
    text: 'Saya merasa senang ketika diberi tanggung jawab untuk mengelola proyek atau mengambil keputusan dalam suatu grup.',
    dimension: 'Kepemimpinan & Tanggung Jawab',
  },
  {
    id: 4,
    text: 'Saya sering merenungkan ide-ide kreatif tentang bisnis atau produk baru.',
    dimension: 'Kreativitas & Inovasi',
  },
  {
    id: 5,
    text: 'Saya cenderung lebih suka mengambil risiko dalam situasi yang tidak pasti.',
    dimension: 'Pengambilan Risiko',
  },
  {
    id: 6,
    text: 'Saya merasa tidak puas dengan pekerjaan atau aktivitas rutin yang monoton dan ingin mencari tantangan baru.',
    dimension: 'Tantangan & Inisiatif',
  },
  {
    id: 7,
    text: 'Saya senang belajar dari kesalahan dan melakukan perbaikan pada bisnis atau produk yang sudah ada.',
    dimension: 'Resiliensi & Perbaikan Diri',
  },
  {
    id: 8,
    text: 'Saya memiliki kemampuan untuk memotivasi diri sendiri dan bekerja secara mandiri.',
    dimension: 'Kemandirian & Motivasi',
  },
  {
    id: 9,
    text: 'Saya sering memperhatikan peluang pasar dan potensi bisnis di sekitar saya.',
    dimension: 'Kepekaan Peluang Pasar',
  },
  {
    id: 10,
    text: 'Saya tertarik untuk belajar tentang manajemen bisnis, pemasaran, dan keuangan.',
    dimension: 'Minat Belajar Manajemen Usaha',
  },
];

export const SCALE_OPTIONS = [
  { value: 1, label: 'Sangat Jarang', description: 'Skor 1' },
  { value: 2, label: 'Jarang', description: 'Skor 2' },
  { value: 3, label: 'Kadang-kadang', description: 'Skor 3' },
  { value: 4, label: 'Sering', description: 'Skor 4' },
  { value: 5, label: 'Sangat Sering', description: 'Skor 5' },
];

export interface CategoryInfo {
  category: CategoryLevel;
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORY_DEFINITIONS: Record<CategoryLevel, CategoryInfo> = {
  Tinggi: {
    category: 'Tinggi',
    minScore: 46,
    maxScore: 50,
    label: 'Skor 46–50: Tinggi',
    description:
      'Minat berwirausaha sangat tinggi, menunjukkan ketertarikan kuat terhadap kegiatan usaha mandiri, senang berinisiatif, menyukai tantangan, dan siap menghadapi risiko wirausaha.',
    badgeColor: 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500',
  },
  Sedang: {
    category: 'Sedang',
    minScore: 36,
    maxScore: 45,
    label: 'Skor 36–45: Sedang',
    description:
      'Memiliki ketertarikan, tetapi masih mempertimbangkan sebelum terjun. Memiliki potensi wirausahawan, namun mungkin perlu dorongan, pengetahuan tambahan, atau pengalaman untuk meningkatkan keyakinan.',
    badgeColor: 'text-blue-700 bg-blue-100 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
  },
  Rendah: {
    category: 'Rendah',
    minScore: 26,
    maxScore: 35,
    label: 'Skor 26–35: Rendah',
    description:
      'Minat tergolong rendah, mungkin belum yakin atau lebih menyukai stabilitas pekerjaan sebagai karyawan. Pengembangan wawasan, pelatihan, atau pengalaman langsung dapat membantu meningkatkan minat.',
    badgeColor: 'text-amber-700 bg-amber-100 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500',
  },
  'Sangat Rendah': {
    category: 'Sangat Rendah',
    minScore: 16,
    maxScore: 25,
    label: 'Skor 16–25: Sangat Rendah',
    description:
      'Kurang memiliki ketertarikan atau dorongan untuk terlibat dalam wirausaha, mungkin karena kurangnya pengetahuan atau kepercayaan diri. Pengenalan terhadap manfaat dan peluang wirausaha bisa menjadi langkah awal.',
    badgeColor: 'text-rose-700 bg-rose-100 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-500',
  },
};

export function getCategoryFromScore(score: number): CategoryLevel {
  if (score >= 46) return 'Tinggi';
  if (score >= 36) return 'Sedang';
  if (score >= 26) return 'Rendah';
  return 'Sangat Rendah';
}

export function calculateDimensions(answers: Record<number, number>): DimensionScore[] {
  const dims = [
    {
      name: 'Minat & Manajemen Bisnis',
      shortName: 'Minat & Belajar',
      questionIndices: [1, 10],
      description: 'Ketertarikan mempelajari langkah usaha serta manajemen pemasaran dan keuangan.',
    },
    {
      name: 'Nilai Manfaat & Kepemimpinan',
      shortName: 'Kepemimpinan',
      questionIndices: [2, 3],
      description: 'Keinginan memberi dampak bagi orang lain dan kesiapan mengelola tim.',
    },
    {
      name: 'Kreativitas & Eksplorasi',
      shortName: 'Kreativitas',
      questionIndices: [4, 6],
      description: 'Menemukan ide inovatif dan mencari tantangan baru di luar rutinitas.',
    },
    {
      name: 'Keberanian Mengambil Risiko',
      shortName: 'Pengambilan Risiko',
      questionIndices: [5],
      description: 'Kenyamanan menghadapi ketidakpastian dan mencoba hal baru.',
    },
    {
      name: 'Resiliensi & Kemandirian',
      shortName: 'Kemandirian',
      questionIndices: [7, 8],
      description: 'Belajar dari kegagalan dan kemampuan memotivasi diri secara mandiri.',
    },
    {
      name: 'Kepekaan Peluang Pasar',
      shortName: 'Peluang Pasar',
      questionIndices: [9],
      description: 'Kemampuan mengidentifikasi kebutuhan konsumen di lingkungan sekitar.',
    },
  ];

  return dims.map(d => {
    const rawScore = d.questionIndices.reduce((sum, idx) => sum + (answers[idx] || 0), 0);
    const max = d.questionIndices.length * 5;
    const percentage = Math.round((rawScore / max) * 100);
    return {
      name: d.name,
      shortName: d.shortName,
      score: rawScore,
      maxScore: max,
      percentage,
      description: d.description,
      questionIndices: d.questionIndices,
    };
  });
}

// 24 realistic sample students (12 Laki-laki, 12 Perempuan) with realistic distributions
export const SAMPLE_STUDENTS: StudentSubmission[] = [
  // LAKI-LAKI (12)
  {
    id: 'sample-m-1',
    nama: 'Bagus Pratama Putra',
    nis: '230101',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:15 WIB',
    answers: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5 },
    totalScore: 49,
    kategori: 'Tinggi',
    refleksi: 'Saya sangat ingin membuat brand jajanan keripik tempe Banyumas kemasan modern bersama teman-teman.',
  },
  {
    id: 'sample-m-2',
    nama: 'Dimas Aditya Nugraha',
    nis: '230102',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:16 WIB',
    answers: { 1: 5, 2: 5, 3: 4, 4: 5, 5: 5, 6: 4, 7: 5, 8: 5, 9: 4, 10: 5 },
    totalScore: 47,
    kategori: 'Tinggi',
    refleksi: 'Terinspirasi kisah Ferry Unardi pendiri Traveloka yang mulai bisnis sejak usia sekolah.',
  },
  {
    id: 'sample-m-3',
    nama: 'Rizky Fauzan Alamsyah',
    nis: '230103',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:17 WIB',
    answers: { 1: 4, 2: 5, 3: 4, 4: 4, 5: 4, 6: 4, 7: 5, 8: 4, 9: 4, 10: 4 },
    totalScore: 42,
    kategori: 'Sedang',
    refleksi: 'Tertarik mencoba bisnis jasa fotografi acara ulang tahun dan desain kaos sekolah.',
  },
  {
    id: 'sample-m-4',
    nama: 'Fajar Eka Saputra',
    nis: '230104',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:18 WIB',
    answers: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4 },
    totalScore: 39,
    kategori: 'Sedang',
    refleksi: 'Saya ingin belajar cara promosi online lewat media sosial seperti yang dilakukan Mia.',
  },
  {
    id: 'sample-m-5',
    nama: 'Galih Wicaksono',
    nis: '230105',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:19 WIB',
    answers: { 1: 4, 2: 4, 3: 3, 4: 4, 5: 3, 6: 4, 7: 4, 8: 4, 9: 3, 10: 4 },
    totalScore: 37,
    kategori: 'Sedang',
    refleksi: 'Punya ide jualan minuman segar saat istirahat, tapi masih bingung mengatur modalnya.',
  },
  {
    id: 'sample-m-6',
    nama: 'Irfan Maulana Hakim',
    nis: '230106',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:20 WIB',
    answers: { 1: 4, 2: 4, 3: 3, 4: 3, 5: 3, 6: 4, 7: 4, 8: 4, 9: 4, 10: 3 },
    totalScore: 36,
    kategori: 'Sedang',
    refleksi: 'Perlu banyak belajar cara mengatasi risiko gagal saat jualan pertama kali.',
  },
  {
    id: 'sample-m-7',
    nama: 'Hendra Setiawan',
    nis: '230107',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:21 WIB',
    answers: { 1: 3, 2: 4, 3: 3, 4: 3, 5: 3, 6: 3, 7: 4, 8: 3, 9: 3, 10: 3 },
    totalScore: 32,
    kategori: 'Rendah',
    refleksi: 'Masih merasa lebih nyaman jika ada pembagian tugas yang jelas dari guru atau teman.',
  },
  {
    id: 'sample-m-8',
    nama: 'Bayu Arya Pamungkas',
    nis: '230108',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:22 WIB',
    answers: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 },
    totalScore: 29,
    kategori: 'Rendah',
    refleksi: 'Belum yakin bisa membagi waktu antara tugas sekolah dan berwirausaha.',
  },
  {
    id: 'sample-m-9',
    nama: 'Teguh Prasetyo',
    nis: '230109',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:23 WIB',
    answers: { 1: 3, 2: 3, 3: 3, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 3, 10: 2 },
    totalScore: 27,
    kategori: 'Rendah',
    refleksi: 'Saya ingin ikut kelompok agar bisa mengamati dan belajar langsung dari teman yang sudah aktif.',
  },
  {
    id: 'sample-m-10',
    nama: 'Danu Kusuma Wardana',
    nis: '230110',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:24 WIB',
    answers: { 1: 3, 2: 3, 3: 2, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 2, 10: 3 },
    totalScore: 26,
    kategori: 'Rendah',
    refleksi: 'Lebih suka membantu di bagian produksi barang daripada menawarkan langsung ke pembeli.',
  },
  {
    id: 'sample-m-11',
    nama: 'Randi Ardiansyah',
    nis: '230111',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:25 WIB',
    answers: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 2, 10: 2 },
    totalScore: 22,
    kategori: 'Sangat Rendah',
    refleksi: 'Takut rugi dan belum pernah punya pengalaman jualan sama sekali sebelumnya.',
  },
  {
    id: 'sample-m-12',
    nama: 'Satria Budi Utomo',
    nis: '230112',
    gender: 'Laki-laki',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:26 WIB',
    answers: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1, 6: 2, 7: 2, 8: 3, 9: 2, 10: 2 },
    totalScore: 20,
    kategori: 'Sangat Rendah',
    refleksi: 'Ingin mencoba kegiatan Play Therapy Pasar Kreatif agar lebih paham bagaimana cara kerjanya.',
  },

  // PEREMPUAN (12)
  {
    id: 'sample-f-1',
    nama: 'Anindya Kirana Putri',
    nis: '230113',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:15 WIB',
    answers: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5 },
    totalScore: 49,
    kategori: 'Tinggi',
    refleksi: 'Suka membuat kerajinan tangan dari bahan daur ulang dan ingin memasarkannya secara online lewat marketplace.',
  },
  {
    id: 'sample-f-2',
    nama: 'Nabila Zahra Rahmadani',
    nis: '230114',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:16 WIB',
    answers: { 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 4, 7: 5, 8: 5, 9: 4, 10: 5 },
    totalScore: 47,
    kategori: 'Tinggi',
    refleksi: 'Siap memimpin tim dalam simulasi Pasar Kreatif Sekolah dan merancang konsep branding produk.',
  },
  {
    id: 'sample-f-3',
    nama: 'Aisyah Putri Cahyani',
    nis: '230115',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:17 WIB',
    answers: { 1: 4, 2: 5, 3: 4, 4: 5, 5: 4, 6: 4, 7: 5, 8: 4, 9: 4, 10: 4 },
    totalScore: 43,
    kategori: 'Sedang',
    refleksi: 'Tertarik membuat usaha roti sehat rendah kalori seperti inovasi kisah Andi di modul.',
  },
  {
    id: 'sample-f-4',
    nama: 'Tiara Ayu Lestari',
    nis: '230116',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:18 WIB',
    answers: { 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4 },
    totalScore: 39,
    kategori: 'Sedang',
    refleksi: 'Suka memasak kue basah dan puding buah segar untuk dijual di koperasi atau bazar sekolah.',
  },
  {
    id: 'sample-f-5',
    nama: 'Dewi Sekar Arum',
    nis: '230117',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:19 WIB',
    answers: { 1: 4, 2: 4, 3: 3, 4: 4, 5: 3, 6: 4, 7: 4, 8: 4, 9: 4, 10: 3 },
    totalScore: 37,
    kategori: 'Sedang',
    refleksi: 'Perlu latihan lebih banyak dalam presentasi dan menawarkan barang ke calon pelanggan.',
  },
  {
    id: 'sample-f-6',
    nama: 'Salma Hanifa Khairunnisa',
    nis: '230118',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:20 WIB',
    answers: { 1: 4, 2: 4, 3: 3, 4: 3, 5: 3, 6: 4, 7: 4, 8: 4, 9: 3, 10: 4 },
    totalScore: 36,
    kategori: 'Sedang',
    refleksi: 'Senang bekerjasama dalam tim kolaboratif agar pekerjaan terasa lebih ringan dan menyenangkan.',
  },
  {
    id: 'sample-f-7',
    nama: 'Rania Safira Maulida',
    nis: '230119',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:21 WIB',
    answers: { 1: 3, 2: 4, 3: 3, 4: 3, 5: 3, 6: 3, 7: 4, 8: 3, 9: 3, 10: 3 },
    totalScore: 32,
    kategori: 'Rendah',
    refleksi: 'Belum yakin bagaimana memulai bisnis tanpa modal yang besar.',
  },
  {
    id: 'sample-f-8',
    nama: 'Nabila Syifa Az-Zahra',
    nis: '230120',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:22 WIB',
    answers: { 1: 3, 2: 3, 3: 3, 4: 3, 5: 2, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 },
    totalScore: 29,
    kategori: 'Rendah',
    refleksi: 'Lebih tertarik membantu mencatat pembukuan keuangan dan rekapitulasi data penjualan.',
  },
  {
    id: 'sample-f-9',
    nama: 'Siti Nur Azizah',
    nis: '230121',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:23 WIB',
    answers: { 1: 3, 2: 3, 3: 3, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 3, 10: 2 },
    totalScore: 27,
    kategori: 'Rendah',
    refleksi: 'Merasa masih pemalu jika harus mempromosikan barang langsung kepada pembeli.',
  },
  {
    id: 'sample-f-10',
    nama: 'Larasati Dwi Permata',
    nis: '230122',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:24 WIB',
    answers: { 1: 3, 2: 3, 3: 2, 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 2, 10: 3 },
    totalScore: 26,
    kategori: 'Rendah',
    refleksi: 'Ingin belajar bagaimana mengatasi rasa minder saat berbicara di depan orang banyak.',
  },
  {
    id: 'sample-f-11',
    nama: 'Indah Kusuma Ningrum',
    nis: '230123',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:25 WIB',
    answers: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 2, 10: 2 },
    totalScore: 22,
    kategori: 'Sangat Rendah',
    refleksi: 'Belum pernah terpikir untuk menjadi wirausaha, saat ini lebih memikirkan profesi formal.',
  },
  {
    id: 'sample-f-12',
    nama: 'Meisya Tri Hapsari',
    nis: '230124',
    gender: 'Perempuan',
    sekolah: 'SMP Negeri Banyumas',
    kelas: 'Kelas IX A',
    waktu: '10:26 WIB',
    answers: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1, 6: 2, 7: 2, 8: 3, 9: 2, 10: 2 },
    totalScore: 20,
    kategori: 'Sangat Rendah',
    refleksi: 'Penasaran dengan materi kewirausahaan ini dan ingin tahu bagaimana memulai langkah pertama.',
  },
];
