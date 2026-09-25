// Monster Letter SVG Generator for Monster Phonics
// Generates authentic, expressive alphabet-shaped monster characters (Alphabet Lore style)
// Every monster's body is physically shaped as the letter A through Z with lively features!

export const MONSTER_PROFILES = {
  A: { bg: '#FF5964', secondary: '#FFD166', features: 'horns', fangs: true },
  B: { bg: '#3A86FF', secondary: '#8338EC', features: 'antenna', spots: true },
  C: { bg: '#06D6A0', secondary: '#118AB2', features: 'spikes', wideMouth: true, fangs: true },
  D: { bg: '#FF9E00', secondary: '#FFD000', features: 'crown', spots: true },
  E: { bg: '#9B5DE5', secondary: '#F15BB5', features: 'ears', tongue: true },
  F: { bg: '#00BBF9', secondary: '#00F5D4', features: 'wings', rosy: true },
  G: { bg: '#7209B7', secondary: '#F72585', features: 'swirl', glasses: true },
  H: { bg: '#FB8500', secondary: '#FFB703', features: 'ears', rosy: true },
  I: { bg: '#2EC4B6', secondary: '#CBF3F0', features: 'star-topper', cyclops: true },
  J: { bg: '#FF70A6', secondary: '#FF9770', features: 'fins', freckles: true },
  K: { bg: '#70E000', secondary: '#38B000', features: 'tuft', rosy: true },
  L: { bg: '#8338EC', secondary: '#C77DFF', features: 'spots', floppy: true },
  M: { bg: '#E63946', secondary: '#F4A261', features: 'cat-ears', whiskers: true },
  N: { bg: '#48CAE4', secondary: '#0077B6', features: 'spikes', spots: true },
  O: { bg: '#F77F00', secondary: '#FCBF49', features: 'round-antenna', bigSmile: true },
  P: { bg: '#06D6A0', secondary: '#B5E48C', features: 'chubby', freckles: true },
  Q: { bg: '#6A4C93', secondary: '#B5179E', features: 'tail', crown: true },
  R: { bg: '#E63946', secondary: '#FF4D6D', features: 'headband', energetic: true },
  S: { bg: '#FFD166', secondary: '#FF9E00', features: 'coils', fangs: true, rosy: true },
  T: { bg: '#118AB2', secondary: '#06D6A0', features: 'propeller' },
  U: { bg: '#8338EC', secondary: '#E0AAFF', features: 'horns', rosy: true },
  V: { bg: '#F72585', secondary: '#7209B7', features: 'wings', fangs: true },
  W: { bg: '#FF6B6B', secondary: '#4ECDC4', features: 'butterfly', spots: true },
  X: { bg: '#52B788', secondary: '#95D5B2', features: 'star-eyes', energetic: true },
  Y: { bg: '#FF477E', secondary: '#FF85A1', features: 'horns', rosy: true },
  Z: { bg: '#FFBE0B', secondary: '#FB5607', features: 'mask', lightning: true }
};

export function getMonsterColor(letter) {
  const char = (letter || 'A').toUpperCase();
  return MONSTER_PROFILES[char]?.bg || '#FF5964';
}

/**
 * Geometric shape definitions and anchor coordinates for all 26 alphabet letters
 * Designed on a 120x120 SVG grid with thick, friendly cartoon silhouettes
 */
