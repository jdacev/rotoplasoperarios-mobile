import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
import { URL_SERVICIOS } from "../../config/url.services";

/*
  Generated class for the RutinasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RutinasProvider {

  constructor(public http: Http,
              private alertCtrl: AlertController,
              public authservice: AuthService) {
    // console.log('Hello RutinasProvider Provider');
  }

  getPreguntasTipoRutina(idTipoRutina: string, turno:string){
    return this.http.get(URL_SERVICIOS + '/preguntastiporutina/' + idTipoRutina + '/' + turno)
              .map(resp => resp.json())
  }

  getRespuestasActividades(idRutina:string){
    return this.http.get(URL_SERVICIOS + '/actividadesrutinas/' + idRutina)
              .map(resp => resp.json())
  }

  getRutinasUsuario(idPlanta: number, idUsuario: string){
    return this.http.get(URL_SERVICIOS + '/rutinasusuario/' + idPlanta + '/' + idUsuario)
              .map(resp => resp.json())
  }

  getTipoRutinas(){
    return this.http.get(URL_SERVICIOS + '/tiporutinas')
              .map(resp => resp.json())
  }

  getImagenes(id:string){
    console.log("URL: " + URL_SERVICIOS + '/azurelistarimagenesporcontenedor/rutina' +id.toString())
    return this.http.get(URL_SERVICIOS + '/azurelistarimagenesporcontenedor/rutina' +id.toString())
              .map(resp => resp.json())
  }

  crearRutina(data){
    return new Promise(resolve => {
        this.http.post(URL_SERVICIOS + '/rutina', data).subscribe(response => {
          if (this.authservice.AuthToken.asistencia.tipo__c == 'Entrada'){
            this.showAlert("Crear Rutina", response.json().message);
            resolve(response.json().id_rutina_heroku__c);
          } else if (this.authservice.AuthToken.asistencia.tipo__c == 'Salida'){
            resolve(response.json().id_rutina_heroku__c);
          }
        }, error =>{
          this.showAlert("Error al crear Rutina", error.json().message);
          resolve(false)
        });
    });
  }

  showAlert(title:string, subtitle:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [{
        text: 'Ok'
      }]
    });
    alert.present();
  }

}
