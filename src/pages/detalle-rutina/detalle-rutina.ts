import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';

/**
 * Generated class for the DetalleRutinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-rutina',
  templateUrl: 'detalle-rutina.html',
})
export class DetalleRutinaPage {

  rutina:any;
  data:any;
  origen:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private file: File) {

      this.rutina = navParams.get('rutina')
      this.origen = file.dataDirectory + 'rutinas/'
      var subDir = this.rutina.rutina_heroku_c__c.toString() + '/';
      // console.log('Orinen: ' + this.origen);
      file.listDir(this.origen, subDir).then(response=>{
        // console.log('response[0]: ' + response[0]);
        console.log('response Json stringify: ' + JSON.stringify(response))
        this.data = response;
      }, error=>{
        this.data = error;
        console.log('error: ' + JSON.stringify(error));
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleRutinaPage');
  }

}
