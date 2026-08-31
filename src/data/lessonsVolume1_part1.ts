import { Volume1Lesson } from '../types';

export const LESSONS_PART_1: Volume1Lesson[] = [
  {
    id: 1,
    lessonNumber: 1,
    title: 'A a',
    type: 'phonics',
    pageRange: '14 - 15',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['A', 'a'],
      recognitionSentence: 'Nam và Hà ca hát.',
      recognitionKeywords: ['Nam', 'Hà', 'ca', 'hát']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, chữ cái',
      models: [],
      readingSyllables: ['a', 'A'],
      words: [
        { word: 'a', highlightPart: 'a', meaning: 'chữ cái a', illustrationIcon: '🅰️', imageDesc: 'chữ a' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc và Luyện viết, Luyện nói',
      readingPassage: 'A!',
      writingSamples: ['a', 'A'],
      speakingTopic: {
        title: 'Chào hỏi',
        prompt: 'Quan sát tranh bạn nhỏ chào bố mẹ khi đi học và chào cô giáo khi vào lớp.',
        questions: ['Khi gặp người lớn em chào thế nào?', 'Khi đi học về em chào ai?']
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chữ nào dưới đây là chữ "a"?',
        options: ['a', 'b', 'c', 'd'],
        correctIndex: 0,
        explanation: 'Chữ "a" gồm một nét cong kín và một nét móc ngược.'
      },
      {
        id: 'q2',
        question: 'Tiếng "ca" có âm chính là âm nào?',
        options: ['c', 'a', 'o', 'e'],
        correctIndex: 1,
        explanation: 'Tiếng "ca" ghép từ âm đầu "c" và âm chính "a".'
      }
    ]
  },
  {
    id: 2,
    lessonNumber: 2,
    title: 'B b ` (thanh huyền)',
    type: 'phonics',
    pageRange: '16 - 17',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['B', 'b', '`'],
      recognitionSentence: 'Bà cho bé búp bê.',
      recognitionKeywords: ['Bà', 'bé', 'búp bê']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'a', result: 'ba', spellingSteps: ['bờ', 'a', 'ba'] },
        { initial: 'b', vowel: 'a', tone: 'huyền', result: 'bà', spellingSteps: ['bờ', 'a', 'ba', 'huyền', 'bà'] }
      ],
      readingSyllables: ['ba', 'bà'],
      words: [
        { word: 'ba', highlightPart: 'b', meaning: 'số 3 hoặc bố', illustrationIcon: '3️⃣', imageDesc: 'số ba' },
        { word: 'bà', highlightPart: 'b', meaning: 'người bà kính yêu', illustrationIcon: '👵', imageDesc: 'người bà' },
        { word: 'ba ba', highlightPart: 'ba', meaning: 'con ba ba', illustrationIcon: '🐢', imageDesc: 'con ba ba' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'A, bà.',
      writingSamples: ['b', 'bà'],
      speakingTopic: {
        title: 'Gia đình',
        prompt: 'Nói về những người thân yêu trong gia đình của em (ông, bà, bố, mẹ, anh, chị, em).',
        questions: ['Gia đình em gồm có những ai?', 'Em thường làm gì giúp đỡ bà?']
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "bà" gồm âm đầu gì và dấu thanh gì?',
        options: ['Âm đầu b, thanh huyền', 'Âm đầu c, thanh sắc', 'Âm đầu b, thanh hỏi', 'Âm đầu a, thanh ngã'],
        correctIndex: 0,
        explanation: 'Tiếng "bà" = b + a + dấu huyền.'
      }
    ]
  },
  {
    id: 3,
    lessonNumber: 3,
    title: 'C c / (thanh sắc)',
    type: 'phonics',
    pageRange: '18 - 19',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['C', 'c', '/'],
      recognitionSentence: 'Nam và bố câu cá.',
      recognitionKeywords: ['Nam', 'câu cá']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'c', vowel: 'a', result: 'ca', spellingSteps: ['cờ', 'a', 'ca'] },
        { initial: 'c', vowel: 'a', tone: 'sắc', result: 'cá', spellingSteps: ['cờ', 'a', 'ca', 'sắc', 'cá'] }
      ],
      readingSyllables: ['ca', 'cà', 'cá'],
      words: [
        { word: 'ca', highlightPart: 'c', meaning: 'cái ca đựng nước', illustrationIcon: '🥛', imageDesc: 'chiếc ca' },
        { word: 'cà', highlightPart: 'c', meaning: 'quả cà tím, cà chua', illustrationIcon: '🍆', imageDesc: 'quả cà' },
        { word: 'cá', highlightPart: 'c', meaning: 'con cá bơi dưới nước', illustrationIcon: '🐟', imageDesc: 'con cá' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'A, cá.',
      writingSamples: ['c', 'cá'],
      speakingTopic: {
        title: 'Chào hỏi',
        prompt: 'Em chào bác bảo vệ trường, chào thầy cô giáo khi đến lớp.',
        questions: ['Gặp người lớn tuổi em nên chào như thế nào?']
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Dấu sắc ( / ) khi thêm vào tiếng "ca" tạo thành tiếng gì?',
        options: ['cà', 'cá', 'cả', 'cã'],
        correctIndex: 1,
        explanation: 'c + a + sắc = cá.'
      }
    ]
  },
  {
    id: 4,
    lessonNumber: 4,
    title: 'E e Ê ê',
    type: 'phonics',
    pageRange: '20 - 21',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['E', 'e', 'Ê', 'ê'],
      recognitionSentence: 'Bé kể mẹ nghe về bạn bè.',
      recognitionKeywords: ['Bé', 'kể', 'bạn bè']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'e', tone: 'sắc', result: 'bé', spellingSteps: ['bờ', 'e', 'be', 'sắc', 'bé'] },
        { initial: 'b', vowel: 'ê', tone: 'sắc', result: 'bế', spellingSteps: ['bờ', 'ê', 'bờ', 'sắc', 'bế'] }
      ],
      readingSyllables: ['bè', 'bé', 'bế'],
      words: [
        { word: 'bè', highlightPart: 'e', meaning: 'bè nứa trôi sông', illustrationIcon: '🪵', imageDesc: 'chiếc bè' },
        { word: 'bé', highlightPart: 'e', meaning: 'em bé nhỏ', illustrationIcon: '👶', imageDesc: 'em bé' },
        { word: 'bế', highlightPart: 'ê', meaning: 'mẹ bế em', illustrationIcon: '🤱', imageDesc: 'mẹ bế bé' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bà bế bé.',
      writingSamples: ['e', 'ê', 'bé', 'bế'],
      speakingTopic: {
        title: 'Trên sân trường',
        prompt: 'Các bạn chơi nhảy dây, đọc sách dưới bóng mát cây xanh trên sân trường.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chữ cái nào có thêm "mũ nón" ở trên so với chữ e?',
        options: ['ê', 'a', 'o', 'u'],
        correctIndex: 0,
        explanation: 'Chữ "ê" là chữ "e" có thêm dấu mũ nón.'
      }
    ]
  },
  {
    id: 5,
    lessonNumber: 5,
    title: 'Ôn tập và kể chuyện (Búp bê và dế mèn)',
    type: 'review',
    pageRange: '22 - 23',
    part1_Letters: {
      title: 'Đoàn tàu chữ cái',
      letters: ['a', 'b', 'c', 'e', 'ê'],
      recognitionSentence: 'Đoàn tàu đưa các chữ cái và âm vần đi du lịch.',
      recognitionKeywords: ['a', 'b', 'c', 'e', 'ê']
    },
    part2_SyllablesAndWords: {
      title: 'Bảng ghép tiếng và Đọc từ ngữ',
      models: [
        { initial: 'b', vowel: 'a', result: 'ba' },
        { initial: 'b', vowel: 'e', result: 'be' },
        { initial: 'b', vowel: 'ê', result: 'bê' },
        { initial: 'c', vowel: 'a', result: 'ca' }
      ],
      readingSyllables: ['ba bà', 'be bé', 'cá bé', 'bè cá', 'bế bé'],
      words: [
        { word: 'ba bà', highlightPart: 'ba', meaning: 'số 3 và người bà' },
        { word: 'be bé', highlightPart: 'be', meaning: 'xinh xắn nhỏ nhắn' },
        { word: 'cá bé', highlightPart: 'cá', meaning: 'con cá nhỏ' },
        { word: 'bè cá', highlightPart: 'bè', meaning: 'bè nuôi cá trên sông' },
        { word: 'bế bé', highlightPart: 'bế', meaning: 'bế bồng em bé' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Kể chuyện: Búp bê và dế mèn',
      readingPassage: 'Bà bế bé.',
      writingSamples: ['bế bé', '66', '77', '88', '99', '00'],
      story: {
        title: 'Búp bê và dế mèn',
        pictures: [
          { id: 1, question: 'Búp bê làm những việc gì?', content: 'Búp bê chăm chỉ quét nhà, lau dọn bàn ghế.' },
          { id: 2, question: 'Vì sao dế mèn hát tặng búp bê?', content: 'Dế mèn thấy búp bê chăm chỉ và đáng yêu nên đã cất tiếng hát du dương tặng bạn.' },
          { id: 3, question: 'Búp bê thấy thế nào khi nghe dế mèn hát?', content: 'Búp bê vô cùng vui sướng và hạnh phúc.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Ai đã hát tặng búp bê vì bạn ấy chăm chỉ làm việc?',
        options: ['Dế mèn', 'Chim sâu', 'Gà trống', 'Cào cào'],
        correctIndex: 0,
        explanation: 'Dế mèn đã cất tiếng hát du dương tặng búp bê.'
      }
    ]
  },
  {
    id: 6,
    lessonNumber: 6,
    title: 'O o ? (thanh hỏi)',
    type: 'phonics',
    pageRange: '24 - 25',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['O', 'o', '?'],
      recognitionSentence: 'Đàn bò gặm cỏ.',
      recognitionKeywords: ['Đàn bò', 'gặm cỏ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'o', tone: 'huyền', result: 'bò', spellingSteps: ['bờ', 'o', 'bo', 'huyền', 'bò'] },
        { initial: 'c', vowel: 'o', tone: 'hỏi', result: 'cỏ', spellingSteps: ['cờ', 'o', 'co', 'hỏi', 'cỏ'] }
      ],
      readingSyllables: ['bò', 'bó', 'bỏ', 'cò', 'có', 'cỏ'],
      words: [
        { word: 'bò', highlightPart: 'o', meaning: 'con bò gặm cỏ', illustrationIcon: '🐄', imageDesc: 'con bò vàng' },
        { word: 'cò', highlightPart: 'o', meaning: 'con cò trắng', illustrationIcon: '🦩', imageDesc: 'con cò trắng' },
        { word: 'cỏ', highlightPart: 'o', meaning: 'bãi cỏ xanh', illustrationIcon: '🌱', imageDesc: 'bụi cỏ' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bê có cỏ.',
      writingSamples: ['o', 'bò', 'cỏ'],
      speakingTopic: {
        title: 'Chào hỏi lễ phép',
        prompt: 'Em chào bố mẹ khi đi học về và chào ông bà trong nhà.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng nào có âm "o" và thanh hỏi?',
        options: ['cỏ', 'cá', 'bò', 'be'],
        correctIndex: 0,
        explanation: 'c + o + hỏi = cỏ.'
      }
    ]
  },
  {
    id: 7,
    lessonNumber: 7,
    title: 'Ô ô . (thanh nặng)',
    type: 'phonics',
    pageRange: '26 - 27',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Ô', 'ô', '.'],
      recognitionSentence: 'Bố và Hà đi bộ trên hè phố.',
      recognitionKeywords: ['Bố', 'đi bộ', 'phố']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'ô', tone: 'sắc', result: 'bố', spellingSteps: ['bờ', 'ô', 'bô', 'sắc', 'bố'] },
        { initial: 'b', vowel: 'ô', tone: 'nặng', result: 'bộ', spellingSteps: ['bờ', 'ô', 'bô', 'nặng', 'bộ'] }
      ],
      readingSyllables: ['bố', 'bổ', 'bộ', 'cô', 'cổ', 'cộ'],
      words: [
        { word: 'bố', highlightPart: 'ô', meaning: 'người bố thân thương', illustrationIcon: '👨', imageDesc: 'người bố' },
        { word: 'cô bé', highlightPart: 'ô', meaning: 'bé gái đáng yêu', illustrationIcon: '👧', imageDesc: 'cô bé nhỏ' },
        { word: 'cổ cò', highlightPart: 'ô', meaning: 'cổ của chú cò', illustrationIcon: '🦤', imageDesc: 'cổ con cò' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bố bê bể cá.',
      writingSamples: ['ô', 'cổ cò'],
      speakingTopic: {
        title: 'Xe cộ',
        prompt: 'Quan sát và gọi tên các loại xe cộ: xe đạp, xe máy, xe ô tô.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Dấu nặng đặt ở vị trí nào so với con chữ?',
        options: ['Phía dưới chữ', 'Phía trên chữ', 'Bên trái chữ', 'Bên phải chữ'],
        correctIndex: 0,
        explanation: 'Dấu nặng luôn được đặt ở phía dưới nguyên âm (ví dụ: bộ, cộ).'
      }
    ]
  },
  {
    id: 8,
    lessonNumber: 8,
    title: 'D d Đ đ',
    type: 'phonics',
    pageRange: '28 - 29',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['D', 'd', 'Đ', 'đ'],
      recognitionSentence: 'Dưới gốc đa, các bạn chơi dung dăng dung dẻ.',
      recognitionKeywords: ['Dưới', 'gốc đa', 'dung dăng dung dẻ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'd', vowel: 'e', tone: 'hỏi', result: 'dẻ', spellingSteps: ['dờ', 'e', 'de', 'hỏi', 'dẻ'] },
        { initial: 'đ', vowel: 'a', result: 'đa', spellingSteps: ['đờ', 'a', 'đa'] }
      ],
      readingSyllables: ['da', 'dẻ', 'dế', 'đá', 'đò', 'đổ'],
      words: [
        { word: 'đá dế', highlightPart: 'd', meaning: 'trò chơi chọi dế', illustrationIcon: '🦗', imageDesc: 'chú dế mèn' },
        { word: 'đa đa', highlightPart: 'đ', meaning: 'chim đa đa', illustrationIcon: '🐦', imageDesc: 'chim đa đa' },
        { word: 'ô đỏ', highlightPart: 'đ', meaning: 'cái ô che màu đỏ', illustrationIcon: '☂️', imageDesc: 'chiếc ô đỏ' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bé có ô đỏ.',
      writingSamples: ['d', 'đ', 'đá dế'],
      speakingTopic: {
        title: 'Chào hỏi',
        prompt: 'Luyện tập chào hỏi người lớn tuổi, khách đến nhà chơi.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chữ "đ" khác chữ "d" ở điểm nào?',
        options: ['Có nét gạch ngang ở thân', 'Có thêm dấu chấm', 'Có thêm mũ', 'Không khác nhau'],
        correctIndex: 0,
        explanation: 'Chữ "đ" có nét gạch ngang ngắn ở phần trên thân chữ.'
      }
    ]
  },
  {
    id: 9,
    lessonNumber: 9,
    title: 'Ơ ơ ~ (thanh ngã)',
    type: 'phonics',
    pageRange: '30 - 31',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Ơ', 'ơ', '~'],
      recognitionSentence: 'Tàu dỡ hàng ở cảng.',
      recognitionKeywords: ['dỡ hàng', 'ở cảng']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'ơ', tone: 'huyền', result: 'bờ', spellingSteps: ['bờ', 'ơ', 'bơ', 'huyền', 'bờ'] },
        { initial: 'd', vowel: 'ơ', tone: 'ngã', result: 'dỡ', spellingSteps: ['dờ', 'ơ', 'dơ', 'ngã', 'dỡ'] }
      ],
      readingSyllables: ['bờ', 'bở', 'cờ', 'cỡ', 'dỡ', 'đỡ'],
      words: [
        { word: 'bờ đê', highlightPart: 'ơ', meaning: 'con đê ven sông', illustrationIcon: '🏞️', imageDesc: 'bờ đê xanh mát' },
        { word: 'cá cờ', highlightPart: 'ơ', meaning: 'loài cá đuôi cờ sặc sỡ', illustrationIcon: '🐠', imageDesc: 'cá cờ' },
        { word: 'đỡ bé', highlightPart: 'ơ', meaning: 'nâng đỡ em bé tập đi', illustrationIcon: '🚼', imageDesc: 'mẹ đỡ bé' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bố đỡ bé.',
      writingSamples: ['ơ', 'đỡ bé'],
      speakingTopic: {
        title: 'Phương tiện giao thông',
        prompt: 'Nói về tàu thuyền trên biển, ô tô đi trên đường.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Dấu ngã ( ~ ) kết hợp với chữ "cơ" tạo thành tiếng gì?',
        options: ['cỡ', 'cờ', 'cở', 'cớ'],
        correctIndex: 0,
        explanation: 'c + ơ + ngã = cỡ.'
      }
    ]
  },
  {
    id: 10,
    lessonNumber: 10,
    title: 'Ôn tập và kể chuyện (Đàn kiến con ngoan ngoãn)',
    type: 'review',
    pageRange: '32 - 33',
    part1_Letters: {
      title: 'Bảng ôn tập',
      letters: ['o', 'ô', 'ơ', 'd', 'đ'],
      recognitionSentence: 'Ôn tập các âm o, ô, ơ kết hợp với âm đầu d, đ và các dấu thanh.',
      recognitionKeywords: ['o', 'ô', 'ơ', 'd', 'đ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc tiếng và từ ngữ',
      models: [
        { initial: 'd', vowel: 'o', result: 'do' },
        { initial: 'd', vowel: 'ô', result: 'dô' },
        { initial: 'đ', vowel: 'ơ', result: 'đơ' }
      ],
      readingSyllables: ['bó cỏ', 'cá cờ', 'bờ đê', 'đỡ bà', 'cờ đỏ', 'đỗ đỏ', 'dỗ bé'],
      words: [
        { word: 'bó cỏ', highlightPart: 'o', meaning: 'bó cỏ cho bò ăn' },
        { word: 'cờ đỏ', highlightPart: 'đ', meaning: 'lá cờ đỏ tươi' },
        { word: 'đỗ đỏ', highlightPart: 'đ', meaning: 'hạt đậu đỏ ngọt bùi' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Kể chuyện: Đàn kiến con ngoan ngoãn',
      readingPassage: 'Bờ đê có dế. Bà có đỗ đỏ.',
      writingSamples: ['đỗ đỏ'],
      story: {
        title: 'Đàn kiến con ngoan ngoãn',
        pictures: [
          { id: 1, question: 'Bà kiến sống ở đâu?', content: 'Bà kiến sống một mình dưới gốc cây già ẩm ướt.' },
          { id: 2, question: 'Đàn kiến con dùng vật gì để khiêng bà kiến?', content: 'Đàn kiến con khiêng bà kiến bằng một chiếc lá xanh mượt.' },
          { id: 3, question: 'Đàn kiến con đưa bà kiến đến đâu?', content: 'Đưa bà đến ngôi nhà mới khô ráo và ấm áp.' },
          { id: 4, question: 'Được ở nhà mới, bà kiến nói gì với đàn kiến con?', content: 'Bà kiến cảm động khen đàn kiến con thật ngoan ngoãn, đoàn kết.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Đàn kiến con đã dùng vật gì để khiêng bà kiến về nhà mới?',
        options: ['Một chiếc lá xanh', 'Một cành cây', 'Một hòn đá', 'Một bông hoa'],
        correctIndex: 0,
        explanation: 'Đàn kiến con đã dùng một chiếc lá xanh mềm mại để khiêng bà.'
      }
    ]
  },
  {
    id: 11,
    lessonNumber: 11,
    title: 'I i K k',
    type: 'phonics',
    pageRange: '34 - 35',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['I', 'i', 'K', 'k'],
      recognitionSentence: 'Nam vẽ kì đà.',
      recognitionKeywords: ['vẽ', 'kì đà']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'k', vowel: 'i', result: 'ki', spellingSteps: ['ca', 'i', 'ki'] },
        { initial: 'k', vowel: 'i', tone: 'huyền', result: 'kì', spellingSteps: ['ca', 'i', 'ki', 'huyền', 'kì'] }
      ],
      readingSyllables: ['kè', 'kẻ', 'kệ', 'kí', 'kỉ', 'kĩ'],
      words: [
        { word: 'bí đỏ', highlightPart: 'i', meaning: 'quả bí ngô đỏ ngon ngọt', illustrationIcon: '🎃', imageDesc: 'quả bí đỏ' },
        { word: 'kẻ ô', highlightPart: 'k', meaning: 'dùng thước kẻ ô vuông', illustrationIcon: '📐', imageDesc: 'bàn tay kẻ ô' },
        { word: 'đi đò', highlightPart: 'i', meaning: 'đi thuyền đò qua sông', illustrationIcon: '🛶', imageDesc: 'thuyền đò' },
        { word: 'kì đà', highlightPart: 'k', meaning: 'con kì đà bò trên đá', illustrationIcon: '🦎', imageDesc: 'con kì đà' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Kì đà bò ở kẽ đá.',
      writingSamples: ['i', 'k', 'kì đà'],
      speakingTopic: {
        title: 'Giới thiệu bản thân',
        prompt: 'Giới thiệu tên, tuổi và lớp học của em cho các bạn trong trường.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Quy tắc chính tả: Âm "cờ" đi với âm "i, e, ê" được viết bằng chữ gì?',
        options: ['Chữ k', 'Chữ c', 'Chữ q', 'Chữ g'],
        correctIndex: 0,
        explanation: 'Âm "cờ" đứng trước i, e, ê luôn được viết bằng con chữ "k".'
      }
    ]
  },
  {
    id: 12,
    lessonNumber: 12,
    title: 'H h L l',
    type: 'phonics',
    pageRange: '36 - 37',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['H', 'h', 'L', 'l'],
      recognitionSentence: 'Le le bơi trên hồ.',
      recognitionKeywords: ['Le le', 'hồ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'h', vowel: 'ô', tone: 'huyền', result: 'hồ', spellingSteps: ['hờ', 'ô', 'hô', 'huyền', 'hồ'] },
        { initial: 'l', vowel: 'e', result: 'le', spellingSteps: ['lờ', 'e', 'le'] }
      ],
      readingSyllables: ['hé', 'ho', 'hổ', 'li', 'lọ', 'lỡ'],
      words: [
        { word: 'lá đỏ', highlightPart: 'l', meaning: 'chiếc lá màu đỏ', illustrationIcon: '🍁', imageDesc: 'chiếc lá đỏ' },
        { word: 'bờ hồ', highlightPart: 'h', meaning: 'bờ hồ nước trong xanh', illustrationIcon: '🏞️', imageDesc: 'bờ hồ nước' },
        { word: 'cá hố', highlightPart: 'h', meaning: 'loài cá biển', illustrationIcon: '🐟', imageDesc: 'cá hố' },
        { word: 'le le', highlightPart: 'l', meaning: 'loài chim vịt trời le le bơi nước', illustrationIcon: '🦆', imageDesc: 'chim le le' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bé bị ho. Bà đã có lá hẹ.',
      writingSamples: ['h', 'l', 'hồ', 'le le'],
      speakingTopic: {
        title: 'Cây cối',
        prompt: 'Kể tên các loài cây ăn quả trong vườn nhà hoặc trường em.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng nào có âm đầu là "l"?',
        options: ['lá', 'hổ', 'hồ', 'hè'],
        correctIndex: 0,
        explanation: 'Tiếng "lá" bắt đầu bằng âm đầu "l".'
      }
    ]
  },
  {
    id: 13,
    lessonNumber: 13,
    title: 'U u Ư ư',
    type: 'phonics',
    pageRange: '38 - 39',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['U', 'u', 'Ư', 'ư'],
      recognitionSentence: 'Đu đủ chín ngọt lừ.',
      recognitionKeywords: ['Đu đủ', 'ngọt lừ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'đ', vowel: 'u', tone: 'hỏi', result: 'đủ', spellingSteps: ['đờ', 'u', 'đu', 'hỏi', 'đủ'] },
        { initial: 'l', vowel: 'ư', tone: 'huyền', result: 'lừ', spellingSteps: ['lờ', 'ư', 'lư', 'huyền', 'lừ'] }
      ],
      readingSyllables: ['dù', 'đủ', 'hũ', 'cử', 'dự', 'lữ'],
      words: [
        { word: 'dù', highlightPart: 'u', meaning: 'cái ô dù che mưa', illustrationIcon: '🪂', imageDesc: 'chiếc dù' },
        { word: 'đu đủ', highlightPart: 'u', meaning: 'quả đu đủ chín vàng', illustrationIcon: '🍈', imageDesc: 'quả đu đủ' },
        { word: 'hổ dữ', highlightPart: 'ư', meaning: 'con hổ hung dữ', illustrationIcon: '🐅', imageDesc: 'con hổ' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Cá hổ là cá dữ.',
      writingSamples: ['u', 'ư', 'dù', 'hổ dữ'],
      speakingTopic: {
        title: 'Giới thiệu',
        prompt: 'Tập nói trước nhóm bạn để chia sẻ sở thích của em.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chữ "ư" có đặc điểm gì khác so với chữ "u"?',
        options: ['Có thêm nét râu (móc) ở trên đầu', 'Có thêm dấu mũ', 'Có thêm nét gạch ngang', 'Không có gì khác'],
        correctIndex: 0,
        explanation: 'Chữ "ư" có thêm nét râu nhỏ ở bên phải trên đầu.'
      }
    ]
  },
  {
    id: 14,
    lessonNumber: 14,
    title: 'Ch ch Kh kh',
    type: 'phonics',
    pageRange: '40 - 41',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Ch', 'ch', 'Kh', 'kh'],
      recognitionSentence: 'Mấy chú khỉ ăn chuối.',
      recognitionKeywords: ['chú khỉ', 'ăn chuối']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'ch', vowel: 'u', tone: 'sắc', result: 'chú', spellingSteps: ['chờ', 'u', 'chu', 'sắc', 'chú'] },
        { initial: 'kh', vowel: 'i', tone: 'hỏi', result: 'khỉ', spellingSteps: ['khờ', 'i', 'khi', 'hỏi', 'khỉ'] }
      ],
      readingSyllables: ['chè', 'chỉ', 'chợ', 'khế', 'kho', 'khô'],
      words: [
        { word: 'lá khô', highlightPart: 'kh', meaning: 'chiếc lá rụng khô vàng', illustrationIcon: '🍂', imageDesc: 'lá khô' },
        { word: 'chú khỉ', highlightPart: 'ch', meaning: 'chú khỉ tinh nghịch', illustrationIcon: '🐒', imageDesc: 'chú khỉ' },
        { word: 'chợ cá', highlightPart: 'ch', meaning: 'nơi buôn bán các loại cá', illustrationIcon: '🏪', imageDesc: 'khu chợ cá' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Chị có cá kho khế.',
      writingSamples: ['ch', 'kh', 'chú khỉ'],
      speakingTopic: {
        title: 'Cá cảnh',
        prompt: 'Quan sát bể cá cảnh nhiều sắc màu bơi lội tung tăng.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Âm "ch" ghép bởi hai chữ cái nào?',
        options: ['c và h', 'k và h', 'g và h', 'n và h'],
        correctIndex: 0,
        explanation: 'Âm "ch" gồm chữ c đứng trước và chữ h đứng sau.'
      }
    ]
  },
  {
    id: 15,
    lessonNumber: 15,
    title: 'Ôn tập và kể chuyện (Con quạ thông minh)',
    type: 'review',
    pageRange: '42 - 43',
    part1_Letters: {
      title: 'Bảng ôn tập âm đôi',
      letters: ['k', 'h', 'l', 'ch', 'kh'],
      recognitionSentence: 'Ôn tập các âm kết hợp với e, ê, i, u, ư.',
      recognitionKeywords: ['k', 'h', 'l', 'ch', 'kh']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc tiếng và từ ngữ',
      models: [
        { initial: 'k', vowel: 'e', result: 'ke' },
        { initial: 'ch', vowel: 'ê', result: 'chê' },
        { initial: 'kh', vowel: 'u', result: 'khu' }
      ],
      readingSyllables: ['chú hề', 'chợ cá', 'che ô', 'bờ hồ', 'lá khô', 'cá dữ', 'lá hẹ'],
      words: [
        { word: 'chú hề', highlightPart: 'ch', meaning: 'chú hề vui nhộn' },
        { word: 'che ô', highlightPart: 'ch', meaning: 'cầm ô che nắng mưa' },
        { word: 'lá hẹ', highlightPart: 'h', meaning: 'vị thuốc quý giúp giảm ho' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Kể chuyện: Con quạ thông minh',
      readingPassage: 'Chị cho bé cá cờ. Dì Kha cho Hà đi chợ.',
      writingSamples: ['cá kho khế'],
      story: {
        title: 'Con quạ thông minh',
        pictures: [
          { id: 1, question: 'Quạ nhìn thấy gì dưới gốc cây?', content: 'Quạ khát nước nhìn thấy một chiếc bình có một chút nước ở đáy bình.' },
          { id: 2, question: 'Quạ có uống được nước trong bình không? Vì sao?', content: 'Cổ bình cao và hẹp nên quạ không thể thò mỏ xuống tới nước.' },
          { id: 3, question: 'Quạ đã nghĩ ra điều gì?', content: 'Quạ gắp từng viên sỏi nhỏ thả vào trong bình.' },
          { id: 4, question: 'Cuối cùng, quạ có uống được nước không?', content: 'Nước dâng lên cao miệng bình, quạ tha hồ uống thỏa thích.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Con quạ đã làm cách nào để nước trong bình dâng lên?',
        options: ['Gắp sỏi thả vào bình', 'Làm nghiêng bình', 'Đập vỡ bình', 'Bay đi tìm chỗ khác'],
        correctIndex: 0,
        explanation: 'Quạ kiên trì gắp từng viên sỏi thả vào bình làm mực nước dâng cao.'
      }
    ]
  },
  {
    id: 16,
    lessonNumber: 16,
    title: 'M m N n',
    type: 'phonics',
    pageRange: '44 - 45',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['M', 'm', 'N', 'n'],
      recognitionSentence: 'Mẹ mua nơ cho Hà.',
      recognitionKeywords: ['Mẹ mua', 'nơ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'm', vowel: 'e', tone: 'nặng', result: 'mẹ', spellingSteps: ['mờ', 'e', 'me', 'nặng', 'mẹ'] },
        { initial: 'n', vowel: 'ơ', result: 'nơ', spellingSteps: ['nờ', 'ơ', 'nơ'] }
      ],
      readingSyllables: ['má', 'mẹ', 'mỡ', 'na', 'nề', 'nở'],
      words: [
        { word: 'cá mè', highlightPart: 'm', meaning: 'loài cá mè nước ngọt', illustrationIcon: '🐟', imageDesc: 'cá mè' },
        { word: 'lá me', highlightPart: 'm', meaning: 'lá cây me chua', illustrationIcon: '🌿', imageDesc: 'cành lá me' },
        { word: 'nơ đỏ', highlightPart: 'n', meaning: 'chiếc nơ thắt màu đỏ', illustrationIcon: '🎀', imageDesc: 'chiếc nơ đỏ' },
        { word: 'ca nô', highlightPart: 'n', meaning: 'thuyền ca nô lướt sóng', illustrationIcon: '🚤', imageDesc: 'chiếc ca nô' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bố mẹ cho Hà đi ca nô.',
      writingSamples: ['m', 'n', 'cá mè', 'nơ đỏ'],
      speakingTopic: {
        title: 'Giới thiệu',
        prompt: 'Nói về công viên vui chơi và chú công an thân thiện giúp đỡ các bạn nhỏ.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "mẹ" gồm âm đầu m, âm chính e và dấu thanh gì?',
        options: ['Thanh nặng', 'Thanh sắc', 'Thanh huyền', 'Thanh hỏi'],
        correctIndex: 0,
        explanation: 'm + e + nặng = mẹ.'
      }
    ]
  },
  {
    id: 17,
    lessonNumber: 17,
    title: 'G g Gi gi',
    type: 'phonics',
    pageRange: '46 - 47',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['G', 'g', 'Gi', 'gi'],
      recognitionSentence: 'Hà có giỏ trứng gà.',
      recognitionKeywords: ['giỏ', 'trứng gà']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'g', vowel: 'a', tone: 'huyền', result: 'gà', spellingSteps: ['gờ', 'a', 'ga', 'huyền', 'gà'] },
        { initial: 'gi', vowel: 'o', tone: 'hỏi', result: 'giỏ', spellingSteps: ['gi', 'o', 'gio', 'hỏi', 'giỏ'] }
      ],
      readingSyllables: ['ga', 'gỗ', 'gụ', 'giá', 'giò', 'giỗ'],
      words: [
        { word: 'gà gô', highlightPart: 'g', meaning: 'loài chim gà gô', illustrationIcon: '🦃', imageDesc: 'gà gô' },
        { word: 'đồ gỗ', highlightPart: 'g', meaning: 'bàn ghế tủ làm bằng gỗ', illustrationIcon: '🪑', imageDesc: 'bàn ghế gỗ' },
        { word: 'giá đỗ', highlightPart: 'gi', meaning: 'mầm đỗ xanh tươi ngon', illustrationIcon: '🌱', imageDesc: 'giá đỗ' },
        { word: 'cụ già', highlightPart: 'gi', meaning: 'ông cụ già kính cẩn', illustrationIcon: '👴', imageDesc: 'cụ già' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bà che gió cho ba chú gà.',
      writingSamples: ['g', 'gi', 'gà gô', 'giá đỗ'],
      speakingTopic: {
        title: 'Vật nuôi',
        prompt: 'Nói về các con vật nuôi trong gia đình: gà, lợn, chó, mèo con.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng nào bắt đầu bằng âm "gi"?',
        options: ['giỏ', 'gà', 'gỗ', 'ga'],
        correctIndex: 0,
        explanation: 'Tiếng "giỏ" bắt đầu bằng âm "gi".'
      }
    ]
  },
  {
    id: 18,
    lessonNumber: 18,
    title: 'Gh gh Nh nh',
    type: 'phonics',
    pageRange: '48 - 49',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Gh', 'gh', 'Nh', 'nh'],
      recognitionSentence: 'Hà ghé nhà bà. Nhà bà ở ngõ nhỏ.',
      recognitionKeywords: ['ghé', 'nhà bà', 'ngõ nhỏ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'gh', vowel: 'e', tone: 'sắc', result: 'ghé', spellingSteps: ['gờ ghép', 'e', 'ghe', 'sắc', 'ghé'] },
        { initial: 'nh', vowel: 'a', tone: 'huyền', result: 'nhà', spellingSteps: ['nhờ', 'a', 'nha', 'huyền', 'nhà'] }
      ],
      readingSyllables: ['ghẹ', 'ghế', 'ghi', 'nhà', 'nhẹ', 'nhỏ'],
      words: [
        { word: 'ghế đá', highlightPart: 'gh', meaning: 'ghế ngồi công viên', illustrationIcon: '🪑', imageDesc: 'ghế đá' },
        { word: 'ghẹ đỏ', highlightPart: 'gh', meaning: 'con ghẹ biển màu đỏ', illustrationIcon: '🦀', imageDesc: 'con ghẹ đỏ' },
        { word: 'nhà gỗ', highlightPart: 'nh', meaning: 'ngôi nhà dựng bằng gỗ', illustrationIcon: '🏡', imageDesc: 'nhà gỗ' },
        { word: 'lá nho', highlightPart: 'nh', meaning: 'lá của chùm nho', illustrationIcon: '🍇', imageDesc: 'lá nho' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Mẹ nhờ Hà bê ghế nhỏ.',
      writingSamples: ['gh', 'nh', 'ghẹ', 'lá nho'],
      speakingTopic: {
        title: 'Giới thiệu gia đình',
        prompt: 'Giới thiệu bố mẹ với cô giáo hoặc bạn bè khi đến thăm nhà.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chữ "gh" chỉ ghép với những nguyên âm nào?',
        options: ['e, ê, i', 'a, o, u', 'ơ, ư, ă', 'o, ô, ơ'],
        correctIndex: 0,
        explanation: 'Quy tắc chính tả: gh luôn đi cùng e, ê, i (ví dụ: ghế, ghi, ghẹ).'
      }
    ]
  },
  {
    id: 19,
    lessonNumber: 19,
    title: 'Ng ng Ngh ngh',
    type: 'phonics',
    pageRange: '50 - 51',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Ng', 'ng', 'Ngh', 'ngh'],
      recognitionSentence: 'Nghé theo mẹ ra ngõ.',
      recognitionKeywords: ['Nghé', 'ngõ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'ng', vowel: 'o', tone: 'ngã', result: 'ngõ', spellingSteps: ['ngờ', 'o', 'ngo', 'ngã', 'ngõ'] },
        { initial: 'ngh', vowel: 'e', tone: 'sắc', result: 'nghé', spellingSteps: ['ngờ ghép', 'e', 'nghe', 'sắc', 'nghé'] }
      ],
      readingSyllables: ['ngã', 'ngủ', 'ngự', 'nghe', 'nghé', 'nghĩ'],
      words: [
        { word: 'ngã ba', highlightPart: 'ng', meaning: 'nơi giao nhau của ba con đường', illustrationIcon: '🛣️', imageDesc: 'ngã ba đường' },
        { word: 'ngõ nhỏ', highlightPart: 'ng', meaning: 'con ngõ làng xinh xắn', illustrationIcon: '🏘️', imageDesc: 'ngõ nhỏ' },
        { word: 'củ nghệ', highlightPart: 'ngh', meaning: 'củ nghệ vàng', illustrationIcon: '🫚', imageDesc: 'củ nghệ' },
        { word: 'nghỉ hè', highlightPart: 'ngh', meaning: 'thời gian nghỉ hè vui chơi', illustrationIcon: '🏖️', imageDesc: 'nghỉ hè' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Nghé đã no cỏ. Nghé ngủ ở bờ đê.',
      writingSamples: ['ng', 'ngh', 'ngõ', 'củ nghệ'],
      speakingTopic: {
        title: 'Thăm vườn bách thú',
        prompt: 'Kể về chuyến đi thăm các con vật hươu cao cổ, voi, sư tử tại vườn bách thú.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chữ "ngh" (ngờ kép) ghép với nguyên âm nào đúng luật chính tả?',
        options: ['e, ê, i', 'a, o, u', 'ă, â, ơ', 'o, ô, u'],
        correctIndex: 0,
        explanation: 'Tương tự gh và k, ngh chỉ ghép với e, ê, i.'
      }
    ]
  },
  {
    id: 20,
    lessonNumber: 20,
    title: 'Ôn tập và kể chuyện (Cô chủ không biết quý tình bạn)',
    type: 'review',
    pageRange: '52 - 53',
    part1_Letters: {
      title: 'Bảng ôn tập',
      letters: ['m', 'n', 'g', 'gi', 'gh', 'nh', 'ng', 'ngh'],
      recognitionSentence: 'Ôn tập các âm phụ âm đầu đã học qua cây táo chữ.',
      recognitionKeywords: ['m', 'n', 'g', 'gi', 'gh', 'nh', 'ng', 'ngh']
    },
    part2_SyllablesAndWords: {
      title: 'Quả táo mang chữ',
      models: [
        { initial: 'm', vowel: 'e', result: 'me' },
        { initial: 'nh', vowel: 'o', result: 'nho' }
      ],
      readingSyllables: ['nụ cà', 'nhà ga', 'nghỉ hè', 'ngủ mơ', 'bỡ ngỡ', 'giá đỗ', 'nho nhỏ', 'ghế gỗ'],
      words: [
        { word: 'nhà ga', highlightPart: 'g', meaning: 'ga tàu đón tàu hỏa' },
        { word: 'nghỉ hè', highlightPart: 'ngh', meaning: 'mùa hè tươi vui' },
        { word: 'ghế gỗ', highlightPart: 'gh', meaning: 'chiếc ghế làm bằng gỗ' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Kể chuyện: Cô chủ không biết quý tình bạn',
      readingPassage: 'Mẹ ghé nhà bà. Nhà bà ở ngõ nhỏ.',
      writingSamples: ['ngõ nhỏ nhà bà'],
      story: {
        title: 'Cô chủ không biết quý tình bạn',
        pictures: [
          { id: 1, question: 'Cô bé nuôi con vật gì? Cô bé muốn đổi lấy con vật nào?', content: 'Cô bé nuôi gà trống gáy vang, rồi lại đổi lấy gà mái.' },
          { id: 2, question: 'Cô bé đổi gà mái lấy con vật nào?', content: 'Cô bé đổi gà mái lấy một chú vịt bầu.' },
          { id: 3, question: 'Thấy chú chó nhỏ xinh xắn, cô bé đã làm gì?', content: 'Cô bé lại đổi vịt lấy chú cún con.' },
          { id: 4, question: 'Cuối cùng, có con vật nào ở bên cô bé không? Vì sao?', content: 'Chú chó biết cô chủ hay thay đổi nên đã bỏ đi. Cô bé ở lại một mình trong buồn bã.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Bài học rút ra từ câu chuyện "Cô chủ không biết quý tình bạn" là gì?',
        options: ['Phải biết trân trọng và thủy chung với bạn bè', 'Nên thường xuyên đổi bạn mới', 'Không nên nuôi con vật', 'Chỉ nên chơi một mình'],
        correctIndex: 0,
        explanation: 'Tình bạn là điều quý giá, cần phải trân trọng và yêu thương bạn bè.'
      }
    ]
  },
  {
    id: 21,
    lessonNumber: 21,
    title: 'R r S s',
    type: 'phonics',
    pageRange: '54 - 55',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['R', 'r', 'S', 's'],
      recognitionSentence: 'Bầy sẻ non ríu ra ríu rít bên mẹ.',
      recognitionKeywords: ['sẻ non', 'ríu ra ríu rít']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'r', vowel: 'a', result: 'ra', spellingSteps: ['rờ', 'a', 'ra'] },
        { initial: 's', vowel: 'e', tone: 'hỏi', result: 'sẻ', spellingSteps: ['sờ', 'e', 'se', 'hỏi', 'sẻ'] }
      ],
      readingSyllables: ['ra', 'rế', 'rổ', 'sả', 'sẽ', 'sò'],
      words: [
        { word: 'rổ rá', highlightPart: 'r', meaning: 'vật dụng đan bằng tre', illustrationIcon: '🧺', imageDesc: 'rổ rá' },
        { word: 'cá rô', highlightPart: 'r', meaning: 'loài cá rô đồng', illustrationIcon: '🐟', imageDesc: 'cá rô' },
        { word: 'su su', highlightPart: 's', meaning: 'quả su su xanh luộc chấm muối vừng', illustrationIcon: '🥑', imageDesc: 'quả su su' },
        { word: 'chữ số', highlightPart: 's', meaning: 'các con số toán học', illustrationIcon: '🔢', imageDesc: 'chữ số' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Chợ có gà ri, cá rô, su su. Chợ có cả rổ rá.',
      writingSamples: ['r', 's', 'rổ rá', 'su su'],
      speakingTopic: {
        title: 'Cảm ơn',
        prompt: 'Nói lời cảm ơn khi được nhận quà sinh nhật hoặc khi được người khác giúp đỡ.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng nào bắt đầu bằng âm "r"?',
        options: ['rổ', 'su', 'sò', 'sả'],
        correctIndex: 0,
        explanation: 'Tiếng "rổ" bắt đầu bằng phụ âm "r".'
      }
    ]
  },
  {
    id: 22,
    lessonNumber: 22,
    title: 'T t Tr tr',
    type: 'phonics',
    pageRange: '56 - 57',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['T', 't', 'Tr', 'tr'],
      recognitionSentence: 'Nam tô bức tranh cây tre.',
      recognitionKeywords: ['tranh', 'cây tre']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 't', vowel: 'ô', result: 'tô', spellingSteps: ['tờ', 'ô', 'tô'] },
        { initial: 'tr', vowel: 'e', result: 'tre', spellingSteps: ['trờ', 'e', 'tre'] }
      ],
      readingSyllables: ['tá', 'tạ', 'tẻ', 'trê', 'trò', 'trổ'],
      words: [
        { word: 'ô tô', highlightPart: 't', meaning: 'xe ô tô 4 bánh', illustrationIcon: '🚗', imageDesc: 'ô tô' },
        { word: 'sư tử', highlightPart: 't', meaning: 'con sư tử dũng mãnh', illustrationIcon: '🦁', imageDesc: 'sư tử' },
        { word: 'cá trê', highlightPart: 'tr', meaning: 'loài cá trê nước ngọt', illustrationIcon: '🐟', imageDesc: 'cá trê' },
        { word: 'tre ngà', highlightPart: 'tr', meaning: 'cây tre ngà thân vàng óng', illustrationIcon: '🎋', imageDesc: 'tre ngà' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Hà tả hồ cá. Hồ to, có cá mè, cá trê, cá rô.',
      writingSamples: ['t', 'tr', 'ô tô', 'cá trê'],
      speakingTopic: {
        title: 'Bảo vệ môi trường',
        prompt: 'Nói về việc giữ gìn biển xanh, bảo vệ các loài sinh vật biển như cá heo.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "tre" được ghép bởi âm đầu nào?',
        options: ['tr', 't', 'th', 'ch'],
        correctIndex: 0,
        explanation: 'Tiếng "tre" gồm âm đầu "tr" và âm chính "e".'
      }
    ]
  },
  {
    id: 23,
    lessonNumber: 23,
    title: 'Th th ia',
    type: 'phonics',
    pageRange: '58 - 59',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Th', 'th', 'ia'],
      recognitionSentence: 'Trung thu, bé được chia quà.',
      recognitionKeywords: ['thu', 'chia quà']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'th', vowel: 'u', result: 'thu', spellingSteps: ['thờ', 'u', 'thu'] },
        { initial: 'ch', vowel: 'ia', result: 'chia', spellingSteps: ['chờ', 'ia', 'chia'] }
      ],
      readingSyllables: ['thẻ', 'thọ', 'thơ', 'đĩa', 'mía', 'thìa'],
      words: [
        { word: 'thủ đô', highlightPart: 'th', meaning: 'thủ đô Hà Nội thân yêu', illustrationIcon: '🏛️', imageDesc: 'cột cờ thủ đô' },
        { word: 'lá thư', highlightPart: 'th', meaning: 'bức thư gửi người thân', illustrationIcon: '✉️', imageDesc: 'lá thư' },
        { word: 'thìa dĩa', highlightPart: 'ia', meaning: 'bộ thìa và dĩa ăn cơm', illustrationIcon: '🍴', imageDesc: 'thìa dĩa' },
        { word: 'lá tía tô', highlightPart: 'ia', meaning: 'cây thuốc tía tô thơm', illustrationIcon: '🌿', imageDesc: 'lá tía tô' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bé chia thìa, chia đĩa cho cả nhà. Thìa đĩa to cho bố mẹ. Thìa đĩa nhỏ cho bé.',
      writingSamples: ['th', 'ia', 'thủ đô', 'thìa'],
      speakingTopic: {
        title: 'Cảm ơn',
        prompt: 'Biết nói lời cảm ơn khi cô giáo trao phần thưởng hoặc khi bạn cho mượn đồ.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Vần "ia" gồm những chữ cái nào ghép lại?',
        options: ['i và a', 'u và a', 'ư và a', 'y và a'],
        correctIndex: 0,
        explanation: 'Vần "ia" được ghép từ nguyên âm đôi i và a.'
      }
    ]
  },
  {
    id: 24,
    lessonNumber: 24,
    title: 'ua ưa',
    type: 'phonics',
    pageRange: '60 - 61',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ua', 'ưa'],
      recognitionSentence: 'Mẹ đưa Hà đến lớp học múa.',
      recognitionKeywords: ['đưa', 'múa']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'm', vowel: 'ua', tone: 'sắc', result: 'múa', spellingSteps: ['mờ', 'ua', 'mua', 'sắc', 'múa'] },
        { initial: 'đ', vowel: 'ưa', result: 'đưa', spellingSteps: ['đờ', 'ưa', 'đưa'] }
      ],
      readingSyllables: ['cua', 'đũa', 'rùa', 'cửa', 'dứa', 'nhựa'],
      words: [
        { word: 'cà chua', highlightPart: 'ua', meaning: 'quả cà chua đỏ mọng', illustrationIcon: '🍅', imageDesc: 'cà chua' },
        { word: 'múa ô', highlightPart: 'ua', meaning: 'điệu múa vùng cao', illustrationIcon: '💃', imageDesc: 'múa ô' },
        { word: 'dưa lê', highlightPart: 'ưa', meaning: 'quả dưa lê thơm ngọt', illustrationIcon: '🍈', imageDesc: 'dưa lê' },
        { word: 'cửa sổ', highlightPart: 'ưa', meaning: 'cửa sổ đón gió', illustrationIcon: '🪟', imageDesc: 'cửa sổ' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Mẹ đi chợ mua cá, mua cua. Mẹ mua cả sữa chua, dưa lê.',
      writingSamples: ['ua', 'ưa', 'cà chua', 'dưa lê'],
      speakingTopic: {
        title: 'Giúp mẹ',
        prompt: 'Kể những việc em có thể làm để giúp đỡ mẹ khi ở nhà như nhặt rau, dọn bàn.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "múa" chứa vần nào?',
        options: ['ua', 'ưa', 'ia', 'oi'],
        correctIndex: 0,
        explanation: 'm + ua + sắc = múa.'
      }
    ]
  },
  {
    id: 25,
    lessonNumber: 25,
    title: 'Ôn tập và kể chuyện (Chó sói và cừu non)',
    type: 'review',
    pageRange: '62 - 63',
    part1_Letters: {
      title: 'Bảng ghép vần',
      letters: ['r', 's', 't', 'tr', 'th', 'ia', 'ua', 'ưa'],
      recognitionSentence: 'Ôn tập các âm và vần đã học trong tuần qua cánh chim bồ câu mang túi chữ.',
      recognitionKeywords: ['r', 's', 't', 'tr', 'th', 'ia', 'ua', 'ưa']
    },
    part2_SyllablesAndWords: {
      title: 'Túi quà từ ngữ',
      models: [
        { initial: 'r', vowel: 'i', result: 'ri' },
        { initial: 't', vowel: 'ia', result: 'tia' }
      ],
      readingSyllables: ['củ sả', 'lưa thưa', 'rễ tre', 'lá mía', 'mùa thu', 'cửa sổ', 'khế chua', 'tổ cò'],
      words: [
        { word: 'lá mía', highlightPart: 'ia', meaning: 'lá cây mía ngọt' },
        { word: 'mùa thu', highlightPart: 'ua', meaning: 'tiết trời thu mát lành' },
        { word: 'khế chua', highlightPart: 'ua', meaning: 'quả khế 5 múi chua thanh' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Kể chuyện: Chó sói và cừu non',
      readingPassage: 'Mùa hè, nhà bà có dừa, có dưa lê. Mùa thu, nhà bà có na, có thị.',
      writingSamples: ['giữa mùa mưa lũ'],
      story: {
        title: 'Chó sói và cừu non',
        pictures: [
          { id: 1, question: 'Nhởn nhơ gặm cỏ, cừu non gặp phải chuyện gì?', content: 'Cừu non mải ăn cỏ bị một con sói hung dữ rình bắt.' },
          { id: 2, question: 'Cừu non nói gì với sói?', content: 'Cừu non bình tĩnh xin sói cho hát một bài trước khi chết.' },
          { id: 3, question: 'Cừu non đã làm gì để thoát khỏi sói?', content: 'Cừu non cất tiếng be be thật to để bác nông dân nghe thấy.' },
          { id: 4, question: 'Câu chuyện kết thúc như thế nào?', content: 'Bác nông dân cầm gậy đuổi sói chạy té khói, cứu được cừu non.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Nhờ đâu cừu non thoát khỏi móng vuốt của chó sói?',
        options: ['Thông minh, bình tĩnh hát to báo hiệu cho bác nông dân', 'Chạy nhanh hơn sói', 'Húc ngã sói', 'Có bầy cừu đến cứu'],
        correctIndex: 0,
        explanation: 'Cừu non bình tĩnh lừa sói để kêu to cho bác nông dân đến cứu.'
      }
    ]
  },
  {
    id: 26,
    lessonNumber: 26,
    title: 'Ph ph Qu qu',
    type: 'phonics',
    pageRange: '64 - 65',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Ph', 'ph', 'Qu', 'qu'],
      recognitionSentence: 'Cả nhà từ phố về thăm quê.',
      recognitionKeywords: ['phố', 'quê']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'ph', vowel: 'ô', tone: 'sắc', result: 'phố', spellingSteps: ['phờ', 'ô', 'phô', 'sắc', 'phố'] },
        { initial: 'qu', vowel: 'ê', result: 'quê', spellingSteps: ['quờ', 'ê', 'quê'] }
      ],
      readingSyllables: ['phà', 'phí', 'phở', 'quạ', 'quê', 'quế'],
      words: [
        { word: 'pha trà', highlightPart: 'ph', meaning: 'ấm trà thơm', illustrationIcon: '🍵', imageDesc: 'pha trà' },
        { word: 'phố cổ', highlightPart: 'ph', meaning: 'khu phố cổ kính Hà Nội', illustrationIcon: '🏮', imageDesc: 'phố cổ' },
        { word: 'quê nhà', highlightPart: 'qu', meaning: 'vùng quê thanh bình êm ả', illustrationIcon: '🏡', imageDesc: 'quê nhà' },
        { word: 'quả khế', highlightPart: 'qu', meaning: 'quả khế năm cánh', illustrationIcon: '⭐', imageDesc: 'quả khế' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Bà ra Thủ đô. Bà cho bé quà quê. Bố đưa bà đi Bờ Hồ, đi phố cổ.',
      writingSamples: ['ph', 'qu', 'pha trà', 'quê nhà'],
      speakingTopic: {
        title: 'Cảm ơn',
        prompt: 'Luyện nói câu cảm ơn khi được bác sĩ khám bệnh hoặc khi bạn bè giúp đỡ.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng nào bắt đầu bằng âm "ph"?',
        options: ['phở', 'quê', 'quạ', 'quế'],
        correctIndex: 0,
        explanation: 'Tiếng "phở" bắt đầu bằng âm "ph".'
      }
    ]
  },
  {
    id: 27,
    lessonNumber: 27,
    title: 'V v X x',
    type: 'phonics',
    pageRange: '66 - 67',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['V', 'v', 'X', 'x'],
      recognitionSentence: 'Hà vẽ xe đạp.',
      recognitionKeywords: ['vẽ', 'xe đạp']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'v', vowel: 'e', tone: 'ngã', result: 'vẽ', spellingSteps: ['vờ', 'e', 've', 'ngã', 'vẽ'] },
        { initial: 'x', vowel: 'e', result: 'xe', spellingSteps: ['xờ', 'e', 'xe'] }
      ],
      readingSyllables: ['võ', 'vở', 'vua', 'xỉa', 'xứ', 'xưa'],
      words: [
        { word: 'vở vẽ', highlightPart: 'v', meaning: 'cuốn tập vẽ tranh', illustrationIcon: '🎨', imageDesc: 'vở vẽ' },
        { word: 'vỉa hè', highlightPart: 'v', meaning: 'lối đi bộ bên đường', illustrationIcon: '🚶', imageDesc: 'vỉa hè' },
        { word: 'xe lu', highlightPart: 'x', meaning: 'xe lu làm đường', illustrationIcon: '🚜', imageDesc: 'xe lu' },
        { word: 'thị xã', highlightPart: 'x', meaning: 'khu đô thị đông vui', illustrationIcon: '🏙️', imageDesc: 'thị xã' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Nghỉ hè, bố mẹ cho Hà về quê. Quê Hà là xứ sở của dừa.',
      writingSamples: ['v', 'x', 'vở vẽ', 'xe lu'],
      speakingTopic: {
        title: 'Thành phố và nông thôn',
        prompt: 'Nói về sự khác nhau giữa phố phường nhộn nhịp và miền quê yên bình.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "vẽ" gồm âm đầu gì, âm chính gì và thanh gì?',
        options: ['Âm đầu v, âm chính e, thanh ngã', 'Âm đầu x, âm chính e, thanh sắc', 'Âm đầu v, âm chính e, thanh hỏi', 'Âm đầu b, âm chính e, thanh ngã'],
        correctIndex: 0,
        explanation: 'v + e + ngã = vẽ.'
      }
    ]
  },
  {
    id: 28,
    lessonNumber: 28,
    title: 'Y y',
    type: 'phonics',
    pageRange: '68 - 69',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['Y', 'y'],
      recognitionSentence: 'Thời gian quý hơn vàng bạc.',
      recognitionKeywords: ['quý']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm, tiếng, từ ngữ',
      models: [
        { initial: 'qu', vowel: 'y', tone: 'sắc', result: 'quý', spellingSteps: ['quờ', 'y', 'quy', 'sắc', 'quý'] }
      ],
      readingSyllables: ['quy', 'quỳ', 'quý', 'quỹ', 'quỵ', 'ý'],
      words: [
        { word: 'y tá', highlightPart: 'y', meaning: 'cô y tá chăm sóc người bệnh', illustrationIcon: '👩‍⚕️', imageDesc: 'y tá' },
        { word: 'dã quỳ', highlightPart: 'y', meaning: 'loài hoa dã quỳ vàng tươi', illustrationIcon: '🌻', imageDesc: 'hoa dã quỳ' },
        { word: 'đá quý', highlightPart: 'y', meaning: 'viên ngọc đá quý lấp lánh', illustrationIcon: '💎', imageDesc: 'đá quý' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Luyện viết, Luyện nói',
      readingPassage: 'Mẹ và Hà ghé nhà dì Kha. Dì kể cho Hà nghe về bà. Hà chú ý nghe dì kể.',
      writingSamples: ['y', 'y tá', 'đá quý'],
      speakingTopic: {
        title: 'Cảm ơn',
        prompt: 'Nói lời cảm ơn thầy cô, người thân khi nhận lì xì hoặc sách vở.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chữ cái nào được gọi là "i dài" trong bảng chữ cái Tiếng Việt?',
        options: ['y', 'i', 'v', 'u'],
        correctIndex: 0,
        explanation: 'Chữ "y" thường được gọi là chữ i dài (i-cờ-rét).'
      }
    ]
  },
  {
    id: 29,
    lessonNumber: 29,
    title: 'Luyện tập chính tả (c/k, g/gh, ng/ngh)',
    type: 'spelling_practice',
    pageRange: '70 - 71',
    part1_Letters: {
      title: 'Quy tắc chính tả',
      letters: ['c/k', 'g/gh', 'ng/ngh'],
      recognitionSentence: 'Ghi nhớ quy tắc ghép phụ âm với các nguyên âm e, ê, i.',
      recognitionKeywords: ['c', 'k', 'g', 'gh', 'ng', 'ngh']
    },
    part2_SyllablesAndWords: {
      title: 'Phân biệt và So sánh',
      models: [
        { initial: 'k', vowel: 'i', result: 'ki (k đi với i, e, ê)' },
        { initial: 'gh', vowel: 'e', result: 'ghe (gh đi với i, e, ê)' },
        { initial: 'ngh', vowel: 'ê', result: 'nghê (ngh đi với i, e, ê)' }
      ],
      readingSyllables: ['cô - ki', 'cư - kề', 'cò - kế', 'cá - kẻ', 'cổ - kỉ', 'cỡ - kẽ', 'cọ - kệ'],
      words: [
        { word: 'cá cờ', highlightPart: 'c', meaning: 'c đi với ơ' },
        { word: 'chữ kí', highlightPart: 'k', meaning: 'k đi với i' },
        { word: 'gà gô', highlightPart: 'g', meaning: 'g đi với a, ô' },
        { word: 'ghế gỗ', highlightPart: 'gh', meaning: 'gh đi với ê' },
        { word: 'cá ngừ', highlightPart: 'ng', meaning: 'ng đi với ư' },
        { word: 'củ nghệ', highlightPart: 'ngh', meaning: 'ngh đi với ê' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Thực hành điền âm đúng',
      readingPassage: 'Bé nhớ quy tắc: k, gh, ngh luôn đi liền với các âm i, e, ê.',
      writingSamples: ['chữ kí', 'ghế gỗ', 'củ nghệ']
    },
    quiz: [
      {
        id: 'q1',
        question: 'Điền chữ thích hợp vào chỗ trống: "củ ...ệ"?',
        options: ['ngh', 'ng', 'g', 'gh'],
        correctIndex: 0,
        explanation: 'Vì đứng trước chữ "ê" nên phải viết là "ngh" -> củ nghệ.'
      }
    ]
  },
  {
    id: 30,
    lessonNumber: 30,
    title: 'Ôn tập và kể chuyện (Kiến và dế mèn)',
    type: 'review',
    pageRange: '72 - 73',
    part1_Letters: {
      title: 'Bảng ôn tập',
      letters: ['ph', 'qu', 'v', 'x', 'y'],
      recognitionSentence: 'Ôn tập các âm kết hợp với a, e, ê, ơ qua những trang sách bay.',
      recognitionKeywords: ['ph', 'qu', 'v', 'x', 'y']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên cánh sách',
      models: [
        { initial: 'ph', vowel: 'a', result: 'pha' },
        { initial: 'qu', vowel: 'e', result: 'que' }
      ],
      readingSyllables: ['phố cổ', 'qua phà', 'vỉa hè', 'đá quý', 'cổ vũ', 'xa xa', 'xứ sở'],
      words: [
        { word: 'qua phà', highlightPart: 'ph', meaning: 'đi qua chuyến phà' },
        { word: 'vỉa hè', highlightPart: 'v', meaning: 'hè phố sạch đẹp' },
        { word: 'cổ vũ', highlightPart: 'c', meaning: 'hò reo động viên' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu và Kể chuyện: Kiến và dế mèn',
      readingPassage: 'Nhà bé ở Thủ đô. Thủ đô có Bờ Hồ. Quê bé ở Phú Thọ. Phú Thọ có chè, có cọ. Xa nhà, bé nhớ mẹ. Xa quê, bé nhớ bà.',
      writingSamples: ['chia quà cho bé'],
      story: {
        title: 'Kiến và dế mèn',
        pictures: [
          { id: 1, question: 'Mùa thu đến, đàn kiến làm gì?', content: 'Đàn kiến chăm chỉ tha mồi tích trữ thức ăn cho mùa đông.' },
          { id: 2, question: 'Còn dế mèn làm gì?', content: 'Dế mèn chỉ ca hát và rong chơi suốt ngày.' },
          { id: 3, question: 'Đông sang, đói quá, dế mèn đã làm gì? Chị kiến lớn nói gì?', content: 'Dế mèn run rẩy sang xin ăn. Kiến lớn cho dế ăn và khuyên bạn nên chăm chỉ lao động.' },
          { id: 4, question: 'Xuân về, dế mèn cùng đàn kiến làm gì?', content: 'Dế mèn đã hiểu ra và cùng đàn kiến chăm chỉ làm việc, vừa làm vừa ca hát vui vẻ.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Dế mèn đã học được bài học gì từ đàn kiến?',
        options: ['Phải biết chăm chỉ lao động, không được lười biếng', 'Không nên ăn hạt', 'Nên ngủ suốt mùa đông', 'Chỉ cần ca hát'],
        correctIndex: 0,
        explanation: 'Phải chăm chỉ lao động thì cuộc sống mới ấm no, hạnh phúc.'
      }
    ]
  }
];
