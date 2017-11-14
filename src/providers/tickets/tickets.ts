import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.services";

/*
  Generated class for the TicketsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TicketsProvider {

  constructor(public http: Http) {
    console.log('Hello TicketsProvider Provider');
  }

  getTicketsUsuario(idPlanta: number, idUsuario: string){
    return this.http.get(URL_SERVICIOS + '/ticketsusuario/' + idPlanta + '/' + idUsuario)
              .map(resp => resp.json())
  }

  createTicket(description:string, date:string, idPlanta:number, idUsuario:string){
    var data = {
      'description' : description,
      'createddate' : date,
      'idplanta_fk_heroku': idPlanta,
      'usuarioapp__c': idUsuario
    }

    return new Promise(resolve => {
        this.http.post(URL_SERVICIOS + '/tickets', data).subscribe(response => {
          console.log(response)
        }, error =>{
          console.log(error);
        });
    });


  }

}
