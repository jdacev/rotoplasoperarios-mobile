import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { UsersProvider } from "../../providers/users/users";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _usersService : UsersProvider) {

      this._usersService.traerAlgo().subscribe(data =>{

        console.log(data);

        if(data.error){
          console.log("ERROR RECIBIENDO DATA")
        }else{
          console.log("DATA RECIBIDA");
        }
      })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

  }

}
