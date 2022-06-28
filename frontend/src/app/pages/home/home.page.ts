import { AfterViewInit, OnInit , Component } from '@angular/core';
import { LoadingController, AlertController, ModalController, Platform } from '@ionic/angular';
import { modalController } from '@ionic/core';

import { Words } from 'src/app/models/Words';
import { WordsStorage } from 'src/app/models/WordsStorage';
import { DataService } from 'src/app/services/data.service';
import { SecurityUtil } from 'src/app/utils/security.utils';

import { SocialShareComponent } from 'src/app/components/social-share/social-share.component';
import { SuccessComponent } from 'src/app/components/success/success.component';
import { Success } from 'src/app/models/Success';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements  OnInit {

  public keyboardFirstRow = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  public keyboardSecondRow = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  public keyboardThirdRow = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  public wordArray: string[];
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

  public totalSuccess = 0;
  public totalErrors = 0;
  public actualWord = 0;
  public score = 0;
  public totalScore = 0;
  public attempts = 0;

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
      } else {
        SecurityUtil.clear();
      }
    }
    this.startFromStorage();

    loading.dismiss();
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
          this.wordsStorage.date = new Date();
          this.wordsStorage.actual = 1;
          this.wordsStorage.success = 0;
          this.wordsStorage.errors = 0;
          this.wordsStorage.score = 0;
          this.wordsStorage.attempts = 0;
          this.wordsStorage.words = this.words;
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
      this.score = 5;
      this.statusAttempt = '';

      this.wordObj = null;
      this.word = '';
      this.meaning = '';
      this.actualWord = this.wordsStorage.actual;
      this.wordObj = this.words[this.wordsStorage.actual - 1];
      await this.startSquare();
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
    this.word = this.wordObj.word.toString().toLowerCase();
    this.meaning = this.wordObj.meaning;

    console.log(this.words);

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

    this.actual = 1;
    this.limitAttempts = 5;
    this.statusAttempt = '';
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

  // async handleLimitExceeded() {
  //   const alert = await this.alertController.create({
  //     header: 'Suas tentativas acabaram!',
  //     cssClass:'alertLimitExceeded',
  //     subHeader: 'A palavra é',
  //     message: `${this.word}`,
  //     buttons: [
  //       {
  //         text: 'OK',
  //       }
  //     ]
  //   });

  //   await alert.present();
  //   await alert.onDidDismiss().then(() => {
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 300);
  //   });
  // }

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

  // async handleSuccess() {
  //   const alert = await this.alertController.create({
  //     header: 'PARABÉNS!!!',
  //     subHeader: `Você acertou na ${this.actual}ª tentativa!`,
  //     cssClass:'alertSuccess',
  //     message: `Uso na frase: ${this.author}: ${this.phrase}`,

  //     buttons: [
  //       {
  //         text: 'OK',
  //       }
  //     ],
  //   });
  //   await alert.present();
  //   await alert.onDidDismiss().then(() => {
  //     setTimeout(() => {
  //       window.location.reload();
  //     }, 300);
  //   });
  // }
  // alerts handles end

  // functions
  getTileColor(letter, index) {
    const isCorrectLetter = this.word.toString().toLowerCase().trim().includes(letter);

    if (!isCorrectLetter) {
      return 'rgb(58, 58, 60)';
    }

    const letterInThatPosition = this.word.toString().toLowerCase().trim().charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return '#32cd32';
    }

    return '#EEAD2D';
    //return '#ffff8d';
  }

  createSquares() {
    this.wordSquares = []
    for (let index = 0; index < this.word.length; index++) {
      this.wordSquares.push({
        id: (index + 1).toString(),
      });
    }
  }

  // typeSelected(event) {
  //   this.fs2 = event.detail.value.toString();
  // }

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
    // const removedLetter = currentWordArr.pop();
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
    const currentWordArr = this.getCurrentWordArr();

    if (currentWordArr.length !== this.word.length) {
      this.handleWrongMsg('A palavra deve ter', `${this.word.length} letras`);
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Validando a palavra digitada...' });
    loading.present();

    const currentWord = currentWordArr.join('');

    const isWordValid = await this.wordValidation(currentWord);

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

    if (currentWord.toString().toLowerCase().trim() === this.word.toString().toLowerCase().trim()) {
      this.statusAttempt = 'success';
      this.totalSuccess += 1;

      this.wordsStorage = SecurityUtil.get();
      this.wordsStorage.actual += 1;
      this.wordsStorage.success += 1;
      this.wordsStorage.attempts += this.actual;
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
        this.wordsStorage.attempts += this.actual;

        SecurityUtil.clear();
        SecurityUtil.set(this.wordsStorage);

        //this.handleLimitExceeded();
        this.showSuccessModal(this.statusAttempt);
        return;
      } else {
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
