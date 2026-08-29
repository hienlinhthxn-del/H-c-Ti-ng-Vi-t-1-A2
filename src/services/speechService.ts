// Speech Synthesis & Sound Effect Engine for Grade 1 Vietnamese
import { teacherAudioService, TeacherAudioItem } from './teacherAudioService';

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

  // Play gentle, pleasant chime for correct answers (warm marimba / bell arpeggio)
  playSuccess() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Smooth, gentle C Major 9 chord arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), B5 (988Hz), C6 (1046.5Hz)
    const notes = [
      { f: 523.25, time: 0.0, dur: 0.28, gain: 0.12 },
      { f: 659.25, time: 0.07, dur: 0.28, gain: 0.14 },
      { f: 783.99, time: 0.14, dur: 0.32, gain: 0.16 },
      { f: 1046.50, time: 0.22, dur: 0.45, gain: 0.18 }
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine'; // pure, gentle round tone
      osc.frequency.setValueAtTime(n.f, now + n.time);
      
      gain.gain.setValueAtTime(0.001, now + n.time);
      gain.gain.linearRampToValueAtTime(n.gain, now + n.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur + 0.05);
    });
  }

  // Play gentle, rewarding sound for completing a whole practice section
  playSectionComplete() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Melodic ascending harp / celesta phrase: F4, A4, C5, E5, G5, C6
    const phrase = [
      { f: 349.23, time: 0.0, dur: 0.25, gain: 0.10 },
      { f: 440.00, time: 0.08, dur: 0.25, gain: 0.11 },
      { f: 523.25, time: 0.16, dur: 0.30, gain: 0.13 },
      { f: 659.25, time: 0.24, dur: 0.35, gain: 0.15 },
      { f: 783.99, time: 0.32, dur: 0.42, gain: 0.16 },
      { f: 1046.50, time: 0.42, dur: 0.60, gain: 0.20 }
    ];

    phrase.forEach((p) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle'; // rich, warm chime warmth
      osc.frequency.setValueAtTime(p.f, now + p.time);
      
      gain.gain.setValueAtTime(0.001, now + p.time);
      gain.gain.linearRampToValueAtTime(p.gain, now + p.time + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.time + p.dur);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + p.time);
      osc.stop(now + p.time + p.dur + 0.05);
    });
  }

  // Play magical twinkle/sparkle when earning a star or bonus
  playSparkle() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    const freqs = [1046.50, 1318.51, 1567.98, 2093.00];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.06);
      
      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.32);
    });
  }

  // Play gentle, soft encouraging sound when selection is not yet correct (never harsh)
  playSoftWrong() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    // Soft double marimba tap (E4 -> C4)
    const notes = [
      { f: 329.63, time: 0.0, dur: 0.15 },
      { f: 261.63, time: 0.12, dur: 0.22 }
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, now + n.time);
      
      gain.gain.setValueAtTime(0.001, now + n.time);
      gain.gain.linearRampToValueAtTime(0.09, now + n.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur + 0.03);
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

  playSoundEffect(
    type:
      | 'pop'
      | 'success'
      | 'correct'
      | 'wrong'
      | 'tryAgain'
      | 'sectionComplete'
      | 'star'
      | 'sparkle'
      | 'fanfare' = 'pop'
  ) {
    if (type === 'success' || type === 'correct') {
      soundEffects.playSuccess();
    } else if (type === 'sectionComplete') {
      soundEffects.playSectionComplete();
    } else if (type === 'star' || type === 'sparkle') {
      soundEffects.playSparkle();
    } else if (type === 'wrong' || type === 'tryAgain') {
      soundEffects.playSoftWrong();
    } else if (type === 'fanfare') {
      soundEffects.playFanfare();
    } else {
      soundEffects.playPop();
    }
  }

  stop() {
    teacherAudioService.stopCurrentAudio();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  // Check if custom teacher audio exists for given text
  hasTeacherVoice(text?: string): boolean {
    if (!text || typeof text !== 'string') return false;
    return teacherAudioService.hasAudioForText(text);
  }

  // Get custom teacher audio item
  getTeacherVoice(text?: string): TeacherAudioItem | undefined {
    if (!text || typeof text !== 'string') return undefined;
    return teacherAudioService.getAudioByText(text);
  }

  // Speak text with priority for teacher's recorded sample audio
  speak(text: string, onEnd?: () => void, rateOverride?: number) {
    this.stop();
    soundEffects.playPop();

    if (!text || typeof text !== 'string') {
      if (onEnd) onEnd();
      return;
    }

    const cleanText = text.trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // 1. Check if Teacher has recorded authentic reference audio and preferTeacherVoice is active
    if (teacherAudioService.isPreferTeacherVoice() && teacherAudioService.hasAudioForText(cleanText)) {
      this.isSpeaking = true;
      const audio = teacherAudioService.playAudio(cleanText, () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      });
      if (audio) {
        return;
      }
    }

    // 2. Fallback to Web Speech API synthesis
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

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

  // Force speaking using AI only (ignoring teacher recording, useful for preview/comparison)
  speakWithAIOnly(text: string, onEnd?: () => void, rateOverride?: number) {
    this.stop();
    soundEffects.playPop();

    if (!text || typeof text !== 'string') {
      if (onEnd) onEnd();
      return;
    }

    const cleanText = text.trim();
    if (!cleanText || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = rateOverride ?? (this.slowMode ? 0.78 : 0.95);
    utterance.pitch = 1.05;

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
