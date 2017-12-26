import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsistenciaPage } from './asistencia';

@NgModule({
  declarations: [
    AsistenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(AsistenciaPage),
  ],
})
export class AsistenciaPageModule {}
