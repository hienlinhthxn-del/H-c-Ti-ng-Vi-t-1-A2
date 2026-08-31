import { Volume1Lesson } from '../types';

export const LESSONS_PART_3: Volume1Lesson[] = [
  {
    id: 61,
    lessonNumber: 61,
    title: 'ong ông ung ưng',
    type: 'phonics',
    pageRange: '134 - 135',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ong', 'ông', 'ung', 'ưng'],
      recognitionSentence: 'Những bông hồng rung rinh trong gió.',
      recognitionKeywords: ['bông hồng', 'rung rinh', 'trong gió']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'tr', vowel: 'ong', result: 'trong', spellingSteps: ['trờ', 'ong', 'trong'] }
      ],
      readingSyllables: ['dòng', 'võng', 'bổng', 'cộng', 'thúng', 'vũng', 'đựng', 'hứng'],
      words: [
        { word: 'chong chóng', highlightPart: 'ong', meaning: 'đồ chơi chong chóng quay tít', illustrationIcon: '🌀', imageDesc: 'chong chóng' },
        { word: 'bông súng', highlightPart: 'ung', meaning: 'hoa súng nở tím mặt ao', illustrationIcon: '🪷', imageDesc: 'bông súng' },
        { word: 'bánh chưng', highlightPart: 'ưng', meaning: 'bánh chưng xanh ngày Tết', illustrationIcon: '🍱', imageDesc: 'bánh chưng' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Nam theo mẹ đi chợ. Chợ đông vui và bán đủ thứ. Ngay từ cổng là những dãy hàng đồ dùng gia đình. Bên trong là hàng rau, thịt và cá. Nam thích lắm vì lần đầu cùng mẹ đi chợ.',
      writingSamples: ['ong', 'ông', 'ung', 'ưng', 'bông súng', 'bánh chưng'],
      speakingTopic: {
        title: 'Chợ và siêu thị',
        prompt: 'Nói về sự tấp nập của khu chợ truyền thống và siêu thị hiện đại.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "hồng" chứa vần gì?',
        options: ['ông', 'ong', 'ung', 'ưng'],
        correctIndex: 0,
        explanation: 'h + ông + huyền = hồng.'
      }
    ]
  },
  {
    id: 62,
    lessonNumber: 62,
    title: 'iêc iên iêp',
    type: 'phonics',
    pageRange: '136 - 137',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['iêc', 'iên', 'iêp'],
      recognitionSentence: 'Biển xanh biếc. Những hòn đảo lớn nhỏ trùng điệp.',
      recognitionKeywords: ['xanh biếc', 'trùng điệp']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'iêc', tone: 'sắc', result: 'biếc', spellingSteps: ['bờ', 'iêc', 'biêc', 'sắc', 'biếc'] }
      ],
      readingSyllables: ['thiếc', 'tiệc', 'xiếc', 'điện', 'kiến', 'thiện', 'diệp', 'thiếp', 'tiệp'],
      words: [
        { word: 'xanh biếc', highlightPart: 'iêc', meaning: 'màu xanh thẳm của nước biển', illustrationIcon: '🌊', imageDesc: 'xanh biếc' },
        { word: 'bờ biển', highlightPart: 'iên', meaning: 'bãi cát bên bờ biển dài', illustrationIcon: '🏖️', imageDesc: 'bờ biển' },
        { word: 'sò điệp', highlightPart: 'iêp', meaning: 'con sò điệp vỏ quạt đẹp', illustrationIcon: '🐚', imageDesc: 'sò điệp' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Vịnh Hạ Long là một kì quan thiên nhiên. Nơi đây có những hòn đảo lớn nhỏ trùng điệp, soi bóng trên mặt biển xanh biếc. Du khách thích đến đây ngắm cảnh, tắm mát và đi dạo trên những bãi biển.',
      writingSamples: ['iêc', 'iên', 'iêp', 'xanh biếc', 'biển', 'sò điệp'],
      speakingTopic: {
        title: 'Thế giới trong lòng biển',
        prompt: 'Kể tên rùa biển, san hô, cá hề bơi lội dưới làn nước trong vắt.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "biển" chứa vần nào?',
        options: ['iên', 'iêc', 'iêp', 'yên'],
        correctIndex: 0,
        explanation: 'b + iên + hỏi = biển.'
      }
    ]
  },
  {
    id: 63,
    lessonNumber: 63,
    title: 'iêng iêm yên',
    type: 'phonics',
    pageRange: '138 - 139',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['iêng', 'iêm', 'yên'],
      recognitionSentence: 'Yến phụng có bộ lông tím biêng biếc, trông rất diêm dúa.',
      recognitionKeywords: ['Yến phụng', 'biêng biếc', 'diêm dúa']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'iêng', result: 'biêng', spellingSteps: ['bờ', 'iêng', 'biêng'] }
      ],
      readingSyllables: ['kiễng', 'liệng', 'riềng', 'diềm', 'kiểm', 'xiêm', 'yên', 'yến'],
      words: [
        { word: 'sầu riêng', highlightPart: 'iêng', meaning: 'trái sầu riêng thơm ngọt', illustrationIcon: '🍈', imageDesc: 'sầu riêng' },
        { word: 'cá kiếm', highlightPart: 'iêm', meaning: 'chú cá kiếm mũi nhọn', illustrationIcon: '🐟', imageDesc: 'cá kiếm' },
        { word: 'tổ yến', highlightPart: 'yên', meaning: 'tổ chim yến trên vách đá', illustrationIcon: '🪺', imageDesc: 'tổ yến' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Hà theo bố đến sân chim. Sân chim có cò, diệc, sáo, bồ nông,... Hà chăm chú nhìn những đàn cò trắng, diệc xám bay liệng, đậu kín trên những ngọn cây. Sau một ngày đi kiếm ăn, từng đàn chim ríu rít về tổ, trông thật yên bình.',
      writingSamples: ['iêng', 'iêm', 'yên', 'sầu riêng', 'cá kiếm', 'yến'],
      speakingTopic: {
        title: 'Loài chim',
        prompt: 'Nói về chim vẹt sặc sỡ, chim én chao lượn báo mùa xuân.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "yến" có vần gì?',
        options: ['yên', 'iên', 'iêng', 'iêm'],
        correctIndex: 0,
        explanation: 'yên + sắc = yến (viết y dài khi không có âm đầu).'
      }
    ]
  },
  {
    id: 64,
    lessonNumber: 64,
    title: 'iêt iêu yêu',
    type: 'phonics',
    pageRange: '140 - 141',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['iêt', 'iêu', 'yêu'],
      recognitionSentence: 'Em yêu sách. Nhờ có sách, em biết nhiều điều hay.',
      recognitionKeywords: ['yêu sách', 'biết', 'nhiều điều']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'iêt', tone: 'sắc', result: 'biết', spellingSteps: ['bờ', 'iêt', 'biêt', 'sắc', 'biết'] }
      ],
      readingSyllables: ['chiết', 'viết', 'việt', 'chiều', 'diễu', 'kiểu', 'yêu', 'yếu', 'yểu'],
      words: [
        { word: 'nhiệt kế', highlightPart: 'iêt', meaning: 'dụng cụ đo thân nhiệt', illustrationIcon: '🌡️', imageDesc: 'nhiệt kế' },
        { word: 'con diều', highlightPart: 'iêu', meaning: 'cánh diều bay lượn trên trời cao', illustrationIcon: '🪁', imageDesc: 'con diều' },
        { word: 'yêu chiều', highlightPart: 'yêu', meaning: 'mẹ ôm ấp yêu thương con', illustrationIcon: '❤️', imageDesc: 'mẹ bế con' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Bố cho Nam và em chơi thả diều. Bố dạy Nam biết cách vừa chạy vừa kéo căng dây và giật giật để con diều có thể bay cao. Hai anh em thích thú ngắm nhìn những cánh diều sặc sỡ, đáng yêu chao liệng trên bầu trời.',
      writingSamples: ['iêt', 'iêu', 'yêu', 'nhiệt kế', 'yêu chiều'],
      speakingTopic: {
        title: 'Thế giới trên bầu trời',
        prompt: 'Nói về mây trắng, trăng sao và máy bay bay trên bầu trời cao xanh.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "diều" chứa vần nào?',
        options: ['iêu', 'yêu', 'iêt', 'êu'],
        correctIndex: 0,
        explanation: 'd + iêu + huyền = diều.'
      }
    ]
  },
  {
    id: 65,
    lessonNumber: 65,
    title: 'Ôn tập và kể chuyện (Lửa, mưa và con hổ hung hăng)',
    type: 'review',
    pageRange: '142 - 143',
    part1_Letters: {
      title: 'Cây thông quà tặng vần',
      letters: ['ong', 'ông', 'ung', 'ưng', 'iêc', 'iên', 'iêp', 'iêng', 'iêm', 'yên', 'iêt', 'iêu', 'yêu'],
      recognitionSentence: 'Những hộp quà đính trên cây thông mang các từ ngữ chứa vần đôi.',
      recognitionKeywords: ['xung phong', 'hiểu biết', 'xanh biếc', 'trùng điệp', 'yêu mến', 'khu rừng', 'yên tĩnh', 'khiêm tốn', 'tiếng trống', 'rong biển']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên hộp quà',
      models: [
        { initial: 'tr', vowel: 'ong', result: 'trong' },
        { initial: 'y', vowel: 'êu', tone: 'sắc', result: 'yếu' }
      ],
      readingSyllables: ['việc', 'chiên', 'tiếp', 'tiếng', 'nhiệm', 'yến', 'biết', 'diều', 'yếu'],
      words: [
        { word: 'trùng điệp', highlightPart: 'iêp', meaning: 'núi non hùng vĩ nối tiếp' },
        { word: 'yêu mến', highlightPart: 'yêu', meaning: 'tình cảm gắn bó thân thương' },
        { word: 'tiếng trống', highlightPart: 'iêng', meaning: 'âm vang rộn rã trường học' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Lửa, mưa và con hổ hung hăng',
      readingPassage: 'Trái đất của chúng ta vô cùng rộng lớn. Núi rừng trùng điệp. Đồng xanh bao la. Bầu trời cao rộng. Biển cả mênh mông. Sự sống không ngừng sinh sôi, nảy nở. Chúng ta cần biết yêu quý, giữ gìn và bảo vệ sự sống trên trái đất này.',
      writingSamples: ['Cánh diều chao liệng trên bầu trời.'],
      story: {
        title: 'Lửa, mưa và con hổ hung hăng',
        pictures: [
          { id: 1, question: 'Gặp "con vật lạ", hổ làm gì?', content: 'Hổ thấy đống lửa cháy bèn gầm gừ xông vào vồ.' },
          { id: 2, question: 'Vì sao hổ bị sém lông?', content: 'Lửa cháy bùng làm lông hổ cháy sém, hổ hoảng hốt nhảy xuống suối.' },
          { id: 3, question: 'Hổ tưởng mưa làm gì?', content: 'Thấy trời đổ mưa dập tắt lửa, hổ tưởng mưa đến cứu mình.' },
          { id: 4, question: 'Thoát nạn, hổ thế nào?', content: 'Hổ cụp đuôi sợ hãi chạy trốn vào rừng sâu, không dám hung hăng nữa.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Bài đọc khuyên chúng ta cần làm gì với trái đất?',
        options: ['Yêu quý, giữ gìn và bảo vệ sự sống trên trái đất', 'Khai thác hết tài nguyên', 'Không cần bảo vệ', 'Chỉ chăm lo cho bản thân'],
        correctIndex: 0,
        explanation: 'Trái đất là ngôi nhà chung tươi đẹp, chúng ta phải chung tay gìn giữ.'
      }
    ]
  },
  {
    id: 66,
    lessonNumber: 66,
    title: 'uôi uôm',
    type: 'phonics',
    pageRange: '144 - 145',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['uôi', 'uôm'],
      recognitionSentence: 'Thuyền buồm xuôi theo chiều gió.',
      recognitionKeywords: ['buồm', 'xuôi']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'x', vowel: 'uôi', result: 'xuôi', spellingSteps: ['xờ', 'uôi', 'xuôi'] }
      ],
      readingSyllables: ['muối', 'muỗi', 'nguội', 'tuổi', 'buồm', 'muỗm', 'nhuốm', 'nhuộm'],
      words: [
        { word: 'con suối', highlightPart: 'uôi', meaning: 'dòng suối nước trong lành', illustrationIcon: '🏞️', imageDesc: 'con suối' },
        { word: 'buổi sáng', highlightPart: 'uôi', meaning: 'bình minh rạng rỡ', illustrationIcon: '🌅', imageDesc: 'buổi sáng' },
        { word: 'quả muỗm', highlightPart: 'uôm', meaning: 'quả muỗm thơm ngọt giống xoài', illustrationIcon: '🥭', imageDesc: 'quả muỗm' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Buổi sớm mai, ông mặt trời nhô lên từ biển. Mặt biển nhuộm một màu xanh biếc. Đàn hải âu sải cánh bay liệng trên bầu trời. Xa xa là những cánh buồm căng gió. Phía bến cảng, những chiếc tàu cá nối đuôi nhau vào bờ.',
      writingSamples: ['uôi', 'uôm', 'con suối', 'quả muỗm'],
      speakingTopic: {
        title: 'Đi lại trên biển',
        prompt: 'Nói về thuyền buồm, tàu đánh cá và thuyền thúng đánh bắt cá.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "buồm" chứa vần gì?',
        options: ['uôm', 'uôi', 'uôn', 'ôm'],
        correctIndex: 0,
        explanation: 'b + uôm + huyền = buồm.'
      }
    ]
  },
  {
    id: 67,
    lessonNumber: 67,
    title: 'uôc uôt',
    type: 'phonics',
    pageRange: '146 - 147',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['uôc', 'uôt'],
      recognitionSentence: 'Mẹ vuốt tóc và buộc nơ cho Hà.',
      recognitionKeywords: ['vuốt tóc', 'buộc nơ']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'uôc', tone: 'nặng', result: 'buộc', spellingSteps: ['bờ', 'uôc', 'buôc', 'nặng', 'buộc'] }
      ],
      readingSyllables: ['cuốc', 'luộc', 'ruốc', 'thuộc', 'buốt', 'muốt', 'ruột', 'tuột'],
      words: [
        { word: 'ngọn đuốc', highlightPart: 'uôc', meaning: 'ngọn đuốc thắp lửa bập bùng', illustrationIcon: '🔥', imageDesc: 'ngọn đuốc' },
        { word: 'viên thuốc', highlightPart: 'uôc', meaning: 'viên thuốc uống trị bệnh', illustrationIcon: '💊', imageDesc: 'viên thuốc' },
        { word: 'con chuột', highlightPart: 'uôt', meaning: 'chú chuột nhỏ', illustrationIcon: '🐭', imageDesc: 'con chuột' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Mẹ cho Hà đi công viên. Cô bé rất thích thú và háo hức. Hà mặc váy trắng, đi giày màu hồng. Mẹ còn vuốt tóc và buộc nơ cho Hà. Mẹ bảo Hà khi đi chơi cần ăn mặc gọn gàng, lịch sự.',
      writingSamples: ['uôc', 'uôt', 'ngọn đuốc', 'con chuột'],
      speakingTopic: {
        title: 'Chuẩn bị đi dự sinh nhật',
        prompt: 'Gói quà và viết thiệp chúc mừng sinh nhật bạn thân.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "chuột" chứa vần nào?',
        options: ['uôt', 'uôc', 'uôn', 'ôt'],
        correctIndex: 0,
        explanation: 'ch + uôt + nặng = chuột.'
      }
    ]
  },
  {
    id: 68,
    lessonNumber: 68,
    title: 'uôn uông',
    type: 'phonics',
    pageRange: '148 - 149',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['uôn', 'uông'],
      recognitionSentence: 'Chuồn chuồn bay qua các luống rau.',
      recognitionKeywords: ['Chuồn chuồn', 'luống rau']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'ch', vowel: 'uôn', tone: 'huyền', result: 'chuồn', spellingSteps: ['chờ', 'uôn', 'chuôn', 'huyền', 'chuồn'] }
      ],
      readingSyllables: ['khuôn', 'muốn', 'muộn', 'nguồn', 'buồng', 'luống', 'thuởng', 'vuông'],
      words: [
        { word: 'cuộn chỉ', highlightPart: 'uôn', meaning: 'cuộn chỉ may áo', illustrationIcon: '🧵', imageDesc: 'cuộn chỉ' },
        { word: 'buồng chuối', highlightPart: 'uông', meaning: 'buồng chuối chín vàng trĩu quả', illustrationIcon: '🍌', imageDesc: 'buồng chuối' },
        { word: 'quả chuông', highlightPart: 'uông', meaning: 'quả chuông đồng leng keng', illustrationIcon: '🔔', imageDesc: 'quả chuông' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Trời sắp mưa. Chuồn chuồn bay thấp. Bầu trời đen kịt. Gió thổi mạnh cuốn theo những đám lá khô. Rồi mưa ào ào trút xuống. Mưa tạnh, những hạt mưa long lanh đọng trên các cuống lá. Bầu trời trong xanh, không khí mát mẻ.',
      writingSamples: ['uôn', 'uông', 'cuộn chỉ', 'buồng chuối'],
      speakingTopic: {
        title: 'Mưa và nắng',
        prompt: 'Nói về cảm xúc khi trời mưa rào mát rượi và khi ánh nắng ấm áp chiếu rọi.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Hiện tượng chuồn chuồn bay thấp báo hiệu điều gì?',
        options: ['Trời sắp mưa', 'Trời sắp nắng', 'Trời có tuyết', 'Trời bão tuyết'],
        correctIndex: 0,
        explanation: 'Dân gian có câu: "Chuồn chuồn bay thấp thì mưa, bay cao thì nắng, bay vừa thì râm".'
      }
    ]
  },
  {
    id: 69,
    lessonNumber: 69,
    title: 'ươi ưou',
    type: 'phonics',
    pageRange: '150 - 151',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ươi', 'ươu'],
      recognitionSentence: 'Chim khướu biết bắt chước tiếng người.',
      recognitionKeywords: ['khướu', 'tiếng người']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'ng', vowel: 'ươi', tone: 'huyền', result: 'người', spellingSteps: ['ngờ', 'ươi', 'ngươi', 'huyền', 'người'] }
      ],
      readingSyllables: ['bưởi', 'cười', 'lưới', 'mười', 'bướu', 'hươu', 'khướu', 'rượu'],
      words: [
        { word: 'tươi cười', highlightPart: 'ươi', meaning: 'khuôn mặt rạng rỡ tươi vui', illustrationIcon: '😄', imageDesc: 'nụ cười tươi' },
        { word: 'quả bưởi', highlightPart: 'ươi', meaning: 'quả bưởi da xanh mọng nước', illustrationIcon: '🍈', imageDesc: 'quả bưởi' },
        { word: 'ốc bươu', highlightPart: 'ươu', meaning: 'con ốc bươu đồng ruộng', illustrationIcon: '🐌', imageDesc: 'ốc bươu' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Lạc đà là con vật đặc biệt. Nó có cái bướu to trên lưng. Bướu của lạc đà là nơi dự trữ chất béo. Nhờ thế, nó có thể sống qua nhiều ngày mà không cần ăn uống. Lạc đà giúp con người băng qua những vùng sa mạc khô cằn.',
      writingSamples: ['ươi', 'ươu', 'tươi cười', 'ốc bươu'],
      speakingTopic: {
        title: 'Lợi ích của vật nuôi',
        prompt: 'Kể về lợi ích của bò cho sữa, cừu cho lông ấm, vịt đẻ trứng.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Cái bướu trên lưng lạc đà dùng để làm gì?',
        options: ['Dự trữ chất béo giúp lạc đà nhịn ăn uống nhiều ngày', 'Để chở đồ', 'Để làm đẹp', 'Để làm mát cơ thể'],
        correctIndex: 0,
        explanation: 'Bướu lạc đà dự trữ chất béo, cung cấp năng lượng và nước khi đi sa mạc.'
      }
    ]
  },
  {
    id: 70,
    lessonNumber: 70,
    title: 'Ôn tập và kể chuyện (Chuột nhà và chuột đồng)',
    type: 'review',
    pageRange: '152 - 153',
    part1_Letters: {
      title: 'Bảng ghép vần',
      letters: ['uôi', 'uôm', 'uôc', 'uôt', 'uôn', 'uông', 'ươi', 'ươu'],
      recognitionSentence: 'Ôn tập các vần nguyên âm đôi uô và ươ qua các đám mây.',
      recognitionKeywords: ['vuốt ve', 'trẻ thơ', 'cưỡi ngựa', 'nhuộm vải', 'nướu răng', 'lem luốc', 'luống cuống', 'muôn màu']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên đám mây',
      models: [
        { initial: 'v', vowel: 'uôt', tone: 'sắc', result: 'vuốt' },
        { initial: 'c', vowel: 'ươi', tone: 'ngã', result: 'cưỡi' }
      ],
      readingSyllables: ['vuốt ve', 'trẻ thơ', 'cưỡi ngựa', 'nhuộm vải', 'nướu răng', 'lem luốc', 'luống cuống', 'muôn màu'],
      words: [
        { word: 'vuốt ve', highlightPart: 'uôt', meaning: 'yêu thương âu yếm' },
        { word: 'cưỡi ngựa', highlightPart: 'ươi', meaning: 'ngồi trên lưng ngựa phi nhanh' },
        { word: 'muôn màu', highlightPart: 'uôn', meaning: 'rực rỡ muôn vàn sắc thái' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Chuột nhà và chuột đồng',
      readingPassage: 'Ông trồng nhiều cây ăn trái. Khóm chuối xanh tươi đã trổ buồng. Hàng bưởi ra bông trắng muốt. Mấy cây đu đủ quả chín vàng ruộm. Ông còn nuôi nhiều con vật rất đáng yêu. Gà mẹ, gà con ríu rít. Đôi chim khướu hót vang. Chú mèo cuộn tròn sưởi nắng bên thềm.',
      writingSamples: ['Đôi chim khướu hót vang.'],
      story: {
        title: 'Chuột nhà và chuột đồng',
        pictures: [
          { id: 1, question: 'Vì sao chuột nhà rủ chuột đồng lên thành phố?', content: 'Chuột nhà khoe ở thành phố có nhiều món ngon sơn hào hải vị.' },
          { id: 2, question: 'Tối đầu tiên kiếm ăn trên thành phố, chúng gặp chuyện gì?', content: 'Chúng vừa mò vào bếp thì bị chú mèo rình bắt suýt chết khiếp.' },
          { id: 3, question: 'Chuyện gì xảy ra khi chúng mò đến kho thực phẩm?', content: 'Lại bị người và chó săn đuổi bắt chạy trối chết.' },
          { id: 4, question: 'Chia tay chuột nhà, chuột đồng nói gì?', content: 'Chuột đồng nói: "Thà ăn rau củ đạm bạc ở đồng quê mà bình yên, còn hơn ăn ngon mà luôn nơm nớp lo sợ".' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Vì sao chuột đồng quyết định trở về quê sinh sống?',
        options: ['Vì ở quê được sống tự do, bình yên và an toàn', 'Vì hết thức ăn', 'Vì nhớ mẹ', 'Vì không thích thành phố'],
        correctIndex: 0,
        explanation: 'Cuộc sống thanh thản, an lành quý giá hơn những món ăn ngon mà đầy hiểm nguy.'
      }
    ]
  },
  {
    id: 71,
    lessonNumber: 71,
    title: 'ươc ươt',
    type: 'phonics',
    pageRange: '154 - 155',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ươc', 'ươt'],
      recognitionSentence: 'Hà ước được lướt sóng biển.',
      recognitionKeywords: ['ước được', 'lướt sóng']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'đ', vowel: 'ươc', tone: 'nặng', result: 'được', spellingSteps: ['đờ', 'ươc', 'đươc', 'nặng', 'được'] }
      ],
      readingSyllables: ['bước', 'lược', 'ngược', 'nước', 'lướt', 'lượt', 'mướt', 'mượt'],
      words: [
        { word: 'thước kẻ', highlightPart: 'ươc', meaning: 'cây thước kẻ học sinh', illustrationIcon: '📏', imageDesc: 'thước kẻ' },
        { word: 'dược sĩ', highlightPart: 'ươc', meaning: 'cô dược sĩ bào chế thuốc', illustrationIcon: '👩‍⚕️', imageDesc: 'dược sĩ' },
        { word: 'lướt ván', highlightPart: 'ươt', meaning: 'môn thể thao lướt ván trên sóng biển', illustrationIcon: '🏄', imageDesc: 'lướt ván' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Lúc học hát, Nam ước làm ca sĩ. Lúc nghe mẹ đọc thơ, Nam lại ước trở thành nhà thơ. Khi ra biển, Nam ước là người lái tàu, vượt qua những con sóng lớn. Nhìn lên bầu trời, Nam lại ước làm phi công. Nam tự hỏi: "Bao giờ mình mới lớn nhỉ?".',
      writingSamples: ['ươc', 'ươt', 'thước kẻ', 'lướt ván'],
      speakingTopic: {
        title: 'Ước mơ của em',
        prompt: 'Kể về ước mơ mai sau trở thành cô giáo, bác sĩ, kĩ sư xây dựng hay chú công an.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "nước" chứa vần nào?',
        options: ['ươc', 'ươt', 'uôc', 'ac'],
        correctIndex: 0,
        explanation: 'n + ươc + sắc = nước.'
      }
    ]
  },
  {
    id: 72,
    lessonNumber: 72,
    title: 'ưom ưop',
    type: 'phonics',
    pageRange: '156 - 157',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ưom', 'ưop'],
      recognitionSentence: 'Hoa mướp vàng ươm, bướm bay rập rờn.',
      recognitionKeywords: ['vàng ươm', 'bướm bay']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'b', vowel: 'ưom', tone: 'sắc', result: 'bướm', spellingSteps: ['bờ', 'ưom', 'bươm', 'sắc', 'bướm'] }
      ],
      readingSyllables: ['chườm', 'đượm', 'gươm', 'ướm', 'lượm', 'mướp', 'nượp', 'ướp'],
      words: [
        { word: 'con bướm', highlightPart: 'ưom', meaning: 'chú bướm xinh đẹp vờn hoa', illustrationIcon: '🦋', imageDesc: 'con bướm' },
        { word: 'nườm nượp', highlightPart: 'ưop', meaning: 'xe cộ đi lại đông đúc tấp nập', illustrationIcon: '🚗', imageDesc: 'nườm nượp' },
        { word: 'giàn mướp', highlightPart: 'ưop', meaning: 'giàn hoa mướp vàng rực góc sân', illustrationIcon: '🥒', imageDesc: 'giàn mướp' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Nắng vàng ươm như mật trải khắp sân. Chú mèo mướp thảnh thơi nằm sưởi nắng bên thềm. Mắt chú lim dim ra điều thích thú. Mấy sợi ria mép rung rinh. Đừng thấy mèo ta hay nằm dài mà nghĩ chú lười. Sưởi nắng giúp mèo dẻo dai hơn đấy.',
      writingSamples: ['ưom', 'ưop', 'nườm nượp', 'giàn mướp'],
      speakingTopic: {
        title: 'Vật nuôi yêu thích',
        prompt: 'Kể về chú chó con trung thành hoặc chú mèo mướp ngoan ngoãn bắt chuột.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "mướp" chứa vần gì?',
        options: ['ưop', 'ưom', 'ươt', 'op'],
        correctIndex: 0,
        explanation: 'm + ưop + sắc = mướp.'
      }
    ]
  },
  {
    id: 73,
    lessonNumber: 73,
    title: 'ưon ương',
    type: 'phonics',
    pageRange: '158 - 159',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['ưon', 'ương'],
      recognitionSentence: 'Đường tới trường lượn theo sườn đồi.',
      recognitionKeywords: ['Đường tới trường', 'lượn', 'sườn đồi']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'l', vowel: 'ưon', tone: 'nặng', result: 'lượn', spellingSteps: ['lờ', 'ưon', 'lươn', 'nặng', 'lượn'] }
      ],
      readingSyllables: ['lươn', 'rườn', 'sườn', 'vượn', 'hướng', 'phượng', 'sương', 'tưởng'],
      words: [
        { word: 'khu vườn', highlightPart: 'ưon', meaning: 'khu vườn rực rỡ hoa trái', illustrationIcon: '🏡', imageDesc: 'khu vườn' },
        { word: 'hạt sương', highlightPart: 'ương', meaning: 'giọt sương sớm long lanh trên ngọn cỏ', illustrationIcon: '💧', imageDesc: 'hạt sương' },
        { word: 'con đường', highlightPart: 'ương', meaning: 'con đường làng uốn lượn râm mát', illustrationIcon: '🛣️', imageDesc: 'con đường' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Buổi sáng, tiếng gà gọi mặt trời thức dậy. Bầu trời phía đông ửng hồng. Nắng xua tan màn sương. Cây lá bừng tỉnh sau một giấc ngủ dài, vươn mình đón những tia nắng đầu tiên của ngày mới. Làng quê rộn ràng những âm thanh của cuộc sống. Em tới lớp. Mẹ đi làm.',
      writingSamples: ['ưon', 'ương', 'khu vườn', 'con đường'],
      speakingTopic: {
        title: 'Buổi sáng của em',
        prompt: 'Kể về các hoạt động buổi sáng: đánh răng rửa mặt, ăn sáng và chuẩn bị cặp sách đến trường.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "đường" chứa vần gì?',
        options: ['ương', 'ưon', 'uông', 'uôn'],
        correctIndex: 0,
        explanation: 'đ + ương + huyền = đường.'
      }
    ]
  },
  {
    id: 74,
    lessonNumber: 74,
    title: 'oa oe',
    type: 'phonics',
    pageRange: '160 - 161',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['oa', 'oe'],
      recognitionSentence: 'Các loài hoa đua nhau khoe sắc.',
      recognitionKeywords: ['loài hoa', 'khoe sắc']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'h', vowel: 'oa', result: 'hoa', spellingSteps: ['hờ', 'oa', 'hoa'] }
      ],
      readingSyllables: ['hoà', 'loa', 'toả', 'xoá', 'khoẻ', 'loe', 'loé', 'xoè'],
      words: [
        { word: 'đoá hoa', highlightPart: 'oa', meaning: 'bông hoa hồng rực rỡ', illustrationIcon: '🌹', imageDesc: 'đoá hoa hồng' },
        { word: 'váy xoè', highlightPart: 'oe', meaning: 'chiếc váy xoè công chúa', illustrationIcon: '👗', imageDesc: 'váy xoè' },
        { word: 'chích choè', highlightPart: 'oe', meaning: 'chú chim chích choè lanh lợi', illustrationIcon: '🐦', imageDesc: 'chim chích choè' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Tết đến, hoa đào khoe sắc hồng tươi, hoa mai vàng nở rộ. Hè sang, hoa phượng bùng lửa đỏ, cháy rực cả góc trời. Cuối thu, hương hoa sữa nồng nàn, ngát thơm từng góc phố. Cuối đông, hoa cải trải thảm vàng rực rỡ bên sông. Những sắc hoa, hương hoa làm đẹp thêm cho cuộc sống.',
      writingSamples: ['oa', 'oe', 'đoá hoa', 'chích choè'],
      speakingTopic: {
        title: 'Muôn hoa khoe sắc',
        prompt: 'Kể tên các loài hoa theo bốn mùa: hoa đào, hoa lan, hoa sen, hoa cúc, hoa phượng.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "hoa" chứa vần gì?',
        options: ['oa', 'oe', 'ua', 'ưa'],
        correctIndex: 0,
        explanation: 'h + oa = hoa.'
      }
    ]
  },
  {
    id: 75,
    lessonNumber: 75,
    title: 'Ôn tập và kể chuyện (Chuyện của mây)',
    type: 'review',
    pageRange: '162 - 163',
    part1_Letters: {
      title: 'Đoàn tàu chở từ',
      letters: ['ươc', 'ươt', 'ưom', 'ưop', 'ưon', 'ương', 'oa', 'oe'],
      recognitionSentence: 'Đoàn tàu hỏa kéo những toa chữ ôn tập các vần đã học.',
      recognitionKeywords: ['lướt sóng', 'ước mơ', 'mèo mướp', 'hạt cườm', 'bay lượn', 'nụ hoa', 'vàng hoe', 'toả hương']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc bài thơ Buổi sớm',
      models: [
        { initial: 'l', vowel: 'ươt', tone: 'sắc', result: 'lướt' },
        { initial: 'h', vowel: 'oa', result: 'hoa' }
      ],
      readingSyllables: ['ước', 'lướt', 'gươm', 'ướp', 'lượn', 'hương', 'hoa', 'loe'],
      words: [
        { word: 'lướt sóng', highlightPart: 'ươt', meaning: 'lướt trên ngọn sóng' },
        { word: 'toả hương', highlightPart: 'ương', meaning: 'hương thơm ngát lan tỏa' },
        { word: 'vàng hoe', highlightPart: 'oe', meaning: 'ánh nắng vàng tươi' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc thơ & Kể chuyện: Chuyện của mây',
      readingPassage: 'Buổi sớm\nMặt trời tỉnh giấc\nHai má ửng hồng,\nTung đám mây bông\nVươn vai thức dậy.\nCô gió thì chạy\nTrong cánh rừng xa,\nMang cả hương hoa\nÙa vào lớp học.',
      writingSamples: ['Khắp vườn, hoa toả hương ngào ngạt.'],
      story: {
        title: 'Chuyện của mây',
        pictures: [
          { id: 1, question: 'Vì sao mây buồn?', content: 'Mây thấy mình bay mãi trên trời cao mà chẳng giúp ích được gì.' },
          { id: 2, question: 'Vì sao mây muốn đi làm mưa?', content: 'Mây thấy đất đai, cây cối khô hạn đang khát nước nên muốn hóa thành mưa.' },
          { id: 3, question: 'Mưa xuống, con người và cỏ cây như thế nào?', content: 'Mưa mát lành tưới tắm làm vạn vật bừng tỉnh tươi tốt, ai nấy đều hân hoan.' },
          { id: 4, question: 'Nước biến thành mây như thế nào?', content: 'Mặt trời chiếu nắng, nước sông hồ bốc hơi bay lên không trung tụ thành những đám mây trắng xinh đẹp.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Những giọt mưa rơi xuống có ích lợi gì?',
        options: ['Tưới mát cho cây cối, mang lại nguồn nước cho con người và vạn vật', 'Làm trời tối đen', 'Làm cây khô héo', 'Không có ích lợi'],
        correctIndex: 0,
        explanation: 'Mưa mang lại sự sống cho mọi loài sinh vật trên trái đất.'
      }
    ]
  },
  {
    id: 76,
    lessonNumber: 76,
    title: 'oan oăn oat oăt',
    type: 'phonics',
    pageRange: '164 - 165',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['oan', 'oăn', 'oat', 'oăt'],
      recognitionSentence: 'Trên phim hoạt hình, voi bước khoan thai, thỏ chạy thoăn thoắt.',
      recognitionKeywords: ['hoạt hình', 'khoan thai', 'thoăn thoắt']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'kh', vowel: 'oan', result: 'khoan', spellingSteps: ['khờ', 'oan', 'khoan'] }
      ],
      readingSyllables: ['hoạt', 'khoát', 'toán', 'xoan', 'choắt', 'hoắt', 'ngoằn', 'thoăn'],
      words: [
        { word: 'hoa xoan', highlightPart: 'oan', meaning: 'chùm hoa xoan tím nở đầu xuân', illustrationIcon: '🌸', imageDesc: 'hoa xoan' },
        { word: 'tóc xoăn', highlightPart: 'oăn', meaning: 'mái tóc xoăn bồng bềnh', illustrationIcon: '👧', imageDesc: 'bé tóc xoăn' },
        { word: 'hoạt hình', highlightPart: 'oat', meaning: 'phim hoạt hình thiếu nhi vui nhộn', illustrationIcon: '📺', imageDesc: 'hoạt hình' },
        { word: 'nhọn hoắt', highlightPart: 'oăt', meaning: 'đầu bút chì gọt nhọn hoắt', illustrationIcon: '✏️', imageDesc: 'bút chì nhọn hoắt' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Trong vườn, cây xoan và cây khế đã trổ hoa hàng loạt. Vườn cây ngập tràn sắc tím. Mỗi buổi sáng, khu vườn rộn ràng với những tiếng lích ra lích rích của mấy chú chích bông. Chúng thoăn thoắt nhảy từ cành này sang cành khác. Vừa nhảy nhót chúng vừa trêu đùa nhau, vui thật là vui.',
      writingSamples: ['oan', 'oăn', 'oat', 'oăt', 'tóc xoăn', 'nhọn hoắt'],
      speakingTopic: {
        title: 'Trồng cây',
        prompt: 'Các bạn học sinh cùng nhau cuốc đất, trồng cây non và tưới nước cho vườn trường thêm xanh.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "xoăn" chứa vần gì?',
        options: ['oăn', 'oan', 'oat', 'oăt'],
        correctIndex: 0,
        explanation: 'x + oăn = xoăn.'
      }
    ]
  },
  {
    id: 77,
    lessonNumber: 77,
    title: 'oai uê uy',
    type: 'phonics',
    pageRange: '166 - 167',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['oai', 'uê', 'uy'],
      recognitionSentence: 'Quê ngoại của Hà có luỹ tre xanh, có cây trái xum xuê.',
      recognitionKeywords: ['ngoại', 'luỹ tre', 'xum xuê']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'ng', vowel: 'oai', tone: 'nặng', result: 'ngoại', spellingSteps: ['ngờ', 'oai', 'ngoai', 'nặng', 'ngoại'] }
      ],
      readingSyllables: ['khoai', 'ngoái', 'ngoại', 'huệ', 'thuế', 'tuế', 'huy', 'luỹ', 'thuỷ'],
      words: [
        { word: 'khoai sọ', highlightPart: 'oai', meaning: 'củ khoai sọ bùi ngon', illustrationIcon: '🥔', imageDesc: 'khoai sọ' },
        { word: 'vạn tuế', highlightPart: 'uê', meaning: 'cây vạn tuế lá xanh tươi', illustrationIcon: '🌴', imageDesc: 'cây vạn tuế' },
        { word: 'tàu thuỷ', highlightPart: 'uy', meaning: 'con tàu thuỷ vượt đại dương', illustrationIcon: '🚢', imageDesc: 'tàu thuỷ' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Ngày nghỉ, Hà thoải mái vui đùa với hoa trái vườn nhà. Hà thì thầm với cây xoài lúc lỉu quả. Hà cúi trêu đám dây khoai lang đang bò trên mặt đất. Em cùng gió nô giỡn bên những bông huệ trắng. Em đưa tay vuốt ve những cánh thuỷ tiên đang thi nhau khoe sắc.',
      writingSamples: ['oai', 'uê', 'uy', 'khoai', 'vạn tuế', 'tàu thuỷ'],
      speakingTopic: {
        title: 'Khu vườn mơ ước',
        prompt: 'Kể về khu vườn có ao cá nhỏ, giàn mướp hoa vàng và những luống rau xanh mát.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "thuỷ" chứa vần gì?',
        options: ['uy', 'uê', 'oai', 'ui'],
        correctIndex: 0,
        explanation: 'th + uy + hỏi = thuỷ.'
      }
    ]
  },
  {
    id: 78,
    lessonNumber: 78,
    title: 'uân uât',
    type: 'phonics',
    pageRange: '168 - 169',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['uân', 'uât'],
      recognitionSentence: 'Chúng em xem chương trình nghệ thuật chào xuân.',
      recognitionKeywords: ['nghệ thuật', 'xuân']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'x', vowel: 'uân', result: 'xuân', spellingSteps: ['xờ', 'uân', 'xuân'] }
      ],
      readingSyllables: ['chuẩn', 'huân', 'khuân', 'tuần', 'khuất', 'luật', 'thuật', 'xuất'],
      words: [
        { word: 'tuần tra', highlightPart: 'uân', meaning: 'chú bộ đội tuần tra biên giới', illustrationIcon: '💂', imageDesc: 'tuần tra' },
        { word: 'mùa xuân', highlightPart: 'uân', meaning: 'mùa xuân hoa đào nở rộ', illustrationIcon: '🌸', imageDesc: 'mùa xuân' },
        { word: 'võ thuật', highlightPart: 'uât', meaning: 'bạn nhỏ luyện tập võ thuật khỏe khoắn', illustrationIcon: '🥋', imageDesc: 'võ thuật' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn và Luyện nói',
      readingPassage: 'Gần Tết, bố và Hà đi chợ hoa mua đào và quất. Cành đào chi chít lộc non, những nụ hoa phớt hồng đang e ấp nở. Cây quất xum xuê, quả vàng óng. Mẹ nhìn bố và Hà nói: "Hai bố con đem cả mùa xuân về nhà rồi đấy". Cả nhà cùng vui đón xuân.',
      writingSamples: ['uân', 'uât', 'tuần tra', 'võ thuật'],
      speakingTopic: {
        title: 'Đón Tết',
        prompt: 'Không khí ấm cúng của gia đình cùng nhau gói bánh chưng, cắm hoa đào đón Tết cổ truyền.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Tiếng "thuật" chứa vần nào?',
        options: ['uât', 'uân', 'uôt', 'uôc'],
        correctIndex: 0,
        explanation: 'th + uât + nặng = thuật.'
      }
    ]
  },
  {
    id: 79,
    lessonNumber: 79,
    title: 'uyên uyêt',
    type: 'phonics',
    pageRange: '170 - 171',
    part1_Letters: {
      title: 'Nhận biết',
      letters: ['uyên', 'uyêt'],
      recognitionSentence: 'Bà kể chuyện hay tuyệt.',
      recognitionKeywords: ['kể chuyện', 'tuyệt']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc âm vần, tiếng, từ ngữ',
      models: [
        { initial: 'ch', vowel: 'uyên', tone: 'nặng', result: 'chuyện', spellingSteps: ['chờ', 'uyên', 'chuyên', 'nặng', 'chuyện'] }
      ],
      readingSyllables: ['chuyến', 'luyện', 'thuyền', 'truyện', 'duyệt', 'khuyết', 'tuyết', 'tuyệt'],
      words: [
        { word: 'con thuyền', highlightPart: 'uyên', meaning: 'con thuyền giương buồm ra khơi', illustrationIcon: '⛵', imageDesc: 'con thuyền' },
        { word: 'trăng khuyết', highlightPart: 'uyêt', meaning: 'vầng trăng cong như chiếc thuyền trôi', illustrationIcon: '🌙', imageDesc: 'trăng khuyết' },
        { word: 'truyền thuyết', highlightPart: 'uyêt', meaning: 'truyền thuyết Thánh Gióng đánh giặc', illustrationIcon: '🐎', imageDesc: 'truyền thuyết' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc bài thơ Trăng sáng & Luyện nói',
      readingPassage: 'Trăng sáng\nSân nhà em sáng quá\nNhờ ánh trăng sáng ngời.\nTrăng tròn như cái đĩa\nLơ lửng mà không rơi.\nNhững hôm nào trăng khuyết,\nTrông giống con thuyền trôi.\nEm đi trăng theo bước\nNhư muốn cùng đi chơi.',
      writingSamples: ['uyên', 'uyêt', 'con thuyền', 'truyền thuyết'],
      speakingTopic: {
        title: 'Cảnh vật',
        prompt: 'Ngắm cảnh trăng thanh gió mát bên con thuyền neo đậu trên dòng sông êm đềm.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Trong bài thơ "Trăng sáng", khi trăng khuyết trông giống cái gì?',
        options: ['Con thuyền trôi', 'Cái đĩa tròn', 'Quả bóng', 'Đèn lồng'],
        correctIndex: 0,
        explanation: 'Bài thơ có câu: "Những hôm nào trăng khuyết, Trông giống con thuyền trôi".'
      }
    ]
  },
  {
    id: 80,
    lessonNumber: 80,
    title: 'Ôn tập và kể chuyện (Cặp sừng và đôi chân)',
    type: 'review',
    pageRange: '172 - 173',
    part1_Letters: {
      title: 'Vườn bí đỏ mang vần',
      letters: ['oan', 'oăn', 'oat', 'oăt', 'oai', 'uê', 'uy', 'uân', 'uât', 'uyên', 'uyêt'],
      recognitionSentence: 'Các quả bí ngô khổng lồ mang các từ ngữ chứa vần 3 chữ cái.',
      recognitionKeywords: ['ngoan ngoãn', 'tuyệt vời', 'thoăn thoắt', 'lưu loát', 'ngoái lại', 'vành khuyên', 'thủy thủ', 'xum xuê', 'tuần lễ', 'xuất phát']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc từ ngữ trên quả bí',
      models: [
        { initial: 'ng', vowel: 'oan', result: 'ngoan' },
        { initial: 't', vowel: 'uyêt', tone: 'nặng', result: 'tuyệt' }
      ],
      readingSyllables: ['ngoan', 'loát', 'thoăn', 'hoắt', 'loài', 'huệ', 'tuỳ', 'luận', 'luật', 'chuyển', 'duyệt'],
      words: [
        { word: 'ngoan ngoãn', highlightPart: 'oan', meaning: 'vâng lời lễ phép' },
        { word: 'tuyệt vời', highlightPart: 'uyêt', meaning: 'rất hay, rất đẹp' },
        { word: 'thoăn thoắt', highlightPart: 'oăt', meaning: 'chân tay nhanh nhẹn' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc đoạn văn & Kể chuyện: Cặp sừng và đôi chân',
      readingPassage: 'Mỗi lần về quê, Hà lại được bà kể cho nghe nhiều câu chuyện hay. Nào là truyền thuyết về Lạc Long Quân, truyền thuyết Thánh Gióng, truyền thuyết về hồ Hoàn Kiếm. Nào là sự tích cây quất, sự tích cây xoài,... Giọng kể của bà trầm ấm. Hà bị cuốn vào các câu chuyện suốt từ đầu cho đến cuối.',
      writingSamples: ['Xuân về, đào nở thắm, quất trĩu quả.'],
      story: {
        title: 'Cặp sừng và đôi chân',
        pictures: [
          { id: 1, question: 'Hươu cảm thấy thế nào về cặp sừng và đôi chân của mình?', content: 'Hươu tự hào về cặp sừng lộng lẫy nhưng lại chê đôi chân khẳng khiu xấu xí.' },
          { id: 2, question: 'Khi tha thẩn trong rừng, hươu gặp phải chuyện gì?', content: 'Một con sói hung dữ lao ra đuổi bắt hươu.' },
          { id: 3, question: 'Cặp sừng hay đôi chân giúp hươu thoát nạn?', content: 'Cặp sừng bị mắc vào cành cây, chính đôi chân nhanh nhẹn đã giúp hươu vùng chạy thoát thân.' },
          { id: 4, question: 'Thoát nạn, hươu nghĩ gì?', content: 'Hươu hiểu ra: Đôi chân tuy xấu xí nhưng đã cứu mạng mình, còn cặp sừng đẹp đẽ suýt nữa làm hại mình.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Bộ phận nào đã cứu hươu thoát khỏi nguy hiểm?',
        options: ['Đôi chân nhanh nhẹn', 'Cặp sừng lộng lẫy', 'Đôi tai thính', 'Cái đuôi ngắn'],
        correctIndex: 0,
        explanation: 'Đôi chân tuy gầy guộc nhưng chạy rất nhanh giúp hươu thoát khỏi nanh vuốt sói.'
      }
    ]
  },
  {
    id: 81,
    lessonNumber: 81,
    title: 'Ôn tập học kì 1 - Bài 81',
    type: 'review',
    pageRange: '174 - 175',
    part1_Letters: {
      title: 'Bảng ô chữ tìm loài vật',
      letters: ['Lạc đà', 'sói', 'rùa', 'nhím', 'vượn', 'lợn', 'chó', 'mèo', 'gấu', 'cá', 'hổ'],
      recognitionSentence: 'Ghép các chữ đứng liền nhau để tạo tên gọi các loài vật được minh họa.',
      recognitionKeywords: ['lạc đà', 'chó sói', 'con rùa', 'con nhím', 'vượn', 'heo lợn', 'chó con', 'mèo mướp', 'gấu đen', 'cá', 'hổ vằn']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc bài thơ Tết đang vào nhà',
      models: [
        { initial: 'p', vowel: 'ơi', result: 'phơi' }
      ],
      readingSyllables: ['phơi', 'hoa', 'sáng', 'sân', 'treo', 'nở'],
      words: [
        { word: 'phơi áo hoa', highlightPart: 'ơi', meaning: 'mẹ phơi áo hoa đón Tết' },
        { word: 'tranh gà', highlightPart: 'anh', meaning: 'tranh Đông Hồ dân gian' },
        { word: 'câu đối', highlightPart: 'ôi', meaning: 'câu đối đỏ ông đồ viết' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc thơ: Tết đang vào nhà (Nguyễn Hồng Kiên)',
      readingPassage: 'Tết đang vào nhà\nHoa đào trước ngõ\nCười tươi sáng hồng\nHoa mai trong vườn\nLung linh cánh trắng\n\nSân nhà đầy nắng\nMẹ phơi áo hoa\nEm dán tranh gà\nÔng treo câu đối\n\nTết đang vào nhà\nSắp thêm một tuổi\nĐất trời nở hoa.',
      writingSamples: ['Tết đang vào nhà\nSắp thêm một tuổi\nĐất trời nở hoa.'],
      speakingTopic: {
        title: 'Tết quê em',
        prompt: 'Kể về không khí rộn ràng đón Tết sum vầy cùng gia đình.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Trong bài thơ "Tết đang vào nhà", hoa mai trong vườn có màu gì?',
        options: ['Cánh trắng lung linh', 'Màu đỏ thắm', 'Màu vàng rực', 'Màu tím biếc'],
        correctIndex: 0,
        explanation: 'Khổ thơ 1: "Hoa mai trong vườn / Lung linh cánh trắng".'
      }
    ]
  },
  {
    id: 82,
    lessonNumber: 82,
    title: 'Ôn tập học kì 1 - Bài 82',
    type: 'review',
    pageRange: '176 - 177',
    part1_Letters: {
      title: 'Bông hoa số và từ chỉ số',
      letters: ['0 (không)', '1 (một)', '2 (hai)', '3 (ba)', '4 (bốn)', '5 (năm)', '6 (sáu)', '7 (bảy)', '8 (tám)', '9 (chín)'],
      recognitionSentence: 'Viết và đọc tên các số từ 0 đến 9, tìm từ cùng vần với từ chỉ số.',
      recognitionKeywords: ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
    },
    part2_SyllablesAndWords: {
      title: 'Luyện tập chính tả phân biệt âm',
      models: [
        { initial: 'c', vowel: 'á', result: 'cá' },
        { initial: 'k', vowel: 'ẻ', result: 'kẻ' }
      ],
      readingSyllables: ['cá - kẻ', 'gà - ghế', 'ngô - nghé'],
      words: [
        { word: 'ngày - nảy', highlightPart: 'ay', meaning: 'từ cùng vần với nhau' },
        { word: 'xanh', highlightPart: 'anh', meaning: 'màu xanh bầu trời' },
        { word: 'sáng', highlightPart: 'ang', meaning: 'ánh nắng tươi sáng' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc bài văn Mùa xuân đến (Theo Nguyễn Kiên)',
      readingPassage: 'Mùa xuân đến\nBầu trời ngày một thêm xanh. Nắng vàng ngày càng rực rỡ. Vườn cây lại đâm chồi nảy lộc. Rồi vườn cây ra hoa. Hoa bưởi nồng nàn. Hoa nhãn ngọt. Hoa cau thơm dịu. Vườn cây lại rộn rã tiếng chim. Những anh chích choè nhanh nhảu. Những chú khướu lắm điều. Những bác cu gáy trầm ngâm.',
      writingSamples: ['một - bột - hột - sốt - tốt'],
      speakingTopic: {
        title: 'Mùa xuân tươi đẹp',
        prompt: 'Nói về sự đổi thay kì diệu của đất trời, cây cối chim chóc khi mùa xuân về.'
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Trong bài "Mùa xuân đến", hoa bưởi có mùi thơm như thế nào?',
        options: ['Nồng nàn', 'Thơm dịu', 'Ngọt ngào', 'Thoang thoảng'],
        correctIndex: 0,
        explanation: 'Bài văn miêu tả: "Hoa bưởi nồng nàn. Hoa nhãn ngọt. Hoa cau thơm dịu".'
      }
    ]
  },
  {
    id: 83,
    lessonNumber: 83,
    title: 'Ôn tập và Đánh giá cuối học kì 1 - Bài 83',
    type: 'review',
    pageRange: '178 - 182',
    part1_Letters: {
      title: 'Đánh giá năng lực đọc và hiểu',
      letters: ['Đọc văn bản', 'Đọc thơ', 'Đọc hiểu', 'Chính tả'],
      recognitionSentence: 'Đọc trôi chảy các câu chuyện dân gian và bài thơ ca ngợi thiên nhiên quê hương.',
      recognitionKeywords: ['Voi, hổ và khỉ', 'Nắng xuân hồng', 'Hoa giấy', 'Đàn kiến']
    },
    part2_SyllablesAndWords: {
      title: 'Đọc chuyện dân gian: Voi, hổ và khỉ',
      models: [
        { initial: 'v', vowel: 'oi', result: 'voi' },
        { initial: 'kh', vowel: 'i', tone: 'hỏi', result: 'khỉ' }
      ],
      readingSyllables: ['mưu trí', 'sợ hãi', 'bỏ chạy', 'lễ phép', 'núi rừng', 'xanh biếc'],
      words: [
        { word: 'mưu trí', highlightPart: 'ưu', meaning: 'thông minh sáng dạ biết tìm cách vượt qua hiểm nguy' },
        { word: 'lễ phép', highlightPart: 'êp', meaning: 'kính cẩn, ngoan ngoãn đối với người lớn' }
      ]
    },
    part3_SentenceAndPractice: {
      title: 'Đọc bài thơ Nắng xuân hồng (Nguyễn Sự Giao)',
      readingPassage: 'Nắng xuân hồng\nQua rét lạnh mùa đông\nXuân lại ấm nắng hồng,\nNgàn cây vui hớn hở\nĐua hé nhụy khoe bông.\nChim gọi bầy xây tổ\nRộn rã dậy từng không,\nLúa non ngời lá biếc,\nNắng lung linh cầu vồng.\nTrên đường đi đến lớp\nHồn em vui mênh mông.',
      writingSamples: ['Làng tôi có luỹ tre xanh\nCó dòng sông nhỏ uốn quanh xóm làng.'],
      story: {
        title: 'Voi, hổ và khỉ (Truyện cổ dân gian Khơ-me)',
        pictures: [
          { id: 1, question: 'Vì sao voi phải nộp mạng cho hổ?', content: 'Do voi thua hổ trong một cuộc thi tài.' },
          { id: 2, question: 'Khỉ đã dùng mưu gì để cứu bạn voi?', content: 'Khỉ cưỡi voi đến điểm hẹn, quát lớn hỏi hổ đâu để ăn thịt hổ.' },
          { id: 3, question: 'Hổ thấy vậy thì thế nào?', content: 'Hổ thấy voi to lớn mà lại sợ khỉ nhỏ bé, tưởng khỉ rất ghê gớm nên hoảng sợ bỏ chạy thục mạng.' },
          { id: 4, question: 'Câu chuyện ca ngợi điều gì?', content: 'Ca ngợi sự thông minh, mưu trí và tinh thần tương thân tương ái giúp đỡ bạn bè.' }
        ]
      }
    },
    quiz: [
      {
        id: 'q1',
        question: 'Nhờ đâu mà khỉ đã cứu được voi thoát khỏi hổ dữ?',
        options: ['Nhờ sự thông minh, nhanh trí và dũng cảm', 'Nhờ khỉ đánh nhau thắng hổ', 'Nhờ có thợ săn giúp', 'Nhờ hổ tự bỏ đi'],
        correctIndex: 0,
        explanation: 'Khỉ đã dùng mưu trí đánh lừa làm hổ tưởng khỉ có sức mạnh thần kì khiến hổ sợ bỏ chạy.'
      }
    ]
  }
];
