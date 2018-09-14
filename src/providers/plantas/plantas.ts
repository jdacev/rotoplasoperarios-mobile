import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';

import { URL_SERVICIOS } from "../../config/url.services";

@Injectable()
export class PlantasProvider {

  constructor(public http: Http,
    private alertCtrl: AlertController) {
  }

  getPlantasPorUsuario(idUsuario: number) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/configuracion/' + idUsuario, { headers: headers })
      .map(resp => resp.json())
  }

  getClientesByPlanta(sfidPlanta) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/clientesplanta/' + sfidPlanta, { headers: headers })
      .map(resp => resp.json())
  }

}
