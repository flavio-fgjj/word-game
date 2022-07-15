import { WordsStorage } from '../models/WordsStorage';

export class SecurityUtil {
  public static set(words: WordsStorage) {
    this.clear();
    const data = JSON.stringify(words);
    localStorage.setItem('letrando', btoa(data));
  }

  public static get(): WordsStorage {
    const data = localStorage.getItem('letrando');
    if (data) {
      const words = JSON.parse(atob(data));
      return words;
      //return words.data;
    } else {
      return null;
    }
  }

  public static clear() {
    localStorage.removeItem('letrando');
  }
}
