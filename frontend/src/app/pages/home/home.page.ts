import { AfterViewInit, OnInit , Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements  OnInit, AfterViewInit {

  public wordArray: string[];
  public guessedWords = [[]];
  public availableSpace = 1;

  public word: string = null;

  public guessedWordCount = 0;

  public limitTry = 4;
  public actual = 0;

  public actualWordArray = 0;

  public wordSquares = [];
  public keys: any = null;

  public errorMessage: string = null;

  public fs2 = '0';

  public meaning: string = null;
  public grammaticalClass: string = null;

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

  async getRandonWords() {
    await this
      .service
      .getRandonWords(this.fs2)
      .then(async (res: string[]) => {
        this.wordArray = await res;
        this.wordArray = this.wordArray.filter(item => item.toString().length <= 8);
      })
      .catch(err => console.log(err));

    // if removing words with less than 8 letters and the total was less then four, complete until totally four
    if(this.wordArray.length < 4) {
      while (!this.readyToGo) {
        const four = await this.completeRandonArray();
        if(four) {
          this.readyToGo = true;
          break;
        }
      }
    }
  }

  async completeRandonArray() {
    let aux = [];
    this.service.getRandonWords(this.fs2).then(async (r: string[]) => {
      aux = await r;
      aux = aux.filter(itemAux => itemAux.toString().length <= 8);

      aux.forEach(x => {
        if(this.wordArray.length < 4) {
          this.wordArray.push(x.toString());
        }
      });
    });

    return this.wordArray.length < 4 ? false : true;
  }

  async getWordData() {
    this.word = this.wordArray[this.actualWordArray == null ? 0 : this.actualWordArray];

    console.log(this.actualWordArray);
    console.log(this.word);
    
    if(this.word != null) {
      await this.service
        .getWordData(this.word)
        .then(async info => {
          let retInfoWord = await info['data'];
          this.grammaticalClass = retInfoWord.grammatical_class;
          this.meaning = `Significado: ${retInfoWord.meaning}`;
          console.log(this.meaning, this.grammaticalClass);
        })
        .catch(err => console.log(err));
    }
  }

  async start() {
    const loading = await this.loadingCtrl.create({ message: 'Buscando palavras...' });
    loading.present();

    await this.getRandonWords();
    console.log(this.wordArray);
    if(this.wordArray.length === 4) {
      await this.getWordData();
    }

    //TODO store data in localStorage

    await this.startSquare();

    loading.dismiss();
  }

  async startSquare() {
    this.word = this.wordArray[0];

    this.alreadyStarted = true;

    this.createSquares();
    this.keys = document.querySelectorAll('.keyboard-row button');
    
    this.actual = 1;
    this.limitTry = 4;
  }

  async handleInfoButtonClick() {
    const alert = await this.alertController.create({
      header: 'Sobre o jogo:',
      message: `<ul>
          <li>4 tentativas para cada palavra.</li> 
          <li>São 4 palavras ao total.</li>
          <li>Palavras novas a cada 6hs.</li>
          <li>É possível solicitar ajuda 
            <ol>
              <li>caso tenha</li>
            </ol>
          </li>
          <li>'ENTER' para validar a tentativa</li>
          <li>O sistema indicará: 
            <ol>
              <li>cor verde, a palavra existe e está na posição correta.</li>
              <li>cor amarela, a palavra existe mas está na posição incorreta.</li>
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

    let letterE1_aux = document.getElementById('1');
    let actualAux = this.actual;

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
