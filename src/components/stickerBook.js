// Interactive Panoramic Papercraft Diorama Storybook Album
// Enables children to freely place unlocked word stickers across a seamless 4-zone panorama world

import { wordRepository } from '../services/wordRepository.js';
import { audioEngine } from '../services/audioEngine.js';

const STORAGE_COMPLETED_KEY = 'monster_phonics_completed_words';
const STORAGE_PLACEMENTS_KEY = 'monster_phonics_diorama_stickers';

export class StickerBook {
  constructor(options = {}) {
    this.containerEl = options.containerEl;
    this.onPlayWord = options.onPlayWord || (() => {});

    this.viewportEl = null;
    this.canvasEl = null;
    this.drawerEl = null;
    this.isDraggingSticker = false;
    this.activeDragGhost = null;
    this.activeStickerId = null;
  }

  getCompletedWordIds() {
    try {
      const stored = localStorage.getItem(STORAGE_COMPLETED_KEY);
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
        localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(completed));
      }
    } catch {}
  }

  getStickerPlacements() {
    try {
      const stored = localStorage.getItem(STORAGE_PLACEMENTS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  saveStickerPlacement(stickerId, x, y, rotation) {
    try {
      const placements = this.getStickerPlacements();
      placements[stickerId] = { x, y, rotation, isPlaced: true };
      localStorage.setItem(STORAGE_PLACEMENTS_KEY, JSON.stringify(placements));
    } catch {}
  }

  removeStickerPlacement(stickerId) {
    try {
      const placements = this.getStickerPlacements();
      delete placements[stickerId];
      localStorage.setItem(STORAGE_PLACEMENTS_KEY, JSON.stringify(placements));
    } catch {}
  }

  resetAllPlacements() {
    try {
      localStorage.removeItem(STORAGE_PLACEMENTS_KEY);
    } catch {}
  }

  show() {
    const words = wordRepository.getWords();
    const completedIds = this.getCompletedWordIds();
    const totalWords = words.length;
    const completedCount = completedIds.length;
    const placements = this.getStickerPlacements();

    this.containerEl.innerHTML = `
      <div class="sticker-book-backdrop diorama-backdrop" role="dialog" aria-modal="true">
        <div class="diorama-modal-window animate-pop-in">
          <!-- Washi tape at top of album -->
          <div class="washi-tape" aria-hidden="true"></div>

          <!-- Header -->
          <div class="diorama-header">
            <div class="diorama-title-box">
              <span class="diorama-header-icon" aria-hidden="true">🗺️</span>
              <div>
                <h2 class="diorama-title">Album Diorama Panorama</h2>
                <div class="diorama-subtitle">Tempel stiker koleksimu bebas di dunia cerita kertas!</div>
              </div>
            </div>

            <!-- Quick Zone Navigators -->
            <div class="diorama-zone-navs">
              <button class="btn-zone-jump" data-target-x="0" title="Ke Padang Rumput">🌳 Taman</button>
              <button class="btn-zone-jump" data-target-x="550" title="Ke Sungai Ceria">🐠 Sungai</button>
              <button class="btn-zone-jump" data-target-x="1100" title="Ke Jalan Kota">🚗 Kota</button>
              <button class="btn-zone-jump" data-target-x="1650" title="Ke Langit Bintang">☁️ Langit</button>
            </div>

            <div class="diorama-header-actions">
              <div class="diorama-progress-pill" title="${completedCount} dari ${totalWords} stiker telah dibuka">
                <span>⭐</span>
                <strong>${completedCount} / ${totalWords}</strong>
              </div>
              <button class="btn-paper btn-reset-diorama" id="btn-reset-diorama" title="Kembalikan semua stiker ke laci bawah">
                <span>🔄</span>
                <span class="btn-text-hide-sm">Tata Ulang</span>
              </button>
              <button class="btn-close-modal btn-diorama-close" id="btn-close-stickers" aria-label="Tutup Album">✕</button>
            </div>
          </div>

          <!-- Panorama Viewport (Horizontal Scrollable Canvas) -->
          <div class="diorama-viewport" id="diorama-viewport">
            <div class="diorama-canvas" id="diorama-canvas">

              <!-- ZONE 1: Padang Rumput Ceria (0px - 550px) -->
              <div class="diorama-zone zone-meadow" style="left: 0; width: 550px;">
                <div class="zone-badge">🌳 Padang Rumput Ceria</div>
                <!-- Papercraft Landscape Elements -->
                <div class="paper-sun"></div>
                <div class="paper-hill hill-meadow-1"></div>
                <div class="paper-hill hill-meadow-2"></div>
                <div class="paper-tree tree-1">
                  <div class="paper-tree-leaves"></div>
                  <div class="paper-tree-trunk"></div>
                </div>
                <div class="paper-flower flower-1">🌸</div>
                <div class="paper-flower flower-2">🌼</div>
                <div class="paper-flower flower-3">🌷</div>
                <div class="paper-fence"></div>
              </div>

              <!-- ZONE 2: Sungai & Danau (550px - 1100px) -->
              <div class="diorama-zone zone-stream" style="left: 550px; width: 550px;">
                <div class="zone-badge">🐠 Sungai & Danau Ceria</div>
                <div class="paper-hill hill-stream-bg"></div>
                <div class="paper-bridge"></div>
                <div class="paper-water-waves wave-1"></div>
                <div class="paper-water-waves wave-2"></div>
                <div class="paper-water-ripples ripple-1"></div>
                <div class="paper-water-ripples ripple-2"></div>
                <div class="paper-reed reed-1">🌾</div>
                <div class="paper-reed reed-2">🌾</div>
              </div>

              <!-- ZONE 3: Kota & Jalan Raya (1100px - 1650px) -->
              <div class="diorama-zone zone-city" style="left: 1100px; width: 550px;">
                <div class="zone-badge">🚗 Kota & Jalan Raya</div>
                <div class="paper-city-skyline"></div>
                <div class="paper-house house-pink">
                  <div class="paper-house-roof"></div>
                  <div class="paper-house-body"></div>
                </div>
                <div class="paper-house house-yellow">
                  <div class="paper-house-roof"></div>
                  <div class="paper-house-body"></div>
                </div>
                <div class="paper-road">
                  <div class="paper-road-lines"></div>
                </div>
                <div class="paper-lamppost">💡</div>
              </div>

              <!-- ZONE 4: Bukit & Langit Bintang (1650px - 2200px) -->
              <div class="diorama-zone zone-sky" style="left: 1650px; width: 550px;">
                <div class="zone-badge">☁️ Langit Bintang</div>
                <div class="paper-twilight-bg"></div>
                <div class="paper-sky-cloud cloud-1">☁️</div>
                <div class="paper-sky-cloud cloud-2">☁️</div>
                <div class="paper-sky-moon">🌙</div>
                <div class="paper-star-mobile star-1">✨</div>
                <div class="paper-star-mobile star-2">⭐</div>
                <div class="paper-star-mobile star-3">🌟</div>
                <div class="paper-rainbow-arc"></div>
              </div>

              <!-- Dynamic Placed Stickers Container -->
              <div class="diorama-placed-stickers" id="diorama-placed-stickers"></div>

            </div>
          </div>

          <!-- Bottom Drawer / Sticker Collection Tray -->
          <div class="diorama-drawer-section">
            <div class="diorama-drawer-handle">
              <span class="diorama-drawer-icon">📦</span>
              <span class="diorama-drawer-label">Laci Stiker Koleksi: Geser stiker ke atas untuk menempel!</span>
            </div>
            <div class="diorama-drawer-tray" id="diorama-drawer-tray">
              <!-- Dynamically injected drawer stickers -->
            </div>
          </div>

        </div>
      </div>
    `;

    this.containerEl.classList.remove('hidden');

    this.viewportEl = document.getElementById('diorama-viewport');
    this.canvasEl = document.getElementById('diorama-canvas');
    this.drawerEl = document.getElementById('diorama-drawer-tray');
    this.placedStickersContainer = document.getElementById('diorama-placed-stickers');

    this.renderStickers();
    this.bindEvents();
  }

  renderStickers() {
    const words = wordRepository.getWords();
    const completedIds = this.getCompletedWordIds();
    const placements = this.getStickerPlacements();

    this.placedStickersContainer.innerHTML = '';
    this.drawerEl.innerHTML = '';

    words.forEach((wordItem, idx) => {
      const isUnlocked = completedIds.includes(wordItem.id);
      const placement = placements[wordItem.id];

      if (isUnlocked && placement && placement.isPlaced) {
        // Render on canvas
        this.renderCanvasSticker(wordItem, placement.x, placement.y, placement.rotation || 0);
      } else {
        // Render in bottom drawer
        const drawerCard = document.createElement('div');
        drawerCard.className = `drawer-sticker-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}`;
        drawerCard.setAttribute('data-id', wordItem.id);

        if (isUnlocked) {
          drawerCard.setAttribute('title', `Sentuh untuk geser ${wordItem.word}`);
          drawerCard.innerHTML = `
            <div class="drawer-sticker-badge">
              ${wordItem.image ? `<img src="${wordItem.image}" alt="${wordItem.word}">` : '🎨'}
            </div>
            <div class="drawer-sticker-name">${wordItem.word}</div>
          `;
          this.attachDrawerDrag(drawerCard, wordItem);
        } else {
          drawerCard.setAttribute('title', 'Selesaikan kata di game untuk membuka stiker ini!');
          drawerCard.innerHTML = `
            <div class="drawer-sticker-badge locked-badge">
              <span class="locked-icon">🔒</span>
            </div>
            <div class="drawer-sticker-name">???</div>
          `;
        }

        this.drawerEl.appendChild(drawerCard);
      }
    });

    if (this.drawerEl.children.length === 0) {
      this.drawerEl.innerHTML = `
        <div class="drawer-empty-hint">
          ✨ Semua stiker koleksimu sudah ditempel di panorama! Keren sekali!
        </div>
      `;
    }
  }

  renderCanvasSticker(wordItem, x, y, rotation) {
    const stickerEl = document.createElement('div');
    stickerEl.className = 'canvas-placed-sticker die-cut-sticker';
    stickerEl.setAttribute('data-id', wordItem.id);
    stickerEl.style.left = `${x}px`;
    stickerEl.style.top = `${y}px`;
    stickerEl.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;

    stickerEl.innerHTML = `
      <div class="canvas-sticker-art">
        ${wordItem.image ? `<img src="${wordItem.image}" alt="${wordItem.word}">` : '🎨'}
      </div>
      <div class="canvas-sticker-tag">${wordItem.word}</div>
      <div class="canvas-sticker-remover" data-action="return-to-drawer" title="Kembalikan ke laci">✕</div>
    `;

    // Tap to interact (trigger sound & habitat reaction)
    stickerEl.addEventListener('click', (e) => {
      if (e.target.closest('.canvas-sticker-remover')) return;
      this.triggerStickerReaction(stickerEl, wordItem);
    });

    // Make placed sticker draggable across canvas
    this.attachCanvasStickerDrag(stickerEl, wordItem);

    this.placedStickersContainer.appendChild(stickerEl);
  }

  triggerStickerReaction(stickerEl, wordItem) {
    audioEngine.playPeelStick();
    stickerEl.classList.remove('jiggle-reaction');
    void stickerEl.offsetWidth; // reflow
    stickerEl.classList.add('jiggle-reaction');

    // Habitat unique reactions
    if (wordItem.id === 'ikan') {
      audioEngine.playVignetteSound('splash');
      this.spawnWaterBubbles(stickerEl);
    } else if (wordItem.id === 'mobil') {
      audioEngine.playVignetteSound('vroom');
    } else if (wordItem.id === 'kucing') {
      audioEngine.playVignetteSound('meow');
    } else if (wordItem.id === 'apel') {
      audioEngine.playVignetteSound('crunch');
    } else if (wordItem.id === 'bola') {
      audioEngine.playVignetteSound('bounce');
    } else if (wordItem.id === 'bebek') {
      audioEngine.playVignetteSound('quack');
    } else if (wordItem.id === 'singa') {
      audioEngine.playVignetteSound('roar');
    }

    // Pronounce the word
    audioEngine.speakWordSequence(wordItem);
  }

  spawnWaterBubbles(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const canvasRect = this.canvasEl.getBoundingClientRect();
    const originX = rect.left - canvasRect.left + rect.width / 2;
    const originY = rect.top - canvasRect.top;

    for (let i = 0; i < 5; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'diorama-bubble';
      bubble.style.left = `${originX + (Math.random() - 0.5) * 40}px`;
      bubble.style.top = `${originY + Math.random() * 20}px`;
      bubble.style.animationDelay = `${i * 0.12}s`;
      this.canvasEl.appendChild(bubble);

      setTimeout(() => bubble.remove(), 1400);
    }
  }

  attachDrawerDrag(drawerCard, wordItem) {
    drawerCard.style.touchAction = 'none';

    drawerCard.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();

      audioEngine.playPaperGrab();
      const initialRot = (Math.random() - 0.5) * 14;

      const ghost = document.createElement('div');
      ghost.className = 'diorama-drag-ghost die-cut-sticker';
      ghost.style.position = 'fixed';
      ghost.style.left = `${e.clientX}px`;
      ghost.style.top = `${e.clientY}px`;
      ghost.style.transform = `translate(-50%, -50%) scale(1.15) rotate(${initialRot}deg)`;
      ghost.style.zIndex = '99999';
      ghost.style.pointerEvents = 'none';
      ghost.innerHTML = `
        <div class="canvas-sticker-art">
          ${wordItem.image ? `<img src="${wordItem.image}" alt="${wordItem.word}">` : '🎨'}
        </div>
      `;
      document.body.appendChild(ghost);
      drawerCard.classList.add('is-being-dragged');

      const onPointerMove = (moveEvt) => {
        ghost.style.left = `${moveEvt.clientX}px`;
        ghost.style.top = `${moveEvt.clientY}px`;
      };

      const onPointerUp = (upEvt) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        ghost.remove();
        drawerCard.classList.remove('is-being-dragged');

        // Check if dropped inside diorama viewport
        const viewportRect = this.viewportEl.getBoundingClientRect();
        if (
          upEvt.clientX >= viewportRect.left &&
          upEvt.clientX <= viewportRect.right &&
          upEvt.clientY >= viewportRect.top &&
          upEvt.clientY <= viewportRect.bottom
        ) {
          const canvasRect = this.canvasEl.getBoundingClientRect();
          const targetX = Math.round(upEvt.clientX - canvasRect.left);
          const targetY = Math.round(upEvt.clientY - canvasRect.top);

          audioEngine.playPeelStick();
          this.saveStickerPlacement(wordItem.id, targetX, targetY, initialRot);
          this.renderStickers();
        } else {
          audioEngine.playPaperLand();
        }
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });
  }

  attachCanvasStickerDrag(stickerEl, wordItem) {
    stickerEl.style.touchAction = 'none';

    stickerEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.canvas-sticker-remover')) return;
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();

      let isMoving = false;
      const startX = e.clientX;
      const startY = e.clientY;
      const origLeft = parseFloat(stickerEl.style.left);
      const origTop = parseFloat(stickerEl.style.top);
      const rot = (Math.random() - 0.5) * 12;

      const onPointerMove = (moveEvt) => {
        const dx = moveEvt.clientX - startX;
        const dy = moveEvt.clientY - startY;

        if (!isMoving && Math.hypot(dx, dy) > 8) {
          isMoving = true;
          audioEngine.playPaperGrab();
          stickerEl.classList.add('is-dragging-on-canvas');
        }

        if (isMoving) {
          const newX = Math.max(40, Math.min(2160, origLeft + dx));
          const newY = Math.max(40, Math.min(380, origTop + dy));
          stickerEl.style.left = `${newX}px`;
          stickerEl.style.top = `${newY}px`;
          stickerEl.style.transform = `translate(-50%, -50%) scale(1.15) rotate(${rot}deg)`;
        }
      };

      const onPointerUp = (upEvt) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        if (isMoving) {
          stickerEl.classList.remove('is-dragging-on-canvas');
          audioEngine.playPeelStick();

          const finalX = parseFloat(stickerEl.style.left);
          const finalY = parseFloat(stickerEl.style.top);
          this.saveStickerPlacement(wordItem.id, finalX, finalY, rot);
          stickerEl.style.transform = `translate(-50%, -50%) scale(1) rotate(${rot}deg)`;
        }
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });
  }

  bindEvents() {
    // Close button
    const closeBtn = document.getElementById('btn-close-stickers');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        this.hide();
      });
    }

    // Reset All Placements button
    const resetBtn = document.getElementById('btn-reset-diorama');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Kembalikan semua stiker ke laci bawah untuk ditata ulang?')) {
          audioEngine.playPaperGrab();
          this.resetAllPlacements();
          this.renderStickers();
        }
      });
    }

    // Zone Jump navigation buttons
    const zoneBtns = this.containerEl.querySelectorAll('.btn-zone-jump');
    zoneBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetX = parseInt(btn.getAttribute('data-target-x'), 10) || 0;
        audioEngine.playGrab();
        if (this.viewportEl) {
          this.viewportEl.scrollTo({ left: targetX, behavior: 'smooth' });
        }
      });
    });

    // Delegation for returning sticker to drawer via ✕ button
    if (this.placedStickersContainer) {
      this.placedStickersContainer.addEventListener('click', (e) => {
        const remover = e.target.closest('.canvas-sticker-remover');
        if (!remover) return;

        const stickerCard = remover.closest('.canvas-placed-sticker');
        if (!stickerCard) return;

        const id = stickerCard.getAttribute('data-id');
        audioEngine.playPaperLand();
        this.removeStickerPlacement(id);
        this.renderStickers();
      });
    }

    // Drag-to-scroll viewport on empty canvas
    this.setupViewportDragScroll();
  }

  setupViewportDragScroll() {
    if (!this.viewportEl) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    this.viewportEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.canvas-placed-sticker')) return;
      isDown = true;
      startX = e.pageX - this.viewportEl.offsetLeft;
      scrollLeft = this.viewportEl.scrollLeft;
      this.viewportEl.style.cursor = 'grabbing';
    });

    const onPointerMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.viewportEl.offsetLeft;
      const walk = (x - startX) * 1.4; // Scroll multiplier
      this.viewportEl.scrollLeft = scrollLeft - walk;
    };

    const onPointerUp = () => {
      if (!isDown) return;
      isDown = false;
      if (this.viewportEl) this.viewportEl.style.cursor = 'grab';
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  hide() {
    this.containerEl.classList.add('hidden');
    this.containerEl.innerHTML = '';
  }
}
