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
  clienteSeleccionado:any;
  clientes:any;
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
    this.clientes = [];
    // this.images.push('../assets/team.jpg')
    // this.images.push('../assets/team.jpg')
    // this.images.push('../assets/team.jpg')
    // this.images.push('../assets/team.jpg')
    // this.images.push('../assets/team.jpg')
    this.getMotivosOportunidades();
    this.getClientesPlanta();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NuevoTicketPage');
  }

  cancel(){
    this.navCtrl.pop();
  }

  checkDirectory(){
    let dataDirectory=this.file.dataDirectory;
    dataDirectory = dataDirectory.split('/rotoplas.app')[0];
    this.presentToast("dataDirectory: " + dataDirectory);
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
      this.presentToast("Imagen Capturada: " + imagePath);
      this.images.push(imagePath)

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
      // let dataDirectory=this.file.dataDirectory;
      // this.presentToast("dataDirectory: " + dataDirectory);
      // //when making cross platform apps make sure your .xxx setting here is compatible with ios and android
      // //a simple way to seperate the folder path and the file name
      // var sourceDirectory = imagePath.substring(0, imagePath.lastIndexOf('/') + 1);
      // var sourceFileName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.length);
      // var newFileName = "Nuevo - " + sourceFileName;

      //
      // // Here i just move the presaved image to my new folder.
      // //the args of file.moveFile are (sourceDirectory,SourceFilename,DestinationDir,NewFilename)
      // let move =this.file.moveFile(sourceDirectory,sourceFileName,dataDirectory,newFileName)
      //                     .then(
      //                       file=>{ // do something with the file location
      //                             this.presentToast("FOTO MOVIDA A : " + dataDirectory + newFileName);
      //                             this.images.push(dataDirectory + newFileName);
      //                       }, error => {
      //                             this.presentToast("ERROR MOVIENDO")
      //                       })

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

  moverArchivo(images:string[], id){

    let dataDirectory=this.file.dataDirectory;
    var sourceDirectory = images[0].substring(0, images[0].lastIndexOf('/') + 1);
    var destino = dataDirectory + id.toString() + '/';

    // this.file.checkDir(dataDirectory, id)
    //           .then(_ => {
    //             this.presentToast('Directory exists')
    //           })
    //           .catch(err => {
    //             this.presentToast('Directory doesnt exist')
    this.file.createDir(dataDirectory, id.toString(), false).then(data=>{
      this.presentToast('CREADO DIRECTORIO: ' + dataDirectory + ' ....archivo: ' + id.toString())
    }, err =>{
      this.presentToast('Error al crear Directorio: ' + err)
    });

              // });

    // this.presentToast('dataDirectory: ' + dataDirectory);
    var fileName = images[0].substring(images[0].lastIndexOf('/') + 1, images[0].length);
    // var newFileName = "" + fileName;
    this.file.moveFile(sourceDirectory,fileName,destino,fileName)
                    .then(
                      file=>{ // do something with the file location
                            this.presentToast("FOTO MOVIDA A : " + destino + fileName);
                            this.images.push(dataDirectory + fileName);
                      }, error => {
                            this.presentToast("ERROR MOVIENDO: " + error.message + "   ...error: " + error)
                      })
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

  eliminarImagen(pos:number, imagen:string){
    // console.log('pos:' + pos + ', ' + imagen);
    var directorio = imagen.substring(0, imagen.lastIndexOf('/') + 1);
    var nombreArchivo = imagen.substring(imagen.lastIndexOf('/') + 1, imagen.length);
    this.file.removeFile(directorio, nombreArchivo);
    this.images.splice(pos, 1)
  }

  ordenar(item1, item2){
    return (item1 < item2 ? -1 : (item1 === item2 ? 0 : 1));
  }

  getMotivosOportunidades(){
    this.ticketsProv.getMotivosOportunidades().subscribe(response =>{

      // this.motivos = response.data;
      this.motivos = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
    }, error =>{

    })
  }



  getDescripcionMotivos(motivo){
    if(motivo){
      this.ticketsProv.getDescripcionMotivos(motivo.sfid).subscribe(response =>{
        this.descripcionesMotivos =  response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
        this.motivosDesestabilizacion = null;
        this.descripcionSeleccionada = null;
        this.motivoDesestabilizacionSeleccionado = null;
      }, error=>{
        this.descripcionesMotivos = null;
      })
    }
  }

  getMotivosDesestabilizacion(descripcion){
    if(descripcion){
      this.ticketsProv.getMotivosDesestabilizacion(descripcion.sfid).subscribe(response =>{
        this.motivosDesestabilizacion = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
        this.motivoDesestabilizacionSeleccionado = null;

      }, error=>{
        this.motivoDesestabilizacionSeleccionado = null;
        this.motivosDesestabilizacion = null;
      })
    }
  }

  getClientesPlanta(){
    this.ticketsProv.getClientesPlanta(this.authservice.AuthToken.planta.sfid).subscribe(response =>{
      this.clientes = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));

    }, error=>{

    })
  }

  createTicket(){

    var data = {
      'description' : this.description,
      'enviaagua__c' : this.serviceType,
      "origin": 'App. Sistema de Monitoreo Sytesa',
      'idplanta__c': this.authservice.AuthToken.planta.sfid,
      'operadorapp__c': this.authservice.AuthToken.usuario.sfid,
      'reason': this.motivoSeleccionado.name,
      'descripciondefalla__c' : this.descripcionSeleccionada ? this.descripcionSeleccionada.name : null,
      'motivodedesestabilizacion__c': this.motivoDesestabilizacionSeleccionado ? this.motivoDesestabilizacionSeleccionado.name : null,
      'accountid' : this.clienteSeleccionado
    }
    // console.log(data);
    this.ticketsProv.createTicket(data).then(response=>{
      if(response){
        // this.moverArchivo(this.images, response);
        this.navCtrl.pop();
      }else{

      }
    }, error=>{

    });
  }

}
