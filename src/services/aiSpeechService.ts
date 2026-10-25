// AI Speech Recognition & Evaluation Service
// Phục vụ chấm điểm phát âm & phát hiện lỗi sai cho học sinh Lớp 1 (Bộ sách Kết Nối Tri Thức)
// Đáp ứng tiêu chí ứng dụng AI hỗ trợ học sinh khắc phục rào cản ngữ âm vùng miền (Công văn 4786/SGDĐT)

export type WordErrorType =
  | 'none'
  | 'initial_confusion' // Ngọng L/N, TR/CH, S/X, R/D/GI
  | 'tone_confusion'    // Lẫn dấu Hỏi/Ngã, Sắc/Nặng, v.v.
  | 'final_confusion'   // Sai âm cuối T/C, N/NG, v.v.
  | 'vowel_confusion'   // Sai vần / nguyên âm
  | 'substitution'      // Bé đọc thành từ khác
  | 'missing'           // Bé đọc sót từ
  | 'extra';            // Bé đọc thừa từ

export interface WordMatchResult {
  word: string;
  status: 'correct' | 'mismatched' | 'missing' | 'extra';
  spokenWord?: string;
  errorType?: WordErrorType;
  errorLabel?: string;
  phoneticTip?: string;
}

export interface AIMistakeDetail {
  word: string;
  spokenWord?: string;
  errorType: WordErrorType;
  errorLabel: string;
  suggestion: string;
}

export interface AIEvaluationResult {
  score: number; // 0 - 100
  accuracy: number; // 0 - 100
  rating: 'excellent' | 'great' | 'good' | 'practice_more';
  cheeringTitle: string;
  detailedFeedback: string;
  recognizedText: string;
  wordAnalysis: WordMatchResult[];
  phoneticTips: string[];
  mistakesCount: number;
  correctCount: number;
  missingCount: number;
  mistakesList: AIMistakeDetail[];
}

