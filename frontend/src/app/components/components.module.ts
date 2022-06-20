import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { IonicModule } from '@ionic/angular';
import { ModalInfoComponent } from './modal-info/modal-info.component';

@NgModule({
  declarations: [LoadingComponent, ModalInfoComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [LoadingComponent, ModalInfoComponent]
})
export class ComponentsModule { }
