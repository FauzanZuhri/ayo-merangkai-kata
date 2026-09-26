// Admin & Voice Recording Studio Controller
import './admin.css';
import { wordRepository } from './services/wordRepository.js';
import { audioStorage } from './services/audioStorage.js';
import { VoiceRecorder } from './services/voiceRecorder.js';
import { LETTER_PHONICS_MAP } from './data/words.js';
import { parentalLock } from './services/parentalLock.js';

class AdminApp {
  constructor() {
    this.words = [];
    this.audioMetadata = [];
    this.activeWord = null;
    this.currentRecordType = 'word'; // 'word' | 'meaning' | 'phonics'
    this.activeLetter = null;

    this.recorder = new VoiceRecorder({
      onStateChange: (state) => this.handleRecorderStateChange(state),
      onVolumeLevel: (level) => this.handleVolumeLevel(level),
      onTimeUpdate: (sec) => this.handleTimeUpdate(sec)
    });

    this.currentPlayingAudio = null;

    this.initDOM();
    this.initLockScreen();
    this.bindEvents();
    this.initData();
  }

  initDOM() {
    // Stats elements
    this.statTotalWords = document.getElementById('stat-total-words');
    this.statRecordedWords = document.getElementById('stat-recorded-words');
    this.statRecordedMeanings = document.getElementById('stat-recorded-meanings');
    this.statRecordedPhonics = document.getElementById('stat-recorded-phonics');

    // Filter elements
    this.filterSearch = document.getElementById('filter-search');
    this.filterCategory = document.getElementById('filter-category');
    this.filterVoiceStatus = document.getElementById('filter-voice-status');
    this.filteredCountBadge = document.getElementById('filtered-count-badge');
    this.wordsContainer = document.getElementById('words-container');

    // Studio Modal Elements
    this.modalStudio = document.getElementById('modal-record-studio');
    this.btnCloseStudio = document.getElementById('btn-close-studio');
    this.studioWordTitle = document.getElementById('studio-word-title');
    this.tabRecordWord = document.getElementById('tab-record-word');
    this.tabRecordMeaning = document.getElementById('tab-record-meaning');
    this.studioPromptLabel = document.getElementById('studio-prompt-label');
    this.studioPromptPhrase = document.getElementById('studio-prompt-phrase');
    this.studioPromptHint = document.getElementById('studio-prompt-hint');
    this.waveformBars = document.querySelectorAll('.waveform-bar');
    this.recordTimer = document.getElementById('record-timer');
    this.recordIndicator = document.getElementById('record-indicator');
    this.btnToggleRecord = document.getElementById('btn-toggle-record');
    this.recordBtnIcon = document.getElementById('record-btn-icon');
    this.recordBtnLabel = document.getElementById('record-btn-label');
    this.btnPlayPreview = document.getElementById('btn-play-preview');
    this.btnSaveRecording = document.getElementById('btn-save-recording');
    this.btnUploadFile = document.getElementById('btn-upload-file');
    this.audioFileInput = document.getElementById('audio-file-input');
    this.btnDeleteRecording = document.getElementById('btn-delete-recording');

    // Phonics Modal Elements
    this.modalPhonics = document.getElementById('modal-phonics-studio');
    this.btnOpenPhonics = document.getElementById('btn-open-phonics');
    this.btnClosePhonics = document.getElementById('btn-close-phonics');
    this.phonicsGrid = document.getElementById('phonics-grid');

    // Word Editor Modal Elements
    this.modalWordEditor = document.getElementById('modal-word-editor');
    this.btnAddWord = document.getElementById('btn-add-word');
    this.btnCloseEditor = document.getElementById('btn-close-editor');
    this.wordEditorTitle = document.getElementById('word-editor-title');
    this.wordEditorForm = document.getElementById('word-editor-form');
    this.editWordId = document.getElementById('edit-word-id');
    this.editWordName = document.getElementById('edit-word-name');
    this.editWordCategory = document.getElementById('edit-word-category');
    this.editWordHint = document.getElementById('edit-word-hint');
    this.editWordMeaning = document.getElementById('edit-word-meaning');
    this.editWordImage = document.getElementById('edit-word-image');

    // Backup Modal Elements
    this.modalBackup = document.getElementById('modal-backup');
    this.btnOpenBackup = document.getElementById('btn-open-backup');
    this.btnCloseBackup = document.getElementById('btn-close-backup');
    this.btnDownloadBackup = document.getElementById('btn-download-backup');
    this.btnTriggerRestore = document.getElementById('btn-trigger-restore');
    this.backupFileInput = document.getElementById('backup-file-input');
    this.btnResetDefaults = document.getElementById('btn-reset-defaults');

    // Secret Parental Lock Elements
    this.adminLockScreen = document.getElementById('admin-lock-screen');
    this.adminChallengeText = document.getElementById('admin-challenge-text');
    this.adminLockForm = document.getElementById('admin-lock-form');
    this.adminLockInput = document.getElementById('admin-lock-input');
    this.btnLockSession = document.getElementById('btn-lock-session');
  }

