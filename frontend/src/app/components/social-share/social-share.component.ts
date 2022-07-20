import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { environment } from 'src/environments/environment';
import { WordsStorage } from 'src/app/models/WordsStorage';
import { SecurityUtil } from 'src/app/utils/security.utils';
import html2canvas from 'html2canvas';
import { Status } from 'src/app/models/Status';
// import * as ClipboardJS from 'clipboard';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent implements OnInit {

  public sharingList = environment.socialShareOption;
  loader: any = null;
  sharingText = ``;
  // emailSubject = 'Word game';
  // recipent = ['recipient@example.org'];
  // sharingImage = ['https://store.enappd.com/wp-content/uploads/2019/03/700x700_2-1-280x280.jpg'];
  // sharingUrl = 'https://store.enappd.com';

  public wordsStorage: WordsStorage;
  public average;
  public statusFirstRow: Array<Status>;
  public statusSecondRow: Array<Status>;
  public statusThirdRow: Array<Status>;

  constructor(
    private modal: ModalController,
    private socialSharing: SocialSharing,
    public platform: Platform,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.wordsStorage = SecurityUtil.get();
    this.average =
    this.wordsStorage.average > 0 ?
    (this.wordsStorage.average / (this.wordsStorage.success + this.wordsStorage.errors)).toFixed(2) :
    0;

    if (this.wordsStorage.status.length > 3) {
      this.statusFirstRow = this.wordsStorage.status.slice(0, 3);
      this.statusSecondRow = this.wordsStorage.status.slice(-(this.wordsStorage.status.length - 4));
      if (this.wordsStorage.status.length === 7) {
        this.statusSecondRow = this.wordsStorage.status.slice(-4);
        this.statusSecondRow.pop();
        this.statusThirdRow = this.wordsStorage.status.slice(-1);
      } else {
        this.statusThirdRow = [];
      }
    } else {
      this.statusFirstRow = this.wordsStorage.status;
      this.statusSecondRow = [];
      this.statusThirdRow = [];
    }
  }

  async copyToClipboard() {
    this.sharingText = `Meu desempenho no Letrando hoje: 
✅ --> ${this.wordsStorage.success}
❌ --> ${this.wordsStorage.errors}
Totalizando ${this.wordsStorage.score} pontos 💪
e ${this.average} tentativas em média!!! 🔥

https://letrando.xyz
`;

    try {
      //await navigator.clipboard.(shareData);
      await navigator.clipboard.writeText(this.sharingText);
      await this.presentToast();
    } catch(err) {
      console.log('Error: ' + err);
      await this.presentWrongToast();
    }
  }

  async shareCustomImage() {
    const src = document.getElementById('clipboard');
    html2canvas(src).then((canvas) => {
      document.getElementById('clipboard').appendChild(canvas);
      canvas.toBlob((blob) => {
        navigator.clipboard
          .write([
            new ClipboardItem(
              Object.defineProperty({}, blob.type, {
                value: blob,
                enumerable: true
              })
            )
          ])
          .then((c) => {
              // do something
          });
      });
      document.getElementById('clipboard').removeChild(canvas);
    });

    await this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Informações copiadas!',
      icon: 'copy-outline',
      position: 'top',
      color: 'primary',
      duration: 3000
    });
    toast.present();
  }

  async presentWrongToast() {
    const toast = await this.toastController.create({
      message: 'Algo saiu errado!',
      icon: 'copy-outline',
      position: 'top',
      color: 'danger',
      duration: 3000
    });
    toast.present();
  }

  closeModal() {
    this.modal.dismiss();
  }

//   async shareVia(shareData) {
//     if (shareData.shareType === 'viaEmail') {
//       this.shareViaEmail();
//     } else {
//       this.socialSharing[`${shareData.shareType}`](this.sharingText, this.sharingImage, this.sharingUrl)
//       .then((res) => {
//         this.modal.dismiss();
//       })
//       .catch((e) => {
//         console.log('error', e);
//         this.modal.dismiss();
//       });
//     }
//   }

//   shareViaEmail() {
//     this.socialSharing.canShareViaEmail().then((res) => {
//       this.socialSharing.shareViaEmail(this.sharingText, this.emailSubject, this.recipent, null, null, this.sharingImage).then(() => {
//         this.modal.dismiss();
//       });
//     }).catch((e) => {
//       // Error!
//     });
//   }
}
