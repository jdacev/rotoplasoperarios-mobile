import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AuthService } from "../../providers/auth-service/auth-service";
import { RutinasProvider } from "../../providers/rutinas/rutinas";


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
  images:any;
  ptarName:string;
  determinante:string;
  formato:string;
  observacion:string;
  data:any;
  origen:string;
  respuestas:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private file: File,
              private authservice: AuthService,
              private rutinasProv: RutinasProvider) {

      this.ptarName = this.authservice.AuthToken.planta.name;
      this.determinante = this.authservice.AuthToken.planta.determinante__c;
      this.formato = this.authservice.AuthToken.planta.formato__c;
      this.rutina = navParams.get('rutina')
      if(!this.rutina.observacion__c || this.rutina.observacion__c == ""){
        this.observacion = '---';
      }
      else{
        this.observacion = this.rutina.observacion__c;
      }

      this.rutinasProv.getRespuestasActividades(this.rutina.id_rutinas_heroku__c).subscribe(response=>{
        this.respuestas = response.data
      }, error=>{

      })
      this.origen = file.dataDirectory + 'rutinas/'
      var subDir = this.rutina.id_rutinas_heroku__c.toString() + '/';
      // console.log('Orinen: ' + this.origen);


      file.listDir(this.origen, subDir).then(response=>{
        // console.log('response[0]: ' + response[0]);
        console.log('response Json stringify: ' + JSON.stringify(response))
        this.images = response;
      }, error=>{
        console.log('error: ' + JSON.stringify(error));
      });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleRutinaPage');
  }

}
