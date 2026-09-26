// Audio Engine for Monster Phonics
// Synthesizes joyful cartoon sound effects via Web Audio API
// Pronounces words and continuous phonics chants via Web Speech API

import { LETTER_PHONICS_MAP } from '../data/words.js';
import { audioStorage } from './audioStorage.js';

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.phonicsInterval = null;
    this.currentChantingLetter = null;
    this.currentPlayingAudio = null;
    this.speechSynth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.idVoice = null;
    this.initVoices();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  initVoices() {
    if (!this.speechSynth) return;
    const findVoice = () => {
      const voices = this.speechSynth.getVoices();
      // Try Indonesian voice first, fallback to standard or cute pitch
      this.idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('ID')) ||
                     voices.find(v => v.lang.startsWith('en')) ||
                     voices[0] || null;
    };
    findVoice();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = findVoice;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopPhonicsChant();
      this.stopCurrentPlayingAudio();
      if (this.speechSynth) this.speechSynth.cancel();
    }
    return this.isMuted;
  }

  stopCurrentPlayingAudio() {
    if (this.currentPlayingAudio) {
      try {
        this.currentPlayingAudio.pause();
        this.currentPlayingAudio.currentTime = 0;
      } catch (e) {}
      this.currentPlayingAudio = null;
    }
  }

  async playCustomAudio(key) {
    if (this.isMuted) return false;
    try {
      const blob = await audioStorage.getAudio(key);
      if (!blob) return false;

      return new Promise((resolve) => {
        this.stopCurrentPlayingAudio();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        this.currentPlayingAudio = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          if (this.currentPlayingAudio === audio) {
            this.currentPlayingAudio = null;
          }
          resolve(true);
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);
          if (this.currentPlayingAudio === audio) {
            this.currentPlayingAudio = null;
          }
          resolve(false);
        };

        audio.play().catch(() => {
          URL.revokeObjectURL(url);
          resolve(false);
        });
      });
    } catch (e) {
      return false;
    }
  }

  triggerHaptic(duration = 20) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch (e) {}
    }
  }

  // --- Web Audio SFX ---

  // Realistic Paper Grab (crinkle / flutter noise + rising pitch pop)
  playPaperGrab() {
    this.triggerHaptic(18);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Noise burst for paper friction
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.value = 1.2;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // 2. Playful tactile pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.09);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Soft Paper Landing (thud on wooden desk)
  playPaperLand() {
    this.triggerHaptic(12);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Sticky Tape / Paper Snap (sticking into target slot)
  playTapeSnap() {
    this.triggerHaptic(28);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // High snap click
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(220, now + 0.06);

    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.07);

    // Warm resonant snap chord
    this.playSnap();
  }

  // Peel and Stick sound (for diorama sticker interactions)
  playPeelStick() {
    this.triggerHaptic(22);
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  playGrab() {
    this.playPaperGrab();
  }

  playDropReturn() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    // Spring wobble
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 16;
    lfoGain.gain.value = 40;
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.28);
    osc.stop(now + 0.28);
  }

  playSnap() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 bell chord

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.035;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  playWordCelebration() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Joyous fanfare arpeggio: C5, D5, E5, G5, A5, C6 (high triumphant)
    const melody = [
      { f: 523.25, t: 0, d: 0.12 },
      { f: 659.25, t: 0.1, d: 0.12 },
      { f: 783.99, t: 0.2, d: 0.14 },
      { f: 1046.5, t: 0.32, d: 0.4 },
      { f: 1318.51, t: 0.46, d: 0.6 }
    ];

    melody.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + note.t;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, st);

      gain.gain.setValueAtTime(0.28, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(st);
      osc.stop(st + note.d);
    });
  }

  playVignetteSound(type) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case 'crunch': {
        // Crisp bite crunch (noise burst + filter)
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1800;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
        break;
      }
      case 'bounce': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.28);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'meow': {
        // Cat meow pitch glide
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1200;

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.42);
        break;
      }
      case 'vroom': {
        // Cartoon car vroom rev
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.linearRampToValueAtTime(280, now + 0.35);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.55);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
        break;
      }
      case 'splash': {
        // Bubbly splash
        [400, 600, 800].forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, st);
          osc.frequency.exponentialRampToValueAtTime(f * 1.5, st + 0.1);

          gain.gain.setValueAtTime(0.2, st);
          gain.gain.exponentialRampToValueAtTime(0.01, st + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.16);
        });
        break;
      }
      case 'quack': {
        // Duck quack (nasal filtered sawtooth)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(240, now + 0.18);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 900;
        filter.Q.value = 3;

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'roar': {
        // Lion playful cartoon roar
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(160, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.42);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.42);
        break;
      }
      case 'twinkle':
      default: {
        // Sparkling fairy chimes
        [880, 1100, 1320, 1760].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const st = now + idx * 0.07;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0.18, st);
          gain.gain.exponentialRampToValueAtTime(0.001, st + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(st);
          osc.stop(st + 0.3);
        });
        break;
      }
    }
  }

  // --- Real-time Phonics Drag Chanting ---

  startPhonicsChant(letter) {
    if (this.isMuted) return;
    this.ensureContext();
    this.stopPhonicsChant();

    this.currentChantingLetter = letter.toUpperCase();
    const info = LETTER_PHONICS_MAP[this.currentChantingLetter] || { chant: letter, sound: letter };

    const playOneChant = async () => {
      if (this.isMuted || !this.currentChantingLetter) return;

      const hasCustom = await audioStorage.hasAudio('letter_' + this.currentChantingLetter);
      if (hasCustom) {
        this.playCustomAudio('letter_' + this.currentChantingLetter);
        return;
      }

      // 1. Cute melodic chirp via Web Audio
      if (this.ctx) {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        // Pitch based on letter char code to give each monster its unique tone
        const baseFreq = 320 + (letter.charCodeAt(0) - 65) * 16;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }

      // 2. Kid voice phonics utterance via Web Speech API
      if (this.speechSynth && !this.speechSynth.speaking) {
        const utter = new SpeechSynthesisUtterance(info.sound || letter);
        utter.lang = 'id-ID';
        if (this.idVoice) utter.voice = this.idVoice;
        utter.pitch = 1.45; // High playful cartoon pitch
        utter.rate = 1.15; // Crisp snappy pronunciation
        utter.volume = 0.9;
        this.speechSynth.speak(utter);
      }
    };

    // Immediate first chant
    playOneChant();
    // Continuous loop while dragged
    this.phonicsInterval = setInterval(playOneChant, 700);
  }

  stopPhonicsChant() {
    if (this.phonicsInterval) {
      clearInterval(this.phonicsInterval);
      this.phonicsInterval = null;
    }
    this.currentChantingLetter = null;
    if (this.speechSynth && this.speechSynth.speaking) {
      // Don't cancel if already in whole word reading
      if (!this.isPlayingWordNarration) {
        this.speechSynth.cancel();
      }
    }
  }

  // --- Word Phonics Spelling & Definition Reading ---

  async speakWordSequence(wordData, onLetterStep, onComplete) {
    if (this.isMuted) {
      if (onComplete) setTimeout(onComplete, 800);
      return;
    }

    this.isPlayingWordNarration = true;
    this.stopCurrentPlayingAudio();
    if (this.speechSynth) this.speechSynth.cancel();

    const letters = wordData.word.split('');
    let currentIndex = 0;

    const speakNextLetter = async () => {
      if (this.isMuted) {
        this.isPlayingWordNarration = false;
        if (onComplete) onComplete();
        return;
      }

      if (currentIndex < letters.length) {
        const char = letters[currentIndex];
        if (onLetterStep) onLetterStep(currentIndex);

        const hasCustomLetter = await audioStorage.hasAudio('letter_' + char);
        if (hasCustomLetter) {
          await this.playCustomAudio('letter_' + char);
          currentIndex++;
          setTimeout(speakNextLetter, 180);
        } else if (this.speechSynth) {
          const info = LETTER_PHONICS_MAP[char] || { sound: char };
          const utter = new SpeechSynthesisUtterance(info.sound);
          utter.lang = 'id-ID';
          if (this.idVoice) utter.voice = this.idVoice;
          utter.pitch = 1.4;
          utter.rate = 1.1;

          utter.onend = () => {
            currentIndex++;
            setTimeout(speakNextLetter, 180);
          };
          utter.onerror = () => {
            currentIndex++;
            speakNextLetter();
          };

          this.speechSynth.speak(utter);
        } else {
          currentIndex++;
          setTimeout(speakNextLetter, 250);
        }
      } else {
        // Step 2: Speak whole word triumphantly!
        setTimeout(async () => {
          if (onLetterStep) onLetterStep(-1); // reset highlights
          this.playWordCelebration();

          const hasCustomWord = await audioStorage.hasAudio('word_' + wordData.id);
          const proceedToMeaning = () => {
            // Step 3: Speak friendly meaning
            setTimeout(async () => {
              const hasCustomMeaning = await audioStorage.hasAudio('meaning_' + wordData.id);
              if (hasCustomMeaning) {
                await this.playCustomAudio('meaning_' + wordData.id);
                this.isPlayingWordNarration = false;
                if (onComplete) onComplete();
              } else if (this.speechSynth) {
                const meaningUtter = new SpeechSynthesisUtterance(wordData.meaning);
                meaningUtter.lang = 'id-ID';
                if (this.idVoice) meaningUtter.voice = this.idVoice;
                meaningUtter.pitch = 1.15;
                meaningUtter.rate = 1.0;

                meaningUtter.onend = () => {
                  this.isPlayingWordNarration = false;
                  if (onComplete) onComplete();
                };
                meaningUtter.onerror = () => {
                  this.isPlayingWordNarration = false;
                  if (onComplete) onComplete();
                };

                this.speechSynth.speak(meaningUtter);
              } else {
                this.isPlayingWordNarration = false;
                if (onComplete) onComplete();
              }
            }, 300);
          };

          if (hasCustomWord) {
            await this.playCustomAudio('word_' + wordData.id);
            proceedToMeaning();
          } else if (this.speechSynth) {
            const wordUtter = new SpeechSynthesisUtterance(wordData.soundWord || wordData.word);
            wordUtter.lang = 'id-ID';
            if (this.idVoice) wordUtter.voice = this.idVoice;
            wordUtter.pitch = 1.3;
            wordUtter.rate = 0.95;

            wordUtter.onend = () => {
              proceedToMeaning();
            };
            wordUtter.onerror = () => {
              proceedToMeaning();
            };

            this.speechSynth.speak(wordUtter);
          } else {
            proceedToMeaning();
          }
        }, 300);
      }
    };

    speakNextLetter();
  }

  async speakText(text, pitch = 1.2, onEnd = null) {
    if (this.isMuted) {
      if (onEnd) setTimeout(onEnd, 300);
      return;
    }
    if (!this.speechSynth) {
      if (onEnd) setTimeout(onEnd, 500);
      return;
    }
    this.speechSynth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'id-ID';
    if (this.idVoice) utter.voice = this.idVoice;
    utter.pitch = pitch;
    utter.rate = 1.0;
    if (onEnd) {
      utter.onend = onEnd;
      utter.onerror = onEnd;
    }
    this.speechSynth.speak(utter);
  }
}

export const audioEngine = new AudioEngine();
