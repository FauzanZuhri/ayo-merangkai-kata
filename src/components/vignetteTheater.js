// Interactive Peel & Stick Diorama Reward Theater for Monster Phonics
// When children complete spelling a word, they peel off the physical sticker with
// realistic paper curl animations and sounds, and drag it directly onto its dedicated habitat strip!

import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioEngine.js';
import { wordRepository } from '../services/wordRepository.js';
import { DIORAMA_SLOTS, getSlotForWord } from '../data/dioramaSlots.js';

export class VignetteTheater {
  constructor(options = {}) {
    this.containerEl = options.containerEl;
    this.stickerBook = options.stickerBook || null;
    this.onNextWord = options.onNextWord || (() => {});
    this.onOpenStickerBook = options.onOpenStickerBook || (() => {});
    this.onSaveSticker = options.onSaveSticker || (() => {});

    this.currentWordData = null;
    this.targetSlot = null;
    this.isPlaced = false;
    this.isDragging = false;
    this.viewportEl = null;
    this.canvasEl = null;
    this.peelStickerEl = null;
    this.waxGhostEl = null;
    this.actionsGroupEl = null;
    this.statusBannerEl = null;
    this.instructionTextEl = null;
    this.autoScrollTimer = null;
    this.targetStripEl = null;
  }