export const LETTER_SPECS = {
  A: {
    // Chunky arch letter A with inner cutout
    path: 'M 60 16 C 68 16 73 21 77 30 L 102 92 C 105 98 100 104 93 104 L 78 104 C 73 104 69 100 67 95 L 63 85 L 57 85 L 53 95 C 51 100 47 104 42 104 L 27 104 C 20 104 15 98 18 92 L 43 30 C 47 21 52 16 60 16 Z M 60 42 L 51 68 L 69 68 Z',
    fillRule: 'evenodd',
    eyes: { left: { cx: 48, cy: 36, r: 9 }, right: { cx: 72, cy: 36, r: 9 } },
    mouth: { cx: 60, cy: 76, rx: 11, ry: 7 },
    cheeks: { left: { cx: 34, cy: 46 }, right: { cx: 86, cy: 46 } },
    feet: [{ cx: 34, cy: 105 }, { cx: 86, cy: 105 }],
    hands: [{ cx: 20, cy: 72 }, { cx: 100, cy: 72 }],
    headCenter: { cx: 60, cy: 16 }
  },

  B: {
    // Letter B with double round belly lobes
    path: 'M 24 18 C 24 14 28 12 34 12 L 68 12 C 82 12 94 21 94 35 C 94 44 87 51 79 55 C 89 59 96 68 96 80 C 96 95 83 106 67 106 L 34 106 C 28 106 24 104 24 98 Z M 46 32 L 46 48 L 65 48 C 70 48 74 44 74 40 C 74 36 70 32 65 32 Z M 46 66 L 46 86 L 67 86 C 73 86 77 82 77 76 C 77 70 73 66 67 66 Z',
    fillRule: 'evenodd',
    eyes: { left: { cx: 50, cy: 32, r: 8.5 }, right: { cx: 70, cy: 32, r: 8.5 } },
    mouth: { cx: 62, cy: 76, rx: 12, ry: 8 },
    cheeks: { left: { cx: 38, cy: 40 }, right: { cx: 82, cy: 40 } },
    feet: [{ cx: 40, cy: 107 }, { cx: 78, cy: 107 }],
    hands: [{ cx: 16, cy: 58 }, { cx: 102, cy: 62 }],
    headCenter: { cx: 54, cy: 12 }
  },

  C: {
    // Letter C: large gaping crescent monster
    path: 'M 92 34 C 84 21 71 14 56 14 C 33 14 18 32 18 60 C 18 88 34 106 58 106 C 73 106 86 98 94 84 C 97 78 93 72 86 72 C 81 72 78 75 74 80 C 69 86 63 90 56 90 C 42 90 34 76 34 60 C 34 43 43 30 56 30 C 64 30 70 34 75 41 C 78 46 83 48 88 45 C 94 42 96 38 92 34 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 52, cy: 23, r: 8 }, right: { cx: 72, cy: 25, r: 8 } },
    mouth: { cx: 58, cy: 60, rx: 13, ry: 9 },
    cheeks: { left: { cx: 38, cy: 32 }, right: { cx: 84, cy: 33 } },
    feet: [{ cx: 40, cy: 107 }, { cx: 76, cy: 106 }],
    hands: [{ cx: 14, cy: 62 }, { cx: 94, cy: 70 }],
    headCenter: { cx: 60, cy: 14 }
  },

  D: {
    // Letter D with big curved tummy
    path: 'M 24 18 C 24 13 28 12 36 12 L 64 12 C 83 12 98 27 98 59 C 98 90 83 106 64 106 L 36 106 C 28 106 24 104 24 98 Z M 46 32 L 46 86 L 62 86 C 74 86 81 76 81 59 C 81 42 74 32 62 32 Z',
    fillRule: 'evenodd',
    eyes: { left: { cx: 50, cy: 34, r: 9 }, right: { cx: 72, cy: 34, r: 9 } },
    mouth: { cx: 62, cy: 68, rx: 12, ry: 8 },
    cheeks: { left: { cx: 38, cy: 42 }, right: { cx: 84, cy: 42 } },
    feet: [{ cx: 38, cy: 107 }, { cx: 76, cy: 107 }],
    hands: [{ cx: 16, cy: 60 }, { cx: 104, cy: 60 }],
    headCenter: { cx: 54, cy: 12 }
  },

  E: {
    // Letter E with 3 lively horizontal prongs
    path: 'M 24 18 C 24 13 28 12 34 12 L 88 12 C 94 12 98 16 98 22 C 98 28 94 32 88 32 L 46 32 L 46 48 L 80 48 C 86 48 90 52 90 58 C 90 64 86 68 80 68 L 46 68 L 46 86 L 88 86 C 94 86 98 90 98 96 C 98 102 94 106 88 106 L 34 106 C 28 106 24 104 24 98 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 48, cy: 26, r: 8.5 }, right: { cx: 72, cy: 26, r: 8.5 } },
    mouth: { cx: 58, cy: 58, rx: 12, ry: 7 },
    cheeks: { left: { cx: 36, cy: 34 }, right: { cx: 84, cy: 34 } },
    feet: [{ cx: 36, cy: 107 }, { cx: 74, cy: 107 }],
    hands: [{ cx: 16, cy: 58 }, { cx: 94, cy: 58 }],
    headCenter: { cx: 54, cy: 12 }
  },

  F: {
    // Letter F with 2 top arms
    path: 'M 24 18 C 24 13 28 12 34 12 L 90 12 C 96 12 100 16 100 22 C 100 28 96 32 90 32 L 46 32 L 46 48 L 82 48 C 88 48 92 52 92 58 C 92 64 88 68 82 68 L 46 68 L 46 98 C 46 104 42 106 36 106 C 28 106 24 104 24 98 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 46, cy: 24, r: 8.5 }, right: { cx: 72, cy: 24, r: 8.5 } },
    mouth: { cx: 56, cy: 58, rx: 11, ry: 7 },
    cheeks: { left: { cx: 34, cy: 32 }, right: { cx: 84, cy: 32 } },
    feet: [{ cx: 36, cy: 107 }],
    hands: [{ cx: 16, cy: 58 }, { cx: 90, cy: 58 }],
    headCenter: { cx: 54, cy: 12 }
  },

  G: {
    // Letter G with spiral mouth & shelf
    path: 'M 92 34 C 84 21 71 14 56 14 C 33 14 18 32 18 60 C 18 88 34 106 58 106 C 76 106 90 95 94 77 C 95 72 91 66 84 66 L 58 66 C 52 66 48 70 48 76 C 48 82 52 86 58 86 L 76 86 C 73 90 66 92 58 92 C 43 92 34 78 34 60 C 34 43 43 30 56 30 C 64 30 70 34 75 41 C 78 46 83 48 88 45 C 94 42 96 38 92 34 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 50, cy: 26, r: 8.5 }, right: { cx: 72, cy: 26, r: 8.5 } },
    mouth: { cx: 56, cy: 56, rx: 11, ry: 7 },
    cheeks: { left: { cx: 36, cy: 34 }, right: { cx: 84, cy: 34 } },
    feet: [{ cx: 38, cy: 107 }, { cx: 76, cy: 107 }],
    hands: [{ cx: 14, cy: 62 }, { cx: 98, cy: 66 }],
    headCenter: { cx: 58, cy: 14 }
  },

  H: {
    // Letter H: twin pillars with smiling connector
    path: 'M 22 18 C 22 13 26 12 32 12 C 38 12 42 14 42 20 L 42 48 L 78 48 L 78 20 C 78 14 82 12 88 12 C 94 12 98 14 98 20 L 98 100 C 98 105 94 106 88 106 C 82 106 78 105 78 98 L 78 68 L 42 68 L 42 98 C 42 105 38 106 32 106 C 26 106 22 105 22 98 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 32, cy: 34, r: 8.5 }, right: { cx: 88, cy: 34, r: 8.5 } },
    mouth: { cx: 60, cy: 58, rx: 13, ry: 8 },
    cheeks: { left: { cx: 24, cy: 42 }, right: { cx: 96, cy: 42 } },
    feet: [{ cx: 32, cy: 107 }, { cx: 88, cy: 107 }],
    hands: [{ cx: 14, cy: 58 }, { cx: 106, cy: 58 }],
    headCenter: { cx: 60, cy: 40 }
  },

  I: {
    // Letter I: sleek Cyclops column with serif tops/bottoms
    path: 'M 32 14 C 32 12 36 12 42 12 L 78 12 C 84 12 88 12 88 18 C 88 24 84 26 76 26 L 70 26 L 70 88 L 76 88 C 84 88 88 90 88 96 C 88 102 84 104 78 104 L 42 104 C 36 104 32 102 32 96 C 32 90 36 88 44 88 L 50 88 L 50 26 L 44 26 C 36 26 32 24 32 18 Z',
    fillRule: 'nonzero',
    cyclopsEye: { cx: 60, cy: 42, r: 16 },
    mouth: { cx: 60, cy: 72, rx: 10, ry: 7 },
    cheeks: { left: { cx: 44, cy: 60 }, right: { cx: 76, cy: 60 } },
    feet: [{ cx: 44, cy: 106 }, { cx: 76, cy: 106 }],
    hands: [{ cx: 28, cy: 60 }, { cx: 92, cy: 60 }],
    headCenter: { cx: 60, cy: 12 }
  },

  J: {
    // Letter J: hook-bottom umbrella creature
    path: 'M 60 14 C 60 12 64 12 70 12 L 92 12 C 97 12 100 14 100 20 C 100 26 96 28 88 28 L 82 28 L 82 76 C 82 94 69 106 50 106 C 32 106 20 94 20 80 C 20 74 24 70 30 70 C 36 70 40 74 40 80 C 40 86 46 90 52 90 C 59 90 64 84 64 74 L 64 28 L 60 28 C 55 28 52 24 52 18 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 62, cy: 34, r: 8 }, right: { cx: 84, cy: 34, r: 8 } },
    mouth: { cx: 73, cy: 58, rx: 10, ry: 7 },
    cheeks: { left: { cx: 50, cy: 40 }, right: { cx: 94, cy: 40 } },
    feet: [{ cx: 46, cy: 106 }],
    hands: [{ cx: 22, cy: 54 }, { cx: 102, cy: 54 }],
    headCenter: { cx: 76, cy: 12 }
  },

  K: {
    // Letter K with kick arms and legs
    path: 'M 22 18 C 22 13 26 12 32 12 C 38 12 42 14 42 20 L 42 50 L 68 24 C 73 19 80 18 86 22 C 92 27 92 35 86 41 L 62 62 L 88 88 C 94 94 94 102 88 107 C 82 110 74 108 68 102 L 42 74 L 42 98 C 42 105 38 106 32 106 C 26 106 22 105 22 98 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 34, cy: 32, r: 8.5 }, right: { cx: 56, cy: 32, r: 8.5 } },
    mouth: { cx: 48, cy: 62, rx: 11, ry: 7 },
    cheeks: { left: { cx: 24, cy: 40 }, right: { cx: 68, cy: 40 } },
    feet: [{ cx: 32, cy: 107 }, { cx: 86, cy: 107 }],
    hands: [{ cx: 14, cy: 56 }, { cx: 96, cy: 56 }],
    headCenter: { cx: 32, cy: 12 }
  },

  L: {
    // Letter L: boot / stepping footer
    path: 'M 24 18 C 24 13 28 12 34 12 C 40 12 44 14 44 20 L 44 86 L 90 86 C 96 86 100 90 100 96 C 100 102 96 106 90 106 L 34 106 C 28 106 24 104 24 98 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 34, cy: 34, r: 8.5 }, right: { cx: 56, cy: 34, r: 8.5 } },
    mouth: { cx: 44, cy: 60, rx: 11, ry: 7 },
    cheeks: { left: { cx: 24, cy: 42 }, right: { cx: 66, cy: 42 } },
    feet: [{ cx: 34, cy: 107 }, { cx: 92, cy: 107 }],
    hands: [{ cx: 14, cy: 58 }, { cx: 70, cy: 74 }],
    headCenter: { cx: 34, cy: 12 }
  },

  M: {
    // Letter M: double cat-ear peaks with dip
    path: 'M 20 18 C 20 13 24 12 30 12 C 36 12 40 15 44 24 L 60 58 L 76 24 C 80 15 84 12 90 12 C 96 12 100 13 100 18 L 100 98 C 100 105 96 106 90 106 C 84 106 80 105 80 98 L 80 44 L 67 72 C 64 78 56 78 53 72 L 40 44 L 40 98 C 40 105 36 106 30 106 C 24 106 20 105 20 98 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 36, cy: 38, r: 8.5 }, right: { cx: 84, cy: 38, r: 8.5 } },
    mouth: { cx: 60, cy: 78, rx: 12, ry: 8 },
    cheeks: { left: { cx: 24, cy: 46 }, right: { cx: 96, cy: 46 } },
    feet: [{ cx: 30, cy: 107 }, { cx: 90, cy: 107 }],
    hands: [{ cx: 12, cy: 60 }, { cx: 108, cy: 60 }],
    headCenter: { cx: 60, cy: 30 }
  },

  N: {
    // Letter N: two uprights with diagonal bridge
    path: 'M 20 18 C 20 13 24 12 30 12 C 36 12 40 15 44 24 L 78 78 L 78 20 C 78 14 82 12 88 12 C 94 12 98 14 98 20 L 98 98 C 98 105 94 106 88 106 C 82 106 78 103 74 94 L 40 40 L 40 98 C 40 105 36 106 30 106 C 24 106 20 105 20 98 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 34, cy: 34, r: 8.5 }, right: { cx: 84, cy: 34, r: 8.5 } },
    mouth: { cx: 60, cy: 68, rx: 12, ry: 7.5 },
    cheeks: { left: { cx: 24, cy: 42 }, right: { cx: 94, cy: 42 } },
    feet: [{ cx: 30, cy: 107 }, { cx: 88, cy: 107 }],
    hands: [{ cx: 12, cy: 58 }, { cx: 106, cy: 58 }],
    headCenter: { cx: 60, cy: 20 }
  },

  O: {
    // Letter O: big round donut monster
    path: 'M 60 14 C 84 14 102 32 102 60 C 102 88 84 106 60 106 C 36 106 18 88 18 60 C 18 32 36 14 60 14 Z M 60 34 C 47 34 38 45 38 60 C 38 75 47 86 60 86 C 73 86 82 75 82 60 C 82 45 73 34 60 34 Z',
    fillRule: 'evenodd',
    eyes: { left: { cx: 46, cy: 32, r: 8.5 }, right: { cx: 74, cy: 32, r: 8.5 } },
    mouth: { cx: 60, cy: 62, rx: 13, ry: 9 },
    cheeks: { left: { cx: 32, cy: 42 }, right: { cx: 88, cy: 42 } },
    feet: [{ cx: 42, cy: 107 }, { cx: 78, cy: 107 }],
    hands: [{ cx: 14, cy: 60 }, { cx: 106, cy: 60 }],
    headCenter: { cx: 60, cy: 14 }
  },

  P: {
    // Letter P: big round upper head on stalk
    path: 'M 24 18 C 24 13 28 12 36 12 L 66 12 C 84 12 96 23 96 42 C 96 61 84 72 66 72 L 46 72 L 46 98 C 46 104 42 106 36 106 C 28 106 24 104 24 98 Z M 46 32 L 46 54 L 64 54 C 72 54 77 49 77 42 C 77 35 72 32 64 32 Z',
    fillRule: 'evenodd',
    eyes: { left: { cx: 50, cy: 34, r: 8.5 }, right: { cx: 74, cy: 34, r: 8.5 } },
    mouth: { cx: 62, cy: 52, rx: 11, ry: 7 },
    cheeks: { left: { cx: 36, cy: 42 }, right: { cx: 86, cy: 42 } },
    feet: [{ cx: 36, cy: 107 }],
    hands: [{ cx: 16, cy: 60 }, { cx: 100, cy: 44 }],
    headCenter: { cx: 54, cy: 12 }
  },

  Q: {
    // Letter Q: round body with cute curved monster tail
    path: 'M 60 14 C 84 14 100 32 100 60 C 100 70 97 80 91 88 L 98 95 C 103 100 98 106 92 106 C 88 106 84 103 80 99 L 75 94 C 70 97 65 98 60 98 C 36 98 20 82 20 60 C 20 32 36 14 60 14 Z M 60 34 C 47 34 38 45 38 60 C 38 75 47 84 60 84 C 73 84 82 75 82 60 C 82 45 73 34 60 34 Z',
    fillRule: 'evenodd',
    eyes: { left: { cx: 46, cy: 34, r: 8.5 }, right: { cx: 74, cy: 34, r: 8.5 } },
    mouth: { cx: 60, cy: 62, rx: 13, ry: 9 },
    cheeks: { left: { cx: 32, cy: 44 }, right: { cx: 88, cy: 44 } },
    feet: [{ cx: 42, cy: 102 }, { cx: 90, cy: 104 }],
    hands: [{ cx: 14, cy: 58 }, { cx: 104, cy: 58 }],
    headCenter: { cx: 60, cy: 14 }
  },

  R: {
    // Letter R: top head loop and kicking bottom leg
    path: 'M 24 18 C 24 13 28 12 36 12 L 66 12 C 84 12 96 23 96 42 C 96 56 86 66 73 70 L 89 96 C 93 102 89 106 82 106 C 77 106 73 103 69 96 L 56 74 L 46 74 L 46 98 C 46 104 42 106 36 106 C 28 106 24 104 24 98 Z M 46 32 L 46 54 L 64 54 C 72 54 76 49 76 42 C 76 35 72 32 64 32 Z',
    fillRule: 'evenodd',
    eyes: { left: { cx: 50, cy: 34, r: 8.5 }, right: { cx: 74, cy: 34, r: 8.5 } },
    mouth: { cx: 62, cy: 52, rx: 11, ry: 7 },
    cheeks: { left: { cx: 36, cy: 42 }, right: { cx: 86, cy: 42 } },
    feet: [{ cx: 36, cy: 107 }, { cx: 86, cy: 107 }],
    hands: [{ cx: 16, cy: 58 }, { cx: 98, cy: 46 }],
    headCenter: { cx: 54, cy: 12 }
  },

  S: {
    // Letter S: curvy serpentine dragon shape
    path: 'M 88 33 C 82 20 70 14 55 14 C 36 14 26 26 26 40 C 26 58 46 64 62 68 C 76 72 82 76 82 84 C 82 92 73 96 61 96 C 46 96 36 88 30 76 C 27 70 21 68 16 71 C 10 75 10 82 14 88 C 23 100 39 106 60 106 C 82 106 98 94 98 78 C 98 58 78 52 62 48 C 48 44 42 40 42 34 C 42 27 49 24 57 24 C 69 24 76 29 80 37 C 83 43 90 44 94 40 C 98 36 94 30 88 33 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 48, cy: 26, r: 8 }, right: { cx: 70, cy: 26, r: 8 } },
    mouth: { cx: 60, cy: 48, rx: 11, ry: 7 },
    cheeks: { left: { cx: 36, cy: 34 }, right: { cx: 82, cy: 34 } },
    feet: [{ cx: 30, cy: 102 }, { cx: 78, cy: 104 }],
    hands: [{ cx: 16, cy: 50 }, { cx: 96, cy: 66 }],
    headCenter: { cx: 60, cy: 14 }
  },

  T: {
    // Letter T: broad hammerhead roof and central pillar
    path: 'M 18 18 C 18 13 22 12 28 12 L 92 12 C 98 12 102 13 102 18 C 102 24 98 26 90 26 L 70 26 L 70 98 C 70 104 66 106 60 106 C 54 106 50 104 50 98 L 50 26 L 30 26 C 22 26 18 24 18 18 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 42, cy: 26, r: 8.5 }, right: { cx: 78, cy: 26, r: 8.5 } },
    mouth: { cx: 60, cy: 58, rx: 12, ry: 8 },
    cheeks: { left: { cx: 28, cy: 34 }, right: { cx: 92, cy: 34 } },
    feet: [{ cx: 60, cy: 107 }],
    hands: [{ cx: 14, cy: 22 }, { cx: 106, cy: 22 }],
    headCenter: { cx: 60, cy: 12 }
  },

  U: {
    // Letter U: smiling cradle / horseshoe monster
    path: 'M 22 18 C 22 13 26 12 32 12 C 38 12 42 14 42 20 L 42 66 C 42 81 50 90 60 90 C 70 90 78 81 78 66 L 78 20 C 78 14 82 12 88 12 C 94 12 98 13 98 18 L 98 66 C 98 90 82 106 60 106 C 38 106 22 90 22 66 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 32, cy: 36, r: 8.5 }, right: { cx: 88, cy: 36, r: 8.5 } },
    mouth: { cx: 60, cy: 78, rx: 13, ry: 8 },
    cheeks: { left: { cx: 24, cy: 46 }, right: { cx: 96, cy: 46 } },
    feet: [{ cx: 42, cy: 107 }, { cx: 78, cy: 107 }],
    hands: [{ cx: 14, cy: 52 }, { cx: 106, cy: 52 }],
    headCenter: { cx: 60, cy: 38 }
  },

  V: {
    // Letter V: winged funnel shape
    path: 'M 18 18 C 18 13 23 12 28 12 C 35 12 40 16 43 25 L 60 76 L 77 25 C 80 16 85 12 92 12 C 97 12 102 13 102 18 C 102 22 99 26 95 33 L 72 94 C 68 102 62 106 60 106 C 58 106 52 102 48 94 L 25 33 C 21 26 18 22 18 18 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 36, cy: 32, r: 8.5 }, right: { cx: 84, cy: 32, r: 8.5 } },
    mouth: { cx: 60, cy: 68, rx: 11, ry: 7 },
    cheeks: { left: { cx: 26, cy: 40 }, right: { cx: 94, cy: 40 } },
    feet: [{ cx: 60, cy: 107 }],
    hands: [{ cx: 14, cy: 48 }, { cx: 106, cy: 48 }],
    headCenter: { cx: 60, cy: 34 }
  },

  W: {
    // Letter W: triple-bottom bouncy wave
    path: 'M 18 18 C 18 13 22 12 27 12 C 34 12 38 16 41 26 L 50 68 L 57 36 C 59 28 61 24 65 24 C 69 24 71 28 73 36 L 80 68 L 89 26 C 92 16 96 12 103 12 C 108 12 112 13 112 18 C 112 21 110 26 107 33 L 94 92 C 91 100 86 104 80 104 C 74 104 70 100 67 90 L 60 58 L 53 90 C 50 100 46 104 40 104 C 34 104 29 100 26 92 L 13 33 C 10 26 8 21 8 18 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 40, cy: 44, r: 8.5 }, right: { cx: 80, cy: 44, r: 8.5 } },
    mouth: { cx: 60, cy: 74, rx: 12, ry: 8 },
    cheeks: { left: { cx: 26, cy: 52 }, right: { cx: 94, cy: 52 } },
    feet: [{ cx: 38, cy: 106 }, { cx: 82, cy: 106 }],
    hands: [{ cx: 8, cy: 56 }, { cx: 112, cy: 56 }],
    headCenter: { cx: 60, cy: 22 }
  },

  X: {
    // Letter X: criss-cross star creature
    path: 'M 22 20 C 22 14 27 12 34 12 C 40 12 45 15 49 22 L 60 42 L 71 22 C 75 15 80 12 86 12 C 93 12 98 14 98 20 C 98 24 95 29 90 37 L 76 58 L 92 82 C 96 89 98 94 98 98 C 98 104 93 106 86 106 C 80 106 75 103 71 96 L 60 76 L 49 96 C 45 103 40 106 34 106 C 27 106 22 104 22 98 C 22 94 24 89 28 82 L 44 58 L 30 37 C 25 29 22 24 22 20 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 44, cy: 40, r: 8.5 }, right: { cx: 76, cy: 40, r: 8.5 } },
    mouth: { cx: 60, cy: 62, rx: 11, ry: 7 },
    cheeks: { left: { cx: 30, cy: 48 }, right: { cx: 90, cy: 48 } },
    feet: [{ cx: 34, cy: 107 }, { cx: 86, cy: 107 }],
    hands: [{ cx: 16, cy: 58 }, { cx: 104, cy: 58 }],
    headCenter: { cx: 60, cy: 18 }
  },

  Y: {
    // Letter Y: fork antler creature
    path: 'M 20 18 C 20 13 25 12 30 12 C 37 12 42 16 45 25 L 60 54 L 75 25 C 78 16 83 12 90 12 C 95 12 100 13 100 18 C 100 22 97 27 92 35 L 70 66 L 70 98 C 70 104 66 106 60 106 C 54 106 50 104 50 98 L 50 66 L 28 35 C 23 27 20 22 20 18 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 38, cy: 34, r: 8.5 }, right: { cx: 82, cy: 34, r: 8.5 } },
    mouth: { cx: 60, cy: 62, rx: 11, ry: 7 },
    cheeks: { left: { cx: 28, cy: 42 }, right: { cx: 92, cy: 42 } },
    feet: [{ cx: 60, cy: 107 }],
    hands: [{ cx: 14, cy: 52 }, { cx: 106, cy: 52 }],
    headCenter: { cx: 60, cy: 26 }
  },

  Z: {
    // Letter Z: lightning bolt speedster
    path: 'M 24 18 C 24 13 28 12 36 12 L 86 12 C 93 12 96 14 96 20 C 96 24 93 28 86 35 L 48 84 L 86 84 C 92 84 96 88 96 94 C 96 100 92 104 86 104 L 32 104 C 25 104 22 102 22 96 C 22 92 25 86 32 78 L 70 30 L 36 30 C 29 30 24 26 24 20 Z',
    fillRule: 'nonzero',
    eyes: { left: { cx: 46, cy: 26, r: 8.5 }, right: { cx: 74, cy: 26, r: 8.5 } },
    mouth: { cx: 58, cy: 58, rx: 11, ry: 7 },
    cheeks: { left: { cx: 34, cy: 34 }, right: { cx: 86, cy: 34 } },
    feet: [{ cx: 34, cy: 106 }, { cx: 86, cy: 106 }],
    hands: [{ cx: 16, cy: 58 }, { cx: 102, cy: 58 }],
    headCenter: { cx: 60, cy: 12 }
  }
};

