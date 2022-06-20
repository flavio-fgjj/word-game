import { Component, OnInit } from '@angular/core';
import { modalController } from '@ionic/core';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  closeModal() {
    modalController.dismiss();
  }

}
