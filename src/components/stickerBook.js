// Sticker Book (Buku Stiker Koleksi Kata) for Monster Phonics
// Encouraging child-friendly collection album without pressure

import { WORDS_DATABASE } from '../data/words.js';
import { audioEngine } from '../services/audioEngine.js';

const STORAGE_KEY = 'monster_phonics_completed_words';

export class StickerBook {
  constructor(options = {}) {
    this.containerEl = options.containerEl;
    this.onPlayWord = options.onPlayWord || (() => {});
  }

  getCompletedWordIds() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCompletedWord(wordId) {
    try {
      const completed = this.getCompletedWordIds();
      if (!completed.includes(wordId)) {
        completed.push(wordId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
      }
    } catch {
      // Ignore localStorage errors
    }
  }

  show() {
    const completedIds = this.getCompletedWordIds();
    const totalWords = WORDS_DATABASE.length;
    const completedCount = completedIds.length;

    this.containerEl.innerHTML = `
      <div class="sticker-book-backdrop" role="dialog" aria-modal="true">
        <div class="sticker-book-modal animate-pop-in">
          <!-- Washi tape at top of album -->
          <div class="washi-tape" aria-hidden="true"></div>

          <!-- Header -->
          <div class="sticker-book-header">
            <div class="header-title-box">
              <span class="sticker-emoji">📒</span>
              <div>
                <h2>Buku Album Stiker</h2>
                <p class="sticker-subtitle">Koleksi Stiker Huruf & Kata Ajaib</p>
              </div>
            </div>
            <button class="btn-close-modal" id="btn-close-stickers" aria-label="Tutup Buku Stiker">✕</button>
          </div>

          <!-- Hand-drawn Progress Ribbon -->
          <div class="sticker-progress-ribbon">
            <div class="progress-info">
              <span>⭐ Bintang Terkumpul: <strong>${completedCount} / ${totalWords}</strong></span>
              <span>${completedCount === totalWords ? '🎉 Luar Biasa! Koleksi Lengkap!' : 'Ayo kumpulkan stikernya!'}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${(completedCount / totalWords) * 100}%"></div>
            </div>
          </div>

          <!-- Physical Sticker Scrapbook Grid -->
          <div class="sticker-grid">
            ${WORDS_DATABASE.map((item, idx) => {
              const isUnlocked = completedIds.includes(item.id);
              const rotationAngle = (idx % 5 - 2) * 2; // subtle -4deg to +4deg organic tilt
              return `
                <div class="sticker-card ${isUnlocked ? 'is-unlocked die-cut-sticker' : 'is-locked'}"
                     data-id="${item.id}"
                     role="button"
                     tabindex="0"
                     style="${isUnlocked ? `transform: rotate(${rotationAngle}deg); border: 4px solid white; border-radius: 14px; box-shadow: 1px 2px 5px rgba(0,0,0,0.2);` : ''}"
                     aria-label="${isUnlocked ? item.word : 'Kata Rahasia'}">
                  <div class="sticker-badge ${isUnlocked ? 'sticker-badge-unlocked' : ''}">
                    ${isUnlocked
                      ? `<img src="${item.image}" alt="${item.word}" class="sticker-real-img">
                         <div class="sticker-star">⭐</div>`
                      : `<div class="sticker-locked-icon">🔒</div>`}
                  </div>
                  <div class="sticker-name">
                    ${isUnlocked ? item.word : '???'}
                  </div>
                  ${isUnlocked ? '<div class="sticker-hint-mini">🔊 Sentuh dengar</div>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.containerEl.classList.remove('hidden');

    // Close button
    const closeBtn = document.getElementById('btn-close-stickers');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        this.hide();
      });
    }

    // Clicking unlocked stickers speaks the word
    const cards = this.containerEl.querySelectorAll('.sticker-card.is-unlocked');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const wordData = WORDS_DATABASE.find(w => w.id === id);
        if (wordData) {
          audioEngine.playGrab();
          audioEngine.speakWordSequence(wordData);
        }
      });
    });
  }

  hide() {
    this.containerEl.classList.add('hidden');
    this.containerEl.innerHTML = '';
  }
}
