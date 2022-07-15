import { Attempts } from './Attempts';
import { Status } from './Status';
import { Words } from './Words';

export class WordsStorage {
  date: Date;
  actual: number;
  success: number;
  errors: number;
  score: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  current_score: number;
  attempts: Array<Attempts>;
  average: number;
  words: Array<Words>;
  status: Array<Status>;
}