  show(wordData) {
    this.currentWordData = wordData;
    this.targetSlot = getSlotForWord(wordData.id);
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

          <!-- Top Header: Clean, Kid-Friendly Scrapbook Banner -->
          <div class="peel-theater-header">
            <div class="peel-header-left">
              <div class="peel-badge-row">
                <span class="peel-category-pill">${wordData.category}</span>
                <span class="peel-success-tag">🎉 Kata Selesai!</span>
              </div>
              <div class="peel-title-row">
                <h2 class="peel-word-title">${wordData.word}</h2>
                <button type="button" class="btn-paper-audio" id="btn-peel-replay-audio" aria-label="Dengarkan Suara Kata">
                  <span class="btn-icon">🔊</span>
                  <span>Dengarkan</span>
                </button>
              </div>
            </div>

            <div class="peel-header-center">
              <div class="peel-story-card">
                <span class="story-card-icon">💡</span>
                <div class="story-card-body">
                  <div class="story-card-meaning">${wordData.meaning}</div>
                  ${wordData.vignette?.storyText ? `<div class="story-card-tagline">“${wordData.vignette.storyText}”</div>` : ''}
                </div>
              </div>
            </div>

            <div class="peel-header-right">
              <button type="button" class="btn-peel-close" id="btn-peel-close" aria-label="Tutup">✕</button>
            </div>
          </div>

          <!-- Guidance / Instruction Ribbon -->
          <div class="peel-status-banner" id="peel-status-banner">
            <span class="banner-icon">🎯</span>
            <span class="banner-text" id="peel-instruction-text">
              Kopek stiker <strong>${wordData.word}</strong> di bawah, lalu pasang tepat di strip <strong>${this.targetSlot.hint}</strong>!
            </span>
          </div>

          <!-- Diorama Panorama Section with Zone Selector and Slide Controls -->
          <div class="peel-diorama-section">
            <div class="peel-zone-nav-bar">
              <div class="peel-zone-tabs">
                <button type="button" class="btn-peel-zone" data-x="0" title="Ke Padang Rumput">🌳 Padang Rumput</button>
                <button type="button" class="btn-peel-zone" data-x="550" title="Ke Sungai Ceria">🐠 Sungai & Danau</button>
                <button type="button" class="btn-peel-zone" data-x="1100" title="Ke Kota Ceria">🚗 Kota & Jalan</button>
                <button type="button" class="btn-peel-zone" data-x="1650" title="Ke Langit Bintang">☁️ Langit Bintang</button>
              </div>
              <div class="peel-scroll-hint-text">Geser layar atau klik zona ➔</div>
            </div>

            <div class="peel-viewport-wrapper">
              <!-- Left and Right Slide Arrows for Easy Touch Scrolling -->
              <button type="button" class="btn-diorama-slide btn-slide-prev" id="btn-slide-prev" aria-label="Geser ke kiri">◀</button>
              <button type="button" class="btn-diorama-slide btn-slide-next" id="btn-slide-next" aria-label="Geser ke kanan">▶</button>

              <!-- Horizontal Panorama Viewport -->
              <div class="peel-diorama-viewport" id="peel-diorama-viewport">
                <div class="peel-diorama-canvas" id="peel-diorama-canvas">
                  <!-- Strips / Designated Placement Slots Layer -->
                  <div class="peel-strips-layer" id="peel-strips-layer"></div>

                  <!-- Existing placed stickers layer -->
                  <div class="peel-existing-stickers-layer" id="peel-existing-stickers-layer"></div>

                  <!-- Active newly placed sticker holder -->
                  <div class="peel-active-sticker-layer" id="peel-active-sticker-layer"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Peel Sheet Tray (Wax Paper Release Backing) -->
          <div class="peel-bottom-tray">
            <div class="peel-tray-content">
              <!-- Glossy Wax Paper Card -->
              <div class="peel-wax-card" id="peel-wax-card">
                <!-- Ghost outline when sticker is peeled away -->
                <div class="peel-wax-ghost" id="peel-wax-ghost">
                  <span class="ghost-star">⭐</span>
                  <span class="ghost-text">Stiker Dikelupas! Menempel di Panorama</span>
                </div>

                <!-- The Peelable Sticker with Curl Effect -->
                <div class="peelable-sticker-item" id="peelable-sticker-item">
                  <!-- 3D folded corner cue -->
                  <div class="peel-corner-fold" aria-hidden="true"></div>
                  <div class="peel-sticker-art">
                    <img src="${wordData.image}" alt="${wordData.word}" draggable="false">
                  </div>
                  <div class="peel-sticker-tag">${wordData.word}</div>
                </div>
              </div>

              <!-- Interactive Peeling Call to Action Prompt -->
              <div class="peel-prompt-box" id="peel-prompt-box">
                <div class="peel-prompt-arrow">⬆️</div>
                <div class="peel-prompt-text">
                  <strong>Sentuh & Kopek Stiker!</strong>
                  <span>Tarik ke strip bertanda <strong>🎯 ${this.targetSlot.word}</strong></span>
                </div>
              </div>

              <!-- Action Buttons Group (Revealed after sticking down) -->
              <div class="peel-actions-group" id="peel-actions-group">
                <button type="button" class="btn-primary-fun btn-peel-next" id="btn-peel-next">
                  <span>Lanjut Kata Berikutnya</span>
                  <span class="btn-arrow">➔</span>
                </button>
                <button type="button" class="btn-paper btn-peel-album" id="btn-peel-album" title="Buka seluruh album panorama">
                  <span>🗺️ Lihat Album Penuh</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    this.containerEl.classList.remove('hidden');

    // Cache elements
    this.viewportEl = document.getElementById('peel-diorama-viewport');
    this.canvasEl = document.getElementById('peel-diorama-canvas');
    this.stripsLayerEl = document.getElementById('peel-strips-layer');
    this.peelStickerEl = document.getElementById('peelable-sticker-item');
    this.promptBoxEl = document.getElementById('peel-prompt-box');
    this.existingLayerEl = document.getElementById('peel-existing-stickers-layer');
    this.activeLayerEl = document.getElementById('peel-active-sticker-layer');
    this.waxGhostEl = document.getElementById('peel-wax-ghost');
    this.actionsGroupEl = document.getElementById('peel-actions-group');
    this.statusBannerEl = document.getElementById('peel-status-banner');
    this.instructionTextEl = document.getElementById('peel-instruction-text');

    // Render the structured strip slots across the diorama panorama
    this.renderDioramaStrips(wordData);

    // Render any previously placed stickers
    this.renderExistingDioramaStickers();

    // Scroll panorama directly to the target slot zone
    this.scrollToTargetSlot();

    // Bind interaction events
    this.bindEvents(wordData);
  }

