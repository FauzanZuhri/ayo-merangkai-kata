// Audio and Custom Words Storage using IndexedDB
// Enables parents and teachers to record and store their own voices for words, phonics, and stories.

const DB_NAME = 'AyoMerangkaiKataDB';
const DB_VERSION = 1;
const STORE_AUDIO = 'custom_audio';
const STORE_WORDS = 'custom_words';

class AudioStorage {
  constructor() {
    this.db = null;
    this.dbReadyPromise = this.initDB();
  }

  async initDB() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB is not supported in this environment.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_AUDIO)) {
          db.createObjectStore(STORE_AUDIO, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORE_WORDS)) {
          db.createObjectStore(STORE_WORDS, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('Failed to open IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async getDB() {
    if (!this.db) {
      await this.dbReadyPromise;
    }
    return this.db;
  }

  // --- Audio Storage Methods ---

  /**
   * Save an audio Blob (from microphone or file upload)
   * @param {string} key - e.g. "word_kucing", "meaning_kucing", "letter_A"
   * @param {Blob} blob - The recorded audio blob
   * @param {string} label - Friendly label
   */
  async saveAudio(key, blob, label = '') {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_AUDIO, 'readwrite');
      const store = tx.objectStore(STORE_AUDIO);
      const record = {
        key,
        blob,
        label,
        mimeType: blob.type || 'audio/webm',
        size: blob.size,
        updatedAt: Date.now()
      };

      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Retrieve audio Blob by key
   * @param {string} key
   * @returns {Promise<Blob|null>}
   */
  async getAudio(key) {
    const db = await this.getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_AUDIO, 'readonly');
      const store = tx.objectStore(STORE_AUDIO);
      const req = store.get(key);

      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          resolve(req.result.blob);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => resolve(null);
    });
  }

  /**
   * Check if custom audio exists for a key
   * @param {string} key
   * @returns {Promise<boolean>}
   */
  async hasAudio(key) {
    const blob = await this.getAudio(key);
    return !!blob;
  }

  /**
   * Delete an audio record
   * @param {string} key
   */
  async deleteAudio(key) {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_AUDIO, 'readwrite');
      const store = tx.objectStore(STORE_AUDIO);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Get all custom audio keys and their metadata
   */
  async getAllAudioMetadata() {
    const db = await this.getDB();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_AUDIO, 'readonly');
      const store = tx.objectStore(STORE_AUDIO);
      const req = store.getAll();

      req.onsuccess = () => {
        const list = (req.result || []).map(item => ({
          key: item.key,
          label: item.label,
          mimeType: item.mimeType,
          size: item.size,
          updatedAt: item.updatedAt
        }));
        resolve(list);
      };

      req.onerror = () => resolve([]);
    });
  }

  // --- Custom Words Storage Methods ---

  /**
   * Get all custom words from IndexedDB
   */
  async getAllCustomWords() {
    const db = await this.getDB();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_WORDS, 'readonly');
      const store = tx.objectStore(STORE_WORDS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  /**
   * Save or update a word in custom words store
   */
  async saveWord(wordData) {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_WORDS, 'readwrite');
      const store = tx.objectStore(STORE_WORDS);
      const req = store.put(wordData);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Delete a custom word
   */
  async deleteWord(id) {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_WORDS, 'readwrite');
      const store = tx.objectStore(STORE_WORDS);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  /**
   * Export all recorded audio & custom words as a backup object
   */
  async exportBackup() {
    const db = await this.getDB();
    if (!db) return null;

    const audioMeta = await this.getAllAudioMetadata();
    const audioData = {};

    for (const item of audioMeta) {
      const blob = await this.getAudio(item.key);
      if (blob) {
        // Convert blob to base64
        const base64 = await new Promise((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.readAsDataURL(blob);
        });
        audioData[item.key] = {
          ...item,
          dataUrl: base64
        };
      }
    }

    const words = await this.getAllCustomWords();

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      words,
      audio: audioData
    };
  }

  /**
   * Import data from backup object
   */
  async importBackup(backupData) {
    if (!backupData || !backupData.version) {
      throw new Error('Format data backup tidak valid.');
    }

    // 1. Import Words
    if (Array.isArray(backupData.words)) {
      for (const word of backupData.words) {
        await this.saveWord(word);
      }
    }

    // 2. Import Audio
    if (backupData.audio) {
      for (const [key, item] of Object.entries(backupData.audio)) {
        if (item.dataUrl) {
          const res = await fetch(item.dataUrl);
          const blob = await res.blob();
          await this.saveAudio(key, blob, item.label || '');
        }
      }
    }

    return true;
  }

  /**
   * Reset all custom audio and custom words
   */
  async resetAll() {
    const db = await this.getDB();
    if (!db) return false;

    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_AUDIO, STORE_WORDS], 'readwrite');
      tx.objectStore(STORE_AUDIO).clear();
      tx.objectStore(STORE_WORDS).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const audioStorage = new AudioStorage();
