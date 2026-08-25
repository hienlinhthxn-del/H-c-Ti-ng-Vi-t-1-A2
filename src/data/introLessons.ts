export interface IntroSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  items: {
    title: string;
    description: string;
    symbol?: string;
    sampleWords?: string[];
    audioText?: string;
  }[];
}

export const INTRO_SECTIONS: IntroSection[] = [
  {
    id: 'school-life',
    title: '1. Làm quen với trường lớp, bạn bè',
    subtitle: 'Chào em vào lớp 1',
    description: 'Các bạn nhỏ cùng nhau làm quen với thầy cô, bạn bè, lớp học mới.',
    items: [
      {
        title: 'Chào hỏi bạn mới',
        description: 'Bạn Nam và bạn Hà gặp nhau ở sân trường và làm quen cùng các bạn.',
        audioText: 'Xin chào các bạn, mình tên là Nam. Rất vui được làm quen với bạn!'
      },
      {
        title: 'Trường tiểu học thân yêu',
        description: 'Ngôi trường rực rỡ cờ hoa, lớp học sạch đẹp đón chào các em học sinh lớp 1.',
        audioText: 'Trường học của em khang trang và tươi đẹp.'
      }
    ]
  },
  {
    id: 'school-tools',
    title: '2. Làm quen với đồ dùng học tập',
    subtitle: 'Tên gọi và công dụng của đồ dùng học tập',
    description: 'Nhận biết các đồ dùng học tập hàng ngày của học sinh lớp 1.',
    items: [
      { title: 'Sách Tiếng Việt 1', description: 'Giúp em học chữ cái, đánh vần, đọc bài và viết câu.', symbol: '📖', audioText: 'Sách giáo khoa Tiếng Việt 1' },
      { title: 'Vở ô li', description: 'Dùng để em tập viết từng nét chữ nắn nót, xinh xắn.', symbol: '📝', audioText: 'Vở ô li bốn ô vuông chuẩn' },
      { title: 'Bút chì', description: 'Dùng để em viết chữ, vẽ tranh và làm bài tập.', symbol: '✏️', audioText: 'Bút chì đen 2B' },
      { title: 'Cục tẩy (Gôm)', description: 'Giúp em tẩy sạch những nét viết sai hoặc chưa đẹp.', symbol: '🧹', audioText: 'Cục tẩy gôm' },
      { title: 'Thước kẻ', description: 'Dùng để kẻ đường thẳng ngay ngắn, đo độ dài.', symbol: '📏', audioText: 'Thước kẻ centimet' },
      { title: 'Bảng con và phấn trắng', description: 'Dùng để luyện viết chữ, làm bài nhanh trên lớp.', symbol: '⬛', audioText: 'Bảng con và hộp phấn' },
      { title: 'Hộp bút', description: 'Đựng bút, thước, tẩy gọn gàng trong cặp sách.', symbol: '👝', audioText: 'Hộp bút học sinh' }
    ]
  },
  {
    id: 'postures',
    title: '3. Tư thế đọc, viết, nói và nghe chuẩn',
    subtitle: 'Rèn luyện thói quen học tập đúng cách',
    description: 'Tư thế ngồi học chuẩn giúp bảo vệ cột sống và mắt của em.',
    items: [
      {
        title: 'Tư thế ngồi đọc sách',
        description: 'Ngồi thẳng lưng, hai chân vuông góc với sàn, đầu hơi cúi, giữ khoảng cách mắt đến sách 25 - 30cm.',
        symbol: '🪑',
        audioText: 'Ngồi thẳng lưng, ngực không tì vào bàn, mắt cách sách khoảng 25 đến 30 xăng-ti-mét.'
      },
      {
        title: 'Tư thế ngồi viết bài',
        description: 'Lưng thẳng, ngực không tì vào mép bàn, tay trái giữ mép vở, tay phải cầm bút bằng 3 ngón tay.',
        symbol: '✍️',
        audioText: 'Cầm bút bằng ba ngón tay: ngón cái, ngón trỏ và ngón giữa. Cổ tay linh hoạt.'
      },
      {
        title: 'Tư thế nói và nghe',
        description: 'Khi phát biểu đứng thẳng, nói to rõ ràng. Khi lắng nghe nhìn cô giáo và bạn với ánh mắt tập trung.',
        symbol: '👂',
        audioText: 'Lắng nghe chăm chú, tự tin giơ tay phát biểu rõ ràng.'
      }
    ]
  },
  {
    id: 'basic-strokes',
    title: '4. Làm quen với các nét viết cơ bản',
    subtitle: 'Nền tảng để viết đẹp từng con chữ',
    description: 'Luyện nhận diện và tập vẽ các nét cơ bản trong Tiếng Việt.',
    items: [
      { title: 'Nét ngang', description: 'Đường thẳng nằm ngang từ trái sang phải: —', symbol: '—', audioText: 'Nét ngang' },
      { title: 'Nét sổ (thẳng đứng)', description: 'Đường thẳng đứng kéo từ trên xuống dưới: |', symbol: '|', audioText: 'Nét sổ' },
      { title: 'Nét xiên phải', description: 'Kéo xiên từ trên xuống nghiêng sang phải: /', symbol: '/', audioText: 'Nét xiên phải' },
      { title: 'Nét xiên trái', description: 'Kéo xiên từ trên xuống nghiêng sang trái: \\', symbol: '\\', audioText: 'Nét xiên trái' },
      { title: 'Nét móc xuôi', description: 'Bắt đầu từ dưới cong lên rồi kéo thẳng xuống: ⌢', symbol: '⌢', audioText: 'Nét móc xuôi' },
      { title: 'Nét móc ngược', description: 'Kéo thẳng từ trên xuống rồi uốn cong móc lên: ⌣', symbol: '⌣', audioText: 'Nét móc ngược' },
      { title: 'Nét móc hai đầu', description: 'Kết hợp nét móc xuôi và nét móc ngược: ∿', symbol: '∿', audioText: 'Nét móc hai đầu' },
      { title: 'Nét cong hở phải', description: 'Đường cong hở về phía bên phải giống chữ c: C', symbol: '⊂', audioText: 'Nét cong hở phải' },
      { title: 'Nét cong hở trái', description: 'Đường cong hở về phía bên trái: ⊃', symbol: '⊃', audioText: 'Nét cong hở trái' },
      { title: 'Nét cong kín', description: 'Vòng tròn khép kín như quả trứng: O', symbol: 'O', audioText: 'Nét cong kín' },
      { title: 'Nét khuyết trên', description: 'Móc lên trên dùng cho chữ h, k, l, b: ⌠', symbol: '⌠', audioText: 'Nét khuyết trên' },
      { title: 'Nét khuyết dưới', description: 'Móc xuống dưới dùng cho chữ g, y: ⌡', symbol: '⌡', audioText: 'Nét khuyết dưới' },
      { title: 'Nét thắt trên', description: 'Uốn lượn thắt ở đầu dùng cho chữ r, s, v: ꭍ', symbol: 'ꭍ', audioText: 'Nét thắt trên' }
    ]
  },
  {
    id: 'tones-and-alphabet',
    title: '5. Bảng chữ cái và 5 dấu thanh Tiếng Việt',
    subtitle: 'Nhận diện thanh điệu và 29 chữ cái',
    description: 'Học 5 dấu thanh: huyền, sắc, hỏi, ngã, nặng và 29 chữ cái.',
    items: [
      { title: 'Thanh ngang (Không dấu)', description: 'Tiếng có thanh bằng phẳng (ví dụ: ba, ca, ma, ta)', symbol: 'a', audioText: 'Thanh ngang, ví dụ: ba, ca' },
      { title: 'Dấu huyền ( ` )', description: 'Đặt trên nguyên âm, giọng trầm xuống (ví dụ: bà, cà, mà)', symbol: 'à', audioText: 'Dấu huyền, ví dụ: bà, cà' },
      { title: 'Dấu sắc ( / )', description: 'Đặt trên nguyên âm, giọng cao vút (ví dụ: bá, cá, má)', symbol: 'á', audioText: 'Dấu sắc, ví dụ: bá, cá' },
      { title: 'Dấu hỏi ( ? )', description: 'Đặt trên nguyên âm, giọng hơi lượn (ví dụ: bả, cả, mả)', symbol: 'ả', audioText: 'Dấu hỏi, ví dụ: bả, cả' },
      { title: 'Dấu ngã ( ~ )', description: 'Đặt trên nguyên âm, giọng ngân lượn gãy (ví dụ: bã, cã, mã)', symbol: 'ã', audioText: 'Dấu ngã, ví dụ: bã, mã' },
      { title: 'Dấu nặng ( . )', description: 'Đặt dưới nguyên âm, giọng dứt khoát ngắn (ví dụ: bạ, cạ, mạ)', symbol: 'ạ', audioText: 'Dấu nặng, ví dụ: bạ, mạ' }
    ]
  }
];
