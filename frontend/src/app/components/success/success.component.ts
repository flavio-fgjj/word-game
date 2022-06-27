import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Success } from 'src/app/models/Success';
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

  constructor(private modal: ModalController) { }

  ngOnDestroy(): void {
    window.location.reload();
  }

  ngOnInit() {

  }

  closeModal() {
    this.modal.dismiss();
  }
}
