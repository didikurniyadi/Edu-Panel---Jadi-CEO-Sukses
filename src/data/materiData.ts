export interface Slide {
  id: number;
  badge: string;
  title: string;
  shortTitle?: string;
  subtitle: string;
  tags: string[];
  sections: {
    heading: string;
    description: string;
    bullets?: string[];
    highlight?: string;
    iconType?: 'lightbulb' | 'target' | 'chart' | 'users' | 'store' | 'award' | 'coins';
  }[];
  quoteOrSummary?: {
    text: string;
    authorOrSource: string;
  };
}

export const MATERI_SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'Pengantar & Orientasi Belajar',
    title: 'Tujuan Pembelajaran',
    shortTitle: 'Tujuan Belajar',
    subtitle: 'Kompetensi & Arah Capaian Modul Cikal Wirausahawan Sukses (MGBK Banyumas)',
    tags: ['Tujuan Pembelajaran', 'Kemandirian Hidup', 'Karakter Wirausaha', 'Kurikulum Merdeka'],
    sections: [
      {
        heading: 'Capaian & Fokus Pembelajaran',
        description: 'Melalui modul bimbingan dan proyek kolaboratif ini, peserta didik dipersiapkan untuk menumbuhkan kemandirian hidup, kepekaan peluang ekonomi, dan mentalitas berwirausaha sejak usia sekolah.',
        bullets: [
          '1. Sikap (Afektif): Menginternalisasi 4 perilaku kunci (Hemat, Gigih, Kompetitif, dan Kolaboratif) dalam aktivitas harian dan kerja tim.',
          '2. Pengetahuan (Kognitif): Memahami 6 tahapan merintis usaha baru, metode riset pasar kebutuhan konsumen, serta memetakan potensi bisnis lokal Banyumas.',
          '3. Keterampilan (Psikomotorik): Mampu merancang gagasan usaha sederhana pada LKPD Kolaboratif dan mempraktikkannya dalam simulasi Pasar Kreatif (Play Therapy).',
        ],
        iconType: 'target',
        highlight: 'Membimbing siswa agar tidak hanya memahami konsep teori, melainkan memiliki keberanian mengambil inisiatif dan berkreasi secara nyata.',
      },
      {
        heading: 'Indikator Keberhasilan Siswa',
        description: 'Siswa dikatakan berhasil mencapai tujuan pembelajaran apabila dapat memenuhi kriteria kompetensi berikut:',
        bullets: [
          'Mengetahui profil minat wirausaha pribadi melalui asesmen awal secara jujur dan reflektif.',
          'Mampu mengidentifikasi masalah di lingkungan sekitar dan mengubahnya menjadi solusi bernilai jual.',
          'Bekerja sama secara aktif dan harmonis bersama rekan kelompok dalam pembagian peran unit usaha.',
          'Percaya diri mengkomunikasikan keunggulan produk dan nilai tambah usaha di hadapan teman dan guru.',
        ],
        iconType: 'award',
        highlight: 'Setiap siswa memiliki potensi unik untuk bertumbuh menjadi pribadi mandiri yang siap menyongsong masa depan.',
      },
    ],
    quoteOrSummary: {
      text: '"Tujuan belajar bukan sekadar mengumpulkan nilai, melainkan menumbuhkan keberanian berkarya dan hidup mandiri."',
      authorOrSource: 'Tujuan Modul 14 AKSES — MGBK Banyumas',
    },
  },
  {
    id: 2,
    badge: 'Bagian A: Orientasi & Nilai Dasar',
    title: 'Jadi Cikal Wirausahawan Sukses',
    shortTitle: 'Nilai Dasar',
    subtitle: 'Mengembangkan 4 Perilaku Kunci untuk Kemandirian Hidup (MGBK Banyumas)',
    tags: ['Kemandirian', 'Karakter Wirausaha', 'Fondasi'],
    sections: [
      {
        heading: 'Kewirausahaan Sebagai Jalan Kemandirian',
        description: 'Kewirausahaan adalah kemampuan menciptakan peluang, mengambil risiko, dan mengembangkan bisnis yang sukses. Keterampilan ini sangat penting untuk mencapai kemandirian hidup di masa depan.',
        iconType: 'lightbulb',
      },
      {
        heading: '4 Perilaku Kunci Wirausahawan',
        description: 'Untuk mencapai kemandirian hidup, terdapat 4 pilar perilaku kunci yang harus terus diasah:',
        bullets: [
          '1. Perilaku Hemat: Mengelola keuangan dengan bijak, menghindari hutang konsumtif, serta menabung dan berinvestasi untuk masa depan.',
          '2. Perilaku Gigih: Kemampuan untuk tetap fokus, ulet, dan bertahan dalam menghadapi rintangan demi mencapai tujuan.',
          '3. Perilaku Kompetitif: Kemampuan bersaing secara sehat, memahami kelebihan dan kelemahan bisnis, serta pantang menyerah.',
          '4. Perilaku Kolaboratif: Kemampuan bersinergi dengan rekan kerja, mitra, dan pelanggan untuk membangun jaringan usaha yang kokoh.',
        ],
        iconType: 'users',
        highlight: 'Kombinasi 4 perilaku ini menjadi fondasi karakter sebelum merancang produk atau bisnis.',
      },
    ],
    quoteOrSummary: {
      text: 'Bukan besarnya modal awal yang menentukan keberhasilan wirausaha, melainkan kegigihan dan kesiapan beradaptasi.',
      authorOrSource: 'MGBK Kabupaten Banyumas — AKSES Modul 14',
    },
  },
  {
    id: 3,
    badge: 'Bagian B: Studi Kasus Inspiratif',
    title: 'Kisah Inspiratif: Mia si Wirausahawan Digital Muda',
    shortTitle: 'Kasus Mia',
    subtitle: 'Menjawab Tantangan Zaman Lewat Transformasi & Adaptasi Teknologi',
    tags: ['Studi Kasus', 'Digitalisasi', 'Resiliensi'],
    sections: [
      {
        heading: 'Krisis Toko Buku Tradisional Mia',
        description: 'Mia adalah pemilik toko buku konvensional. Ia menyadari pengunjung toko fisiknya terus menurun karena dominasi bisnis online dan pesatnya kemajuan teknologi digital. Toko bukunya terancam bangkrut jika ia tidak segera berinovasi.',
        iconType: 'store',
      },
      {
        heading: 'Langkah Berani & Solusi Digital',
        description: 'Alih-alih menyerah, Mia memilih berani menghadapi perubahan:',
        bullets: [
          'Mengikuti pelatihan digital untuk menguasai keterampilan e-commerce, digital marketing, dan manajemen toko online.',
          'Mentransformasi toko buku fisik menjadi toko buku online yang interaktif, menarik, dan efisien.',
          'Aktif membangun komunitas di media sosial dan memberikan pengalaman berbelanja terpersonalisasi kepada para pembaca.',
        ],
        iconType: 'chart',
        highlight: 'Ketekunan Mia membuahkan hasil: popularitas toko melonjak drastis dan mendapatkan basis pelanggan setia dari berbagai daerah.',
      },
    ],
    quoteOrSummary: {
      text: '"Adaptasi teknologi dan kemauan untuk terus belajar adalah kunci utama menghadapi tantangan bisnis dan meraih sukses."',
      authorOrSource: 'Kisah Sukses Mia — Halaman 17-18 Modul AKSES',
    },
  },
  {
    id: 4,
    badge: 'Bagian C: Alur Tahapan Usaha',
    title: '6 Langkah Memulai & Merintis Usaha Baru',
    shortTitle: '6 Langkah Usaha',
    subtitle: 'Roadmap Praktis bagi Pemula dari Ide hingga Pemasaran Produk',
    tags: ['Langkah Usaha', 'Perencanaan', 'Bootstrapping'],
    sections: [
      {
        heading: 'Tahap 1–3: Eksplorasi & Rencana Usaha',
        description: 'Fondasi konsep yang kuat sebelum eksekusi barang atau jasa:',
        bullets: [
          '1. Mencari Ide Bisnis: Berangkat dari minat, bakat, passion, atau solusi atas masalah nyata di sekitar lingkungan.',
          '2. Meneliti Pasar (Market Research): Menganalisis tren pasar, mempelajari kekuatan/kelemahan pesaing, dan memahami kebutuhan spesifik pembeli.',
          '3. Membuat Rencana Bisnis: Dokumen terarah memuat visi-misi, analisis SWOT, strategi promosi, struktur kerja, dan keuangan.',
        ],
        iconType: 'target',
      },
      {
        heading: 'Tahap 4–6: Eksekusi, Tim & Pasar',
        description: 'Mewujudkan rencana menjadi operasi bisnis nyata:',
        bullets: [
          '4. Memperoleh Modal & Bootstrapping: Memulai dengan modal minim (tabungan pribadi) tanpa mengandalkan pihak luar untuk membatasi risiko.',
          '5. Membangun Tim Solid: Memilih rekan yang memiliki keahlian saling melengkapi (desain, produksi, pemasaran, pembukuan).',
          '6. Memasarkan Produk: Promosi kreatif via media sosial, toko online, kolaborasi influencer, dan menjaga kepuasan konsumen.',
        ],
        iconType: 'coins',
        highlight: 'Bootstrapping mengajarkan wirausahawan pemula untuk hemat, kreatif, dan cermat mengelola arus kas awal.',
      },
    ],
    quoteOrSummary: {
      text: 'Mulai dari hal yang kamu kuasai, manfaatkan apa yang kamu miliki sekarang, dan kembangkan secara bertahap.',
      authorOrSource: 'Panduan Wirausaha AKSES — Halaman 19',
    },
  },
  {
    id: 5,
    badge: 'Bagian D: Riset Pasar Nyata',
    title: 'Meneliti Pasar: Kisah Sukses Roti Organik Andi',
    shortTitle: 'Riset Pasar Andi',
    subtitle: 'Menemukan Peluang Emas Lewat 4 Dimensi Analisis Riset Pasar',
    tags: ['Riset Pasar', 'Diferensiasi', 'Kebutuhan Konsumen'],
    sections: [
      {
        heading: '4 Komponen Utama Riset Pasar',
        description: 'Riset pasar memastikan produk yang kita jual memang dibutuhkan dan diinginkan oleh konsumen:',
        bullets: [
          '1. Analisis Tren Pasar: Memantau apa yang sedang digemari masyarakat lewat media sosial, berita, dan majalah bisnis.',
          '2. Melihat Pesaing Bisnis: Mengamati kelebihan dan kekurangan kompetitor (kualitas rasa, harga, cara promosi).',
          '3. Menilai Segmentasi Pasar: Menentukan secara spesifik siapa target pelanggan (usia, gaya hidup, kemampuan beli).',
          '4. Mengidentifikasi Kebutuhan Konsumen: Menemukan kebutuhan tersembunyi yang belum dipenuhi oleh toko lain di sekitar.',
        ],
        iconType: 'chart',
      },
      {
        heading: 'Studi Kasus: Roti Organik & Rendah Kalori Andi',
        description: 'Andi mengamati toko-toko roti pesaing di kotanya menjual roti manis biasa berkadar gula tinggi. Melalui survei, Andi menemukan banyak orang ingin makan roti tetapi peduli kesehatan dan diet.',
        bullets: [
          'Inovasi Andi: Membuat roti gandum organik rendah kalori dengan harga terjangkau.',
          'Hasil: Bisnis roti Andi sukses besar merebut pasar karena menghadirkan solusi yang tepat bagi kebutuhan konsumen.',
        ],
        iconType: 'store',
        highlight: 'Kunci sukses Andi bukan bersaing harga murah secara membabi buta, melainkan menciptakan diferensiasi nilai kesehatan.',
      },
    ],
    quoteOrSummary: {
      text: 'Temukan masalah konsumen yang belum terselesaikan, lalu hadirkan produkmu sebagai solusi terbaik.',
      authorOrSource: 'Kisah Riset Andi — Halaman 20 Modul AKSES',
    },
  },
  {
    id: 6,
    badge: 'Bagian E: Tokoh Inspiratif Remaja',
    title: 'Wirausahawan Sukses Indonesia yang Mulai Sejak Usia Sekolah',
    shortTitle: 'Tokoh Remaja',
    subtitle: 'Bukti Nyata Bahwa Usia Muda Memiliki Energi dan Peluang Luar Biasa',
    tags: ['Tokoh Sukses', 'Inspirasi Usia Muda', 'Role Model'],
    sections: [
      {
        heading: 'Kelebihan Memulai Bisnis Sejak Remaja',
        description: 'Remaja memiliki kebebasan waktu, energi besar, rasa ingin tahu tinggi, dan kelenturan mental untuk belajar dari kegagalan tanpa beban finansial keluarga. Kuncinya: tetap gigih, jujur, dan kompetitif.',
        iconType: 'award',
      },
      {
        heading: '4 Tokoh Wirausahawan Ternama Indonesia',
        description: 'Para pendiri bisnis raksasa yang merintis usaha dari langkah sangat sederhana saat masih bersekolah:',
        bullets: [
          '1. William Tanuwijaya (Pendiri Tokopedia): Memulai bisnis online sederhana di usia 17 tahun sambil bekerja penjaga warnet, kini Tokopedia bernilai triliunan rupiah.',
          '2. Ferry Unardi (Pendiri Traveloka): Memulai usaha rental komputer dan game saat bersekolah, sebelum mendirikan platform tiket & pariwisata terbesar Indonesia.',
          '3. William Tunggaldjaja (Pendiri Puyo Desserts): Menjual kue sus keliling saat masih duduk di bangku SMP, kini Puyo Desserts memiliki lebih dari 300 gerai di seluruh Indonesia.',
          '4. Steven Wenas (Pendiri Urbanhire): Memulai bisnis rental CD/DVD di usia 16 tahun sebelum mengembangkan platform perekrutan kerja teknologi terkemuka.',
        ],
        iconType: 'users',
        highlight: 'Semua tokoh ini tidak langsung besar seketika; mereka memulai dari usaha skala mikro dengan tekad pantang menyerah.',
      },
    ],
    quoteOrSummary: {
      text: '"Keberanian mengambil risiko dan mencoba adalah modal terbesar yang dimiliki oleh generasi muda."',
      authorOrSource: 'Profil Inspirasi Tokoh — Halaman 20-21 Modul AKSES',
    },
  },
  {
    id: 7,
    badge: 'Bagian F: Potensi Lokal Banyumas',
    title: '5 Ide Bisnis Potensial di Wilayah Kabupaten Banyumas',
    shortTitle: 'Potensi Banyumas',
    subtitle: 'Menggali Kekayaan Lokal, Tren Anak Muda, dan Kebutuhan Masyarakat',
    tags: ['Banyumas', 'Ide Bisnis Lokal', 'Peluang Nyata'],
    sections: [
      {
        heading: 'Peluang Wirausaha Konkret di Sekitar Kita',
        description: 'Siswa dapat mengembangkan produk wirausaha dengan memanfaatkan kekayaan dan karakteristik lokal Banyumas:',
        bullets: [
          '1. Usaha Kuliner Khas Kreatif: Inovasi makanan ringan modern berbahan lokal (mendoan crispy frozen, keripik tempe rasa kekinian, getuk aneka topping).',
          '2. Usaha Pakaian & Merchandise: Kaos sablon bertema budaya Banyumas / dialek Ngapak gaul, disukai komunitas anak muda dan wisatawan.',
          '3. Usaha Kerajinan Tangan Ramah Lingkungan: Memanfaatkan limbah kertas, kayu, atau tanah liat menjadi cinderamata bernilai jual estetik.',
          '4. Usaha Jasa Fotografi & Kreator Konten: Menyediakan jasa foto dokumentasi acara sekolah, kelulusan, dan konten media sosial UMKM.',
          '5. Usaha Pertanian Hortikultura Organik: Memanfaatkan tanah subur lereng Gunung Slamet untuk sayuran hidroponik, buah stroberi, atau tanaman herbal.',
        ],
        iconType: 'store',
        highlight: 'Setiap daerah memiliki potensi unik. Kembangkan produk yang memiliki identitas lokal agar sulit ditiru kompetitor luar.',
      },
    ],
    quoteOrSummary: {
      text: 'Ide terbaik seringkali ada di halaman rumah kita sendiri: amati apa yang dibutuhkan warga Banyumas setiap hari.',
      authorOrSource: 'MGBK Banyumas — Halaman 21-22 Modul AKSES',
    },
  },
  {
    id: 8,
    badge: 'Bagian G: Pembelajaran Aplikatif',
    title: 'Play Therapy: Simulasi "Pasar Kreatif Sekolah"',
    shortTitle: 'Play Therapy',
    subtitle: 'Metode Bermain Peran Kolaboratif untuk Mengasah Insting Wirausaha Nyata',
    tags: ['Play Therapy', 'Pasar Kreatif', 'Kerja Kelompok'],
    sections: [
      {
        heading: 'Tujuan & Petunjuk Pembagian Tim',
        description: 'Menumbuhkan minat wirausaha, melatih keterampilan komunikasi, kepemimpinan tim, dan pemecahan masalah secara langsung.',
        bullets: [
          'Murid dibagi menjadi kelompok kecil berisi 4–5 orang dengan profil kemampuan yang seimbang.',
          'Setiap kelompok berperan sebagai "Unit Usaha Kreatif" mandiri.',
          'Menggunakan media sederhana: kertas warna, kardus daur ulang, uang mainan (play money), meja pajangan, dan papan promosi.',
        ],
        iconType: 'users',
      },
      {
        heading: '3 Urutan Kegiatan Inti di Kelas',
        description: 'Rangkaian permainan terstruktur selama jam pelajaran:',
        bullets: [
          '1. Ice Breaking (10 Menit): Permainan tebak profesi "Siapa Aku?" untuk mencairkan suasana dan membakar semangat.',
          '2. Pemantik & Diskusi Mini (10 Menit): Diskusi inspiratif tentang "Mengapa Menjadi Wirausaha?" dan tanya jawab singkat.',
          '3. Inti Play Therapy (45 Menit): "Pasar Kreatif Mini" — Tiap tim merancang nama brand, membuat mock-up produk tiruan, menyusun strategi harga, dan melakukan promosi jual-beli antar stand.',
          '4. Penutupan: Menggantungkan impian usaha masa depan di "Pohon Impian Wirausaha" kelas.',
        ],
        iconType: 'lightbulb',
        highlight: 'Pembelajaran ini membuktikan bahwa belajar bisnis dapat dilakukan secara gembira, kolaboratif, dan tanpa tekanan teori yang membosankan.',
      },
    ],
    quoteOrSummary: {
      text: '"Belajar wirausaha lewat bermain: menanamkan benih keberanian, kerjasama, dan kreativitas sejak dini."',
      authorOrSource: 'Panduan Play Therapy — Halaman 22-23 Modul AKSES',
    },
  },
  {
    id: 9,
    badge: 'Rangkuman & Refleksi Pembelajaran',
    title: 'Kesimpulan Pembelajaran',
    shortTitle: 'Kesimpulan Belajar',
    subtitle: 'Intisari Nilai Kunci, Sikap Mental, dan Komitmen Aksi Menuju Kemandirian',
    tags: ['Kesimpulan', 'Refleksi Diri', 'Kemandirian Hidup', 'Aksi Nyata'],
    sections: [
      {
        heading: '4 Intisari Utama Pembelajaran',
        description: 'Rangkuman pemahaman penting yang menjadi bekal wirausahawan muda masa depan:',
        bullets: [
          '1. Modal Utama adalah Karakter: Keberhasilan usaha berakar pada 4 perilaku kunci: Hemat mengelola sumber daya, Gigih menghadapi tantangan, Kompetitif berinovasi, dan Kolaboratif bersinergi.',
          '2. Peka Terhadap Masalah Masyarakat: Wirausaha sejati bukan sekadar menjual barang, melainkan menghadirkan solusi atas persoalan konsumen (seperti kisah sukses Mia & Andi).',
          '3. Mengoptimalkan Potensi Lokal: Banyumas menyimpan limpahan peluang usaha di sektor kuliner, busana, kriya ramah lingkungan, agrobisnis, hingga jasa kreatif digital.',
          '4. Berani Memulai & Bootstrapping: Awali dari langkah mikro dengan modal yang ada, jangan takut gagal, dan jadikan setiap rintangan sebagai sarana pembelajaran terbaik.',
        ],
        iconType: 'lightbulb',
        highlight: 'Kunci sukses sejati: Bertindak konsisten, tidak takut gagal, dan selalu mengutamakan manfaat bagi sesama.',
      },
      {
        heading: 'Komitmen & Rencana Tindak Lanjut Siswa',
        description: 'Langkah nyata yang dilakukan siswa setelah menyelesaikan sesi materi ini:',
        bullets: [
          'Tuntaskan Pengisian LKPD: Susun ide usaha kelompok secara terperinci mencakup nama merek, keunggulan produk, target pasar, dan estimasi modal sederhana.',
          'Aktif dalam Play Therapy: Ambil peran terbaik saat simulasi "Pasar Kreatif Sekolah", latih kemampuan komunikasi promosi dan kerja sama tim.',
          'Refleksi Diri Berkelanjutan: Terapkan kebiasaan hemat dan sikap pantang menyerah dalam kehidupan sehari-hari di rumah maupun sekolah.',
          'Gantungkan Cita-Cita: Tuliskan tekad usaha masa depan di "Pohon Impian Wirausaha" sebagai pengingat arah perjuangan.',
        ],
        iconType: 'users',
        highlight: '"Masa depan adalah milik mereka yang berani bermimpi dan mulai melangkah hari ini!"',
      },
    ],
    quoteOrSummary: {
      text: '"Jadilah cikal wirausahawan yang mandiri, berkarakter teguh, dan menebar manfaat nyata bagi lingkungan sekitar."',
      authorOrSource: 'Rangkuman Akhir Modul AKSES — MGBK Kabupaten Banyumas',
    },
  },
];
