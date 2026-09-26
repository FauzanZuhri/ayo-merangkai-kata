// Word dataset for Monster Phonics
// Categories: Hewan (Animals), Buah & Makanan (Fruits & Food), Benda (Objects), Alam (Nature)

export const WORDS_DATABASE = [
  {
    id: 'kucing',
    word: 'KUCING',
    category: '🐱 Hewan',
    image: '/images/words/kucing.png',
    phonics: ['keh', 'uu', 'ceh', 'ii', 'ng'],
    hint: 'Hewan berbulu yang suka mengeong',
    meaning: 'Kucing adalah hewan peliharaan berbulu lembut yang suka bermain bola benang dan bersuara "meong-meong"!',
    soundWord: 'Kucing',
    vignette: {
      type: 'cat',
      bgColor: 'linear-gradient(135deg, #FFE5EC 0%, #FFC2D1 100%)',
      storyText: 'Meow! Kucing manis lucu bermain bola benang warna-warni!',
      actionSound: 'meow',
      tagline: 'Sahabat berbulu yang manis! 🐾'
    }
  },
  {
    id: 'apel',
    word: 'APEL',
    category: '🍎 Buah & Makanan',
    image: '/images/words/apel.png',
    phonics: ['aa', 'peh', 'eh', 'ell'],
    hint: 'Buah bulat manis berwarna merah atau hijau',
    meaning: 'Apel adalah buah lezat kaya vitamin yang renyah dan segar saat digigit!',
    soundWord: 'Apel',
    vignette: {
      type: 'apple',
      bgColor: 'linear-gradient(135deg, #FFDFD3 0%, #FEC8D8 100%)',
      storyText: 'Krupuk! Nyam nyam! Apel merah manis yang renyah dan menyehatkan!',
      actionSound: 'crunch',
      tagline: 'Segar, renyah, dan bergizi! 🍎'
    }
  },
  {
    id: 'bola',
    word: 'BOLA',
    category: '⚽ Benda',
    image: '/images/words/bola.png',
    phonics: ['beh', 'oo', 'ell', 'aa'],
    hint: 'Benda bulat yang asyik dipantulkan dan ditendang',
    meaning: 'Bola adalah mainan berbentuk bulat yang bisa memantul tinggi untuk berolahraga bersama teman!',
    soundWord: 'Bola',
    vignette: {
      type: 'ball',
      bgColor: 'linear-gradient(135deg, #E0F4FF 0%, #BEE3F8 100%)',
      storyText: 'Boing boing! Bola ceria warna-warni melompat dan memantul gembira!',
      actionSound: 'bounce',
      tagline: 'Memantul tinggi ke udara! ⚽'
    }
  },
  {
    id: 'ikan',
    word: 'IKAN',
    category: '🐟 Hewan',
    image: '/images/words/ikan.png',
    phonics: ['ii', 'keh', 'aa', 'en'],
    hint: 'Hewan yang bisa berenang lincah di dalam air',
    meaning: 'Ikan adalah hewan yang hidup di dalam air, bernapas dengan insang, dan berenang menggunakan sirip!',
    soundWord: 'Ikan',
    vignette: {
      type: 'fish',
      bgColor: 'linear-gradient(135deg, #D4F1F4 0%, #75E6DA 100%)',
      storyText: 'Kecipak-kecipuk! Ikan-ikan mungil berenang lincah di antara gelembung air!',
      actionSound: 'splash',
      tagline: 'Berenang bebas di dalam air! 🐠'
    }
  },
  {
    id: 'mobil',
    word: 'MOBIL',
    category: '🚗 Benda',
    image: '/images/words/mobil.png',
    phonics: ['em', 'oo', 'beh', 'ii', 'ell'],
    hint: 'Kendaraan roda empat untuk bepergian',
    meaning: 'Mobil adalah kendaraan beroda empat yang bergerak cepat dengan mesin untuk mengantar kita jalan-jalan!',
    soundWord: 'Mobil',
    vignette: {
      type: 'car',
      bgColor: 'linear-gradient(135deg, #FFF3BF 0%, #FFE066 100%)',
      storyText: 'Brum brum! Tin tin! Mobil ceria siap meluncur mengantar kita jalan-jalan!',
      actionSound: 'vroom',
      tagline: 'Brum brum! Siap bertualang! 🚗'
    }
  },
  {
    id: 'buku',
    word: 'BUKU',
    category: '📚 Benda',
    image: '/images/words/buku.png',
    phonics: ['beh', 'uu', 'keh', 'uu'],
    hint: 'Lembaran kertas berisi cerita dan gambar menarik',
    meaning: 'Buku adalah jendela dunia yang penuh dengan ilmu pengetahuan, cerita petualangan, dan gambar-gambar indah!',
    soundWord: 'Buku',
    vignette: {
      type: 'book',
      bgColor: 'linear-gradient(135deg, #E8DFF5 0%, #D0BDF4 100%)',
      storyText: 'Tring! Buku ajaib terbuka dan bintang-bintang cerita melayang indah!',
      actionSound: 'twinkle',
      tagline: 'Jendela ilmu dan imajinasi! 📖'
    }
  },
  {
    id: 'singa',
    word: 'SINGA',
    category: '🦁 Hewan',
    image: '/images/words/singa.png',
    phonics: ['es', 'ii', 'ng', 'aa'],
    hint: 'Raja hutan yang memiliki surai lebat di lehernya',
    meaning: 'Singa adalah hewan pemberani yang disebut raja rimba, terkenal dengan auman dan surai rambutnya yang gagah!',
    soundWord: 'Singa',
    vignette: {
      type: 'lion',
      bgColor: 'linear-gradient(135deg, #FFE8D6 0%, #DDBEA9 100%)',
      storyText: 'Auuuum! Singa kecil bermahkota emas tersenyum ramah dan gagah!',
      actionSound: 'roar',
      tagline: 'Raja rimba yang ramah dan gagah! 🦁'
    }
  },
  {
    id: 'bintang',
    word: 'BINTANG',
    category: '⭐ Alam',
    image: '/images/words/bintang.png',
    phonics: ['beh', 'ii', 'en', 'teh', 'aa', 'ng'],
    hint: 'Benda langit yang berkelip-kelip indah di malam hari',
    meaning: 'Bintang adalah benda langit bercahaya indah yang menghiasi malam hari seperti permata berkilau!',
    soundWord: 'Bintang',
    vignette: {
      type: 'star',
      bgColor: 'linear-gradient(135deg, #1A1A40 0%, #270082 100%)',
      storyText: 'Tring tring! Bintang emas tersenyum cerah di bawah langit malam berbintang!',
      actionSound: 'twinkle',
      tagline: 'Berkelip menerangi malam yang damai! ✨'
    }
  },
  {
    id: 'roti',
    word: 'ROTI',
    category: '🍞 Buah & Makanan',
    image: '/images/words/roti.png',
    phonics: ['er', 'oo', 'teh', 'ii'],
    hint: 'Makanan empuk beraroma wangi untuk sarapan',
    meaning: 'Roti adalah makanan lezat yang dibuat dari gandum, terasa empuk, dan sangat nikmat dinikmati saat pagi!',
    soundWord: 'Roti',
    vignette: {
      type: 'bread',
      bgColor: 'linear-gradient(135deg, #FFF1E6 0%, #FDE2E4 100%)',
      storyText: 'Huuuum harum! Roti empuk dan hangat tersenyum lezat siap untuk dinikmati!',
      actionSound: 'crunch',
      tagline: 'Empuk, harum, dan mengenyangkan! 🍞'
    }
  },
  {
    id: 'bebek',
    word: 'BEBEK',
    category: '🦆 Hewan',
    image: '/images/words/bebek.png',
    phonics: ['beh', 'eh', 'beh', 'eh', 'keh'],
    hint: 'Unggas berkaki dua yang suka berenang dan berbunyi kwek-kwek',
    meaning: 'Bebek adalah unggas lucu berparuh pipih yang pandai berenang dengan kaki berselaputnya!',
    soundWord: 'Bebek',
    vignette: {
      type: 'duck',
      bgColor: 'linear-gradient(135deg, #FFF9DB 0%, #EBFBEE 100%)',
      storyText: 'Kwek kwek! Bebek kuning lucu berenang riang membuat riak air jernih!',
      actionSound: 'quack',
      tagline: 'Kwek kwek kwek! Sahabat air yang riang! 🦆'
    }
  },
  {
    id: 'topi',
    word: 'TOPI',
    category: '🧢 Benda',
    image: '/images/words/topi.png',
    phonics: ['teh', 'oo', 'peh', 'ii'],
    hint: 'Penutup kepala untuk melindungi dari sinar matahari',
    meaning: 'Topi adalah pelindung kepala yang keren dan nyaman agar kita tidak kepanasan saat bermain di luar!',
    soundWord: 'Topi',
    vignette: {
      type: 'hat',
      bgColor: 'linear-gradient(135deg, #EBFBEE 0%, #D3F9D8 100%)',
      storyText: 'Cihui! Topi warna-warni yang ceria melindungi kepala saat bermain di luar!',
      actionSound: 'cheer',
      tagline: 'Keren dan melindungi kepala saat berpetualang! 👒'
    }
  },
  {
    id: 'awan',
    word: 'AWAN',
    category: '☁️ Alam',
    image: '/images/words/awan.png',
    phonics: ['aa', 'weh', 'aa', 'en'],
    hint: 'Gumpalan putih lembut seperti kapas yang melayang di langit',
    meaning: 'Awan adalah gumpalan uap air yang melayang di angkasa, terlihat putih dan lembut seperti permen kapas!',
    soundWord: 'Awan',
    vignette: {
      type: 'cloud',
      bgColor: 'linear-gradient(135deg, #E3FAFC 0%, #C5F6FA 100%)',
      storyText: 'Wush! Awan putih tersenyum lembut ditemani pelangi warna-warni yang indah!',
      actionSound: 'whoosh',
      tagline: 'Melayang lembut di angkasa biru! ☁️'
    }
  },
  {
    id: 'bunga',
    word: 'BUNGA',
    category: '🌸 Alam',
    image: '/images/words/bunga.png',
    phonics: ['beh', 'uu', 'en', 'geh', 'aa'],
    hint: 'Tumbuhan indah berwarna-warni yang harum semerbak',
    meaning: 'Bunga adalah bagian tanaman yang elok dan mempesona, dengan kelopak aneka warna yang disukai kupu-kupu!',
    soundWord: 'Bunga',
    vignette: {
      type: 'flower',
      bgColor: 'linear-gradient(135deg, #FFE5EC 0%, #F8EDEB 100%)',
      storyText: 'Semerbak harum! Bunga kertas mekar ceria menyapa mentari pagi!',
      actionSound: 'twinkle',
      tagline: 'Mekar indah dan harum semerbak! 🌸'
    }
  },
  {
    id: 'kelinci',
    word: 'KELINCI',
    category: '🐰 Hewan',
    image: '/images/words/kelinci.png',
    phonics: ['keh', 'eh', 'ell', 'ii', 'en', 'ceh', 'ii'],
    hint: 'Hewan telinga panjang yang suka melompat dan mengunyah wortel',
    meaning: 'Kelinci adalah sahabat berbulu lembut bertelinga panjang yang lincah melompat dan sangat gemar makan wortel!',
    soundWord: 'Kelinci',
    vignette: {
      type: 'rabbit',
      bgColor: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
      storyText: 'Lompat-lompat! Kelinci manis mengunyah wortel oranye dengan riang!',
      actionSound: 'bounce',
      tagline: 'Melompat lincah menggemaskan! 🐰'
    }
  },
  {
    id: 'kereta',
    word: 'KERETA',
    category: '🚂 Benda',
    image: '/images/words/kereta.png',
    phonics: ['keh', 'eh', 'er', 'eh', 'teh', 'aa'],
    hint: 'Kendaraan beroda rel yang panjang dengan lokomotif',
    meaning: 'Kereta adalah alat transportasi beroda rel yang ditarik lokomotif cepat sambil mengeluarkan suara tuut-tuut ceria!',
    soundWord: 'Kereta',
    vignette: {
      type: 'train',
      bgColor: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      storyText: 'Tuut tuut gujes gujes! Kereta mainan meluncur di atas rel panjang!',
      actionSound: 'vroom',
      tagline: 'Melaju cepat di atas rel! 🚂'
    }
  },
  {
    id: 'kupu',
    word: 'KUPU',
    category: '🦋 Hewan',
    image: '/images/words/kupu.png',
    phonics: ['keh', 'uu', 'peh', 'uu'],
    hint: 'Serangga bersayap indah yang menari di antara kelopak bunga',
    meaning: 'Kupu-kupu adalah serangga bersayap elok penuh corak warna-warni yang terbang riang di taman bunga!',
    soundWord: 'Kupu',
    vignette: {
      type: 'butterfly',
      bgColor: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
      storyText: 'Kepik kepik! Sayap pastel kupu-kupu menari elok di udara taman!',
      actionSound: 'twinkle',
      tagline: 'Terbang anggun di antara bunga! 🦋'
    }
  },
  {
    id: 'gajah',
    word: 'GAJAH',
    category: '🐘 Hewan',
    image: '/images/words/gajah.png',
    phonics: ['geh', 'aa', 'jeh', 'aa', 'hah'],
    hint: 'Hewan darat berbadan besar dengan belalai panjang dan telinga lebar',
    meaning: 'Gajah adalah hewan darat terbesar yang ramah dan bijaksana, memiliki belalai panjang serbaguna dan daun telinga lebar!',
    soundWord: 'Gajah',
    vignette: {
      type: 'elephant',
      bgColor: 'linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%)',
      storyText: 'Tet tooot! Gajah kecil mengangkat belalainya menyapa kita semua!',
      actionSound: 'roar',
      tagline: 'Raksasa baik hati bertelinga lebar! 🐘'
    }
  }
];

