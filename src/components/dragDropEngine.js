// Drag and Drop Engine for Monster Phonics
// Full Pointer Events support (Mouse, Touch, Stylus)
// Provides real-time phonics sound looping, bouncy physics, and snapping feedback

import { audioEngine } from '../services/audioEngine.js';
import { createMonsterSVG } from './monsterFactory.js';

export class DragDropEngine {
  constructor(options = {}) {
    this.targetBoardEl = options.targetBoardEl;
    this.trayEl = options.trayEl;
    this.onWordCompleted = options.onWordCompleted || (() => {});
    this.activePointerId = null;
    this.activeMonsterEl = null;
    this.activeSlot = null;
    this.dragGhost = null;
    this.originRect = null;
    this.targetSlots = [];
    this.prevX = 0;
    this.prevY = 0;
    this.velocityX = 0;
    this.isDragging = false;
    this.pickupAngle = 0;
    this.topZIndex = 30;
    this._wordCompletionPending = false;
  }

  setTargetSlots(slots) {
    this.targetSlots = slots;
    this._wordCompletionPending = false;
  }

  /**
   * Scatters letter cards organically across the play desk
   * Uses a grid-based layout with organic jitter so letters never overlap
   */
  scatterLetters() {
    if (!this.trayEl) return;
    const cards = Array.from(this.trayEl.querySelectorAll('.monster-letter-card:not(.is-placed)'));
    if (cards.length === 0) return;

    const rect = this.trayEl.getBoundingClientRect();
    const deskW = rect.width > 0 ? rect.width : (this.trayEl.clientWidth || 360);
    const deskH = rect.height > 0 ? rect.height : (this.trayEl.clientHeight || 280);

    const cardW = Math.min(80, Math.max(56, deskW * 0.16));
    const cardH = cardW * 1.15;
    const pad = 14;

    const n = cards.length;
    // Strict grid so cards never overlap: distribute cells evenly
    const cols = Math.max(1, Math.min(n, Math.floor((deskW - pad * 2) / (cardW + 10))));
    const rows = Math.ceil(n / cols);

    const cellW = (deskW - pad * 2) / cols;
    const cellH = Math.max(cardH + 8, (deskH - pad * 2) / rows);

    // Max jitter is half of remaining space in each cell, clamped so cards stay inside cell
    const maxJitterX = Math.max(0, (cellW - cardW) / 2 - 4);
    const maxJitterY = Math.max(0, (cellH - cardH) / 2 - 4);

    cards.forEach((card, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const jitterX = (Math.random() - 0.5) * 2 * maxJitterX;
      const jitterY = (Math.random() - 0.5) * 2 * maxJitterY;

      const posX = Math.max(pad, Math.min(deskW - cardW - pad, pad + col * cellW + (cellW - cardW) / 2 + jitterX));
      const posY = Math.max(pad, Math.min(deskH - cardH - pad, pad + row * cellH + (cellH - cardH) / 2 + jitterY));
      const randomRot = (Math.random() - 0.5) * 22; // -11deg to +11deg

      card.style.position = 'absolute';
      card.style.left = `${posX}px`;
      card.style.top = `${posY}px`;
      card.style.transform = `rotate(${randomRot}deg) scale(1)`;
      card.style.zIndex = `${10 + idx}`;
      card.style.visibility = 'visible';
    });
  }

