// Main Application Orchestrator for Monster Phonics
import './style.css';
import { wordRepository } from './services/wordRepository.js';
import { audioEngine } from './services/audioEngine.js';
import { parentalLock } from './services/parentalLock.js';
import { createMonsterElement, createMonsterSVG } from './components/monsterFactory.js';
import { DragDropEngine } from './components/dragDropEngine.js';
import { VignetteTheater } from './components/vignetteTheater.js';
import { StickerBook } from './components/stickerBook.js';

class MonsterPhonicsApp {
  constructor() {
    this.currentWordIndex = 0;
    this.currentWordData = null;
    this.slots = [];
    this.dragDropEngine = null;
    this.vignetteTheater = null;
    this.stickerBook = null;

    this.initDOM();
    this.initEngines();
    this.bindGlobalEvents();
    this.startApp();
  }

  async startApp() {
    await wordRepository.init();
    this.loadWord(this.currentWordIndex);
  }

  initDOM() {
    this.categoryBadgeEl = document.getElementById('mission-category');
    this.hintTextEl = document.getElementById('mission-hint');
    this.hintBoxEl = document.querySelector('.mission-hint-box');
    this.targetFrameEl = document.getElementById('target-word-frame');
    this.trayEl = document.getElementById('monster-tray');
    this.btnPrevWord = document.getElementById('btn-prev-word');
    this.btnNextWord = document.getElementById('btn-next-word-top');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIconEl = document.getElementById('sound-toggle-icon');
    this.btnStickers = document.getElementById('btn-open-stickers');
    this.theaterContainerEl = document.getElementById('vignette-theater-container');
    this.stickerBookContainerEl = document.getElementById('sticker-book-container');

    // Secret Parental Gate Elements
    this.brandBadgeEl = document.querySelector('.brand-badge');
    this.parentalGateModal = document.getElementById('parental-gate-modal');
    this.parentalChallengeText = document.getElementById('parental-challenge-text');
    this.parentalGateInput = document.getElementById('parental-gate-input');
    this.parentalGateForm = document.getElementById('parental-gate-form');
    this.btnCloseParentalGate = document.getElementById('btn-close-parental-gate');
  }

  initEngines() {
    this.stickerBook = new StickerBook({
      containerEl: this.stickerBookContainerEl
    });

    this.dragDropEngine = new DragDropEngine({
      targetBoardEl: this.targetFrameEl,
      trayEl: this.trayEl,
      onWordCompleted: () => this.handleWordCompleted()
    });

    this.vignetteTheater = new VignetteTheater({
      containerEl: this.theaterContainerEl,
      stickerBook: this.stickerBook,
      onNextWord: () => this.nextWord(),
      onOpenStickerBook: () => this.stickerBook.show(),
      onSaveSticker: (id) => this.stickerBook.saveCompletedWord(id)
    });
  }

