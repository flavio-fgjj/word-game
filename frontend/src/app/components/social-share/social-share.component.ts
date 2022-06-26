import { Component, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { environment } from 'src/environments/environment';
import { WordsStorage } from 'src/app/models/WordsStorage';
import { SecurityUtil } from 'src/app/utils/security.utils';
import html2canvas from 'html2canvas';
import * as ClipboardJS from 'clipboard';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent implements OnInit {

  public sharingList = environment.socialShareOption;
  loader: any = null;
  // eslint-disable-next-line max-len
  sharingText = 'Seu desempenho:';
  emailSubject = 'Word game';
  recipent = ['recipient@example.org'];
  sharingImage = ['https://store.enappd.com/wp-content/uploads/2019/03/700x700_2-1-280x280.jpg'];
  sharingUrl = 'https://store.enappd.com';

  public wordsStorage: WordsStorage;
  public average;

  constructor(
    private modal: ModalController,
    private socialSharing: SocialSharing,
    public platform: Platform,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.wordsStorage = SecurityUtil.get();
    console.log(this.wordsStorage);
    this.average = this.wordsStorage.attempts > 0 ? (this.wordsStorage.attempts / 7).toFixed(2) : 0;
  }

  copyToClip(str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  };

  async cc() {
    const shareData = {
      title: 'MDN',
      text: `Joguei o tigatae.com hoje, e: 
Acertei ${this.wordsStorage.success} ✅
Errei ${this.wordsStorage.errors} ❌
Ttalizando ${this.wordsStorage.score} pontos!!! 💪`,
      url: 'https://developer.mozilla.org',
    }

    try {
      //await navigator.clipboard.(shareData);
      await navigator.clipboard.writeText(shareData.text);
    } catch(err) {
      console.log('Error: ' + err);
    }

    
  }

  async copyText() {
    const src = document.getElementById('clipboard');
    html2canvas(src).then((canvas) => {
      document.getElementById('clipboard').appendChild(canvas);
      // const txt = 'Teste';
      // const type = 'text/plain';
      // const blob2 = new Blob([txt], { type });
      canvas.toBlob((blob) => {
        navigator.clipboard
          .write([
            // new ClipboardItem(
            //   Object.defineProperty({}, blob2.type, {
            //     value: txt,
            //     enumerable: true
            //   })
            // ),
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

  closeModal() {
    this.modal.dismiss();
  }

  async shareVia(shareData) {
    if (shareData.shareType === 'viaEmail') {
      this.shareViaEmail();
    } else {
      this.socialSharing[`${shareData.shareType}`](this.sharingText, this.sharingImage, this.sharingUrl)
      .then((res) => {
        this.modal.dismiss();
      })
      .catch((e) => {
        console.log('error', e);
        this.modal.dismiss();
      });
    }
  }

  shareViaEmail() {
    this.socialSharing.canShareViaEmail().then((res) => {
      this.socialSharing.shareViaEmail(this.sharingText, this.emailSubject, this.recipent, null, null, this.sharingImage).then(() => {
        this.modal.dismiss();
      });
    }).catch((e) => {
      // Error!
    });
  }
}
