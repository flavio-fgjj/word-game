import { Words } from './Words';

export class WordsStorage {
  date: Date;
  actual: number;
  success: number;
  errors: number;
  words: Array<Words>;
}
