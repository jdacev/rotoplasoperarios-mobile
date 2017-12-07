import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevaPasswordPage } from './nueva-password';

@NgModule({
  declarations: [
    NuevaPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(NuevaPasswordPage),
  ],
})
export class NuevaPasswordPageModule {}
