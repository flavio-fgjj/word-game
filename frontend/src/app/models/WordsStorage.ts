import { Attempts } from './Attempts';
import { Words } from './Words';

export class WordsStorage {
  date: Date;
  actual: number;
  success: number;
  errors: number;
  score: number;
  current_score: number;
  attempts: Array<Attempts>;
  words: Array<Words>;
}
