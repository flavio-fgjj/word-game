export class Words {
  word: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  grammatical_class: string;
  meaning: string;
  synonyms: [string];
  antonyms: [string];
  phrase: {
    author: string;
    phrase: string;
    font: string;
  };
}
