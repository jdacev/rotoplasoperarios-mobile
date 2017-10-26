import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  isLoggedin: boolean;
  AuthToken;

  constructor(public http: Http,
              private alertCtrl: AlertController) {
    this.http = http;
    this.isLoggedin = false;
    this.AuthToken = null;
  }

  storeUserCredentials(token) {
    window.localStorage.setItem('currentUser', token);
    this.useCredentials(token);

  }

  useCredentials(token) {
    this.isLoggedin = true;
    this.AuthToken = token;
  }

  loadUserCredentials() {
    var token = window.localStorage.getItem('currentUser');
    this.useCredentials(token);
  }

  destroyUserCredentials() {
    this.isLoggedin = false;
    this.AuthToken = null;
    window.localStorage.clear();
  }

  authenticate(username, password) {
    // var creds = "name=" + user.name + "&password=" + user.password;
    var creds = "grant_type=password&username=" + username + "&password=" + encodeURIComponent(password);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
        this.http.post('http://travelrequestsback.grupoassa.com/token', creds, {headers: headers}).subscribe(data => {
            if(data.json().access_token){
                console.log("ME LOGUEE")
                this.storeUserCredentials(data.json().access_token);
                resolve(true);
            }
            else{
              console.log("NO ME LOGUEE UNA MIERDA")
              resolve(false);
            }
        }, error =>{
          this.showAlert("Error al iniciar sesión", "Usuario o password incorrecta. Intente nuevamente");
        });
    });
  }

  adduser(user) {
    var creds = "name=" + user.name + "&password=" + user.password;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
        this.http.post('http://localhost:3333/adduser', creds, {headers: headers}).subscribe(data => {
            if(data.json().success){
                resolve(true);
            }
            else
                resolve(false);
        });
    });
  }

  getinfo() {
    return new Promise(resolve => {
        var headers = new Headers();
        this.loadUserCredentials();
        console.log(this.AuthToken);
        headers.append('Authorization', 'Bearer ' +this.AuthToken);
        this.http.get('http://localhost:3333/getinfo', {headers: headers}).subscribe(data => {
            if(data.json().success)
                resolve(data.json());
            else
                resolve(false);
        });
      })
    }

    logout() {
      this.destroyUserCredentials();
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
