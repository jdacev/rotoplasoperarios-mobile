import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AuthService } from "../../providers/auth-service/auth-service";
import { RutinasProvider } from "../../providers/rutinas/rutinas";
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DatabaseService } from "../../services/database-service";


/**
 * Generated class for the DetalleRutinaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-rutina',
  templateUrl: 'detalle-rutina.html',
})
export class DetalleRutinaPage {

  rutina:any;
  images:any;
  ptarName:string;
  determinante:string;
  formato:string;
  observacion:string;
  data:any;
  origen:string;
  respuestas:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private file: File,
              private authservice: AuthService,
              private rutinasProv: RutinasProvider,
              private photoViewer: PhotoViewer,
              private dbService: DatabaseService) {

      this.ptarName = this.authservice.AuthToken.planta.name;
      this.determinante = this.authservice.AuthToken.planta.determinante__c;
      this.formato = this.authservice.AuthToken.planta.formato__c;

      this.images = [];

      // Recibo por parámetro todos los datos de la rutina.
      this.rutina = navParams.get('rutina')

      if(!this.rutina.observacion__c || this.rutina.observacion__c == ""){
        this.observacion = '---';
      }
      else{
        this.observacion = this.rutina.observacion__c;
      }

      //Get para traer las respuestas de las actividades
      if(this.rutina.id_rutinas_heroku__c){
        this.rutinasProv.getRespuestasActividades(this.rutina.id_rutinas_heroku__c).subscribe(response=>{
          this.respuestas = response.data
        }, error=>{
  
        })

        this.rutinasProv.getImagenes(this.rutina.id_rutinas_heroku__c).subscribe(response=>{
          console.log("IMAGES: " + response)
          console.log("IMAGES: " + JSON.stringify(response))
          if(response.blobs){
            this.images = response.blobs;
            console.log(this.images);
          }
          else{
            this.images = null;
          }
        }, error =>{
          console.log("ERROR:" + JSON.stringify(error));
        })

      }else{
        this.dbService.getRespuestasActividadesOffline(this.rutina.id_rutina_sqllite).then(response=>{
          this.respuestas = response;
        }, error =>{
          console.log("ERROR en getRespuestasOffline: " + JSON.stringify(error));
          
        })

        // Levanto las imágenes que se encuentren dentro de la carpeta 'rutinas/{IdRutina}'
        this.origen = file.dataDirectory + 'rutinas/'
        var subDir = this.rutina.id_rutina_sqllite.toString() + '/';
        
        file.listDir(this.origen, subDir).then(response=>{
          // this.images = response;
          for (let i = 0; i < response.length; i++) {
            this.images.push(response[i].nativeURL);
          }
        }, error=>{
          // console.log('error: ' + JSON.stringify(error));
        });
      }

      

      


  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad DetalleRutinaPage');
  }

  //Abre la imagen en un visor al seleccionarla
  abrirImagen(path:string){
    this.photoViewer.show(path);
  }

}
