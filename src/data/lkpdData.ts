import { LKPDData } from '../types';

export interface SektorOption {
  id: string;
  label: string;
  icon: string;
  defaultVarian: string;
  varians: {
    label: string;
    deskripsi: string;
    stimulusImage: string;
    contohMasalah: string;
    contohPotensi: string;
    contohMerek: string;
    contohTagline: string;
    contohTarget: string;
    contohStrategi: string;
    contohHpp: { nama: string; modal: number; harga: number }[];
  }[];
}

export const SEKTOR_OPTIONS: SektorOption[] = [
  {
    id: '1. USAHA KULINER LOKAL',
    label: '1. USAHA KULINER LOKAL',
    icon: '🍲',
    defaultVarian: 'Camilan Rempah & Olahan Pangan Lokal',
    varians: [
      {
        label: 'Camilan Rempah & Olahan Pangan Lokal',
        deskripsi: 'Inovasi makanan ringan berbahan baku singkong, tempe kedelai lokal, atau rempah khas Banyumas dengan kemasan kedap udara higienis.',
        stimulusImage: 'kuliner',
        contohMasalah: 'Banyak bahan singkong dan rempah melimpah di petani desa tetapi hanya dijual mentah dengan harga murah tanpa nilai tambah.',
        contohPotensi: 'Rempah kapulaga, jahe, dan singkong Banyumas sangat harum, mudah didapat, dan bergizi tinggi.',
        contohMerek: 'Keripik Tempe Rempah "Mbahe"',
        contohTagline: 'Kriuk Gurih Alami, Warisan Rasa Banyumas',
        contohTarget: 'Remaja sekolah, guru, keluarga, dan wisatawan pusat oleh-oleh.',
        contohStrategi: 'Penjualan stan kantin sekolah, pre-order WhatsApp grup kelas, dan promosi video TikTok/Instagram.',
        contohHpp: [
          { nama: 'Kemasan Pouch 150gr', modal: 8000, harga: 13000 },
          { nama: 'Kemasan Box Gift 300gr', modal: 16000, harga: 25000 },
        ],
      },
      {
        label: 'Minuman Herbal Kekinian (Empon-Empon Soda Fresh)',
        deskripsi: 'Minuman jahe, kunyit asam, dan lemon segar dikemas dalam botol estetik disukai remaja.',
        stimulusImage: 'kuliner',
        contohMasalah: 'Anak muda kurang suka jamu tradisional karena rasa pahit dan kemasan kuno, padahal sangat menyehatkan tubuh.',
        contohPotensi: 'Kunyit dan jahe emprit lokal dari pekarangan warga, madu hutan lereng Slamet, air kelapa segar.',
        contohMerek: 'HerbaGlow Fresh Drinks',
        contohTagline: 'Segar Alami, Sehat Setiap Hari',
        contohTarget: 'Siswa SMP-SMA saat jam olahraga, bapak/ibu guru, pengunjung bazar.',
        contohStrategi: 'Stand booth minuman dingin saat festival sekolah, sistem langganan mingguan guru.',
        contohHpp: [
          { nama: 'Botol 250ml Varian Kunyit Lemon', modal: 4500, harga: 8000 },
          { nama: 'Botol 250ml Varian Jahe Madu', modal: 5000, harga: 9000 },
        ],
      },
    ],
  },
  {
    id: '2. USAHA FASHION & WASTRA LOKAL',
    label: '2. USAHA FASHION & WASTRA LOKAL',
    icon: '🧵',
    defaultVarian: 'Totebag Ecoprint Daun Jati & Kanvas Estetik',
    varians: [
      {
        label: 'Totebag Ecoprint Daun Jati & Kanvas Estetik',
        deskripsi: 'Tas jinjing ramah lingkungan dengan teknik cetak alami daun jati, daun jarak, dan pewarna kayu secang.',
        stimulusImage: 'fashion',
        contohMasalah: 'Penggunaan kantong plastik sekali pakai masih tinggi di sekolah, dan motif tas pasaran terasa membosankan serta tidak ramah lingkungan.',
        contohPotensi: 'Daun jati muda melimpah di kebun Kemranjen, kain kanvas blacu alami mudah menyerap warna alami tanpa zat kimia beracun.',
        contohMerek: 'EcoVibes Banyumasan',
        contohTagline: 'Gaya Kekinian, Bersahabat dengan Alam',
        contohTarget: 'Pelajar yang butuh tas les/buku, mahasiswi, dan guru pencinta kerajinan etnik.',
        contohStrategi: 'Katalog online Instagram reels, pameran karya seni sekolah, dan diskon untuk pembelian paket 2 tas.',
        contohHpp: [
          { nama: 'Totebag Kanvas Ukuran 30x40cm', modal: 18000, harga: 32000 },
          { nama: 'Pouch Serbaguna Ukuran 15x20cm', modal: 9000, harga: 16000 },
        ],
      },
      {
        label: 'Kaos Sablon Motif Aksara & Budaya Banyumasan',
        deskripsi: 'Kaos katun adem bertema budaya lokal Banyumas dan dialek ngapak gaul berdesain tipografi modern.',
        stimulusImage: 'fashion',
        contohMasalah: 'Merchandise kaos khas Banyumas umumnya berdesain kaku dan kurang diminati anak muda masa kini.',
        contohPotensi: 'Budaya tutur ngapak yang unik, kain katun combed lokal, sablon ramah lingkungan.',
        contohMerek: 'NgapakThreads Clothing',
        contohTagline: 'Ora Ngapak Ora Kepenak, Bangga Budaya Dewek',
        contohTarget: 'Pelajar, komunitas sepeda, pemuda karang taruna, perantau Banyumas.',
        contohStrategi: 'Pre-order sebelum event classmeeting, endorsement ketua OSIS, penjualan marketplace.',
        contohHpp: [
          { nama: 'Kaos Katun Sablon DTF Size S-L', modal: 42000, harga: 65000 },
          { nama: 'Kaos Katun Sablon Size XL-XXL', modal: 46000, harga: 72000 },
        ],
      },
    ],
  },
  {
    id: '3. KERAJINAN TANGAN (KRIYA LOKAL)',
    label: '3. KERAJINAN TANGAN (KRIYA LOKAL)',
    icon: '🪵',
    defaultVarian: 'Organizer Meja Belajar Anyaman Bambu & Serat Alam',
    varians: [
      {
        label: 'Organizer Meja Belajar Anyaman Bambu & Serat Alam',
        deskripsi: 'Wadah alat tulis, binder organizer, dan tempat smartphone dari anyaman bambu apus dan serat pelepah pisang.',
        stimulusImage: 'kriya',
        contohMasalah: 'Meja belajar siswa sering berantakan dan tempat pensil plastik impor cepat pecah serta mencemari lingkungan.',
        contohPotensi: 'Bambu apus dan serat pohon pisang kering sangat melimpah di Kemranjen Banyumas, kuat, ulet, dan bernuansa estetik alami.',
        contohMerek: 'BambuCraft Nusantara',
        contohTagline: 'Meja Rapi, Belajar Makin Berprestasi',
        contohTarget: 'Siswa, ruang perpustakaan sekolah, meja guru, dan pekerja kantor.',
        contohStrategi: 'Display di bazar sekolah, paket bundling hadiah ulang tahun teman sekelas, kemasan kardus daur ulang estetik.',
        contohHpp: [
          { nama: 'Desk Organizer 3 Sekat Anyaman Bambu', modal: 14000, harga: 24000 },
          { nama: 'Holder Smartphone & Pen Holder Meja', modal: 7000, harga: 13000 },
        ],
      },
      {
        label: 'Lampu Meja Hias Tabung Bambu Ukir Kaligrafi / Siluet',
        deskripsi: 'Lampu tidur dan lampu belajar dari tabung bambu wulung dengan ukiran siluet alam yang menawan.',
        stimulusImage: 'kriya',
        contohMasalah: 'Potongan bambu sisa bangunan rumah warga seringkali hanya dibakar menjadi abu dan limbah asap.',
        contohPotensi: 'Bambu wulung hitam khas lereng desa, memiliki pola serat kayu yang eksotis dan tahan rayap jika difinishing pernis.',
        contohMerek: 'Lentera Bambu Kemranjen',
        contohTagline: 'Cahaya Hangat dari Kearifan Bumi',
        contohTarget: 'Dekorasi kamar tidur siswa, ruang tamu rumah, souvenir kenang-kenangan sekolah.',
        contohStrategi: 'Pemesanan kustom ukiran nama pembeli, display pameran karya PKWU sekolah.',
        contohHpp: [
          { nama: 'Lampu Meja Tabung Bambu 25cm + LED', modal: 22000, harga: 38000 },
          { nama: 'Lampu Meja Mini 15cm', modal: 15000, harga: 26000 },
        ],
      },
    ],
  },
  {
    id: '4. USAHA JASA FOTOGRAFI & KONTEN KREATIF',
    label: '4. USAHA JASA FOTOGRAFI & KONTEN KREATIF',
    icon: '📸',
    defaultVarian: 'Paket Jasa Dokumentasi & Katalog Digital Produk UMKM',
    varians: [
      {
        label: 'Paket Jasa Dokumentasi & Katalog Digital Produk UMKM',
        deskripsi: 'Jasa foto produk estetik dan video reels untuk membantu warung/toko UMKM di sekitar sekolah agar laris manis di media sosial.',
        stimulusImage: 'fotografi',
        contohMasalah: 'Banyak warung makanan dan perajin lokal di Banyumas produknya enak tetapi foto iklannya gelap dan buram sehingga sepi pembeli online.',
        contohPotensi: 'Kamera smartphone siswa masa kini sudah sangat jernih, kemampuan editing aplikasi CapCut/Canva cepat dikuasai remaja.',
        contohMerek: 'LensaMuda Creative Studio',
        contohTagline: 'Visual Menarik, Bisnis Melejit Naik',
        contohTarget: 'Pemilik warung makan, kantin sekolah, perajin kue rumahan, dan acara wisuda/kelulusan.',
        contohStrategi: 'Memberikan gratis 2 foto contoh untuk UMKM pertama, promosi portofolio di Instagram, paket hemat khusus pelajar.',
        contohHpp: [
          { nama: 'Paket Foto 5 Menu Produk + Edit Ringan', modal: 10000, harga: 30000 },
          { nama: 'Paket Video Reels Promosi 30 Detik', modal: 15000, harga: 45000 },
        ],
      },
    ],
  },
  {
    id: '5. USAHA PERTANIAN & OLAHAN HORTIKULTURA',
    label: '5. USAHA PERTANIAN & OLAHAN HORTIKULTURA',
    icon: '🌱',
    defaultVarian: 'Sayur Organik Hidroponik Kemasan Bio-Degradable',
    varians: [
      {
        label: 'Sayur Organik Hidroponik Kemasan Bio-Degradable',
        deskripsi: 'Selada air, pakcoy, dan bayam merah hidroponik higienis bebas pestisida dipanen langsung bersama akarnya.',
        stimulusImage: 'pertanian',
        contohMasalah: 'Sayuran di pasar tradisional sering terpapar residu pestisida kimia dan cepat layu dalam hitungan jam.',
        contohPotensi: 'Lahan pekarangan sekolah dan rumah yang cukup sinar matahari, instalasi pipa paralon air bersih, pupuk nutrisi ramah lingkungan.',
        contohMerek: 'GreenFresh Hydro Organik',
        contohTagline: 'Petik Pagi, Santap Sehat Sepenuh Hati',
        contohTarget: 'Ibu guru, orang tua murid, tetangga sekitar sekolah, pengusaha katering lokal.',
        contohStrategi: 'Sistem pesan antar (delivery) langsung ke ruang guru setiap hari panen, voucher belanja hemat.',
        contohHpp: [
          { nama: 'Pakcoy Hidroponik 250gr Bersih Akar', modal: 4000, harga: 8000 },
          { nama: 'Selada Keriting Segar 200gr', modal: 5000, harga: 9500 },
        ],
      },
    ],
  },
];

