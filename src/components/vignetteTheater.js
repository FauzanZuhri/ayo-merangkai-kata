// Vignette Theater for Monster Phonics
// Displays celebratory short animated monster cartoons illustrating the word's concrete meaning
// Alongside clear pronunciation, friendly child explanation, and sticker rewards

import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioEngine.js';

export class VignetteTheater {
  constructor(options = {}) {
    this.containerEl = options.containerEl;
    this.onNextWord = options.onNextWord || (() => {});
    this.onSaveSticker = options.onSaveSticker || (() => {});
  }

  show(wordData) {
    audioEngine.playVignetteSound(wordData.vignette?.actionSound || 'cheer');
    this.triggerConfetti();

    this.containerEl.innerHTML = `
      <div class="theater-backdrop" role="dialog" aria-modal="true">
        <div class="theater-modal animate-pop-in">
          <!-- Top Tag & Close -->
          <div class="theater-header">
            <span class="theater-category-badge">${wordData.category}</span>
            <span class="theater-super-title">🎉 Hore! Kata Berhasil Disusun! 🎉</span>
          </div>

          <!-- Animated Real Illustration Stage -->
          <div class="theater-stage" style="background: ${wordData.vignette?.bgColor || '#FFE5EC'}">
            <div class="theater-illustration-showcase">
              <img src="${wordData.image}" alt="${wordData.word}" class="theater-real-illustration animate-pop-in">
              <div class="theater-sparkle-decor" aria-hidden="true">✨</div>
            </div>
          </div>

          <!-- Word Display with Syllables -->
          <div class="theater-word-banner">
            <h1 class="theater-word-text">${wordData.word}</h1>
            <button class="sound-repeat-btn" id="btn-replay-word" aria-label="Ulangi Pengucapan Kata">
              <span class="btn-icon">🔊</span>
              <span>Dengarkan Lagi</span>
            </button>
          </div>

          <!-- Child-Friendly Meaning Card -->
          <div class="theater-meaning-card">
            <div class="meaning-icon">💡</div>
            <div class="meaning-content">
              <p class="meaning-text">${wordData.meaning}</p>
              <p class="story-tagline">“${wordData.vignette?.storyText || ''}”</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="theater-actions">
            <button class="btn-primary-fun" id="btn-next-word">
              <span>Hebat! Lanjut Kata Berikutnya</span>
              <span class="btn-arrow">➔</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.containerEl.classList.remove('hidden');

    // Save to sticker album
    this.onSaveSticker(wordData.id);

    // Speak word sequence and meaning
    audioEngine.speakWordSequence(wordData);

    // Bind event listeners
    const replayBtn = document.getElementById('btn-replay-word');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        audioEngine.speakWordSequence(wordData);
      });
    }

    const nextBtn = document.getElementById('btn-next-word');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        this.hide();
        this.onNextWord();
      });
    }
  }

  hide() {
    this.containerEl.classList.add('hidden');
    this.containerEl.innerHTML = '';
  }

  triggerConfetti() {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5964', '#FFD166', '#06D6A0', '#118AB2', '#9B5DE5']
    });
  }

  getVignetteSVG(wordData) {
    const type = wordData.vignette?.type || 'cat';

    switch (type) {
      case 'apple':
        return `
          <svg class="vignette-svg apple-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Monster -->
            <g class="anim-monster-eating">
              <rect x="50" y="50" width="90" height="95" rx="35" fill="#06D6A0" stroke="#2D3142" stroke-width="4" />
              <!-- Eyes -->
              <circle cx="78" cy="78" r="14" fill="#FFF" stroke="#2D3142" stroke-width="3" />
              <circle cx="80" cy="78" r="6" fill="#2D3142" />
              <circle cx="112" cy="78" r="14" fill="#FFF" stroke="#2D3142" stroke-width="3" />
              <circle cx="114" cy="78" r="6" fill="#2D3142" />
              <!-- Chewing Mouth -->
              <ellipse cx="95" cy="115" rx="18" ry="12" fill="#800E13" stroke="#2D3142" stroke-width="3" class="anim-chew" />
              <!-- Monster Arm holding Apple -->
              <path d="M 125 105 Q 160 110 175 118" stroke="#06D6A0" stroke-width="14" stroke-linecap="round" />
            </g>
            <!-- Delicious Apple -->
            <g class="anim-apple-float" transform="translate(180, 75)">
              <circle cx="28" cy="38" r="28" fill="#FF5964" stroke="#2D3142" stroke-width="4" />
              <ellipse cx="28" cy="18" rx="8" ry="4" fill="#FF85A1" opacity="0.6" />
              <!-- Stem & Leaf -->
              <path d="M 28 12 Q 32 0 38 4" stroke="#8B5A2B" stroke-width="4" fill="none" stroke-linecap="round" />
              <path d="M 33 6 Q 48 4 44 14 Z" fill="#70E000" stroke="#2D3142" stroke-width="2" />
              <!-- Bite Mark with Sparkles -->
              <circle cx="10" cy="28" r="10" fill="#FFE5EC" />
              <text x="12" y="16" font-size="14" fill="#FFD166" class="star-pop">✦</text>
            </g>
          </svg>
        `;

      case 'cat':
        return `
          <svg class="vignette-svg cat-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Cat Monster -->
            <g class="anim-cat-bounce" transform="translate(45, 45)">
              <!-- Ears -->
              <polygon points="20,25 35,2 50,22" fill="#FF70A6" stroke="#2D3142" stroke-width="3" />
              <polygon points="70,22 85,2 100,25" fill="#FF70A6" stroke="#2D3142" stroke-width="3" />
              <!-- Body -->
              <rect x="15" y="18" width="90" height="95" rx="36" fill="#FF85A1" stroke="#2D3142" stroke-width="4" />
              <!-- Eyes Happy -->
              <path d="M 35 48 Q 45 36 55 48" stroke="#2D3142" stroke-width="4" fill="none" stroke-linecap="round" />
              <path d="M 68 48 Q 78 36 88 48" stroke="#2D3142" stroke-width="4" fill="none" stroke-linecap="round" />
              <!-- Cat Whiskers -->
              <line x1="8" y1="56" x2="28" y2="58" stroke="#2D3142" stroke-width="2.5" />
              <line x1="8" y1="66" x2="28" y2="64" stroke="#2D3142" stroke-width="2.5" />
              <line x1="92" y1="58" x2="112" y2="56" stroke="#2D3142" stroke-width="2.5" />
              <line x1="92" y1="64" x2="112" y2="66" stroke="#2D3142" stroke-width="2.5" />
              <!-- Cute Cat Nose & Smile -->
              <polygon points="58,58 62,58 60,62" fill="#E63946" />
              <path d="M 54 64 Q 60 70 66 64" stroke="#2D3142" stroke-width="3" fill="none" />
              <!-- Paws batting yarn -->
              <ellipse cx="108" cy="85" rx="12" ry="8" fill="#FF85A1" stroke="#2D3142" stroke-width="3" class="anim-bat-paw" />
            </g>
            <!-- Yarn Ball Rolling -->
            <g class="anim-yarn-ball" transform="translate(195, 95)">
              <circle cx="30" cy="30" r="26" fill="#3A86FF" stroke="#2D3142" stroke-width="3.5" />
              <path d="M 12 22 Q 30 10 48 24" stroke="#8338EC" stroke-width="3" fill="none" />
              <path d="M 16 38 Q 30 46 44 34" stroke="#8338EC" stroke-width="3" fill="none" />
              <!-- Yarn Thread -->
              <path d="M 30 54 Q 10 70 -25 50" stroke="#3A86FF" stroke-width="3" fill="none" stroke-linecap="round" />
            </g>
          </svg>
        `;

      case 'ball':
        return `
          <svg class="vignette-svg ball-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Monster Heading Ball -->
            <g class="anim-monster-headball" transform="translate(60, 55)">
              <rect x="20" y="20" width="85" height="90" rx="35" fill="#3A86FF" stroke="#2D3142" stroke-width="4" />
              <!-- Happy Eyes Looking Up -->
              <circle cx="48" cy="46" r="14" fill="#FFF" stroke="#2D3142" stroke-width="3" />
              <circle cx="50" cy="38" r="6" fill="#2D3142" />
              <circle cx="78" cy="46" r="14" fill="#FFF" stroke="#2D3142" stroke-width="3" />
              <circle cx="80" cy="38" r="6" fill="#2D3142" />
              <!-- Mouth -->
              <path d="M 50 78 Q 63 94 76 78" fill="#FF5964" stroke="#2D3142" stroke-width="3" />
              <!-- Arms celebrating -->
              <path d="M 16 65 Q -8 40 4 20" stroke="#3A86FF" stroke-width="10" stroke-linecap="round" fill="none" />
              <path d="M 104 65 Q 128 40 120 20" stroke="#3A86FF" stroke-width="10" stroke-linecap="round" fill="none" />
            </g>
            <!-- Bouncing Soccer Ball -->
            <g class="anim-bouncing-ball" transform="translate(195, 30)">
              <circle cx="32" cy="32" r="30" fill="#FFFFFF" stroke="#2D3142" stroke-width="4" />
              <!-- Pentagons -->
              <polygon points="32,18 42,26 38,38 26,38 22,26" fill="#2D3142" />
              <polygon points="32,4 38,12 26,12" fill="#2D3142" />
              <polygon points="56,20 50,30 60,34" fill="#2D3142" />
              <polygon points="8,20 14,30 4,34" fill="#2D3142" />
            </g>
          </svg>
        `;

      case 'fish':
        return `
          <svg class="vignette-svg fish-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Seaweed -->
            <path d="M 30 200 Q 15 140 35 90 Q 20 40 30 10" stroke="#06D6A0" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.7" />
            <path d="M 290 200 Q 305 140 285 80" stroke="#06D6A0" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.7" />
            <!-- Swimming Fish Monster -->
            <g class="anim-swimming-fish" transform="translate(110, 50)">
              <!-- Tail Fin -->
              <polygon points="120,45 160,15 145,45 160,75" fill="#FF9E00" stroke="#2D3142" stroke-width="3.5" class="anim-tail-wiggle" />
              <!-- Body -->
              <ellipse cx="65" cy="45" rx="55" ry="40" fill="#FFBE0B" stroke="#2D3142" stroke-width="4" />
              <!-- Snorkel Goggles -->
              <rect x="25" y="28" width="48" height="24" rx="10" fill="#E0F4FF" stroke="#2D3142" stroke-width="3" opacity="0.9" />
              <circle cx="38" cy="40" r="5" fill="#2D3142" />
              <circle cx="58" cy="40" r="5" fill="#2D3142" />
              <!-- Little Dorsal Fin -->
              <path d="M 45 6 Q 65 -8 85 8" fill="#FF9E00" stroke="#2D3142" stroke-width="3" />
            </g>
            <!-- Floating Bubbles -->
            <circle cx="70" cy="110" r="10" fill="#FFFFFF" opacity="0.6" class="anim-bubble b1" />
            <circle cx="85" cy="60" r="6" fill="#FFFFFF" opacity="0.6" class="anim-bubble b2" />
            <circle cx="240" cy="80" r="12" fill="#FFFFFF" opacity="0.6" class="anim-bubble b3" />
          </svg>
        `;

      case 'car':
        return `
          <svg class="vignette-svg car-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Road -->
            <line x1="0" y1="165" x2="320" y2="165" stroke="#2D3142" stroke-width="6" />
            <line x1="20" y1="165" x2="60" y2="165" stroke="#FFD166" stroke-width="3" stroke-dasharray="15,15" class="anim-road-dash" />
            <!-- Driving Car -->
            <g class="anim-driving-car" transform="translate(60, 50)">
              <!-- Little Monster Driver -->
              <g transform="translate(60, 15)">
                <rect x="0" y="0" width="45" height="45" rx="18" fill="#9B5DE5" stroke="#2D3142" stroke-width="3" />
                <circle cx="16" cy="18" r="6" fill="#FFF" stroke="#2D3142" stroke-width="2" />
                <circle cx="18" cy="18" r="2.5" fill="#2D3142" />
                <circle cx="32" cy="18" r="6" fill="#FFF" stroke="#2D3142" stroke-width="2" />
                <circle cx="34" cy="18" r="2.5" fill="#2D3142" />
              </g>
              <!-- Car Body -->
              <path d="M 10 75 Q 30 40 60 40 L 130 40 Q 155 40 175 75 L 185 95 L 0 95 Z" fill="#FF5964" stroke="#2D3142" stroke-width="4" />
              <!-- Windshield -->
              <path d="M 62 45 L 105 45 L 100 70 L 48 70 Z" fill="#E0F4FF" stroke="#2D3142" stroke-width="2.5" />
              <!-- Headlight -->
              <circle cx="180" cy="85" r="7" fill="#FFD166" stroke="#2D3142" stroke-width="2" />
              <!-- Wheels -->
              <g transform="translate(40, 95)" class="anim-wheel-spin">
                <circle cx="0" cy="0" r="18" fill="#2D3142" />
                <circle cx="0" cy="0" r="8" fill="#FFF" />
              </g>
              <g transform="translate(145, 95)" class="anim-wheel-spin">
                <circle cx="0" cy="0" r="18" fill="#2D3142" />
                <circle cx="0" cy="0" r="8" fill="#FFF" />
              </g>
              <!-- Exhaust smoke puffs -->
              <circle cx="-15" cy="90" r="8" fill="#E0E0E0" class="anim-exhaust" />
            </g>
          </svg>
        `;

      case 'book':
        return `
          <svg class="vignette-svg book-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Monster Reader with glasses -->
            <g class="anim-reader-monster" transform="translate(115, 30)">
              <rect x="15" y="10" width="65" height="70" rx="25" fill="#FB8500" stroke="#2D3142" stroke-width="3.5" />
              <!-- Cute Round Glasses -->
              <circle cx="32" cy="38" r="11" fill="none" stroke="#2D3142" stroke-width="3" />
              <circle cx="62" cy="38" r="11" fill="none" stroke="#2D3142" stroke-width="3" />
              <line x1="43" y1="38" x2="51" y2="38" stroke="#2D3142" stroke-width="3" />
              <!-- Happy Eyes Behind Glasses -->
              <circle cx="33" cy="38" r="4" fill="#2D3142" />
              <circle cx="63" cy="38" r="4" fill="#2D3142" />
              <!-- Smile -->
              <path d="M 40 58 Q 48 66 56 58" stroke="#2D3142" stroke-width="2.5" fill="none" />
            </g>
            <!-- Magic Open Book -->
            <g class="anim-open-book" transform="translate(75, 95)">
              <path d="M 15 25 Q 85 0 85 45 L 85 65 Q 85 20 15 45 Z" fill="#FFFFFF" stroke="#2D3142" stroke-width="3.5" />
              <path d="M 155 25 Q 85 0 85 45 L 85 65 Q 85 20 155 45 Z" fill="#F8F9FA" stroke="#2D3142" stroke-width="3.5" />
              <!-- Cover Spine -->
              <path d="M 12 47 Q 85 24 85 68 Q 85 24 158 47" stroke="#8338EC" stroke-width="5" fill="none" />
              <!-- Magic floating stars -->
              <text x="65" y="10" font-size="16" fill="#FFD166" class="star-pop">★</text>
              <text x="95" y="5" font-size="18" fill="#00BBF9" class="star-pop">✦</text>
              <text x="80" y="-15" font-size="14" fill="#FF70A6" class="star-pop">✨</text>
            </g>
          </svg>
        `;

      case 'star':
        return `
          <svg class="vignette-svg star-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Night Sky Stars -->
            <circle cx="40" cy="35" r="2.5" fill="#FFF" class="anim-twinkle" />
            <circle cx="120" cy="20" r="3" fill="#FFD166" class="anim-twinkle" />
            <circle cx="280" cy="45" r="2.5" fill="#FFF" class="anim-twinkle" />
            <!-- Giant Smiling Star Character -->
            <g class="anim-giant-star" transform="translate(110, 35)">
              <polygon points="50,5 64,36 98,39 72,62 80,95 50,77 20,95 28,62 2,39 36,36"
                       fill="#FFD166" stroke="#2D3142" stroke-width="4.5" stroke-linejoin="round" />
              <!-- Star Face -->
              <circle cx="40" cy="46" r="4.5" fill="#2D3142" />
              <circle cx="60" cy="46" r="4.5" fill="#2D3142" />
              <circle cx="32" cy="52" r="4" fill="#FF70A6" opacity="0.6" />
              <circle cx="68" cy="52" r="4" fill="#FF70A6" opacity="0.6" />
              <path d="M 44 56 Q 50 64 56 56" stroke="#2D3142" stroke-width="3" fill="none" stroke-linecap="round" />
            </g>
            <!-- Cute Monster Looking Up with Telescope -->
            <g transform="translate(45, 95)" class="anim-monster-look">
              <rect x="0" y="20" width="55" height="60" rx="22" fill="#9B5DE5" stroke="#2D3142" stroke-width="3.5" />
              <circle cx="22" cy="38" r="6" fill="#FFF" stroke="#2D3142" stroke-width="2" />
              <circle cx="24" cy="34" r="3" fill="#2D3142" />
              <circle cx="40" cy="38" r="6" fill="#FFF" stroke="#2D3142" stroke-width="2" />
              <circle cx="42" cy="34" r="3" fill="#2D3142" />
            </g>
          </svg>
        `;

      default:
        // Cheerful Generic / Animal Monster Scene
        return `
          <svg class="vignette-svg generic-vignette" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
            <!-- Celebrating Party Monster -->
            <g class="anim-party-monster" transform="translate(110, 40)">
              <!-- Party Hat -->
              <polygon points="50,2 35,28 65,28" fill="#FF5964" stroke="#2D3142" stroke-width="3" />
              <circle cx="50" cy="2" r="5" fill="#FFD166" />
              <!-- Body -->
              <rect x="10" y="26" width="80" height="85" rx="32" fill="#06D6A0" stroke="#2D3142" stroke-width="4" />
              <!-- Huge Joyous Eyes -->
              <path d="M 28 55 Q 40 40 52 55" stroke="#2D3142" stroke-width="4" fill="none" stroke-linecap="round" />
              <path d="M 60 55 Q 72 40 84 55" stroke="#2D3142" stroke-width="4" fill="none" stroke-linecap="round" />
              <!-- Wide Happy Mouth -->
              <path d="M 35 75 Q 55 100 75 75" fill="#C9184A" stroke="#2D3142" stroke-width="3.5" />
              <polygon points="45,75 49,80 53,75" fill="#FFF" />
              <!-- Waving Arms -->
              <path d="M 10 65 Q -15 35 0 20" stroke="#06D6A0" stroke-width="12" stroke-linecap="round" fill="none" />
              <path d="M 90 65 Q 115 35 100 20" stroke="#06D6A0" stroke-width="12" stroke-linecap="round" fill="none" />
            </g>
          </svg>
        `;
    }
  }
}
