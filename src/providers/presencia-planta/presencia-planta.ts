import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthService } from '../auth-service/auth-service';
import { URL_SERVICIOS } from "../../config/url.services";
import 'rxjs/add/operator/map';
import * as moment from 'moment';
moment.locale('es');

@Injectable()
export class PresenciaPlantaProvider {

  idnotificacion = 3;

  constructor(
    public http: Http,
    private localNotifications: LocalNotifications,
    private usuario: AuthService
  ) {
    console.log('Hello PresenciaPlantaProvider Provider');
  }

  ausenciaLaborar(data) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    let parametros = {
      operador: this.usuario.AuthToken.usuario.name,
      planta: this.usuario.AuthToken.planta.name,
      motivo: data.motivo,
      fecha: moment().format('DD-MM-YYYY'),
      horaini: data.inicio,
      horafin: data.fin
    };
    localStorage.setItem('ausencia', JSON.stringify(parametros));
    return this.http.post(URL_SERVICIOS + '/control-presencia/ausencia', parametros, { headers: headers })
      .map(resp => {
        return resp.json()
      });
  }

  enviarUbicacionEmal(data) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.post(URL_SERVICIOS + '/control-presencia/abandono', data, { headers: headers });
  }

  revisionPresenciaPlanta(data) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.post(URL_SERVICIOS + '/control-presencia/presencia', data, { headers: headers });
  }

}
