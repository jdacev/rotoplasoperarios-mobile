import { Component } from '@angular/core';
import { Platform, App, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { File } from '@ionic-native/file';

//import { FirebaseMessaging } from '@ionic-native/firebase-messaging';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

import { AuthService } from "../providers/auth-service/auth-service";
import { AsistenciaProvider } from "../providers/asistencia/asistencia";
import { PlantasProvider } from "../providers/plantas/plantas";
import { NetworkService } from "../services/network-service";

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AsistenciaPage } from '../pages/asistencia/asistencia';
import { Geolocation } from '@ionic-native/geolocation';
import { PresenciaPlantaProvider } from '../providers/presencia-planta/presencia-planta';
import * as moment from 'moment';
moment.locale('es');
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  loginPage = LoginPage;
  homePage = HomePage;
  asistenciaPage = AsistenciaPage;
  plantas: any;
  userData: any;
  asistencia: any;
  rootPage: any;
  showMenu: boolean;
  url: string;
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    public appCtrl: App,
    private alertCtrl: AlertController,
    public authservice: AuthService,
    private keyboard: Keyboard,
    private asistenciaProv: AsistenciaProvider,
    private plantasProv: PlantasProvider,
    private file: File,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    private networkService: NetworkService,
    //private firebaseMessaging: FirebaseMessaging,
    private geolocation: Geolocation,
    private _presencia: PresenciaPlantaProvider
  ) {

    platform.ready().then(() => {
      //this.revisarNotificaciones();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      keyboard.disableScroll(true);
      statusBar.styleDefault();
      splashScreen.hide();
    });


    this.showMenu = false;
    this.authservice.loadUserCredentials();

    if (this.authservice.isLoggedin && this.authservice.AuthToken) {
      console.log("AUTH:" + JSON.stringify(this.authservice.AuthToken));

      console.log("ACA1")
      this.userData = this.authservice.AuthToken
      // this.asistenciaProv.getAsistencia(this.userData.usuario.sfid).subscribe(response => {

      this.asistencia = this.authservice.AuthToken.asistencia;
      this.rootPage = 'HomePage';
      this.appCtrl.navPop();

    } else {
      this.goToPage('LoginPage')
    }
  }

  showSubMenu() {
    this.showMenu = !this.showMenu;
  }

  descargar(tipo: string) {

    var url = this.file.applicationDirectory + 'www/assets/';
    switch (tipo) {
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
      openWith: { enabled: false }
    }

    this.document.viewDocument(url, 'application/pdf', options);

  }

  goToPage(pagina: any) {
    this.rootPage = pagina;
    this.appCtrl.navPop();
    this.menuCtrl.toggle();
  }

  getAsistencia() {
    this.asistenciaProv.getAsistencia(this.authservice.AuthToken.usuario.sfid).subscribe(response => {
      this.asistencia = response.data;
    }, error => {

    })
  }

  cambiarPlanta() {
    this.plantasProv.getPlantasPorUsuario(this.authservice.AuthToken.usuario.sfid).subscribe(response => {
      this.plantas = response.data;

      let alert = this.alertCtrl.create();
      alert.setTitle('Selección de Planta');

      // Now we add the radio buttons
      for (let i = 0; i < this.plantas.length; i++) {
        let check;
        if (this.authservice.AuthToken.planta.sfid == this.plantas[i].sfid) {
          check = true;
        } else {
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
        text: 'Cancelar',
        handler: selected => {
          console.log('CANCEL')
          return
        }
      });
      alert.addButton({
        text: 'Aceptar',
        handler: selected => {
          // this.storeUserCredentials(data);   //CAMBIAR ESTO POR EL TOKEN
          this.plantasProv.getClientesByPlanta(selected.sfid).subscribe(response => {
            this.userData = this.authservice.AuthToken;
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
            this.userData.clientes = response.data;
            localStorage.setItem('currentUser', JSON.stringify(this.userData));
            this.authservice.loadUserCredentials();
            return;
          }, error => {

          })

        }
      });

      alert.present();

    }, error => {

    })
  }

  deshabilitarOpcion(tipo: string) {
    if (this.authservice.AuthToken) {

      if (this.authservice.AuthToken.asistencia.tipo__c == '' || this.authservice.AuthToken.asistencia.tipo__c == null || this.authservice.AuthToken.asistencia.tipo__c == 'Salida') {
        if (tipo == 'Salida') {
          return true;
        }
        if (tipo == 'Entrada') {
          return false;
        }
      }
      if (tipo == 'Salida' && this.authservice.AuthToken.asistencia.tipo__c == 'Entrada') {
        return false
      }
      if (tipo == 'Entrada' && this.authservice.AuthToken.asistencia.tipo__c == 'Salida') {
        return false
      }
      return true
    }
    return true;

  }

  salida() {

    this.asistenciaProv.postAsistencia('Salida', this.userData.usuario.sfid, this.authservice.AuthToken.planta.billinglatitude, this.authservice.AuthToken.planta.billinglatitude).then(response => {
      if (response) {
        localStorage.removeItem('ausencia');
        this.asistenciaProv.getAsistencia(this.userData.usuario.sfid).subscribe(resp => {
          this.asistencia = resp.data;
        }, error => {

        });

      }
    }, error => {

    })

  }

  logout() {

    this.asistencia = this.authservice.AuthToken.asistencia;

    if (this.asistencia != '' && this.asistencia != null && this.asistencia.tipo__c == 'Entrada') {
      let alert = this.alertCtrl.create({
        title: "Error al cerrar sesión",
        subTitle: "Para cerrar sesión debe realizar la Salida Laboral.",
        buttons: ['Aceptar']
      });
      alert.present();

    } else if (this.asistencia == '' || this.asistencia == null || (this.asistencia != '' && this.asistencia != null && this.asistencia.tipo__c == 'Salida')) {

      let alert = this.alertCtrl.create({
        title: "Cerrar Sesión",
        subTitle: "¿Seguro que desea cerrar sesión?",
        buttons: [
          'Cancelar', {
            text: 'Aceptar',
            handler: data => {
              this.menuCtrl.close();
              let nav = this.appCtrl.getRootNav();
              this.authservice.logout();
              nav.setRoot('LoginPage');
            }
          }]
      });
      alert.present();

    }

    console.log(JSON.stringify(this.asistencia))

  }

  esAusenciaLaboral() {
    let ausencia = JSON.parse(localStorage.getItem('ausencia'));

    if (ausencia) {
      let horaInicio = moment().set({ hour: ausencia.horaini.split(':')[0], minute: ausencia.horaini.split(':')[1], second: 0 });
      let horaFin = moment().set({ hour: ausencia.horafin.split(':')[0], minute: ausencia.horafin.split(':')[1], second: 59 });
      let horaactual = moment();
      console.log('inicio: ', horaInicio);
      console.log('fin: ', horaFin);
      console.log('actual: ', horaactual);
      return horaactual.isBetween(horaInicio, horaFin);

    }
    return false;
  }

  /* revisarNotificaciones() {

    this.firebaseMessaging.onMessage().subscribe(resp => {
      console.log('foreground notificacion:', resp);

      // UBICACION
      if (resp.tipo_notificacion === 'Ubicación') {
        this.geolocation.getCurrentPosition().then((resp) => {
          if (!this.authservice.validaUbicacion(resp.coords.latitude, resp.coords.longitude) && !this.esAusenciaLaboral()) {
            // enviar notificacion de que no esta en la planta
            let data = {
              'operador': this.authservice.AuthToken.usuario.name,
              'sfid': this.authservice.AuthToken.usuario.sfid,
              'geocerca': this.authservice.AuthToken.planta.radio__c,
              'planta': this.authservice.AuthToken.planta.name,
              'fecha': moment().format('MMMM DD YYYY, h:mm:ss a'),
              'latitud': resp.coords.latitude,
              'longitud': resp.coords.longitude
            };
            this._presencia.enviarUbicacionEmal(data).subscribe((resp) => {
              console.log('respuesta: ', resp);
            });
          }
        });
      } else {
        //PRESENCIA
        let tarea = Observable.interval(100000).subscribe(() => {
          console.log('ejecutando interval');
          let data = {
            'operador': this.authservice.AuthToken.usuario.name,
            'sfid': this.authservice.AuthToken.usuario.sfid,
            'geocerca': this.authservice.AuthToken.planta.radio__c,
            'planta': this.authservice.AuthToken.planta.name,
            'fecha': moment().format('MMMM DD YYYY, h:mm:ss a')
          };
          this._presencia.revisionPresenciaPlanta(data).subscribe((resp) => {
            console.log('respuesta presencia: ', resp);
          });
          tarea.unsubscribe();
        });
      }
    });

    this.firebaseMessaging.onBackgroundMessage().subscribe(resp => {
      console.log('background notificacion: ', resp);
      this.geolocation.getCurrentPosition().then((resp) => {
        if (!this.authservice.validaUbicacion(resp.coords.latitude, resp.coords.longitude) && !this.esAusenciaLaboral()) {
          // enviar notificacion de que no esta en la planta
          let data = {
            'operador': this.authservice.AuthToken.usuario.name,
            'sfid': this.authservice.AuthToken.usuario.sfid,
            'geocerca': this.authservice.AuthToken.planta.radio__c,
            'planta': this.authservice.AuthToken.planta.name,
            'fecha': moment().format('MMMM DD YYYY, h:mm:ss a'),
            'latitud': resp.coords.latitude,
            'longitud': resp.coords.longitude
          };
          this._presencia.enviarUbicacionEmal(data).subscribe((resp) => {
            console.log('respuesta: ', resp);
          });

        }
      });
    });
  } */


}
