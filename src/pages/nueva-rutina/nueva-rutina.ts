import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RutinasProvider } from "../../providers/rutinas/rutinas";
import { AuthService } from "../../providers/auth-service/auth-service";

@IonicPage()
@Component({
  selector: 'page-nueva-rutina',
  templateUrl: 'nueva-rutina.html',
})
export class NuevaRutinaPage {

  ptarName:string;
  ptarDate:string;
  determinante:number;
  activities = [];
  tipoRutinas = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rutinasProv: RutinasProvider,
              private authservice: AuthService) {
    this.ptarName = this.authservice.AuthToken.planta.name;
    this.ptarDate = new Date().toISOString();
    this.determinante = 123;
    this.activities = [];
    this.getTipoRutinas();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevaRutinaPage');
  }

  cancel(){
    this.navCtrl.pop();
  }

  getTipoRutinas(){
    this.rutinasProv.getTipoRutinas().subscribe(data=>{
      this.tipoRutinas = data.data;
    }, error=>{

    })
  }

  getActividades(id: number){
    // console.log(id);

/*
    this.rutinasProv.getPreguntasTipoRutina(id).subscribe(data =>{
      // console.log("data: " + data.data[0].name);
        this.activities = data.data;
        console.log(this.activities);
    }, error =>{
        this.activities = [];
        console.log("Error: " + error);
    })
*/

  }

  test(){

      // for (let i = 0; i < this.valor.length; i++) {
      //     console.log("Actividad 1: " + this.valor[i] + ", Valor: " + this.observacion[i])
      // }

  }

}