  renderDioramaStrips(currentWord) {
    if (!this.stripsLayerEl) return;
    this.stripsLayerEl.innerHTML = '';

    const placements = this.getPlacements();

    Object.keys(DIORAMA_SLOTS).forEach(wordId => {
      const slot = DIORAMA_SLOTS[wordId];
      const isTarget = wordId === currentWord.id;
      const isAlreadyPlaced = placements[wordId] && placements[wordId].isPlaced && !isTarget;

      const stripEl = document.createElement('div');
      stripEl.className = `diorama-slot-strip ${isTarget ? 'is-target-strip' : ''} ${isAlreadyPlaced ? 'is-filled-strip' : ''}`;
      stripEl.setAttribute('data-word-id', wordId);
      stripEl.style.left = `${slot.x}px`;
      stripEl.style.top = `${slot.y}px`;

      stripEl.innerHTML = `
        <div class="strip-dashed-frame">
          <span class="strip-icon">${slot.icon}</span>
          ${isTarget ? `<span class="strip-target-pulse">🎯</span>` : ''}
        </div>
        <div class="strip-label-ribbon">${slot.word}</div>
      `;

      if (isTarget) {
        this.targetStripEl = stripEl;
      }

      this.stripsLayerEl.appendChild(stripEl);
    });
  }

  scrollToTargetSlot() {
    if (!this.viewportEl || !this.targetSlot) return;
    const targetScrollX = Math.max(0, this.targetSlot.x - 300);

    setTimeout(() => {
      if (this.viewportEl) {
        this.viewportEl.scrollTo({ left: targetScrollX, behavior: 'smooth' });
        this.updateActiveZoneTab(targetScrollX);
      }
    }, 120);
  }

