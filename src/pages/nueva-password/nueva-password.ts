import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";

/**
 * Generated class for the NuevaPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nueva-password',
  templateUrl: 'nueva-password.html',
})
export class NuevaPasswordPage {

  usuario:string;
  pass1:string;
  pass2:string;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              public authservice: AuthService) {

    //Recibo por parámetro el usuario que quiere generar la contraseña
    this.usuario = navParams.get('usuario')
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NuevaPasswordPage');
  }

  //Verifico la coincidencia de las contraseñas
  cambiarContrasenia(){
    if(this.pass1 != this.pass2){
      this.showAlert("Error", "Las contraseñas no coinciden.");
      return;
    }

    this.authservice.cambiarContrasenia(this.usuario, this.pass1).then(response =>{
      if(response){
        this.navCtrl.popToRoot();
      }
    }, error =>{

    })
  }

  //Funcion para mostrar alerts.
  showAlert(title:string, subtitle:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [{
        text: 'Ok',
        handler: data => {
          // this.navCtrl.pop();
        }
      }]
    });
    alert.present();
  }

}
