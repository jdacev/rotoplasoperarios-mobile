import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.services";

/*
  Generated class for the SyncProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SyncProvider {

  constructor(public http: Http) {
    console.log('Hello SyncProvider Provider');
  }

  getPreguntasRutinas(){
    return this.http.get(URL_SERVICIOS + '/sync-preguntasrutina/')
              .map(resp => resp.json());

  }

  getTipoRutinas(){
    return this.http.get(URL_SERVICIOS + '/sync-tiporutinas/')
              .map(resp => resp.json());

  }

}
