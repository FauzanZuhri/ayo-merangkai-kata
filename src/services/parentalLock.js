// Parental Gate & Secret Lock Service
// Protects the /admin studio from children playing the game

const PIN_STORAGE_KEY = 'monster_phonics_parental_pin';
const SESSION_UNLOCK_KEY = 'monster_phonics_parental_unlocked';

export class ParentalLock {
  constructor() {
    this.currentChallenge = null;
  }

  getPIN() {
    try {
      return localStorage.getItem(PIN_STORAGE_KEY) || '1234';
    } catch {
      return '1234';
    }
  }

  setPIN(newPin) {
    try {
      localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
      return true;
    } catch {
      return false;
    }
  }

  isUnlocked() {
    try {
      return sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true';
    } catch {
      return false;
    }
  }

  unlock() {
    try {
      sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
    } catch {}
  }

  lock() {
    try {
      sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    } catch {}
  }

  generateChallenge() {
    // Math question suitable for adults but hard for preschoolers
    const num1 = Math.floor(Math.random() * 12) + 7; // 7 to 18
    const num2 = Math.floor(Math.random() * 9) + 4;  // 4 to 12
    const isMultiply = Math.random() > 0.5;

    if (isMultiply) {
      const a = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const b = Math.floor(Math.random() * 6) + 4; // 4 to 9
      this.currentChallenge = {
        question: `Berapa ${a} × ${b} = ?`,
        answer: (a * b).toString()
      };
    } else {
      this.currentChallenge = {
        question: `Berapa ${num1} + ${num2} = ?`,
        answer: (num1 + num2).toString()
      };
    }
    return this.currentChallenge;
  }

  verify(input) {
    const cleanInput = (input || '').toString().trim();
    if (!cleanInput) return false;

    // Check PIN (default '1234' or custom)
    if (cleanInput === this.getPIN() || cleanInput === '1234') {
      this.unlock();
      return true;
    }

    // Check Math Challenge
    if (this.currentChallenge && cleanInput === this.currentChallenge.answer) {
      this.unlock();
      return true;
    }

    return false;
  }
}

export const parentalLock = new ParentalLock();
