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
          <!-- Header -->
          <div class="sticker-book-header">
            <div class="header-title-box">
              <span class="sticker-emoji">📖</span>
              <div>
                <h2>Buku Stiker Kata Monster</h2>
                <p class="sticker-subtitle">Koleksi petualangan kata ajaibmu!</p>
              </div>
            </div>
            <button class="btn-close-modal" id="btn-close-stickers" aria-label="Tutup Buku Stiker">✕</button>
          </div>

          <!-- Progress Ribbon -->
          <div class="sticker-progress-ribbon">
            <div class="progress-info">
              <span>Bintang Terkumpul: <strong>${completedCount} / ${totalWords}</strong></span>
              <span>${completedCount === totalWords ? '🌟 Luar Biasa! Semua Terkumpul!' : 'Yuk kumpulkan semuanya!'}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${(completedCount / totalWords) * 100}%"></div>
            </div>
          </div>

          <!-- Sticker Grid -->
          <div class="sticker-grid">
            ${WORDS_DATABASE.map(item => {
              const isUnlocked = completedIds.includes(item.id);
              return `
                <div class="sticker-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}"
                     data-id="${item.id}"
                     role="button"
                     tabindex="0"
                     aria-label="${isUnlocked ? item.word : 'Kata Rahasia'}">
                  <div class="sticker-badge">
                    ${isUnlocked
                      ? `<div class="sticker-icon">${item.category.split(' ')[0]}</div>
                         <div class="sticker-star">⭐</div>`
                      : `<div class="sticker-locked-icon">🔒</div>`}
                  </div>
                  <div class="sticker-name">
                    ${isUnlocked ? item.word : '???'}
                  </div>
                  ${isUnlocked ? '<div class="sticker-hint-mini">Sentuh untuk dengar!</div>' : ''}
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