export function createBlankLKPD(groupId: string, groupNumber: number, sektorId?: string, defaultVarian?: string): LKPDData {
  return {
    groupId,
    groupName: '',
    sektorUsaha: sektorId || '1. USAHA KULINER LOKAL',
    tanggalAsesmen: '',
    members: ['', '', '', '', '', ''],
    ketuaNama: '',
    guruNama: 'Bapak Didi, S.Pd.',
    guruNip: '19850412 201001 1 018',
    varianGambar: defaultVarian || 'Camilan Rempah & Olahan Pangan Lokal',
    latarBelakangMasalah: '',
    potensiBahanBaku: '',
    namaMerek: '',
    sloganPromosi: '',
    targetKonsumen: '',
    strategiPemasaran: '',
    tabelHpp: [
      { id: '1', namaProduk: '', modalHpp: 0, hargaJual: 0 },
      { id: '2', namaProduk: '', modalHpp: 0, hargaJual: 0 },
    ],
    kesimpulanRefleksi: '',
    skorOrisinalitas: 0,
    skorKearifanLokal: 0,
    skorKelayakanBiaya: 0,
    skorKolaborasi: 0,
    updatedAt: Date.now(),
  };
}

export const INITIAL_LKPD_DATA: Record<string, LKPDData> = {
  'kelompok-1': createBlankLKPD('kelompok-1', 1, '1. USAHA KULINER LOKAL', 'Camilan Rempah & Olahan Pangan Lokal'),
  'kelompok-2': createBlankLKPD('kelompok-2', 2, '2. USAHA FASHION & WASTRA LOKAL', 'Totebag Ecoprint Daun Jati & Kanvas Estetik'),
  'kelompok-3': createBlankLKPD('kelompok-3', 3, '3. KERAJINAN TANGAN (KRIYA LOKAL)', 'Organizer Meja Belajar Anyaman Bambu & Serat Alam'),
  'kelompok-4': createBlankLKPD('kelompok-4', 4, '1. USAHA KULINER LOKAL', 'Camilan Rempah & Olahan Pangan Lokal'),
  'kelompok-5': createBlankLKPD('kelompok-5', 5, '2. USAHA FASHION & WASTRA LOKAL', 'Totebag Ecoprint Daun Jati & Kanvas Estetik'),
  'kelompok-6': createBlankLKPD('kelompok-6', 6, '3. KERAJINAN TANGAN (KRIYA LOKAL)', 'Organizer Meja Belajar Anyaman Bambu & Serat Alam'),
};

