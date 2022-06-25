import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { IonicModule } from '@ionic/angular';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { SocialShareComponent } from './social-share/social-share.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  declarations: [LoadingComponent, ModalInfoComponent, SocialShareComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [SocialSharing],
  exports: [LoadingComponent, ModalInfoComponent, SocialShareComponent]
})
export class ComponentsModule { }
