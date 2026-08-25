import { TopicGroup, Volume2Lesson } from '../types';

export const TOPIC_GROUPS: TopicGroup[] = [
  {
    id: 1,
    title: 'Chủ điểm 1: Tôi và các bạn',
    description: 'Làm quen với trường lớp mới, bạn bè thân thương và xây dựng tình bạn đẹp.',
    icon: '👫',
    color: 'from-amber-400 to-orange-500',
    lessons: [
      {
        id: 201,
        lessonNumber: 1,
        topicId: 1,
        topicTitle: 'Tôi và các bạn',
        title: 'Bài 1: Tôi là học sinh lớp 1',
        pageRange: '4 - 7',
        warmup: {
          prompt: 'Từ khi đi học lớp 1, em thích và không thích những điều gì nhất?'
        },
        reading: {
          title: 'Tôi là học sinh lớp 1',
          author: 'Trung Sơn',
          type: 'article',
          content: [
            'Tôi tên là Nam, học sinh lớp 1A, Trường Tiểu học Lê Quý Đôn. Ngày đầu đi học, mặc bộ đồng phục của trường, tôi hãnh diện lắm.',
            'Hồi đầu năm học, tôi mới học chữ cái. Thế mà bây giờ, tôi đã đọc được truyện tranh. Tôi còn biết làm toán nữa. Tôi có thêm nhiều bạn mới.',
            'Ai cũng bảo từ khi đi học, tôi chững chạc hẳn lên.'
          ],
          vocabulary: [
            { word: 'đồng phục', meaning: 'trang phục cùng một kiểu dáng, màu sắc dành cho học sinh trong cùng trường' },
            { word: 'hãnh diện', meaning: 'tự hào và vui sướng về bản thân mình' },
            { word: 'chững chạc', meaning: 'ra dáng người lớn, tự tin và ngoan ngoãn' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Bạn Nam học lớp mấy, trường nào?',
            options: ['Lớp 1A, Trường Tiểu học Lê Quý Đôn', 'Lớp 1B, Trường Tiểu học Kim Đồng', 'Lớp 1C, Trường Tiểu học Lê Lợi'],
            correctOption: 0,
            sampleAnswer: 'Bạn Nam học lớp 1A, Trường Tiểu học Lê Quý Đôn.'
          },
          {
            id: 'c2',
            question: 'Hồi đầu năm học, Nam mới học gì và bây giờ Nam đã biết làm những gì?',
            sampleAnswer: 'Hồi đầu năm Nam mới học chữ cái, bây giờ Nam đã đọc được truyện tranh, biết làm toán và có thêm nhiều bạn mới.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'fill_letter',
            prompt: 'Chọn s hay x thay cho bông hoa: học ...inh, ...inh đẹp, ...ách vở',
            pairs: [
              { options: ['s', 'x'], textWithBlank: 'học ...inh', answer: 's' },
              { options: ['s', 'x'], textWithBlank: '...inh đẹp', answer: 'x' },
              { options: ['s', 'x'], textWithBlank: '...ách vở', answer: 's' }
            ]
          },
          dictationText: 'Nam đã đọc được truyện tranh. Nam còn biết làm toán nữa.',
          writingPrompt: 'Viết vào vở: Nam học lớp 1A, Trường Tiểu học Lê Quý Đôn.'
        }
      },
      {
        id: 202,
        lessonNumber: 2,
        topicId: 1,
        topicTitle: 'Tôi và các bạn',
        title: 'Bài 2: Đôi tai xấu xí',
        pageRange: '8 - 11',
        warmup: {
          prompt: 'Quan sát tranh lạc đà có bướu, tê giác có sừng, chuột túi có túi trước bụng và nói về điểm đặc biệt của mỗi con vật.'
        },
        reading: {
          title: 'Đôi tai xấu xí',
          author: 'Theo Kể chuyện cho bé mầm non',
          type: 'story',
          content: [
            'Thỏ có đôi tai dài và to. Bị bạn bè chê, thỏ buồn lắm. Thỏ bố động viên: "Rồi con sẽ thấy tai mình rất đẹp".',
            'Một lần, thỏ và các bạn đi chơi xa, quên khuấy đường về. Ai cũng hoảng sợ. Thỏ chợt dỏng tai: "Suỵt! Có tiếng bố tớ gọi". Cả nhóm đi theo hướng có tiếng gọi. Tất cả về được tới nhà. Các bạn tấm tắc khen tai thỏ thật tuyệt.',
            'Từ đó, thỏ không còn buồn vì đôi tai nữa.'
          ],
          vocabulary: [
            { word: 'động viên', meaning: 'dùng lời nói khích lệ giúp người khác vui vẻ, tự tin hơn' },
            { word: 'quên khuấy', meaning: 'hoàn toàn quên bẵng đi, không nhớ tới' },
            { word: 'suỵt', meaning: 'tiếng ra hiệu giữ im lặng để lắng nghe' },
            { word: 'tấm tắc', meaning: 'liên tục khen ngợi với lòng thán phục' }
          ],
          phonicsFocus: ['uây', 'oang', 'uyt']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vì sao lúc đầu thỏ con lại cảm thấy buồn bực về đôi tai của mình?',
            options: ['Vì bị bạn bè chê đôi tai vừa to vừa dài', 'Vì tai thỏ bị đau', 'Vì thỏ không nghe thấy tiếng gọi'],
            correctOption: 0,
            sampleAnswer: 'Thỏ buồn vì bị bạn bè chê tai dài và to.'
          },
          {
            id: 'c2',
            question: 'Nhờ đâu mà cả nhóm bạn tìm được đường về nhà an toàn?',
            sampleAnswer: 'Nhờ đôi tai thính nhạy của thỏ nghe thấy tiếng thỏ bố gọi từ xa.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'choose_sound',
            prompt: 'Chọn từ ngữ thích hợp: chạy nhanh, dỏng tai, thính tai',
            pairs: [
              { options: ['chạy nhanh', 'dỏng tai', 'thính tai'], textWithBlank: 'Chú mèo (...) nghe tiếng chít chít của lũ chuột.', answer: 'dỏng tai' }
            ]
          },
          dictationText: 'Các bạn cùng thỏ đi theo hướng có tiếng gọi. Cả nhóm về được nhà.'
        }
      },
      {
        id: 203,
        lessonNumber: 3,
        topicId: 1,
        topicTitle: 'Tôi và các bạn',
        title: 'Bài 3: Bạn của gió',
        pageRange: '12 - 14',
        warmup: {
          prompt: 'Nhờ đâu mà chong chóng quay, cánh diều bay cao và thuyền buồm lướt sóng?'
        },
        reading: {
          title: 'Bạn của gió',
          author: 'Ngân Hà',
          type: 'poem',
          content: [
            'Ai là bạn gió?',
            'Mà gió đi tìm',
            'Bay theo cánh chim',
            'Lùa trong tán lá...',
            'Gió nhớ bạn quá',
            'Nên gõ cửa hoài',
            'Đẩy sóng dâng cao',
            'Thổi căng buồm lớn.',
            'Khi gió đi vắng',
            'Lá buồn lặng im',
            'Vắng cả cánh chim',
            'Chẳng ai gõ cửa.',
            'Sóng ngủ trong nước',
            'Buồm chẳng ra khơi',
            'Ai gọi: Gió ơi',
            'Trong vòm lá biếc.'
          ],
          vocabulary: [
            { word: 'lùa', meaning: 'len lỏi luồn qua khe lá, cửa sổ' },
            { word: 'hoài', meaning: 'liên tục không ngừng' },
            { word: 'vòm lá', meaning: 'tán lá cây um tùm cong tròn như cái vòm' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Ở khổ thơ thứ nhất, gió đã làm gì để đi tìm bạn?',
            sampleAnswer: 'Gió bay theo cánh chim và lùa trong tán lá để tìm bạn.'
          },
          {
            id: 'c2',
            question: 'Khi gió đi vắng, cảnh vật trở nên như thế nào?',
            sampleAnswer: 'Lá buồn lặng im, vắng cánh chim, sóng ngủ trong nước, buồm chẳng ra khơi.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần trong bài thơ: vắng - chẳng, biếc - tiếc'
          }
        }
      },
      {
        id: 204,
        lessonNumber: 4,
        topicId: 1,
        topicTitle: 'Tôi và các bạn',
        title: 'Bài 4: Giải thưởng tình bạn',
        pageRange: '14 - 17',
        warmup: {
          prompt: 'Quan sát tranh nai và hoẵng cùng nhau chạy đua trên bãi cỏ hoa.'
        },
        reading: {
          title: 'Giải thưởng tình bạn',
          author: 'Lâm Anh',
          type: 'story',
          content: [
            'Nai và hoẵng tham dự một cuộc chạy đua. Trước vạch xuất phát, nai và hoẵng xoạc chân lấy đà. Sau khi trọng tài ra hiệu, hai bạn lao như tên bắn. Cả hai luôn ở vị trí dẫn đầu. Bỗng nhiên, hoẵng vấp phải một hòn đá rồi ngã oạch. Nai vội dừng lại, đỡ hoẵng đứng dậy.',
            'Nai và hoẵng về đích cuối cùng. Nhưng cả hai đều được tặng giải thưởng tình bạn.'
          ],
          vocabulary: [
            { word: 'vạch xuất phát', meaning: 'đường kẻ báo hiệu điểm bắt đầu cuộc đua' },
            { word: 'lấy đà', meaning: 'tạo tư thế chuẩn bị dồn lực bật chạy nhanh' },
            { word: 'ngã oạch', meaning: 'ngã bất ngờ phát ra tiếng mạnh' }
          ],
          phonicsFocus: ['oăng', 'oac', 'oach']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Khi thấy bạn hoẵng bị ngã, nai đã làm gì?',
            sampleAnswer: 'Nai vội dừng lại đỡ hoẵng đứng dậy dù cuộc đua đang diễn ra.'
          },
          {
            id: 'c2',
            question: 'Vì sao về đích cuối cùng nhưng nai và hoẵng vẫn được tặng giải thưởng?',
            sampleAnswer: 'Vì hai bạn đã thể hiện tinh thần đoàn kết và tình bạn cao đẹp.'
          }
        ],
        practice: {
          dictationText: 'Nai và hoẵng về đích cuối cùng. Nhưng cả hai đều được tặng giải thưởng.'
        }
      },
      {
        id: 205,
        lessonNumber: 5,
        topicId: 1,
        topicTitle: 'Tôi và các bạn',
        title: 'Bài 5: Sinh nhật của voi con',
        pageRange: '18 - 21',
        warmup: {
          prompt: 'Kể tên các con vật: thỏ trắng, sóc nâu, khỉ vàng, vẹt mỏ khoằm, gấu đen.'
        },
        reading: {
          title: 'Sinh nhật của voi con',
          author: 'Lâm Anh',
          type: 'story',
          content: [
            'Hôm nay là sinh nhật của voi con, nhưng nó bị ốm. Đang buồn bã, bỗng voi con nghe tiếng gọi. Thì ra các bạn đến chúc mừng sinh nhật voi. Thỏ trắng mang cà rốt. Gấu đen ngoạm nguyên một nải chuối. Khỉ vàng và sóc nâu tặng voi tiết mục "ngúc ngoắc đuôi". Vẹt mỏ khoằm thay mặt các bạn nói những lời chúc tốt đẹp.',
            'Voi con vui ơi là vui. Nó huơ vòi mấy vòng để cảm ơn các bạn.'
          ],
          vocabulary: [
            { word: 'ngoạm', meaning: 'há to miệng cắn giữ trọn vẹn thức ăn' },
            { word: 'ngúc ngoắc', meaning: 'cử động lắc lư qua lại nhịp nhàng' },
            { word: 'huơ vòi', meaning: 'voi nâng cao chiếc vòi dài vẫy chào vui mừng' }
          ],
          phonicsFocus: ['oam', 'oăc', 'oăm', 'uơ']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Những người bạn nào đã đến chúc mừng sinh nhật voi con?',
            sampleAnswer: 'Thỏ trắng, gấu đen, khỉ vàng, sóc nâu và vẹt mỏ khoằm.'
          },
          {
            id: 'c2',
            question: 'Voi con đã làm gì để cảm ơn các bạn?',
            sampleAnswer: 'Voi con huơ vòi mấy vòng để bày tỏ lời cảm ơn sâu sắc.'
          }
        ],
        practice: {
          dictationText: 'Các bạn chúc mừng sinh nhật voi con. Nó huơ vòi cảm ơn các bạn.'
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Chủ điểm 2: Mái ấm gia đình',
    description: 'Tình cảm thương yêu, gắn bó giữa ông bà, cha mẹ và anh chị em trong gia đình.',
    icon: '🏡',
    color: 'from-rose-400 to-red-500',
    lessons: [
      {
        id: 206,
        lessonNumber: 1,
        topicId: 2,
        topicTitle: 'Mái ấm gia đình',
        title: 'Bài 1: Nụ hôn trên bàn tay',
        pageRange: '24 - 27',
        warmup: {
          prompt: 'Quan sát tranh mẹ dắt tay bé đến trường trong ngày đầu tiên đi học.'
        },
        reading: {
          title: 'Nụ hôn trên bàn tay',
          author: 'Theo Au-đrây Pen (Đỗ Nhật Nam dịch)',
          type: 'story',
          content: [
            'Ngày đầu đi học, Nam hồi hộp lắm. Mẹ nhẹ nhàng đặt một nụ hôn vào bàn tay Nam và dặn:',
            '– Mỗi khi lo lắng, con hãy áp bàn tay này lên má. Mẹ lúc nào cũng ở bên con.',
            'Nam cảm thấy thật ấm áp. Cậu im lặng rồi đột nhiên mỉm cười:',
            '– Mẹ đưa tay cho con nào!',
            'Nam đặt một nụ hôn vào bàn tay mẹ rồi thủ thỉ:',
            '– Bây giờ thì mẹ cũng có nụ hôn trên bàn tay rồi. Con yêu mẹ!',
            'Nam chào mẹ và tung tăng bước vào lớp.'
          ],
          vocabulary: [
            { word: 'hồi hộp', meaning: 'tâm trạng lo lắng xen lẫn mong đợi, tim đập rộn ràng' },
            { word: 'thủ thỉ', meaning: 'nói nhỏ nhẹ, tình cảm và thì thầm âu yếm' },
            { word: 'tung tăng', meaning: 'bước đi nhảy chân sáo vui vẻ thảnh thơi' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Mẹ đã dặn Nam làm gì mỗi khi cảm thấy lo lắng?',
            sampleAnswer: 'Mẹ dặn áp bàn tay có nụ hôn của mẹ lên má để luôn nhớ mẹ ở bên.'
          },
          {
            id: 'c2',
            question: 'Sau đó, Nam đã làm gì với bàn tay của mẹ?',
            sampleAnswer: 'Nam cũng đặt một nụ hôn yêu thương vào bàn tay mẹ.'
          }
        ],
        practice: {
          dictationText: 'Mẹ nhẹ nhàng đặt nụ hôn vào bàn tay Nam. Nam thấy thật ấm áp.'
        }
      },
      {
        id: 207,
        lessonNumber: 2,
        topicId: 2,
        topicTitle: 'Mái ấm gia đình',
        title: 'Bài 2: Làm anh',
        pageRange: '28 - 30',
        warmup: {
          prompt: 'Em nhường nhịn và chơi cùng em nhỏ trong gia đình như thế nào?'
        },
        reading: {
          title: 'Làm anh',
          author: 'Phan Thị Thanh Nhàn',
          type: 'poem',
          content: [
            'Làm anh khó đấy',
            'Phải đâu chuyện đùa',
            'Với em gái bé',
            'Phải "người lớn" cơ.',
            'Khi em bé khóc',
            'Anh phải dỗ dành',
            'Nếu em bé ngã',
            'Anh nâng dịu dàng.',
            'Mẹ cho quà bánh',
            'Chia em phần hơn',
            'Có đồ chơi đẹp',
            'Cũng nhường em luôn.',
            'Làm anh thật khó',
            'Nhưng mà thật vui',
            'Ai yêu em bé',
            'Thì làm được thôi.'
          ],
          vocabulary: [
            { word: 'dỗ dành', meaning: 'dùng lời lẽ cử chỉ dịu dàng an ủi cho em nín khóc' },
            { word: 'dịu dàng', meaning: 'nhẹ nhàng, êm ái đầy tình thương' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Làm anh thì cần làm những gì cho em nhỏ?',
            sampleAnswer: 'Dỗ dành khi em khóc, nâng dịu dàng khi em ngã, chia quà phần hơn và nhường đồ chơi đẹp cho em.'
          },
          {
            id: 'c2',
            question: 'Theo em, làm anh dễ hay khó? Vì sao?',
            sampleAnswer: 'Làm anh tuy khó nhưng rất vui vì ai yêu em bé thì đều làm được.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần với: bánh (gánh), đẹp (kẹp), vui (núi)'
          }
        }
      },
      {
        id: 208,
        lessonNumber: 3,
        topicId: 2,
        topicTitle: 'Mái ấm gia đình',
        title: 'Bài 3: Cả nhà đi chơi núi',
        pageRange: '30 - 34',
        warmup: {
          prompt: 'Kể về chuyến dã ngoại, du lịch vui vẻ của gia đình em.'
        },
        reading: {
          title: 'Cả nhà đi chơi núi',
          author: 'Lâm Anh',
          type: 'story',
          content: [
            'Bố mẹ cho Nam và Đức đi chơi núi. Hôm trước, mẹ thức khuya để chuẩn bị quần áo, thức ăn, nước uống và cả tuýp thuốc chống côn trùng.',
            'Hôm sau, khi mặt trời lên, cả nhà đã tới chân núi. Nam và Đức thích thú, đuổi nhau huỳnh huỵch. Càng lên cao, đường càng dốc và khúc khuỷu, bố phải cõng Đức. Thỉnh thoảng, mẹ lau mồ hôi cho hai anh em.',
            'Lúc lên đến đỉnh núi, hai anh em vui sướng hét vang.'
          ],
          vocabulary: [
            { word: 'tuýp thuốc', meaning: 'ống thuốc bôi mềm nhỏ gọn' },
            { word: 'huỳnh huỵch', meaning: 'tiếng bước chân chạy rậm rịch, dồn dập' },
            { word: 'khúc khuỷu', meaning: 'đường đi gấp khúc, quanh co uốn lượn nhiều đoạn hiểm trở' }
          ],
          phonicsFocus: ['uya', 'uyp', 'uynh', 'uych', 'uyu']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Mẹ đã chuẩn bị những gì cho chuyến đi leo núi?',
            sampleAnswer: 'Mẹ chuẩn bị quần áo, thức ăn, nước uống và tuýp thuốc chống côn trùng.'
          },
          {
            id: 'c2',
            question: 'Đến đoạn đường dốc và khúc khuỷu, bố đã làm gì?',
            sampleAnswer: 'Bố đã cõng bé Đức lên lưng.'
          }
        ],
        practice: {
          dictationText: 'Nam và Đức được đi chơi núi. Đến đỉnh núi, hai anh em vui sướng hét vang.'
        }
      },
      {
        id: 209,
        lessonNumber: 4,
        topicId: 2,
        topicTitle: 'Mái ấm gia đình',
        title: 'Bài 4: Quạt cho bà ngủ',
        pageRange: '34 - 36',
        warmup: {
          prompt: 'Khi người thân trong gia đình bị ốm, em thường làm những việc gì để chăm sóc?'
        },
        reading: {
          title: 'Quạt cho bà ngủ',
          author: 'Thạch Quỳ',
          type: 'poem',
          content: [
            'Ơi chích choè ơi!',
            'Chim đừng hót nữa,',
            'Bà em ốm rồi,',
            'Lặng cho bà ngủ.',
            'Bàn tay bé nhỏ',
            'Vẫy quạt thật đều',
            'Ngấn nắng thiu thiu',
            'Đậu trên tường trắng.',
            'Căn nhà đã vắng',
            'Cốc chén lặng im',
            'Đôi mắt lim dim',
            'Ngủ ngon bà nhé.',
            'Hoa cam, hoa khế',
            'Chín lặng trong vườn,',
            'Bà mơ tay cháu',
            'Quạt đầy hương thơm.'
          ],
          vocabulary: [
            { word: 'ngấn nắng', meaning: 'vệt ánh nắng chiếu hắt qua ô cửa sổ' },
            { word: 'thiu thiu', meaning: 'trạng thái chập chờn bắt đầu vào giấc ngủ' },
            { word: 'lim dim', meaning: 'mắt khép hờ nhẹ nhàng' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vì sao bạn nhỏ lại nhắn chim chích choè đừng cất tiếng hót?',
            sampleAnswer: 'Vì bà của bạn đang bị ốm, cần không gian yên tĩnh để ngủ ngon.'
          },
          {
            id: 'c2',
            question: 'Bàn tay bạn nhỏ đã làm gì để giúp bà ngủ ngon giấc?',
            sampleAnswer: 'Bàn tay nhỏ nhắn vẫy quạt thật đều mang làn gió mát lành ru bà ngủ.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: trắng - nắng, vườn - sườn, thơm - rơm'
          }
        }
      },
      {
        id: 210,
        lessonNumber: 5,
        topicId: 2,
        topicTitle: 'Mái ấm gia đình',
        title: 'Bài 5: Bữa cơm gia đình',
        pageRange: '36 - 39',
        warmup: {
          prompt: 'Quan sát tranh cả gia đình sum họp quây quần bên mâm cơm ấm cúng.'
        },
        reading: {
          title: 'Bữa cơm gia đình',
          author: 'Châu Anh',
          type: 'story',
          content: [
            'Thấy mẹ đi chợ về, Chi hỏi:',
            '– Sao mẹ mua nhiều đồ ăn thế ạ?',
            '– Đố con hôm nay là ngày gì?',
            'Chi chạy lại xem lịch:',
            '– A, ngày 28 tháng 6, Ngày Gia đình Việt Nam.',
            '– Đúng rồi. Vì thế, hôm nay nhà mình liên hoan con ạ.',
            'Chi vui lắm. Em nhặt rau giúp mẹ. Bố dọn nhà, rửa xoong nồi, cốc chén. Ông bà trông em bé để mẹ nấu ăn. Cả nhà quây quần bên nhau. Bữa cơm thật tuyệt. Chi thích ngày nào cũng là Ngày Gia đình Việt Nam.'
          ],
          vocabulary: [
            { word: 'xoong', meaning: 'dụng cụ nấu nướng bằng kim loại có quai cầm' },
            { word: 'liên hoan', meaning: 'buổi tiệc ăn uống vui vẻ kỷ niệm ngày đặc biệt' },
            { word: 'quây quần', meaning: 'tụ họp vui vẻ, sum họp đông đủ bên nhau' }
          ],
          phonicsFocus: ['oong']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Ngày Gia đình Việt Nam là ngày nào trong năm?',
            options: ['Ngày 28 tháng 6', 'Ngày 1 tháng 6', 'Ngày 20 tháng 11'],
            correctOption: 0,
            sampleAnswer: 'Ngày Gia đình Việt Nam là ngày 28 tháng 6 hằng năm.'
          },
          {
            id: 'c2',
            question: 'Vào ngày này, các thành viên trong gia đình bạn Chi đã cùng nhau làm gì?',
            sampleAnswer: 'Chi nhặt rau, bố dọn dẹp và rửa xoong nồi, ông bà trông em bé để mẹ nấu món ngon liên hoan.'
          }
        ],
        practice: {
          dictationText: 'Ngày nghỉ lễ, gia đình Chi quây quần bên nhau. Chi thích ngày nào cũng vậy.'
        }
      },
      {
        id: 211,
        lessonNumber: 6,
        topicId: 2,
        topicTitle: 'Mái ấm gia đình',
        title: 'Bài 6: Ngôi nhà',
        pageRange: '40 - 43',
        warmup: {
          prompt: 'Giải câu đố: "Cái gì để tránh nắng mưa / Đêm được an giấc, từ xưa vẫn cần?" (Là ngôi nhà).'
        },
        reading: {
          title: 'Ngôi nhà',
          author: 'Tô Hà',
          type: 'poem',
          content: [
            'Em yêu nhà em',
            'Hàng xoan trước ngõ',
            'Hoa xao xuyến nở',
            'Như mây từng chùm.',
            'Em yêu tiếng chim',
            'Đầu hồi lảnh lót',
            'Mái vàng thơm phức',
            'Rạ đầy sân phơi.',
            'Em yêu ngôi nhà',
            'Gỗ, tre mộc mạc',
            'Như yêu đất nước',
            'Bốn mùa chim ca.'
          ],
          vocabulary: [
            { word: 'xao xuyến', meaning: 'trạng thái rung động êm ái, bồi hồi' },
            { word: 'lảnh lót', meaning: 'tiếng chim hót trong trẻo, cao vút ngân vang' },
            { word: 'mộc mạc', meaning: 'giản dị, tự nhiên, chân chất' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Trước ngõ nhà bạn nhỏ trồng loài cây gì nở hoa như mây từng chùm?',
            sampleAnswer: 'Hàng cây xoan trước ngõ hoa xao xuyến nở từng chùm.'
          },
          {
            id: 'c2',
            question: 'Tình cảm của bạn nhỏ đối với ngôi nhà thân thương được so sánh với điều gì?',
            sampleAnswer: 'Yêu ngôi nhà như yêu quê hương đất nước bốn mùa chim ca.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm từ chỉ người thân trong gia đình: ông nội, bà nội, bố, mẹ, anh trai, chị gái, em gái, ông ngoại, bà ngoại'
          }
        }
      }
    ]
  },
  {
    id: 3,
    title: 'Chủ điểm 3: Mái trường mến yêu',
    description: 'Thầy cô, bạn bè, lớp học và những kỉ niệm tươi đẹp dưới mái trường thân yêu.',
    icon: '🏫',
    color: 'from-sky-400 to-blue-600',
    lessons: [
      {
        id: 212,
        lessonNumber: 1,
        topicId: 3,
        topicTitle: 'Mái trường mến yêu',
        title: 'Bài 1: Tôi đi học',
        pageRange: '44 - 47',
        warmup: {
          prompt: 'Kể về kỉ niệm đáng nhớ nhất trong ngày khai giảng đầu tiên của em.'
        },
        reading: {
          title: 'Tôi đi học',
          author: 'Theo Thanh Tịnh',
          type: 'article',
          content: [
            'Một buổi mai, mẹ âu yếm nắm tay tôi dẫn đi trên con đường làng dài và hẹp. Con đường này tôi đã đi lại nhiều lần, nhưng lần này tự nhiên thấy lạ. Cảnh vật xung quanh tôi đều thay đổi. Hôm nay tôi đi học.',
            'Cũng như tôi, mấy cậu học trò mới bỡ ngỡ đứng nép bên người thân. Thầy giáo trẻ, gương mặt hiền từ, đón chúng tôi vào lớp. Tôi nhìn bàn ghế chỗ tôi ngồi rồi nhận là vật riêng của mình. Tôi nhìn bạn ngồi bên, người bạn chưa quen biết, nhưng không thấy xa lạ chút nào.'
          ],
          vocabulary: [
            { word: 'buổi mai', meaning: 'buổi sớm mai tươi đẹp' },
            { word: 'âu yếm', meaning: 'cử chỉ yêu thương, chăm sóc dịu dàng' },
            { word: 'bỡ ngỡ', meaning: 'ngơ ngác, lạ lẫm trước môi trường hoàn toàn mới' }
          ],
          phonicsFocus: ['yêm']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vì sao con đường làng quen thuộc hôm nay lại trở nên lạ lẫm với bạn nhỏ?',
            sampleAnswer: 'Vì hôm nay là ngày đầu tiên bạn nhỏ được mẹ đưa đến trường đi học.'
          },
          {
            id: 'c2',
            question: 'Thầy giáo đón các bạn học sinh mới với nét mặt thế nào?',
            sampleAnswer: 'Thầy giáo trẻ với gương mặt hiền từ, tươi cười chào đón các bạn.'
          }
        ],
        practice: {
          dictationText: 'Mẹ dẫn tôi đi trên con đường làng dài và hẹp. Con đường tôi đã đi lại nhiều mà sao thấy lạ.'
        }
      },
      {
        id: 213,
        lessonNumber: 2,
        topicId: 3,
        topicTitle: 'Mái trường mến yêu',
        title: 'Bài 2: Đi học',
        pageRange: '48 - 50',
        warmup: {
          prompt: 'Nói về cảm xúc vui vẻ, rộn ràng của em sau mỗi ngày đến trường học tập.'
        },
        reading: {
          title: 'Đi học',
          author: 'Hoàng Minh Chính',
          type: 'poem',
          content: [
            'Hôm qua em tới trường',
            'Mẹ dắt tay từng bước',
            'Hôm nay mẹ lên nương',
            'Một mình em tới lớp.',
            'Trường của em be bé',
            'Nằm lặng giữa rừng cây',
            'Cô giáo em tre trẻ',
            'Dạy em hát rất hay.',
            'Hương rừng thơm đồi vắng',
            'Nước suối trong thầm thì...',
            'Cọ xoè ô che nắng',
            'Râm mát đường em đi.'
          ],
          vocabulary: [
            { word: 'nương', meaning: 'đất canh tác trồng lúa ngô trên đồi núi' },
            { word: 'thầm thì', meaning: 'tiếng suối chảy róc rách êm dịu' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vì sao hôm nay bạn nhỏ đi học một mình tới lớp?',
            sampleAnswer: 'Vì mẹ bạn bận đi làm việc trên nương.'
          },
          {
            id: 'c2',
            question: 'Cây cọ bên đường đi học có tác dụng gì?',
            sampleAnswer: 'Lá cọ xoè rộng như chiếc ô xanh che nắng, làm râm mát suốt con đường em đi.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần ở cuối dòng thơ: trường - nương, bé - trẻ'
          }
        }
      },
      {
        id: 214,
        lessonNumber: 3,
        topicId: 3,
        topicTitle: 'Mái trường mến yêu',
        title: 'Bài 3: Hoa yêu thương',
        pageRange: '50 - 53',
        warmup: {
          prompt: 'Kể về bức tranh vẽ thầy cô hoặc góc sáng tạo trong lớp học của em.'
        },
        reading: {
          title: 'Hoa yêu thương',
          author: 'Phạm Thuỷ',
          type: 'story',
          content: [
            'Hôm nay cô giáo cho lớp vẽ những gì yêu thích. Tuệ An hí hoáy vẽ siêu nhân áo đỏ, thắt lưng vàng. Gia Huy say sưa vẽ mèo máy, tỉ mỉ tô cái ria cong cong.',
            'Cuối giờ, chúng tôi mang tranh đính lên bảng. Mọi ánh mắt đều hướng về bức tranh bông hoa bốn cánh của Hà. Trên mỗi cánh hoa ghi tên một tổ trong lớp. Giữa nhuỵ hoa là cô giáo cười rất tươi. Bên dưới có dòng chữ nắn nót "Hoa yêu thương". Ai cũng thấy có mình trong tranh. Chúng tôi treo bức tranh ở góc sáng tạo của lớp.'
          ],
          vocabulary: [
            { word: 'hí hoáy', meaning: 'chăm chú, cặm cụi vẽ hoặc làm việc liên tục' },
            { word: 'tỉ mỉ', meaning: 'cẩn thận, trau chuốt từng chi tiết nhỏ' },
            { word: 'sáng tạo', meaning: 'tạo ra những tác phẩm mới mẻ, độc đáo' }
          ],
          phonicsFocus: ['oay']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Bức tranh bông hoa bốn cánh của bạn Hà có tên là gì?',
            sampleAnswer: 'Bức tranh có tên là "Hoa yêu thương".'
          },
          {
            id: 'c2',
            question: 'Vì sao cả lớp đều yêu thích bức tranh của Hà?',
            sampleAnswer: 'Vì trên các cánh hoa có tên của tất cả các tổ và ở giữa là cô giáo kính yêu, ai cũng thấy có mình trong đó.'
          }
        ],
        practice: {
          dictationText: 'Các bạn đều thích bức tranh bông hoa bốn cánh. Bức tranh được treo ở góc sáng tạo của lớp.'
        }
      },
      {
        id: 215,
        lessonNumber: 4,
        topicId: 3,
        topicTitle: 'Mái trường mến yêu',
        title: 'Bài 4: Cây bàng và lớp học',
        pageRange: '54 - 56',
        warmup: {
          prompt: 'Quan sát cây bàng trên sân trường qua bốn mùa thay lá.'
        },
        reading: {
          title: 'Cây bàng và lớp học',
          author: 'Minh Tâm',
          type: 'poem',
          content: [
            'Bên cửa lớp học',
            'Có cây bàng già',
            'Tán lá xoè ra',
            'Như ô xanh mướt.',
            'Bàng ghé cửa lớp',
            'Nghe cô giảng bài',
            'Mỗi buổi sớm mai',
            'Quên ngày mưa nắng.',
            'Cuối tuần, lớp vắng',
            'Không thấy tiếng cô',
            'Không bạn vui đùa',
            'Tán bàng ngơ ngác.',
            'Thứ hai trở lại',
            'Lớp học tưng bừng',
            'Tán xanh vui mừng',
            'Vẫy chào các bạn.'
          ],
          vocabulary: [
            { word: 'xanh mướt', meaning: 'màu xanh tươi non, mỡ màng tràn đầy sức sống' },
            { word: 'tưng bừng', meaning: 'rộn rã, nhộn nhịp vui tươi' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Cây bàng ghé bên cửa lớp học để làm gì?',
            sampleAnswer: 'Cây bàng ghé cửa lớp để lắng nghe cô giáo giảng bài mỗi sớm mai.'
          },
          {
            id: 'c2',
            question: 'Khi thứ Hai các bạn học sinh đi học trở lại, cây bàng có hành động gì?',
            sampleAnswer: 'Tán lá xanh bàng vui mừng rung rinh vẫy chào các bạn.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: già - ra, bài - mai, bừng - mừng'
          }
        }
      },
      {
        id: 216,
        lessonNumber: 5,
        topicId: 3,
        topicTitle: 'Mái trường mến yêu',
        title: 'Bài 5: Bác trống trường',
        pageRange: '56 - 60',
        warmup: {
          prompt: 'Tiếng trống trường dùng để báo hiệu điều gì trong ngày học?'
        },
        reading: {
          title: 'Bác trống trường',
          author: 'Huy Bình',
          type: 'story',
          content: [
            'Tôi là trống trường. Thân hình tôi đẫy đà, nước da nâu bóng. Học trò thường gọi tôi là bác trống. Có lẽ vì các bạn thấy tôi ở trường lâu lắm rồi. Chính tôi cũng không biết mình đến đây từ bao giờ.',
            'Hằng ngày, tôi giúp học trò ra vào lớp đúng giờ. Ngày khai trường, tiếng của tôi dõng dạc "tùng... tùng... tùng...", báo hiệu một năm học mới.',
            'Bây giờ có thêm anh chuông điện, thỉnh thoảng cũng "reng... reng..." báo giờ học. Nhưng tôi vẫn là người bạn thân thiết của các cô cậu học trò.'
          ],
          vocabulary: [
            { word: 'đẫy đà', meaning: 'thân hình tròn trĩnh, mập mạp và đầy đặn' },
            { word: 'báo hiệu', meaning: 'phát tín hiệu cho mọi người biết trước' }
          ],
          phonicsFocus: ['eng']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Trống trường có vẻ ngoài như thế nào?',
            sampleAnswer: 'Trống trường có thân hình đẫy đà, nước da nâu bóng.'
          },
          {
            id: 'c2',
            question: 'Vào ngày khai giảng, tiếng trống phát ra âm thanh như thế nào?',
            sampleAnswer: 'Tiếng trống vang dõng dạc "tùng... tùng... tùng..." báo hiệu năm học mới.'
          }
        ],
        practice: {
          dictationText: 'Thỉnh thoảng có chuông điện báo giờ học. Nhưng trống trường vẫn là người bạn gần gũi của học sinh.'
        }
      },
      {
        id: 217,
        lessonNumber: 6,
        topicId: 3,
        topicTitle: 'Mái trường mến yêu',
        title: 'Bài 6: Giờ ra chơi',
        pageRange: '60 - 64',
        warmup: {
          prompt: 'Trong giờ ra chơi, em và các bạn thường chơi những trò chơi gì vui nhộn?'
        },
        reading: {
          title: 'Giờ ra chơi',
          author: 'Nguyễn Lãm Thắng',
          type: 'poem',
          content: [
            'Trống báo giờ ra chơi',
            'Từng đàn chim áo trắng',
            'Xếp sách vở mau thôi',
            'Ùa ra ngoài sân nắng.',
            'Chỗ này đây, bạn gái',
            'Vui nhảy dây nhịp nhàng',
            'Vòng quay đều êm ái',
            'Rộn tiếng cười hoà vang.',
            'Đằng kia, ấy bạn trai',
            'Đá cầu bay vun vút',
            'Đôi chân móc rất tài',
            'Tung nắng hồng lên ngực.',
            'Giờ chơi vừa chấm dứt',
            'Đàn chim non vội vàng',
            'Xếp hàng nhanh vào lớp',
            'Bài học mới sang trang.'
          ],
          vocabulary: [
            { word: 'nhịp nhàng', meaning: 'cử động ăn khớp, đều đặn theo nhịp' },
            { word: 'vun vút', meaning: 'chuyển động rất nhanh trong không gian' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Những trò chơi nào được nhắc tới trong bài thơ?',
            sampleAnswer: 'Trò chơi nhảy dây của các bạn gái và trò chơi đá cầu của các bạn trai.'
          },
          {
            id: 'c2',
            question: 'Khi hết giờ ra chơi, các bạn nhỏ đã làm gì?',
            sampleAnswer: 'Các bạn nhanh chóng xếp hàng ngay ngắn để bước vào lớp học bài mới.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: trắng - nắng, nhàng - vang, vút - ngực'
          }
        }
      }
    ]
  },
  {
    id: 4,
    title: 'Chủ điểm 4: Điều em cần biết',
    description: 'Những thói quen vệ sinh, kĩ năng an toàn và phép lịch sự cần thiết hàng ngày.',
    icon: '💡',
    color: 'from-emerald-400 to-teal-600',
    lessons: [
      {
        id: 218,
        lessonNumber: 1,
        topicId: 4,
        topicTitle: 'Điều em cần biết',
        title: 'Bài 1: Rửa tay trước khi ăn',
        pageRange: '64 - 67',
        warmup: {
          prompt: 'Vì sao chúng ta phải rửa tay sạch bằng xà phòng trước khi ăn cơm?'
        },
        reading: {
          title: 'Rửa tay trước khi ăn',
          author: 'Nguyên Vũ',
          type: 'article',
          content: [
            'Vi trùng có ở khắp nơi. Nhưng chúng ta không nhìn thấy được bằng mắt thường. Khi tay tiếp xúc với đồ vật, vi trùng dính vào tay.',
            'Tay cầm thức ăn, vi trùng từ tay theo thức ăn đi vào cơ thể. Do đó, chúng ta có thể mắc bệnh.',
            'Để phòng bệnh, chúng ta phải rửa tay trước khi ăn. Cần rửa tay bằng xà phòng với nước sạch.'
          ],
          vocabulary: [
            { word: 'vi trùng', meaning: 'sinh vật siêu nhỏ gây ra các mầm bệnh' },
            { word: 'tiếp xúc', meaning: 'chạm vào, đụng vào các đồ vật xung quanh' },
            { word: 'phòng bệnh', meaning: 'giữ gìn vệ sinh để bảo vệ sức khỏe, ngăn ngừa ốm đau' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vi trùng đi vào cơ thể con người bằng cách nào?',
            sampleAnswer: 'Khi tay bẩn dính vi trùng cầm thức ăn đưa vào miệng.'
          },
          {
            id: 'c2',
            question: 'Để phòng bệnh, chúng ta cần rửa tay như thế nào cho đúng cách?',
            sampleAnswer: 'Rửa tay bằng xà phòng dưới vòi nước sạch trước khi ăn và sau khi đi vệ sinh.'
          }
        ],
        practice: {
          dictationText: 'Để phòng bệnh, chúng ta phải rửa tay trước khi ăn. Cần rửa tay bằng xà phòng với nước sạch.'
        }
      },
      {
        id: 219,
        lessonNumber: 2,
        topicId: 4,
        topicTitle: 'Điều em cần biết',
        title: 'Bài 2: Lời chào',
        pageRange: '68 - 70',
        warmup: {
          prompt: 'Em thường chào những ai và chào như thế nào khi gặp mọi người?'
        },
        reading: {
          title: 'Lời chào',
          author: 'Nguyễn Hoàng Sơn',
          type: 'poem',
          content: [
            'Đi đến nơi nào',
            'Lời chào đi trước',
            'Lời chào dẫn bước',
            'Chẳng sợ lạc nhà',
            'Lời chào kết bạn',
            'Con đường bớt xa',
            'Lời chào là hoa',
            'Nở từ lòng tốt',
            'Là cơn gió mát',
            'Buổi sáng đầu ngày',
            'Như một bàn tay',
            'Chân thành cởi mở',
            'Ai ai cũng có',
            'Chẳng nặng là bao',
            'Bạn ơi đi đâu',
            'Nhớ mang đi nhé.'
          ],
          vocabulary: [
            { word: 'chân thành', meaning: 'thật lòng, xuất phát từ đáy lòng' },
            { word: 'cởi mở', meaning: 'vui vẻ, thân thiện hòa đồng với mọi người' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Trong bài thơ, lời chào được so sánh với những hình ảnh đẹp nào?',
            sampleAnswer: 'Lời chào là bông hoa nở từ lòng tốt, là cơn gió mát buổi sớm và như một bàn tay ấm áp.'
          },
          {
            id: 'c2',
            question: 'Lời khuyên của tác giả dành cho các bạn nhỏ là gì?',
            sampleAnswer: 'Dù đi bất cứ đâu cũng luôn nhớ mang theo lời chào thân ái, lịch sự.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: trước - bước, nhà - xa, ngày - tay'
          }
        }
      },
      {
        id: 220,
        lessonNumber: 3,
        topicId: 4,
        topicTitle: 'Điều em cần biết',
        title: 'Bài 3: Khi mẹ vắng nhà',
        pageRange: '70 - 74',
        warmup: {
          prompt: 'Khi ở nhà một mình, nếu có người lạ gõ cửa em cần xử lí như thế nào?'
        },
        reading: {
          title: 'Khi mẹ vắng nhà',
          author: 'Theo Truyện cổ Grim',
          type: 'story',
          content: [
            'Trong khu rừng nọ có một đàn dê con sống cùng mẹ. Một hôm, trước khi đi kiếm cỏ, dê mẹ dặn con:',
            '– Ai đến gọi cửa, các con đừng mở nhé! Chỉ mở cửa khi nghe tiếng mẹ.',
            'Một con sói nấp gần đó. Đợi dê mẹ đi xa, nó gõ cửa và giả giọng dê mẹ. Nhớ lời mẹ, đàn dê con nói:',
            '– Không phải giọng mẹ. Không mở.',
            'Sói đành bỏ đi. Một lúc sau, dê mẹ về. Nghe đúng tiếng mẹ, đàn dê con ra mở cửa và tíu tít khoe:',
            '– Lúc mẹ đi vắng, có tiếng gọi cửa, nhưng không phải giọng của mẹ nên chúng con không mở.',
            'Dê mẹ xoa đầu đàn con: "Các con ngoan lắm!".'
          ],
          vocabulary: [
            { word: 'giả giọng', meaning: 'bắt chước giọng nói của người khác để lừa dối' },
            { word: 'tíu tít', meaning: 'vui vẻ nói cười ríu rít bên nhau' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Dê mẹ đã dặn các con điều gì trước khi đi kiếm cỏ?',
            sampleAnswer: 'Chỉ mở cửa khi nghe đúng tiếng của dê mẹ, không được mở cho người lạ.'
          },
          {
            id: 'c2',
            question: 'Đàn dê con đã làm gì khi con sói giả giọng dê mẹ gõ cửa?',
            sampleAnswer: 'Dê con nhận ra giọng lạ và kiên quyết không mở cửa.'
          }
        ],
        practice: {
          dictationText: 'Lúc dê mẹ vừa đi, sói đến gọi cửa. Đàn dê con biết sói giả giọng mẹ nên không mở cửa.'
        }
      },
      {
        id: 221,
        lessonNumber: 4,
        topicId: 4,
        topicTitle: 'Điều em cần biết',
        title: 'Bài 4: Nếu không may bị lạc',
        pageRange: '74 - 78',
        warmup: {
          prompt: 'Khi đi chơi nơi đông người, em cần làm gì để không bị lạc người thân?'
        },
        reading: {
          title: 'Nếu không may bị lạc',
          author: 'Theo Phạm Thị Thuý – Tuấn Hiển',
          type: 'story',
          content: [
            'Sáng chủ nhật, bố cho Nam và em đi công viên. Công viên đông như hội. Khi vào cổng, bố dặn: "Các con cẩn thận kẻo bị lạc. Nếu không may bị lạc, các con nhớ đi ra cổng này. Nhìn kìa, trên cổng có lá cờ rất to".',
            'Công viên đẹp quá. Nam cứ mải mê xem hết chỗ này đến chỗ khác. Lúc ngoảnh lại thì không thấy bố và em đâu. Nam vừa chạy tìm vừa gọi "Bố ơi! Bố ơi!". Hoảng hốt, Nam suýt khóc. Chợt Nam nhìn thấy tấm biển "Lối ra cổng". Nhớ lời bố dặn, Nam đi theo hướng tấm biển chỉ đường. "A, lá cờ kia rồi!". Nam mừng rỡ khi thấy bố và em đang chờ ở đó.'
          ],
          vocabulary: [
            { word: 'đông như hội', meaning: 'rất đông người tụ tập vui tươi náo nhiệt' },
            { word: 'mải mê', meaning: 'tập trung thích thú đến mức không chú ý xung quanh' },
            { word: 'suýt', meaning: 'gần như đã xảy ra trong gang tấc' }
          ],
          phonicsFocus: ['oanh']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Khi vào cổng công viên, bố đã dặn hai anh em Nam điều gì?',
            sampleAnswer: 'Nếu không may bị lạc thì nhớ đi ra cổng chính có cờ to để chờ.'
          },
          {
            id: 'c2',
            question: 'Nhờ đâu mà Nam đã tìm lại được bố và em?',
            sampleAnswer: 'Nhờ nhớ lời bố dặn và đi theo biển chỉ dẫn ra cổng cờ to.'
          }
        ],
        practice: {
          dictationText: 'Nam bị lạc khi đi chơi công viên. Nhớ lời dặn, Nam tìm đến điểm hẹn, gặp lại bố và em.'
        }
      },
      {
        id: 222,
        lessonNumber: 5,
        topicId: 4,
        topicTitle: 'Điều em cần biết',
        title: 'Bài 5: Đèn giao thông',
        pageRange: '78 - 83',
        warmup: {
          prompt: 'Quan sát ngã tư đường phố và kể tên các màu sắc của cột đèn giao thông.'
        },
        reading: {
          title: 'Đèn giao thông',
          author: 'Trung Kiên',
          type: 'article',
          content: [
            'Ở các ngã ba, ngã tư đường phố thường có cây đèn ba màu: đỏ, vàng, xanh. Đèn đỏ báo hiệu người đi đường và các phương tiện giao thông phải dừng lại. Đèn xanh báo hiệu được phép di chuyển. Còn đèn vàng báo hiệu phải đi chậm lại trước khi dừng hẳn.',
            'Cây đèn ba màu này được gọi là đèn giao thông. Nó điều khiển việc đi lại trên đường phố. Nếu không có đèn giao thông thì việc đi lại sẽ rất lộn xộn và nguy hiểm.',
            'Tuân thủ sự điều khiển của đèn giao thông giúp chúng ta bảo đảm an toàn khi đi lại.'
          ],
          vocabulary: [
            { word: 'ngã ba, ngã tư', meaning: 'nơi giao nhau của ba hoặc bốn nhánh đường' },
            { word: 'điều khiển', meaning: 'chỉ huy, hướng dẫn hoạt động theo quy định' },
            { word: 'tuân thủ', meaning: 'nghiêm túc chấp hành đúng theo luật lệ' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Cột đèn giao thông gồm có mấy màu và ý nghĩa của mỗi màu là gì?',
            options: ['3 màu: Đỏ (dừng lại), Vàng (đi chậm), Xanh (được đi)', '2 màu: Đỏ và Xanh', '3 màu: Đỏ, Tím, Vàng'],
            correctOption: 0,
            sampleAnswer: 'Đèn có 3 màu: Đỏ (dừng lại), Vàng (đi chậm lại trước khi dừng), Xanh (được phép đi).'
          },
          {
            id: 'c2',
            question: 'Vì sao chúng ta phải luôn tuân thủ tín hiệu đèn giao thông?',
            sampleAnswer: 'Để đảm bảo an toàn tính mạng cho bản thân và mọi người khi tham gia giao thông.'
          }
        ],
        practice: {
          dictationText: 'Đèn đỏ báo hiệu dừng lại. Đèn xanh báo hiệu được phép di chuyển. Đèn vàng báo hiệu đi chậm rồi dừng hẳn.'
        }
      }
    ]
  },
  {
    id: 5,
    title: 'Chủ điểm 5: Bài học từ cuộc sống',
    description: 'Những câu chuyện ngụ ngôn sâu sắc rèn luyện lòng nhân ái, sự trung thực và lòng dũng cảm.',
    icon: '🌱',
    color: 'from-green-400 to-emerald-600',
    lessons: [
      {
        id: 223,
        lessonNumber: 1,
        topicId: 5,
        topicTitle: 'Bài học từ cuộc sống',
        title: 'Bài 1: Kiến và chim bồ câu',
        pageRange: '84 - 87',
        warmup: {
          prompt: 'Kể về một lần em giúp đỡ bạn bè hoặc được bạn bè giúp đỡ khi gặp khó khăn.'
        },
        reading: {
          title: 'Kiến và chim bồ câu',
          author: 'Theo Ê-dốp',
          type: 'story',
          content: [
            'Một con kiến không may bị rơi xuống nước. Nó vùng vẫy và la lên: "Cứu tôi với, cứu tôi với!". Nghe tiếng kêu cứu của kiến, bồ câu nhanh trí nhặt một chiếc lá thả xuống nước. Kiến bám vào chiếc lá và leo được lên bờ.',
            'Một hôm, kiến thấy người thợ săn đang ngắm bắn bồ câu. Ngay lập tức, nó bò đến, cắn vào chân anh ta. Người thợ săn giật mình. Bồ câu thấy động liền bay đi.',
            'Bồ câu tìm đến chỗ kiến, cảm động nói: "Cảm ơn cậu đã cứu tớ". Kiến đáp: "Cậu cũng giúp tớ thoát chết mà". Cả hai đều rất vui vì đã giúp nhau.'
          ],
          vocabulary: [
            { word: 'vùng vẫy', meaning: 'cựa quậy chân tay liên tục để cố thoát ra' },
            { word: 'nhanh trí', meaning: 'suy nghĩ và hành động nhanh nhẹn, thông minh' },
            { word: 'thợ săn', meaning: 'người chuyên đi săn bắt muông thú trong rừng' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Bồ câu đã làm gì để cứu kiến khi kiến bị rơi xuống nước?',
            sampleAnswer: 'Bồ câu nhanh trí nhặt một chiếc lá thả xuống nước để kiến bám vào trôi vào bờ.'
          },
          {
            id: 'c2',
            question: 'Kiến đã làm gì để cứu bồ câu khỏi mũi súng người thợ săn?',
            sampleAnswer: 'Kiến bò đến cắn mạnh vào chân người thợ săn làm anh ta giật mình, bồ câu kịp bay đi.'
          }
        ],
        practice: {
          dictationText: 'Nghe tiếng kêu cứu của kiến, bồ câu nhanh trí nhặt chiếc lá thả xuống nước. Kiến bám vào chiếc lá và leo được lên bờ.'
        }
      },
      {
        id: 224,
        lessonNumber: 2,
        topicId: 5,
        topicTitle: 'Bài học từ cuộc sống',
        title: 'Bài 2: Câu chuyện của rễ',
        pageRange: '88 - 90',
        warmup: {
          prompt: 'Quan sát cây và cho biết: Cây gồm những bộ phận nào? Bộ phận nào chìm sâu trong lòng đất?'
        },
        reading: {
          title: 'Câu chuyện của rễ',
          author: 'Phương Dung',
          type: 'poem',
          content: [
            'Hoa nở trên cành',
            'Khoe muôn sắc thắm',
            'Giữa vòm lá xanh',
            'Toả hương trong nắng.',
            'Để hoa nở đẹp',
            'Để quả trĩu cành',
            'Để lá biếc xanh',
            'Rễ chìm trong đất...',
            'Nếu không có rễ',
            'Cây chẳng đâm chồi',
            'Chẳng ra trái ngọt',
            'Chẳng nở hoa tươi.',
            'Rễ chẳng nhiều lời',
            'Âm thầm, nhỏ bé',
            'Làm đẹp cho đời',
            'Khiêm nhường, lặng lẽ.'
          ],
          vocabulary: [
            { word: 'sắc thắm', meaning: 'màu sắc tươi tắn rực rỡ' },
            { word: 'trĩu cành', meaning: 'quả chín nhiều làm cành cây uốn cong xuống' },
            { word: 'khiêm nhường', meaning: 'khiêm tốn, không khoe khoang công lao' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Nhờ có rễ cây mà hoa, quả và lá cây phát triển như thế nào?',
            sampleAnswer: 'Nhờ có rễ hút chất dinh dưỡng mà lá biếc xanh, hoa nở đẹp và quả trĩu ngọt trên cành.'
          },
          {
            id: 'c2',
            question: 'Những từ ngữ nào trong bài thơ thể hiện phẩm chất đáng quý của rễ cây?',
            sampleAnswer: 'Âm thầm, nhỏ bé, khiêm nhường, lặng lẽ làm đẹp cho đời.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần ở cuối dòng thơ: thắm - nắng, cành - xanh, chồi - đời'
          }
        }
      },
      {
        id: 225,
        lessonNumber: 3,
        topicId: 5,
        topicTitle: 'Bài học từ cuộc sống',
        title: 'Bài 3: Câu hỏi của sói',
        pageRange: '90 - 93',
        warmup: {
          prompt: 'Vì sao những người hay gây gổ, bắt nạt người khác lại không có bạn bè?'
        },
        reading: {
          title: 'Câu hỏi của sói',
          author: 'Theo Truyện cổ Grim',
          type: 'story',
          content: [
            'Một chú sóc đang chuyền trên cành cây bỗng trượt chân, rơi trúng đầu lão sói đang ngái ngủ. Sói chồm dậy, túm lấy sóc. Sóc van nài: "Xin hãy thả tôi ra!".',
            'Sói nói: "Được, ta sẽ thả, nhưng ngươi hãy nói cho ta biết: Vì sao bọn sóc các ngươi cứ nhảy nhót vui đùa suốt ngày, còn ta lúc nào cũng thấy buồn bực?".',
            'Sóc bảo: "Thả tôi ra, rồi tôi sẽ nói". Sói thả sóc ra. Sóc nhảy tót lên cây cao, rồi đáp vọng xuống:',
            '– Mỗi khi nhìn thấy anh, chúng tôi đều bỏ chạy vì anh hay gây gổ. Anh hay buồn bực vì anh không có bạn bè. Còn chúng tôi lúc nào cũng vui vì chúng tôi có nhiều bạn tốt.'
          ],
          vocabulary: [
            { word: 'ngái ngủ', meaning: 'trạng thái vừa mới thức dậy, chưa tỉnh hẳn táo' },
            { word: 'gây gổ', meaning: 'hay kiếm cớ sinh sự, cãi cọ và đánh nhau với người khác' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Sói đã hỏi sóc điều gì khi túm được sóc?',
            sampleAnswer: 'Sói hỏi vì sao họ nhà sóc luôn vui đùa, còn sói thì lúc nào cũng thấy buồn bực.'
          },
          {
            id: 'c2',
            question: 'Vì sao lão sói lúc nào cũng cảm thấy buồn bực và cô độc?',
            sampleAnswer: 'Vì sói tính tình hung dữ, hay gây gổ nên không ai dám chơi cùng, không có bạn bè tốt.'
          }
        ],
        practice: {
          dictationText: 'Sói luôn thấy buồn bực vì sói không có bạn bè. Còn sóc lúc nào cũng vui vẻ vì sóc có nhiều bạn tốt.'
        }
      },
      {
        id: 226,
        lessonNumber: 4,
        topicId: 5,
        topicTitle: 'Bài học từ cuộc sống',
        title: 'Bài 4: Chú bé chăn cừu',
        pageRange: '94 - 98',
        warmup: {
          prompt: 'Vì sao chúng ta luôn phải nói sự thật và không được nói dối người khác?'
        },
        reading: {
          title: 'Chú bé chăn cừu',
          author: 'Theo Ê-dốp',
          type: 'story',
          content: [
            'Có một chú bé chăn cừu thường thả cừu gần chân núi. Một hôm thấy buồn quá, chú nghĩ ra một trò đùa cho vui. Chú giả vờ kêu toáng lên: "Sói! Sói! Cứu tôi với!".',
            'Nghe tiếng kêu cứu, mấy bác nông dân đang làm việc gần đấy tức tốc chạy tới. Nhưng họ không thấy sói đâu. Thấy vậy, chú khoái chí lắm.',
            'Mấy hôm sau, chú lại bày ra trò ấy. Các bác nông dân lại chạy tới. Rồi một hôm, sói đến thật. Chú hốt hoảng kêu gào xin cứu giúp. Các bác nông dân nghĩ là chú lại lừa mình, nên vẫn thản nhiên làm việc. Thế là sói thoả thuê ăn thịt hết cả đàn cừu.'
          ],
          vocabulary: [
            { word: 'tức tốc', meaning: 'vội vàng chạy đến ngay lập tức không chần chừ' },
            { word: 'thản nhiên', meaning: 'bình tĩnh coi như không có chuyện gì xảy ra' },
            { word: 'thoả thuê', meaning: 'đầy đủ thỏa thích đến mức tối đa' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Khi chú bé kêu cứu giả vờ lần đầu, các bác nông dân đã hành động thế nào?',
            sampleAnswer: 'Các bác nông dân tức tốc chạy tới để giúp chú bé đuổi sói.'
          },
          {
            id: 'c2',
            question: 'Vì sao khi sói đến thật, các bác nông dân lại không chạy đến giúp nữa?',
            sampleAnswer: 'Vì chú bé đã nói dối nhiều lần làm mất lòng tin, các bác tưởng chú lại bày trò trêu đùa.'
          }
        ],
        practice: {
          dictationText: 'Một hôm, sói đến thật. Chú bé hốt hoảng xin cứu giúp. Các bác nông dân nghĩ là chú nói dối, nên vẫn thản nhiên làm việc.'
        }
      },
      {
        id: 227,
        lessonNumber: 5,
        topicId: 5,
        topicTitle: 'Bài học từ cuộc sống',
        title: 'Bài 5: Tiếng vọng của núi',
        pageRange: '98 - 103',
        warmup: {
          prompt: 'Khi em gửi đi những lời yêu thương, nụ cười thì em sẽ nhận lại được điều gì?'
        },
        reading: {
          title: 'Tiếng vọng của núi',
          author: 'Theo 365 truyện kể hằng đêm',
          type: 'story',
          content: [
            'Đang đi chơi trong núi, gấu con chợt nhìn thấy một hạt dẻ. Gấu con vui mừng reo lên: "A!". Ngay lập tức, có tiếng "A!" vọng lại. Gấu con ngạc nhiên kêu to: "Bạn là ai?". Lại có tiếng vọng ra từ vách núi: "Bạn là ai?". Gấu con hét lên: "Sao không nói cho tôi biết?". Núi cũng đáp lại như vậy. Gấu con bực tức: "Tôi ghét bạn". Khắp nơi có tiếng vọng: "Tôi ghét bạn". Gấu con tủi thân, oà khóc.',
            'Về nhà, gấu con kể cho mẹ nghe. Gấu mẹ cười bảo: "Con hãy quay lại và nói với núi: Tôi yêu bạn". Gấu con làm theo lời mẹ. Quả nhiên, có tiếng vọng lại: "Tôi yêu bạn". Gấu con bật cười vui vẻ.'
          ],
          vocabulary: [
            { word: 'tiếng vọng', meaning: 'âm thanh dội ngược trở lại khi gặp vật cản lớn như vách núi' },
            { word: 'tủi thân', meaning: 'buồn tủi và thương cho hoàn cảnh của mình' },
            { word: 'quả nhiên', meaning: 'đúng như dự đoán, sự thật diễn ra y như lời nói' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Khi gấu con hét lên "Tôi ghét bạn", vách núi đã vọng lại điều gì?',
            sampleAnswer: 'Vách núi cũng vọng lại đúng câu nói: "Tôi ghét bạn".'
          },
          {
            id: 'c2',
            question: 'Sau khi nghe lời mẹ quay lại nói "Tôi yêu bạn", gấu con cảm thấy thế nào?',
            sampleAnswer: 'Gấu con nghe tiếng "Tôi yêu bạn" vọng lại khắp nơi và bật cười vui sướng.'
          }
        ],
        practice: {
          dictationText: 'Theo lời mẹ, gấu con quay lại nói với núi là gấu yêu núi. Quả nhiên, khắp núi vọng lại lời yêu thương. Gấu con bật cười vui vẻ.'
        }
      }
    ]
  },
  {
    id: 6,
    title: 'Chủ điểm 6: Thiên nhiên kì thú',
    description: 'Khám phá thế giới muôn loài động thực vật kì diệu và cảnh sắc thiên nhiên bao la.',
    icon: '🌈',
    color: 'from-cyan-400 to-blue-500',
    lessons: [
      {
        id: 228,
        lessonNumber: 1,
        topicId: 6,
        topicTitle: 'Thiên nhiên kì thú',
        title: 'Bài 1: Loài chim của biển cả',
        pageRange: '104 - 107',
        warmup: {
          prompt: 'Quan sát tranh các loài chim bay lượn trên mặt biển và cá bơi lội dưới nước.'
        },
        reading: {
          title: 'Loài chim của biển cả',
          author: 'Trung Nguyên',
          type: 'article',
          content: [
            'Hải âu là loài chim của biển cả. Chúng có sải cánh lớn, nên có thể bay rất xa, vượt qua cả những đại dương mênh mông. Hải âu còn bơi rất giỏi nhờ chân của chúng có màng như chân vịt.',
            'Hải âu bay suốt ngày trên mặt biển. Đôi khi, chúng đậu ngay trên mặt nước dập dềnh. Khi trời sắp có bão, chúng bay thành đàn tìm nơi trú ẩn. Vì vậy, hải âu được gọi là loài chim báo bão. Chúng cũng được coi là bạn của những người đi biển.'
          ],
          vocabulary: [
            { word: 'sải cánh', meaning: 'chiều dài tính từ đầu cánh này sang đầu cánh kia khi xoè rộng' },
            { word: 'đại dương', meaning: 'vùng biển vô cùng rộng lớn bao la' },
            { word: 'dập dềnh', meaning: 'chuyển động nhấp nhô nhẹ nhàng theo làn sóng' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Nhờ đâu mà chim hải âu có thể bay rất xa vượt đại dương và bơi rất giỏi?',
            sampleAnswer: 'Nhờ có sải cánh lớn và chân có màng bơi giống chân vịt.'
          },
          {
            id: 'c2',
            question: 'Vì sao hải âu được người đi biển gọi là "loài chim báo bão"?',
            sampleAnswer: 'Vì khi trời sắp có bão lớn, chúng bay từng đàn tìm nơi trú ẩn giúp người đi biển nhận biết.'
          }
        ],
        practice: {
          dictationText: 'Hải âu là loài chim của biển cả. Chúng có sải cánh lớn, nên bay rất xa. Chúng còn bơi rất giỏi nhờ chân có màng như chân vịt.'
        }
      },
      {
        id: 229,
        lessonNumber: 2,
        topicId: 6,
        topicTitle: 'Thiên nhiên kì thú',
        title: 'Bài 2: Bảy sắc cầu vồng',
        pageRange: '108 - 110',
        warmup: {
          prompt: 'Giải câu đố: "Cầu gì xa tít chân trời / Bảy màu rực rỡ không người nào qua?" (Là cầu vồng).'
        },
        reading: {
          title: 'Bảy sắc cầu vồng',
          author: 'Ngọc Hà',
          type: 'poem',
          content: [
            'Vừa mưa lại nắng',
            'Hay có cầu vồng',
            'Bảy màu tươi thắm',
            'Bé mừng vui trông',
            'Màu đỏ mặt trời',
            'Màu cam đu đủ',
            'Màu vàng cá bơi',
            'Lục kia màu lá',
            'Màu lam đám mây',
            'Màu chàm áo mẹ',
            'Màu tím hoa sim',
            'Bảy màu yêu thế.',
            'Cầu vồng ẩn hiện',
            'Rồi lại tan mau',
            'Đất trời bừng tỉnh',
            'Sau cơn mưa rào.'
          ],
          vocabulary: [
            { word: 'ẩn hiện', meaning: 'lúc mờ lúc tỏ, xuất hiện rồi biến mất chớp nhoáng' },
            { word: 'bừng tỉnh', meaning: 'trở nên sáng rõ, rạng rỡ và tươi mới' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Cầu vồng thường xuất hiện khi nào và gồm có bảy màu nào?',
            sampleAnswer: 'Cầu vồng xuất hiện khi vừa mưa vừa nắng, gồm: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím.'
          },
          {
            id: 'c2',
            question: 'Màu tím và màu chàm trong bài thơ được gắn với hình ảnh nào?',
            sampleAnswer: 'Màu tím gắn với hoa sim, màu chàm gắn với áo của mẹ.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Kể tên đúng thứ tự 7 màu cầu vồng: Đỏ, Cam, Vàng, Lục, Lam, Chàm, Tím'
          }
        }
      },
      {
        id: 230,
        lessonNumber: 3,
        topicId: 6,
        topicTitle: 'Thiên nhiên kì thú',
        title: 'Bài 3: Chúa tể rừng xanh',
        pageRange: '110 - 114',
        warmup: {
          prompt: 'Giải câu đố: "Lông vằn lông vện mắt xanh / Dáng đi uyển chuyển nhe nanh tìm mồi / Muông thú khiếp sợ tôn ngôi chúa rừng?" (Là con hổ).'
        },
        reading: {
          title: 'Chúa tể rừng xanh',
          author: 'Theo Từ điển tranh về các con vật',
          type: 'article',
          content: [
            'Hổ là loài thú dữ ăn thịt, sống trong rừng. Lông hổ thường có màu vàng, pha những vằn đen. Răng sắc nhọn, mắt nhìn rõ mọi vật trong đêm tối. Bốn chân chắc khoẻ và có vuốt sắc. Đuôi dài và cứng như roi sắt. Hổ di chuyển nhanh, có thể nhảy xa và săn mồi rất giỏi. Hổ rất khoẻ và hung dữ.',
            'Hầu hết các con vật sống trong rừng đều sợ hổ. Vì vậy, hổ được xem là chúa tể rừng xanh.'
          ],
          vocabulary: [
            { word: 'chúa tể', meaning: 'kẻ có quyền uy và sức mạnh lớn nhất thống trị muôn loài' },
            { word: 'vuốt sắc', meaning: 'móng vuốt ở chân cong nhọn hoắt dùng để vồ bắt con mồi' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Hổ có những đặc điểm cơ thể nổi bật nào?',
            sampleAnswer: 'Lông vàng vằn đen, răng nhọn, mắt sáng trong đêm, chân chắc khoẻ có vuốt sắc, đuôi dài cứng như roi sắt.'
          },
          {
            id: 'c2',
            question: 'Vì sao hổ được tôn xưng là "chúa tể rừng xanh"?',
            sampleAnswer: 'Vì hổ rất khoẻ mạnh, hung dữ và săn mồi giỏi khiến muông thú đều khiếp sợ.'
          }
        ],
        practice: {
          dictationText: 'Hổ là loài thú ăn thịt. Bốn chân chắc khoẻ và có vuốt sắc. Đuôi dài và cứng như roi sắt. Hổ rất khoẻ và hung dữ.'
        }
      },
      {
        id: 231,
        lessonNumber: 4,
        topicId: 6,
        topicTitle: 'Thiên nhiên kì thú',
        title: 'Bài 4: Cuộc thi tài năng rừng xanh',
        pageRange: '114 - 118',
        warmup: {
          prompt: 'Quan sát các loài vật trong rừng: chim yểng, gõ kiến, chim công, voọc xám trổ tài nghệ thuật.'
        },
        reading: {
          title: 'Cuộc thi tài năng rừng xanh',
          author: 'Lâm Anh',
          type: 'story',
          content: [
            'Mừng xuân, các con vật trong rừng tổ chức một cuộc thi tài năng. Đúng như chương trình đã niêm yết, cuộc thi mở đầu bằng tiết mục của chim yểng. Yểng nhoẻn miệng cười rồi bắt chước tiếng của một số loài vật. Tiếp theo là ca khúc "ngoao ngoao" của mèo rừng. Gõ kiến chỉ trong nháy mắt đã khoét được cái tổ xinh xắn. Chim công khiến khán giả say mê, chuếnh choáng vì điệu múa tuyệt đẹp. Voọc xám với tiết mục đu cây điêu luyện làm tất cả trầm trồ thích thú.',
            'Các con vật đều xứng đáng nhận phần thưởng.'
          ],
          vocabulary: [
            { word: 'niêm yết', meaning: 'dán thông báo công khai cho mọi người cùng biết' },
            { word: 'chuếnh choáng', meaning: 'say mê ngây ngất trước vẻ đẹp lộng lẫy' },
            { word: 'điêu luyện', meaning: 'thành thạo, đạt tới trình độ kĩ thuật rất cao' }
          ],
          phonicsFocus: ['oet', 'uênh', 'oen']
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Mỗi con vật trong cuộc thi đã biểu diễn tiết mục gì?',
            sampleAnswer: 'Yểng nhại tiếng các con vật, mèo rừng hát, gõ kiến khoét tổ, chim công múa xoè đuôi, voọc xám đu cây điêu luyện.'
          },
          {
            id: 'c2',
            question: 'Kết quả cuộc thi tài năng như thế nào?',
            sampleAnswer: 'Tất cả các con vật đều xứng đáng nhận phần thưởng vì mỗi bạn đều có tài năng độc đáo riêng.'
          }
        ],
        practice: {
          dictationText: 'Yểng nhoẻn miệng cười rồi bắt chước tiếng một số loài vật. Gõ kiến trong nháy mắt đã khoét được cái tổ xinh xắn. Còn chim công có điệu múa tuyệt đẹp.'
        }
      },
      {
        id: 232,
        lessonNumber: 5,
        topicId: 6,
        topicTitle: 'Thiên nhiên kì thú',
        title: 'Bài 5: Cây liễu dẻo dai',
        pageRange: '118 - 123',
        warmup: {
          prompt: 'Quan sát cây liễu rủ cành xanh mát bên bờ hồ nước phẳng lặng.'
        },
        reading: {
          title: 'Cây liễu dẻo dai',
          author: 'Hải An',
          type: 'story',
          content: [
            'Trời nổi gió to. Cây liễu không ngừng lắc lư. Thấy vậy, Nam rất lo cây liễu sẽ bị gãy. Nam hỏi mẹ:',
            '– Mẹ ơi, cây liễu mềm yếu thế, liệu có bị gió làm gãy không ạ?',
            'Mẹ mỉm cười đáp:',
            '– Con yên tâm, cây liễu sẽ không sao đâu!',
            'Mẹ giải thích thêm:',
            '– Thân cây liễu tuy không to nhưng dẻo dai. Cành liễu mềm mại, có thể chuyển động theo chiều gió. Vì vậy, cây không dễ bị gãy. Liễu còn là loài cây dễ trồng. Chỉ cần cắm cành xuống đất, nó có thể nhanh chóng mọc lên cây non.'
          ],
          vocabulary: [
            { word: 'dẻo dai', meaning: 'bền bỉ, có khả năng chịu lực uốn cong mà không bị gãy đứt' },
            { word: 'lắc lư', meaning: 'nghiêng qua nghiêng lại nhẹ nhàng theo gió' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vì sao khi trời nổi gió bão lớn, cây liễu mềm mại lại không bị gãy đổ?',
            sampleAnswer: 'Vì thân liễu dẻo dai và cành mềm mại uốn lượn chuyển động nương theo chiều gió.'
          },
          {
            id: 'c2',
            question: 'Cây liễu có đặc điểm trồng cây độc đáo như thế nào?',
            sampleAnswer: 'Chỉ cần cắm cành xuống đất ẩm là cây nhanh chóng bén rễ và mọc thành cây non mới.'
          }
        ],
        practice: {
          dictationText: 'Thân cây liễu không to nhưng dẻo dai. Cành liễu mềm mại, có thể chuyển động theo chiều gió. Vì vậy, cây không dễ bị gãy.'
        }
      }
    ]
  },
  {
    id: 7,
    title: 'Chủ điểm 7: Thế giới trong mắt em',
    description: 'Cảm nhận trong trẻo, hồn nhiên về thiên nhiên, giấc mơ và cuộc sống hàng ngày.',
    icon: '☀️',
    color: 'from-yellow-400 to-amber-500',
    lessons: [
      {
        id: 233,
        lessonNumber: 1,
        topicId: 7,
        topicTitle: 'Thế giới trong mắt em',
        title: 'Bài 1: Tia nắng đi đâu?',
        pageRange: '124 - 126',
        warmup: {
          prompt: 'Em có thích đón ánh nắng mai ấm áp rọi vào cửa sổ mỗi sáng không?'
        },
        reading: {
          title: 'Tia nắng đi đâu?',
          author: 'Thuỵ Anh',
          type: 'poem',
          content: [
            'Buổi sáng thức dậy',
            'Bé thấy buồn cười:',
            'Có ai đang nhảy',
            'Một bài vui vui.',
            'Đó là tia nắng',
            'Nhảy trong lòng tay',
            'Nhảy trên bàn học',
            'Nhảy trên tán cây.',
            'Tối đến giờ ngủ',
            'Sực nhớ bé tìm',
            'Tìm tia nắng nhỏ:',
            'Ngủ rồi. Lặng im...',
            'Bé nằm ngẫm nghĩ:',
            '– Nắng ngủ ở đâu?',
            '– Nắng ngủ nhà nắng!',
            'Mai gặp lại nhau.'
          ],
          vocabulary: [
            { word: 'sực nhớ', meaning: 'chợt nhớ ra một điều gì đó đột ngột' },
            { word: 'ngẫm nghĩ', meaning: 'suy nghĩ tìm tòi một cách say sưa' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Buổi sáng thức dậy, bé nhìn thấy tia nắng tinh nghịch nhảy ở những đâu?',
            sampleAnswer: 'Tia nắng nhảy trong lòng bàn tay bé, nhảy trên bàn học và trên các vòm tán cây.'
          },
          {
            id: 'c2',
            question: 'Khi đêm đến, bạn nhỏ nghĩ tia nắng đã đi đâu ngủ?',
            sampleAnswer: 'Bạn nhỏ nghĩ tia nắng đã về ngủ ở "nhà của nắng" để mai lại gặp nhau.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần trong khổ thơ đầu: dậy - thấy - nhảy'
          }
        }
      },
      {
        id: 234,
        lessonNumber: 2,
        topicId: 7,
        topicTitle: 'Thế giới trong mắt em',
        title: 'Bài 2: Trong giấc mơ buổi sáng',
        pageRange: '126 - 128',
        warmup: {
          prompt: 'Kể về một giấc mơ đẹp đẽ, bay bổng trong giấc ngủ của em.'
        },
        reading: {
          title: 'Trong giấc mơ buổi sáng',
          author: 'Nguyễn Lãm Thắng',
          type: 'poem',
          content: [
            'Trong giấc mơ buổi sáng',
            'Em gặp ông mặt trời',
            'Mang túi đầy hoa nắng',
            'Rải hoa vàng khắp nơi',
            'Trong giấc mơ buổi sáng',
            'Em qua thảo nguyên xanh',
            'Có rất nhiều hoa lạ',
            'Mang tên bạn lớp mình',
            'Trong giấc mơ buổi sáng',
            'Em thấy một dòng sông',
            'Chảy tràn dòng sữa trắng',
            'Đi qua ban mai hồng',
            'Trong giấc mơ buổi sáng',
            'Em nghe rõ bên tai',
            'Lời của chú gà trống:',
            '– Dậy mau đi! Học bài!...'
          ],
          vocabulary: [
            { word: 'thảo nguyên', meaning: 'đồng cỏ bao la rộng lớn xanh ngát' },
            { word: 'ban mai', meaning: 'khoảng thời gian sáng sớm khi mặt trời vừa mọc' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Trong giấc mơ, bạn nhỏ đã gặp ai và nhìn thấy những cảnh đẹp gì?',
            sampleAnswer: 'Gặp ông mặt trời rải hoa nắng, qua thảo nguyên xanh đầy hoa lạ mang tên các bạn, và thấy dòng sông sữa trắng.'
          },
          {
            id: 'c2',
            question: 'Âm thanh nào đã đánh thức bạn nhỏ thức dậy học bài?',
            sampleAnswer: 'Tiếng gáy vang giòn giã của chú gà trống buổi sáng.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: trời - nơi, xanh - mình, sông - hồng'
          }
        }
      },
      {
        id: 235,
        lessonNumber: 3,
        topicId: 7,
        topicTitle: 'Thế giới trong mắt em',
        title: 'Bài 3: Ngày mới bắt đầu',
        pageRange: '128 - 132',
        warmup: {
          prompt: 'Buổi sáng thức dậy, cảnh vật và con người chuẩn bị cho ngày mới như thế nào?'
        },
        reading: {
          title: 'Ngày mới bắt đầu',
          author: 'Theo Thu Hương',
          type: 'story',
          content: [
            'Buổi sáng tinh mơ, mặt trời nhô lên đỏ rực. Những tia nắng toả khắp nơi, đánh thức mọi vật.',
            'Nắng chiếu vào tổ chim. Chim bay ra khỏi tổ, cất tiếng hót. Nắng chiếu vào tổ ong. Ong bay ra khỏi tổ, đi kiếm mật. Nắng chiếu vào chuồng gà. Đàn gà lục tục ra khỏi chuồng, đi kiếm mồi. Nắng chiếu vào nhà, gọi bé đang nằm ngủ. Bé thức dậy, chuẩn bị đến trường.',
            'Một ngày mới bắt đầu.'
          ],
          vocabulary: [
            { word: 'tinh mơ', meaning: 'lúc trời vừa mới sáng rõ mặt người' },
            { word: 'lục tục', meaning: 'nối tiếp nhau lần lượt đi ra đông đúc' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vào buổi sáng sớm, điều gì đã đánh thức muôn loài thức dậy?',
            sampleAnswer: 'Những tia nắng ấm áp của ông mặt trời chiếu rọi khắp nơi.'
          },
          {
            id: 'c2',
            question: 'Sau khi thức giấc, chim, ong, gà và bạn nhỏ đã làm những việc gì?',
            sampleAnswer: 'Chim hót, ong đi tìm mật, gà kiếm mồi, còn bạn nhỏ đánh răng rửa mặt chuẩn bị tới trường.'
          }
        ],
        practice: {
          dictationText: 'Nắng chiếu vào tổ chim. Chim bay ra khỏi tổ, cất tiếng hót. Nắng chiếu vào nhà, gọi bé thức dậy đến trường.'
        }
      },
      {
        id: 236,
        lessonNumber: 4,
        topicId: 7,
        topicTitle: 'Thế giới trong mắt em',
        title: 'Bài 4: Hỏi mẹ',
        pageRange: '132 - 134',
        warmup: {
          prompt: 'Em có những câu hỏi tò mò nào về các hiện tượng mây, mưa, mặt trăng, mặt trời?'
        },
        reading: {
          title: 'Hỏi mẹ',
          author: 'Nguyễn Xuân Bồi',
          type: 'poem',
          content: [
            'Ai quạt thành gió',
            'Thổi mây ngang trời?',
            'Ai nhuộm mẹ ơi',
            'Bầu trời xanh thế?',
            'Ông sao thì bé',
            'Trăng rằm tròn to.',
            'Cuội ngồi gốc đa',
            'Phải chăn trâu mãi.',
            'Mẹ ơi có phải',
            'Cuội buồn lắm không?',
            'Nên chú phi công',
            'Bay lên thăm Cuội?'
          ],
          vocabulary: [
            { word: 'nhuộm', meaning: 'làm cho có một màu sắc nhất định' },
            { word: 'trăng rằm', meaning: 'mặt trăng ngày 15 âm lịch tròn và sáng nhất' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Bạn nhỏ đã hỏi mẹ những thắc mắc ngây thơ gì về thiên nhiên?',
            sampleAnswer: 'Ai quạt thành gió, ai nhuộm bầu trời xanh và chú Cuội trên trăng có buồn không.'
          },
          {
            id: 'c2',
            question: 'Vì sao bạn nhỏ nghĩ chú phi công lái máy bay lên thăm chú Cuội?',
            sampleAnswer: 'Vì thương chú Cuội ngồi chăn trâu một mình trên cung trăng buồn bã.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: gió - to, trời - ơi, không - công'
          }
        }
      },
      {
        id: 237,
        lessonNumber: 5,
        topicId: 7,
        topicTitle: 'Thế giới trong mắt em',
        title: 'Bài 5: Những cánh cò',
        pageRange: '134 - 137',
        warmup: {
          prompt: 'Quan sát hai bức tranh: Cánh đồng quê yên bình đàn cò bay lượn và thành phố nhà máy khói bụi.'
        },
        reading: {
          title: 'Những cánh cò',
          author: 'Theo Hoài Nam',
          type: 'story',
          content: [
            'Ông kể ngày xưa, quê của bé có rất nhiều cò. Mùa xuân, từng đàn cò trắng duyên dáng bay tới. Chúng lượn trên bầu trời trong xanh rồi hạ cánh xuống những luỹ tre. Hằng ngày, cò đi mò tôm, bắt cá ở các ao, hồ, đầm.',
            'Bây giờ, ao, hồ, đầm phải nhường chỗ cho những toà nhà cao vút, những con đường cao tốc, những nhà máy toả khói mịt mù. Cò chẳng còn nơi kiếm ăn. Cò sợ những âm thanh ồn ào. Thế là chúng bay đi.',
            'Bé ước ao được thấy những cánh cò trên cánh đồng quê.'
          ],
          vocabulary: [
            { word: 'luỹ tre', meaning: 'hàng tre trồng dày đặc quanh làng quê' },
            { word: 'cao tốc', meaning: 'đường dành cho xe chạy tốc độ nhanh' },
            { word: 'mịt mù', meaning: 'dày đặc khói bụi làm che khuất tầm nhìn' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Ngày xưa ở quê bé, đàn cò thường kiếm ăn ở đâu?',
            sampleAnswer: 'Cò mò tôm bắt cá ở các ao, hồ, đầm nước trong mát.'
          },
          {
            id: 'c2',
            question: 'Vì sao đàn cò ngày nay lại rời bỏ làng quê bay đi nơi khác?',
            sampleAnswer: 'Vì ao hồ bị san lấp xây nhà máy, đường sá ồn ào và khói bụi mịt mù mất nơi kiếm ăn.'
          }
        ],
        practice: {
          dictationText: 'Ao, hồ, đầm phải nhường chỗ cho nhà cao tầng, đường cao tốc và nhà máy. Cò chẳng còn nơi kiếm ăn. Thế là chúng bay đi.'
        }
      },
      {
        id: 238,
        lessonNumber: 6,
        topicId: 7,
        topicTitle: 'Thế giới trong mắt em',
        title: 'Bài 6: Buổi trưa hè',
        pageRange: '138 - 140',
        warmup: {
          prompt: 'Khung cảnh làng quê vào một buổi trưa hè êm đềm dưới bóng mát cây đa.'
        },
        reading: {
          title: 'Buổi trưa hè',
          author: 'Huy Cận',
          type: 'poem',
          content: [
            'Buổi trưa lim dim',
            'Nghìn con mắt lá',
            'Bóng cũng nằm im',
            'Trong vườn êm ả.',
            'Bò ơi, bò nghỉ',
            'Sau buổi cày mai',
            'Có gì ngẫm nghĩ',
            'Nhai mãi, nhai hoài...',
            'Hoa đại thơm hơn',
            'Giữa giờ trưa vắng',
            'Con bướm chập chờn',
            'Vờn đôi cánh nắng.',
            'Bé chưa ngủ được',
            'Bé nằm bé nghe',
            'Âm thầm rạo rực',
            'Cả buổi trưa hè.'
          ],
          vocabulary: [
            { word: 'chập chờn', meaning: 'bay lượn lúc cao lúc thấp, lúc ẩn lúc hiện' },
            { word: 'rạo rực', meaning: 'cảm giác náo nức, xốn xang trong lòng' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Những từ ngữ nào trong bài thơ cho thấy buổi trưa hè rất yên tĩnh?',
            sampleAnswer: 'Lim dim, nằm im, êm ả, trưa vắng, âm thầm.'
          },
          {
            id: 'c2',
            question: 'Bác bò nằm nghỉ ngơi sau buổi cày bừa làm hành động gì?',
            sampleAnswer: 'Bác bò thong thả nhai rơm mãi, nhai hoài như đang ngẫm nghĩ.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: dim - im, nghỉ - nghĩ, hơn - chờn'
          }
        }
      },
      {
        id: 239,
        lessonNumber: 7,
        topicId: 7,
        topicTitle: 'Thế giới trong mắt em',
        title: 'Bài 7: Hoa phượng',
        pageRange: '140 - 144',
        warmup: {
          prompt: 'Hoa phượng đỏ rực báo hiệu mùa nào trong năm đã đến?'
        },
        reading: {
          title: 'Hoa phượng',
          author: 'Lê Huy Hoà',
          type: 'poem',
          content: [
            'Hoa phượng',
            'Hôm qua còn lấm tấm',
            'Chen lẫn màu lá xanh',
            'Sáng nay bùng lửa thẫm',
            'Rừng rực cháy trên cành.',
            '– Bà ơi! Sao mà nhanh!',
            'Phượng nở nghìn mắt lửa,',
            'Cả dãy phố nhà mình,',
            'Một trời hoa phượng đỏ.',
            'Hay đêm qua không ngủ',
            'Chị gió quạt cho cây?',
            'Hay mặt trời ủ lửa',
            'Cho hoa bừng hôm nay?'
          ],
          vocabulary: [
            { word: 'lấm tấm', meaning: 'những nụ hoa nhỏ li ti rải rác trên cành' },
            { word: 'rừng rực cháy', meaning: 'sắc hoa đỏ thắm bừng sáng như ngọn lửa' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Những câu thơ nào cho biết hoa phượng nở rất nhiều và rất nhanh?',
            sampleAnswer: '"Sáng nay bùng lửa thẫm / Phượng nở nghìn mắt lửa / Cả dãy phố nhà mình / Một trời hoa phượng đỏ".'
          },
          {
            id: 'c2',
            question: 'Theo suy nghĩ của bạn nhỏ, ai đã giúp hoa phượng bừng nở rực rỡ?',
            sampleAnswer: 'Chị gió đêm qua quạt mát và ông mặt trời ủ lửa ấm cho hoa nở.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần: xanh - nhanh, cây - nay, lửa - đỏ'
          }
        }
      }
    ]
  },
  {
    id: 8,
    title: 'Chủ điểm 8: Đất nước và con người',
    description: 'Tự hào về truyền thống trí tuệ, vẻ đẹp danh lam thắng cảnh và con người Việt Nam.',
    icon: '🇻🇳',
    color: 'from-red-500 to-amber-600',
    lessons: [
      {
        id: 240,
        lessonNumber: 1,
        topicId: 8,
        topicTitle: 'Đất nước và con người',
        title: 'Bài 1: Cậu bé thông minh',
        pageRange: '144 - 147',
        warmup: {
          prompt: 'Khi quả bóng rơi xuống một cái hố sâu, em sẽ làm cách nào để lấy lên?'
        },
        reading: {
          title: 'Cậu bé thông minh',
          author: 'Theo Vũ Ngọc Khánh',
          type: 'story',
          content: [
            'Một hôm, cậu bé Vinh đem một quả bưởi ra bãi cỏ làm bóng để cùng chơi với các bạn. Đang chơi, bỗng quả bóng lăn xuống một cái hố gần đó. Cái hố hẹp và rất sâu nên không thể với tay lấy quả bóng lên được. Bọn trẻ nhìn xuống cái hố đầy nuối tiếc.',
            'Suy nghĩ một lát, cậu bé Vinh rủ bạn đi mượn mấy chiếc nón, rồi múc nước đổ đầy hố. Các bạn không hiểu Vinh làm thế để làm gì. Lát sau, thấy Vinh cúi xuống cầm quả bóng lên. Các bạn nhìn Vinh trầm trồ thán phục.',
            'Cậu bé Vinh ngày ấy chính là Lương Thế Vinh. Về sau, ông trở thành nhà toán học xuất sắc của nước ta.'
          ],
          vocabulary: [
            { word: 'nuối tiếc', meaning: 'tiếc rẻ vì mất đi một thứ yêu thích mà không giữ lại được' },
            { word: 'thán phục', meaning: 'ngưỡng mộ, khâm phục tài năng vượt trội của người khác' },
            { word: 'nhà toán học', meaning: 'người nghiên cứu uyên bác về các con số và hình học' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Cậu bé Lương Thế Vinh đã làm thế nào để lấy quả bưởi bóng nổi lên khỏi hố sâu?',
            sampleAnswer: 'Vinh mượn nón múc nước đổ đầy hố để quả bưởi nhẹ tự nổi lên mặt nước.'
          },
          {
            id: 'c2',
            question: 'Về sau, cậu bé Lương Thế Vinh đã trở thành danh nhân nào của đất nước?',
            sampleAnswer: 'Ông trở thành Trạng nguyên, nhà toán học lỗi lạc xuất sắc của dân tộc.'
          }
        ],
        practice: {
          dictationText: 'Vinh đem quả bưởi làm bóng chơi với các bạn. Quả bóng lăn xuống hố. Vinh bèn tìm cách đổ đầy nước vào hố cho quả bóng nổi lên. Các bạn nhìn Vinh thán phục.'
        }
      },
      {
        id: 241,
        lessonNumber: 2,
        topicId: 8,
        topicTitle: 'Đất nước và con người',
        title: 'Bài 2: Lính cứu hoả',
        pageRange: '148 - 151',
        warmup: {
          prompt: 'Chúng ta cần gọi số điện thoại khẩn cấp nào (114) khi phát hiện xảy ra hoả hoạn?'
        },
        reading: {
          title: 'Lính cứu hoả',
          author: 'Theo Hồng Vân',
          type: 'article',
          content: [
            'Chuông báo cháy vang lên. Những người lính cứu hoả lập tức mặc quần áo chữa cháy, đi ủng, đeo găng, đội mũ rồi lao ra xe. Những chiếc xe cứu hoả màu đỏ chứa đầy nước, bật đèn báo hiệu, rú còi chạy như bay đến nơi có cháy. Tại đây, ngọn lửa mỗi lúc một lớn. Những người lính cứu hoả nhanh chóng dùng vòi phun nước dập tắt đám cháy. Họ dũng cảm quên mình cứu tính mạng và tài sản của người dân.',
            'Cứu hoả là một công việc rất nguy hiểm. Nhưng những người lính cứu hoả luôn sẵn sàng có mặt ở mọi nơi có hoả hoạn.'
          ],
          vocabulary: [
            { word: 'cứu hoả', meaning: 'chữa cháy, dập tắt lửa để cứu người và của' },
            { word: 'hoả hoạn', meaning: 'tai nạn cháy lớn gây thiệt hại nghiêm trọng' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Trang phục làm việc của chú lính cứu hoả gồm có những gì?',
            sampleAnswer: 'Quần áo chữa cháy chuyên dụng, ủng cao su, găng tay cách nhiệt và mũ bảo hộ.'
          },
          {
            id: 'c2',
            question: 'Em có suy nghĩ và tình cảm gì đối với các chú lính cứu hoả dũng cảm?',
            sampleAnswer: 'Em vô cùng khâm phục và biết ơn sự hy sinh, dũng cảm quên mình cứu người của các chú.'
          }
        ],
        practice: {
          dictationText: 'Chuông báo cháy vang lên. Xe cứu hoả bật đèn báo hiệu, rú còi, chạy như bay đến nơi có cháy. Các chú lính cứu hoả dùng vòi phun nước dập tắt đám cháy.'
        }
      },
      {
        id: 242,
        lessonNumber: 3,
        topicId: 8,
        topicTitle: 'Đất nước và con người',
        title: 'Bài 3: Lớn lên bạn làm gì?',
        pageRange: '152 - 154',
        warmup: {
          prompt: 'Quan sát tranh các nghề nghiệp: thuỷ thủ, đầu bếp, nông dân, bác sĩ, phi công.'
        },
        reading: {
          title: 'Lớn lên bạn làm gì?',
          author: 'Thái Dương',
          type: 'poem',
          content: [
            'Lớn lên bạn làm gì?',
            'Tớ muốn làm thuỷ thủ',
            'Lái tàu vượt sóng dữ',
            'Băng qua nhiều đại dương.',
            'Lớn lên bạn làm gì?',
            'Tớ sẽ làm đầu bếp',
            'Làm bánh ngọt thật đẹp,',
            'Nấu món mì... siêu ngon.',
            'Lớn lên bạn làm gì?',
            'À, tớ đi gieo hạt...',
            'Mỗi khi vào mùa gặt',
            'Lúa vàng reo trên đồng.',
            'Lớn lên bạn làm gì?',
            'Câu hỏi này... khó quá!',
            'Để tớ làm bài đã...',
            'Rồi ngày mai, nghĩ dần...'
          ],
          vocabulary: [
            { word: 'thuỷ thủ', meaning: 'người làm việc trên các con tàu biển lớn' },
            { word: 'sóng dữ', meaning: 'những con sóng biển cuồn cuộn dữ dội' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Các bạn nhỏ trong bài thơ ước mơ lớn lên làm những nghề gì?',
            sampleAnswer: 'Làm thuỷ thủ lái tàu vượt đại dương, làm đầu bếp nấu món ngon và làm nông dân gieo hạt gặt lúa vàng.'
          },
          {
            id: 'c2',
            question: 'Còn ước mơ nghề nghiệp mai sau của chính em là gì?',
            sampleAnswer: 'Em ước mơ trở thành cô giáo dạy chữ cho các bạn nhỏ (hoặc bác sĩ, kĩ sư, phi công...).'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng có vần at, ep, êp trong bài: hạt, đẹp, bếp'
          }
        }
      },
      {
        id: 243,
        lessonNumber: 4,
        topicId: 8,
        topicTitle: 'Đất nước và con người',
        title: 'Bài 4: Ruộng bậc thang ở Sa Pa',
        pageRange: '154 - 156',
        warmup: {
          prompt: 'Kể về cảnh đẹp vùng cao Tây Bắc với những thửa ruộng uốn lượn lưng chừng núi.'
        },
        reading: {
          title: 'Ruộng bậc thang ở Sa Pa',
          author: 'Theo vinhphuctv.vn',
          type: 'article',
          content: [
            'Đến Sa Pa vào mùa lúa chín, khách du lịch có dịp ngắm nhìn vẻ đẹp rực rỡ của những khu ruộng bậc thang. Nhìn xa, chúng giống như những bậc thang khổng lồ. Từng bậc, từng bậc như nối mặt đất với bầu trời. Một màu vàng trải dài bất tận. Đâu đâu cũng ngạt ngào hương lúa.',
            'Những khu ruộng bậc thang ở Sa Pa đã có từ hàng trăm năm nay. Chúng được tạo nên bởi đôi bàn tay chăm chỉ, cần mẫn của những người H\'mông, Dao, Hà Nhì,... sống ở đây.'
          ],
          vocabulary: [
            { word: 'ruộng bậc thang', meaning: 'ruộng được đắp thành từng bậc trên sườn đồi núi vùng cao' },
            { word: 'bất tận', meaning: 'kéo dài mãi không có điểm dừng' },
            { word: 'cần mẫn', meaning: 'siêng năng, chịu khó và kiên trì làm việc' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Vào mùa lúa chín, ruộng bậc thang ở Sa Pa có vẻ đẹp như thế nào?',
            sampleAnswer: 'Như những bậc thang khổng lồ vàng óng nối đất với trời, thơm ngạt ngào hương lúa chín.'
          },
          {
            id: 'c2',
            question: 'Ai là người đã tạo nên những kiệt tác ruộng bậc thang kì vĩ này?',
            sampleAnswer: 'Bàn tay cần mẫn, chịu khó của đồng bào các dân tộc H\'mông, Dao, Hà Nhì suốt hàng trăm năm.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'fill_letter',
            prompt: 'Chọn vần phù hợp: tờ l... (lịch), yêu th... (thích), tối m... (mịt)'
          }
        }
      },
      {
        id: 244,
        lessonNumber: 5,
        topicId: 8,
        topicTitle: 'Đất nước và con người',
        title: 'Bài 5: Nhớ ơn',
        pageRange: '156 - 158',
        warmup: {
          prompt: 'Em hiểu câu tục ngữ "Ăn quả nhớ kẻ trồng cây" muốn dạy chúng ta điều gì?'
        },
        reading: {
          title: 'Nhớ ơn',
          author: 'Đồng dao',
          type: 'poem',
          content: [
            'Ăn một bát cơm,',
            'Nhớ người cày ruộng.',
            'Ăn đĩa rau muống,',
            'Nhớ người đào ao.',
            'Ăn một quả đào,',
            'Nhớ người vun gốc.',
            'Ăn một con ốc,',
            'Nhớ người đi mò.',
            'Sang đò,',
            'Nhớ người chèo chống.',
            'Nằm võng,',
            'Nhớ người mắc dây.',
            'Đứng mát gốc cây,',
            'Nhớ người trồng trọt.'
          ],
          vocabulary: [
            { word: 'cày ruộng', meaning: 'dùng cày lật đất chuẩn bị cấy lúa' },
            { word: 'chèo chống', meaning: 'dùng mái chèo và sào đẩy thuyền vượt sông' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Bài đồng dao nhắc nhở chúng ta cần biết ơn những ai?',
            sampleAnswer: 'Biết ơn người nông dân cấy lúa trồng cây, người chèo đò, người lao động vất vả tạo ra của cải cho xã hội.'
          },
          {
            id: 'c2',
            question: 'Em cần làm gì để thể hiện lòng biết ơn đối với thầy cô và bố mẹ?',
            sampleAnswer: 'Chăm ngoan, học giỏi, lễ phép và giúp đỡ gia đình những việc vừa sức.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'find_words',
            prompt: 'Tìm tiếng cùng vần ở cuối dòng thơ: ruộng - muống, ao - đào, gốc - ốc'
          }
        }
      },
      {
        id: 245,
        lessonNumber: 6,
        topicId: 8,
        topicTitle: 'Đất nước và con người',
        title: 'Bài 6: Du lịch biển Việt Nam',
        pageRange: '158 - 163',
        warmup: {
          prompt: 'Kể tên các bãi biển đẹp của nước ta mà em biết: Sầm Sơn, Đà Nẵng, Nha Trang, Phú Quốc, Mũi Né.'
        },
        reading: {
          title: 'Du lịch biển Việt Nam',
          author: 'Cẩm Anh',
          type: 'article',
          content: [
            'Biển nước ta nơi đâu cũng đẹp. Thanh Hoá, Đà Nẵng, Khánh Hoà,... có những bãi biển nổi tiếng, được du khách yêu thích. Nhưng suốt chiều dài đất nước cũng có nhiều bãi biển còn hoang sơ.',
            'Đi biển, bạn sẽ được thoả sức bơi lội, nô đùa trên sóng, nhặt vỏ sò, xây lâu đài cát. Nếu đến Mũi Né, bạn sẽ được ngắm nhìn những đồi cát mênh mông. Cát bay làm cho hình dạng các đồi cát luôn thay đổi. Trượt cát ở đây rất thú vị.',
            'Biển là món quà kì diệu mà thiên nhiên đã ban tặng cho nước ta.'
          ],
          vocabulary: [
            { word: 'hoang sơ', meaning: 'tự nhiên nguyên vẹn, chưa có bàn tay con người khai phá nhiều' },
            { word: 'kì diệu', meaning: 'tuyệt vời lạ thường như có phép thuật màu nhiệm' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Khi đi du lịch biển, các bạn nhỏ có thể tham gia những hoạt động thú vị nào?',
            sampleAnswer: 'Bơi lội, nô đùa cùng sóng biển, nhặt vỏ ốc vỏ sò, xây lâu đài cát và trượt cát.'
          },
          {
            id: 'c2',
            question: 'Vì sao hình dạng các đồi cát ở Mũi Né luôn thay đổi?',
            sampleAnswer: 'Vì gió biển thổi làm cát bay liên tục biến đổi hình thù các đồi cát.'
          }
        ],
        practice: {
          dictationText: 'Đi biển, bạn sẽ được thoả sức bơi lội, nô đùa trên sóng hoặc nhặt vỏ sò, xây lâu đài cát. Biển là món quà kì diệu mà thiên nhiên ban tặng cho chúng ta.'
        }
      }
    ]
  },
  {
    id: 9,
    title: 'Ôn tập và Đánh giá cuối năm học',
    description: 'Tổng kết toàn diện kiến thức đọc hiểu, chính tả, kể chuyện và chào tạm biệt lớp Một.',
    icon: '🎓',
    color: 'from-purple-500 to-indigo-600',
    lessons: [
      {
        id: 246,
        lessonNumber: 1,
        topicId: 9,
        topicTitle: 'Ôn tập và Đánh giá cuối năm',
        title: 'Ôn tập Bài 1: Nhìn lại hành trình lớp 1',
        pageRange: '164 - 167',
        isReview: true,
        warmup: {
          prompt: 'Nhớ lại 8 chủ điểm đã học và kể tên câu chuyện hoặc bài thơ em thích nhất.'
        },
        reading: {
          title: 'Việt Nam quê hương ta',
          author: 'Nguyễn Đình Thi',
          type: 'poem',
          content: [
            'Việt Nam đất nước ta ơi',
            'Mênh mông biển lúa đâu trời đẹp hơn',
            'Cánh cò bay lả rập rờn',
            'Mây mờ che đỉnh Trường Sơn sớm chiều.'
          ],
          vocabulary: [
            { word: 'rập rờn', meaning: 'chao lượn nhịp nhàng chập chờn theo làn gió' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Đoạn thơ ca ngợi vẻ đẹp nào của đất nước Việt Nam?',
            sampleAnswer: 'Ca ngợi vẻ đẹp của biển lúa mênh mông, cánh cò bay lả và dãy núi Trường Sơn hùng vĩ.'
          }
        ],
        practice: {
          spellingExercise: {
            type: 'choose_sound',
            prompt: 'Phân biệt chính tả c/k, g/gh, ng/ngh trong các từ ngữ cuối năm'
          }
        }
      },
      {
        id: 247,
        lessonNumber: 2,
        topicId: 9,
        topicTitle: 'Ôn tập và Đánh giá cuối năm',
        title: 'Ôn tập Bài 2: Cảm ơn',
        pageRange: '168 - 170',
        isReview: true,
        warmup: {
          prompt: 'Sau một năm học lớp Một, em muốn gửi lời cảm ơn chân thành đến những ai?'
        },
        reading: {
          title: 'Cảm ơn',
          author: 'Theo A-mi-xi',
          type: 'article',
          content: [
            'Một tuần nữa là năm học kết thúc. Thời gian trôi qua thật nhanh. Tôi nhớ lại những chuyện đã qua. Từ tháng chín đến nay, tôi đã tiến bộ không ngừng nhờ sự giúp đỡ của nhiều người. Tôi muốn cảm ơn tất cả.',
            'Tôi muốn cảm ơn cô giáo. Nhờ sự tận tâm dạy dỗ của cô, tôi đã hiểu được nhiều điều thú vị. Tôi muốn cảm ơn các bạn. Các bạn đã cùng tôi học nhóm. Các bạn cũng giúp tôi học được cách cư xử thân thiện với mọi người. Đặc biệt tôi muốn cảm ơn bố mẹ. Bố mẹ đã dành cho tôi tình yêu thương và luôn chăm chú lắng nghe những câu chuyện ở trường của tôi.',
            'Năm học vừa qua quả là tuyệt vời đối với tôi.'
          ],
          vocabulary: [
            { word: 'tận tâm', meaning: 'hết lòng hết sức chăm lo chu đáo cho học trò' },
            { word: 'thân thiện', meaning: 'vui vẻ, cởi mở và tốt bụng với bạn bè' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Bạn nhỏ trong bài muốn gửi lời cảm ơn đến những ai?',
            sampleAnswer: 'Bạn nhỏ muốn cảm ơn cô giáo tận tâm, các bạn bè thân thiết và bố mẹ kính yêu.'
          }
        ],
        practice: {
          dictationText: 'Thời gian trôi thật nhanh. Tôi nhớ lại những chuyện đã qua. Từ đầu năm đến nay, nhờ sự giúp đỡ của nhiều người, tôi tiến bộ không ngừng. Tôi muốn cảm ơn tất cả.'
        }
      },
      {
        id: 248,
        lessonNumber: 3,
        topicId: 9,
        topicTitle: 'Ôn tập và Đánh giá cuối năm',
        title: 'Ôn tập Bài 3: Gửi lời chào lớp Một',
        pageRange: '171 - 172',
        isReview: true,
        warmup: {
          prompt: 'Cảm xúc bồi hồi khi chuẩn bị chia tay lớp Một để bước lên lớp Hai.'
        },
        reading: {
          title: 'Gửi lời chào lớp Một',
          author: 'Hữu Tưởng (phỏng theo Ma-rút-xi-a đi học)',
          type: 'poem',
          content: [
            'Lớp Một ơi! Lớp Một!',
            'Đón em vào năm trước,',
            'Nay giờ phút chia tay,',
            'Gửi lời chào tiến bước!',
            'Chào bảng đen, cửa sổ,',
            'Chào chỗ ngồi thân quen.',
            'Tất cả! Chào ở lại',
            'Đón các bạn nhỏ lên.',
            'Chào cô giáo kính mến,',
            'Cô sẽ xa chúng em...',
            'Làm theo lời cô dạy,',
            'Cô sẽ luôn ở bên.',
            'Lớp Một ơi! Lớp Một!',
            'Đón em vào năm trước,',
            'Nay giờ phút chia tay,',
            'Gửi lời chào tiến bước!'
          ],
          vocabulary: [
            { word: 'kính mến', meaning: 'kính trọng và yêu mến tha thiết' },
            { word: 'tiến bước', meaning: 'tự tin bước lên lớp học cao hơn' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Các bạn nhỏ gửi lời chào tạm biệt những ai và những đồ vật nào?',
            sampleAnswer: 'Chào bảng đen, cửa sổ, chỗ ngồi thân quen và cô giáo kính mến.'
          },
          {
            id: 'c2',
            question: 'Để cô giáo luôn ở bên cạnh mình, bạn nhỏ cần làm gì?',
            sampleAnswer: 'Luôn ghi nhớ và chăm chỉ làm theo những lời cô giáo ân cần dạy bảo.'
          }
        ],
        practice: {
          dictationText: 'Lớp Một ơi! Lớp Một! Đón em vào năm trước, Nay giờ phút chia tay, Gửi lời chào tiến bước!'
        }
      },
      {
        id: 249,
        lessonNumber: 4,
        topicId: 9,
        topicTitle: 'Ôn tập và Đánh giá cuối năm',
        title: 'Đánh giá cuối năm học: Sư tử và chuột nhắt & Ngủ ngoan',
        pageRange: '173 - 175',
        isReview: true,
        warmup: {
          prompt: 'Thực hành bài kiểm tra đọc hiểu và đọc thành tiếng cuối năm học.'
        },
        reading: {
          title: 'Sư tử và chuột nhắt',
          author: 'Theo Ê-dốp',
          type: 'story',
          content: [
            'Một con sư tử ngủ say trong rừng. Chuột nhắt chạy qua, không may đụng phải làm sư tử tỉnh giấc. Sư tử giận dữ, giơ chân chộp lấy chuột nhắt. Chuột van lạy: "Xin ông tha cho tôi. Tôi bé nhỏ thế này, ông ăn chẳng bõ dính răng. Có ngày tôi sẽ trả ơn ông". Nghe vậy, sư tử bật cười: "Chuột mà cũng đòi giúp được sư tử sao?". Nghĩ một lát, nó tha cho chuột.',
            'Ít lâu sau, sư tử bị sa lưới thợ săn. Nó vùng vẫy hết sức mà không sao thoát được, đành nằm chờ chết. May sao, chuột đi qua trông thấy liền chạy về gọi cả nhà ra cắn đứt hết lưới. Nhờ thế, sư tử thoát nạn.'
          ],
          vocabulary: [
            { word: 'sa lưới', meaning: 'bị mắc kẹt vào bẫy lưới thợ săn' },
            { word: 'đền ơn', meaning: 'trả ơn cứu mạng đã nhận khi xưa' }
          ]
        },
        comprehensionQuestions: [
          {
            id: 'c1',
            question: 'Khi sư tử bị sa vào lưới thợ săn, chuột nhắt đã cứu sư tử bằng cách nào?',
            sampleAnswer: 'Chuột nhắt gọi cả đàn chuột ra dùng răng cắn đứt các mắt lưới cứu sư tử thoát nạn.'
          },
          {
            id: 'c2',
            question: 'Câu chuyện khuyên chúng ta bài học gì?',
            sampleAnswer: 'Đừng coi thường người nhỏ bé, ai cũng có giá trị và luôn biết giữ lời hứa giúp đỡ nhau.'
          }
        ],
        practice: {
          dictationText: 'Ngủ ngoan / Hoa cau đã nở / Hương giăng khắp vườn / Vang ngân tiếng dế / Cỏ mềm ngậm sương.'
        }
      }
    ]
  }
];

export function getVolume2LessonById(id: number): Volume2Lesson | undefined {
  for (const group of TOPIC_GROUPS) {
    const found = group.lessons.find(l => l.id === id);
    if (found) return found;
  }
  return undefined;
}
