import { AfterViewInit, OnInit , Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { isThisQuarter } from 'date-fns';
import { Words } from 'src/app/models/Words';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements  OnInit, AfterViewInit {

  public wordArray: string[];
  public words: Array<Words>;
  public guessedWords = [[]];
  public availableSpace = 1;

  public wordObj: Words = null;

  public guessedWordCount = 0;

  public limitTry = 4;
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

  constructor(
    private loadingCtrl: LoadingController,
    private service: DataService,
    private alertController: AlertController) {}

  ngOnInit() {
    // this.wordArray = ['Flavio', 'Estela', 'Joao', 'Teo'];
    // this.startSquare();
  }

  ngAfterViewInit(): void {}

  async getWords() {
    this.words = new Array<Words>();

    this
      .service
      .getWords()
      .subscribe(async response => {
        for(const item of await response.data.words) {
          this.words.push(item);
        }

        this.wordObj = this.words[0];
        await this.startSquare();
      });
  }

  async start() {
    const loading = await this.loadingCtrl.create({ message: 'Buscando palavras...' });

    loading.present();
    //TODO store data in localStorage

    await this.getWords();

    loading.dismiss();
  }

  async startSquare() {
    this.word = this.wordObj.word.toString().toLowerCase();
    this.meaning = this.wordObj.meaning;
    this.grammaticalClass = this.wordObj.grammatical_class;

    this.syn = this.wordObj.synonyms;
    this.ant = this.wordObj.antonyms;

    this.author = this.wordObj.phrase.author;
    this.phrase = this.wordObj.phrase.phrase;
    this.font = this.wordObj.phrase.font;

    this.alreadyStarted = true;

    this.createSquares();
    this.keys = document.querySelectorAll('.keyboard-row button');

    this.actual = 1;
    this.limitTry = 3;
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

  async handleExtraHelpButtonClick() {
    console.log(this.wordObj);
    let html = `<ul>`;

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
      message: html !== '' ? html : `Não há ajuda extra para a palavra ${this.word}`,
      buttons: ['', 'Ok'],
    });

    await alert.present();
  }

  async handleInfoButtonClick() {
    const alert = await this.alertController.create({
      header: 'Sobre o jogo:',
      message: `<ul>
          <li>3 tentativas para cada palavra.</li> 
          <li>São 10 palavras por dia.</li>
          <li>É possível solicitar ajuda 
            <ol>
              <li>caso tenha</li>
            </ol>
          </li>
          <li>'ENTER' para validar a tentativa</li>
          <li>O sistema indicará: 
            <ol>
              <li>cor verde, a letra existe e está na posição correta.</li>
              <li>cor amarela, a letra existe mas está na posição incorreta.</li>
            </ol>
          </li>
        </ul>`,
      buttons: ['', 'Ok'],
    });

    await alert.present();
  }

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

    return '#ffff8d';
  }

  createSquares() {
    for (let index = 0; index < this.word.length; index++) {
      this.wordSquares.push({
        id: (index + 1).toString(),
      });
    }
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

      switch  (this.actual) {
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
      const div = document.getElementById('errorMessage');
      this.errorMessage = `A palavra deve ter ${(this.word.length).toString()} letras!`;
      div.classList.remove('hide');
      div.classList.add('show');
      document.getElementById('errorMessageHr').classList.remove('hide');
      document.getElementById('errorMessageHr').classList.add('show');
      return;
    }

    const currentWord = currentWordArr.join('');

    const firstLetterId = this.guessedWordCount * this.word.length + 1;
    const interval = 200;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    let letterE1_aux = document.getElementById('1');
    const actualAux = this.actual;

    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = this.getTileColor(letter, index);

        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId.toString());
        letterEl.classList.add('animate__flipInX');
        letterEl.setAttribute('style', `background-color:${tileColor};border-color:${tileColor}`);

        switch (actualAux) {
          case 1:
            letterE1_aux = document.getElementById(`${letterId.toString()}_try1`);
            break;
          case 2:
            letterE1_aux = document.getElementById(`${letterId.toString()}_try2`);
            break;
          case 3:
            letterE1_aux = document.getElementById(`${letterId.toString()}_try3`);
            break;
          case 4:
            letterE1_aux = document.getElementById(`${letterId.toString()}_try4`);
            break;
        }
        letterE1_aux.classList.add('animate__flipInX');
        letterE1_aux.setAttribute('style', `background-color:${tileColor};border-color:${tileColor}`);
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
      this.errorMessage = 'PARABÉNS!!!';
      document.getElementById('errorMessage').setAttribute('style', 'background-color: #2dd36f !important;');
      document.getElementById('errorMessage').classList.remove('hide');
      document.getElementById('errorMessage').classList.add('show');
      document.getElementById('errorMessageHr').classList.remove('hide');
      document.getElementById('errorMessageHr').classList.add('show');

      document.getElementById('board').classList.add('hide');
    } else {
      if(this.actual === this.limitTry) {
        document.getElementById('board').classList.add('hide');
        this.errorMessage = `Suas chances acabaram! A palavra é: ${this.word.toString().toUpperCase()}.`;
        document.getElementById('errorMessage').classList.remove('hide');
        document.getElementById('errorMessage').classList.add('show');
        document.getElementById('errorMessageHr').classList.remove('hide');
        document.getElementById('errorMessageHr').classList.add('show');
      } else {
        this.actual += 1;
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

  typeSelected(event) {
    this.fs2 = event.detail.value.toString();
  }
}
