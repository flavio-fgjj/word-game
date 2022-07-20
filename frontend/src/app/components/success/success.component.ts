import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Success } from 'src/app/models/Success';
import { WordsStorage } from 'src/app/models/WordsStorage';
import { SecurityUtil } from 'src/app/utils/security.utils';
@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit, OnDestroy {

  @Input() attempts: number;
  @Input() font: string;
  @Input() phrase: string[];
  @Input() author: string;
  @Input() word: string;
  @Input() type: string;

  public wordsStorage: WordsStorage;
  public congratsWord: string = null;

  public buttonTitle: string = null;

  constructor(private modal: ModalController) { }

  ngOnDestroy(): void {
    window.location.reload();
  }

  ngOnInit() {
    this.wordsStorage = SecurityUtil.get();
    if (this.type === 'success') {
      switch (this.attempts) {
        case 1:
          this.congratsWord = 'FENOMENAL';
          break;
        case 2:
          this.congratsWord = 'SURPREENDENTE';
          break;
        default:
          this.congratsWord = 'PARABÉNS';
      }
    } else {
      this.congratsWord = 'NÃO FOI DESSA VEZ';
    }

    if(this.wordsStorage.status.length < 7) {
      this.buttonTitle = 'Próxima Palavra';
    } else {
      this.buttonTitle = 'Ver Resultado';
    }
  }

  closeModal() {
    this.modal.dismiss();
  }
}
