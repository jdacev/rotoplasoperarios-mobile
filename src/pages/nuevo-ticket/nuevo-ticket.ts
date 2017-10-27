import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-nuevo-ticket',
  templateUrl: 'nuevo-ticket.html',
})
export class NuevoTicketPage {

  ptarName:string;
  ptarDate:string;
  ticketType:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ptarName = "asdasd";
    this.ptarDate = new Date().toISOString();
    this.ticketType = "Interno";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoTicketPage');
  }

  cancel(){
    this.navCtrl.pop();
  }

}
