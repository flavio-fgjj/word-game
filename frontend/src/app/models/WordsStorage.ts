import { Words } from './Words';

export class WordsStorage {
  date: Date;
  actual: number;
  success: number;
  errors: number;
  score: number;
  words: Array<Words>;
}