export const DEMO_LKPD_EXAMPLES: Record<string, Partial<LKPDData>> = {
  '1. USAHA KULINER LOKAL': {
    latarBelakangMasalah: 'Banyak bahan singkong dan rempah melimpah di petani Kemranjen tetapi hanya dijual mentah dengan harga murah tanpa sentuhan inovasi rasa maupun kemasan yang higienis.',
    potensiBahanBaku: 'Singkong ketan lokal teksturnya renyah gurih, dipadukan rempah kapulaga dan bawang putih Banyumas yang aromatik serta bebas bahan pengawet kimiawi.',
    namaMerek: 'Keripik Tempe & Singkong Rempah "Mbahe"',
    sloganPromosi: 'Kriuk Gurih Alami, Warisan Rasa Banyumas',
    targetKonsumen: 'Warga sekolah (siswa, bapak/ibu guru), kaum muda pencinta camilan pedas gurih, dan wisatawan pusat oleh-oleh.',
    strategiPemasaran: 'Membuka stand di bazar Play Therapy Pasar Kreatif Sekolah, sistem pre-order melalui WhatsApp status, dan promo kemasan tester gratis.',
    tabelHpp: [
      { id: '1', namaProduk: 'Kemasan Stand Pouch 150 gram', modalHpp: 8000, hargaJual: 13000 },
      { id: '2', namaProduk: 'Kemasan Box Gift 300 gram', modalHpp: 16000, hargaJual: 25000 },
    ],
    kesimpulanRefleksi: 'Melalui penyusunan LKPD ini, kami belajar pentingnya menghitung modal secara teliti dan bagaimana merancang kemasan produk agar menarik minat pembeli di era digital.',
    skorOrisinalitas: 24,
    skorKearifanLokal: 25,
    skorKelayakanBiaya: 23,
    skorKolaborasi: 25,
  },
  '2. USAHA FASHION & WASTRA LOKAL': {
    latarBelakangMasalah: 'Penggunaan kantong kresek sekali pakai masih banyak ditemukan di sekitar lingkungan sekolah, padahal mencemari tanah dan susah terurai.',
    potensiBahanBaku: 'Daun jati muda yang berjatuhan di kebun sekolah dapat diekstrak warnanya menggunakan teknik ecoprint alami pada kain blacu kanvas ramah lingkungan.',
    namaMerek: 'Totebag "EcoJati Kemranjen"',
    sloganPromosi: 'Gaya Etnik Kekinian, Bersahabat dengan Kelestarian Alam',
    targetKonsumen: 'Siswa SMP-SMA yang membutuhkan tas buku praktis, mahasiswi, serta bapak/ibu guru pecinta kerajinan wastra etnik.',
    strategiPemasaran: 'Promosi foto katalog di Instagram kelas, pameran produk di mading sekolah, dan program tukar kantong kresek dapat diskon 10%.',
    tabelHpp: [
      { id: '1', namaProduk: 'Totebag Kanvas Ecoprint 30x40 cm', modalHpp: 18000, hargaJual: 30000 },
      { id: '2', namaProduk: 'Pouch Serbaguna Ecoprint 15x20 cm', modalHpp: 9000, hargaJual: 16000 },
    ],
    kesimpulanRefleksi: 'Kami menyadari bahwa alam sekitar Banyumas menyimpan potensi pewarna yang sangat indah dan memiliki nilai jual ekonomi tinggi jika diolah secara kreatif.',
    skorOrisinalitas: 24,
    skorKearifanLokal: 25,
    skorKelayakanBiaya: 24,
    skorKolaborasi: 24,
  },
  '3. KERAJINAN TANGAN (KRIYA LOKAL)': {
    latarBelakangMasalah: 'Meja belajar di kelas seringkali berantakan dengan alat tulis yang berserakan, sementara organizer berbahan plastik impor mudah patah dan tidak estetik.',
    potensiBahanBaku: 'Bambu apus Kemranjen terkenal lentur, kuat, dan melimpah di pekarangan warga sekitar sekolah.',
    namaMerek: 'BambuOrganizer "Kreasi Meja"',
    sloganPromosi: 'Meja Rapi Tertata, Semangat Belajar Makin Membara',
    targetKonsumen: 'Pelajar, guru di ruang kantor, perpustakaan sekolah, serta pekerja kantoran di lingkungan sekitar.',
    strategiPemasaran: 'Penjualan langsung saat penerimaan rapor, paket kado wisuda, dan pre-order custom nama ukiran.',
    tabelHpp: [
      { id: '1', namaProduk: 'Desk Organizer 3 Sekat Anyaman Bambu', modalHpp: 14000, hargaJual: 24000 },
      { id: '2', namaProduk: 'Holder Handphone Anyaman Meja', modalHpp: 7000, hargaJual: 13000 },
    ],
    kesimpulanRefleksi: 'Kerja tim pembagian tugas sangat terasa manfaatnya, ada yang fokus menghitung biaya dan ada yang memikirkan desain produk.',
    skorOrisinalitas: 23,
    skorKearifanLokal: 25,
    skorKelayakanBiaya: 24,
    skorKolaborasi: 24,
  },
};
