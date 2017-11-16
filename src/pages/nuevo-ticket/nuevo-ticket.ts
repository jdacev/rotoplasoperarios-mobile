import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { TicketsProvider } from "../../providers/tickets/tickets";
import { AuthService } from "../../providers/auth-service/auth-service";

@IonicPage()
@Component({
  selector: 'page-nuevo-ticket',
  templateUrl: 'nuevo-ticket.html',
})
export class NuevoTicketPage {

  description: string;
  ptarName:string;
  ptarDate:string;
  ticketType:string;
  serviceType:string;
  images = [];
  motivoSeleccionado:any;
  descripcionSeleccionada: any;
  motivoDesestabilizacionSeleccionado : any;
  motivos;
  descripcionesMotivos;
  motivosDesestabilizacion;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private camera: Camera,
              private file: File,
              private alertCtrl: AlertController,
              private ticketsProv: TicketsProvider,
              private authservice: AuthService) {
    this.ptarName = this.authservice.AuthToken.planta.name;
    this.ptarDate = new Date().toISOString();
    this.ticketType = "Interno";
    this.description = "";
    this.serviceType = "";
    this.motivoSeleccionado = null;
    this.descripcionSeleccionada = null;
    this.getMotivosOportunidades();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoTicketPage');
  }

  cancel(){
    this.navCtrl.pop();
  }

  capturar(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imagePath) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
    //  let base64Image = 'data:image/jpeg;base64,' + imageData;
      // let     x=this.file.dataDirectory
      // var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      // var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      // this.presentToast("current name: " + currentName);
      // this.presentToast("correctPath: " + correctPath);
      // this.presentToast("imagePath: " + imagePath);
      // // this.moveFile(imagePath);
      // this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), imagePath);


      // i use x to take the folder i want to save the file to
      let x=this.file.dataDirectory;
      //when making cross platform apps make sure your .xxx setting here is compatible with ios and android
      //a simple way to seperate the folder path and the file name
      var sourceDirectory = imagePath.substring(0, imagePath.lastIndexOf('/') + 1);
      var sourceFileName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.length);
      var newFileName = "Nuevo - " + sourceFileName;

      // Here i just move the presaved image to my new folder.
      //the args of file.moveFile are (sourceDirectory,SourceFilename,DestinationDir,NewFilename)
      let move =this.file.moveFile(sourceDirectory,sourceFileName,x,newFileName)
        .then(
          file=>{ // do something with the file location
                this.presentToast("FOTO MOVIDA: " + x + newFileName);
                this.images.push(x + newFileName);
          }, error => {
                this.presentToast("ERROR MOVIENDO")
          }
                    )

    }, (err) => {
     // Handle error
    });
  }

  // Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName, fileName) {
    let basePath: string = fileName.split("/data/")[0];
    let destinationPath: string = basePath + "/Rotoplas/Images"
    this.file.copyFile(namePath, currentName, destinationPath, newFileName).then(success => {
      console.log("COPIE A A OTRO LADO")//this.lastImage = newFileName;
      this.presentToast('COPIE A A OTRO LADO: ' + destinationPath);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

    private presentToast(text) {
    let toast = this.alertCtrl.create({
      message: text,
      buttons: ['Aceptar']
    });
    toast.present();
  }

  private moveFile(fileName:string){
    // Determine paths
   let basePath: string = fileName.split("/data/")[0];
   let destinationPath: string = basePath + "/Rotoplas/Images"
   let currentPath: string = this.file.applicationStorageDirectory + "cache/";


   // Extract filename
   fileName = fileName.split("/").pop();
  //  this.presentToast("basePath: " + basePath + "            fileName: " + fileName + "            destinationPath: " + destinationPath + "\            currentPath: " + currentPath);


   // Move the file
   this.file.moveFile(currentPath, fileName,
                 destinationPath, fileName).then(_ => {
       this.presentToast("Saved one photo");
   }, error => {
     this.presentToast("ERROR: " + error);
   });
  }

  getMotivosOportunidades(){
    this.ticketsProv.getMotivosOportunidades().subscribe(response =>{
      this.motivos = response.data;
    }, error =>{

    })
  }

  getDescripcionMotivos(motivo){
    if(motivo){
      this.ticketsProv.getDescripcionMotivos(motivo.sfid).subscribe(response =>{
        this.descripcionesMotivos =  response.data;
        this.motivosDesestabilizacion = null;
        this.descripcionSeleccionada = null;
        this.motivoDesestabilizacionSeleccionado = null;
      }, error=>{

      })
    }
  }

  getMotivosDesestabilizacion(descripcion){
    if(descripcion){
      this.ticketsProv.getMotivosDesestabilizacion(descripcion.sfid).subscribe(response =>{
        this.motivosDesestabilizacion =  response.data;
        this.motivoDesestabilizacionSeleccionado = null;

      }, error=>{
        this.motivoDesestabilizacionSeleccionado = null;
        this.motivosDesestabilizacion = null;
      })
    }
  }

  createTicket(){

    var data = {
      'description' : this.description,
      'enviaagua__c' : this.serviceType,
      "origin": this.ticketType,
      'idplanta__c': this.authservice.AuthToken.planta.sfid,
      'operadorapp__c': this.authservice.AuthToken.usuario.sfid,
      'reason': this.motivoSeleccionado.name,
      'descripciondefalla__c' : this.descripcionSeleccionada.name,
      'motivodedesestabilizacion__c': this.motivoDesestabilizacionSeleccionado ? this.motivoDesestabilizacionSeleccionado.name : null
    }
    // console.log(data);
    this.ticketsProv.createTicket(data).then(response=>{
      if(response){
        this.navCtrl.pop();
      }else{

      }
    }, error=>{

    });
  }

}
