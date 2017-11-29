import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleOportunidadPage } from './detalle-oportunidad';

@NgModule({
  declarations: [
    DetalleOportunidadPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleOportunidadPage),
  ],
})
export class DetalleOportunidadPageModule {}
