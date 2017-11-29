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
  formato:string;
  determinante:number;
  activities = [];
  tipoRutinas = [];
  tipoRutina:string;
  observacion:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rutinasProv: RutinasProvider,
              private authservice: AuthService) {
    this.ptarName = this.authservice.AuthToken.planta.name;
    this.ptarDate = new Date().toISOString();
    this.determinante = this.authservice.AuthToken.planta.determinante__c;
    this.formato = this.authservice.AuthToken.planta.formato__c;
    this.activities = [];
    this.tipoRutina = null;
    this.observacion = "";
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

    this.rutinasProv.getPreguntasTipoRutina(id).subscribe(data =>{
      // console.log("data: " + data.data[0].name);
        this.activities = data.data;
        for (let i = 0; i < this.activities.length; i++) {
          this.activities[i].observacion = undefined;
          if(this.activities[i].tipo_de_respuesta__c){
            this.activities[i].valor = false;
          }else{
            this.activities[i].valor = undefined;
          }
        }
        console.log(this.activities);
    }, error =>{
        this.activities = [];
        console.log("Error: " + error);
    })

  }

  respuestasIncompletas(){
    for (let i = 0; i < this.activities.length; i++) {
        if(this.activities[i].valor == undefined || (!this.activities[i].tipo_de_respuesta__c && this.activities[i].valor == ""))
          return true;
    }

    return false;
  }

  crearRutina(){
    var listaActividades = [];
    for (let i = 0; i < this.activities.length; i++) {
        listaActividades.push(
          {
            'id_pregunta_rutina__c': this.activities[i].sfid,
            'valor_si_no__c' : this.activities[i].tipo_de_respuesta__c ? this.activities[i].valor : null,
            'valornumerico__c' : !this.activities[i].tipo_de_respuesta__c ? this.activities[i].valor : null
          });
    }

    var data = {
      'observacion__c' : this.observacion,
      'idtiporutina__c' : this.tipoRutina,
      "idplanta__c": this.authservice.AuthToken.planta.sfid,
      'usuarioapp__c': this.authservice.AuthToken.usuario.sfid,
      'rutaimagen__c': 'RUTA/IMAGEN/',
      'actividadrutina__c': listaActividades
    }
    console.log(data)

    console.log(data);
    this.rutinasProv.crearRutina(data).then(response=>{
      if(response){
        this.navCtrl.pop();
      }else{

      }
    }, error=>{

    });
  }

}
