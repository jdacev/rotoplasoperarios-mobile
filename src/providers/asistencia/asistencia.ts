import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.services";
import { AuthService } from "../auth-service/auth-service";


@Injectable()
export class AsistenciaProvider {

  asistencia: any;

  constructor(public http: Http,
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
        resolve(false)
      });
    });
  }

}
