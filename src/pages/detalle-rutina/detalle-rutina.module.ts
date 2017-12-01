import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleRutinaPage } from './detalle-rutina';

@NgModule({
  declarations: [
    DetalleRutinaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleRutinaPage),
  ],
})
export class DetalleRutinaPageModule {}
