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

  constructor(private modal: ModalController) { }

  ngOnDestroy(): void {
    window.location.reload();
    //window.location.href = 'https://tinyurl.com/bdd55pxk';
  }

  ngOnInit() {
    this.wordsStorage = SecurityUtil.get();
    console.log(this.wordsStorage);
  }

  closeModal() {
    this.modal.dismiss();
  }
}
