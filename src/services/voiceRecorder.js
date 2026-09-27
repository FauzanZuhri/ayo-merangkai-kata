// Voice Recorder Service for Microphone Capture & Real-time Visualizer
// Designed for parents and teachers to record voices easily in browser

export class VoiceRecorder {
  constructor({ onStateChange, onVolumeLevel, onTimeUpdate } = {}) {
    this.mediaRecorder = null;
    this.audioStream = null;
    this.audioChunks = [];
    this.recordedBlob = null;
    this.recordedUrl = null;
    this.previewAudio = null;

    this.audioCtx = null;
    this.analyser = null;
    this.animFrameId = null;

    this.timerInterval = null;
    this.startTime = 0;
    this.durationSec = 0;

    this.state = 'idle'; // 'idle' | 'recording' | 'recorded' | 'playing'
    this.onStateChange = onStateChange || (() => {});
    this.onVolumeLevel = onVolumeLevel || (() => {});
    this.onTimeUpdate = onTimeUpdate || (() => {});
  }

  isSupported() {
    return typeof navigator !== 'undefined' &&
           navigator.mediaDevices &&
           typeof navigator.mediaDevices.getUserMedia === 'function' &&
           typeof window.MediaRecorder !== 'undefined';
  }

  getBestMimeType() {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus'
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return '';
  }

  async startRecording() {
    if (!this.isSupported()) {
      throw new Error('Perekaman mikrofon tidak didukung di browser ini.');
    }

    this.cleanupPreview();
    this.audioChunks = [];
    this.recordedBlob = null;

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
    } catch (err) {
      console.error('Microphone access denied:', err);
      throw new Error('Akses mikrofon ditolak atau tidak ditemukan. Mohon izinkan mikrofon pada browser Anda.');
    }

    const mimeType = this.getBestMimeType();
    const options = mimeType ? { mimeType } : {};

    try {
      this.mediaRecorder = new MediaRecorder(this.audioStream, options);
    } catch (e) {
      this.mediaRecorder = new MediaRecorder(this.audioStream);
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    // Setup visualizer
    this.setupVisualizer(this.audioStream);

    this.mediaRecorder.start(100);
    this.startTime = Date.now();
    this.durationSec = 0;
    this.setState('recording');

    this.timerInterval = setInterval(() => {
      this.durationSec = (Date.now() - this.startTime) / 1000;
      this.onTimeUpdate(this.durationSec);
    }, 100);
  }

  setupVisualizer(stream) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaStreamSource(stream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (this.state !== 'recording') return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(1, avg / 128); // 0 to 1
        this.onVolumeLevel(normalized);

        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      this.animFrameId = requestAnimationFrame(checkVolume);
    } catch (e) {
      console.warn('Visualizer setup error:', e);
    }
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.state !== 'recording') {
        resolve(null);
        return;
      }

      clearInterval(this.timerInterval);
      if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      this.onVolumeLevel(0);

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        this.recordedBlob = new Blob(this.audioChunks, { type: mimeType });
        this.recordedUrl = URL.createObjectURL(this.recordedBlob);

        // Stop all mic tracks
        if (this.audioStream) {
          this.audioStream.getTracks().forEach(track => track.stop());
          this.audioStream = null;
        }
        if (this.audioCtx && this.audioCtx.state !== 'closed') {
          this.audioCtx.close();
        }

        this.setState('recorded');
        resolve(this.recordedBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  playPreview(onEnded) {
    if (!this.recordedUrl) return;

    this.cleanupPreview();
    this.previewAudio = new Audio(this.recordedUrl);
    this.setState('playing');

    this.previewAudio.onended = () => {
      this.setState('recorded');
      if (onEnded) onEnded();
    };

    this.previewAudio.onerror = () => {
      this.setState('recorded');
      if (onEnded) onEnded();
    };

    this.previewAudio.play().catch(() => {
      this.setState('recorded');
    });
  }

  stopPreview() {
    if (this.previewAudio) {
      this.previewAudio.pause();
      this.previewAudio.currentTime = 0;
    }
    this.setState('recorded');
  }

  cleanupPreview() {
    if (this.previewAudio) {
      this.previewAudio.pause();
      this.previewAudio = null;
    }
  }

  reset() {
    this.cleanupPreview();
    if (this.recordedUrl) {
      URL.revokeObjectURL(this.recordedUrl);
      this.recordedUrl = null;
    }
    this.recordedBlob = null;
    this.audioChunks = [];
    clearInterval(this.timerInterval);
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.setState('idle');
  }

  setState(newState) {
    this.state = newState;
    this.onStateChange(newState);
  }
}
