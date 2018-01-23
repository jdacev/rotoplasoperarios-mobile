import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController, ToastController  } from 'ionic-angular';
import { UsersProvider } from "../../providers/users/users";
import { AuthService } from "../../providers/auth-service/auth-service";
import { AsistenciaProvider } from "../../providers/asistencia/asistencia";
import { Network } from '@ionic-native/network';



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
              private toast: ToastController,
              private network: Network) {


      this.authservice.loadUserCredentials();
      var data = this.authservice.AuthToken;
      this.asistenciaProv.getAsistencia(data.usuario.sfid);
      console.log(data);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

  }

  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.toast.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }

  ionViewDidEnter() {
    console.log('ion view did enter');
    console.log('TIPO: ' + this.network.type)
    this.network.onConnect().subscribe(data => {
      console.log('Network: ' + JSON.stringify(this.network))
      console.log('Network: ' + this.network)
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));


  }

  irAPagina(pagina:string){
    this.navCtrl.push(pagina);
  }

}