export const LETTER_PHONICS_MAP = {
  A: { chant: 'A... a... a!', sound: 'a' },
  B: { chant: 'B... beh... beh!', sound: 'beh' },
  C: { chant: 'C... ceh... ceh!', sound: 'ceh' },
  D: { chant: 'D... deh... deh!', sound: 'deh' },
  E: { chant: 'E... eh... eh!', sound: 'eh' },
  F: { chant: 'F... eff... eff!', sound: 'eff' },
  G: { chant: 'G... geh... geh!', sound: 'geh' },
  H: { chant: 'H... hah... hah!', sound: 'hah' },
  I: { chant: 'I... ii... ii!', sound: 'i' },
  J: { chant: 'J... jeh... jeh!', sound: 'jeh' },
  K: { chant: 'K... keh... keh!', sound: 'keh' },
  L: { chant: 'L... ell... ell!', sound: 'ell' },
  M: { chant: 'M... em... em!', sound: 'em' },
  N: { chant: 'N... en... en!', sound: 'en' },
  O: { chant: 'O... oo... oo!', sound: 'o' },
  P: { chant: 'P... peh... peh!', sound: 'peh' },
  Q: { chant: 'Q... kyu... kyu!', sound: 'kyu' },
  R: { chant: 'R... err... err!', sound: 'err' },
  S: { chant: 'S... ess... ess!', sound: 'ess' },
  T: { chant: 'T... teh... teh!', sound: 'teh' },
  U: { chant: 'U... uu... uu!', sound: 'u' },
  V: { chant: 'V... feh... feh!', sound: 'feh' },
  W: { chant: 'W... weh... weh!', sound: 'weh' },
  X: { chant: 'X... eks... eks!', sound: 'eks' },
  Y: { chant: 'Y... yeh... yeh!', sound: 'yeh' },
  Z: { chant: 'Z... zett... zett!', sound: 'zett' }
};
