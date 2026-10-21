// AI Speech Recognition & Evaluation Service
// Phục vụ đánh giá phát âm cho học sinh Lớp 1 (Bộ sách Kết Nối Tri Thức)
// Đáp ứng tiêu chí ứng dụng AI hỗ trợ học sinh khắc phục rào cản ngữ âm vùng miền (Công văn 4786/SGDĐT)

export interface WordMatchResult {
  word: string;
  status: 'correct' | 'mismatched' | 'missing';
  spokenWord?: string;
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
}

export class AISpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private transcript: string = '';

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
        recognition.maxAlternatives = 1;
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
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        this.transcript = currentTranscript.trim();
        if (onInterim) {
          onInterim(this.transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          if (onError) onError('Microphone bị từ chối cấp quyền.');
        }
      };

      this.recognition.onend = () => {
        // If still flagged as listening (e.g. paused temporarily by engine), restart
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // Already active or stopped
          }
        }
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      return false;
    }
  }

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

  public getFinalTranscript(): string {
    return this.transcript.trim();
  }

  // Chuẩn hóa chuỗi tiếng Việt để so sánh ngữ âm
  private normalizeVietnamese(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,!?;:"'()\[\]\n\r\t\-–—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter((w) => w.length > 0);
  }

  // Thuật toán so khớp thông minh âm vị Tiếng Việt cho học sinh Lớp 1
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
        phoneticTips: []
      };
    }

    if (spokenWords.length === 0) {
      return {
        score: 40,
        accuracy: 0,
        rating: 'practice_more',
        cheeringTitle: 'Chưa nhận diện được giọng bé!',
        detailedFeedback:
          'Hệ thống chưa nghe rõ giọng đọc của bé. Bé hãy ngồi gần microphone hơn, nói to và rõ từng tiếng nhé!',
        recognizedText: '',
        wordAnalysis: targetWords.map((w) => ({
          word: w,
          status: 'missing'
        })),
        phoneticTips: ['Hãy nói to, rõ ràng và giữ khoảng cách micro khoảng 10 - 15cm.']
      };
    }

    const wordAnalysis: WordMatchResult[] = [];
    let matchedCount = 0;
    let spokenIndex = 0;

    // So khớp tuần tự theo thứ tự từ
    for (let i = 0; i < targetWords.length; i++) {
      const targetW = targetWords[i];

      // Tìm từ khớp trong khoảng lân cận (cửa sổ 3 từ)
      let foundIdx = -1;
      for (
        let j = spokenIndex;
        j < Math.min(spokenIndex + 4, spokenWords.length);
        j++
      ) {
        if (spokenWords[j] === targetW) {
          foundIdx = j;
          break;
        }
      }

      if (foundIdx !== -1) {
        matchedCount++;
        wordAnalysis.push({
          word: targetW,
          status: 'correct',
          spokenWord: spokenWords[foundIdx]
        });
        spokenIndex = foundIdx + 1;
      } else {
        // Kiểm tra xem có nói từ khác thế chỗ không
        if (spokenIndex < spokenWords.length) {
          wordAnalysis.push({
            word: targetW,
            status: 'mismatched',
            spokenWord: spokenWords[spokenIndex]
          });
          spokenIndex++;
        } else {
          wordAnalysis.push({
            word: targetW,
            status: 'missing'
          });
        }
      }
    }

    const accuracy = Math.round((matchedCount / targetWords.length) * 100);
    const score = Math.max(30, Math.min(100, accuracy));

    let rating: 'excellent' | 'great' | 'good' | 'practice_more';
    let cheeringTitle = '';
    let detailedFeedback = '';
    const phoneticTips: string[] = [];

    if (accuracy >= 85) {
      rating = 'excellent';
      cheeringTitle = '🌟 Xuất Sắc! Phát Âm Rất Chuẩn';
      detailedFeedback =
        'Bé phát âm rất chuẩn xác, tròn vành rõ chữ, giọng đọc lưu loát đúng theo chuẩn SGK Tiếng Việt 1.';
      phoneticTips.push('Bé giữ vững phong độ này khi đọc bài trên lớp cùng cô giáo nhé!');
    } else if (accuracy >= 70) {
      rating = 'great';
      cheeringTitle = '👏 Rất Tốt! Đọc Khá Lưu Loát';
      detailedFeedback =
        'Bé đọc rất to và rõ ràng! Có một vài từ bé đọc nhanh nên cần chú ý phát âm rõ hơn dấu thanh và âm cuối.';
      phoneticTips.push('Bé hãy chú ý nhấn giọng ở các từ có dấu ngã (~) và dấu hỏi (?).');
    } else if (accuracy >= 50) {
      rating = 'good';
      cheeringTitle = '👍 Đạt Yêu Cầu! Cố Gắng Thêm Chút Nữa';
      detailedFeedback =
        'Bé đã nỗ lực đọc bài tương đối tốt. Bé hãy bấm nghe lại giọng đọc mẫu của cô giáo để phát âm chuẩn hơn các âm khó nhé!';
      phoneticTips.push('Luyện phát âm chậm từng tiếng một, không cần đọc quá nhanh.');
    } else {
      rating = 'practice_more';
      cheeringTitle = '💪 Bé Cố Gắng Luyện Thêm Nhé!';
      detailedFeedback =
        'Bé hãy nghe cô giáo đọc mẫu trước, sau đó bấm nút thu âm và đọc theo từng câu ngắn nhé.';
      phoneticTips.push('Bấm nút "Nghe cô đọc mẫu" màu cam để bắt chước ngữ điệu chuẩn.');
    }

    // Chẩn đoán chuyên sâu ngữ âm thực tế cho học sinh lớp 1 vùng cao / DTTS (Công văn 4786)
    const mismatchedWords = wordAnalysis.filter((w) => w.status !== 'correct').map((w) => w.word);

    // 1. Phân biệt L và N
    const hasLN = mismatchedWords.some((w) => /^([ln])/i.test(w));
    if (hasLN && phoneticTips.length < 3) {
      phoneticTips.push(
        'Mẹo âm đầu L / N: Khi đọc L, uốn cong đầu lưỡi chạm lợi rồi bật mạnh ra; khi đọc N, đầu lưỡi đặt phẳng chân răng và hơi thoát qua khoang mũi.'
      );
    }

    // 2. Phân biệt TR / CH và S / X
    const hasTrChSx = mismatchedWords.some((w) => /^(tr|ch|s|x)/i.test(w));
    if (hasTrChSx && phoneticTips.length < 3) {
      phoneticTips.push(
        'Mẹo âm TR / CH, S / X: Uốn cong đầu lưỡi khi phát âm TR và S; giữ lưỡi thẳng tự nhiên sát hàm dưới khi đọc CH và X.'
      );
    }

    // 3. Phân biệt dấu hỏi (?) và dấu ngã (~)
    const hasTones = mismatchedWords.some((w) =>
      /[ảẳẩẻểỉỏởổủửỷãẵẫẽễĩõỡỗũữỹ]/.test(w)
    );
    if (hasTones && phoneticTips.length < 3) {
      phoneticTips.push(
        'Mẹo dấu thanh: Thanh hỏi (?) đọc trầm xuống rồi hơi hất nhẹ; thanh ngã (~) nhấn giọng cao hơn và ngắt hơi nhẹ ở giữa.'
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
      phoneticTips
    };
  }
}

export const aiSpeechService = new AISpeechService();
