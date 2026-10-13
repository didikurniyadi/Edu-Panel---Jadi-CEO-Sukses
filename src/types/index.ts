export type Gender = 'Laki-laki' | 'Perempuan';

export type CategoryLevel = 'Tinggi' | 'Sedang' | 'Rendah' | 'Sangat Rendah';

export interface StudentSubmission {
  id: string;
  nama: string;
  nis: string;
  gender: Gender;
  sekolah: string;
  kelas: string;
  waktu: string;
  answers: Record<number, number>; // 1-10 -> 1-5
  totalScore: number;
  kategori: CategoryLevel;
  refleksi: string;
}

export interface GroupMemberRole {
  roleName: string;
  description: string;
}

export interface GroupResult {
  id: string;
  name: string;
  gender: Gender;
  avgScore: number;
  members: StudentSubmission[];
}

export interface DimensionScore {
  name: string;
  shortName: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
  questionIndices: number[];
}

export interface StrokeData {
  id: string;
  tool: 'pen' | 'highlighter' | 'eraser';
  color: string;
  width: number;
  points: number[];
  author?: string;
  timestamp: number;
}

export interface LKPDItemHPP {
  id: string;
  namaProduk: string;
  modalHpp: number;
  hargaJual: number;
}

export interface LKPDData {
  groupId: string;
  groupName: string;
  sektorUsaha: string;
  tanggalAsesmen: string;
  members: string[];
  ketuaNama: string;
  guruNama: string;
  guruNip: string;
  varianGambar: string;
  latarBelakangMasalah: string;
  potensiBahanBaku: string;
  namaMerek: string;
  sloganPromosi: string;
  targetKonsumen: string;
  strategiPemasaran: string;
  tabelHpp: LKPDItemHPP[];
  kesimpulanRefleksi: string;
  skorOrisinalitas: number; // 0-25
  skorKearifanLokal: number; // 0-25
  skorKelayakanBiaya: number; // 0-25
  skorKolaborasi: number; // 0-25
  tandaTanganKetua?: string;
  tandaTanganGuru?: string;
  updatedAt: number;
}

export interface SlideContent {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  points: {
    title: string;
    description: string;
    icon?: string;
    highlight?: string;
  }[];
  caseStudy?: {
    character: string;
    title: string;
    narrative: string;
    keyTakeaway: string;
  };
  keyTakeaway: string;
}
