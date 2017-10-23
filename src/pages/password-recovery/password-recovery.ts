import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-password-recovery',
  templateUrl: 'password-recovery.html',
})
export class PasswordRecoveryPage {

  generateKeyForm: FormGroup;
  resetForm: FormGroup;
  username:string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController,
              public formBuilder: FormBuilder) {

    this.username = "";
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

  generateKey(value){
    if(this.generateKeyForm.valid) {
      // console.log("FORM GENERAR KEY ES VALIDO");
      this.showAlert("Clave Generada", "En instantes recibirá por correo electrónico la clave para resetear la contraseña.");
    }else{
      console.log("FORM GENERAR KEY NO ES VALIDO")
    }
  }

  resetPass(value){
    if(this.resetForm.valid) {
      console.log("FORM RESET ES VALIDO");
    }else{
      console.log("FORM RESET NO ES VALIDO")
    }
  }

  showAlert(title:string, subtitle:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [{
        text: 'Ok',
        handler: data => {
          this.navCtrl.pop();
        }
      }]
    });
    alert.present();
  }

}
