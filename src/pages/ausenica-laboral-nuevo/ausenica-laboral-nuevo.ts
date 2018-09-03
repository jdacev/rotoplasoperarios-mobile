import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AusenicaLaboralNuevoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ausenica-laboral-nuevo',
  templateUrl: 'ausenica-laboral-nuevo.html',
})
export class AusenicaLaboralNuevoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AusenicaLaboralNuevoPage');
  }

}
