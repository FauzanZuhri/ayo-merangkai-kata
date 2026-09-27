// Designated Papercraft Sticker Strips / Slots for the 2200px Panorama World
// Ensures each unlocked sticker has an intentional, delightful habitat strip in the world diorama

export const DIORAMA_SLOTS = {
  // ZONE 1: TAMAN & PADANG RUMPUT (0px - 550px)
  kucing: {
    id: 'kucing',
    word: 'KUCING',
    icon: '🐱',
    zone: 'taman',
    zoneX: 0,
    x: 140,
    y: 205,
    hint: 'Di taman bunga dekat pohon'
  },
  bunga: {
    id: 'bunga',
    word: 'BUNGA',
    icon: '🌸',
    zone: 'taman',
    zoneX: 0,
    x: 255,
    y: 200,
    hint: 'Mekar di padang rumput ceria'
  },
  kelinci: {
    id: 'kelinci',
    word: 'KELINCI',
    icon: '🐰',
    zone: 'taman',
    zoneX: 0,
    x: 375,
    y: 195,
    hint: 'Di dekat bukit pohon rindang'
  },
  apel: {
    id: 'apel',
    word: 'APEL',
    icon: '🍎',
    zone: 'taman',
    zoneX: 0,
    x: 470,
    y: 115,
    hint: 'Di dahan pohon apel kertas'
  },
  singa: {
    id: 'singa',
    word: 'SINGA',
    icon: '🦁',
    zone: 'taman',
    zoneX: 0,
    x: 495,
    y: 210,
    hint: 'Di hamparan rumput hijau'
  },

  // ZONE 2: SUNGAI & DANAU (550px - 1100px)
  bola: {
    id: 'bola',
    word: 'BOLA',
    icon: '⚽',
    zone: 'sungai',
    zoneX: 550,
    x: 620,
    y: 195,
    hint: 'Di tepi jalan dekat jembatan'
  },
  ikan: {
    id: 'ikan',
    word: 'IKAN',
    icon: '🐟',
    zone: 'sungai',
    zoneX: 550,
    x: 740,
    y: 235,
    hint: 'Berenang di air sungai jernih'
  },
  bebek: {
    id: 'bebek',
    word: 'BEBEK',
    icon: '🦆',
    zone: 'sungai',
    zoneX: 550,
    x: 840,
    y: 220,
    hint: 'Berenang di tepi danau ceria'
  },
  topi: {
    id: 'topi',
    word: 'TOPI',
    icon: '👒',
    zone: 'sungai',
    zoneX: 550,
    x: 935,
    y: 145,
    hint: 'Di atas tiang jembatan kayu'
  },
  buku: {
    id: 'buku',
    word: 'BUKU',
    icon: '📚',
    zone: 'sungai',
    zoneX: 550,
    x: 1040,
    y: 200,
    hint: 'Di bawah pohon dekat sungai'
  },

  // ZONE 3: KOTA & JALAN RAYA (1100px - 1650px)
  mobil: {
    id: 'mobil',
    word: 'MOBIL',
    icon: '🚗',
    zone: 'kota',
    zoneX: 1100,
    x: 1220,
    y: 225,
    hint: 'Melaju di jalan raya kota'
  },
  kereta: {
    id: 'kereta',
    word: 'KERETA',
    icon: '🚂',
    zone: 'kota',
    zoneX: 1100,
    x: 1375,
    y: 225,
    hint: 'Di lintasan jalan kota'
  },
  roti: {
    id: 'roti',
    word: 'ROTI',
    icon: '🍞',
    zone: 'kota',
    zoneX: 1100,
    x: 1495,
    y: 175,
    hint: 'Di jendela toko rumah kertas'
  },
  gajah: {
    id: 'gajah',
    word: 'GAJAH',
    icon: '🐘',
    zone: 'kota',
    zoneX: 1100,
    x: 1600,
    y: 205,
    hint: 'Di depan pekarangan rumah'
  },

  // ZONE 4: LANGIT & BINTANG (1650px - 2200px)
  awan: {
    id: 'awan',
    word: 'AWAN',
    icon: '☁️',
    zone: 'langit',
    zoneX: 1650,
    x: 1765,
    y: 85,
    hint: 'Melayang di langit senja pastel'
  },
  kupu: {
    id: 'kupu',
    word: 'KUPU',
    icon: '🦋',
    zone: 'langit',
    zoneX: 1650,
    x: 1890,
    y: 135,
    hint: 'Terbang di udara bukit senja'
  },
  bintang: {
    id: 'bintang',
    word: 'BINTANG',
    icon: '⭐',
    zone: 'langit',
    zoneX: 1650,
    x: 2030,
    y: 80,
    hint: 'Berkelip di langit malam temaram'
  }
};

export function getSlotForWord(wordId) {
  return DIORAMA_SLOTS[wordId] || {
    id: wordId,
    word: wordId.toUpperCase(),
    icon: '🎨',
    zone: 'taman',
    zoneX: 0,
    x: 200,
    y: 200,
    hint: 'Di dunia diorama kertas'
  };
}
