import { OnInit, AfterViewInit, Component } from '@angular/core';
import { LoadingController, AlertController, ModalController, Platform } from '@ionic/angular';
import { modalController } from '@ionic/core';

import { Words } from 'src/app/models/Words';
import { WordsStorage } from 'src/app/models/WordsStorage';
import { Attempts } from 'src/app/models/Attempts';
// import { Success } from 'src/app/models/Success';

import { DataService } from 'src/app/services/data.service';
import { SecurityUtil } from 'src/app/utils/security.utils';

import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { SuccessComponent } from 'src/app/components/success/success.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  public keyboardFirstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  public keyboardSecondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  public keyboardThirdRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  public wordArray: string[];
  public partialWordTyped: string[];
  public words: Array<Words>;
  public wordsStorage: WordsStorage;
  public guessedWords = [[]];
  public availableSpace = 1;

  public wordObj: Words = null;

  public guessedWordCount = 0;

  public limitAttemptsArray: string[] = [];
  public limitAttempts = 5;
  public actual = 0;
  public statusAttempt = '';
  public actualWordArray = 0;

  public wordSquares = [];
  public keys: any = null;

  public errorMessage: string = null;

  public fs2 = '0';

  public word: string = null;
  public currentWord: string = null;
  public meaning: string = null;
  public grammaticalClass: string = null;
  public syn: string[] = [];
  public ant: string[] = [];
  public phrase: string[] = [];
  public author: string = null;
  public font: string = null;

  public errorPage = false;
  public alreadyStarted = false;
  public readyToGo = false;
  public auxValidation = false;

  public totalSuccess = 0;
  public totalErrors = 0;
  public actualWord = 0;
  public score = 0;
  public totalScore = 0;

  public attempts: Attempts;
  public attemptsArray: Array<Attempts>;

  public meaningSeen = false;
  public synSeen = false;
  public phraseSeen = false;

  public isMobilePlatform = false;

  constructor(
    private loadingCtrl: LoadingController,
    private service: DataService,
    private alertController: AlertController,
    public modalCtrl: ModalController,
    public platform: Platform) {}

  async ngAfterViewInit() {
    const loading = await this.loadingCtrl.create({ message: 'Iniciando...' });
    loading.present();

    this.wordsStorage = SecurityUtil.get();
    if(this.wordsStorage) {
      const storageDate = new Date(this.wordsStorage.date);
      const today = new Date();
      if((storageDate.getDate() === today.getDate()
        && storageDate.getMonth() === today.getMonth()
        && storageDate.getFullYear() === today.getFullYear()) && this.wordsStorage.words.length > 0) {
          this.startFromStorage();
          loading.dismiss();
          return;
      } else {
        SecurityUtil.clear();
      }
    }
    this.startFromStorage();

    loading.dismiss();
  }

  async ngOnInit() {
    // this.wordArray = ['Flavio', 'Estela', 'Joao', 'Teo'];
    // this.startSquare();

    // check if platform is mobile
    for (const item of this.platform.platforms()) {
      this.isMobilePlatform = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(item);
    }

    for (let j = 1; j <= this.limitAttempts; j++) {
      this.limitAttemptsArray.push(j.toString());
    }
  }

  async getWords() {
    this.words = new Array<Words>();

    this
      .service
      .getWords()
      .subscribe(async response => {
        this.words = response.data.words;

        this.words = this.words.filter(x => x.word !== null).slice(0, 7);

        if (this.words.length === 0) {
          this.errorPage = true;
        } else {
          this.wordsStorage = new WordsStorage();
          this.attempts = new Attempts();
          this.attemptsArray = new Array<Attempts>();
          this.wordsStorage.date = new Date();
          this.wordsStorage.actual = 1;
          this.wordsStorage.success = 0;
          this.wordsStorage.errors = 0;
          this.wordsStorage.score = 5;
          this.wordsStorage.current_score = 5;
          this.wordsStorage.words = this.words;
          this.wordsStorage.attempts = this.attemptsArray;
          SecurityUtil.set(this.wordsStorage);

          await this.startFromStorage();
        }
      });
  }

  async startFromStorage() {
    this.wordsStorage = new WordsStorage();
    this.wordsStorage = SecurityUtil.get();

    if (this.wordsStorage) {
      this.words = this.wordsStorage.words;

      this.words = this.words.filter(x => x.word !== null);

      this.totalSuccess = this.wordsStorage.success;
      this.totalErrors = this.wordsStorage.errors;

      this.totalScore = this.wordsStorage.score;
      //this.score = 5;
      this.statusAttempt = '';

      this.attemptsArray = this.wordsStorage.attempts;
      this.wordObj = null;
      this.word = '';
      this.meaning = '';
      this.actualWord = this.wordsStorage.actual;
      this.score = this.wordsStorage.current_score;
      this.wordObj = this.words[this.wordsStorage.actual - 1];

      const loading = await this.loadingCtrl.create({ message: 'Iniciando...' });
      loading.present();
      await this.startSquare();
      setTimeout(async () => {
        await this.attempsFromStorage();
        if(this.attemptsArray.length) {
          this.actual++;
        }
        loading.dismiss();
      }, 2000);
    } else {
      this.start();
    }
  }

  async start() {
    const loading = await this.loadingCtrl.create({ message: 'Buscando as palavras do dia...' });
    loading.present();

    await this.getWords();

    loading.dismiss();
  }

  async startSquare() {
    this.partialWordTyped = [];
    this.auxValidation = false;
    this.currentWord = '';
    this.word = this.wordObj.word.toString().toLowerCase();
    this.meaning = this.wordObj.meaning;

    // convert grammatical class in pascal case
    this.grammaticalClass = '';
    const g = this.wordObj.grammatical_class.split(' ');
    g.forEach(x => {
      const result = x;
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      this.grammaticalClass += finalResult + ' ';
    });
    this.grammaticalClass = this.grammaticalClass.toString().trim();

    this.syn = this.wordObj.synonyms;
    this.ant = this.wordObj.antonyms;

    this.author = this.wordObj.phrase.author;
    this.phrase = this.wordObj.phrase.phrase.toString().split('/');
    this.font = this.wordObj.phrase.font;

    this.alreadyStarted = true;

    this.createSquares();
    this.keys = document.querySelectorAll('.keyboard-row button');

    // fill words already typeds
    //this.actual = 1;
    this.actual = this.attemptsArray.length === 0 ? 1 : this.attemptsArray.length;

    this.limitAttempts = 5;
    this.statusAttempt = '';
  }

  async attempsFromStorage() {
    let currentWordArr;
    let letterE1Aux;
    let letter;

    for(let tryId = 1; tryId <= this.attemptsArray.length; tryId++) {
      this.currentWord = this.attemptsArray[tryId - 1].typed_word;
      this.partialWordTyped = [];
      currentWordArr = this.attemptsArray[tryId - 1].typed_word.split('');

      for(let i = 1; i <= currentWordArr.length; i ++) {
        letter = currentWordArr[i - 1];
        const tileColor = this.getTileColor(letter.toString().toLowerCase().trim(), i - 1);
        letterE1Aux = document.getElementById(`${i.toString()}_try${(tryId.toString())}`);

        letterE1Aux.classList.add('animate__flipInX');
        if (tileColor === 'rgb(58, 58, 60)') {
          letterE1Aux.setAttribute('style', 'opacity: 0.33;');
        }
        letterE1Aux.setAttribute('style', `background-color:${tileColor};border-color:${tileColor};color:whitesmoke;`);
        letterE1Aux.innerText = letter.toString().toUpperCase();
      }
    }
  }

  createSquares() {
    this.wordSquares = [];
    for (let index = 0; index < this.word.length; index++) {
      this.wordSquares.push({
        id: (index + 1).toString(),
      });
    }
  }

  // alerts and modals handles
  async showShareOptions() {
    const modal = await this.modalCtrl.create({
      component: SocialShareComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true,
    });
    return await modal.present();
  }

  async showSuccessModal(thisType: string) {
    const modal = await this.modalCtrl.create({
      component: SuccessComponent,
      componentProps: {
        attempts: this.actual,
        author: this.author,
        font: this.font,
        phrase: this.phrase,
        word: this.word,
        type: thisType
      },
      cssClass: 'custom-modal-success',
      backdropDismiss: true,
    });
    return await modal.present();
  }

  async handleMeaningButtonClick() {
    const alert = await this.alertController.create({
      header: ``,
      message: `
        <h3 class="grammaticalClass" style="text-align: center;">${this.grammaticalClass}</h3>
        <h4 class="meaning" style="text-align: center;">${this.meaning != null ? this.meaning : ''}</h4>
      `,
      buttons: ['', 'Ok'],
    });

    await alert.present();
  }

  async handleWrongMsg(h, msg) {
    const alert = await this.alertController.create({
      header: `${h}`,
      cssClass:'alertLimitExceeded',
      subHeader: `${msg}`,
      message: ``,
      buttons: ['OK']
    });

    await alert.present();
  }
  // alerts handles end

  // functions
  getTileColor(letter, index) {
    this.partialWordTyped.push(letter);

    console.log(this.currentWord);
    const totalWordsFromCurrent = this.currentWord.split('').reduce((group, item) => {
      if(item === letter) {
        group.push(item);
      }
      return group;
    }, []);

    const totalWordsFromWord = this.word.split('').reduce((group, item) => {
      if(item === letter) {
        group.push(item);
      }
      return group;
    }, []);

    const isCorrectLetter = this.word.toString().toLowerCase().trim().includes(letter);

    if (!isCorrectLetter) {
      return 'rgb(58, 58, 60)';
    }

    const letterInThatPosition = this.word.toString().toLowerCase().trim().charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return '#32cd32';
    } else if ((totalWordsFromCurrent.length > totalWordsFromWord.length) && !this.auxValidation) {
      this.auxValidation = true;
      return 'rgb(58, 58, 60)';
    }

    return '#EEAD2D';
  }

  getCurrentWordArr() {
    const numberOfGuessedWords = this.guessedWords.length;
    return this.guessedWords[numberOfGuessedWords - 1];
  }

  closeModal() {
    modalController.dismiss();
  }

  fnMeaningSeen() {
    if(this.alreadyStarted) {
      this.score -= 1;
      this.meaningSeen = true;
    }
  }

  fnSynSeen() {
    if(this.alreadyStarted) {
      this.score -= 1.5;
      this.synSeen = true;
    }
  }

  fnPhraseSeen() {
    if(this.alreadyStarted) {
      this.score -= 2;
      this.phraseSeen = true;
    }
  }
  // functions end

  // keyboard handles
  updateGuessedWords(event) {
    const letter = event.target.innerText;
    const currentWordArr = this.getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < this.word.length) {
      currentWordArr.push(letter);

      this.availableSpace = this.availableSpace + 1;

      document.getElementById(`${String(this.availableSpace - 1)}_try${this.actual}`).textContent = letter;
    }
  }

  handleDeleteLetter() {
    const currentWordArr = this.getCurrentWordArr();
    if(currentWordArr.length > 0) {
      currentWordArr.pop();
      this.guessedWords[this.guessedWords.length - 1] = currentWordArr;
      document.getElementById(`${String(this.availableSpace - 1)}_try${this.actual}`).textContent = '';
      this.availableSpace = this.availableSpace - 1;
    }
  }

  async wordValidation(word): Promise<boolean> {
    let ret = true;
    class ValidWordOutput {
      status: string;
      message: string;
    };

    await this
      .service
      .wordValidation(word)
      .then((value: ValidWordOutput) => {
        if (value.status === 'NOK') {
          ret = false;
        }
      })
      .catch((err) => {
        console.log(err);
        ret = false;
      });

    return ret;
  }

  async handleSubmitWord() {
    this.auxValidation = false;
    this.partialWordTyped = [];
    const currentWordArr = this.getCurrentWordArr();

    if (currentWordArr.length !== this.word.length) {
      this.handleWrongMsg('A palavra deve ter', `${this.word.length} letras`);
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Validando a palavra digitada...' });
    loading.present();

    this.currentWord = currentWordArr.join('').toString().toLowerCase().trim();

    // eslint-disable-next-line max-len
    if(this.wordsStorage.attempts.filter(x => x.typed_word.toString().toLowerCase() === this.currentWord.toString().toLowerCase()).length > 0) {
      this.handleWrongMsg('Erro!', 'Palavra já digitada!');
      loading.dismiss();
      return;
    }

    const isWordValid = await this.wordValidation(this.currentWord);

    if(!isWordValid) {
      this.handleWrongMsg('Erro!', 'Palavra inválida!');
      loading.dismiss();
      return;
    }

    loading.dismiss();

    const firstLetterId = this.guessedWordCount * this.word.length + 1;
    const interval = 200;

    let letterE1Aux;

    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = this.getTileColor(letter.toString().toLowerCase().trim(), index);
        const letterId = firstLetterId + index;

        if (this.statusAttempt === 'success' || this.statusAttempt === 'fail') {
          letterE1Aux = document.getElementById(`${letterId.toString()}_try${(this.actual)}`);
        } else {
          letterE1Aux = document.getElementById(`${letterId.toString()}_try${(this.actual - 1)}`);
        }
        letterE1Aux.classList.add('animate__flipInX');
        if (tileColor === 'rgb(58, 58, 60)') {
          document.getElementById(`${letter.toString().toLowerCase().trim()}`).setAttribute('style', 'opacity: 0.33;');
        }
        letterE1Aux.setAttribute('style', `background-color:${tileColor};border-color:${tileColor};color:whitesmoke;`);

      }, interval * index);
    });

    this.guessedWordCount += 1;

    if (this.currentWord.toString().toLowerCase().trim() === this.word.toString().toLowerCase().trim()) {
      this.statusAttempt = 'success';
      this.totalSuccess += 1;

      this.wordsStorage = SecurityUtil.get();
      this.wordsStorage.actual += 1;
      this.wordsStorage.success += 1;
      //this.wordsStorage.attempts += this.actual;
      this.wordsStorage.attempts = new Array<Attempts>();
      this.wordsStorage.score += this.score;
      SecurityUtil.clear();
      SecurityUtil.set(this.wordsStorage);

      //this.handleSuccess();
      this.showSuccessModal(this.statusAttempt);
      return;
    } else {
      if(this.actual === this.limitAttempts) {
        this.statusAttempt = 'fail';
        this.totalErrors += 1;

        this.wordsStorage = SecurityUtil.get();
        this.wordsStorage.actual += 1;
        this.wordsStorage.errors += 1;
        // this.wordsStorage.attempts += this.actual;
        this.wordsStorage.attempts = new Array<Attempts>();

        SecurityUtil.clear();
        SecurityUtil.set(this.wordsStorage);

        //this.handleLimitExceeded();
        this.showSuccessModal(this.statusAttempt);
        return;
      } else {
        const a = new Attempts();
        a.typed_word = this.currentWord.toString().toLowerCase().trim();
        a.total_attempts = this.actual;
        a.word = this.word;
        this.wordsStorage.attempts.push(a);
        SecurityUtil.clear();
        SecurityUtil.set(this.wordsStorage);

        this.statusAttempt = '';
        this.guessedWords.push([]);
        this.availableSpace = 1;
        this.guessedWordCount = 0;
      }

      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(`${letterId.toString()}_try${(this.actual)}`);
          letterEl.classList.remove('animate__flipInX');
          letterEl.removeAttribute('style');
          letterEl.textContent = '';
        }, interval * index);
      });

      this.actual++;
    }
  }

}
