import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.services";

@Injectable()
export class SyncProvider {

  constructor(public http: Http) {
  }

  getPreguntasRutinas() {
    /* let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token); */

    return this.http.get(URL_SERVICIOS + '/sync-preguntasrutina/')
      .map(resp => resp.json());

  }

  getTipoRutinas() {
    /* let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token); */

    return this.http.get(URL_SERVICIOS + '/sync-tiporutinas/')
      .map(resp => resp.json());

  }

}
