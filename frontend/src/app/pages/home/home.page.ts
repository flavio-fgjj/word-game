import { AfterViewInit, OnInit , Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Words } from 'src/app/models/Words';
import { WordsStorage } from 'src/app/models/WordsStorage';
import { DataService } from 'src/app/services/data.service';
import { SecurityUtil } from 'src/app/utils/security.utils';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements  OnInit, AfterViewInit {

  public wordArray: string[];
  public words: Array<Words>;
  public wordsStorage: WordsStorage;
  public guessedWords = [[]];
  public availableSpace = 1;

  public wordObj: Words = null;

  public guessedWordCount = 0;

  public limitTry = 5;
  public actual = 0;

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
  public phrase: string = null;
  public author: string = null;
  public font: string = null;

  public arrayRandonSearch = {
    items: [
     //{ value: 0, text: 'Dicionario Completo' },
     { value: 1, text: 'Dicionario para crianças' },
     { value: 2, text: 'Alimentos' },
    //  { value: 3, text: 'Animais' },
    //  { value: 4, text: 'Cores' },
     { value: 5, text: 'Corpo humano' },
     { value: 6, text: 'Educacao' },
    //  { value: 7, text: 'Familia' },
     { value: 8, text: 'Figuras geometricas' },
     { value: 9, text: 'Midias de comunicacao' },
     { value: 12, text: 'Profissoes' },
     { value: 13, text: 'Transporte' }
    ]
  };

  public alreadyStarted = false;
  public readyToGo = false;

  public totalSuccess = 0;
  public totalErrors = 0;
  public actualWord = 0;

  constructor(
    private loadingCtrl: LoadingController,
    private service: DataService,
    private alertController: AlertController) {}

  async ngOnInit() {
    // this.wordArray = ['Flavio', 'Estela', 'Joao', 'Teo'];
    // this.startSquare();
    const loading = await this.loadingCtrl.create({ message: 'Iniciando...' });
    loading.present();

    this.wordsStorage = SecurityUtil.get();
    if(this.wordsStorage) {
      const storageDate = new Date(this.wordsStorage.date);
      const today = new Date();
      if(storageDate.getDate() === today.getDate()
        && storageDate.getMonth() === today.getMonth()
        && storageDate.getFullYear() === today.getFullYear()) {
          this.startFromStorage();
      } else {
        SecurityUtil.clear();
      }
    }

    loading.dismiss();
  }

  ngAfterViewInit(): void {}

  async getWords() {
    this.words = new Array<Words>();

    this
      .service
      .getWords()
      .subscribe(async response => {
        this.words = response.data.words;

        this.words = this.words.filter(x => x.word !== null);

        this.wordsStorage = new WordsStorage();
        this.wordsStorage.date = new Date();
        this.wordsStorage.actual = 1;
        this.wordsStorage.success = 0;
        this.wordsStorage.errors = 0;
        this.wordsStorage.words = this.words;
        SecurityUtil.set(this.wordsStorage);

        await this.startFromStorage();
      });
  }

  async startFromStorage() {
    this.wordsStorage = new WordsStorage();
    this.wordsStorage = SecurityUtil.get();

    this.words = this.wordsStorage.words;

    this.words = this.words.filter(x => x.word !== null);

    this.totalSuccess = this.wordsStorage.success;
    this.totalErrors = this.wordsStorage.errors;

    this.wordObj = this.words[this.wordsStorage.actual - 1];
    await this.startSquare();
  }
  async start() {
    const loading = await this.loadingCtrl.create({ message: 'Buscando palavras...' });
    loading.present();

    await this.getWords();

    loading.dismiss();
  }

  async startSquare() {
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
    this.phrase = this.wordObj.phrase.phrase;
    this.font = this.wordObj.phrase.font;

    this.alreadyStarted = true;

    this.createSquares();
    this.keys = document.querySelectorAll('.keyboard-row button');

    this.actual = 1;
    this.limitTry = 4;
  }

  // alerts handles
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

  async handleLimitExceeded() {
    const alert = await this.alertController.create({
      header: 'Suas tentativas acabaram!',
      cssClass:'alertLimitExceeded',
      subHeader: 'A palavra é',
      message: `${this.word}`,
      buttons: [
        {
          text: 'OK',
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss().then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
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

  async handleSuccess() {
    const alert = await this.alertController.create({
      header: 'PARABÉNS!!!',
      cssClass:'alertSuccess',
      message: `Você acertou na ${this.actual}ª tentativa!`,
      buttons: [
        {
          text: 'OK',
        }
      ],
    });
    await alert.present();
    await alert.onDidDismiss().then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  }

  async handleExtraHelpButtonClick() {
    let html = ``;

    let synAux = `<ol>`;
    if(this.syn.length > 0) {
      for(const s of this.syn) {
        synAux += `<li>${s}</li>`;
      }
      synAux += `</ol>`;
      html += `
        <li>Sinônimos
          ${synAux}
        </li>
      `;
    }

    let antAux = `<ol>`;
    if(this.ant.length > 0) {
      for(const s of this.ant) {
        antAux += `<li>${s}</li>`;
      }
      antAux += `</ol>`;
      html += `
        <br><li>Antônimos
          ${antAux}
        </li>
      `;
    }

    let phraseAux = `<hr><br>`;

    if(this.phrase !== '') {
      phraseAux += `Autor: ${this.author.toString().replace('- ', '')}<br><br>`;
      phraseAux += `Frase: "${this.phrase.toString().trim()}"<br><br>`;
      phraseAux += `${this.font}`;
      html += phraseAux;
    }

    html += `<ul>`;
    const alert = await this.alertController.create({
      header: ``,
      cssClass: 'alertHelp',
      message: html !== '' ? html : `Não há ajuda extra para a palavra ${this.word}`,
      buttons: ['Ok'],
    });

    await alert.present();
  }

  async handleInfoButtonClick() {
    const alert = await this.alertController.create({
      header: 'Informações & Regras',
      cssClass:'alertInfo',
      message: `
        <ion-item>
          <ion-avatar slot="end">
            <img src="https://avatars.githubusercontent.com/u/9452793?v=4" />
          </ion-avatar>
          <ion-label>Por: 
            <a href="https://github.com/flavio-fgjj" 
              target="_blank" 
              rel="noopener noreferrer">Flavio Alvarenga</a>
          </ion-label>
        </ion-item>
        <ion-item>
        <ion-icon slot="end" name="checkmark-done-outline"></ion-icon>
        <ion-label>15 palavras por dia.</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="end" name="checkmark-done-outline"></ion-icon>
          <ion-label>5 tentativas por palavra.</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="end" name="checkmark-done-outline"></ion-icon>
          <ion-label>Ajuda extra:<br>
            - Significado<br>
            - Sinônimos<br>
            - Antônimos<br>
            - Uso na frase
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="end" name="checkmark-done-outline"></ion-icon>
          <ion-label>'ENTER' para validar a tentativa</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="end" name="checkmark-done-outline"></ion-icon>
          <ion-label>
            O sistema indicará: <br>
            - cor verde, a letra existe e está <br>na posição correta. <br>
            - cor amarela, a letra existe mas<br>está na posição incorreta.
          </ion-label>
        </ion-item>
        `,
      buttons: ['', 'Ok'],
    });

    await alert.present();
  }
  // alerts handles end

  // modals
  // async openModal(opts = {}) {
  //   const modal = await modalController.create({
  //     component: 'modal-content',
  //     ...opts,
  //   });
  //   modal.present();

  //   currentModal = modal;
  // }

  // openSheetModal() {
  //   this.openModal({
  //     breakpoints: [0, 0.2, 0.5, 1],
  //     initialBreakpoint: 0.2,
  //   });
  // }
  // modals end

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
    for (let index = 0; index < this.word.length; index++) {
      this.wordSquares.push({
        id: (index + 1).toString(),
      });
    }
  }

  typeSelected(event) {
    this.fs2 = event.detail.value.toString();
  }

  updateGuessedWords(letter) {
    const currentWordArr = this.getCurrentWordArr();

    const div = document.getElementById('errorMessage');
    div.classList.remove('show');
    div.classList.add('hide');
    document.getElementById('errorMessageHr').classList.remove('show');
    document.getElementById('errorMessageHr').classList.add('hide');

    if (currentWordArr && currentWordArr.length < this.word.length) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(this.availableSpace));

      this.availableSpace = this.availableSpace + 1;
      availableSpaceEl.textContent = letter;

      switch (this.actual) {
        case 1:
          document.getElementById(`${String(this.availableSpace - 1)}_try1`).textContent = letter;
          break;
        case 2:
          document.getElementById(`${String(this.availableSpace - 1)}_try2`).textContent = letter;
          break;
        case 3:
          document.getElementById(`${String(this.availableSpace - 1)}_try3`).textContent = letter;
          break;
        case 4:
          document.getElementById(`${String(this.availableSpace - 1)}_try4`).textContent = letter;
          break;
      }
    }
  }

  getCurrentWordArr() {
    const numberOfGuessedWords = this.guessedWords.length;
    return this.guessedWords[numberOfGuessedWords - 1];
  }
  // functions end

  // keyboard handles
  handleDeleteLetter() {
    const currentWordArr = this.getCurrentWordArr();
    const removedLetter = currentWordArr.pop();
    const div = document.getElementById('errorMessage');

    div.classList.remove('show');
    div.classList.add('hide');
    document.getElementById('errorMessageHr').classList.remove('show');
    document.getElementById('errorMessageHr').classList.add('hide');

    this.guessedWords[this.guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(this.availableSpace - 1));

    lastLetterEl.textContent = '';

    switch  (this.actual) {
      case 1:
        document.getElementById(`${String(this.availableSpace - 1)}_try1`).textContent = '';
        break;
        case 2:
          document.getElementById(`${String(this.availableSpace - 1)}_try2`).textContent = '';
        break;
        case 3:
          document.getElementById(`${String(this.availableSpace - 1)}_try3`).textContent = '';
          break;
          case 4:
            document.getElementById(`${String(this.availableSpace - 1)}_try4`).textContent = '';
            break;
          }
          
          this.availableSpace = this.availableSpace - 1;
  }

  handleSubmitWord() {
    const currentWordArr = this.getCurrentWordArr();

    if (currentWordArr.length !== this.word.length) {
      console.log('tamanho');
      this.handleWrongMsg('A palavra deve ter', `${this.word.length} letras`);
      return;
    }

    const currentWord = currentWordArr.join('');
    //TODO: Validate word

    this
      .service
      .wordValidation(currentWord)
      .subscribe(async response => {
        const isWordValid = await response.status;
        if (isWordValid === 'NOK') {
          this.handleWrongMsg('Erro!', 'Palavra inválida!');
          return;
        }
      });

    const firstLetterId = this.guessedWordCount * this.word.length + 1;
    const interval = 200;

    // let letterE1Aux = document.getElementById('1');
    let letterE1Aux;

    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = this.getTileColor(letter, index);

        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId.toString());
        letterEl.classList.add('animate__flipInX');
        letterEl.setAttribute('style', `background-color:${tileColor};border-color:${tileColor};color:whitesmoke;`);

        switch (this.actual) {
          case 1:
            letterE1Aux = document.getElementById(`${letterId.toString()}_try1`);
            break;
          case 2:
            letterE1Aux = document.getElementById(`${letterId.toString()}_try2`);
            break;
          case 3:
            letterE1Aux = document.getElementById(`${letterId.toString()}_try3`);
            break;
          case 4:
            letterE1Aux = document.getElementById(`${letterId.toString()}_try4`);
            break;
        }
        letterE1Aux.classList.add('animate__flipInX');
        letterE1Aux.setAttribute('style', `background-color:${tileColor};border-color:${tileColor};color:whitesmoke;`);
      }, interval * index);
    });

    this.guessedWordCount += 1;

    switch (this.actual) {
      case 1:
        document.getElementById('board_try1').classList.add('showFlex');
        document.getElementById('board_try1').classList.remove('hide');
        break;
      case 2:
        document.getElementById('board_try2').classList.add('showFlex');
        document.getElementById('board_try2').classList.remove('hide');
        break;
      case 3:
        document.getElementById('board_try3').classList.add('showFlex');
        document.getElementById('board_try3').classList.remove('hide');
        break;
      case 4:
        document.getElementById('board_try4').classList.add('showFlex');
        document.getElementById('board_try4').classList.remove('hide');
        break;
    }

    if (currentWord.toString().toLowerCase().trim() === this.word.toString().toLowerCase().trim()) {
      this.totalSuccess += 1;

      this.wordsStorage = SecurityUtil.get();
      this.wordsStorage.actual += 1;
      this.wordsStorage.success += 1;
      SecurityUtil.clear();
      SecurityUtil.set(this.wordsStorage);

      this.handleSuccess();

      //this.startFromStorage();
    } else {
      this.actual = this.actual > 4 ? 4 : (this.actual + 1);
      if(this.actual === (this.limitTry + 1)) {
        this.totalErrors += 1;

        this.wordsStorage = SecurityUtil.get();
        this.wordsStorage.actual += 1;
        this.wordsStorage.errors += 1;
        SecurityUtil.clear();
        SecurityUtil.set(this.wordsStorage);

        console.log('errou');
        this.handleLimitExceeded();
        //this.startFromStorage();
      } else {
        this.guessedWords.push([]);
        this.availableSpace = 1;
        this.guessedWordCount = 0;
      }

      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId.toString());
          letterEl.classList.remove('animate__flipInX');
          letterEl.removeAttribute('style');
          letterEl.textContent = '';
        }, interval * index);
      });
    }
  }

}
