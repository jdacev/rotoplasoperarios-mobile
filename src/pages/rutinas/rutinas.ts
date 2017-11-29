import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RutinasProvider } from '../../providers/rutinas/rutinas';
import { AuthService } from "../../providers/auth-service/auth-service";

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
              private authservice: AuthService) {

    this.listaAbierta = true;
    this.getRutinasUsuario();
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
    this.navCtrl.push(pagina)
  }

  getRutinasUsuario(){
    this.loading = true;
    this.rutinasProv.getRutinasUsuario(this.authservice.AuthToken.planta.sfid, this.authservice.AuthToken.usuario.sfid).subscribe(data =>{
        this.rutinasList = data.data;
        this.loading = false;
    }, error =>{
        // console.log("Error: " + error);
    })
  }

}