  attachMonster(monsterEl, letter) {
    monsterEl.style.touchAction = 'none'; // Prevent scroll while dragging

    const onPointerDown = (e) => {
      // Only single touch / primary mouse button; not if already dragging something
      if (this.isDragging || (e.button !== undefined && e.button !== 0)) return;
      // Don't pick up already placed cards
      if (monsterEl.classList.contains('is-placed')) return;
      e.preventDefault();

      // Audio context unlock & tactile paper grab
      audioEngine.ensureContext();
      audioEngine.playPaperGrab();

      this.isDragging = true;
      this.activePointerId = e.pointerId;
      this.activeMonsterEl = monsterEl;
      monsterEl.setPointerCapture(e.pointerId);

      // Bring to top
      this.topZIndex = (this.topZIndex || 30) + 1;
      monsterEl.style.zIndex = this.topZIndex;

      this.originRect = monsterEl.getBoundingClientRect();
      this.prevX = e.clientX;
      this.prevY = e.clientY;

      // Start looping phonics chant!
      audioEngine.startPhonicsChant(letter);

      // Generate a slight random rotation to simulate physical paper being picked up by hand
      this.pickupAngle = (Math.random() - 0.5) * 12;

      // Create animated floating drag ghost with paper-lifted physics
      this.createDragGhost(letter, e.clientX, e.clientY, this.pickupAngle);
      monsterEl.classList.add('is-being-dragged', 'paper-lifted');
      monsterEl.style.visibility = 'hidden'; // Hide original while ghost tracks finger

      const onPointerMove = (moveEvt) => {
        if (!this.isDragging || moveEvt.pointerId !== this.activePointerId) return;
        moveEvt.preventDefault();

        // Calculate velocity for natural paper tilting
        this.velocityX = moveEvt.clientX - this.prevX;
        this.prevX = moveEvt.clientX;
        this.prevY = moveEvt.clientY;

        const dynamicTilt = Math.max(-15, Math.min(15, this.velocityX * 1.3));
        const totalTilt = this.pickupAngle + dynamicTilt;

        if (this.dragGhost) {
          this.dragGhost.style.left = `${moveEvt.clientX}px`;
          this.dragGhost.style.top = `${moveEvt.clientY}px`;
          this.dragGhost.style.transform = `translate(-50%, -50%) scale(1.15) rotate(${totalTilt}deg)`;
        }

        this.checkSlotProximity(moveEvt.clientX, moveEvt.clientY, letter);
      };

      const cleanup = (upEvt) => {
        if (upEvt && upEvt.pointerId !== this.activePointerId) return;
        this.isDragging = false;

        try { monsterEl.releasePointerCapture(this.activePointerId); } catch (_) {}
        monsterEl.removeEventListener('pointermove', onPointerMove);
        monsterEl.removeEventListener('pointerup', cleanup);
        monsterEl.removeEventListener('pointercancel', cleanup);

        // Stop continuous chanting
        audioEngine.stopPhonicsChant();

        // Clear slot highlights
        this.targetSlots.forEach(s => s.el.classList.remove('slot-hover-snap'));

        if (upEvt) {
          this.handleDrop(upEvt.clientX, upEvt.clientY, letter, monsterEl);
        } else {
          // Cancelled — restore card to tray
          this._restoreCard(monsterEl);
        }
      };

      monsterEl.addEventListener('pointermove', onPointerMove);
      monsterEl.addEventListener('pointerup', cleanup);
      monsterEl.addEventListener('pointercancel', cleanup);
    };

    monsterEl.addEventListener('pointerdown', onPointerDown);
  }

  _restoreCard(monsterEl) {
    if (this.dragGhost) { this.dragGhost.remove(); this.dragGhost = null; }
    monsterEl.classList.remove('is-being-dragged', 'paper-lifted');
    monsterEl.style.visibility = 'visible';
  }

  createDragGhost(letter, x, y, initialAngle = 0) {
    if (this.dragGhost) this.dragGhost.remove();

    const ghost = document.createElement('div');
    ghost.className = 'monster-drag-ghost paper-lifted paper-drag-lifted';
    ghost.style.position = 'fixed';
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
    ghost.style.transform = `translate(-50%, -50%) scale(1.15) rotate(${initialAngle}deg)`;
    ghost.style.width = '96px';
    ghost.style.height = '96px';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.innerHTML = createMonsterSVG(letter, { state: 'dragging' });

    document.body.appendChild(ghost);
    this.dragGhost = ghost;
  }

  checkSlotProximity(clientX, clientY, letter) {
    let hoveredSlot = null;
    const snapDistance = 80; // px

    this.targetSlots.forEach(slot => {
      if (slot.isFilled) return;
      const rect = slot.el.getBoundingClientRect();
      const slotCenterX = rect.left + rect.width / 2;
      const slotCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - slotCenterX, clientY - slotCenterY);

      // Must match expected letter AND be close enough
      if (dist < snapDistance && slot.expectedLetter === letter) {
        // If multiple unfilled slots share same letter, pick the closest
        if (!hoveredSlot || dist < Math.hypot(clientX - (hoveredSlot.el.getBoundingClientRect().left + hoveredSlot.el.getBoundingClientRect().width / 2), clientY - (hoveredSlot.el.getBoundingClientRect().top + hoveredSlot.el.getBoundingClientRect().height / 2))) {
          hoveredSlot = slot;
        }
      }
    });

    // Update slot highlight visual
    this.targetSlots.forEach(slot => {
      slot.el.classList.toggle('slot-hover-snap', slot === hoveredSlot);
    });

