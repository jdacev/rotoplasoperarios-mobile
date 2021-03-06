import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RutinasProvider } from '../../providers/rutinas/rutinas';
import { AuthService } from "../../providers/auth-service/auth-service";
import { AsistenciaProvider } from "../../providers/asistencia/asistencia";
import { Network } from '@ionic-native/network';
import { DatabaseService } from "../../services/database-service";

/**
 * Generated class for the RutinasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rutinas',
  templateUrl: 'rutinas.html',
})
export class RutinasPage {

  listaAbierta: boolean;
  rutinasList = [];
  loading:boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rutinasProv: RutinasProvider,
              private authservice: AuthService,
              private alertCtrl: AlertController,
              private asistenciaProv: AsistenciaProvider,
              private network: Network,
              private dbService: DatabaseService) {

    this.listaAbierta = true;
    this.getRutinasUsuario();
    this.dbService.getRutinasOffline();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RutinasPage');
  }

  toggleLista(){
    // console.log(this.listaAbierta)
    if (this.listaAbierta) {
        this.listaAbierta = false;
    } else {
        this.listaAbierta = true;

    }
  }

  doRefresh(refresher) {
    // console.log('Begin async operation', refresher);

    setTimeout(() => {
      // console.log('Async operation has ended');
      this.getRutinasUsuario();
      refresher.complete();
    }, 2000);
  }

  irAPagina(pagina:string){
    // this.asistenciaProv.getAsistencia(this.authservice.AuthToken.usuario.sfid).subscribe(response =>{
      // var asistencia = response.data;
      var asistencia = this.authservice.AuthToken.asistencia
      // if(asistencia.length == 0 || asistencia[0].tipo__c == 'Salida'){
      if(asistencia == '' || asistencia == null || asistencia.tipo__c == 'Salida'){
        //this.navCtrl.push(pagina)
        //MOSTRAR ALERTA QUE NO HIZO EL CHECKIN
        this.showAlert('Rutinas', 'Para crear una rutina realice el Ingreso Laboral en la planta correspondiente.');
      }else{
        this.navCtrl.push(pagina)
      }
    // }, error => {

    // })
  }

  irADetalle(rutina){
    this.navCtrl.push('DetalleRutinaPage', {
      rutina: rutina
    })
  }

  getRutinasUsuario(){


    this.loading = true;

    if(this.network.type == 'none' || this.network.type == 'unknown'){

      this.dbService.getRutinasUsuarioOffline().then(response=>{
        this.rutinasList = response;
        this.loading = false;
      }, error => {
        console.log("ERROR EN GET RUTINASUSUARIOOFFLINE" + JSON.stringify(error));
        this.loading = false;
      })

    }else{
      // this.dbService.getRutinasUsuarioOffline().then(response=>{

      // }, error => {
      //   console.log("ERROR EN GET RUTINASUSUARIOOFFLINE" + JSON.stringify(error));
        
      // })

      this.rutinasProv.getRutinasUsuario(this.authservice.AuthToken.planta.sfid, this.authservice.AuthToken.usuario.sfid).subscribe(data =>{
          this.rutinasList = data.data;
          // console.log("RUTINAS: " + JSON.stringify(this.rutinasList));
          
          this.loading = false;
      }, error =>{
          this.loading = false;
          // console.log("Error: " + error);
      })

    }
  }

  showAlert(titulo:string, subtitulo:string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: subtitulo,
      buttons: ['Aceptar']
    });
    alert.present();
  }

}
