import { Volume1Lesson } from '../types';
import { LESSONS_PART_1 } from './lessonsVolume1_part1';
import { LESSONS_PART_2 } from './lessonsVolume1_part2';
import { LESSONS_PART_3 } from './lessonsVolume1_part3';

export const VOLUME_1_LESSONS: Volume1Lesson[] = [
  ...LESSONS_PART_1,
  ...LESSONS_PART_2,
  ...LESSONS_PART_3
];

export function getVolume1LessonById(id: number): Volume1Lesson | undefined {
  return VOLUME_1_LESSONS.find(l => l.id === id);
}

export function searchVolume1Lessons(query: string): Volume1Lesson[] {
  const q = query.toLowerCase().trim();
  if (!q) return VOLUME_1_LESSONS;
  return VOLUME_1_LESSONS.filter(l => 
    l.title.toLowerCase().includes(q) ||
    l.lessonNumber.toString() === q ||
    l.part1_Letters.letters.some(letter => letter.toLowerCase().includes(q)) ||
    l.part2_SyllablesAndWords.words.some(w => w.word.toLowerCase().includes(q)) ||
    l.part3_SentenceAndPractice.readingPassage.toLowerCase().includes(q)
  );
}