export class AISpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private transcript: string = '';
  private finalizedTranscript: string = '';
  private alternativeTranscripts: string[][] = [];

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 5;
        this.recognition = recognition;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  public isSupported(): boolean {
    return !!(
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  }

  public startListening(
    onInterim?: (text: string) => void,
    onError?: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      if (onError) onError('Trình duyệt chưa hỗ trợ nhận diện giọng nói tiếng Việt.');
      return false;
    }

    try {
      this.transcript = '';
      this.finalizedTranscript = '';
      this.alternativeTranscripts = [];
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let sessionFinal = '';
        let sessionInterim = '';
        const currentAlts: string[][] = [];

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          const primaryText = (res[0]?.transcript || '').trim();
          if (res.isFinal) {
            sessionFinal += primaryText + ' ';
          } else {
            sessionInterim += primaryText + ' ';
          }

          // Collect all alternative hypotheses for each segment
          const segAlts: string[] = [];
          for (let k = 0; k < res.length; k++) {
            const altText = (res[k]?.transcript || '').trim();
            if (altText) segAlts.push(altText);
          }
          if (segAlts.length > 0) {
            currentAlts.push(segAlts);
          }
        }

        const combined = (this.finalizedTranscript + ' ' + sessionFinal + ' ' + sessionInterim).replace(/\s+/g, ' ').trim();
        this.transcript = combined;
        if (currentAlts.length > 0) {
          this.alternativeTranscripts = currentAlts;
        }

        if (onInterim) {
          onInterim(this.transcript);
        }

        // Keep track of finalized segments in case recognition auto-restarts on silence
        if (sessionFinal.trim()) {
          this._latestSessionFinal = sessionFinal.trim();
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          if (onError) onError('Microphone bị từ chối cấp quyền.');
        }
      };

      this.recognition.onend = () => {
        // Stop stream and analyser
        if (this._latestSessionFinal) {
          this.finalizedTranscript = (this.finalizedTranscript + ' ' + this._latestSessionFinal).replace(/\s+/g, ' ').trim();
          this._latestSessionFinal = '';
        }
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // Already active or stopped
          }
        }
      };

      this._latestSessionFinal = '';
      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      return false;
    }
  }

  private _latestSessionFinal: string = '';

  public stopListening(): string {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
    return this.transcript.trim();
  }

  public async stopListeningWithGrace(waitMs: number = 450): Promise<string> {
    this.isListening = false;
    if (!this.recognition) {
      return this.transcript.trim();
    }

    return new Promise<string>((resolve) => {
      let resolved = false;
      const finish = () => {
        if (resolved) return;
        resolved = true;
        resolve(this.transcript.trim());
      };

      const timeoutId = setTimeout(finish, waitMs);

      const prevOnEnd = this.recognition.onend;
      this.recognition.onend = (ev: any) => {
        if (prevOnEnd) {
          try {
            prevOnEnd(ev);
          } catch {}
        }
        clearTimeout(timeoutId);
        // Wait 60ms after onend to ensure onresult has processed
        setTimeout(finish, 60);
      };

      try {
        this.recognition.stop();
      } catch {
        clearTimeout(timeoutId);
        finish();
      }
    });
  }

  public getFinalTranscript(): string {
    return this.transcript.trim();
  }

  // Kiểm tra 2 âm tiết/chữ có tương đương ngữ âm Lớp 1 không
  // (Ví dụ: Đề bài ghi chữ cái "b" nhưng bé đọc đúng âm "bờ"; hoặc khác cách bỏ dấu oà/òa, uỷ/ủy, i/y)
  public isPhoneticMatch(targetToken: string, spokenToken: string, allSpokenWords?: string[], spokenIdx?: number): boolean {
    const t = targetToken.toLowerCase().trim();
    const s = spokenToken.toLowerCase().trim();
    if (!t || !s) return false;
    if (t === s) return true;

    // 1. Chuẩn hóa quy tắc đặt dấu thanh kiểu cũ/mới (oà <-> òa, oé <-> óe, uỷ <-> ủy, uý <-> úy, v.v.)
    const normalizeTonePlacement = (str: string) =>
      str
        .replace(/oà/g, 'òa').replace(/oá/g, 'óa').replace(/oả/g, 'ỏa').replace(/oã/g, 'õa').replace(/oạ/g, 'ọa')
        .replace(/oè/g, 'òe').replace(/oé/g, 'óe').replace(/oẻ/g, 'ỏe').replace(/oẽ/g, 'õe').replace(/oẹ/g, 'ọe')
        .replace(/uỳ/g, 'ùy').replace(/uý/g, 'úy').replace(/uỷ/g, 'ủy').replace(/uỹ/g, 'ũy').replace(/uỵ/g, 'ụy');

    if (normalizeTonePlacement(t) === normalizeTonePlacement(s)) return true;

    // 2. Chữ số khi Google STT chuyển âm đọc thành số ("1" <-> "một", "2" <-> "hai"...)
    const numberMap: Record<string, string> = {
      '0': 'không', '1': 'một', '2': 'hai', '3': 'ba', '4': 'bốn',
      '5': 'năm', '6': 'sáu', '7': 'bảy', '8': 'tám', '9': 'chín', '10': 'mười'
    };
    if (numberMap[s] === t || numberMap[t] === s) return true;

    // 3. Khi đề bài là chữ cái/âm đầu/dấu thanh Lớp 1 (ví dụ: "b", "c", "đ", "ch", "ă", "â")
    // Học sinh đọc chuẩn Lớp 1 là "bờ", "cờ", "đờ", "chờ", "á", "ớ" (hoặc tên chữ "bê", "xê"...)
    const letterSounds: Record<string, string[]> = {
      'a': ['a'],
      'ă': ['á', 'ă', 'a'],
      'â': ['ớ', 'â', 'ơ'],
      'b': ['bờ', 'bê', 'bơ', 'bà', 'ba'],
      'c': ['cờ', 'xê', 'cơ', 'ca', 'kờ'],
      'd': ['dờ', 'dê', 'dơ', 'giờ'],
      'đ': ['đờ', 'đê', 'đơ'],
      'e': ['e'],
      'ê': ['ê'],
      'g': ['gờ', 'gơ', 'ghờ'],
      'gh': ['gờ', 'ghờ', 'gơ'],
      'gi': ['gi', 'di', 'dờ', 'giờ'],
      'h': ['hờ', 'hát', 'hơ'],
      'i': ['i', 'y'],
      'y': ['i', 'y', 'i dài', 'y dài'],
      'k': ['cờ', 'ca', 'kờ', 'cơ'],
      'kh': ['khờ', 'khơ', 'kha'],
      'l': ['lờ', 'lơ', 'ờ lờ'],
      'm': ['mờ', 'mơ', 'em mờ'],
      'n': ['nờ', 'nơ', 'en nờ'],
      'ng': ['ngờ', 'ngơ'],
      'ngh': ['ngờ', 'nghờ', 'ngơ'],
      'nh': ['nhờ', 'nhơ'],
      'o': ['o'],
      'ô': ['ô'],
      'ơ': ['ơ'],
      'p': ['pờ', 'pơ', 'pê', 'bờ'],
      'ph': ['phờ', 'phơ', 'phở'],
      'q': ['cu', 'quờ', 'quy', 'quơ'],
      'qu': ['quờ', 'quơ', 'cu', 'quy'],
      'r': ['rờ', 'rơ'],
      's': ['sờ', 'sơ'],
      't': ['tờ', 'tơ', 'tê'],
      'th': ['thờ', 'thơ'],
      'tr': ['trờ', 'trơ'],
      'u': ['u'],
      'ư': ['ư'],
      'v': ['vờ', 'vơ', 'vê'],
      'x': ['xờ', 'xơ', 'ích xì'],
      '`': ['huyền', 'dấu'],
      '´': ['sắc', 'dấu'],
      '?': ['hỏi', 'dấu'],
      '~': ['ngã', 'dấu'],
      '.': ['nặng', 'dấu']
    };

    if (letterSounds[t] && letterSounds[t].includes(s)) {
      return true;
    }
    // Ngược lại nếu targetText đã biến thành "bờ" nhưng Google STT nghe thành "b" hoặc "bơ"
    for (const [letter, variants] of Object.entries(letterSounds)) {
      if (variants[0] === t && (s === letter || variants.includes(s))) {
        return true;
      }
    }

    // 4. Các vần rời (ví dụ: "on", "ôn", "ơn", "an", "ăn", "ân", "en", "ên", "in", "un"...)
    // Khi bé đọc vần rời một mình, Google STT tiếng Việt đôi khi thêm âm đệm hoặc nghe thành từ đồng âm sát nhất
    // Chỉ áp dụng khi targetToken là vần (bắt đầu bằng nguyên âm, dài 2-4 ký tự)
    if (/^[aăâeêioôơuưy][a-zA-Zăâđêôơư]{1,3}$/.test(t) && this.detectTone(t).tone === 'ngang') {
      // Nếu Google STT nghe đúng vần nhưng thêm dấu nhẹ hoặc nghe thành "vần on"
      if (this.stripTone(s) === t) return true;
    }

    return false;
  }

  // Chuẩn hóa chuỗi tiếng Việt để so sánh ngữ âm
  public normalizeVietnamese(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,!?;:"'()\[\]\n\r\t\-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter((w) => w.length > 0);
  }

  // Nhận diện dấu thanh tiếng Việt
  private detectTone(word: string): { tone: 'ngang' | 'sac' | 'huyen' | 'hoi' | 'nga' | 'nang'; name: string } {
    if (/[áắấéếíóốớúứý]/.test(word)) return { tone: 'sac', name: 'Sắc (/)' };
    if (/[àằầèềìòồờùừỳ]/.test(word)) return { tone: 'huyen', name: 'Huyền (\\)' };
    if (/[ảẳẩẻểỉỏởổủửỷ]/.test(word)) return { tone: 'hoi', name: 'Hỏi (?)' };
    if (/[ãẵẫẽễĩõỡỗũữỹ]/.test(word)) return { tone: 'nga', name: 'Ngã (~)' };
    if (/[ạặậẹệịọộợụựỵ]/.test(word)) return { tone: 'nang', name: 'Nặng (.)' };
    return { tone: 'ngang', name: 'Ngang (không dấu)' };
  }

  // Bỏ dấu thanh để lấy âm tiết gốc (vẫn giữ dấu mũ ă, â, ê, ô, ơ, ư, đ)
  private stripTone(word: string): string {
    const toneMap: Record<string, string> = {
      'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'ắ': 'ă', 'ằ': 'ă', 'ẳ': 'ă', 'ẵ': 'ă', 'ặ': 'ă',
      'ấ': 'â', 'ầ': 'â', 'ẩ': 'â', 'ẫ': 'â', 'ậ': 'â',
      'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ế': 'ê', 'ề': 'ê', 'ể': 'ê', 'ễ': 'ê', 'ệ': 'ê',
      'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ố': 'ô', 'ồ': 'ô', 'ổ': 'ô', 'ỗ': 'ô', 'ộ': 'ô',
      'ớ': 'ơ', 'ờ': 'ơ', 'ở': 'ơ', 'ỡ': 'ơ', 'ợ': 'ơ',
      'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ứ': 'ư', 'ừ': 'ư', 'ử': 'ư', 'ữ': 'ư', 'ự': 'ư',
      'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    };
    return word.split('').map((char) => toneMap[char] || char).join('');
  }

  // Tách âm đầu
  private extractInitialConsonant(word: string): string {
    const stripped = this.stripTone(word);
    const initials = [
      'ngh', 'ng', 'gh', 'ch', 'tr', 'nh', 'th', 'ph', 'kh', 'gi', 'qu',
      'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x'
    ];
    for (const init of initials) {
      if (stripped.startsWith(init)) return init;
    }
    return '';
  }

  // Tách âm cuối
  private extractFinalConsonant(word: string): string {
    const stripped = this.stripTone(word);
    const finals = ['ng', 'nh', 'ch', 'c', 't', 'p', 'm', 'n'];
    for (const fin of finals) {
      if (stripped.endsWith(fin)) return fin;
    }
    return '';
  }

  // Chẩn đoán chi tiết lỗi sai khi đọc từ theo ngữ âm lớp 1
  private diagnoseWordMistake(
    targetWord: string,
    spokenWord: string
  ): { errorType: WordErrorType; errorLabel: string; tip: string } {
    const targetTone = this.detectTone(targetWord);
    const spokenTone = this.detectTone(spokenWord);
    const targetBase = this.stripTone(targetWord);
    const spokenBase = this.stripTone(spokenWord);

    // 1. Kiểm tra lẫn dấu thanh (cùng chữ gốc nhưng khác dấu)
    if (targetBase === spokenBase && targetTone.tone !== spokenTone.tone) {
      let specificTip = `Bé chú ý phát âm đúng thanh ${targetTone.name}.`;
      if (
        (targetTone.tone === 'nga' && spokenTone.tone === 'hoi') ||
        (targetTone.tone === 'hoi' && spokenTone.tone === 'nga')
      ) {
        specificTip = `Thanh ngã (~) đọc nhấn giọng cao và hơi ngắt hơi nhẹ ở giữa; thanh hỏi (?) đọc trầm xuống rồi hơi hất nhẹ.`;
      } else if (
        (targetTone.tone === 'sac' && spokenTone.tone === 'nang') ||
        (targetTone.tone === 'nang' && spokenTone.tone === 'sac')
      ) {
        specificTip = `Thanh sắc (/) lên cao giọng; thanh nặng (.) nhấn mạnh xuống và ngắt hơi dứt khoát.`;
      }
      return {
        errorType: 'tone_confusion',
        errorLabel: `Lẫn dấu ${targetTone.name} thành dấu ${spokenTone.name}`,
        tip: specificTip
      };
    }

    const targetInit = this.extractInitialConsonant(targetWord);
    const spokenInit = this.extractInitialConsonant(spokenWord);

    // 2. Kiểm tra lẫn âm đầu phổ biến (L/N, TR/CH, S/X, R/D/GI)
    if (targetInit && spokenInit && targetInit !== spokenInit) {
      // L vs N
      if (
        (targetInit === 'l' && spokenInit === 'n') ||
        (targetInit === 'n' && spokenInit === 'l')
      ) {
        return {
          errorType: 'initial_confusion',
          errorLabel: `Ngọng âm L và N (bé đọc thành "${spokenWord}")`,
          tip: `Âm 'L' uốn cong đầu lưỡi chạm lợi trên rồi bật mạnh; âm 'N' đầu lưỡi đặt thẳng chân răng trên và hơi thoát qua mũi.`
        };
      }

      // TR vs CH
      if (
        (targetInit === 'tr' && spokenInit === 'ch') ||
        (targetInit === 'ch' && spokenInit === 'tr')
      ) {
        return {
          errorType: 'initial_confusion',
          errorLabel: `Lẫn âm TR và CH (bé đọc thành "${spokenWord}")`,
          tip: `Âm 'TR' uốn cong đầu lưỡi chạm vòm miệng cứng; âm 'CH' mở miệng tự nhiên, đầu lưỡi thẳng sát hàm dưới.`
        };
      }

      // S vs X
      if (
        (targetInit === 's' && spokenInit === 'x') ||
        (targetInit === 'x' && spokenInit === 's')
      ) {
        return {
          errorType: 'initial_confusion',
          errorLabel: `Lẫn âm S và X (bé đọc thành "${spokenWord}")`,
          tip: `Âm 'S' uốn cong lưỡi sâu vào trong khoang miệng; âm 'X' đầu lưỡi để thẳng sát kẽ răng dưới.`
        };
      }

      // R vs D / GI / G
      if (
        targetInit === 'r' &&
        ['d', 'gi', 'g'].includes(spokenInit)
      ) {
        return {
          errorType: 'initial_confusion',
          errorLabel: `Lẫn âm R thành ${spokenInit.toUpperCase()} (bé đọc thành "${spokenWord}")`,
          tip: `Âm 'R' rung nhẹ đầu lưỡi ở vòm miệng; không đọc lướt thành 'D' hay 'GI'.`
        };
      }
    }

    // 3. Kiểm tra sai âm cuối (T vs C, N vs NG)
    const targetFin = this.extractFinalConsonant(targetWord);
    const spokenFin = this.extractFinalConsonant(spokenWord);
    if (targetFin && spokenFin && targetFin !== spokenFin) {
      if (
        (targetFin === 't' && spokenFin === 'c') ||
        (targetFin === 'c' && spokenFin === 't')
      ) {
        return {
          errorType: 'final_confusion',
          errorLabel: `Lẫn âm cuối T và C (bé đọc thành "${spokenWord}")`,
          tip: `Âm cuối 'T' đầu lưỡi chặn sau răng trên; âm cuối 'C' nâng phần cuống lưỡi chạm vòm họng.`
        };
      }
      if (
        (targetFin === 'n' && spokenFin === 'ng') ||
        (targetFin === 'ng' && spokenFin === 'n')
      ) {
        return {
          errorType: 'final_confusion',
          errorLabel: `Lẫn âm cuối N và NG (bé đọc thành "${spokenWord}")`,
          tip: `Âm cuối 'N' đầu lưỡi áp vào lợi trên; âm cuối 'NG' nâng cuống lưỡi lên vòm họng mềm.`
        };
      }
    }

    // 4. Nếu từ gốc gần giống nhau (sai vần)
    if (targetInit === spokenInit && targetInit !== '') {
      return {
        errorType: 'vowel_confusion',
        errorLabel: `Phát âm chưa chuẩn vần (bé đọc thành "${spokenWord}")`,
        tip: `Bé chú ý đọc tròn vành rõ chữ, chú ý âm chính và vần của tiếng "${targetWord}".`
      };
    }

    // 5. Thay thế từ hoàn toàn
    return {
      errorType: 'substitution',
      errorLabel: `Đọc nhầm thành "${spokenWord}"`,
      tip: `Bé hãy nhìn kỹ mặt chữ "${targetWord}" trong bài và phát âm chậm lại từng tiếng nhé.`
    };
  }

  // Thuật toán so khớp thông minh & chẩn đoán lỗi âm vị Tiếng Việt cho học sinh Lớp 1
  public evaluatePronunciation(
    targetText: string,
    spokenText: string
  ): AIEvaluationResult {
    const targetWords = this.normalizeVietnamese(targetText);
    const spokenWords = this.normalizeVietnamese(spokenText);

    if (targetWords.length === 0) {
      return {
        score: 100,
        accuracy: 100,
        rating: 'excellent',
        cheeringTitle: 'Rất tốt!',
        detailedFeedback: 'Bé đã hoàn thành bài tập xuất sắc.',
        recognizedText: spokenText,
        wordAnalysis: [],
        phoneticTips: [],
        mistakesCount: 0,
        correctCount: 0,
        missingCount: 0,
        mistakesList: []
      };
    }

    if (spokenWords.length === 0) {
      const missingList: AIMistakeDetail[] = targetWords.slice(0, 5).map((w) => ({
        word: w,
        errorType: 'missing',
        errorLabel: 'Bé chưa đọc tiếng này',
        suggestion: 'Hãy ngồi gần micro và cất giọng to rõ ràng.'
      }));

      return {
        score: 35,
        accuracy: 0,
        rating: 'practice_more',
        cheeringTitle: 'Chưa nhận diện được giọng bé!',
        detailedFeedback:
          'Hệ thống chưa nghe rõ giọng đọc của bé. Bé hãy ngồi gần microphone hơn (cách khoảng 15cm), nói to và rõ từng tiếng nhé!',
        recognizedText: '',
        wordAnalysis: targetWords.map((w) => ({
          word: w,
          status: 'missing',
          errorType: 'missing',
          errorLabel: 'Chưa đọc',
          phoneticTip: 'Bé hãy đọc to từng tiếng.'
        })),
        phoneticTips: [
          'Hãy kiểm tra quyền Microphone của trình duyệt.',
          'Nói to, rõ ràng và đọc từng tiếng theo bài học.'
        ],
        mistakesCount: targetWords.length,
        correctCount: 0,
        missingCount: targetWords.length,
        mistakesList: missingList
      };
    }

    // ALIGNMENT USING DYNAMIC PROGRAMMING (Needleman-Wunsch inspired for Grade 1 words)
    // Kèm bộ lọc thông minh đối chiếu 5 phương án nhận diện (maxAlternatives = 5) của Google Speech AI
    // để nếu phương án 1 nghe nhầm từ đơn nhưng phương án 2-5 nghe đúng tiếng trong bài học thì lấy từ chuẩn.
    const allAltWordsSet = new Set<string>();
    this.alternativeTranscripts.forEach((segAlts) => {
      segAlts.forEach((altStr) => {
        this.normalizeVietnamese(altStr).forEach((w) => allAltWordsSet.add(w));
      });
    });

    const n = targetWords.length;
    const m = spokenWords.length;

    // dp[i][j]: best alignment score
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
    const path: ('diag' | 'up' | 'left')[][] = Array.from({ length: n + 1 }, () =>
      Array(m + 1).fill('diag')
    );

    // Penalty nhẹ cho từ đọc sót (up: -0.9) hoặc đọc lặp/thừa (left: -0.7)
    // để một từ đọc sót hoặc đọc lặp không bao giờ làm lệch hàng các từ đọc đúng phía sau!
    for (let i = 1; i <= n; i++) {
      dp[i][0] = -i * 0.9;
      path[i][0] = 'up';
    }
    for (let j = 1; j <= m; j++) {
      dp[0][j] = -j * 0.7;
      path[0][j] = 'left';
    }

    const computePairSimilarity = (tw: string, sw: string): { isExactOrPhonetic: boolean; score: number } => {
      if (this.isPhoneticMatch(tw, sw)) {
        return { isExactOrPhonetic: true, score: 4.0 };
      }
      const twBase = this.stripTone(tw);
      const swBase = this.stripTone(sw);
      if (twBase === swBase) {
        return { isExactOrPhonetic: false, score: 2.2 }; // Cùng chữ gốc, chỉ lệch dấu thanh
      }
      const twInit = this.extractInitialConsonant(tw);
      const swInit = this.extractInitialConsonant(sw);
      const twFin = this.extractFinalConsonant(tw);
      const swFin = this.extractFinalConsonant(sw);
      const twRhyme = twBase.slice(twInit.length);
      const swRhyme = swBase.slice(swInit.length);

      // Ngọng âm đầu (ví dụ: l/n, tr/ch, s/x, r/d/gi) nhưng cùng vần
      if (twRhyme && twRhyme === swRhyme) {
        return { isExactOrPhonetic: false, score: 1.8 };
      }
      // Cùng âm đầu và âm cuối (chỉ lệch nguyên âm chính)
      if (twInit && twInit === swInit && twFin === swFin) {
        return { isExactOrPhonetic: false, score: 1.4 };
      }
      // Cùng âm đầu hoặc cùng âm cuối
      if ((twInit && twInit === swInit) || (twFin && twFin === swFin && tw.length >= 2)) {
        return { isExactOrPhonetic: false, score: 0.5 };
      }
      // Hai từ hoàn toàn khác nhau: phạt nặng hơn tổng (up + left = -1.6) để tránh ghép bừa làm lệch chuỗi
      return { isExactOrPhonetic: false, score: -1.5 };
    };

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const tw = targetWords[i - 1];
        const sw = spokenWords[j - 1];
        const sim = computePairSimilarity(tw, sw);

        const scoreDiag = dp[i - 1][j - 1] + sim.score;
        const scoreUp = dp[i - 1][j] - 0.9; // target word missing
        const scoreLeft = dp[i][j - 1] - 0.7; // spoken extra/repeated word

        if (scoreDiag >= scoreUp && scoreDiag >= scoreLeft) {
          dp[i][j] = scoreDiag;
          path[i][j] = 'diag';
        } else if (scoreUp >= scoreLeft) {
          dp[i][j] = scoreUp;
          path[i][j] = 'up';
        } else {
          dp[i][j] = scoreLeft;
          path[i][j] = 'left';
        }
      }
    }

    // Backtrack to build aligned wordAnalysis
    let i = n;
    let j = m;
    const alignedTarget: {
      word: string;
      status: 'correct' | 'mismatched' | 'missing';
      spokenWord?: string;
    }[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && path[i][j] === 'diag') {
        const tw = targetWords[i - 1];
        const sw = spokenWords[j - 1];
        if (this.isPhoneticMatch(tw, sw)) {
          alignedTarget.unshift({ word: tw, status: 'correct', spokenWord: sw });
        } else if (
          allAltWordsSet.has(tw) &&
          (this.stripTone(tw) === this.stripTone(sw) ||
            this.extractInitialConsonant(tw) === this.extractInitialConsonant(sw))
        ) {
          // Phương án dự phòng của Google Speech AI xác nhận bé có phát âm đúng từ này
          alignedTarget.unshift({ word: tw, status: 'correct', spokenWord: tw });
        } else {
          alignedTarget.unshift({ word: tw, status: 'mismatched', spokenWord: sw });
        }
        i--;
        j--;
      } else if (i > 0 && (j === 0 || path[i][j] === 'up')) {
        const tw = targetWords[i - 1];
        // Kiểm tra xem có phải từ gần kề trong spokenWords hoặc trong alternativeTranscripts bị tách/ghép lệch không
        const nearbySpoken = spokenWords.find(
          (sw, idx) => Math.abs(idx - j) <= 1 && this.isPhoneticMatch(tw, sw)
        );
        if (nearbySpoken) {
          alignedTarget.unshift({ word: tw, status: 'correct', spokenWord: nearbySpoken });
        } else {
          alignedTarget.unshift({
            word: tw,
            status: 'missing'
          });
        }
        i--;
      } else {
        // Extra spoken word by student, skip in backtrack
        j--;
      }
    }

    const wordAnalysis: WordMatchResult[] = [];
    const mistakesList: AIMistakeDetail[] = [];
    let correctCount = 0;
    let missingCount = 0;
    let mismatchedCount = 0;

    for (const item of alignedTarget) {
      if (item.status === 'correct') {
        correctCount++;
        wordAnalysis.push({
          word: item.word,
          status: 'correct',
          spokenWord: item.spokenWord
        });
      } else if (item.status === 'mismatched' && item.spokenWord) {
        mismatchedCount++;
        const diag = this.diagnoseWordMistake(item.word, item.spokenWord);
        wordAnalysis.push({
          word: item.word,
          status: 'mismatched',
          spokenWord: item.spokenWord,
          errorType: diag.errorType,
          errorLabel: diag.errorLabel,
          phoneticTip: diag.tip
        });
        mistakesList.push({
          word: item.word,
          spokenWord: item.spokenWord,
          errorType: diag.errorType,
          errorLabel: diag.errorLabel,
          suggestion: diag.tip
        });
      } else {
        missingCount++;
        wordAnalysis.push({
          word: item.word,
          status: 'missing',
          errorType: 'missing',
          errorLabel: 'Bé đọc sót tiếng này',
          phoneticTip: `Bé nhớ đọc đủ từ "${item.word}", không đọc lướt qua nhé.`
        });
        mistakesList.push({
          word: item.word,
          errorType: 'missing',
          errorLabel: 'Đọc sót từ',
          suggestion: `Nhìn kỹ chữ "${item.word}" và đọc to rõ ràng.`
        });
      }
    }

    // Điểm số và độ chính xác
    const accuracy = Math.round((correctCount / targetWords.length) * 100);
    // Tính điểm sư phạm (có hỗ trợ điểm khuyến khích cho các từ chỉ sai nhẹ dấu thanh)
    let score = Math.round(
      (correctCount * 100 + mismatchedCount * 45) / targetWords.length
    );
    score = Math.max(20, Math.min(100, score));

    let rating: 'excellent' | 'great' | 'good' | 'practice_more';
    let cheeringTitle = '';
    let detailedFeedback = '';
    const phoneticTips: string[] = [];

    const totalMistakes = mismatchedCount + missingCount;

    if (totalMistakes === 0) {
      rating = 'excellent';
      cheeringTitle = '🌟 Xuất Sắc! Phát Âm Chuẩn 100%';
      detailedFeedback =
        'Bé phát âm rất chuẩn xác tất cả các tiếng trong bài, tròn vành rõ chữ, giọng đọc lưu loát và đúng chuẩn SGK Tiếng Việt 1.';
      phoneticTips.push('Bé hãy giữ vững phong độ này khi đọc bài cùng Cô giáo trên lớp nhé!');
    } else if (accuracy >= 85) {
      rating = 'excellent';
      const mistakeSummary = mistakesList.map(m => m.errorType === 'missing' ? `sót tiếng "${m.word}"` : `tiếng "${m.word}" đọc thành "${m.spokenWord || ''}"`).join(', ');
      cheeringTitle = `🌟 Rất Giỏi! Đạt ${score} Điểm`;
      detailedFeedback =
        `Bé đọc rất tốt (${correctCount}/${targetWords.length} tiếng đúng chuẩn). Chỉ còn ${totalMistakes} chỗ cần lưu ý nhỏ: ${mistakeSummary}. Bé bấm vào từ màu đỏ bên dưới để nghe mẫu và đọc lại cho thật hoàn hảo nhé!`;
      phoneticTips.push('Bé hãy bấm vào từ màu đỏ/cam bên dưới để nghe cô đọc mẫu nhé.');
    } else if (accuracy >= 70) {
      rating = 'great';
      cheeringTitle = `👏 Khá Tốt! Đạt ${score} Điểm`;
      const mistakeSummary = mistakesList.map(m => m.errorType === 'missing' ? `sót từ "${m.word}"` : `từ "${m.word}" đọc thành "${m.spokenWord || ''}"`).join(', ');
      detailedFeedback = `Bé đọc khá to và tự tin (${score}/100đ). Cần lưu ý hoàn thiện ${totalMistakes} lỗi: ${mistakeSummary}. Hãy nghe cô đọc mẫu để sửa nhé!`;
      phoneticTips.push('Bé hãy bấm vào các từ màu đỏ bên dưới để nghe cô đọc mẫu và sửa phát âm nhé.');
    } else if (accuracy >= 50) {
      rating = 'good';
      cheeringTitle = `👍 Đạt ${score} Điểm - Cần Cố Gắng`;
      const mistakeSummary = mistakesList.map(m => m.errorType === 'missing' ? `sót từ "${m.word}"` : `từ "${m.word}" đọc thành "${m.spokenWord || ''}"`).join('; ');
      detailedFeedback = `Bé đọc được ${correctCount}/${targetWords.length} từ chuẩn (${score}/100đ). Bé chú ý sửa ${totalMistakes} lỗi: ${mistakeSummary}. Luyện đọc chậm lại và phát âm rõ từng tiếng nhé!`;
      phoneticTips.push('Luyện phát âm chậm từng tiếng một, không cần đọc quá nhanh.');
    } else {
      rating = 'practice_more';
      cheeringTitle = `💪 Bé Cần Luyện Thêm (${score}/100đ)`;
      
      const missingWords = mistakesList.filter(m => m.errorType === 'missing');
      const mismatchedWords = mistakesList.filter(m => m.errorType !== 'missing');
      let errorDetails = '';
      if (missingWords.length > 0 && mismatchedWords.length > 0) {
        errorDetails = `Bé bị đọc sót ${missingWords.length} từ (${missingWords.map(m => `"${m.word}"`).join(', ')}) và đọc sai ${mismatchedWords.length} từ (${mismatchedWords.map(m => `"${m.word}" nhầm thành "${m.spokenWord || ''}"`).join(', ')}).`;
      } else if (missingWords.length > 0) {
        errorDetails = `Bé bị đọc sót ${missingWords.length} từ: ${missingWords.map(m => `"${m.word}"`).join(', ')}.`;
      } else if (mismatchedWords.length > 0) {
        errorDetails = `Bé đọc sai ${mismatchedWords.length} từ: ${mismatchedWords.map(m => `từ "${m.word}" đọc nhầm thành "${m.spokenWord || ''}"`).join(', ')}.`;
      } else {
        errorDetails = 'Bé chưa phát âm rõ các tiếng trong bài.';
      }

      detailedFeedback = `Bài đọc đạt ${score}/100 điểm (độ chính xác ${accuracy}%). ${errorDetails} Bé hãy nhìn kỹ chữ, bấm nút "Nghe cô đọc mẫu" rồi bấm thu âm và đọc to rõ từng tiếng nhé!`;
      phoneticTips.push('Chỉ tay vào từng chữ khi đọc để không bị bỏ sót tiếng.');
      phoneticTips.push('Nghe cô đọc mẫu 2-3 lần trước khi bấm thu âm lại.');
    }

    // Chắt lọc lời khuyên sư phạm theo lỗi thực tế (Công văn 4786)
    const hasLN = mistakesList.some((m) => m.errorLabel.includes('L và N'));
    if (hasLN && phoneticTips.length < 3) {
      phoneticTips.push(
        'Mẹo âm L / N: Khi đọc L, uốn cong đầu lưỡi chạm lợi trên; khi đọc N, đầu lưỡi đặt thẳng chân răng.'
      );
    }

    const hasTrCh = mistakesList.some((m) => m.errorLabel.includes('TR và CH'));
    if (hasTrCh && phoneticTips.length < 3) {
      phoneticTips.push(
        'Mẹo âm TR / CH: Uốn cong đầu lưỡi khi đọc TR; để lưỡi thẳng tự nhiên sát hàm dưới khi đọc CH.'
      );
    }

    const hasTones = mistakesList.some((m) => m.errorType === 'tone_confusion');
    if (hasTones && phoneticTips.length < 3) {
      phoneticTips.push(
        'Mẹo dấu thanh: Chú ý nhấn giọng cao hơn ở dấu ngã (~) và hạ trầm ở dấu hỏi (?).'
      );
    }

    return {
      score,
      accuracy,
      rating,
      cheeringTitle,
      detailedFeedback,
      recognizedText: spokenWords.join(' '),
      wordAnalysis,
      phoneticTips,
      mistakesCount: totalMistakes,
      correctCount,
      missingCount,
      mistakesList
    };
  }
}

export const aiSpeechService = new AISpeechService();
