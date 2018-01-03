import { Component } from '@angular/core';
import { Platform, App, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { File } from '@ionic-native/file';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';


import { AuthService } from "../providers/auth-service/auth-service";
import { AsistenciaProvider } from "../providers/asistencia/asistencia";
import { PlantasProvider } from "../providers/plantas/plantas";

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AsistenciaPage } from '../pages/asistencia/asistencia';

@Component({
  templateUrl: 'app.html'})
export class MyApp {

  loginPage = LoginPage;
  homePage = HomePage;
  asistenciaPage = AsistenciaPage;
  plantas:any;
  userData:any;
  asistencia:any;
  rootPage:any;
  showMenu:boolean;
  url:string;
  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private menuCtrl: MenuController,
              public appCtrl : App,
              private alertCtrl: AlertController,
              public authservice: AuthService,
              private keyboard: Keyboard,
              private asistenciaProv: AsistenciaProvider,
              private plantasProv: PlantasProvider,
              private file: File,
              private fileOpener: FileOpener,
              private document: DocumentViewer) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      keyboard.disableScroll(true);
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // this.url= 'http://localhost:8100/assets/files/Manual-Tipo-I.pdf'
    this.showMenu = false;
    authservice.loadUserCredentials();
    if(this.authservice.isLoggedin && this.authservice.AuthToken){
      console.log("ACA1")
      this.userData = this.authservice.AuthToken
        this.asistenciaProv.getAsistencia(this.userData.usuario.sfid).subscribe(response => {
          this.asistencia = response.data;
          // if(this.asistencia.length == 0 || this.asistencia[0].tipo__c == 'Salida'){
          //   // this.goToPage('AsistenciaPage')
          //   this.rootPage = 'AsistenciaPage';
          //   this.appCtrl.navPop();
          // }else{
        //     // this.goToPage('HomePage')
            this.rootPage = 'HomePage';
            this.appCtrl.navPop();
          // }
        }, error => {

        })

    }else{
      console.log("Voy a login")
      this.goToPage('LoginPage')
    }
  }

  showSubMenu(){
    this.showMenu = !this.showMenu;
  }

  descargar(tipo:string){

    var url = this.file.applicationDirectory + 'www/assets/';
    switch(tipo){
      case 'A':
        url += 'Manual-Tipo-A.pdf';
        break;

      case 'B':
        url += 'Manual-Tipo-B.pdf';
        break;

      case 'I':
        url += 'Manual-Tipo-I.pdf';
        break;

      default:
        console.log('No Encontrado');
        break;
    }

    const options: DocumentViewerOptions = {
      title: 'Manual tipo ' + tipo,
      openWith: {enabled:false}
    }

    this.document.viewDocument(url, 'application/pdf', options)

    // InAppBrowser()
    // this.file.checkFile(this.file.applicationDirectory + 'www/assets/', 'Manual-Tipo-A.pdf').then(_ => console.log('File exists: www/assets/')).catch(err => console.log('File doesnt exist'));
    //
    // console.log('abriendo archivo: url: ' + this.file.applicationDirectory + 'www/assets/' + 'Manual-Tipo-A.pdf');
    // this.fileOpener.open(this.file.applicationDirectory + 'www/assets/' + 'Manual-Tipo-A', 'application/pdf')
    //   .then(() => {console.log('File is opened')}, error => {console.log(error); console.log(JSON.stringify(error))})
    //   .catch(e => {console.log('Error openening file'); console.log(e)});

  }

  goToPage(pagina:any){
    this.rootPage = pagina;
    this.appCtrl.navPop();
    this.menuCtrl.toggle();
  }

  getAsistencia(){
    this.asistenciaProv.getAsistencia(this.authservice.AuthToken.usuario.sfid).subscribe(response =>{
      this.asistencia = response.data;
    }, error => {

    })
  }

  cambiarPlanta(){
    this.plantasProv.getPlantasPorUsuario(this.userData.usuario.sfid).subscribe(response => {
      this.plantas = response.data;
      console.log('Plantas: ', this.plantas)

          let alert = this.alertCtrl.create();
          alert.setTitle('Selección de Planta');

          // Now we add the radio buttons
          for(let i=0; i< this.plantas.length; i++) {
              let check;
              if(this.userData.planta.sfid == this.plantas[i].sfid){
                check = true;
              }else{
                check = false;
              }

              alert.addInput({
                type: 'radio',
                label: this.plantas[i].name,
                value: this.plantas[i],
                checked: check
              });
          }


          alert.addButton({
            text: 'Aceptar',
            handler: selected => {
              // this.storeUserCredentials(data);   //CAMBIAR ESTO POR EL TOKEN
              var userData = window.localStorage.getItem('currentUser');
              userData = JSON.parse(userData);
              console.log('selected: ', selected)
              // console.log('userData: ', JSON.parse(userData))
              this.userData.planta.billingcity = selected.billingcity;
              this.userData.planta.billinglatitude = selected.billinglatitude;
              this.userData.planta.billinglongitude = selected.billinglongitude;
              this.userData.planta.billingstreet = selected.billingstreet;
              this.userData.planta.determinante__c = selected.determinante__c;
              this.userData.planta.formato__c = selected.formato__c;
              this.userData.planta.name = selected.name;
              this.userData.planta.sfid = selected.sfid;
              localStorage.setItem('currentUser', JSON.stringify(this.userData));
              this.authservice.loadUserCredentials();
              return
            }
          });
          alert.addButton({
            text: 'Cancelar',
            handler: selected => {
              console.log('CANCEL')
              return
            }
          });
          // alert.addButton('Cancelar');
          alert.present();

    }, error => {

    })
  }

  deshabilitarOpcion(tipo:string){
    // if(this.userData){
      //this.asistenciaProv.getAsistencia(this.userData.usuario.sfid);
      if(this.asistenciaProv.asistencia){
          if(this.asistenciaProv.asistencia.length == 0){
            if(tipo == 'Salida'){
              return true;
            }
            if(tipo == 'Entrada'){
              return false;
            }
          }
          if(tipo == 'Salida' && this.asistenciaProv.asistencia[0].tipo__c == 'Entrada'){
            return false
          }
          if(tipo == 'Entrada' && this.asistenciaProv.asistencia[0].tipo__c == 'Salida'){
            return false
          }
          return true
      }
      return true;
    // }

    /*
    if(this.asistencia){
        if(this.asistencia.length == 0){
          if(tipo == 'Salida'){
            return true;
          }
          if(tipo == 'Entrada'){
            return false;
          }
        }
        if(tipo == 'Salida' && this.asistencia[0].tipo__c == 'Entrada'){
          return false
        }
        if(tipo == 'Entrada' && this.asistencia[0].tipo__c == 'Salida'){
          return false
        }
        return true
    }
    return true;
    */
  }

  salida(){

    /*---------------------------------------------------------

    -FALTA LA VALIDACION DE SI HAY ALGUNA RUTINA DIARIA DE HOY-

    ---------------------------------------------------------*/

    this.asistenciaProv.postAsistencia('Salida', this.userData.usuario.sfid, this.authservice.AuthToken.planta.billinglatitude, this.authservice.AuthToken.planta.billinglatitude).then(response => {
      if(response){
        this.asistenciaProv.getAsistencia(this.userData.usuario.sfid).subscribe(resp=>{
          this.asistencia = resp.data;
        }, error => {

        });
        // this.showAlert("Entrada Laboral", "Entrada Exitosa", 'HomePage');
      }
    }, error => {

    })

  }

  logout(){

    this.asistenciaProv.getAsistencia(this.authservice.AuthToken.usuario.sfid).subscribe(response =>{

      this.asistencia = response.data;

      if(this.asistencia.length != 0 && this.asistencia[0].tipo__c == 'Entrada'){
        let alert = this.alertCtrl.create({
          title: "Error al cerrar sesión",
          subTitle: "Para cerrar sesión debe realizar la Salida Laboral.",
          buttons: ['Aceptar', 'Cancelar']
        });
        alert.present();

      }else if(this.asistencia.length == 0 || (this.asistencia.length != 0 && this.asistencia[0].tipo__c == 'Salida')){

        let alert = this.alertCtrl.create({
          title: "Cerrar Sesión",
          subTitle: "¿Seguro que desea cerrar sesión?",
          buttons: [{
            text: 'Aceptar',
            handler: data => {
              this.menuCtrl.close();
              let nav = this.appCtrl.getRootNav();
              this.authservice.logout();
              nav.setRoot('LoginPage');
            }
          }, 'Cancelar']
        });
        alert.present();

        // this.authservice.logout();
        // this.menuCtrl.close();
        // let nav = this.appCtrl.getRootNav();
        // nav.setRoot(LoginPage);
      }

      console.log(JSON.stringify(this.asistencia))
    }, error => {

    })

  }
}
