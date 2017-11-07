import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RutinasProvider } from "../../providers/rutinas/rutinas";

@IonicPage()
@Component({
  selector: 'page-nueva-rutina',
  templateUrl: 'nueva-rutina.html',
})
export class NuevaRutinaPage {

  ptarName:string;
  ptarDate:string;
  determinante:number;
  activities:any[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rutinasProv: RutinasProvider) {
    this.ptarName = "Planta nro 1";
    this.ptarDate = new Date().toISOString();
    this.determinante = 123;
    this.activities = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevaRutinaPage');
  }

  cancel(){
    this.navCtrl.pop();
  }

  getActividades(id: number){
    console.log(id);
    // this.rutinasProv.getActividadesPorRutina(id).subscribe(data =>{
    //
    //   // console.log("data: " + data.data[0].name);
    //
    //   if(data.status != 'success'){
    //     console.log("ERROR RECIBIENDO DATA")
    //   }else{
    //     this.activities = data.data;
    //     console.log(this.activities);
    //   }
    // }, error =>{
    //     console.log("Error: " + error);
    // })
  }

  test(){

      // for (let i = 0; i < this.valor.length; i++) {
      //     console.log("Actividad 1: " + this.valor[i] + ", Valor: " + this.observacion[i])
      // }

  }

}
