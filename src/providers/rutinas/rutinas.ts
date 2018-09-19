import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
import { URL_SERVICIOS } from "../../config/url.services";


@Injectable()
export class RutinasProvider {

  constructor(public http: Http,
    private alertCtrl: AlertController,
    public authservice: AuthService) {
  }

  getPreguntasTipoRutina(idTipoRutina: string, turno: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/preguntastiporutina/' + idTipoRutina + '/' + turno, { headers: headers })
      .map(resp => resp.json())
  }

  getRespuestasActividades(idRutina: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/actividadesrutinas/' + idRutina, { headers: headers })
      .map(resp => resp.json())
  }

  getRutinasUsuario(idPlanta: number, idUsuario: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/rutinasusuario/' + idPlanta + '/' + idUsuario, { headers: headers })
      .map(resp => resp.json())
  }

  getTipoRutinas() {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/tiporutinas', { headers: headers })
      .map(resp => resp.json())
  }

  getImagenes(id: string) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(URL_SERVICIOS + '/azurelistarimagenesporcontenedor/rutina' + id.toString(), { headers: headers })
      .map(resp => resp.json())
  }

  crearRutina(data) {
    let headers = new Headers();
    let token = JSON.parse(localStorage.getItem('currentUser')).token;
    headers.append('Authorization', 'Bearer ' + token);

    return new Promise(resolve => {
      this.http.post(URL_SERVICIOS + '/rutina', data, { headers: headers }).subscribe(response => {
        if (this.authservice.AuthToken.asistencia.tipo__c == 'Entrada') {
          this.showAlert("Crear Rutina", response.json().message);
          resolve(response.json().id_rutina_heroku__c);
        } else if (this.authservice.AuthToken.asistencia.tipo__c == 'Salida') {
          resolve(response.json().id_rutina_heroku__c);
        }
      }, error => {
        this.showAlert("Error al crear Rutina", error.json().message);
        resolve(false)
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
