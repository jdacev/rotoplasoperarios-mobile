import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
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

  images = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private rutinasProv: RutinasProvider,
              private authservice: AuthService,
              private camera: Camera,
              private file: File,
              private alertCtrl: AlertController) {
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

  capturar(){
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imagePath) => {
      // this.presentToast("Imagen Capturada: " + imagePath);
      this.images.push(imagePath)

    }, (err) => {
     // Handle error
    });
  }

  private presentToast(text) {
    let toast = this.alertCtrl.create({
      message: text,
      buttons: ['Aceptar']
    });
    toast.present();
  }

  moverArchivo(images:string[], id){

    var dataDirectory=this.file.dataDirectory;
    var origen = dataDirectory + 'rutinas/'
    var sourceDirectory = images[0].substring(0, images[0].lastIndexOf('/') + 1);
    var destino = dataDirectory + 'rutinas/' + id.toString() + '/';
    this.validarDirectorio(dataDirectory, 'rutinas').then(response=>{
      if(response)
        this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
      else(response)
        this.file.createDir(dataDirectory, 'rutinas', false).then(data=>{
          this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
        }, err =>{

          this.presentToast('Error al crear la carpeta Rutinas: ' + err);
        });
    }, error =>{

    })


  }

  crearCarpetasId(origen, sourceDirectory, destino, images, id){

    this.file.createDir(origen, id.toString(), false).then(data=>{

      for (let i = 0; i < images.length; i++) {

          var fileName = images[i].substring(images[i].lastIndexOf('/') + 1, images[0].length);


          this.file.moveFile(sourceDirectory,fileName,destino,fileName)
          .then(
            file=>{

            }, error => {
            this.presentToast("ERROR MOVIENDO: " + error.message + "   ...error: " + error)
          })
      }

    }, err =>{
      this.presentToast('Error al crear la carpeta id: ' + err)
    });
  }

  validarDirectorio(dataDirectory, subDirectorio){
    return new Promise(resolve=>{
      this.file.checkDir(dataDirectory, subDirectorio)
                .then(_ => {
                  resolve(true);
                })
                .catch(err => {
                  resolve(false);
                  this.presentToast('Error al crear Directorio: ' + err)
                  // });
      });
    });
  }

  eliminarImagen(pos:number, imagen:string){
    var directorio = imagen.substring(0, imagen.lastIndexOf('/') + 1);
    var nombreArchivo = imagen.substring(imagen.lastIndexOf('/') + 1, imagen.length);
    this.file.removeFile(directorio, nombreArchivo);
    this.images.splice(pos, 1)
  }

  getTipoRutinas(){
    this.rutinasProv.getTipoRutinas().subscribe(data=>{
      this.tipoRutinas = data.data;
    }, error=>{

    })
  }

  getActividades(idTipoRutina:string, turno:string){
    // console.log(id);
    if(idTipoRutina && turno){
      this.rutinasProv.getPreguntasTipoRutina(idTipoRutina, turno).subscribe(data =>{
        // console.log("data: " + data.data[0].name);
        this.activities = data.data;
        for (let i = 0; i < this.activities.length; i++) {
          this.activities[i].observacion = undefined;
          if(!this.activities[i].tipo_de_respuesta__c){
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

  }

  respuestasIncompletas(){
    for (let i = 0; i < this.activities.length; i++) {
        if(this.activities[i].valor == undefined || (this.activities[i].tipo_de_respuesta__c && this.activities[i].valor == ""))
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
            'valor_si_no__c' : !this.activities[i].tipo_de_respuesta__c ? this.activities[i].valor : null,
            'valornumerico__c' : this.activities[i].tipo_de_respuesta__c ? this.activities[i].valor : null,
            'observaciones__c' : this.activities[i].observaciones
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
        if(this.images.length > 0){
          this.moverArchivo(this.images, response);
        }
        this.navCtrl.pop();
      }else{

      }
    }, error=>{

    });
  }

}