  initLockScreen() {
    if (!this.adminLockScreen) return;
    if (parentalLock.isUnlocked()) {
      this.adminLockScreen.classList.add('hidden');
    } else {
      this.adminLockScreen.classList.remove('hidden');
      const challenge = parentalLock.generateChallenge();
      if (this.adminChallengeText) {
        this.adminChallengeText.textContent = challenge.question;
      }
      if (this.adminLockInput) {
        this.adminLockInput.value = '';
        setTimeout(() => this.adminLockInput.focus(), 150);
      }
    }
  }

  async initData() {
    await wordRepository.init();
    await this.refreshData();
  }

  async refreshData() {
    this.words = wordRepository.getWords();
    this.audioMetadata = await audioStorage.getAllAudioMetadata();
    this.updateStats();
    this.populateCategoryFilter();
    this.renderWordsGrid();
  }

  updateStats() {
    const totalWords = this.words.length;
    let recordedWordsCount = 0;
    let recordedMeaningsCount = 0;
    let recordedPhonicsCount = 0;

    const audioKeys = new Set(this.audioMetadata.map(m => m.key));

    this.words.forEach(w => {
      if (audioKeys.has(`word_${w.id}`)) recordedWordsCount++;
      if (audioKeys.has(`meaning_${w.id}`)) recordedMeaningsCount++;
    });

    Object.keys(LETTER_PHONICS_MAP).forEach(char => {
      if (audioKeys.has(`letter_${char}`)) recordedPhonicsCount++;
    });

    this.statTotalWords.textContent = totalWords;
    this.statRecordedWords.textContent = `${recordedWordsCount} / ${totalWords}`;
    this.statRecordedMeanings.textContent = `${recordedMeaningsCount} / ${totalWords}`;
    this.statRecordedPhonics.textContent = `${recordedPhonicsCount} / 26`;
  }

