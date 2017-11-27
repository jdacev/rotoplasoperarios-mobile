import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';

import { URL_SERVICIOS } from "../../config/url.services";

/*
  Generated class for the RutinasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RutinasProvider {

  constructor(public http: Http,
              private alertCtrl: AlertController) {
    // console.log('Hello RutinasProvider Provider');
  }

  getPreguntasTipoRutina(id: number){
    return this.http.get(URL_SERVICIOS + '/preguntastiporutina/' + id)
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

  crearRutina(data){
    return new Promise(resolve => {
        this.http.post(URL_SERVICIOS + '/rutina', data).subscribe(response => {
          this.showAlert("Crear Rutina", response.json().message);
          resolve(true);
        }, error =>{
          this.showAlert("Error al crear Oportunidad C", error.json().message);
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
