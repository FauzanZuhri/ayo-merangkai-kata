// Word Repository
// Merges built-in WORDS_DATABASE with user-created words from IndexedDB

import { WORDS_DATABASE } from '../data/words.js';
import { audioStorage } from './audioStorage.js';

class WordRepository {
  constructor() {
    this.words = [...WORDS_DATABASE];
    this.isInitialized = false;
  }

  async init() {
    try {
      const customWords = await audioStorage.getAllCustomWords();
      if (customWords && customWords.length > 0) {
        // Merge: Replace defaults if id matches, otherwise append custom words
        const merged = [...WORDS_DATABASE];
        for (const custom of customWords) {
          const existingIdx = merged.findIndex(w => w.id === custom.id);
          if (existingIdx >= 0) {
            merged[existingIdx] = { ...merged[existingIdx], ...custom };
          } else {
            merged.push(custom);
          }
        }
        this.words = merged;
      } else {
        this.words = [...WORDS_DATABASE];
      }
    } catch (e) {
      console.warn('Could not load custom words from storage, using defaults:', e);
      this.words = [...WORDS_DATABASE];
    }
    this.isInitialized = true;
    return this.words;
  }

  getWords() {
    return this.words;
  }

  getWordById(id) {
    return this.words.find(w => w.id === id) || null;
  }

  async saveWord(wordData) {
    // Ensure id exists
    if (!wordData.id) {
      wordData.id = wordData.word.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString(36);
    }
    wordData.word = wordData.word.toUpperCase().trim();

    // Default fields if omitted
    if (!wordData.category) wordData.category = '⭐ Kata Baru';
    if (!wordData.soundWord) wordData.soundWord = wordData.word;
    if (!wordData.hint) wordData.hint = `Kata dengan ${wordData.word.length} huruf`;
    if (!wordData.meaning) wordData.meaning = `${wordData.word} adalah kata yang hebat!`;
    if (!wordData.image) wordData.image = '';
    if (!wordData.vignette) {
      wordData.vignette = {
        type: 'star',
        bgColor: 'linear-gradient(135deg, #FFF9DB 0%, #FFE066 100%)',
        storyText: `Hore! Kamu hebat sekali berhasil merangkai kata ${wordData.word}!`,
        actionSound: 'bell',
        tagline: 'Hebat dan pintar! ⭐'
      };
    }

    await audioStorage.saveWord(wordData);

    const existingIdx = this.words.findIndex(w => w.id === wordData.id);
    if (existingIdx >= 0) {
      this.words[existingIdx] = { ...this.words[existingIdx], ...wordData };
    } else {
      this.words.push(wordData);
    }

    return wordData;
  }

  async deleteWord(id) {
    await audioStorage.deleteWord(id);
    // Also delete any associated recorded audio
    await audioStorage.deleteAudio(`word_${id}`);
    await audioStorage.deleteAudio(`meaning_${id}`);

    this.words = this.words.filter(w => w.id !== id);
    return true;
  }

  async resetToDefaults() {
    await audioStorage.resetAll();
    this.words = [...WORDS_DATABASE];
    return this.words;
  }
}

export const wordRepository = new WordRepository();
