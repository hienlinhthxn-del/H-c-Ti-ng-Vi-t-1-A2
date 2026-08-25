import { Volume1Lesson } from '../types';

export const LESSONS_PART_2: Volume1Lesson[] = [
  {
    id: 31,
    lessonNumber: 31,
    title: 'an ăn ân',
    type: 'phonics',
    pageRange: '74 - 75',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['an', 'ăn', 'ân'],
      recognitionSentence: 'Ngựa vằn và hươu cao cổ là đôi bạn thân.',
      recognitionKeywords: ['vằn', 'bạn thân']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'an', tone: 'nặng', result: 'bạn', spellingSteps: ['bê', 'an', 'ban', 'nặng', 'bạn'] }
      ],
      readingSyllables: ['bản', 'nhãn', 'gắn', 'lặn', 'bận', 'gần'],
      words: [
        { word: 'bạn thân', highlightPart: 'an', meaning: 'người bạn thân thiết', illustrationIcon: '👭', imageDesc: 'hai bạn thân' },
        { word: 'khăn rằn', highlightPart: 'ăn', meaning: 'chiếc khăn rằn Nam Bộ', illustrationIcon: '🧣', imageDesc: 'khăn rằn' },
        { word: 'quả mận', highlightPart: 'ân', meaning: 'quả mận chín mọng', illustrationIcon: '🍑', imageDesc: 'quả mận' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện viết, Luyện nói',
      readingPassage: 'Đàn gà cứ tha thẩn gần chân mẹ. Đã có mẹ che chắn, cả đàn chả sợ gì lũ quạ dữ.',
      writingSamples: ['an', 'ăn', 'ân', 'bạn thân', 'khăn rằn'],
      speakingTopic: {
        title: 'Xin lỗi',
        prompt: 'Nói lời xin lỗi khi vô tình va phải bạn hoặc làm rơi đồ dùng của bạn.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "thân" chứa vần gì?',
        options: ['ân', 'an', 'ăn', 'en'],
        correctIndex: 0,
        explanation: 'th + ân = thân.'
      }
    ]
  },
  {
    id: 32,
    lessonNumber: 32,
    title: 'on ôn ơn',
    type: 'phonics',
    pageRange: '76 - 77',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['on', 'ôn', 'ơn'],
      recognitionSentence: 'Sơn ca véo von: Mẹ ơi, con đã lớn khôn.',
      recognitionKeywords: ['Sơn ca', 'véo von', 'lớn khôn']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'c', vowel: 'on', result: 'con', spellingSteps: ['cờ', 'on', 'con'] }
      ],
      readingSyllables: ['giòn', 'ngon', 'bốn', 'nhộn', 'gọn', 'lớn'],
      words: [
        { word: 'nón lá', highlightPart: 'on', meaning: 'chiếc nón lá truyền thống', illustrationIcon: '👒', imageDesc: 'nón lá' },
        { word: 'con chồn', highlightPart: 'ôn', meaning: 'chú chồn nhỏ tinh nghịch', illustrationIcon: '🦡', imageDesc: 'con chồn' },
        { word: 'sơn ca', highlightPart: 'ơn', meaning: 'chim sơn ca hót hay', illustrationIcon: '🐦', imageDesc: 'chim sơn ca' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc bài đồng dao & Luyện nói',
      readingPassage: 'Bốn chú lợn con\nVe vẻ vè ve\nVề bốn chú lợn\nNhởn nhơ nô giỡn\nĂn ngủ vô tư.\nHẳn họ nhà "Trư"\nLà to tròn thế.',
      writingSamples: ['on', 'ôn', 'ơn', 'con chồn', 'sơn ca'],
      speakingTopic: {
        title: 'Rừng xanh vui nhộn',
        prompt: 'Kể về các loài thú vui chơi hòa thuận trong rừng xanh.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "sơn" gồm âm đầu s và vần gì?',
        options: ['ơn', 'on', 'ôn', 'an'],
        correctIndex: 0,
        explanation: 's + ơn = sơn.'
      }
    ]
  },
  {
    id: 33,
    lessonNumber: 33,
    title: 'en ên in un',
    type: 'phonics',
    pageRange: '78 - 79',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['en', 'ên', 'in', 'un'],
      recognitionSentence: 'Cún con nhìn thấy dế mèn trên tàu lá.',
      recognitionKeywords: ['Cún con', 'nhìn', 'dế mèn']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'm', vowel: 'en', tone: 'huyền', result: 'mèn', spellingSteps: ['mờ', 'en', 'men', 'huyền', 'mèn'] }
      ],
      readingSyllables: ['khèn', 'sen', 'nến', 'nghển', 'chín', 'mịn', 'cún', 'vun'],
      words: [
        { word: 'ngọn nến', highlightPart: 'ên', meaning: 'ngọn nến thắp sáng lung linh', illustrationIcon: '🕯️', imageDesc: 'ngọn nến' },
        { word: 'đèn pin', highlightPart: 'in', meaning: 'đèn pin soi đường trong đêm', illustrationIcon: '🔦', imageDesc: 'đèn pin' },
        { word: 'cún con', highlightPart: 'un', meaning: 'chú cún con xinh xắn', illustrationIcon: '🐶', imageDesc: 'chú cún' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu đố và Luyện nói',
      readingPassage: 'Con gì tên rõ là "cha"?\nCó chứa chữ số nhìn qua ngỡ rùa?\nCon gì quen vẻ già nua\nBốn chân ngắn ngủn, thỏ thua chả ngờ?',
      writingSamples: ['en', 'ên', 'in', 'un', 'đèn pin', 'nến'],
      speakingTopic: {
        title: 'Xin lỗi',
        prompt: 'Nói lời xin lỗi bác bảo vệ khi đá bóng lỡ chạm vào cửa sổ.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Câu đố trên nói về con vật gì?',
        options: ['Con ba ba', 'Con rùa', 'Con cua', 'Con cá'],
        correctIndex: 0,
        explanation: 'Con ba ba ("ba" là cha, cũng là con số 3).'
      }
    ]
  },
  {
    id: 34,
    lessonNumber: 34,
    title: 'am ăm âm',
    type: 'phonics',
    pageRange: '80 - 81',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['am', 'ăm', 'âm'],
      recognitionSentence: 'Nhện ngắm nghía tấm lưới vừa làm xong.',
      recognitionKeywords: ['ngắm nghía', 'tấm lưới', 'làm']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'l', vowel: 'am', tone: 'huyền', result: 'làm', spellingSteps: ['lờ', 'am', 'lam', 'huyền', 'làm'] }
      ],
      readingSyllables: ['cam', 'khám', 'ẵm', 'cằm', 'đậm', 'nhẩm'],
      words: [
        { word: 'quả cam', highlightPart: 'am', meaning: 'quả cam mọng nước ngọt lành', illustrationIcon: '🍊', imageDesc: 'quả cam' },
        { word: 'tăm tre', highlightPart: 'ăm', meaning: 'hộp tăm tre', illustrationIcon: '🎋', imageDesc: 'tăm tre' },
        { word: 'củ sâm', highlightPart: 'âm', meaning: 'củ sâm bổ dưỡng', illustrationIcon: '🫚', imageDesc: 'củ sâm' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Mùa hè, ve râm ran, sen nở thắm. Lũ trẻ nô đùa trên thảm cỏ ven hồ.',
      writingSamples: ['am', 'ăm', 'âm', 'tăm tre', 'củ sâm'],
      speakingTopic: {
        title: 'Môi trường sống của loài vật',
        prompt: 'Kể tên các con vật sống trong rừng (hươu, nai, chim rừng bên dòng suối mát).'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "cam" chứa vần gì?',
        options: ['am', 'ăm', 'âm', 'an'],
        correctIndex: 0,
        explanation: 'c + am = cam.'
      }
    ]
  },
  {
    id: 35,
    lessonNumber: 35,
    title: 'Ôn tập và kể chuyện (Gà nâu và vịt xám)',
    type: 'review',
    pageRange: '82 - 83',
    part1_Letters: {
      title: 'Bé câu cá tìm tiếng',
      letters: ['an', 'ăn', 'ân', 'on', 'ôn', 'ơn', 'en', 'ên', 'in', 'un', 'am', 'ăm', 'âm'],
      recognitionSentence: 'Các chú cá mang trên mình những từ ngữ chứa vần đã học.',
      recognitionKeywords: ['củ sắn', 'tấm gỗ', 'bàn chân', 'khôn lớn', 'đèn pin', 'chăm chỉ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên mình cá',
      models: [
        { initial: 's', vowel: 'ăn', tone: 'sắc', result: 'sắn' },
        { initial: 'ch', vowel: 'ăm', result: 'chăm' }
      ],
      readingSyllables: ['củ sắn', 'tấm gỗ', 'bàn chân', 'mưa phùn', 'bến đò', 'đèn pin', 'ngọn cỏ', 'trạm y tế', 'chăm chỉ'],
      words: [
        { word: 'củ sắn', highlightPart: 'ăn', meaning: 'củ sắn luộc thơm ngon' },
        { word: 'chăm chỉ', highlightPart: 'ăm', meaning: 'học tập cần cù siêng năng' },
        { word: 'trạm y tế', highlightPart: 'ạm', meaning: 'nơi khám chữa bệnh cho mọi người' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn Thỏ và rùa & Kể chuyện: Gà nâu và vịt xám',
      readingPassage: 'Nhìn rùa, thỏ chê: "Quả là chậm như rùa." Rùa ôn tồn: "Ta thi nhé." Thỏ hớn hở tham gia. Thỏ nhởn nhơ múa ca, rùa cứ bò cần mẫn. Thế là, rùa đi xa hơn hẳn thỏ.',
      writingSamples: ['Sen nở thắm hồ.'],
      story: {
        title: 'Gà nâu và vịt xám',
        pictures: [
          { id: 1, question: 'Hằng ngày, gà nâu và vịt xám làm gì?', content: 'Gà nâu và vịt xám luôn bên nhau đi kiếm ăn vui vẻ.' },
          { id: 2, question: 'Chuyện gì xảy ra khiến gà nâu không thể sang sông?', content: 'Nước sông dâng cao, gà nâu không biết bơi nên đành đứng trên bờ nhìn theo.' },
          { id: 3, question: 'Vịt đã làm gì để giúp gà?', content: 'Vịt xám tốt bụng cõng bạn gà nâu trên lưng rồi bơi qua sông.' },
          { id: 4, question: 'Thương vịt vất vả, gà làm gì để giúp vịt?', content: 'Gà nâu bới đất tìm giun béo mọng chia cho vịt ăn no nê.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Trong câu chuyện "Thỏ và rùa", vì sao rùa lại chiến thắng?',
        options: ['Rùa kiên trì, cần mẫn bước đi không nghỉ', 'Thỏ bị ngã', 'Rùa biết chạy nhanh', 'Được bạn bè giúp đỡ'],
        correctIndex: 0,
        explanation: 'Rùa chăm chỉ, kiên trì không chủ quan nên đã về đích trước thỏ.'
      }
    ]
  },
  {
    id: 36,
    lessonNumber: 36,
    title: 'om ôm ơm',
    type: 'phonics',
    pageRange: '84 - 85',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['om', 'ôm', 'ơm'],
      recognitionSentence: 'Hương cốm thơm thôn xóm.',
      recognitionKeywords: ['cốm thơm', 'thôn xóm']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'x', vowel: 'om', tone: 'sắc', result: 'xóm', spellingSteps: ['xờ', 'om', 'xom', 'sắc', 'xóm'] }
      ],
      readingSyllables: ['khóm', 'vòm', 'nộm', 'tôm', 'bờm', 'rơm'],
      words: [
        { word: 'đom đóm', highlightPart: 'om', meaning: 'chú đom đóm phát sáng đêm hè', illustrationIcon: '🪲', imageDesc: 'đom đóm' },
        { word: 'chó đốm', highlightPart: 'ôm', meaning: 'chú chó đốm đáng yêu', illustrationIcon: '🐕', imageDesc: 'chó đốm' },
        { word: 'mâm cơm', highlightPart: 'ơm', meaning: 'mâm cơm gia đình ấm cúng', illustrationIcon: '🍲', imageDesc: 'mâm cơm' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Hôm qua, cô Mơ ở xóm Hạ đến thăm nhà Hà. Cô cho Hà giỏ cam. Hà chọn quả cam to phần bố. Mẹ khen và thơm lên má Hà.',
      writingSamples: ['om', 'ôm', 'ơm', 'chó đốm', 'mâm cơm'],
      speakingTopic: {
        title: 'Xin lỗi',
        prompt: 'Bé lỡ đá bóng làm vỡ lọ hoa trong phòng, liền lễ phép xin lỗi mẹ.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "cơm" gồm âm đầu c và vần gì?',
        options: ['ơm', 'om', 'ôm', 'am'],
        correctIndex: 0,
        explanation: 'c + ơm = cơm.'
      }
    ]
  },
  {
    id: 37,
    lessonNumber: 37,
    title: 'em êm im um',
    type: 'phonics',
    pageRange: '86 - 87',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['em', 'êm', 'im', 'um'],
      recognitionSentence: 'Chị em Hà chơi trốn tìm. Hà tủm tỉm đếm: một, hai, ba,...',
      recognitionKeywords: ['Chị em', 'trốn tìm', 'tủm tỉm đếm']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'đ', vowel: 'êm', tone: 'sắc', result: 'đếm', spellingSteps: ['đờ', 'êm', 'đêm', 'sắc', 'đếm'] }
      ],
      readingSyllables: ['hẻm', 'kem', 'mềm', 'nếm', 'mỉm', 'tím', 'chụm', 'mũm'],
      words: [
        { word: 'tem thư', highlightPart: 'em', meaning: 'con tem dán phong bì', illustrationIcon: '✉️', imageDesc: 'tem thư' },
        { word: 'thềm nhà', highlightPart: 'êm', meaning: 'thềm trước sân nhà', illustrationIcon: '🏡', imageDesc: 'thềm nhà' },
        { word: 'tủm tỉm', highlightPart: 'im', meaning: 'nụ cười mỉm duyên dáng', illustrationIcon: '😊', imageDesc: 'bé cười tủm tỉm' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Chim ri cần cù tìm cỏ khô về làm tổ. Đêm qua, nó bị ốm. Chim sẻ và chim sơn ca đến thăm, đem cho nó túm rơm. Chim ri cảm ơn sẻ và sơn ca.',
      writingSamples: ['em', 'êm', 'im', 'um', 'thềm nhà', 'tủm tỉm'],
      speakingTopic: {
        title: 'Giúp bạn',
        prompt: 'Kể về những hành động quan tâm giúp đỡ bạn bè trong lớp khi bạn gặp khó khăn.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng nào có chứa vần "êm"?',
        options: ['thềm', 'tem', 'tỉm', 'mũm'],
        correctIndex: 0,
        explanation: 'th + êm + huyền = thềm.'
      }
    ]
  },
  {
    id: 38,
    lessonNumber: 38,
    title: 'ai ay ây',
    type: 'phonics',
    pageRange: '88 - 89',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ai', 'ay', 'ây'],
      recognitionSentence: 'Hai bạn thi nhảy dây.',
      recognitionKeywords: ['Hai bạn', 'nhảy dây']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'h', vowel: 'ai', result: 'hai', spellingSteps: ['hờ', 'ai', 'hai'] }
      ],
      readingSyllables: ['bài', 'lái', 'nảy', 'tay', 'đậy', 'lẫy'],
      words: [
        { word: 'chùm vải', highlightPart: 'ai', meaning: 'chùm quả vải thiều đỏ ngọt', illustrationIcon: '🍒', imageDesc: 'chùm vải' },
        { word: 'máy cày', highlightPart: 'ay', meaning: 'chiếc máy cày trên cánh đồng', illustrationIcon: '🚜', imageDesc: 'máy cày' },
        { word: 'đám mây', highlightPart: 'ây', meaning: 'đám mây trắng bồng bềnh', illustrationIcon: '☁️', imageDesc: 'đám mây' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Nai con nhìn thấy con gì bé nhỏ, thân đầy gai nhọn trên bãi cỏ. Nó chạy về nhà, hổn hển kể cho mẹ nghe. Nai mẹ tủm tỉm: "Bạn nhím đấy, con ạ".',
      writingSamples: ['ai', 'ay', 'ây', 'chùm vải', 'đám mây'],
      speakingTopic: {
        title: 'Xin lỗi',
        prompt: 'Bé mải chạy thả diều va vào cô đi bộ, liền lễ phép cúi đầu xin lỗi.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "mây" chứa vần nào dưới đây?',
        options: ['ây', 'ay', 'ai', 'oi'],
        correctIndex: 0,
        explanation: 'm + ây = mây.'
      }
    ]
  },
  {
    id: 39,
    lessonNumber: 39,
    title: 'oi ôi ơi',
    type: 'phonics',
    pageRange: '90 - 91',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['oi', 'ôi', 'ơi'],
      recognitionSentence: 'Voi con mời bạn đi xem hội.',
      recognitionKeywords: ['Voi con', 'mời bạn', 'hội']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'v', vowel: 'oi', result: 'voi', spellingSteps: ['vờ', 'oi', 'voi'] }
      ],
      readingSyllables: ['chòi', 'hỏi', 'mỗi', 'xôi', 'đợi', 'mới'],
      words: [
        { word: 'chim bói cá', highlightPart: 'oi', meaning: 'chú chim bắt cá bên sông', illustrationIcon: '🐦', imageDesc: 'chim bói cá' },
        { word: 'thổi còi', highlightPart: 'ôi', meaning: 'thổi chiếc còi hiệu', illustrationIcon: '📯', imageDesc: 'thổi còi' },
        { word: 'đồ chơi', highlightPart: 'ơi', meaning: 'đồ chơi trẻ em', illustrationIcon: '🧸', imageDesc: 'đồ chơi' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Hà hỏi mẹ:\n– Mẹ ơi, mạ lớn lên gọi là lúa. Bê lớn lên gọi là bò. Còn con lớn lên thì gọi là gì ạ?\nMẹ ôm Hà rồi nói:\n– Lớn lên, con vẫn là con gái nhỏ của mẹ.',
      writingSamples: ['oi', 'ôi', 'ơi', 'thổi còi', 'đồ chơi'],
      speakingTopic: {
        title: 'Xe của mẹ và xe của bé',
        prompt: 'Nói về chiếc xe máy màu đỏ của mẹ và chiếc xe đạp màu hồng xinh xắn của bé.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "chơi" chứa vần gì?',
        options: ['ơi', 'ôi', 'oi', 'ai'],
        correctIndex: 0,
        explanation: 'ch + ơi = chơi.'
      }
    ]
  },
  {
    id: 40,
    lessonNumber: 40,
    title: 'Ôn tập và kể chuyện (Hai người bạn và con gấu)',
    type: 'review',
    pageRange: '92 - 93',
    part1_Letters: {
      title: 'Hoa hướng dương vần',
      letters: ['om', 'ôm', 'ơm', 'em', 'êm', 'im', 'um', 'ai', 'ay', 'ây', 'oi', 'ôi', 'ơi'],
      recognitionSentence: 'Những bông hoa hướng dương rực rỡ chứa các từ ngữ ôn tập.',
      recognitionKeywords: ['chói lọi', 'cày cấy', 'chúm chím', 'sớm tối', 'ngõ hẻm', 'bơi lội', 'lom khom', 'êm đềm', 'bãi bồi']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên hoa',
      models: [
        { initial: 'ch', vowel: 'oi', tone: 'sắc', result: 'chói' },
        { initial: 'b', vowel: 'ơi', result: 'bơi' }
      ],
      readingSyllables: ['chói lọi', 'cày cấy', 'chúm chím', 'sớm tối', 'gió nồm', 'bơi lội', 'lom khom', 'êm đềm', 'bãi bồi'],
      words: [
        { word: 'chói lọi', highlightPart: 'oi', meaning: 'ánh sáng rực rỡ' },
        { word: 'chúm chím', highlightPart: 'im', meaning: 'nụ hoa hé nở xinh' },
        { word: 'êm đềm', highlightPart: 'êm', meaning: 'cuộc sống yên ả thanh bình' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Hai người bạn và con gấu',
      readingPassage: 'Nhím con ra bãi cỏ tìm cái ăn. Nó phấn chấn khi thấy vô số quả chín thơm ngon. Nhím vội chạy về gọi bạn chồn. Cả hai quay lại, ăn đến no nê.',
      writingSamples: ['Voi con có vòi dài.'],
      story: {
        title: 'Hai người bạn và con gấu',
        pictures: [
          { id: 1, question: 'Hai người bạn đi đâu?', content: 'Hai người bạn cùng nhau vào rừng dạo chơi.' },
          { id: 2, question: 'Họ làm gì khi nhìn thấy con gấu?', content: 'Một người nhanh chân leo tót lên cây trốn. Người kia không kịp leo liền nằm giả vờ chết.' },
          { id: 3, question: 'Vì sao con gấu bỏ đi?', content: 'Gấu ngửi ngửi mặt người nằm dưới đất, tưởng đã chết nên lẳng lặng bỏ đi.' },
          { id: 4, question: 'Họ đã nói gì với nhau?', content: 'Người trên cây tụt xuống hỏi gấu nói gì. Bạn đáp: "Gấu khuyên không nên kết bạn với kẻ bỏ mặc bạn lúc hiểm nguy".' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Bài học từ câu chuyện "Hai người bạn và con gấu" là gì?',
        options: ['Bạn tốt là người không bỏ mặc bạn bè khi gặp khó khăn, hoạn nạn', 'Nên biết leo cây giỏi', 'Nên sợ gấu', 'Không nên vào rừng'],
        correctIndex: 0,
        explanation: 'Người bạn thật sự luôn kề vai sát cánh và giúp đỡ bạn khi gặp gian nguy.'
      }
    ]
  },
  {
    id: 41,
    lessonNumber: 41,
    title: 'ui ưi',
    type: 'phonics',
    pageRange: '94 - 95',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ui', 'ưi'],
      recognitionSentence: 'Bà gửi cho Hà túi kẹo.',
      recognitionKeywords: ['gửi', 'túi kẹo']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 't', vowel: 'ui', tone: 'sắc', result: 'túi', spellingSteps: ['tờ', 'ui', 'tui', 'sắc', 'túi'] }
      ],
      readingSyllables: ['bùi', 'mũi', 'sủi', 'cửi', 'gửi', 'ngửi'],
      words: [
        { word: 'dãy núi', highlightPart: 'ui', meaning: 'dãy núi cao trập trùng', illustrationIcon: '⛰️', imageDesc: 'dãy núi' },
        { word: 'bụi cỏ', highlightPart: 'ui', meaning: 'bụi cỏ xanh tốt', illustrationIcon: '🌾', imageDesc: 'bụi cỏ' },
        { word: 'gửi thư', highlightPart: 'ưi', meaning: 'gửi lá thư qua bưu điện', illustrationIcon: '📮', imageDesc: 'gửi thư' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Lan gửi thư cho Hà kể về quê Lan. Ở đó, có nhà sàn nằm ven đồi. Mùa này, chim ca rộn rã, sim nở rộ tím cả núi đồi. Lan mời Hà lên thăm quê Lan.',
      writingSamples: ['ui', 'ưi', 'dãy núi', 'gửi thư'],
      speakingTopic: {
        title: 'Xin phép',
        prompt: 'Nói lời xin phép mẹ khi muốn sang nhà bạn cùng lớp chơi.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "gửi" chứa vần gì?',
        options: ['ưi', 'ui', 'ơi', 'ơi'],
        correctIndex: 0,
        explanation: 'g + ưi + hỏi = gửi.'
      }
    ]
  },
  {
    id: 42,
    lessonNumber: 42,
    title: 'ao eo',
    type: 'phonics',
    pageRange: '96 - 97',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ao', 'eo'],
      recognitionSentence: 'Ao thu lạnh lẽo nước trong veo.',
      recognitionKeywords: ['Ao thu', 'lạnh lẽo', 'trong veo']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'l', vowel: 'eo', tone: 'ngã', result: 'lẽo', spellingSteps: ['lờ', 'eo', 'leo', 'ngã', 'lẽo'] }
      ],
      readingSyllables: ['chào', 'dao', 'sáo', 'dẻo', 'đẽo', 'kẹo'],
      words: [
        { word: 'ngôi sao', highlightPart: 'ao', meaning: 'ngôi sao lấp lánh', illustrationIcon: '⭐', imageDesc: 'ngôi sao vàng' },
        { word: 'quả táo', highlightPart: 'ao', meaning: 'quả táo đỏ ngọt', illustrationIcon: '🍎', imageDesc: 'quả táo' },
        { word: 'cái kẹo', highlightPart: 'eo', meaning: 'chiếc kẹo thơm ngon', illustrationIcon: '🍬', imageDesc: 'cái kẹo' },
        { word: 'ao bèo', highlightPart: 'eo', meaning: 'mặt ao phủ kín hoa bèo', illustrationIcon: '🪷', imageDesc: 'ao bèo' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Trên cây cao, đàn chào mào bay đi, bay lại. Mấy chú sáo đen vui ca véo von. Còn chim ri vẫn chăm chỉ. Chú tha rơm khô về khéo léo làm tổ.',
      writingSamples: ['ao', 'eo', 'ngôi sao', 'ao bèo'],
      speakingTopic: {
        title: 'Em chăm chỉ',
        prompt: 'Kể về góc học tập ngăn nắp và việc tự giác làm bài tập mỗi tối của em.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "sao" gồm âm đầu s và vần gì?',
        options: ['ao', 'eo', 'au', 'âu'],
        correctIndex: 0,
        explanation: 's + ao = sao.'
      }
    ]
  },
  {
    id: 43,
    lessonNumber: 43,
    title: 'au âu êu',
    type: 'phonics',
    pageRange: '98 - 99',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['au', 'âu', 'êu'],
      recognitionSentence: 'Đàn sẻ nâu kêu ríu rít ở sau nhà.',
      recognitionKeywords: ['sẻ nâu', 'kêu', 'sau nhà']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 's', vowel: 'au', result: 'sau', spellingSteps: ['sờ', 'au', 'sau'] }
      ],
      readingSyllables: ['cau', 'tàu', 'bậu', 'gấu', 'khều', 'rêu'],
      words: [
        { word: 'rau củ', highlightPart: 'au', meaning: 'rau củ quả tươi sạch', illustrationIcon: '🥕', imageDesc: 'rau củ' },
        { word: 'con trâu', highlightPart: 'âu', meaning: 'con trâu kéo cày khỏe mạnh', illustrationIcon: '🐃', imageDesc: 'con trâu' },
        { word: 'chú tễu', highlightPart: 'êu', meaning: 'chú tễu múa rối nước tươi cười', illustrationIcon: '🎭', imageDesc: 'chú tễu' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Nhà dì Tư ở quê có cây cau, giàn trầu. Sau nhà có rau cải, rau dền và cả dưa hấu. Gần nhà dì có cây cầu tre nhỏ. Xa xa là dãy núi cao.',
      writingSamples: ['au', 'âu', 'êu', 'con trâu', 'chú tễu'],
      speakingTopic: {
        title: 'Xin phép',
        prompt: 'Bé xin phép cô giáo vào lớp khi đi học muộn.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "trâu" chứa vần gì?',
        options: ['âu', 'au', 'êu', 'iu'],
        correctIndex: 0,
        explanation: 'tr + âu = trâu.'
      }
    ]
  },
  {
    id: 44,
    lessonNumber: 44,
    title: 'iu ưu',
    type: 'phonics',
    pageRange: '100 - 101',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['iu', 'ưu'],
      recognitionSentence: 'Bà đã nghỉ hưu mà luôn bận bịu.',
      recognitionKeywords: ['nghỉ hưu', 'bận bịu']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'h', vowel: 'ưu', result: 'hưu', spellingSteps: ['hờ', 'ưu', 'hưu'] }
      ],
      readingSyllables: ['dịu', 'địu', 'xíu', 'hưu', 'mưu', 'lựu'],
      words: [
        { word: 'cái rìu', highlightPart: 'iu', meaning: 'chiếc rìu bổ củi', illustrationIcon: '🪓', imageDesc: 'cái rìu' },
        { word: 'cái địu', highlightPart: 'iu', meaning: 'chiếc địu mẹ địu bé trên lưng', illustrationIcon: '🎒', imageDesc: 'cái địu' },
        { word: 'quả lựu', highlightPart: 'ưu', meaning: 'quả lựu hạt đỏ như ngọc', illustrationIcon: '🍎', imageDesc: 'quả lựu' },
        { word: 'con cừu', highlightPart: 'ưu', meaning: 'chú cừu lông trắng muốt', illustrationIcon: '🐑', imageDesc: 'con cừu' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Bà đã nghỉ hưu. Ngày ngày, bà đi chợ, nấu ăn và chăm lo cho con cháu. Mỗi lần đưa bé đi dạo, bà hay kể về ngày xưa. Lời bà dịu êm.',
      writingSamples: ['iu', 'ưu', 'cái rìu', 'quả lựu'],
      speakingTopic: {
        title: 'Bà em',
        prompt: 'Kể về tình yêu thương và sự chăm sóc ân cần của bà dành cho em.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "cừu" chứa vần nào?',
        options: ['ưu', 'iu', 'êu', 'au'],
        correctIndex: 0,
        explanation: 'c + ưu + huyền = cừu.'
      }
    ]
  },
  {
    id: 45,
    lessonNumber: 45,
    title: 'Ôn tập và kể chuyện (Sự tích hoa cúc trắng)',
    type: 'review',
    pageRange: '102 - 103',
    part1_Letters: {
      title: 'Hộp quà vần âm',
      letters: ['ui', 'ưi', 'ao', 'eo', 'au', 'âu', 'êu', 'iu', 'ưu'],
      recognitionSentence: 'Mở các hộp quà để đọc to những từ ngữ chứa vần đã học.',
      recognitionKeywords: ['khâu vá', 'gửi quà', 'ngôi sao', 'kéo co', 'kêu gọi', 'chịu khó', 'cây cau', 'mưu trí', 'vui vẻ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên hộp quà',
      models: [
        { initial: 's', vowel: 'ao', result: 'sao' },
        { initial: 'm', vowel: 'ưu', result: 'mưu' }
      ],
      readingSyllables: ['củi', 'chào', 'đẽo', 'rau', 'câu', 'rêu', 'dịu', 'sưu'],
      words: [
        { word: 'khâu vá', highlightPart: 'âu', meaning: 'kim chỉ khâu vá áo' },
        { word: 'ngôi sao', highlightPart: 'ao', meaning: 'sao sáng trời đêm' },
        { word: 'kéo co', highlightPart: 'eo', meaning: 'trò chơi kéo co đồng đội' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Sự tích hoa cúc trắng',
      readingPassage: 'Nghỉ hè, nhà Hà đi Tam Đảo. Khi tán cây, ngọn cỏ còn thiu thiu ngủ, Hà đã dậy ngắm mây mù. Đến trưa, trời như vào thu. Mùa hè ở Tam Đảo quả là dễ chịu.',
      writingSamples: ['Tàu neo đậu ven bờ.'],
      story: {
        title: 'Sự tích hoa cúc trắng',
        pictures: [
          { id: 1, question: 'Vì sao người mẹ lâm bệnh?', content: 'Người mẹ làm việc vất vả nuôi con nên bị ốm nặng.' },
          { id: 2, question: 'Cụ già nói với cô bé điều gì?', content: 'Cụ già chỉ cô bé đi tìm bông hoa trắng, bông hoa có bao nhiêu cánh thì mẹ sống thêm bấy nhiêu năm.' },
          { id: 3, question: 'Thấy bông hoa chỉ có bốn cánh, cô bé đã làm gì?', content: 'Cô bé nhẹ nhàng xé từng cánh hoa thành nhiều sợi nhỏ li ti, biến thành vô số cánh hoa.' },
          { id: 4, question: 'Nhờ đâu người mẹ khỏi bệnh?', content: 'Nhờ lòng hiếu thảo vô bờ bến của cô bé, người mẹ đã hoàn toàn khỏe mạnh.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Cô bé xé nhỏ cánh hoa cúc để làm gì?',
        options: ['Để mẹ được sống thật nhiều năm bên con', 'Để hoa nở đẹp hơn', 'Để cắm vào bình', 'Để tặng cụ già'],
        correctIndex: 0,
        explanation: 'Cô bé mong mẹ sống thật lâu nên đã xé từng cánh thành vô số cánh nhỏ.'
      }
    ]
  },
  {
    id: 46,
    lessonNumber: 46,
    title: 'ac ăc âc',
    type: 'phonics',
    pageRange: '104 - 105',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ac', 'ăc', 'âc'],
      recognitionSentence: 'Tây Bắc có ruộng bậc thang, có thác nước.',
      recognitionKeywords: ['bậc thang', 'thác nước']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'th', vowel: 'ac', tone: 'sắc', result: 'thác', spellingSteps: ['thờ', 'ac', 'thac', 'sắc', 'thác'] }
      ],
      readingSyllables: ['lạc', 'nhạc', 'mặc', 'nhắc', 'gấc', 'giấc'],
      words: [
        { word: 'bác sĩ', highlightPart: 'ac', meaning: 'bác sĩ chữa bệnh', illustrationIcon: '👨‍⚕️', imageDesc: 'bác sĩ' },
        { word: 'mắc áo', highlightPart: 'ăc', meaning: 'mắc treo quần áo', illustrationIcon: '🪝', imageDesc: 'mắc áo' },
        { word: 'quả gấc', highlightPart: 'âc', meaning: 'quả gấc đỏ thổi xôi thơm', illustrationIcon: '🍈', imageDesc: 'quả gấc' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Nếu lên Tây Bắc, bạn hãy đến Sa Pa. Vào mùa hè, mỗi ngày ở đây như có bốn mùa. Sa Pa có Thác Bạc, có Cầu Mây, có các bản Tả Van, Tả Phìn, Sín Chải.',
      writingSamples: ['ac', 'ăc', 'âc', 'mắc áo', 'quả gấc'],
      speakingTopic: {
        title: 'Xin phép',
        prompt: 'Nói lời xin phép bố mẹ khi muốn xem chương trình thiếu nhi trên ti vi.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "gấc" chứa vần gì?',
        options: ['âc', 'ac', 'ăc', 'uc'],
        correctIndex: 0,
        explanation: 'g + âc + sắc = gấc.'
      }
    ]
  },
  {
    id: 47,
    lessonNumber: 47,
    title: 'oc ôc uc ưc',
    type: 'phonics',
    pageRange: '106 - 107',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['oc', 'ôc', 'uc', 'ưc'],
      recognitionSentence: 'Ở góc vườn, cạnh gốc cau, khóm cúc nở hoa vàng rực.',
      recognitionKeywords: ['góc vườn', 'gốc cau', 'khóm cúc', 'vàng rực']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'g', vowel: 'oc', tone: 'sắc', result: 'góc', spellingSteps: ['gờ', 'oc', 'goc', 'sắc', 'góc'] }
      ],
      readingSyllables: ['học', 'sóc', 'cốc', 'lộc', 'chục', 'cúc', 'đúc', 'mực'],
      words: [
        { word: 'con sóc', highlightPart: 'oc', meaning: 'chú sóc chuyền cành nhanh nhẹn', illustrationIcon: '🐿️', imageDesc: 'con sóc' },
        { word: 'cái cốc', highlightPart: 'ôc', meaning: 'chiếc cốc uống nước', illustrationIcon: '🥛', imageDesc: 'cái cốc' },
        { word: 'máy xúc', highlightPart: 'uc', meaning: 'xe máy xúc đào đất', illustrationIcon: '🚜', imageDesc: 'máy xúc' },
        { word: 'con mực', highlightPart: 'ưc', meaning: 'con mực bơi dưới biển', illustrationIcon: '🦑', imageDesc: 'con mực' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Đi học về, Hà thấy mấy khóm cúc đã nở rực rỡ. Hà hái cúc, cắm vào cốc rồi để ngay ngắn trên bàn học. Mẹ tấm tắc khen Hà khéo tay.',
      writingSamples: ['oc', 'ôc', 'uc', 'ưc', 'cốc', 'máy xúc', 'mực'],
      speakingTopic: {
        title: 'Say mê',
        prompt: 'Các bạn nhỏ say mê tập múa ba-lê trong lớp năng khiếu.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "mực" có chứa vần gì?',
        options: ['ưc', 'uc', 'ôc', 'oc'],
        correctIndex: 0,
        explanation: 'm + ưc + nặng = mực.'
      }
    ]
  },
  {
    id: 48,
    lessonNumber: 48,
    title: 'at ăt ât',
    type: 'phonics',
    pageRange: '108 - 109',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['at', 'ăt', 'ât'],
      recognitionSentence: 'Nam bắt nhịp cho tất cả các bạn hát.',
      recognitionKeywords: ['bắt nhịp', 'tất cả', 'hát']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'h', vowel: 'at', tone: 'sắc', result: 'hát', spellingSteps: ['hờ', 'at', 'hat', 'sắc', 'hát'] }
      ],
      readingSyllables: ['bát', 'lạt', 'sắt', 'gặt', 'đất', 'gật'],
      words: [
        { word: 'bãi cát', highlightPart: 'at', meaning: 'bờ cát trắng mịn màng bên bờ biển', illustrationIcon: '🏖️', imageDesc: 'bãi cát' },
        { word: 'mặt trời', highlightPart: 'ăt', meaning: 'ông mặt trời tỏa ánh nắng mai', illustrationIcon: '☀️', imageDesc: 'mặt trời' },
        { word: 'bật lửa', highlightPart: 'ât', meaning: 'chiếc bật lửa nhóm bếp', illustrationIcon: '🔥', imageDesc: 'bật lửa' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Hè đến, nhà Nam đi nghỉ mát ở Cát Bà. Mẹ và Nam bỏ áo bơi, bàn chải, khăn mặt vào ba lô. Nam rất vui khi đi chơi xa với cả nhà.',
      writingSamples: ['at', 'ăt', 'ât', 'mặt trời', 'bật lửa'],
      speakingTopic: {
        title: 'Xin phép',
        prompt: 'Bé khoanh tay xin phép ông bà bố mẹ trước khi đi chơi cùng các bạn.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "mặt" chứa vần gì?',
        options: ['ăt', 'at', 'ât', 'ot'],
        correctIndex: 0,
        explanation: 'm + ăt + nặng = mặt.'
      }
    ]
  },
  {
    id: 49,
    lessonNumber: 49,
    title: 'ot ôt ơt',
    type: 'phonics',
    pageRange: '110 - 111',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ot', 'ôt', 'ơt'],
      recognitionSentence: 'Vườn nhà bà có ớt, rau ngót và cà rốt.',
      recognitionKeywords: ['ớt', 'rau ngót', 'cà rốt']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'ng', vowel: 'ot', tone: 'sắc', result: 'ngót', spellingSteps: ['ngờ', 'ot', 'ngot', 'sắc', 'ngót'] }
      ],
      readingSyllables: ['ngọt', 'vót', 'cột', 'tốt', 'thớt', 'vợt'],
      words: [
        { word: 'quả nhót', highlightPart: 'ot', meaning: 'quả nhót đỏ chua ngọt', illustrationIcon: '🍒', imageDesc: 'quả nhót' },
        { word: 'lá lốt', highlightPart: 'ôt', meaning: 'lá lốt thơm xào thịt bò', illustrationIcon: '🍃', imageDesc: 'lá lốt' },
        { word: 'quả ớt', highlightPart: 'ơt', meaning: 'quả ớt cay nồng', illustrationIcon: '🌶️', imageDesc: 'quả ớt' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Sớm nay thức dậy, Nam chợt thấy một chú chim sâu. Chim hớn hở như chào Nam. Nó nhảy nhót một hồi rồi bay qua bay lại, tìm bắt sâu bọ cho cây.',
      writingSamples: ['ot', 'ôt', 'ơt', 'lá lốt', 'quả ớt'],
      speakingTopic: {
        title: 'Thế giới của em',
        prompt: 'Kể về những trò chơi trốn tìm, xem hoạt hình vui nhộn hàng ngày.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "ớt" chứa vần nào?',
        options: ['ơt', 'ot', 'ôt', 'at'],
        correctIndex: 0,
        explanation: 'ơt + sắc = ớt.'
      }
    ]
  },
  {
    id: 50,
    lessonNumber: 50,
    title: 'Ôn tập và kể chuyện (Bài học đầu tiên của thỏ con)',
    type: 'review',
    pageRange: '112 - 113',
    part1_Letters: {
      title: 'Ngôi sao chữ',
      letters: ['ac', 'ăc', 'âc', 'oc', 'ôc', 'uc', 'ưc', 'at', 'ăt', 'ât', 'ot', 'ôt', 'ơt'],
      recognitionSentence: 'Các ngôi sao lấp lánh mang những từ ngữ kết thúc bằng c và t.',
      recognitionKeywords: ['bật lửa', 'lọ mực', 'cột mốc', 'hạt thóc', 'xúc xắc', 'gót chân', 'đôi mắt', 'lác đác', 'giấc mơ', 'quả ớt']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên ngôi sao',
      models: [
        { initial: 'b', vowel: 'ât', tone: 'nặng', result: 'bật' },
        { initial: 'x', vowel: 'uc', tone: 'sắc', result: 'xúc' }
      ],
      readingSyllables: ['bật lửa', 'lọ mực', 'cột mốc', 'hạt thóc', 'xúc xắc', 'gót chân', 'đôi mắt', 'lác đác', 'giấc mơ', 'quả ớt'],
      words: [
        { word: 'hạt thóc', highlightPart: 'oc', meaning: 'hạt thóc vàng của mẹ' },
        { word: 'xúc xắc', highlightPart: 'ăc', meaning: 'viên xúc xắc trò chơi' },
        { word: 'đôi mắt', highlightPart: 'ăt', meaning: 'đôi mắt sáng ngời' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Bài học đầu tiên của thỏ con',
      readingPassage: 'Gà mẹ dẫn đàn con đi ăn. Chốc chốc, tìm thấy mồi, gà mẹ "tục... tục..." gọi con. Đàn gà con chạy lại, chen chúc nhau ăn rồi rúc vào bên mẹ. Gà mẹ ủ ấm cho các con.',
      writingSamples: ['Hạt thóc nảy mầm.'],
      story: {
        title: 'Bài học đầu tiên của thỏ con',
        pictures: [
          { id: 1, question: 'Trước khi thỏ con đi chơi, thỏ mẹ dặn dò điều gì?', content: 'Thỏ mẹ dặn: "Đi đường gặp ai giúp đỡ phải cảm ơn, làm phiền ai phải xin lỗi".' },
          { id: 2, question: 'Va vào anh sóc, thỏ con nói gì?', content: 'Thỏ con vội nói: "Em cảm ơn anh" khiến sóc ngạc nhiên.' },
          { id: 3, question: 'Được bác voi cứu, thỏ con nói gì?', content: 'Thỏ con lại nói: "Cháu xin lỗi bác ạ".' },
          { id: 4, question: 'Thỏ con hiểu ra điều gì?', content: 'Thỏ con hiểu ra khi làm sai phải xin lỗi, khi được giúp phải nói lời cảm ơn.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Khi được người khác giúp đỡ, em cần nói câu gì?',
        options: ['Cảm ơn', 'Xin lỗi', 'Tạm biệt', 'Không cần'],
        correctIndex: 0,
        explanation: 'Khi nhận được sự giúp đỡ, chúng ta luôn nói lời "Cảm ơn".'
      }
    ]
  },
  {
    id: 51,
    lessonNumber: 51,
    title: 'et êt it',
    type: 'phonics',
    pageRange: '114 - 115',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['et', 'êt', 'it'],
      recognitionSentence: 'Đôi vẹt ríu rít mãi không hết chuyện.',
      recognitionKeywords: ['vẹt', 'ríu rít', 'hết chuyện']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'v', vowel: 'et', tone: 'nặng', result: 'vẹt', spellingSteps: ['vờ', 'et', 'vet', 'nặng', 'vẹt'] }
      ],
      readingSyllables: ['két', 'sét', 'vẹt', 'dệt', 'nết', 'tết', 'lít', 'mít', 'vịt'],
      words: [
        { word: 'con vẹt', highlightPart: 'et', meaning: 'chú vẹt biết nói', illustrationIcon: '🦜', imageDesc: 'con vẹt' },
        { word: 'bồ kết', highlightPart: 'êt', meaning: 'quả bồ kết gội đầu thơm mượt', illustrationIcon: '🌿', imageDesc: 'bồ kết' },
        { word: 'quả mít', highlightPart: 'it', meaning: 'quả mít chín thơm ngát', illustrationIcon: '🍈', imageDesc: 'quả mít' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Tết đến thật gần. Cái rét vẫn đậm. Mấy cây đào đã chi chít lộc non. Vài nụ tròn đỏ thắm vừa hé nở. Rồi trời ấm dần, đàn én nhỏ lại ríu rít bay về, náo nức đón chào năm mới.',
      writingSamples: ['et', 'êt', 'it', 'bồ kết', 'quả mít'],
      speakingTopic: {
        title: 'Thời tiết',
        prompt: 'Nói về trang phục khi trời nắng nóng mùa hè và khi gió rét mùa đông.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "mít" chứa vần gì?',
        options: ['it', 'et', 'êt', 'at'],
        correctIndex: 0,
        explanation: 'm + it + sắc = mít.'
      }
    ]
  },
  {
    id: 52,
    lessonNumber: 52,
    title: 'ut ưt',
    type: 'phonics',
    pageRange: '116 - 117',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ut', 'ưt'],
      recognitionSentence: 'Cầu thủ số 7 thu hút khán giả bằng một cú sút dứt điểm.',
      recognitionKeywords: ['thu hút', 'cú sút', 'dứt điểm']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 's', vowel: 'ut', tone: 'sắc', result: 'sút', spellingSteps: ['sờ', 'ut', 'sut', 'sắc', 'sút'] }
      ],
      readingSyllables: ['bụt', 'hụt', 'lụt', 'sụt', 'dứt', 'mứt', 'nứt', 'sứt'],
      words: [
        { word: 'bút chì', highlightPart: 'ut', meaning: 'chiếc bút chì tập viết', illustrationIcon: '✏️', imageDesc: 'bút chì' },
        { word: 'mứt dừa', highlightPart: 'ưt', meaning: 'mứt dừa ngọt béo ngày Tết', illustrationIcon: '🥥', imageDesc: 'mứt dừa' },
        { word: 'nứt nẻ', highlightPart: 'ưt', meaning: 'đất đai nứt nẻ vì khô hạn', illustrationIcon: '🏜️', imageDesc: 'đất nứt nẻ' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Trận đấu thật gay cấn. Lúc đầu, đội bạn chơi rất hay, đội nhà bị dẫn một bàn. Bất ngờ, cầu thủ số 7 sút xa, tỉ số là một đều. Phút chót, số 7 lại bứt phá ghi bàn. Khán giả hò reo, nhảy múa.',
      writingSamples: ['ut', 'ưt', 'bút chì', 'mứt dừa'],
      speakingTopic: {
        title: 'Đá bóng',
        prompt: 'Nói về sự hào hứng, đoàn kết và nỗ lực của các bạn nhỏ trong trận bóng đá.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "bút" chứa vần nào?',
        options: ['ut', 'ưt', 'it', 'at'],
        correctIndex: 0,
        explanation: 'b + ut + sắc = bút.'
      }
    ]
  },
  {
    id: 53,
    lessonNumber: 53,
    title: 'ap ăp âp',
    type: 'phonics',
    pageRange: '118 - 119',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ap', 'ăp', 'âp'],
      recognitionSentence: 'Mẹ đạp xe đưa Hà đến lớp. Khắp phố tấp nập.',
      recognitionKeywords: ['đạp xe', 'Khắp phố', 'tấp nập']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'đ', vowel: 'ap', tone: 'nặng', result: 'đạp', spellingSteps: ['đờ', 'ap', 'đap', 'nặng', 'đạp'] }
      ],
      readingSyllables: ['rạp', 'sạp', 'tháp', 'bắp', 'cặp', 'gặp', 'đập', 'mập', 'nấp'],
      words: [
        { word: 'xe đạp', highlightPart: 'ap', meaning: 'chiếc xe đạp nhỏ xinh', illustrationIcon: '🚲', imageDesc: 'xe đạp' },
        { word: 'cặp da', highlightPart: 'ăp', meaning: 'chiếc cặp da đựng sách vở', illustrationIcon: '💼', imageDesc: 'cặp da' },
        { word: 'cá mập', highlightPart: 'âp', meaning: 'con cá mập biển sâu', illustrationIcon: '🦈', imageDesc: 'cá mập' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc câu đố và Luyện nói',
      readingPassage: 'Khi ngủ, tôi nằm im lìm, mặt đen sẫm. Thức dậy, tôi có thể đưa bạn chu du khắp nơi, khám phá thế giới hấp dẫn, đầy ắp sắc màu. Bạn có thể xem phim, nghe nhạc để có phút giây thư giãn, ấm áp. Tôi là ai?',
      writingSamples: ['ap', 'ăp', 'âp', 'cặp da', 'cá mập'],
      speakingTopic: {
        title: 'Đồ vật quen thuộc',
        prompt: 'Kể tên cặp sách, chiếc mũ, ô che mưa, mũ bảo hiểm.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Câu đố trong bài đọc nói về đồ vật gì?',
        options: ['Chiếc ti vi', 'Chiếc quạt', 'Chiếc tủ lạnh', 'Chiếc bàn học'],
        correctIndex: 0,
        explanation: 'Chiếc ti vi khi tắt thì màn hình đen sẫm, khi bật lên chiếu phim ảnh đầy sắc màu.'
      }
    ]
  },
  {
    id: 54,
    lessonNumber: 54,
    title: 'op ôp ơp',
    type: 'phonics',
    pageRange: '120 - 121',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['op', 'ôp', 'ơp'],
      recognitionSentence: 'Mưa rào lộp độp, ếch nhái tụ họp thi hát, cá cờ há miệng đớp mưa.',
      recognitionKeywords: ['lộp độp', 'tụ họp', 'đớp mưa']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'h', vowel: 'op', tone: 'nặng', result: 'họp', spellingSteps: ['hờ', 'op', 'hop', 'nặng', 'họp'] }
      ],
      readingSyllables: ['cọp', 'góp', 'họp', 'hộp', 'tốp', 'xốp', 'hợp', 'lớp', 'lợp'],
      words: [
        { word: 'con cọp', highlightPart: 'op', meaning: 'con hổ cọp trong rừng', illustrationIcon: '🐅', imageDesc: 'con cọp' },
        { word: 'lốp xe', highlightPart: 'ôp', meaning: 'chiếc lốp xe cao su', illustrationIcon: '🛞', imageDesc: 'lốp xe' },
        { word: 'tia chớp', highlightPart: 'ơp', meaning: 'tia chớp sáng loé trên bầu trời giông', illustrationIcon: '⚡', imageDesc: 'tia chớp' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Mưa rào lộp độp. Họ nhà nhái tụ họp thi hát đón cơn mưa đầu mùa. Mặt ao ran ran bài ca ì ọp, ì ọp. Đàn cá cờ lóp ngóp bơi đến, lâu lâu lại ngoi lên đớp mưa.',
      writingSamples: ['op', 'ôp', 'ơp', 'lốp xe', 'tia chớp'],
      speakingTopic: {
        title: 'Ao hồ',
        prompt: 'Nói về cảnh ao hồ làng quê trong mát với hoa sen, đàn cá bơi lội.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "chớp" chứa vần gì?',
        options: ['ơp', 'ôp', 'op', 'ap'],
        correctIndex: 0,
        explanation: 'ch + ơp + sắc = chớp.'
      }
    ]
  },
  {
    id: 55,
    lessonNumber: 55,
    title: 'Ôn tập và kể chuyện (Mật ong của gấu con)',
    type: 'review',
    pageRange: '122 - 123',
    part1_Letters: {
      title: 'Lá sen mang tiếng',
      letters: ['et', 'êt', 'it', 'ut', 'ưt', 'ap', 'ăp', 'âp', 'op', 'ôp', 'ơp'],
      recognitionSentence: 'Các chú ếch ngồi trên lá sen chứa những từ ngữ ôn tập vần kết thúc bằng t và p.',
      recognitionKeywords: ['nét chữ', 'nết na', 'gặp gỡ', 'tấp nập', 'xe đạp', 'hồi hộp', 'gom góp', 'chút ít', 'mút sen', 'tia chớp']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên lá sen',
      models: [
        { initial: 'n', vowel: 'et', tone: 'sắc', result: 'nét' },
        { initial: 'h', vowel: 'ôp', tone: 'nặng', result: 'hộp' }
      ],
      readingSyllables: ['nét', 'tết', 'thịt', 'sút', 'mứt', 'tháp', 'sắp', 'lắp', 'chóp', 'lốp', 'lớp'],
      words: [
        { word: 'nét chữ', highlightPart: 'et', meaning: 'nét chữ nắn nót' },
        { word: 'hồi hộp', highlightPart: 'ôp', meaning: 'tâm trạng rộn ràng háo hức' },
        { word: 'xe đạp', highlightPart: 'ap', meaning: 'chiếc xe đạp thân thương' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Mật ong của gấu con',
      readingPassage: 'Trời xám xịt, mưa sầm sập như trút. Sấm sét ì ầm xa xa. Cây cỏ ngả rạp vào nhau. Một lúc sau, mưa lộp độp rồi dứt hẳn. Mặt trời ló khỏi chân mây. Vạn vật như thức dậy, đầy ắp sắc màu.',
      writingSamples: ['Gần hồ có ngọn tháp cao vút.'],
      story: {
        title: 'Mật ong của gấu con',
        pictures: [
          { id: 1, question: 'Gấu mẹ đã chuẩn bị gì cho gấu con đi chơi?', content: 'Gấu mẹ chuẩn bị một lọ mật ong vàng óng thơm ngon.' },
          { id: 2, question: 'Vì sao gấu con giấu lọ mật ong đi?', content: 'Gấu con sợ các bạn xin hết mật ong ngon của mình.' },
          { id: 3, question: 'Đồ ăn bị mất, các bạn làm gì?', content: 'Các bạn cùng chia sẻ những thức ăn mang theo cho nhau.' },
          { id: 4, question: 'Chia mật ong cho các bạn, gấu con nghĩ gì?', content: 'Gấu con thấy chia sẻ với bạn bè đem lại niềm vui to lớn hơn nhiều.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Gấu con cảm thấy thế nào khi chia sẻ mật ong cho các bạn?',
        options: ['Vui vẻ và hạnh phúc', 'Buồn bã', 'Tiếc nuối', 'Tức giận'],
        correctIndex: 0,
        explanation: 'Khi biết chia sẻ với bạn bè, gấu con cảm thấy vô cùng vui sướng.'
      }
    ]
  },
  {
    id: 56,
    lessonNumber: 56,
    title: 'ep êp ip up',
    type: 'phonics',
    pageRange: '124 - 125',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ep', 'êp', 'ip', 'up'],
      recognitionSentence: 'Trong bếp, lũ cún con múp míp nép vào bên mẹ.',
      recognitionKeywords: ['bếp', 'múp míp', 'nép']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'n', vowel: 'ep', tone: 'sắc', result: 'nép', spellingSteps: ['nờ', 'ep', 'nep', 'sắc', 'nép'] }
      ],
      readingSyllables: ['kẹp', 'nẹp', 'nếp', 'xếp', 'kịp', 'nhịp', 'búp', 'giúp'],
      words: [
        { word: 'đôi dép', highlightPart: 'ep', meaning: 'đôi dép đi trong nhà', illustrationIcon: '🩴', imageDesc: 'đôi dép' },
        { word: 'đầu bếp', highlightPart: 'êp', meaning: 'chú đầu bếp nấu ăn ngon', illustrationIcon: '👨‍🍳', imageDesc: 'đầu bếp' },
        { word: 'bìm bịp', highlightPart: 'ip', meaning: 'loài chim bìm bịp', illustrationIcon: '🐦', imageDesc: 'chim bìm bịp' },
        { word: 'búp sen', highlightPart: 'up', meaning: 'búp sen hồng e ấp', illustrationIcon: '🪷', imageDesc: 'búp sen' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Dịp nghỉ lễ, nhà Hà có chú Tư và cô Lan đến chơi. Mẹ nấu súp gà, cơm nếp và rán cá chép. Hà giúp mẹ rửa rau quả và sắp xếp bát đĩa. Bố thì dọn dẹp nhà cửa. Nhà Hà hôm nay thật là vui.',
      writingSamples: ['ep', 'êp', 'ip', 'up', 'bếp', 'bìm bịp', 'búp sen'],
      speakingTopic: {
        title: 'Khi nhà có khách',
        prompt: 'Em lễ phép chào hỏi, mời nước và tiếp đón khách cùng bố mẹ.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "bếp" chứa vần gì?',
        options: ['êp', 'ep', 'ip', 'up'],
        correctIndex: 0,
        explanation: 'b + êp + sắc = bếp.'
      }
    ]
  },
  {
    id: 57,
    lessonNumber: 57,
    title: 'anh ênh inh',
    type: 'phonics',
    pageRange: '126 - 127',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['anh', 'ênh', 'inh'],
      recognitionSentence: 'Con kênh xinh xinh chảy qua cánh đồng.',
      recognitionKeywords: ['kênh', 'xinh xinh', 'cánh đồng']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'c', vowel: 'anh', tone: 'sắc', result: 'cánh', spellingSteps: ['cờ', 'anh', 'canh', 'sắc', 'cánh'] }
      ],
      readingSyllables: ['chanh', 'mảnh', 'cạnh', 'kênh', 'ghềnh', 'lệnh', 'kính', 'chỉnh', 'thịnh'],
      words: [
        { word: 'quả chanh', highlightPart: 'anh', meaning: 'quả chanh xanh thơm mát', illustrationIcon: '🍋', imageDesc: 'quả chanh' },
        { word: 'bờ kênh', highlightPart: 'ênh', meaning: 'bờ kênh nước trong xanh', illustrationIcon: '🏞️', imageDesc: 'bờ kênh' },
        { word: 'kính râm', highlightPart: 'inh', meaning: 'chiếc kính râm che nắng', illustrationIcon: '🕶️', imageDesc: 'kính râm' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Nhà vịt ở gần một con kênh xinh xinh. Hôm nay trời đẹp, bố mẹ cho vịt con ra kênh tập bơi. Mới tập mà vịt con đã bơi rất nhanh. Vịt bố vịt mẹ vui quá, kêu cạp cạp. Gia đình vịt làm xôn xao cả mặt kênh.',
      writingSamples: ['anh', 'ênh', 'inh', 'chanh', 'kênh', 'kính'],
      speakingTopic: {
        title: 'Giữ gìn sức khoẻ',
        prompt: 'Nói về việc tập thể dục buổi sáng, bơi lội và ăn uống đủ chất để cơ thể khỏe mạnh.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "chanh" chứa vần gì?',
        options: ['anh', 'ênh', 'inh', 'ach'],
        correctIndex: 0,
        explanation: 'ch + anh = chanh.'
      }
    ]
  },
  {
    id: 58,
    lessonNumber: 58,
    title: 'ach êch ich',
    type: 'phonics',
    pageRange: '128 - 129',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ach', 'êch', 'ich'],
      recognitionSentence: 'Ếch con thích đọc sách.',
      recognitionKeywords: ['Ếch con', 'thích', 'đọc sách']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 's', vowel: 'ach', tone: 'sắc', result: 'sách', spellingSteps: ['sờ', 'ach', 'sach', 'sắc', 'sách'] }
      ],
      readingSyllables: ['vách', 'tách', 'sạch', 'chếch', 'mếch', 'lệch', 'bích', 'xích', 'kịch'],
      words: [
        { word: 'sách vở', highlightPart: 'ach', meaning: 'sách vở học tập', illustrationIcon: '📚', imageDesc: 'sách vở' },
        { word: 'chênh lệch', highlightPart: 'êch', meaning: 'không đều nhau', illustrationIcon: '⚖️', imageDesc: 'chênh lệch' },
        { word: 'tờ lịch', highlightPart: 'ich', meaning: 'tờ lịch treo tường đếm ngày tháng', illustrationIcon: '🗓️', imageDesc: 'tờ lịch' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc bài thơ Ếch cốm & Luyện nói',
      readingPassage: 'Ếch cốm\nCó một hôm ếch cốm\nTinh nghịch nấp bờ ao\nMải rình bắt cào cào\nQuên sách bên bờ cỏ.\nTới lớp cô hỏi nhỏ:\n– Sách đâu ếch học bài?\nCậu gãi đầu, gãi tai:\n– Thưa cô, em xin lỗi.',
      writingSamples: ['ach', 'êch', 'ich', 'sách', 'chênh lệch', 'lịch'],
      speakingTopic: {
        title: 'Lớp học của em',
        prompt: 'Kể về lớp học thân quen với cô giáo dịu hiền và các bạn chăm chỉ lắng nghe.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Chú ếch cốm trong bài thơ đã quên sách ở đâu?',
        options: ['Bên bờ cỏ', 'Ở nhà', 'Dưới nước ao', 'Trên bàn học'],
        correctIndex: 0,
        explanation: 'Vì mải bắt cào cào, ếch cốm đã để quên sách bên bờ cỏ.'
      }
    ]
  },
  {
    id: 59,
    lessonNumber: 59,
    title: 'ang ăng âng',
    type: 'phonics',
    pageRange: '130 - 131',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ang', 'ăng', 'âng'],
      recognitionSentence: 'Vầng trăng sáng lấp ló sau rặng tre.',
      recognitionKeywords: ['Vầng trăng', 'sáng', 'rặng tre']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 's', vowel: 'ang', tone: 'sắc', result: 'sáng', spellingSteps: ['sờ', 'ang', 'sang', 'sắc', 'sáng'] }
      ],
      readingSyllables: ['làng', 'rạng', 'sáng', 'bẵng', 'rặng', 'vẳng', 'hẵng', 'tầng', 'vâng'],
      words: [
        { word: 'cá vàng', highlightPart: 'ang', meaning: 'chú cá vàng bơi lượn trong bể', illustrationIcon: '🐠', imageDesc: 'cá vàng' },
        { word: 'măng tre', highlightPart: 'ăng', meaning: 'búp măng non nhú lên từ bụi tre', illustrationIcon: '🎋', imageDesc: 'măng tre' },
        { word: 'nhà tầng', highlightPart: 'âng', meaning: 'ngôi nhà cao tầng khang trang', illustrationIcon: '🏢', imageDesc: 'nhà tầng' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc bài thơ Mèo con đi học & Luyện nói',
      readingPassage: 'Mèo con đi học\nHôm nay trời nắng chang chang\nMèo con đi học chẳng mang thứ gì\nChỉ mang một cái bút chì\nVà mang một mẩu bánh mì con con.',
      writingSamples: ['ang', 'ăng', 'âng', 'măng tre', 'nhà tầng'],
      speakingTopic: {
        title: 'Mặt trăng và mặt trời',
        prompt: 'So sánh ánh nắng ban mai rực rỡ của mặt trời và ánh trăng thanh dịu mát ban đêm.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "trăng" chứa vần nào?',
        options: ['ăng', 'ang', 'âng', 'ong'],
        correctIndex: 0,
        explanation: 'tr + ăng = trăng.'
      }
    ]
  },
  {
    id: 60,
    lessonNumber: 60,
    title: 'Ôn tập và kể chuyện (Quạ và đàn bồ câu)',
    type: 'review',
    pageRange: '132 - 133',
    part1_Letters: {
      title: 'Giàn bầu hồ lô',
      letters: ['ep', 'êp', 'ip', 'up', 'anh', 'ênh', 'inh', 'ach', 'êch', 'ich', 'ang', 'ăng', 'âng'],
      recognitionSentence: 'Các quả bầu hồ lô xanh mướt mang những từ ngữ chứa vần kết thúc bằng p, ch, nh, ng.',
      recognitionKeywords: ['xinh đẹp', 'kịp thời', 'nhanh nhẹn', 'sạch sẽ', 'thẳng hàng', 'thích thú', 'chênh chếch', 'vâng lời', 'giúp đỡ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên giàn bầu',
      models: [
        { initial: 'đ', vowel: 'ep', tone: 'nặng', result: 'đẹp' },
        { initial: 'nh', vowel: 'anh', result: 'nhanh' }
      ],
      readingSyllables: ['đẹp', 'xếp', 'kịp', 'cúp', 'rãnh', 'ghềnh', 'đỉnh', 'vách', 'chếch', 'đích', 'sáng', 'thẳng', 'vâng'],
      words: [
        { word: 'xinh đẹp', highlightPart: 'ep', meaning: 'vẻ ngoài tươi tắn dễ thương' },
        { word: 'nhanh nhẹn', highlightPart: 'anh', meaning: 'hoạt bát, tháo vát' },
        { word: 'giúp đỡ', highlightPart: 'up', meaning: 'hỗ trợ bạn bè lúc khó khăn' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Quạ và đàn bồ câu',
      readingPassage: 'Hà rất thích con gà bà cho. Sáng sáng, Hà dậy sớm chờ gà gáy ò ó o. Vậy mà mãi nó chẳng gáy. Một hôm, Hà tỉnh giấc nghe gà cục ta cục tác. Giờ Hà đã rõ vì sao con gà chẳng gáy.',
      writingSamples: ['Em vẽ vầng trăng sáng.'],
      story: {
        title: 'Quạ và đàn bồ câu',
        pictures: [
          { id: 1, question: 'Quạ bôi trắng lông mình để làm gì?', content: 'Quạ thấy bồ câu được cho ăn no nên đã quét vôi trắng lên lông mình để giả làm bồ câu.' },
          { id: 2, question: 'Vì sao đàn bồ câu cho quạ vào chuồng?', content: 'Bồ câu tưởng quạ là bạn cùng đàn nên cho vào ăn chung.' },
          { id: 3, question: 'Phát hiện ra quạ, đàn bồ câu làm gì?', content: 'Quạ vui sướng kêu "quạ quạ", lộ đuôi giả, bồ câu liền mổ đuổi quạ đi.' },
          { id: 4, question: 'Vì sao họ nhà quạ cũng đuổi quạ đi?', content: 'Khi quạ bay về tổ quạ, đàn quạ thấy lông nó trắng bệch kì dị nên cũng xua đuổi không nhận.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Vì sao con gà của bạn Hà lại không gáy "ò ó o"?',
        options: ['Vì đó là gà mái (kêu cục ta cục tác)', 'Vì gà bị ốm', 'Vì gà còn bé', 'Vì gà quên tiếng gáy'],
        correctIndex: 0,
        explanation: 'Con gà của Hà kêu "cục ta cục tác" vì đó là một cô gà mái ngoan.'
      }
    ]
  }
];
