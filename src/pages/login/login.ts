import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
import { AsistenciaProvider } from "../../providers/asistencia/asistencia";
import { AsistenciaPage } from "../../pages/asistencia/asistencia";


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
              private asistenciaProv: AsistenciaProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter() {
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
