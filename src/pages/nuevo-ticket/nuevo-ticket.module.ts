import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NuevoTicketPage } from './nuevo-ticket';

@NgModule({
  declarations: [
    NuevoTicketPage,
  ],
  imports: [
    IonicPageModule.forChild(NuevoTicketPage),
  ],
})
export class NuevoTicketPageModule {}
