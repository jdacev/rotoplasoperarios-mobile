import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-nueva-rutina',
  templateUrl: 'nueva-rutina.html',
})
export class NuevaRutinaPage {

  ptarName:string;
  ptarDate:string;
  determinante:number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ptarName = "Planta nro 1";
    this.ptarDate = new Date().toISOString();
    this.determinante = 123;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevaRutinaPage');
  }

  cancel(){
    this.navCtrl.pop();
  }

}
