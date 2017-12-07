import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../providers/auth-service/auth-service";

@IonicPage()
@Component({
  selector: 'page-password-recovery',
  templateUrl: 'password-recovery.html',
})
export class PasswordRecoveryPage {

  generateKeyForm: FormGroup;
  resetForm: FormGroup;
  username:string = "";
  correoElectronico:string;
  usuarioGeneracion:string;
  usuario:string;
  codigo:number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              public authservice: AuthService) {

    this.correoElectronico = "";
    this.usuarioGeneracion = "";
    this.username = "";
    this.usuario = "";
    this.navCtrl = navCtrl;

    this.resetForm = formBuilder.group({
        key: ['', Validators.compose([Validators.required])]
    });

    this.generateKeyForm = formBuilder.group({
        username: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordRecoveryPage');
  }

  ionViewDidEnter() {
    //to disable menu, or
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    // to enable menu.
    this.menuCtrl.enable(true);
  }

  generar(){
    this.authservice.generarClave(this.usuarioGeneracion.toLowerCase(), this.correoElectronico).then(response=>{
      console.log('response: ' + response)
      if(response){
        this.showAlert("Clave Generada", "En instantes recibirá por correo electrónico la clave para resetear la contraseña.");
      }else{
        this.showAlert("Error", "Error al generar la clave. Verifique los datos e intente nuevamente.");
      }
    }, error => {
      console.log('error: ' + error)
    })
  }

  verificarCodigo(){
    this.authservice.verificarCodigo(this.usuario.toLowerCase(), this.codigo).then(response => {
      if(response){
        console.log('VERIFICACION OK')
        this.navCtrl.push('NuevaPasswordPage', {
          usuario: this.usuario.toLowerCase()
        })
      }else{
        console.log('ERROR EN VERIFICACION')
      }
    }, error => {

    })
  }

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
