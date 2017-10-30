import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { UsersProvider } from "../../providers/users/users";
import { AuthService } from "../../providers/auth-service/auth-service";


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _usersService : UsersProvider,
              public authservice: AuthService) {

      // this._usersService.traerAlgo().subscribe(data =>{
      //
      //   console.log(data);
      //
      //   if(data.error){
      //     console.log("ERROR RECIBIENDO DATA")
      //   }else{
      //     console.log("DATA RECIBIDA");
      //   }
      // })
      this.authservice.loadUserCredentials();
      var data = this.authservice.AuthToken;
      console.log(data);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

  }

  irAPagina(pagina:string){
    this.navCtrl.push(pagina);
  }

}
