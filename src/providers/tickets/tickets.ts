import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { URL_SERVICIOS } from "../../config/url.services";
import { AuthService } from "../../providers/auth-service/auth-service";

@Injectable()
export class TicketsProvider {


  constructor(public http: Http,
    private alertCtrl: AlertController,
    public authservice: AuthService
  ) {
    // console.log('Hello TicketsProvider Provider');
  }

  getTicketsUsuario(idPlanta: number, idUsuario: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/ticketsusuario/' + idPlanta + '/' + idUsuario, { headers: headers })
      .map(resp => resp.json())
  }

  getTicket(idTicket: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/ticket/' + idTicket, { headers: headers })
      .map(resp => resp.json())
  }

  getMotivosOportunidades() {
    /* let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token); */

    return this.http.get(URL_SERVICIOS + '/motivosoportunidades')
      .map(resp => resp.json())
  }

  getDescripcionMotivos(id) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/descripcionmotivos/' + id, { headers: headers })
      .map(resp => resp.json())
  }

  getClientesPlanta(idPlanta: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/clientesPlanta/' + idPlanta, { headers: headers })
      .map(resp => resp.json())
  }

  getMotivosDesestabilizacion(id) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/motivosdesestabilizaciones/' + id, { headers: headers })
      .map(resp => resp.json())
  }

  getImagenes(id: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/azurelistarimagenesporcontenedor/oportunidad' + id.toString(), { headers: headers })
      .map(resp => resp.json())
  }

  getTodasDescripcionesFallas() {
    /* let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token); */

    return this.http.get(URL_SERVICIOS + '/descripcionesfallas/')
      .map(resp => resp.json())
  }

  getTodasMotivosDesestabilizaciones() {
    /* let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token); */

    return this.http.get(URL_SERVICIOS + '/desestabilizaciones/')
      .map(resp => resp.json())
  }

  createTicket(data) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return new Promise(resolve => {
      this.http.post(URL_SERVICIOS + '/ticket', data, { headers: headers }).subscribe(response => {
        if (this.authservice.AuthToken.asistencia.tipo__c == 'Entrada') {
          this.showAlert("Crear Oportunidad C", response.json().message);
        }
        resolve(response.json().id_case_heroku_c__c);
      }, error => {
        this.showAlert("Error al crear Oportunidad C", error.json().message);
        resolve(null)
      });
    });
  }

  showAlert(title: string, subtitle: string) {
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
