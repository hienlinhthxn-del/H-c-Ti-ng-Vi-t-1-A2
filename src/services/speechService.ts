// Speech Synthesis & Sound Effect Engine for Grade 1 Vietnamese

class SoundService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play pleasant chime for correct answers
  playSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Arpeggio C5 - E5 - G5 - C6
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.35);
    });
  }

  // Play gentle pop sound on click / selection
  playPop() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Play celebratory fanfare
  playFanfare() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 523.25, d: 0.12, t: 0.12 },
      { f: 523.25, d: 0.12, t: 0.24 },
      { f: 659.25, d: 0.25, t: 0.36 },
      { f: 587.33, d: 0.12, t: 0.65 },
      { f: 659.25, d: 0.12, t: 0.77 },
      { f: 783.99, d: 0.45, t: 0.90 },
      { f: 1046.50, d: 0.60, t: 1.35 }
    ];
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);
      gain.gain.setValueAtTime(0.2, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.05);
    });
  }
}

export const soundEffects = new SoundService();

class SpeechService {
  private isSpeaking = false;
  private slowMode = true; // default true for Grade 1 kids

  setSlowMode(enabled: boolean) {
    this.slowMode = enabled;
  }

  getSlowMode(): boolean {
    return this.slowMode;
  }

  playSoundEffect(type: 'pop' | 'success' | 'fanfare' = 'pop') {
    if (type === 'success') {
      soundEffects.playSuccess();
    } else if (type === 'fanfare') {
      soundEffects.playFanfare();
    } else {
      soundEffects.playPop();
    }
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  speak(text: string, onEnd?: () => void, rateOverride?: number) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();
    soundEffects.playPop();

    // Clean text
    const cleanText = text.trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    
    // Speed adapted for Grade 1
    utterance.rate = rateOverride ?? (this.slowMode ? 0.78 : 0.95);
    utterance.pitch = 1.05; // Slightly cheerful, kid-friendly pitch

    // Try to find a Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    this.isSpeaking = true;

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  // Spell out a syllable step by step: e.g. "b", "a", "ba", "huyền", "bà"
  async spellOut(steps?: string[], fullResult?: string, onDone?: () => void) {
    if (!steps || steps.length === 0) {
      if (fullResult) {
        this.speak(fullResult, onDone);
      } else if (onDone) {
        onDone();
      }
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise<void>((resolve) => {
        this.speak(step, () => {
          setTimeout(resolve, 300);
        }, 0.75);
      });
    }

    if (fullResult) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          this.speak(fullResult, () => {
            resolve();
            if (onDone) onDone();
          }, 0.8);
        }, 300);
      });
    } else if (onDone) {
      onDone();
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
