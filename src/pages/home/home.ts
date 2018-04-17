import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController } from 'ionic-angular';
import { UsersProvider } from "../../providers/users/users";
import { AuthService } from "../../providers/auth-service/auth-service";
import { AsistenciaProvider } from "../../providers/asistencia/asistencia";
// import { DatabaseService } from "../../services/database-service";



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  images = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _usersService : UsersProvider,
              public authservice: AuthService,
              private asistenciaProv: AsistenciaProvider,
              // private dbService: DatabaseService
            ) {


      this.authservice.loadUserCredentials();
      var data = this.authservice.AuthToken;
      if(!data){
        console.log("YENDO A LOGIN");
        this.navCtrl.setRoot('LoginPage');
        // this.asistenciaProv.getAsistencia(data.usuario.sfid);
        console.log(JSON.stringify(data));
      }

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HomePage');

  }

  irAPagina(pagina:string){
    this.navCtrl.push(pagina);
  }

}