  populateCategoryFilter() {
    const currentVal = this.filterCategory.value;
    const categories = new Set(this.words.map(w => w.category).filter(Boolean));

    this.filterCategory.innerHTML = '<option value="all">Semua Kategori</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      this.filterCategory.appendChild(opt);
    });

    if (categories.has(currentVal)) {
      this.filterCategory.value = currentVal;
    }
  }

  renderWordsGrid() {
    const query = (this.filterSearch.value || '').toLowerCase().trim();
    const selectedCategory = this.filterCategory.value;
    const selectedVoiceStatus = this.filterVoiceStatus.value;

    const audioKeys = new Set(this.audioMetadata.map(m => m.key));

    const filtered = this.words.filter(word => {
      const matchQuery = !query ||
        word.word.toLowerCase().includes(query) ||
        (word.hint && word.hint.toLowerCase().includes(query)) ||
        (word.category && word.category.toLowerCase().includes(query));

      const matchCategory = selectedCategory === 'all' || word.category === selectedCategory;

      const hasWordAudio = audioKeys.has(`word_${word.id}`);
      const hasMeaningAudio = audioKeys.has(`meaning_${word.id}`);
      const hasAnyRecording = hasWordAudio || hasMeaningAudio;

      let matchVoice = true;
      if (selectedVoiceStatus === 'has-recording') {
        matchVoice = hasAnyRecording;
      } else if (selectedVoiceStatus === 'needs-recording') {
        matchVoice = !hasWordAudio || !hasMeaningAudio;
      }

      return matchQuery && matchCategory && matchVoice;
    });

    this.filteredCountBadge.textContent = `Menampilkan ${filtered.length} dari ${this.words.length} kata`;
    this.wordsContainer.innerHTML = '';

    if (filtered.length === 0) {
      this.wordsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: #FFF; border: 3px dashed #CBD5E0; border-radius: 18px;">
          <span style="font-size: 3rem;">🔍</span>
          <h3 style="margin: 0.5rem 0;">Tidak ada kata yang sesuai</h3>
          <p style="color: #6C757D;">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(word => {
      const hasWordAudio = audioKeys.has(`word_${word.id}`);
      const hasMeaningAudio = audioKeys.has(`meaning_${word.id}`);

      const cardEl = document.createElement('div');
      cardEl.className = 'word-card';
      cardEl.innerHTML = `
        <div class="word-card-tape" aria-hidden="true"></div>
        <div>
          <div class="word-card-header">
            <div class="word-main-info">
              <div class="word-avatar">
                ${word.image ? `<img src="${word.image}" alt="${word.word}">` : '🎨'}
              </div>
              <div>
                <h3 class="word-title-text">${word.word}</h3>
                <span class="word-category-badge">${word.category || 'Kata'}</span>
              </div>
            </div>
          </div>

          <div class="word-details">
            <div class="word-hint-row">
              <strong>💡 Petunjuk:</strong> ${word.hint || '-'}
            </div>
            <div class="word-meaning-row" title="${word.meaning || ''}">
              <strong>📖 Cerita:</strong> ${word.meaning || '-'}
            </div>
          </div>

          <div class="audio-status-box">
            <!-- Suara Sebut Kata -->
            <div class="audio-status-row ${hasWordAudio ? 'has-audio' : ''}">
              <div class="audio-tag">
                <span>🗣️ Kata</span>
                <span class="status-indicator">
                  <span class="status-dot ${hasWordAudio ? 'active' : 'default'}"></span>
                  <span>${hasWordAudio ? 'Suara Saya' : 'Default'}</span>
                </span>
              </div>
              <div class="audio-mini-controls">
                ${hasWordAudio ? `
                  <button class="btn-mini-play" data-action="play-audio" data-key="word_${word.id}" title="Dengarkan Suara Saya">▶️ Tes</button>
                  <button class="btn-mini-delete" data-action="delete-audio" data-key="word_${word.id}" title="Hapus Suara Saya">🗑️</button>
                ` : `
                  <span style="font-size: 0.8rem; color: #8E9AAF;">Sistem</span>
                `}
              </div>
            </div>

            <!-- Suara Cerita / Arti -->
            <div class="audio-status-row ${hasMeaningAudio ? 'has-audio' : ''}">
              <div class="audio-tag">
                <span>📖 Cerita</span>
                <span class="status-indicator">
                  <span class="status-dot ${hasMeaningAudio ? 'active' : 'default'}"></span>
                  <span>${hasMeaningAudio ? 'Suara Saya' : 'Default'}</span>
                </span>
              </div>
              <div class="audio-mini-controls">
                ${hasMeaningAudio ? `
                  <button class="btn-mini-play" data-action="play-audio" data-key="meaning_${word.id}" title="Dengarkan Suara Saya">▶️ Tes</button>
                  <button class="btn-mini-delete" data-action="delete-audio" data-key="meaning_${word.id}" title="Hapus Suara Saya">🗑️</button>
                ` : `
                  <span style="font-size: 0.8rem; color: #8E9AAF;">Sistem</span>
                `}
              </div>
            </div>
          </div>
        </div>

        <div class="word-card-footer">
          <button class="btn-paper btn-record-card" data-action="open-studio" data-word-id="${word.id}">
            <span>🎙️</span>
            <span>Rekam Suara</span>
          </button>
          <button class="btn-paper btn-edit-card" data-action="edit-word" data-word-id="${word.id}" title="Edit Kata">
            <span>✏️</span>
          </button>
          <button class="btn-paper btn-delete-card" data-action="delete-word" data-word-id="${word.id}" title="Hapus Kata" style="color: #FA5252;">
            <span>🗑️</span>
          </button>
        </div>
      `;

      this.wordsContainer.appendChild(cardEl);
    });
  }

  bindEvents() {
    // Secret Parental Lock form
    if (this.adminLockForm) {
      this.adminLockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ans = this.adminLockInput.value;
        if (parentalLock.verify(ans)) {
          this.adminLockScreen.classList.add('hidden');
        } else {
          this.adminLockInput.style.borderColor = '#FA5252';
          this.adminLockInput.value = '';
          const newChallenge = parentalLock.generateChallenge();
          if (this.adminChallengeText) {
            this.adminChallengeText.textContent = newChallenge.question;
          }
          alert('Jawaban matematika atau PIN belum tepat. Silakan coba lagi.');
        }
      });
    }

    if (this.btnLockSession) {
      this.btnLockSession.addEventListener('click', () => {
        parentalLock.lock();
        this.initLockScreen();
      });
    }

    // Search & Filter
    this.filterSearch.addEventListener('input', () => this.renderWordsGrid());
    this.filterCategory.addEventListener('change', () => this.renderWordsGrid());
    this.filterVoiceStatus.addEventListener('change', () => this.renderWordsGrid());

    // Words Container delegation
    this.wordsContainer.addEventListener('click', async (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const action = target.getAttribute('data-action');
      const wordId = target.getAttribute('data-word-id');
      const audioKey = target.getAttribute('data-key');

      if (action === 'open-studio') {
        const word = this.words.find(w => w.id === wordId);
        if (word) this.openStudio(word);
      } else if (action === 'edit-word') {
        const word = this.words.find(w => w.id === wordId);
        if (word) this.openWordEditor(word);
      } else if (action === 'delete-word') {
        if (confirm('Yakin ingin menghapus kata ini beserta rekaman suaranya?')) {
          await wordRepository.deleteWord(wordId);
          await this.refreshData();
        }
      } else if (action === 'play-audio') {
        this.playAudioKey(audioKey, target);
      } else if (action === 'delete-audio') {
        if (confirm('Hapus rekaman suara ini dan gunakan kembali suara bawaan sistem?')) {
          await audioStorage.deleteAudio(audioKey);
          await this.refreshData();
        }
      }
    });

    // Studio Modal Events
    this.btnCloseStudio.addEventListener('click', () => this.closeStudio());
    this.tabRecordWord.addEventListener('click', () => this.setStudioTab('word'));
    this.tabRecordMeaning.addEventListener('click', () => this.setStudioTab('meaning'));
    this.btnToggleRecord.addEventListener('click', () => this.toggleRecording());
    this.btnPlayPreview.addEventListener('click', () => this.togglePreview());
    this.btnSaveRecording.addEventListener('click', () => this.saveActiveRecording());
    this.btnUploadFile.addEventListener('click', () => this.audioFileInput.click());
    this.audioFileInput.addEventListener('change', (e) => this.handleAudioFileUpload(e));
    this.btnDeleteRecording.addEventListener('click', () => this.deleteActiveRecording());

    // Phonics Modal Events
    this.btnOpenPhonics.addEventListener('click', () => this.openPhonicsStudio());
    this.btnClosePhonics.addEventListener('click', () => this.closePhonicsStudio());

    // Word Editor Modal Events
    this.btnAddWord.addEventListener('click', () => this.openWordEditor(null));
    this.btnCloseEditor.addEventListener('click', () => this.closeWordEditor());
    this.wordEditorForm.addEventListener('submit', (e) => this.handleWordFormSubmit(e));

    // Backup & Restore Events
    this.btnOpenBackup.addEventListener('click', () => this.modalBackup.classList.remove('hidden'));
    this.btnCloseBackup.addEventListener('click', () => this.modalBackup.classList.add('hidden'));
    this.btnDownloadBackup.addEventListener('click', () => this.downloadBackup());
    this.btnTriggerRestore.addEventListener('click', () => this.backupFileInput.click());
    this.backupFileInput.addEventListener('change', (e) => this.handleRestoreFile(e));
    this.btnResetDefaults.addEventListener('click', () => this.resetAllDefaults());
  }

  // --- Voice Studio Logic ---

  openStudio(word, initialType = 'word') {
    this.activeWord = word;
    this.activeLetter = null;
    this.studioWordTitle.textContent = `🎙️ Studio Rekaman: ${word.word}`;
    this.setStudioTab(initialType);
    this.modalStudio.classList.remove('hidden');
  }

  openLetterStudio(char) {
    this.activeWord = null;
    this.activeLetter = char;
    this.currentRecordType = 'phonics';

    this.studioWordTitle.textContent = `🔤 Rekam Fonik Huruf: ${char}`;
    this.tabRecordWord.parentElement.style.display = 'none';

    const info = LETTER_PHONICS_MAP[char] || { chant: char, sound: char };
    this.studioPromptLabel.textContent = `Bunyi Fonik Huruf ${char}:`;
    this.studioPromptPhrase.textContent = `"${info.chant}"`;
    this.studioPromptHint.textContent = `Contoh: Sebutkan "${info.chant}" atau bunyikan fonik "${info.sound}" dengan riang.`;

    this.resetRecorderUI();
    this.checkExistingAudio(`letter_${char}`);
    this.modalStudio.classList.remove('hidden');
  }

  closeStudio() {
    if (this.recorder.state === 'recording') {
      this.recorder.stopRecording();
    }
    this.recorder.reset();
    this.stopPlayingAudio();
    this.modalStudio.classList.add('hidden');
    this.tabRecordWord.parentElement.style.display = 'flex';
    this.refreshData();
  }

  setStudioTab(type) {
    this.currentRecordType = type;
    this.tabRecordWord.classList.toggle('active', type === 'word');
    this.tabRecordMeaning.classList.toggle('active', type === 'meaning');

    if (!this.activeWord) return;

    if (type === 'word') {
      this.studioPromptLabel.textContent = 'Contoh yang Diucapkan:';
      this.studioPromptPhrase.textContent = `"${this.activeWord.soundWord || this.activeWord.word}!"`;
      this.studioPromptHint.textContent = 'Ucapkan dengan riang, jelas, dan lantang satu kali.';
      this.checkExistingAudio(`word_${this.activeWord.id}`);
    } else {
      this.studioPromptLabel.textContent = 'Kalimat Cerita / Arti Kata:';
      this.studioPromptPhrase.textContent = `"${this.activeWord.meaning}"`;
      this.studioPromptHint.textContent = 'Bacakan cerita atau arti kata dengan intonasi hangat dan ramah anak.';
      this.checkExistingAudio(`meaning_${this.activeWord.id}`);
    }

    this.resetRecorderUI();
  }

  getCurrentKey() {
    if (this.activeLetter) return `letter_${this.activeLetter}`;
    if (!this.activeWord) return null;
    return this.currentRecordType === 'word' ? `word_${this.activeWord.id}` : `meaning_${this.activeWord.id}`;
  }

  async checkExistingAudio(key) {
    const hasAudio = await audioStorage.hasAudio(key);
    this.btnDeleteRecording.style.display = hasAudio ? 'inline-flex' : 'none';
  }

  resetRecorderUI() {
    this.recorder.reset();
    this.recordTimer.textContent = '00:00';
    this.recordIndicator.classList.add('hidden');
    this.recordBtnIcon.textContent = '🔴';
    this.recordBtnLabel.textContent = 'Mulai Rekam Suara';
    this.btnToggleRecord.className = 'btn-paper btn-paper-primary btn-record-large';
    this.btnPlayPreview.style.display = 'none';
    this.btnSaveRecording.style.display = 'none';
    this.waveformBars.forEach(bar => { bar.style.height = '8px'; });
  }

  async toggleRecording() {
    if (this.recorder.state === 'recording') {
      // Stop recording
      await this.recorder.stopRecording();
      this.recordIndicator.classList.add('hidden');
      this.recordBtnIcon.textContent = '🔄';
      this.recordBtnLabel.textContent = 'Rekam Ulang';
      this.btnToggleRecord.className = 'btn-paper btn-record-large';
      this.btnPlayPreview.style.display = 'inline-flex';
      this.btnSaveRecording.style.display = 'inline-flex';
    } else {
      // Start recording
      try {
        await this.recorder.startRecording();
        this.recordIndicator.classList.remove('hidden');
        this.recordBtnIcon.textContent = '⏹️';
        this.recordBtnLabel.textContent = 'Selesai Rekam';
        this.btnToggleRecord.className = 'btn-paper btn-paper-primary btn-record-large';
        this.btnPlayPreview.style.display = 'none';
        this.btnSaveRecording.style.display = 'none';
      } catch (err) {
        alert(err.message || 'Gagal memulai perekaman.');
      }
    }
  }

  togglePreview() {
    if (this.recorder.state === 'playing') {
      this.recorder.stopPreview();
      this.btnPlayPreview.innerHTML = '<span>▶️</span><span>Tes Dengar</span>';
    } else {
      this.btnPlayPreview.innerHTML = '<span>⏹️</span><span>Stop Tes</span>';
      this.recorder.playPreview(() => {
        this.btnPlayPreview.innerHTML = '<span>▶️</span><span>Tes Dengar</span>';
      });
    }
  }

  handleRecorderStateChange(state) {
    if (state === 'recorded') {
      this.btnPlayPreview.style.display = 'inline-flex';
      this.btnSaveRecording.style.display = 'inline-flex';
    }
  }

  handleVolumeLevel(normalizedLevel) {
    // Animate waveform bars according to normalized mic volume (0 to 1)
    this.waveformBars.forEach((bar, idx) => {
      // Create a nice parabolic ripple curve
      const factor = 1 - Math.abs(idx - 7.5) / 8;
      const height = Math.max(8, Math.round(normalizedLevel * 60 * factor + (Math.random() * 8)));
      bar.style.height = `${height}px`;
    });
  }

  handleTimeUpdate(sec) {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    this.recordTimer.textContent = `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  async saveActiveRecording() {
    const key = this.getCurrentKey();
    if (!key || !this.recorder.recordedBlob) return;

    const label = this.activeLetter
      ? `Fonik Huruf ${this.activeLetter}`
      : `${this.activeWord.word} (${this.currentRecordType === 'word' ? 'Sebut Kata' : 'Arti/Cerita'})`;

    await audioStorage.saveAudio(key, this.recorder.recordedBlob, label);
    alert('🎉 Suara Anda berhasil disimpan! Aplikasi permainan akan otomatis memutar suara ini.');
    this.closeStudio();
  }

  async handleAudioFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const key = this.getCurrentKey();
    if (!key) return;

    const label = this.activeLetter
      ? `Fonik Huruf ${this.activeLetter}`
      : `${this.activeWord.word} (${this.currentRecordType === 'word' ? 'Sebut Kata' : 'Arti/Cerita'})`;

    await audioStorage.saveAudio(key, file, label);
    alert('🎉 Berkas audio berhasil disimpan dan siap diputar di dalam permainan!');
    this.closeStudio();
    this.audioFileInput.value = '';
  }

  async deleteActiveRecording() {
    const key = this.getCurrentKey();
    if (!key) return;

    if (confirm('Yakin ingin menghapus rekaman suara Anda dan kembali ke suara sistem?')) {
      await audioStorage.deleteAudio(key);
      alert('Rekaman suara berhasil dihapus.');
      this.closeStudio();
    }
  }

  // --- Phonics Modal Logic ---

  async openPhonicsStudio() {
    const audioKeys = new Set(this.audioMetadata.map(m => m.key));
    this.phonicsGrid.innerHTML = '';

    Object.keys(LETTER_PHONICS_MAP).sort().forEach(char => {
      const hasAudio = audioKeys.has(`letter_${char}`);
      const itemEl = document.createElement('div');
      itemEl.className = `phonics-letter-item ${hasAudio ? 'has-audio' : ''}`;
      itemEl.innerHTML = `
        <div class="phonics-char">${char}</div>
        <div class="phonics-status-badge">${hasAudio ? '🟢 Rekaman' : '⚪ Default'}</div>
      `;

      itemEl.addEventListener('click', () => {
        this.modalPhonics.classList.add('hidden');
        this.openLetterStudio(char);
      });

      this.phonicsGrid.appendChild(itemEl);
    });

    this.modalPhonics.classList.remove('hidden');
  }

  closePhonicsStudio() {
    this.modalPhonics.classList.add('hidden');
  }

  // --- Word Editor Logic ---

  openWordEditor(word = null) {
    this.wordEditorForm.reset();

    if (word) {
      this.wordEditorTitle.textContent = `✏️ Edit Kata: ${word.word}`;
      this.editWordId.value = word.id;
      this.editWordName.value = word.word;
      this.editWordCategory.value = word.category || '';
      this.editWordHint.value = word.hint || '';
      this.editWordMeaning.value = word.meaning || '';
      this.editWordImage.value = word.image || '';
    } else {
      this.wordEditorTitle.textContent = '➕ Tambah Kata Baru';
      this.editWordId.value = '';
    }

    this.modalWordEditor.classList.remove('hidden');
  }

  closeWordEditor() {
    this.modalWordEditor.classList.add('hidden');
  }

  async handleWordFormSubmit(e) {
    e.preventDefault();

    const wordName = this.editWordName.value.toUpperCase().trim();
    if (!wordName) return;

    const id = this.editWordId.value || wordName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const existing = wordRepository.getWordById(id) || {};

    const wordData = {
      ...existing,
      id,
      word: wordName,
      category: this.editWordCategory.value.trim() || '⭐ Kata Baru',
      hint: this.editWordHint.value.trim() || `Rangkailah kata ${wordName}`,
      meaning: this.editWordMeaning.value.trim() || `${wordName} adalah kata yang menarik!`,
      image: this.editWordImage.value.trim() || ''
    };

    await wordRepository.saveWord(wordData);
    this.closeWordEditor();
    await this.refreshData();
    alert(`🎉 Kata ${wordData.word} berhasil disimpan!`);
  }

  // --- Backup & Restore Logic ---

  async downloadBackup() {
    try {
      const backup = await audioStorage.exportBackup();
      if (!backup) {
        alert('Tidak ada data yang dapat dicadangkan.');
        return;
      }

      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `ayo_merangkai_kata_cadangan_${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Gagal membuat berkas cadangan: ' + e.message);
    }
  }

  async handleRestoreFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      await audioStorage.importBackup(backupData);
      await wordRepository.init();
      await this.refreshData();
      alert('🎉 Cadangan kata dan rekaman suara berhasil dipulihkan!');
      this.modalBackup.classList.add('hidden');
    } catch (err) {
      alert('Gagal memulihkan cadangan: Berkas JSON tidak sesuai atau rusak.');
    }
    this.backupFileInput.value = '';
  }

  async resetAllDefaults() {
    if (confirm('PERINGATAN: Semua kata tambahan dan rekaman suara Anda akan dihapus dan dikembalikan ke bawaan awal. Lanjutkan?')) {
      await wordRepository.resetToDefaults();
      await this.refreshData();
      alert('Aplikasi telah dikembalikan ke pengaturan awal pabrik.');
      this.modalBackup.classList.add('hidden');
    }
  }

  // --- Audio Mini Player ---

  async playAudioKey(key, buttonEl) {
    this.stopPlayingAudio();

    const blob = await audioStorage.getAudio(key);
    if (!blob) {
      alert('Rekaman suara tidak ditemukan.');
      return;
    }

    const originalText = buttonEl.innerHTML;
    buttonEl.innerHTML = '<span>⏹️ Stop</span>';

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    this.currentPlayingAudio = audio;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      buttonEl.innerHTML = originalText;
      if (this.currentPlayingAudio === audio) {
        this.currentPlayingAudio = null;
      }
    };

    audio.onended = cleanup;
    audio.onerror = cleanup;
    audio.play().catch(cleanup);
  }

  stopPlayingAudio() {
    if (this.currentPlayingAudio) {
      try {
        this.currentPlayingAudio.pause();
        this.currentPlayingAudio.currentTime = 0;
      } catch (e) {}
      this.currentPlayingAudio = null;
    }
  }
}

// Start admin when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdminApp();
});
