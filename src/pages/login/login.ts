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

    // authservice.loadUserCredentials();
    // if(this.authservice.isLoggedin && this.authservice.AuthToken){
    //   this.navCtrl.setRoot('HomePage');
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidEnter() {
    //to disable menu, or
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // to enable menu.
    this.menuCtrl.enable(true);
  }

  login(user){
    // this.navCtrl.setRoot('HomePage');  //setRoot para que no pueda volver atras con el boton del celular sino va a poder vovler al login despues de loguearse

    this.loading = true;
    this.authservice.authenticate(user.name.toLowerCase(), user.password).then(data => {
      if(data) {
        this.loading = false;
        //
        // this.asistenciaProv.getAsistencia(this.authservice.AuthToken.usuario.sfid).subscribe(response =>{
        //     var asistencia = response.data;
        //     this.loading = false;
        //     if(asistencia.length == 0 || asistencia[0].tipo__c == 'Salida'){
        //       this.navCtrl.setRoot('AsistenciaPage');  //setRoot para que no pueda volver atras con el boton del celular sino va a poder vovler al login despues de loguearse
        //     }else{
              this.navCtrl.setRoot('HomePage');  //setRoot para que no pueda volver atras con el boton del celular sino va a poder vovler al login despues de loguearse
        //     }
        // }, error => {
        //   this.loading = false;
        // })

      }else{
        this.loading = false;
        this.usercreds.password = "";
      }
    });

  }

  forgotPassword(){
    this.navCtrl.push('PasswordRecoveryPage'); //push para levantar una pagina de recuperar contraseña y que pueda
                                              // volver atras al login
  }

}
