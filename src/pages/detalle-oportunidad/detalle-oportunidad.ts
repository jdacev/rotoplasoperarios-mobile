import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';

/**
 * Generated class for the DetalleOportunidadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-oportunidad',
  templateUrl: 'detalle-oportunidad.html',
})
export class DetalleOportunidadPage {

  ticket:any;
  data:any;
  origen:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
            private file: File) {

    this.ticket = navParams.get('ticket')
    this.origen = file.dataDirectory + this.ticket.id_case_heroku_c__c.toString() + '/';
    file.listDir(this.origen, '').then(response=>{
      console.log('response[0]: ' + response[0]);
      this.data = response;
    }, error=>{
      this.data = error;
      console.log('error: ' + error);
      console.log('error msg: ' + error.message);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleOportunidadPage');
  }

}
