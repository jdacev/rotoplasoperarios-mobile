import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.services";
import { AuthService } from "../auth-service/auth-service";
import { AlertController } from 'ionic-angular';


@Injectable()
export class AsistenciaProvider {

  asistencia: any;

  constructor(public http: Http,
    private alertCtrl: AlertController,
    private authservice: AuthService) {
  }

  getAsistencia(idUsuario: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    var asistencia = this.http.get(URL_SERVICIOS + '/asistenciausuario/' + idUsuario, { headers: headers })
      .map(resp => resp.json());

    asistencia.subscribe(response => {
      this.asistencia = response.data;
    }, error => {

    })

    return asistencia;
  }

  postAsistencia(tipoAsistencia: string, idUsuario: string, lat: number, lng: number, token?: string) {
    var data = {
      'tipo__c': tipoAsistencia,
      'usuarioapp__c': idUsuario,
      'geolocalizacion__latitude__s': lat,
      'geolocalizacion__longitude__s': lng,
      'token': token || ''
    };

    return new Promise(resolve => {
      let headers = new Headers();
      let token = JSON.parse(localStorage.getItem('currentUser')).token;
      headers.append('Authorization', 'Bearer ' + token);

      this.http.post(URL_SERVICIOS + '/asistencia', data, { headers: headers }).subscribe(response => {
        if (data.tipo__c == 'Salida') {
          resolve(response.json().id_asistencia__c);
        }

        resolve(response);
      }, error => {
        if (error.json().nuevoToken) {
          let u = JSON.parse(localStorage.getItem('currentUser'));
          u.token = error.json().nuevoToken;
          localStorage.setItem('currentUser', JSON.stringify(u));
          this.authservice.AuthToken.token = u.token;

          this.alertCtrl.create({
            title: 'Aviso',
            subTitle: 'Sesión expirada, por favor intente nuevamente',
            buttons: ['Aceptar']
          }).present();
        }
        resolve(false)
      });
    });
  }

}