/**
 * Creates an expressive SVG string for an Alphabet Monster character
 * @param {string} letter - Single uppercase letter (A-Z)
 * @param {Object} options - { state: 'idle'|'dragging'|'snapped'|'celebrating', eyeX: 0, eyeY: 0 }
 */
export function createMonsterSVG(letter, options = {}) {
  const char = (letter || 'A').toUpperCase();
  const profile = MONSTER_PROFILES[char] || MONSTER_PROFILES.A;
  const spec = LETTER_SPECS[char] || LETTER_SPECS.A;

  const state = options.state || 'idle';
  const eyeShiftX = options.eyeX !== undefined ? options.eyeX * 3.5 : 0;
  const eyeShiftY = options.eyeY !== undefined ? options.eyeY * 3 : 0;

  const isDragging = state === 'dragging';
  const isSnapped = state === 'snapped';
  const isCelebrating = state === 'celebrating';

  // Eyes markup
  let eyesMarkup = '';
  if (profile.cyclops && spec.cyclopsEye) {
    const eye = spec.cyclopsEye;
    if (isSnapped || isCelebrating) {
      eyesMarkup = `
        <path d="M ${eye.cx - 16} ${eye.cy + 3} Q ${eye.cx} ${eye.cy - 12} ${eye.cx + 16} ${eye.cy + 3}" 
              stroke="#2D3142" stroke-width="4.5" fill="none" stroke-linecap="round" />
        <circle cx="${eye.cx - 14}" cy="${eye.cy + 10}" r="4.5" fill="#FF85A1" opacity="0.75" />
        <circle cx="${eye.cx + 14}" cy="${eye.cy + 10}" r="4.5" fill="#FF85A1" opacity="0.75" />
      `;
    } else {
      const pupilR = isDragging ? 7.5 : 6;
      eyesMarkup = `
        <circle cx="${eye.cx}" cy="${eye.cy}" r="${eye.r}" fill="#FFFFFF" stroke="#2D3142" stroke-width="3.5" />
        <circle cx="${eye.cx + eyeShiftX}" cy="${eye.cy + eyeShiftY}" r="${pupilR}" fill="#2D3142" class="monster-pupil" />
        <circle cx="${eye.cx + 2 + eyeShiftX}" cy="${eye.cy - 2 + eyeShiftY}" r="2.5" fill="#FFFFFF" />
        <circle cx="${eye.cx - 3 + eyeShiftX}" cy="${eye.cy + 3 + eyeShiftY}" r="1.2" fill="#FFFFFF" />
      `;
    }
  } else if (spec.eyes) {
    const { left, right } = spec.eyes;
    if (isSnapped || isCelebrating) {
      // Joyous arched closed eyes
      eyesMarkup = `
        <path d="M ${left.cx - left.r} ${left.cy + 2} Q ${left.cx} ${left.cy - left.r} ${left.cx + left.r} ${left.cy + 2}" 
              stroke="#2D3142" stroke-width="3.8" fill="none" stroke-linecap="round" />
        <path d="M ${right.cx - right.r} ${right.cy + 2} Q ${right.cx} ${right.cy - right.r} ${right.cx + right.r} ${right.cy + 2}" 
              stroke="#2D3142" stroke-width="3.8" fill="none" stroke-linecap="round" />
        <!-- Rosy Cheek Blushes -->
        <circle cx="${spec.cheeks.left.cx}" cy="${spec.cheeks.left.cy}" r="5" fill="#FF85A1" opacity="0.8" />
        <circle cx="${spec.cheeks.right.cx}" cy="${spec.cheeks.right.cy}" r="5" fill="#FF85A1" opacity="0.8" />
      `;
    } else {
      const pupilR = isDragging ? 4.5 : 3.5;
      eyesMarkup = `
        <!-- Left Eye -->
        <circle cx="${left.cx}" cy="${left.cy}" r="${left.r}" fill="#FFFFFF" stroke="#2D3142" stroke-width="3" />
        <circle cx="${left.cx + eyeShiftX}" cy="${left.cy + eyeShiftY}" r="${pupilR}" fill="#2D3142" class="monster-pupil" />
        <circle cx="${left.cx + 1.8 + eyeShiftX}" cy="${left.cy - 2 + eyeShiftY}" r="1.6" fill="#FFFFFF" />

        <!-- Right Eye -->
        <circle cx="${right.cx}" cy="${right.cy}" r="${right.r}" fill="#FFFFFF" stroke="#2D3142" stroke-width="3" />
        <circle cx="${right.cx + eyeShiftX}" cy="${right.cy + eyeShiftY}" r="${pupilR}" fill="#2D3142" class="monster-pupil" />
        <circle cx="${right.cx + 1.8 + eyeShiftX}" cy="${right.cy - 2 + eyeShiftY}" r="1.6" fill="#FFFFFF" />

        <!-- Rosy cheeks for cute idle look -->
        <circle cx="${spec.cheeks.left.cx}" cy="${spec.cheeks.left.cy}" r="4" fill="#FF85A1" opacity="0.55" />
        <circle cx="${spec.cheeks.right.cx}" cy="${spec.cheeks.right.cy}" r="4" fill="#FF85A1" opacity="0.55" />
      `;
    }
  }

  // Mouth markup based on state
  const m = spec.mouth || { cx: 60, cy: 68, rx: 12, ry: 8 };
  let mouthMarkup = '';
  if (isDragging) {
    // Singing / chanting phonics mouth (animated oval with vibrating tongue)
    mouthMarkup = `
      <g class="monster-mouth-chanting" style="transform-origin: ${m.cx}px ${m.cy}px;">
        <ellipse cx="${m.cx}" cy="${m.cy}" rx="${m.rx + 2}" ry="${m.ry + 3}" fill="#800E13" stroke="#2D3142" stroke-width="2.5" />
        <path d="M ${m.cx - 6} ${m.cy + 3} Q ${m.cx} ${m.cy - 2} ${m.cx + 6} ${m.cy + 3}" fill="#FF477E" />
        ${profile.fangs ? `
          <polygon points="${m.cx - 5},${m.cy - m.ry + 1} ${m.cx - 2},${m.cy - m.ry + 6} ${m.cx + 1},${m.cy - m.ry + 1}" fill="#FFFFFF" />
          <polygon points="${m.cx + 1},${m.cy - m.ry + 1} ${m.cx + 4},${m.cy - m.ry + 6} ${m.cx + 7},${m.cy - m.ry + 1}" fill="#FFFFFF" />
        ` : ''}
      </g>
    `;
  } else if (isSnapped || isCelebrating) {
    // Big joyous open grin
    mouthMarkup = `
      <path d="M ${m.cx - m.rx} ${m.cy - 2} Q ${m.cx} ${m.cy + m.ry + 6} ${m.cx + m.rx} ${m.cy - 2}" 
            stroke="#2D3142" stroke-width="3" fill="#C9184A" stroke-linecap="round" />
      <path d="M ${m.cx - 5} ${m.cy + 3} Q ${m.cx} ${m.cy + 6} ${m.cx + 5} ${m.cy + 3}" fill="#FF758F" />
      ${profile.fangs ? `<polygon points="${m.cx - 4},${m.cy - 2} ${m.cx},${m.cy + 3} ${m.cx + 4},${m.cy - 2}" fill="#FFFFFF" />` : ''}
    `;
  } else {
    // Idle cute smile
    mouthMarkup = `
      <path d="M ${m.cx - m.rx * 0.8} ${m.cy - 1} Q ${m.cx} ${m.cy + m.ry * 0.9} ${m.cx + m.rx * 0.8} ${m.cy - 1}" 
            stroke="#2D3142" stroke-width="3" fill="none" stroke-linecap="round" />
      ${profile.fangs ? `<polygon points="${m.cx - 3},${m.cy} ${m.cx},${m.cy + 4.5} ${m.cx + 3},${m.cy}" fill="#FFFFFF" />` : ''}
      ${profile.tongue ? `<ellipse cx="${m.cx}" cy="${m.cy + 3}" rx="4" ry="3" fill="#FF70A6" />` : ''}
    `;
  }

  // Accessories markup tailored to each character
  let accessoriesMarkup = '';
  const hc = spec.headCenter || { cx: 60, cy: 14 };

  switch (profile.features) {
    case 'horns':
      accessoriesMarkup = `
        <path d="M ${hc.cx - 18} ${hc.cy + 4} Q ${hc.cx - 28} ${hc.cy - 12} ${hc.cx - 10} ${hc.cy - 8} Z" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2.5" />
        <path d="M ${hc.cx + 18} ${hc.cy + 4} Q ${hc.cx + 28} ${hc.cy - 12} ${hc.cx + 10} ${hc.cy - 8} Z" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2.5" />
      `;
      break;
    case 'antenna':
      accessoriesMarkup = `
        <path d="M ${hc.cx - 8} ${hc.cy + 2} Q ${hc.cx - 16} ${hc.cy - 10} ${hc.cx - 12} ${hc.cy - 14}" stroke="#2D3142" stroke-width="2.8" fill="none" stroke-linecap="round" />
        <circle cx="${hc.cx - 12}" cy="${hc.cy - 14}" r="4.5" fill="${profile.secondary}" stroke="#2D3142" stroke-width="1.8" />
        <path d="M ${hc.cx + 8} ${hc.cy + 2} Q ${hc.cx + 16} ${hc.cy - 10} ${hc.cx + 12} ${hc.cy - 14}" stroke="#2D3142" stroke-width="2.8" fill="none" stroke-linecap="round" />
        <circle cx="${hc.cx + 12}" cy="${hc.cy - 14}" r="4.5" fill="${profile.secondary}" stroke="#2D3142" stroke-width="1.8" />
      `;
      break;
    case 'crown':
      accessoriesMarkup = `
        <polygon points="${hc.cx - 16},${hc.cy + 3} ${hc.cx - 18},${hc.cy - 10} ${hc.cx - 8},${hc.cy - 4} ${hc.cx},${hc.cy - 14} ${hc.cx + 8},${hc.cy - 4} ${hc.cx + 18},${hc.cy - 10} ${hc.cx + 16},${hc.cy + 3}" 
                 fill="${profile.secondary}" stroke="#2D3142" stroke-width="2.2" stroke-linejoin="round" />
        <circle cx="${hc.cx}" cy="${hc.cy - 14}" r="2" fill="#FF5964" />
      `;
      break;
    case 'cat-ears':
      accessoriesMarkup = `
        <polygon points="${hc.cx - 32},${hc.cy + 8} ${hc.cx - 24},${hc.cy - 10} ${hc.cx - 12},${hc.cy + 6}" fill="${profile.bg}" stroke="#2D3142" stroke-width="2.5" />
        <polygon points="${hc.cx - 28},${hc.cy + 4} ${hc.cx - 24},${hc.cy - 5} ${hc.cx - 16},${hc.cy + 4}" fill="${profile.secondary}" />
        <polygon points="${hc.cx + 32},${hc.cy + 8} ${hc.cx + 24},${hc.cy - 10} ${hc.cx + 12},${hc.cy + 6}" fill="${profile.bg}" stroke="#2D3142" stroke-width="2.5" />
        <polygon points="${hc.cx + 28},${hc.cy + 4} ${hc.cx + 24},${hc.cy - 5} ${hc.cx + 16},${hc.cy + 4}" fill="${profile.secondary}" />
      `;
      break;
    case 'spikes':
      accessoriesMarkup = `
        <polygon points="${hc.cx - 12},${hc.cy + 2} ${hc.cx - 8},${hc.cy - 8} ${hc.cx - 4},${hc.cy + 2}" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2" />
        <polygon points="${hc.cx - 4},${hc.cy + 2} ${hc.cx},${hc.cy - 10} ${hc.cx + 4},${hc.cy + 2}" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2" />
        <polygon points="${hc.cx + 4},${hc.cy + 2} ${hc.cx + 8},${hc.cy - 8} ${hc.cx + 12},${hc.cy + 2}" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2" />
      `;
      break;
    case 'star-topper':
      accessoriesMarkup = `
        <line x1="${hc.cx}" y1="${hc.cy + 2}" x2="${hc.cx}" y2="${hc.cy - 9}" stroke="#2D3142" stroke-width="2.5" stroke-linecap="round" />
        <polygon points="${hc.cx},${hc.cy - 17} ${hc.cx + 2},${hc.cy - 13} ${hc.cx + 6},${hc.cy - 13} ${hc.cx + 3},${hc.cy - 10} ${hc.cx + 5},${hc.cy - 6} ${hc.cx},${hc.cy - 8} ${hc.cx - 5},${hc.cy - 6} ${hc.cx - 3},${hc.cy - 10} ${hc.cx - 6},${hc.cy - 13} ${hc.cx - 2},${hc.cy - 13}" 
                 fill="#FFD166" stroke="#2D3142" stroke-width="1.5" />
      `;
      break;
    case 'wings':
      accessoriesMarkup = `
        <path d="M 22 45 Q 6 36 10 55 Q 18 58 22 52 Z" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2" />
        <path d="M 98 45 Q 114 36 110 55 Q 102 58 98 52 Z" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2" />
      `;
      break;
    case 'round-antenna':
      accessoriesMarkup = `
        <path d="M ${hc.cx} ${hc.cy} L ${hc.cx} ${hc.cy - 10}" stroke="#2D3142" stroke-width="2.5" />
        <circle cx="${hc.cx}" cy="${hc.cy - 12}" r="5" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2" />
      `;
      break;
    case 'butterfly':
      accessoriesMarkup = `
        <path d="M ${hc.cx - 10} ${hc.cy} Q ${hc.cx - 22} ${hc.cy - 12} ${hc.cx - 16} ${hc.cy - 16}" stroke="#2D3142" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <circle cx="${hc.cx - 16}" cy="${hc.cy - 16}" r="3.5" fill="${profile.secondary}" />
        <path d="M ${hc.cx + 10} ${hc.cy} Q ${hc.cx + 22} ${hc.cy - 12} ${hc.cx + 16} ${hc.cy - 16}" stroke="#2D3142" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <circle cx="${hc.cx + 16}" cy="${hc.cy - 16}" r="3.5" fill="${profile.secondary}" />
      `;
      break;
    case 'propeller':
      accessoriesMarkup = `
        <line x1="${hc.cx}" y1="${hc.cy}" x2="${hc.cx}" y2="${hc.cy - 8}" stroke="#2D3142" stroke-width="2.5" />
        <ellipse cx="${hc.cx - 8}" cy="${hc.cy - 8}" rx="8" ry="3" fill="${profile.secondary}" stroke="#2D3142" stroke-width="1.5" />
        <ellipse cx="${hc.cx + 8}" cy="${hc.cy - 8}" rx="8" ry="3" fill="${profile.secondary}" stroke="#2D3142" stroke-width="1.5" />
        <circle cx="${hc.cx}" cy="${hc.cy - 8}" r="2.5" fill="#2D3142" />
      `;
      break;
    case 'tail':
      accessoriesMarkup = `
        <polygon points="${hc.cx - 12},${hc.cy + 3} ${hc.cx - 14},${hc.cy - 8} ${hc.cx - 6},${hc.cy - 4} ${hc.cx},${hc.cy - 12} ${hc.cx + 6},${hc.cy - 4} ${hc.cx + 14},${hc.cy - 8} ${hc.cx + 12},${hc.cy + 3}" 
                 fill="${profile.secondary}" stroke="#2D3142" stroke-width="2" stroke-linejoin="round" />
      `;
      break;
    default:
      accessoriesMarkup = `
        <circle cx="${hc.cx - 12}" cy="${hc.cy - 3}" r="3.5" fill="${profile.secondary}" opacity="0.9" />
        <circle cx="${hc.cx + 12}" cy="${hc.cy - 3}" r="3.5" fill="${profile.secondary}" opacity="0.9" />
      `;
      break;
  }

  // Feet / Shoes markup
  let feetMarkup = '';
  if (spec.feet && spec.feet.length > 0) {
    feetMarkup = spec.feet.map(foot => `
      <ellipse cx="${foot.cx}" cy="${foot.cy}" rx="8" ry="4.5" fill="${profile.secondary}" stroke="#2D3142" stroke-width="2.8" />
    `).join('');
  }

  // Little Monster Hands / Paws
  let handsMarkup = '';
  if (spec.hands && spec.hands.length > 0) {
    handsMarkup = spec.hands.map((hand, idx) => `
      <circle cx="${hand.cx}" cy="${hand.cy}" r="5.5" fill="${profile.bg}" stroke="#2D3142" stroke-width="2.5" class="monster-paw ${idx === 0 ? 'paw-left' : 'paw-right'}" />
    `).join('');
  }

  // Texture Spots
  let spotsMarkup = '';
  if (profile.spots) {
    spotsMarkup = `
      <circle cx="28" cy="74" r="4.5" fill="${profile.secondary}" opacity="0.55" />
      <circle cx="36" cy="84" r="3" fill="${profile.secondary}" opacity="0.55" />
      <circle cx="92" cy="74" r="4.5" fill="${profile.secondary}" opacity="0.55" />
    `;
  }

  // Celebrating star sparkles
  let celebrationStars = '';
  if (isCelebrating) {
    celebrationStars = `
      <polygon points="18,18 20,23 25,23 21,26 23,31 18,28 13,31 15,26 11,23 16,23" fill="#FFD166" class="star-pop" />
      <polygon points="102,18 104,23 109,23 105,26 107,31 102,28 97,31 99,26 95,23 100,23" fill="#FFD166" class="star-pop" />
    `;
  }

  return `
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="monster-svg monster-${char} state-${state}">
      <defs>
        <radialGradient id="grad-${char}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35" />
          <stop offset="60%" stop-color="${profile.bg}" />
          <stop offset="100%" stop-color="${profile.bg}" filter="brightness(0.85)" />
        </radialGradient>
        <filter id="monster-shadow" x="-15%" y="-15%" width="130%" height="135%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.2" />
        </filter>
      </defs>

      ${celebrationStars}

      <!-- Monster Accessories Behind Body -->
      ${accessoriesMarkup}

      <!-- Feet (behind or under body) -->
      ${feetMarkup}

      <!-- Letter Monster Body (The letter itself!) -->
      <path d="${spec.path}" 
            fill="url(#grad-${char})" 
            fill-rule="${spec.fillRule || 'nonzero'}"
            stroke="#2D3142" 
            stroke-width="4.5" 
            stroke-linejoin="round" 
            stroke-linecap="round"
            filter="url(#monster-shadow)" 
            class="monster-body" />

      <!-- Texture / Spots -->
      ${spotsMarkup}

      <!-- Eyes -->
      <g class="monster-eyes-group">
        ${eyesMarkup}
      </g>

      <!-- Mouth -->
      <g class="monster-mouth-group">
        ${mouthMarkup}
      </g>

      <!-- Hands / Paws -->
      ${handsMarkup}
    </svg>
  `;
}

/**
 * Creates a DOM element for a letter monster
 */
export function createMonsterElement(letter, state = 'idle') {
  const container = document.createElement('div');
  container.className = `monster-letter-card letter-${letter.toUpperCase()}`;
  container.setAttribute('data-letter', letter.toUpperCase());
  container.setAttribute('role', 'button');
  container.setAttribute('aria-label', `Huruf Monster ${letter.toUpperCase()}`);
  container.innerHTML = createMonsterSVG(letter, { state });
  return container;
}
