import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, ToastController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
import { AsistenciaProvider } from "../../providers/asistencia/asistencia";
import { AsistenciaPage } from "../../pages/asistencia/asistencia";
import { Network } from '@ionic-native/network';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  usercreds = {
       name: '',
       password: ''
  };
  loading:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private menuCtrl:MenuController,
              private alertCtrl: AlertController,
              public authservice: AuthService,
              private asistenciaProv: AsistenciaProvider,
              private toast: ToastController,
              private network: Network) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
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
    this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
    // Deshabilito el menú en esta pantalla cuando entro
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // Habilito el menú en esta pantalla cuando salgo
    this.menuCtrl.enable(true);
  }

  login(user){


    this.loading = true;
    this.authservice.authenticate(user.name.toLowerCase(), user.password).then(data => {
      if(data) {
        this.loading = false;

        /* Hago setRoot para que no pueda volver atras con el boton del celular.
        Sino va a poder volver al login despues de loguearse*/
        this.navCtrl.setRoot('HomePage');

      }else{
        this.loading = false;
        this.usercreds.password = "";
      }
    });

  }

  forgotPassword(){
  /*push para levantar una pagina de recuperar contraseña y que pueda
  volver atras al login*/
    this.navCtrl.push('PasswordRecoveryPage');
  }

}