  updateActiveZoneTab(scrollX) {
    const tabs = this.containerEl.querySelectorAll('.btn-peel-zone');
    let activeIdx = 0;
    if (scrollX >= 1500) activeIdx = 3;
    else if (scrollX >= 950) activeIdx = 2;
    else if (scrollX >= 400) activeIdx = 1;

    tabs.forEach((tab, i) => {
      tab.classList.toggle('active-zone-tab', i === activeIdx);
    });
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

      const slot = getSlotForWord(wordId);
      const posX = p.x || slot.x;
      const posY = p.y || slot.y;

      const sticker = document.createElement('div');
      sticker.className = 'canvas-placed-sticker die-cut-sticker existing-placed-sticker';
      sticker.style.left = `${posX}px`;
      sticker.style.top = `${posY}px`;
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
          this.updateActiveZoneTab(targetX);
        }
      });
    });

    // Left & Right Slide Arrow Buttons
    const btnPrev = document.getElementById('btn-slide-prev');
    const btnNext = document.getElementById('btn-slide-next');
    if (btnPrev && this.viewportEl) {
      btnPrev.addEventListener('click', () => {
        audioEngine.playGrab();
        this.viewportEl.scrollBy({ left: -380, behavior: 'smooth' });
      });
    }
    if (btnNext && this.viewportEl) {
      btnNext.addEventListener('click', () => {
        audioEngine.playGrab();
        this.viewportEl.scrollBy({ left: 380, behavior: 'smooth' });
      });
    }

    // Listen to viewport scroll to update active zone tab
    if (this.viewportEl) {
      this.viewportEl.addEventListener('scroll', () => {
        this.updateActiveZoneTab(this.viewportEl.scrollLeft);
      }, { passive: true });
    }

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

    // Attach Pointer / Drag Gestures on the peelable sticker
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

      document.body.appendChild(ghostEl);
      this.updateGhostPosition(ghostEl, e.clientX, e.clientY);

      // Hide original item and reveal wax ghost
      sticker.style.visibility = 'hidden';
      if (this.waxGhostEl) this.waxGhostEl.classList.add('visible');
      if (this.promptBoxEl) this.promptBoxEl.style.opacity = '0.35';

      // Highlight target strip prominently
      if (this.targetStripEl) {
        this.targetStripEl.classList.add('strip-magnet-active');
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

      // Check magnetic hover over target strip
      if (this.targetStripEl && this.canvasEl) {
        const canvasRect = this.canvasEl.getBoundingClientRect();
        const curCanvasX = e.clientX - canvasRect.left;
        const curCanvasY = e.clientY - canvasRect.top;
        const distToTarget = Math.hypot(curCanvasX - this.targetSlot.x, curCanvasY - this.targetSlot.y);

        if (distToTarget < 90) {
          this.targetStripEl.classList.add('slot-hover-snap');
        } else {
          this.targetStripEl.classList.remove('slot-hover-snap');
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

      // Check if dropped near the target strip or inside diorama
      if (isInsideDiorama) {
        const dropCanvasX = e.clientX - canvasRect.left;
        const dropCanvasY = e.clientY - canvasRect.top;
        const distToTarget = Math.hypot(dropCanvasX - this.targetSlot.x, dropCanvasY - this.targetSlot.y);

        // If dropped anywhere in the diorama or near target:
        // Snap directly to the dedicated strip slot for this word!
        if (distToTarget < 140 || moveDistance > 20) {
          this.animateSnapToSlot(ghostEl, this.targetSlot.x, this.targetSlot.y, wordData);
        } else {
          this.animateSnapToSlot(ghostEl, this.targetSlot.x, this.targetSlot.y, wordData);
        }
      } else if (moveDistance < 15) {
        // Child just tapped/clicked the sticker! Smoothly fly it straight into its designated strip!
        this.animateSnapToSlot(ghostEl, this.targetSlot.x, this.targetSlot.y, wordData);
      } else {
        // Released outside: glide gracefully into its dedicated strip slot so child never fails!
        this.animateSnapToSlot(ghostEl, this.targetSlot.x, this.targetSlot.y, wordData);
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

  animateSnapToSlot(ghostEl, slotX, slotY, wordData) {
    if (!this.canvasEl || !this.viewportEl) {
      this.finalizePlacement(wordData, slotX, slotY, ghostEl);
      return;
    }

    const canvasRect = this.canvasEl.getBoundingClientRect();
    const targetScreenX = canvasRect.left + slotX;
    const targetScreenY = canvasRect.top + slotY;

    ghostEl.style.transition = 'all 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    ghostEl.style.left = `${targetScreenX}px`;
    ghostEl.style.top = `${targetScreenY}px`;
    ghostEl.style.transform = 'translate(-50%, -50%) scale(1.05) rotate(0deg)';

    setTimeout(() => {
      this.finalizePlacement(wordData, slotX, slotY, ghostEl);
    }, 380);
  }

  finalizePlacement(wordData, x, y, ghostEl) {
    if (ghostEl && ghostEl.parentNode) {
      ghostEl.remove();
    }

    // Place the sticker cleanly on the active layer
    const placedEl = document.createElement('div');
    placedEl.className = 'canvas-placed-sticker die-cut-sticker newly-placed-glow jiggle-reaction';
    placedEl.setAttribute('data-id', wordData.id);
    placedEl.style.left = `${x}px`;
    placedEl.style.top = `${y}px`;
    placedEl.style.transform = 'translate(-50%, -50%) rotate(0deg)';

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

    // Mark the target strip as successfully filled
    if (this.targetStripEl) {
      this.targetStripEl.classList.remove('is-target-strip', 'strip-magnet-active', 'slot-hover-snap');
      this.targetStripEl.classList.add('is-filled-strip');
    }

    // Save placement permanently
    this.savePlacement(wordData.id, x, y, 0);
    this.isPlaced = true;

    // Trigger sparkles & confetti burst right at the slot!
    this.triggerDropConfetti(x, y);

    // Update Status Banner with high joy
    if (this.statusBannerEl) {
      this.statusBannerEl.classList.add('status-success');
    }
    if (this.instructionTextEl) {
      this.instructionTextEl.innerHTML = `
        🎉 <strong>Sempurna!</strong> Stiker <strong>${wordData.word}</strong> telah terpasang rapi di strip habitatnya!
      `;
    }

    // Hide prompt box and reveal Action Buttons smoothly
    if (this.promptBoxEl) {
      this.promptBoxEl.style.display = 'none';
    }
    if (this.actionsGroupEl) {
      this.actionsGroupEl.classList.add('animate-pop-in');
      this.actionsGroupEl.style.display = 'flex';
    }
  }

  triggerDropConfetti(canvasX, canvasY) {
    if (!this.viewportEl) return;
    const viewportRect = this.viewportEl.getBoundingClientRect();
    const screenX = canvasX - this.viewportEl.scrollLeft + viewportRect.left;
    const originX = Math.max(0.1, Math.min(0.9, screenX / window.innerWidth));
    const originY = Math.max(0.1, Math.min(0.9, (viewportRect.top + 70) / window.innerHeight));

    confetti({
      particleCount: 55,
      spread: 65,
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
