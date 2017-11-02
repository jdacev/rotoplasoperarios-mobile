import { Component } from '@angular/core';
import { Platform, App, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from "../providers/auth-service/auth-service";

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  loginPage = LoginPage;
  homePage = HomePage;

  rootPage:any;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private menuCtrl: MenuController,
              public appCtrl : App,
              private alertCtrl: AlertController,
              public authservice: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    authservice.loadUserCredentials();
    if(this.authservice.isLoggedin && this.authservice.AuthToken){
      this.goToPage('HomePage')
    }else{
      this.goToPage('LoginPage')
    }
  }

  goToPage(pagina:any){
    this.rootPage = pagina;
  }

  logout(){

    let alert = this.alertCtrl.create({
      title: "Cerrar Sesión",
      subTitle: "¿Seguro que desea cerrar sesión?",
      buttons: [{
        text: 'Ok',
        handler: data => {
          this.authservice.logout();
          this.menuCtrl.close();
          let nav = this.appCtrl.getRootNav();
          nav.setRoot('LoginPage');
        }
      }, 'Cancel']
    });
    alert.present();

    // this.authservice.logout();
    // this.menuCtrl.close();
    // let nav = this.appCtrl.getRootNav();
    // nav.setRoot(LoginPage);
  }
}
