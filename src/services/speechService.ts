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
    
    // Soft double wooden marimba tap (E4 330Hz -> C4 261Hz)
    const notes = [
      { f: 329.63, time: 0.0, dur: 0.18, gain: 0.16 },
      { f: 261.63, time: 0.12, dur: 0.25, gain: 0.14 }
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle'; // gentle warm marimba tone
      osc.frequency.setValueAtTime(n.f, now + n.time);
      
      gain.gain.setValueAtTime(0.001, now + n.time);
      gain.gain.linearRampToValueAtTime(n.gain, now + n.time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);
      
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

// Grade 1 Vietnamese Phonetic Letter Dictionary (Phát âm chuẩn theo âm chữ cái, không đọc tên chữ cái Latin)
export const VIETNAMESE_PHONETIC_CONSONANTS: Record<string, string> = {
  // Digraphs & trigraphs (phụ âm ghép)
  'ngh': 'ngờ',
  'ng': 'ngờ',
  'ch': 'chờ',
  'gh': 'gờ',
  'gi': 'gi',
  'kh': 'khờ',
  'nh': 'nhờ',
  'ph': 'phờ',
  'qu': 'quờ',
  'th': 'thờ',
  'tr': 'trờ',

  // Single consonants (phụ âm đơn)
  'b': 'bờ',
  'c': 'cờ',
  'd': 'dờ',
  'đ': 'đờ',
  'g': 'gờ',
  'h': 'hờ',
  'k': 'cờ',
  'l': 'lờ',
  'm': 'mờ',
  'n': 'nờ',
  'p': 'pờ',
  'q': 'cu',
  'r': 'rờ',
  's': 'sờ',
  't': 'tờ',
  'v': 'vờ',
  'x': 'xờ'
};

// Vowels in isolation (nguyên âm đứng độc lập)
export const VIETNAMESE_PHONETIC_VOWELS: Record<string, string> = {
  'a': 'a',
  'ă': 'á',
  'â': 'ớ',
  'e': 'e',
  'ê': 'ê',
  'i': 'i',
  'o': 'o',
  'ô': 'ô',
  'ơ': 'ơ',
  'u': 'u',
  'ư': 'ư',
  'y': 'i'
};

// Standalone tone marks & tone names
export const VIETNAMESE_PHONETIC_TONES: Record<string, string> = {
  '`': 'dấu huyền',
  '´': 'dấu sắc',
  '?': 'dấu hỏi',
  '~': 'dấu ngã',
  '.': 'dấu nặng',
  '—': 'thanh ngang',
  '-': 'thanh ngang',
  'huyen': 'huyền',
  'huyền': 'huyền',
  'sac': 'sắc',
  'sắc': 'sắc',
  'hoi': 'hỏi',
  'hỏi': 'hỏi',
  'nga': 'ngã',
  'ngã': 'ngã',
  'nang': 'nặng',
  'nặng': 'nặng'
};

/**
 * Returns the Grade 1 phonetic sound for a letter token, tone mark, or spelling step.
 * e.g. 'b' -> 'bờ', 'c' -> 'cờ', 'd' -> 'dờ', 'đ' -> 'đờ', 'ă' -> 'á', 'ch' -> 'chờ', '`' -> 'dấu huyền'
 */
export function getPhoneticSound(token: string): string {
  if (!token || typeof token !== 'string') return '';
  const clean = token.trim();
  const lower = clean.toLowerCase();

  // Check tone marks & tone words
  if (VIETNAMESE_PHONETIC_TONES[lower]) {
    return VIETNAMESE_PHONETIC_TONES[lower];
  }

  // Check compound consonants first (e.g. ngh, ng, ch...)
  if (VIETNAMESE_PHONETIC_CONSONANTS[lower]) {
    return VIETNAMESE_PHONETIC_CONSONANTS[lower];
  }

  // Check isolated vowels (e.g. ă -> á, â -> ớ)
  if (VIETNAMESE_PHONETIC_VOWELS[lower]) {
    return VIETNAMESE_PHONETIC_VOWELS[lower];
  }

  // Check pattern like "A a" or "B b"
  const pairMatch = clean.match(/^([a-zA-ZăâđêôơưĂÂĐÊÔƠƯ])\s+([a-zA-ZăâđêôơưĂÂĐÊÔƠƯ])$/i);
  if (pairMatch && pairMatch[1].toLowerCase() === pairMatch[2].toLowerCase()) {
    return getPhoneticSound(pairMatch[1]);
  }

  return clean;
}

/**
 * Converts speech input text so isolated letters are pronounced phonetically
 * (e.g. "b" -> "bờ", "c" -> "cờ", "b, c" -> "bờ, cờ", "b, quả bơ" -> "bờ, quả bơ")
 * while preserving full Vietnamese sentences and words.
 */
export function convertToPhoneticVietnamese(text: string, context?: string): string {
  if (!text || typeof text !== 'string') return '';
  const clean = text.trim();
  if (!clean) return '';

  // 1. If explicit context is 'letter'
  if (context === 'letter') {
    // If comma or slash separated list of letters: "b, c" or "a, b, c"
    if (clean.includes(',') || clean.includes(';') || clean.includes('/') || clean.includes(' - ')) {
      const parts = clean.split(/[,;/]|\s+-\s+/).map(p => p.trim()).filter(Boolean);
      return parts.map(p => getPhoneticSound(p)).join(', ');
    }
    return getPhoneticSound(clean);
  }

  // 2. Format from AlphabetBoard: "${item.letter}, ${item.example}" (e.g. "b, quả bơ", "c, con cá", "d, quả dưa")
  const leadingLetterMatch = clean.match(/^([a-zA-ZăâđêôơưĂÂĐÊÔƠƯ]{1,3}),\s*(.+)$/);
  if (leadingLetterMatch) {
    const leader = leadingLetterMatch[1].toLowerCase();
    if (VIETNAMESE_PHONETIC_CONSONANTS[leader] || VIETNAMESE_PHONETIC_VOWELS[leader]) {
      const leaderSound = getPhoneticSound(leadingLetterMatch[1]);
      return `${leaderSound}, ${leadingLetterMatch[2]}`;
    }
  }

  // 3. Isolated letter or tone mark (e.g. "b", "c", "d", "đ", "s", "x", "`", "?")
  const lower = clean.toLowerCase();
  if (VIETNAMESE_PHONETIC_CONSONANTS[lower]) {
    return VIETNAMESE_PHONETIC_CONSONANTS[lower];
  }
  if (VIETNAMESE_PHONETIC_TONES[lower]) {
    return VIETNAMESE_PHONETIC_TONES[lower];
  }
  if (lower === 'ă') return 'á';
  if (lower === 'â') return 'ớ';

  // 4. Comma-separated list of short letters: e.g. "a, b, c, d, đ" or "b, c"
  if (clean.includes(',')) {
    const parts = clean.split(',').map(p => p.trim()).filter(Boolean);
    const allShortLetters = parts.length > 0 && parts.every(p => {
      const pLower = p.toLowerCase();
      return VIETNAMESE_PHONETIC_CONSONANTS[pLower] || VIETNAMESE_PHONETIC_VOWELS[pLower] || p.length <= 2;
    });
    if (allShortLetters) {
      return parts.map(p => getPhoneticSound(p)).join(', ');
    }
  }

  // 5. Space-separated or hyphen-separated writing samples / letters / rhymes
  // e.g. "a ă â b c d đ", "ch gh gi kh nh ng", "on ôn ơn con chồn sơn ca"
  const words = clean.split(/\s+/);
  const hasIsolatedLetterToken = words.some(w => {
    const wClean = w.replace(/[.,;!?-]/g, '').toLowerCase();
    return Boolean(VIETNAMESE_PHONETIC_CONSONANTS[wClean] || VIETNAMESE_PHONETIC_VOWELS[wClean]);
  });

  if (hasIsolatedLetterToken || context === 'writing') {
    // Check if the entire string is a list of isolated letters/consonants (like "a ă â b c d đ" or "ch gh gi kh nh ng")
    const allIsolatedSounds = words.every(w => {
      const wClean = w.replace(/[.,;!?-]/g, '').toLowerCase();
      return !wClean || Boolean(VIETNAMESE_PHONETIC_CONSONANTS[wClean] || VIETNAMESE_PHONETIC_VOWELS[wClean]);
    });

    if (allIsolatedSounds) {
      return words
        .map(w => {
          const wClean = w.replace(/[.,;!?-]/g, '');
          return getPhoneticSound(wClean);
        })
        .filter(Boolean)
        .join(', ');
    }

    // Mixed writing sample (e.g. "b, ba, bà", "c, cá, cà", "on, ôn, ơn, con chồn, sơn ca")
    // Convert any standalone consonant/vowel token (b -> bờ, c -> cờ, ă -> á, â -> ớ)
    // and insert short pauses between standalone rhymes and multi-syllable words
    if (clean.includes(',')) {
      const groups = clean.split(',').map(g => g.trim()).filter(Boolean);
      return groups
        .map(g => {
          const gLower = g.toLowerCase();
          if (VIETNAMESE_PHONETIC_CONSONANTS[gLower] || VIETNAMESE_PHONETIC_VOWELS[gLower]) {
            return getPhoneticSound(g);
          }
          return g
            .split(/\s+/)
            .map(w => {
              const wLower = w.toLowerCase();
              return VIETNAMESE_PHONETIC_CONSONANTS[wLower] || VIETNAMESE_PHONETIC_VOWELS[wLower]
                ? getPhoneticSound(w)
                : w;
            })
            .join(' ');
        })
        .join(', ');
    }

    // If it's a full sentence (starts with uppercase letter and has >= 4 words, or ends with punctuation), keep natural sentence flow
    const isSentence = /^[A-ZĂÂĐÊÔƠƯ]/.test(clean) && (words.length >= 4 || /[.!?]$/.test(clean));
    if (isSentence) {
      return clean;
    }

    return words
      .map(w => {
        const wClean = w.replace(/[.,;!?-]/g, '');
        const wLower = wClean.toLowerCase();
        if (VIETNAMESE_PHONETIC_CONSONANTS[wLower] || VIETNAMESE_PHONETIC_VOWELS[wLower]) {
          return getPhoneticSound(wClean);
        }
        return w;
      })
      .join(', ');
  }

  // Otherwise keep normal text / full sentences intact
  return clean;
}

export interface SpellingModelInput {
  initial?: string;
  vowel?: string;
  tone?: string;
  result: string;
  spellingSteps?: string[];
}

export function getToneSymbol(tone?: string): string {
  if (!tone) return '';
  const t = tone.toLowerCase().trim();
  if (t === 'huyền' || t === 'thanh huyền' || t === '`') return '`';
  if (t === 'sắc' || t === 'thanh sắc' || t === '´') return '´';
  if (t === 'hỏi' || t === 'thanh hỏi' || t === '?') return '̉';
  if (t === 'ngã' || t === 'thanh ngã' || t === '~') return '~';
  if (t === 'nặng' || t === 'thanh nặng' || t === '.') return '.';
  return tone;
}

/**
 * Builds standard Grade 1 phonetic spelling steps from a syllable model.
 * If model.spellingSteps is provided, ensures all steps use phonetic sounds (e.g. 'b' -> 'bờ', 'bê' fix).
 * If model.spellingSteps is missing, generates:
 * - With tone: ['bờ', 'a', 'ba', 'huyền', 'bà']
 * - Without tone: ['bờ', 'a', 'ba']
 */
export function generateSpellingSteps(model: SpellingModelInput): string[] {
  const rawResult = model.result || '';
  const cleanResult = rawResult.replace(/\s*\([^)]*\)/g, '').trim();

  // If explicit spellingSteps exist, normalize them phonetically
  if (model.spellingSteps && model.spellingSteps.length > 0) {
    const mapped = model.spellingSteps.map((step, idx) => {
      // Fix typo where intermediate base step repeated initial: e.g. ['bờ', 'ê', 'bờ', 'sắc', 'bế'] -> base should be 'bê'
      if (idx === 2 && model.spellingSteps!.length >= 4 && step === getPhoneticSound(model.initial || '')) {
        if (model.vowel && cleanResult) {
          return `${model.initial || ''}${model.vowel}`;
        }
      }
      return getPhoneticSound(step);
    });
    return mapped;
  }

  // Derive spelling steps automatically
  const initial = (model.initial || '').trim();
  const vowel = (model.vowel || '').trim();
  const rawTone = (model.tone || '').trim();
  const tone = rawTone ? (VIETNAMESE_PHONETIC_TONES[rawTone.toLowerCase()] || rawTone) : '';

  if (!initial) {
    // No initial consonant: e.g. vowel only
    if (tone) {
      return [vowel, tone, cleanResult];
    }
    return [vowel || cleanResult];
  }

  const initialSound = getPhoneticSound(initial);
  const baseSyllable = `${initial}${vowel}`;

  if (tone) {
    return [initialSound, vowel, baseSyllable, tone, cleanResult];
  }

  return [initialSound, vowel, cleanResult];
}

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
  hasTeacherVoice(text?: string, context?: string, lessonId?: string | number): boolean {
    if (!text || typeof text !== 'string') return false;
    return teacherAudioService.hasAudioForText(text, context, lessonId);
  }

  // Get custom teacher audio item
  getTeacherVoice(text?: string, context?: string, lessonId?: string | number): TeacherAudioItem | undefined {
    if (!text || typeof text !== 'string') return undefined;
    return teacherAudioService.getAudioByText(text, context, lessonId);
  }

  // Speak text with priority for teacher's recorded sample audio
  speak(text: string, onEnd?: () => void, rateOverride?: number, context?: string, lessonId?: string | number) {
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

    // Convert isolated letters / spelling steps to phonetic Grade 1 Vietnamese sounds (e.g. b -> bờ, c -> cờ)
    const phoneticText = convertToPhoneticVietnamese(cleanText, context);

    // 1. Check if Teacher has recorded authentic reference audio and preferTeacherVoice is active
    if (
      teacherAudioService.isPreferTeacherVoice() &&
      (teacherAudioService.hasAudioForText(cleanText, context, lessonId) ||
       teacherAudioService.hasAudioForText(phoneticText, context, lessonId))
    ) {
      this.isSpeaking = true;
      const targetAudioText = teacherAudioService.hasAudioForText(cleanText, context, lessonId)
        ? cleanText
        : phoneticText;
      const audio = teacherAudioService.playAudio(targetAudioText, context, lessonId, () => {
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

    const utterance = new SpeechSynthesisUtterance(phoneticText);
    utterance.lang = 'vi-VN';
    
    // Speed adapted for Grade 1 children
    utterance.rate = rateOverride ?? (this.slowMode ? 0.76 : 0.92);
    utterance.pitch = 1.05; // Cheerful, kid-friendly pitch

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
  speakWithAIOnly(text: string, onEnd?: () => void, rateOverride?: number, context?: string) {
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

    const phoneticText = convertToPhoneticVietnamese(cleanText, context);
    const utterance = new SpeechSynthesisUtterance(phoneticText);
    utterance.lang = 'vi-VN';
    utterance.rate = rateOverride ?? (this.slowMode ? 0.76 : 0.92);
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

  // Spell out a syllable step by step: e.g. "b", "a", "ba", "huyá»n", "bÃ "
  async spellOut(steps?: string[], fullResult?: string, onDone?: () => void, lessonId?: string | number) {
    if (!steps || steps.length === 0) {
      if (fullResult) {
        this.speak(fullResult, onDone, 0.78, 'syllable', lessonId);
      } else if (onDone) {
        onDone();
      }
      return;
    }

    const cleanFullResult = (fullResult || '').replace(/\s*\([^)]*\)/g, '').trim();
    const phoneticSteps = steps.map(s => getPhoneticSound(s));

    for (let i = 0; i < phoneticSteps.length; i++) {
      const step = phoneticSteps[i];
      await new Promise<void>((resolve) => {
        this.speak(step, () => {
          setTimeout(resolve, 320);
        }, 0.72, 'letter', lessonId);
      });
    }

    if (cleanFullResult) {
      const lastStep = phoneticSteps[phoneticSteps.length - 1].toLowerCase();
      // Only read extra final result if last step wasn't already the final result
      if (lastStep !== cleanFullResult.toLowerCase()) {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            this.speak(cleanFullResult, () => {
              resolve();
              if (onDone) onDone();
            }, 0.78, 'syllable', lessonId);
          }, 350);
        });
        return;
      }
    }

    if (onDone) {
      onDone();
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