    this.activeSlot = hoveredSlot;
  }

  handleDrop(clientX, clientY, letter, monsterEl) {
    // Clear slot highlights
    this.targetSlots.forEach(s => s.el.classList.remove('slot-hover-snap'));

    if (this.activeSlot && !this.activeSlot.isFilled && this.activeSlot.expectedLetter === letter) {
      // SUCCESSFUL SNAP! Stick paper to the target slot
      const targetSlot = this.activeSlot;
      this.activeSlot = null;
      targetSlot.isFilled = true;

      // Animate ghost straight into slot center - paper sticking down to surface
      const slotRect = targetSlot.el.getBoundingClientRect();
      const targetX = slotRect.left + slotRect.width / 2;
      const targetY = slotRect.top + slotRect.height / 2;

      if (this.dragGhost) {
        this.dragGhost.classList.remove('paper-drag-lifted', 'paper-lifted');
        this.dragGhost.classList.add('paper-sticking');
        this.dragGhost.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        this.dragGhost.style.left = `${targetX}px`;
        this.dragGhost.style.top = `${targetY}px`;
        this.dragGhost.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';

        const ghost = this.dragGhost;
        setTimeout(() => {
          ghost.remove();
          if (this.dragGhost === ghost) this.dragGhost = null;

          // Fill the slot with the happy snapped monster sticker
          targetSlot.el.innerHTML = createMonsterSVG(letter, { state: 'snapped' });
          targetSlot.el.classList.add('slot-filled', 'paper-stuck');
          targetSlot.filledMonsterEl = monsterEl;

          // Mark placed
          monsterEl.classList.add('is-placed');
          monsterEl.classList.remove('is-being-dragged', 'paper-lifted');
          monsterEl.style.visibility = 'hidden';

          // Snap tape audio + sparkle particles
          audioEngine.playTapeSnap();
          this.spawnSparkleParticles(targetX, targetY);

          // Check if word is fully completed
          this.checkWordCompletion();
        }, 200);
      } else {
        // Ghost was already removed (edge case) — still complete the slot
        targetSlot.el.innerHTML = createMonsterSVG(letter, { state: 'snapped' });
        targetSlot.el.classList.add('slot-filled', 'paper-stuck');
        monsterEl.classList.add('is-placed');
        monsterEl.classList.remove('is-being-dragged', 'paper-lifted');
        monsterEl.style.visibility = 'hidden';
        audioEngine.playTapeSnap();
        this.checkWordCompletion();
      }
    } else {
      // FREE DROP — letter lands where the child released it on the play table
      audioEngine.playPaperLand();
      this.activeSlot = null;

      const trayRect = this.trayEl.getBoundingClientRect();
      const cardW = monsterEl.offsetWidth || 76;
      const cardH = monsterEl.offsetHeight || 84;

      let newX = clientX - trayRect.left - cardW / 2;
      let newY = clientY - trayRect.top - cardH / 2;

      // Clamp so the letter never gets lost off-screen
      newX = Math.max(10, Math.min(trayRect.width - cardW - 10, newX));
      newY = Math.max(10, Math.min(trayRect.height - cardH - 10, newY));
      const dropRot = (Math.random() - 0.5) * 24; // natural resting paper angle

      const applyPosition = () => {
        monsterEl.style.position = 'absolute';
        monsterEl.style.left = `${newX}px`;
        monsterEl.style.top = `${newY}px`;
        monsterEl.style.transform = `rotate(${dropRot}deg) scale(1)`;
        monsterEl.style.visibility = 'visible';
        monsterEl.classList.remove('is-being-dragged', 'paper-lifted');
      };

      if (this.dragGhost) {
        const ghost = this.dragGhost;
        this.dragGhost = null;
        ghost.classList.remove('paper-drag-lifted', 'paper-lifted');
        ghost.style.transition = 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
        ghost.style.left = `${trayRect.left + newX + cardW / 2}px`;
        ghost.style.top = `${trayRect.top + newY + cardH / 2}px`;
        ghost.style.transform = `translate(-50%, -50%) scale(1) rotate(${dropRot}deg)`;

        setTimeout(() => {
          ghost.remove();
          applyPosition();
        }, 180);
      } else {
        applyPosition();
      }
    }
  }

  spawnSparkleParticles(x, y) {
    const container = document.createElement('div');
    container.className = 'sparkle-burst-container';
    container.style.position = 'fixed';
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10000';

    const colors = ['#FFD166', '#06D6A0', '#118AB2', '#FF5964', '#FF85A1'];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'sparkle-star';
      p.textContent = '★';
      p.style.color = colors[i % colors.length];
      const angle = (i / 12) * Math.PI * 2;
      const dist = 35 + Math.random() * 35;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.animation = `sparklePop 0.65s cubic-bezier(0.1, 0.8, 0.3, 1) forwards`;
      container.appendChild(p);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 700);
  }

  checkWordCompletion() {
    // Guard: only fire once per word
    if (this._wordCompletionPending) return;
    const allFilled = this.targetSlots.length > 0 && this.targetSlots.every(s => s.isFilled);
    if (allFilled) {
      this._wordCompletionPending = true;
      // Trigger word completion!
      setTimeout(() => {
        this.onWordCompleted();
      }, 350);
    }
  }
}