  bindGlobalEvents() {
    // Sound Toggle
    this.btnSoundToggle.addEventListener('click', () => {
      const isMuted = audioEngine.toggleMute();
      this.soundIconEl.textContent = isMuted ? '🔇' : '🔊';
    });

    // Word Navigators
    this.btnPrevWord.addEventListener('click', () => {
      audioEngine.playGrab();
      this.prevWord();
    });

    this.btnNextWord.addEventListener('click', () => {
      audioEngine.playGrab();
      this.nextWord();
    });

    // Touch Hint Box to listen to phonics/word audio
    if (this.hintBoxEl) {
      this.hintBoxEl.style.cursor = 'pointer';
      this.hintBoxEl.setAttribute('title', 'Sentuh untuk dengarkan bunyi kata!');
      this.hintBoxEl.addEventListener('click', () => {
        audioEngine.playGrab();
        if (this.currentWordData) {
          audioEngine.speakWordSequence(this.currentWordData);
        }
      });
    }

    // Open Sticker Book
    this.btnStickers.addEventListener('click', () => {
      audioEngine.playGrab();
      this.stickerBook.show();
    });

    // Re-scatter on window resize / mobile device orientation change
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.dragDropEngine.scatterLetters();
      }, 150);
    });

    // First user gesture audio context unlock
    const unlockAudio = () => {
      audioEngine.ensureContext();
      window.removeEventListener('pointerdown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);

    // Secret Parental Gate Gestures on Brand Logo (Quad tap or 1.8s long-press)
    let tapCount = 0;
    let tapResetTimer = null;
    let longPressTimer = null;

    const openParentalGate = () => {
      audioEngine.playGrab();
      const challenge = parentalLock.generateChallenge();
      this.parentalChallengeText.textContent = challenge.question;
      this.parentalGateInput.value = '';
      this.parentalGateModal.classList.remove('hidden');
      setTimeout(() => this.parentalGateInput.focus(), 150);
    };

    if (this.brandBadgeEl) {
      this.brandBadgeEl.style.userSelect = 'none';

      // 1. Secret multiple taps (4 taps within 1.5 seconds)
      this.brandBadgeEl.addEventListener('click', () => {
        tapCount++;
        clearTimeout(tapResetTimer);
        if (tapCount >= 4) {
          tapCount = 0;
          openParentalGate();
        } else {
          tapResetTimer = setTimeout(() => { tapCount = 0; }, 1500);
        }
      });

      // 2. Secret long-press (Hold logo for 1.8 seconds)
      this.brandBadgeEl.addEventListener('pointerdown', () => {
        longPressTimer = setTimeout(() => {
          openParentalGate();
        }, 1800);
      });
      const cancelLongPress = () => clearTimeout(longPressTimer);
      this.brandBadgeEl.addEventListener('pointerup', cancelLongPress);
      this.brandBadgeEl.addEventListener('pointercancel', cancelLongPress);
      this.brandBadgeEl.addEventListener('pointerleave', cancelLongPress);
    }

    if (this.btnCloseParentalGate) {
      this.btnCloseParentalGate.addEventListener('click', () => {
        this.parentalGateModal.classList.add('hidden');
      });
    }

    if (this.parentalGateForm) {
      this.parentalGateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ans = this.parentalGateInput.value;
        if (parentalLock.verify(ans)) {
          window.location.href = '/admin';
        } else {
          this.parentalGateInput.style.borderColor = '#FA5252';
          this.parentalGateInput.value = '';
          const newChallenge = parentalLock.generateChallenge();
          this.parentalChallengeText.textContent = newChallenge.question;
          alert('Jawaban atau PIN belum tepat. Silakan coba lagi.');
        }
      });
    }
  }

  loadWord(index) {
    const words = wordRepository.getWords();
    if (!words || words.length === 0) return;
    if (index < 0) index = words.length - 1;
    if (index >= words.length) index = 0;
    this.currentWordIndex = index;
    const wordData = words[this.currentWordIndex];
    this.currentWordData = wordData;

    // Update Header & Hint (Image will only appear in the celebration modal & sticker album!)
    this.categoryBadgeEl.textContent = wordData.category;
    this.hintTextEl.textContent = wordData.hint;

    // Clear Target Frame & Tray
    this.targetFrameEl.innerHTML = '';
    this.trayEl.innerHTML = '';
    this.slots = [];

    const letters = wordData.word.split('');

    // 1. Create Target Letter Slots
    letters.forEach((char, idx) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'target-letter-slot';
      slotEl.setAttribute('data-slot-index', idx);
      slotEl.setAttribute('data-expected', char);
      slotEl.innerHTML = `<span class="slot-placeholder">${char}</span>`;

      this.targetFrameEl.appendChild(slotEl);

      this.slots.push({
        el: slotEl,
        index: idx,
        expectedLetter: char,
        isFilled: false,
        filledMonsterEl: null
      });
    });

    this.dragDropEngine.setTargetSlots(this.slots);

    // 2. Create Scrambled Monster Letter Cards for Tray
    // Create items with unique ids to handle duplicate letters like in BINTANG or BEBEK
    const trayLetters = letters.map((char, originalIdx) => ({
      char,
      originalIdx
    }));

    // Shuffle letters so it feels like a puzzle
    const shuffled = [...trayLetters].sort(() => Math.random() - 0.5);

    shuffled.forEach((item) => {
      const monsterCard = createMonsterElement(item.char, 'idle');
      this.trayEl.appendChild(monsterCard);

      // Attach Drag & Drop with Phonics chanting
      this.dragDropEngine.attachMonster(monsterCard, item.char);
    });

    // Scatter letters organically across the play table (melatih motorik anak)
    setTimeout(() => {
      this.dragDropEngine.scatterLetters();
    }, 60);
  }

  nextWord() {
    this.loadWord(this.currentWordIndex + 1);
  }

  prevWord() {
    this.loadWord(this.currentWordIndex - 1);
  }

  handleWordCompleted() {
    // 1. Victory wave on all slots
    this.slots.forEach(slot => {
      if (slot.el) {
        slot.el.innerHTML = createMonsterSVG(slot.expectedLetter, { state: 'celebrating' });
      }
    });

    audioEngine.playWordCelebration();

    // 2. Open Vignette Theater after celebratory beat
    setTimeout(() => {
      this.vignetteTheater.show(this.currentWordData);
    }, 600);
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MonsterPhonicsApp();
});
