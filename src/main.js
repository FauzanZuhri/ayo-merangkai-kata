// Main Application Orchestrator for Monster Phonics
import './style.css';
import { WORDS_DATABASE } from './data/words.js';
import { audioEngine } from './services/audioEngine.js';
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
    this.loadWord(this.currentWordIndex);
  }

  initDOM() {
    this.categoryBadgeEl = document.getElementById('mission-category');
    this.hintTextEl = document.getElementById('mission-hint');
    this.wordImgEl = document.getElementById('mission-word-img');
    this.photoCardEl = document.getElementById('mission-photo-card');
    this.targetFrameEl = document.getElementById('target-word-frame');
    this.trayEl = document.getElementById('monster-tray');
    this.btnPrevWord = document.getElementById('btn-prev-word');
    this.btnNextWord = document.getElementById('btn-next-word-top');
    this.btnSoundToggle = document.getElementById('btn-sound-toggle');
    this.soundIconEl = document.getElementById('sound-toggle-icon');
    this.btnStickers = document.getElementById('btn-open-stickers');
    this.theaterContainerEl = document.getElementById('vignette-theater-container');
    this.stickerBookContainerEl = document.getElementById('sticker-book-container');
  }

  initEngines() {
    this.dragDropEngine = new DragDropEngine({
      targetBoardEl: this.targetFrameEl,
      trayEl: this.trayEl,
      onWordCompleted: () => this.handleWordCompleted()
    });

    this.vignetteTheater = new VignetteTheater({
      containerEl: this.theaterContainerEl,
      onNextWord: () => this.nextWord(),
      onSaveSticker: (id) => this.stickerBook.saveCompletedWord(id)
    });

    this.stickerBook = new StickerBook({
      containerEl: this.stickerBookContainerEl
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

    // Touch Word Picture Card to pronounce the word
    if (this.photoCardEl) {
      this.photoCardEl.addEventListener('click', () => {
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

    // First user gesture audio context unlock
    const unlockAudio = () => {
      audioEngine.ensureContext();
      window.removeEventListener('pointerdown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
  }

  loadWord(index) {
    if (index < 0) index = WORDS_DATABASE.length - 1;
    if (index >= WORDS_DATABASE.length) index = 0;
    this.currentWordIndex = index;
    const wordData = WORDS_DATABASE[this.currentWordIndex];
    this.currentWordData = wordData;

    // Update Header, Hint & Real Illustration
    this.categoryBadgeEl.textContent = wordData.category;
    this.hintTextEl.textContent = wordData.hint;
    if (this.wordImgEl && wordData.image) {
      this.wordImgEl.src = wordData.image;
      this.wordImgEl.alt = `Gambar ${wordData.word}`;
    }

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
