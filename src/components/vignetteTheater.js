// Interactive Peel & Stick Diorama Reward Theater for Monster Phonics
// When children complete spelling a word, they peel off the physical sticker with
// realistic paper curl animations and sounds, and drag it directly onto the panorama landscape!

import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioEngine.js';
import { wordRepository } from '../services/wordRepository.js';

export class VignetteTheater {
  constructor(options = {}) {
    this.containerEl = options.containerEl;
    this.stickerBook = options.stickerBook || null;
    this.onNextWord = options.onNextWord || (() => {});
    this.onOpenStickerBook = options.onOpenStickerBook || (() => {});
    this.onSaveSticker = options.onSaveSticker || (() => {});

    this.currentWordData = null;
    this.isPlaced = false;
    this.isDragging = false;
    this.viewportEl = null;
    this.canvasEl = null;
    this.peelStickerEl = null;
    this.dragGhostEl = null;
    this.autoScrollTimer = null;
  }

  show(wordData) {
    this.currentWordData = wordData;
    this.isPlaced = false;
    this.isDragging = false;

    // Save unlock progress immediately
    if (this.stickerBook) {
      this.stickerBook.saveCompletedWord(wordData.id);
    } else {
      this.onSaveSticker(wordData.id);
    }

    // Play celebration sound & speak word sequence
    audioEngine.playVignetteSound(wordData.vignette?.actionSound || 'cheer');
    audioEngine.speakWordSequence(wordData);
    this.triggerConfetti();

    // Render Peel & Stick Theater DOM
    this.containerEl.innerHTML = `
      <div class="peel-theater-backdrop diorama-backdrop" role="dialog" aria-modal="true">
        <div class="peel-theater-window animate-pop-in">
          <!-- Washi tape at top of paper frame -->
          <div class="washi-tape" aria-hidden="true"></div>

          <!-- Top Header: Word Title, Audio, and Close -->
          <div class="peel-theater-header">
            <div class="peel-word-info">
              <span class="peel-category-pill">${wordData.category}</span>
              <div class="peel-title-row">
                <h2 class="peel-word-title">${wordData.word}</h2>
                <button type="button" class="sound-repeat-btn" id="btn-peel-replay-audio" aria-label="Dengarkan Pengucapan Kata" title="Dengarkan Suara">
                  <span class="btn-icon">🔊</span>
                  <span>Dengarkan</span>
                </button>
              </div>
            </div>

            <div class="peel-header-right">
              <div class="peel-meaning-bubble">
                <span class="bubble-icon">💡</span>
                <span class="bubble-text">${wordData.meaning}</span>
              </div>
              <button type="button" class="btn-close-modal btn-peel-close" id="btn-peel-close" aria-label="Tutup">✕</button>
            </div>
          </div>

          <!-- Status & Instruction Banner -->
          <div class="peel-status-banner" id="peel-status-banner">
            <span class="banner-icon">✨</span>
            <span class="banner-text" id="peel-instruction-text">
              Kopek stiker <strong>${wordData.word}</strong> di bawah, lalu seret dan tempel ke pemandangan dunia!
            </span>
          </div>

          <!-- Diorama Panorama Viewport (The Drop Target Stage) -->
          <div class="peel-diorama-section">
            <div class="peel-zone-nav-bar">
              <span class="peel-nav-title">🗺️ Zona Panorama:</span>
              <div class="peel-zone-buttons">
                <button type="button" class="btn-peel-zone" data-x="0" title="Ke Padang Rumput">🌳 Taman</button>
                <button type="button" class="btn-peel-zone" data-x="550" title="Ke Sungai Ceria">🐠 Sungai</button>
                <button type="button" class="btn-peel-zone" data-x="1100" title="Ke Kota Ceria">🚗 Kota</button>
                <button type="button" class="btn-peel-zone" data-x="1650" title="Ke Langit Bintang">☁️ Langit</button>
              </div>
            </div>

            <div class="peel-diorama-viewport" id="peel-diorama-viewport">
              <div class="peel-diorama-canvas" id="peel-diorama-canvas">
                <!-- Drop Guide Target Indicator -->
                <div class="peel-drop-target-hint" id="peel-drop-target-hint">
                  <span class="drop-pulse-ring"></span>
                  <span class="drop-label">🎯 Tempel Stiker di Sini!</span>
                </div>

                <!-- Existing placed stickers layer -->
                <div class="peel-existing-stickers-layer" id="peel-existing-stickers-layer"></div>

                <!-- Active newly placed sticker holder -->
                <div class="peel-active-sticker-layer" id="peel-active-sticker-layer"></div>
              </div>
            </div>
          </div>

          <!-- Bottom Peel Sheet Tray (Wax Paper Release Backing) -->
          <div class="peel-bottom-tray">
            <div class="peel-wax-card" id="peel-wax-card">
              <!-- Ghost outline when sticker is peeled away -->
              <div class="peel-wax-ghost" id="peel-wax-ghost">
                <span class="ghost-star">⭐</span>
                <span class="ghost-text">Stiker Terbuka & Dikelupas!</span>
              </div>

              <!-- The Peelable Sticker with Curl Effect -->
              <div class="peelable-sticker-item" id="peelable-sticker-item">
                <!-- 3D folded corner cue -->
                <div class="peel-corner-fold" aria-hidden="true"></div>
                <div class="peel-sticker-art">
                  <img src="${wordData.image}" alt="${wordData.word}" draggable="false">
                </div>
                <div class="peel-sticker-tag">${wordData.word}</div>
                <div class="peel-curl-badge" id="peel-curl-badge">
                  <span class="peel-hand-emoji">👆</span>
                  <span>Kopek & Tarik!</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons Group (Revealed after sticking or skip) -->
            <div class="peel-actions-group" id="peel-actions-group">
              <button type="button" class="btn-primary-fun btn-peel-next" id="btn-peel-next">
                <span>Lanjut Kata Berikutnya</span>
                <span class="btn-arrow">➔</span>
              </button>
              <button type="button" class="btn-paper btn-peel-album" id="btn-peel-album" title="Lihat dan rapikan semua koleksi di album penuh">
                <span>🗺️ Lihat Album Penuh</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    this.containerEl.classList.remove('hidden');

    // Cache elements
    this.viewportEl = document.getElementById('peel-diorama-viewport');
    this.canvasEl = document.getElementById('peel-diorama-canvas');
    this.peelStickerEl = document.getElementById('peelable-sticker-item');
    this.dropHintEl = document.getElementById('peel-drop-target-hint');
    this.existingLayerEl = document.getElementById('peel-existing-stickers-layer');
    this.activeLayerEl = document.getElementById('peel-active-sticker-layer');
    this.waxGhostEl = document.getElementById('peel-wax-ghost');
    this.actionsGroupEl = document.getElementById('peel-actions-group');
    this.statusBannerEl = document.getElementById('peel-status-banner');
    this.instructionTextEl = document.getElementById('peel-instruction-text');

    // Render any already existing diorama stickers so world looks populated
    this.renderExistingDioramaStickers();

    // Scroll panorama into the most appropriate zone for this word
    this.autoFocusWordZone(wordData);

    // Bind interaction events
    this.bindEvents(wordData);
  }

  autoFocusWordZone(wordData) {
    if (!this.viewportEl) return;
    let targetX = 0;
    const cat = (wordData.category || '').toLowerCase();
    const id = wordData.id;

    if (cat.includes('ikan') || id === 'ikan' || id === 'bebek') {
      targetX = 550; // Sungai
    } else if (cat.includes('benda') || id === 'mobil' || id === 'kereta') {
      targetX = 1100; // Kota
    } else if (cat.includes('alam') || id === 'bintang' || id === 'awan') {
      targetX = 1650; // Langit
    } else {
      targetX = 0; // Meadow
    }

    setTimeout(() => {
      if (this.viewportEl) {
        this.viewportEl.scrollTo({ left: targetX, behavior: 'smooth' });
      }
    }, 150);
  }

  renderExistingDioramaStickers() {
    if (!this.existingLayerEl) return;
    this.existingLayerEl.innerHTML = '';

    const placements = this.getPlacements();
    const words = wordRepository.getWords();

    Object.keys(placements).forEach((wordId) => {
      if (wordId === this.currentWordData?.id) return;

      const p = placements[wordId];
      if (!p || !p.isPlaced) return;

      const wordItem = words.find(w => w.id === wordId);
      if (!wordItem) return;

      const sticker = document.createElement('div');
      sticker.className = 'canvas-placed-sticker die-cut-sticker existing-placed-sticker';
      sticker.style.left = `${p.x}px`;
      sticker.style.top = `${p.y}px`;
      sticker.style.transform = `translate(-50%, -50%) rotate(${p.rotation || 0}deg)`;
      sticker.innerHTML = `
        <div class="canvas-sticker-art">
          <img src="${wordItem.image}" alt="${wordItem.word}">
        </div>
        <div class="canvas-sticker-tag">${wordItem.word}</div>
      `;
      this.existingLayerEl.appendChild(sticker);
    });
  }

  getPlacements() {
    if (this.stickerBook && typeof this.stickerBook.getStickerPlacements === 'function') {
      return this.stickerBook.getStickerPlacements();
    }
    try {
      const stored = localStorage.getItem('monster_phonics_diorama_stickers');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  savePlacement(wordId, x, y, rotation = 0) {
    if (this.stickerBook && typeof this.stickerBook.saveStickerPlacement === 'function') {
      this.stickerBook.saveStickerPlacement(wordId, x, y, rotation);
      return;
    }
    try {
      const placements = this.getPlacements();
      placements[wordId] = { x, y, rotation, isPlaced: true };
      localStorage.setItem('monster_phonics_diorama_stickers', JSON.stringify(placements));
    } catch {}
  }

  bindEvents(wordData) {
    // Replay Audio
    const replayBtn = document.getElementById('btn-peel-replay-audio');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        audioEngine.speakWordSequence(wordData);
      });
    }

    // Close Button
    const closeBtn = document.getElementById('btn-peel-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        this.hide();
      });
    }

    // Zone Jump Nav Buttons
    const zoneBtns = this.containerEl.querySelectorAll('.btn-peel-zone');
    zoneBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        audioEngine.playGrab();
        const targetX = parseInt(e.currentTarget.getAttribute('data-x') || '0', 10);
        if (this.viewportEl) {
          this.viewportEl.scrollTo({ left: targetX, behavior: 'smooth' });
        }
      });
    });

    // Next Word Button
    const nextBtn = document.getElementById('btn-peel-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        this.hide();
        this.onNextWord();
      });
    }

    // Full Album Button
    const albumBtn = document.getElementById('btn-peel-album');
    if (albumBtn) {
      albumBtn.addEventListener('click', () => {
        audioEngine.playGrab();
        this.hide();
        this.onOpenStickerBook();
      });
    }

    // Attach Pointer / Drag-to-Diorama on the peelable sticker
    this.attachPeelAndStickGestures(wordData);
  }

  attachPeelAndStickGestures(wordData) {
    const sticker = this.peelStickerEl;
    if (!sticker) return;

    let startX = 0;
    let startY = 0;
    let isPeeling = false;
    let ghostEl = null;
    let moveDistance = 0;

    const onPointerDown = (e) => {
      if (this.isPlaced) return;
      e.preventDefault();

      startX = e.clientX;
      startY = e.clientY;
      moveDistance = 0;
      isPeeling = true;

      // Play authentic adhesive peeling sound!
      audioEngine.playPeelStick();
      audioEngine.triggerHaptic(25);

      // Create floating drag clone
      ghostEl = sticker.cloneNode(true);
      ghostEl.classList.add('is-peeling-active', 'peel-floating-ghost');
      const badge = ghostEl.querySelector('.peel-curl-badge');
      if (badge) badge.remove();

      document.body.appendChild(ghostEl);
      this.updateGhostPosition(ghostEl, e.clientX, e.clientY);

      // Hide original item and reveal wax ghost
      sticker.style.visibility = 'hidden';
      if (this.waxGhostEl) this.waxGhostEl.classList.add('visible');

      // Highlight drop target in diorama
      if (this.dropHintEl) {
        this.dropHintEl.classList.add('active-hint');
      }

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isPeeling || !ghostEl) return;
      e.preventDefault();

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      moveDistance = Math.hypot(dx, dy);

      this.updateGhostPosition(ghostEl, e.clientX, e.clientY);

      // Check auto-scroll diorama viewport when near horizontal edges
      if (this.viewportEl) {
        const vRect = this.viewportEl.getBoundingClientRect();
        if (e.clientY >= vRect.top && e.clientY <= vRect.bottom) {
          const edgeThreshold = 60;
          if (e.clientX < vRect.left + edgeThreshold) {
            this.startAutoScroll(-14);
          } else if (e.clientX > vRect.right - edgeThreshold) {
            this.startAutoScroll(14);
          } else {
            this.stopAutoScroll();
          }
        } else {
          this.stopAutoScroll();
        }
      }
    };

    const onPointerUp = (e) => {
      if (!isPeeling) return;
      isPeeling = false;
      this.stopAutoScroll();

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (!ghostEl) return;

      const viewportRect = this.viewportEl.getBoundingClientRect();
      const canvasRect = this.canvasEl.getBoundingClientRect();

      const isInsideDiorama = (
        e.clientX >= viewportRect.left &&
        e.clientX <= viewportRect.right &&
        e.clientY >= viewportRect.top &&
        e.clientY <= viewportRect.bottom
      );

      // If user performed a simple tap/click (<15px movement) or dropped inside diorama:
      if (isInsideDiorama) {
        const dropX = Math.round(e.clientX - canvasRect.left);
        const dropY = Math.round(e.clientY - canvasRect.top);
        this.finalizePlacement(wordData, dropX, dropY, ghostEl);
      } else if (moveDistance < 15) {
        // Child just tapped/clicked the sticker! Smoothly glide it into the center of visible diorama!
        const visibleCenterX = Math.round(this.viewportEl.scrollLeft + viewportRect.width / 2);
        const visibleCenterY = Math.round(viewportRect.height * 0.55);
        this.animateGlideToCanvas(ghostEl, visibleCenterX, visibleCenterY, wordData);
      } else {
        // Released outside: glide gracefully to nearest visible spot on canvas so child never fails!
        const autoX = Math.round(this.viewportEl.scrollLeft + viewportRect.width / 2);
        const autoY = Math.round(viewportRect.height * 0.55);
        this.animateGlideToCanvas(ghostEl, autoX, autoY, wordData);
      }
    };

    sticker.addEventListener('pointerdown', onPointerDown);
  }

  updateGhostPosition(ghostEl, clientX, clientY) {
    if (!ghostEl) return;
    ghostEl.style.left = `${clientX}px`;
    ghostEl.style.top = `${clientY}px`;
  }

  startAutoScroll(speed) {
    if (this.autoScrollTimer) return;
    this.autoScrollTimer = setInterval(() => {
      if (this.viewportEl) {
        this.viewportEl.scrollLeft += speed;
      }
    }, 20);
  }

  stopAutoScroll() {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
  }

  animateGlideToCanvas(ghostEl, targetCanvasX, targetCanvasY, wordData) {
    const canvasRect = this.canvasEl.getBoundingClientRect();
    const targetScreenX = canvasRect.left + targetCanvasX;
    const targetScreenY = canvasRect.top + targetCanvasY;

    ghostEl.style.transition = 'all 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    ghostEl.style.left = `${targetScreenX}px`;
    ghostEl.style.top = `${targetScreenY}px`;
    ghostEl.style.transform = 'translate(-50%, -50%) scale(1.15) rotate(4deg)';

    setTimeout(() => {
      this.finalizePlacement(wordData, targetCanvasX, targetCanvasY, ghostEl);
    }, 450);
  }

  finalizePlacement(wordData, x, y, ghostEl) {
    if (ghostEl && ghostEl.parentNode) {
      ghostEl.remove();
    }

    // Clamp coordinates safely within diorama canvas boundaries
    const clampedX = Math.max(50, Math.min(2150, x));
    const clampedY = Math.max(50, Math.min(this.canvasEl.clientHeight - 50, y));

    // Create the permanent placed sticker element
    const placedEl = document.createElement('div');
    placedEl.className = 'canvas-placed-sticker die-cut-sticker newly-placed-glow jiggle-reaction';
    placedEl.setAttribute('data-id', wordData.id);
    placedEl.style.left = `${clampedX}px`;
    placedEl.style.top = `${clampedY}px`;
    placedEl.style.transform = `translate(-50%, -50%) rotate(${Math.floor(Math.random() * 8 - 4)}deg)`;

    placedEl.innerHTML = `
      <div class="canvas-sticker-art">
        <img src="${wordData.image}" alt="${wordData.word}">
      </div>
      <div class="canvas-sticker-tag">${wordData.word}</div>
    `;

    // Snap sound effect!
    audioEngine.playTapeSnap();
    audioEngine.triggerHaptic(30);

    // Add to active layer
    if (this.activeLayerEl) {
      this.activeLayerEl.appendChild(placedEl);
    }

    // Save placement permanently
    this.savePlacement(wordData.id, clampedX, clampedY, 0);
    this.isPlaced = true;

    // Trigger sparkles & confetti burst right above the sticker!
    this.triggerDropConfetti(clampedX, clampedY);

    // Make newly placed sticker re-draggable across the canvas if child wants to adjust!
    this.attachRepositionDrag(placedEl, wordData);

    // Update Status Banner
    if (this.statusBannerEl) {
      this.statusBannerEl.classList.add('status-success');
    }
    if (this.instructionTextEl) {
      this.instructionTextEl.innerHTML = `
        🎉 <strong>Luar Biasa!</strong> Stiker <strong>${wordData.word}</strong> berhasil kamu tempel di dunia diorama!
      `;
    }

    // Hide drop target hint
    if (this.dropHintEl) {
      this.dropHintEl.classList.remove('active-hint');
    }

    // Reveal Action Buttons smoothly
    if (this.actionsGroupEl) {
      this.actionsGroupEl.classList.add('animate-pop-in');
      this.actionsGroupEl.style.display = 'flex';
    }
  }

  attachRepositionDrag(stickerEl, wordData) {
    let isMoving = false;

    stickerEl.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isMoving = true;
      audioEngine.playGrab();

      const rect = this.canvasEl.getBoundingClientRect();
      const onMove = (moveEvt) => {
        if (!isMoving) return;
        const curX = Math.round(moveEvt.clientX - rect.left);
        const curY = Math.round(moveEvt.clientY - rect.top);
        stickerEl.style.left = `${curX}px`;
        stickerEl.style.top = `${curY}px`;
      };

      const onUp = () => {
        if (!isMoving) return;
        isMoving = false;
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);

        audioEngine.playPaperLand();
        const finalX = parseInt(stickerEl.style.left, 10);
        const finalY = parseInt(stickerEl.style.top, 10);
        this.savePlacement(wordData.id, finalX, finalY, 0);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  triggerDropConfetti(canvasX, canvasY) {
    if (!this.viewportEl) return;
    const viewportRect = this.viewportEl.getBoundingClientRect();
    const screenX = canvasX - this.viewportEl.scrollLeft + viewportRect.left;
    const originX = Math.max(0.1, Math.min(0.9, screenX / window.innerWidth));
    const originY = Math.max(0.1, Math.min(0.9, (viewportRect.top + 80) / window.innerHeight));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#FFD166', '#06D6A0', '#FF7582', '#62B6CB', '#CDB4DB']
    });
  }

  triggerConfetti() {
    confetti({
      particleCount: 65,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#FF7582', '#FFD166', '#7AE7C7', '#62B6CB', '#CDB4DB']
    });
  }

  hide() {
    this.stopAutoScroll();
    this.containerEl.classList.add('hidden');
    this.containerEl.innerHTML = '';
  }
}
