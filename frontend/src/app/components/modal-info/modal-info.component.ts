import { Component, OnInit } from '@angular/core';
import { modalController } from '@ionic/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {

  public version = `Versão ${environment.version}`;
  constructor() { }

  ngOnInit() {}

  closeModal() {
    modalController.dismiss();
  }

}
