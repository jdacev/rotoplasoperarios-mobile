import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.services";
import { AuthService } from "../auth-service/auth-service";

/*
  Generated class for the AsistenciaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AsistenciaProvider {

  asistencia: any;

  constructor(public http: Http,
    private authservice: AuthService) {
    // console.log('Hello AsistenciaProvider Provider');
    // if(authservice.isLoggedin && authservice.AuthToken){
    //   this.getAsistencia(authservice.AuthToken.usuario.sfid).subscribe(response=>{
    //     this.asistencia = response;
    //   }, error => {
    //
    //   })
    // }else{
    //   this.asistencia = null;
    // }
  }

  getAsistencia(idUsuario: string) {
    var asistencia = this.http.get(URL_SERVICIOS + '/asistenciausuario/' + idUsuario)
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
      this.http.post(URL_SERVICIOS + '/asistencia', data).subscribe(response => {
        // console.log("SALIDAresponse: " + JSON.stringify(response))
        if (data.tipo__c == 'Salida') {
          // console.log("ID : " + response.json().id_asistencia__c);
          resolve(response.json().id_asistencia__c);
          // resolve(id);
        }

        resolve(response);
      }, error => {
        resolve(false)
      });
    });
  }

}
