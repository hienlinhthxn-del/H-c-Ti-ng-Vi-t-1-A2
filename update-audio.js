const fs = require('fs');
const path = require('path');
const p1 = path.join(__dirname, 'src/components/Volume1LessonView.tsx');
let c1 = fs.readFileSync(p1, 'utf8');

c1 = c1.replace(
  'const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string) => {',
  'const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string, section?: \\'letter\\' | \\'syllable\\' | \\'word\\' | \\'sentence\\' | \\'passage\\' | \\'quiz\\' | \\'general\\') => {'
);
c1 = c1.replace(
  'sectionTitle\\n      });',
  'sectionTitle,\\n        section\\n      });'
);

c1 = c1.replace(
  /handleTeacherRecordClick\\(e, letter, \\\Ã‚m \\/ Váº§n: \\\\?\\$\\\\{letter\\\\}\\\\\)/g,
  "handleTeacherRecordClick(e, letter, \\\Ã‚m / Váº§n: \\\\?\\$\\\\{letter\\\\}\\\, 'letter')"
);
c1 = c1.replace(
  /hasAudioForText\\(letter\\)/g,
  "hasAudioForText(letter, 'letter')"
);
c1 = c1.replace(
  /speechService\\.speak\\(letter\\)/g,
  "speechService.speak(letter, undefined, undefined, 'letter')"
);

c1 = c1.replace(
  /handleTeacherRecordClick\\(e, syl, \\\Tiáº¿ng: \\\\?\\$\\\\{syl\\\\}\\\\\)/g,
  "handleTeacherRecordClick(e, syl, \\\Tiáº¿ng: \\\\?\\$\\\\{syl\\\\}\\\, 'syllable')"
);
c1 = c1.replace(
  /hasAudioForText\\(syl\\)/g,
  "hasAudioForText(syl, 'syllable')"
);
c1 = c1.replace(
  /speechService\\.speak\\(syl\\)/g,
  "speechService.speak(syl, undefined, undefined, 'syllable')"
);

c1 = c1.replace(
  /handleTeacherRecordClick\\(e, item\\.word, \\\Tá»« ngá»¯: \\\\?\\$\\\\{item\\.word\\\\}\\\\\)/g,
  "handleTeacherRecordClick(e, item.word, \\\Tá»« ngá»¯: \\\\?\\$\\\\{item.word\\\\}\\\, 'word')"
);
c1 = c1.replace(
  /hasAudioForText\\(item\\.word\\)/g,
  "hasAudioForText(item.word, 'word')"
);
c1 = c1.replace(
  /speechService\\.speak\\(item\\.word\\)/g,
  "speechService.speak(item.word, undefined, undefined, 'word')"
);

c1 = c1.replace(
  /handleTeacherRecordClick\\(e, sentence, \\\CÃ¢u \\\\?\\$\\\\{sIdx \\+ 1\\\\}: \\\\?\\$\\\\{sentence\\.substring\\(0, 30\\)\\\\}\\\.\\.\\.\\\\\)/g,
  "handleTeacherRecordClick(e, sentence, \\\CÃ¢u \\\\?\\$\\\\{sIdx + 1\\\\}: \\\\?\\$\\\\{sentence.substring(0, 30)\\\\}\\\.\\.\\.\\\, 'sentence')"
);
c1 = c1.replace(
  /hasAudioForText\\(sentence\\)/g,
  "hasAudioForText(sentence, 'sentence')"
);
c1 = c1.replace(
  /speechService\\.speak\\(sentence\\)/g,
  "speechService.speak(sentence, undefined, undefined, 'sentence')"
);

c1 = c1.replace(
  /handleTeacherRecordClick\\(e, lesson\\.part3_SentenceAndPractice\\.readingPassage, 'ToÃ n bá»™ Ä‘oáº¡n vÄƒn'\\)/g,
  "handleTeacherRecordClick(e, lesson.part3_SentenceAndPractice.readingPassage, 'ToÃ n bá»™ Ä‘oáº¡n vÄƒn', 'passage')"
);
c1 = c1.replace(
  /hasAudioForText\\(lesson\\.part3_SentenceAndPractice\\.readingPassage\\)/g,
  "hasAudioForText(lesson.part3_SentenceAndPractice.readingPassage, 'passage')"
);
c1 = c1.replace(
  /speechService\\.speak\\(lesson\\.part3_SentenceAndPractice\\.readingPassage\\)/g,
  "speechService.speak(lesson.part3_SentenceAndPractice.readingPassage, undefined, undefined, 'passage')"
);

fs.writeFileSync(p1, c1, 'utf8');

const p2 = path.join(__dirname, 'src/components/Volume2LessonView.tsx');
let c2 = fs.readFileSync(p2, 'utf8');

c2 = c2.replace(
  'const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string) => {',
  'const handleTeacherRecordClick = (e: React.MouseEvent, text: string, sectionTitle: string, section?: \\'letter\\' | \\'syllable\\' | \\'word\\' | \\'sentence\\' | \\'passage\\' | \\'quiz\\' | \\'general\\') => {'
);
c2 = c2.replace(
  'sectionTitle\\n      });',
  'sectionTitle,\\n        section\\n      });'
);

c2 = c2.replace(
  /handleTeacherRecordClick\\(e, \\\\\\\?\\$\\\\{lesson\\.reading\\.title\\\\}\\\. \\\\?\\$\\\\{lesson\\.reading\\.content\\.join\\(' '\\)\\\\}\\\, 'ToÃ n bá»™ bÃ i Ä‘á» c'\\)/g,
  "handleTeacherRecordClick(e, \\\\\\\?\\$\\\\{lesson.reading.title\\\\}\\\. \\\\?\\$\\\\{lesson.reading.content.join(' ')\\\}\\\, 'ToÃ n bá»™ bÃ i Ä‘á» c', 'passage')"
);
c2 = c2.replace(
  /hasAudioForText\\(paragraph\\)/g,
  "hasAudioForText(paragraph, 'passage')"
);
c2 = c2.replace(
  /speechService\\.speak\\(paragraph\\)/g,
  "speechService.speak(paragraph, undefined, undefined, 'passage')"
);
c2 = c2.replace(
  /handleTeacherRecordClick\\(e, paragraph, \\\Ä oáº¡n \\\\?\\$\\\\{idx \\+ 1\\\\}: \\\\?\\$\\\\{paragraph\\.substring\\(0, 30\\)\\\\}\\\.\\.\\.\\\\\)/g,
  "handleTeacherRecordClick(e, paragraph, \\\Ä oáº¡n \\\\?\\$\\\\{idx + 1\\\\}: \\\\?\\$\\\\{paragraph.substring(0, 30)\\\\}\\\.\\.\\.\\\, 'passage')"
);

c2 = c2.replace(
  /hasAudioForText\\(vocab\\.word\\)/g,
  "hasAudioForText(vocab.word, 'word')"
);
c2 = c2.replace(
  /speechService\\.speak\\(vocab\\.word\\)/g,
  "speechService.speak(vocab.word, undefined, undefined, 'word')"
);
c2 = c2.replace(
  /handleTeacherRecordClick\\(e, vocab\\.word, \\\Tá»« vá»±ng: \\\\?\\$\\\\{vocab\\.word\\\\}\\\\\)/g,
  "handleTeacherRecordClick(e, vocab.word, \\\Tá»« vá»±ng: \\\\?\\$\\\\{vocab.word\\\\}\\\, 'word')"
);

fs.writeFileSync(p2, c2, 'utf8');
