import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';

import { URL_SERVICIOS } from "../../config/url.services";

/*
  Generated class for the PlantasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlantasProvider {

  constructor(public http: Http,
              private alertCtrl: AlertController) {
    console.log('Hello PlantasProvider Provider');
  }

  getPlantasPorUsuario(idUsuario: number){
    return this.http.get(URL_SERVICIOS + '/configuracion/' + idUsuario)
              .map(resp => resp.json())
  }

  getClientesByPlanta(sfidPlanta){
    return this.http.get(URL_SERVICIOS + '/clientesplanta/' + sfidPlanta)
              .map(resp => resp.json())
  }

}
