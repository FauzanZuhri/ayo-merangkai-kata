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
  }

  setTargetSlots(slots) {
    this.targetSlots = slots;
  }

  /**
   * Scatters letter cards organically across the play desk
   * Training children's spatial and motor skills
   */
  scatterLetters() {
    if (!this.trayEl) return;
    const cards = Array.from(this.trayEl.querySelectorAll('.monster-letter-card:not(.is-placed)'));
    if (cards.length === 0) return;

    const rect = this.trayEl.getBoundingClientRect();
    const deskW = rect.width > 0 ? rect.width : (this.trayEl.clientWidth || 360);
    const deskH = rect.height > 0 ? rect.height : (this.trayEl.clientHeight || 280);

    const cardW = Math.min(84, Math.max(64, deskW * 0.18));
    const cardH = cardW * 1.1;
    const pad = 12;

    const usableW = Math.max(60, deskW - cardW - pad * 2);
    const usableH = Math.max(60, deskH - cardH - pad * 2);

    const n = cards.length;
    // Divide into sectors with organic jitter so letters don't completely overlap
    const cols = Math.max(2, Math.min(n, Math.floor(deskW / (cardW + 16))));
    const rows = Math.ceil(n / cols);
    const cellW = usableW / cols;
    const cellH = usableH / rows;

    cards.forEach((card, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const jitterX = (Math.random() - 0.5) * (cellW * 0.4);
      const jitterY = (Math.random() - 0.5) * (cellH * 0.4);
      const posX = Math.max(pad, Math.min(deskW - cardW - pad, pad + col * cellW + jitterX + 8));
      const posY = Math.max(pad, Math.min(deskH - cardH - pad, pad + row * cellH + jitterY + 8));
      const randomRot = (Math.random() - 0.5) * 26; // -13deg to +13deg

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
      // Only single touch / primary mouse button
      if (this.isDragging || (e.button !== undefined && e.button !== 0)) return;
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

      // Generate a slight random rotation to simulate physical paper being picked up by hand (-6deg to +6deg)
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

      const onPointerUp = (upEvt) => {
        if (upEvt.pointerId !== this.activePointerId) return;
        this.isDragging = false;
        monsterEl.releasePointerCapture(upEvt.pointerId);
        monsterEl.removeEventListener('pointermove', onPointerMove);
        monsterEl.removeEventListener('pointerup', onPointerUp);
        monsterEl.removeEventListener('pointercancel', onPointerUp);

        // Stop continuous chanting
        audioEngine.stopPhonicsChant();

        this.handleDrop(upEvt.clientX, upEvt.clientY, letter, monsterEl);
      };

      monsterEl.addEventListener('pointermove', onPointerMove);
      monsterEl.addEventListener('pointerup', onPointerUp);
      monsterEl.addEventListener('pointercancel', onPointerUp);
    };

    monsterEl.addEventListener('pointerdown', onPointerDown);
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
    const snapDistance = 75; // px

    this.targetSlots.forEach(slot => {
      if (slot.isFilled) return;
      const rect = slot.el.getBoundingClientRect();
      const slotCenterX = rect.left + rect.width / 2;
      const slotCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - slotCenterX, clientY - slotCenterY);

      if (dist < snapDistance && slot.expectedLetter === letter) {
        hoveredSlot = slot;
      }
    });

    // Update slot highlight visual
    this.targetSlots.forEach(slot => {
      if (slot === hoveredSlot) {
        slot.el.classList.add('slot-hover-snap');
      } else {
        slot.el.classList.remove('slot-hover-snap');
      }
    });

    this.activeSlot = hoveredSlot;
  }

  handleDrop(clientX, clientY, letter, monsterEl) {
    // Clear slot highlights
    this.targetSlots.forEach(s => s.el.classList.remove('slot-hover-snap'));

    if (this.activeSlot && !this.activeSlot.isFilled && this.activeSlot.expectedLetter === letter) {
      // SUCCESSFUL SNAP! Stick paper to the target slot
      const targetSlot = this.activeSlot;
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

        setTimeout(() => {
          if (this.dragGhost) this.dragGhost.remove();
          this.dragGhost = null;

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
      }
    } else {
      // FREE TO DRAG ANYWHERE!
      // Letter lands right where the child dropped it on the play table (melatih motorik anak)
      audioEngine.playPaperLand();

      const trayRect = this.trayEl.getBoundingClientRect();
      const cardW = monsterEl.offsetWidth || 76;
      const cardH = monsterEl.offsetHeight || 84;

      let newX = clientX - trayRect.left - cardW / 2;
      let newY = clientY - trayRect.top - cardH / 2;

      // Clamp so the letter never gets lost off-screen
      newX = Math.max(10, Math.min(trayRect.width - cardW - 10, newX));
      newY = Math.max(10, Math.min(trayRect.height - cardH - 10, newY));
      const dropRot = (Math.random() - 0.5) * 24; // natural resting paper angle

      if (this.dragGhost) {
        this.dragGhost.classList.remove('paper-drag-lifted', 'paper-lifted');
        this.dragGhost.style.transition = 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)';
        this.dragGhost.style.left = `${trayRect.left + newX + cardW / 2}px`;
        this.dragGhost.style.top = `${trayRect.top + newY + cardH / 2}px`;
        this.dragGhost.style.transform = `translate(-50%, -50%) scale(1) rotate(${dropRot}deg)`;

        setTimeout(() => {
          if (this.dragGhost) this.dragGhost.remove();
          this.dragGhost = null;
          monsterEl.style.position = 'absolute';
          monsterEl.style.left = `${newX}px`;
          monsterEl.style.top = `${newY}px`;
          monsterEl.style.transform = `rotate(${dropRot}deg) scale(1)`;
          monsterEl.style.visibility = 'visible';
          monsterEl.classList.remove('is-being-dragged', 'paper-lifted');
        }, 180);
      } else {
        monsterEl.style.position = 'absolute';
        monsterEl.style.left = `${newX}px`;
        monsterEl.style.top = `${newY}px`;
        monsterEl.style.transform = `rotate(${dropRot}deg) scale(1)`;
        monsterEl.style.visibility = 'visible';
        monsterEl.classList.remove('is-being-dragged', 'paper-lifted');
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
    const allFilled = this.targetSlots.length > 0 && this.targetSlots.every(s => s.isFilled);
    if (allFilled) {
      // Trigger word completion!
      setTimeout(() => {
        this.onWordCompleted();
      }, 350);
    }
  }
}
