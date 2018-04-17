import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { URL_SERVICIOS } from "../../config/url.services";

/*
  Generated class for the TicketsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TicketsProvider {


  constructor(public http: Http,
              private alertCtrl: AlertController) {
    // console.log('Hello TicketsProvider Provider');
  }

  getTicketsUsuario(idPlanta: number, idUsuario: string){
    return this.http.get(URL_SERVICIOS + '/ticketsusuario/' + idPlanta + '/' + idUsuario)
              .map(resp => resp.json())
  }

  getTicket(idTicket: string){
    return this.http.get(URL_SERVICIOS + '/ticket/' + idTicket)
              .map(resp => resp.json())
  }

  getMotivosOportunidades(){
    return this.http.get(URL_SERVICIOS + '/motivosoportunidades')
              .map(resp => resp.json())
  }

  getDescripcionMotivos(id){
    return this.http.get(URL_SERVICIOS + '/descripcionmotivos/' + id)
              .map(resp => resp.json())
  }

  getClientesPlanta(idPlanta:string){
    return this.http.get(URL_SERVICIOS + '/clientesPlanta/' + idPlanta)
              .map(resp => resp.json())
  }

  getMotivosDesestabilizacion(id){
    return this.http.get(URL_SERVICIOS + '/motivosdesestabilizaciones/' + id)
              .map(resp => resp.json())
  }

  getImagenes(id:string){
    // console.log("URL: " + URL_SERVICIOS + '/azurelistarimagenesporcontenedor/oportunidad' +id.toString())
    return this.http.get(URL_SERVICIOS + '/azurelistarimagenesporcontenedor/oportunidad' +id.toString())
              .map(resp => resp.json())
  }

  getTodasDescripcionesFallas(){
    return this.http.get(URL_SERVICIOS + '/descripcionesfallas/')
              .map(resp => resp.json())
  }

  getTodasMotivosDesestabilizaciones(){
    return this.http.get(URL_SERVICIOS + '/desestabilizaciones/')
              .map(resp => resp.json())
  }

  createTicket(data){
    // var data = {
    //   'description' : description,
    //   'createddate' : date,
    //   'idplanta_fk_heroku': idPlanta,
    //   'usuarioapp__c': idUsuario
    // }

    return new Promise(resolve => {
        this.http.post(URL_SERVICIOS + '/ticket', data).subscribe(response => {
          this.showAlert("Crear Oportunidad C", response.json().message);
          resolve(response.json().id_case_heroku_c__c);
        }, error =>{
          this.showAlert("Error al crear Oportunidad C", error.json().message);
          resolve(null)
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
