import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevaRutinaPage } from './nueva-rutina';

@NgModule({
  declarations: [
    NuevaRutinaPage,
  ],
  imports: [
    IonicPageModule.forChild(NuevaRutinaPage),
  ],
})
export class NuevaRutinaPageModule {}
