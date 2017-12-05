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
    var origen = dataDirectory + 'tickets/'
    var sourceDirectory = images[0].substring(0, images[0].lastIndexOf('/') + 1);
    var destino = dataDirectory + 'tickets/' + id.toString() + '/';
    this.validarDirectorio(dataDirectory, 'tickets').then(response=>{
      if(response){
        this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
        console.log("ESTOY EN SII")
      }
      else{
        this.file.createDir(dataDirectory, 'tickets', false).then(data=>{
          console.log("ESTOY EN CREADO")
          this.presentToast('Carpeta Tickets Creada');
          this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
        }, err =>{
          console.log("ESTOY EN NO CREADO ERROR")

          this.presentToast('Error al crear la carpeta Tickets: ' + err);
          console.log('Error crear carpeta tickets: ' + JSON.stringify(err));
        });
      }
    }, error =>{

    })
    // if(this.validarDirectorio(dataDirectory, 'tickets')){
    //     this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
    //     console.log("ESTOY EN SII")
    // }else{
    //   console.log("ESTOY EN NO")
    //
    //     this.file.createDir(dataDirectory, 'tickets', false).then(data=>{
    //       console.log("ESTOY EN CREADO")
    //       this.presentToast('Carpeta Tickets Creada');
    //       this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
    //     }, err =>{
    //       console.log("ESTOY EN NO CREADO ERROR")
    //
    //       this.presentToast('Error al crear la carpeta Tickets: ' + err);
    //       console.log('Error crear carpeta tickets: ' + JSON.stringify(err));
    //     });
    //
    // }

    // this.file.createDir(origen, id.toString(), false).then(data=>{
    //   this.presentToast('Carpeta tickets/id creada: ' + origen + id.toString())
    // }, err =>{
    //   this.presentToast('Error al crear la carpeta id: ' + err)
    // });


    // this.presentToast('dataDirectory: ' + dataDirectory);

  }

  crearCarpetasId(origen, sourceDirectory, destino, images, id){

    this.file.createDir(origen, id.toString(), false).then(data=>{

      for (let i = 0; i < images.length; i++) {

          var fileName = images[i].substring(images[i].lastIndexOf('/') + 1, images[0].length);
          // console.log('Filename: ' + fileName);
          // console.log('Origen: ' + origen);
          // console.log('SourceDirectory: ' + sourceDirectory);
          // console.log('Destino: ' + destino);

          this.file.moveFile(sourceDirectory,fileName,destino,fileName)
          .then(
            file=>{ // do something with the file location
              // this.presentToast("FOTO MOVIDA A : " + destino + fileName);
              // this.images.push(origen + fileName);
            }, error => {
            // console.log('Error: ' + JSON.stringify(error))
            // console.log('Error: ' + error)
            // this.presentToast("ERROR MOVIENDO: " + error.message + "   ...error: " + error)
          })
      }

      // this.presentToast('Carpeta tickets/id creada: ' + origen + id.toString())
    }, err =>{
      // this.presentToast('Error al crear la carpeta id: ' + err)
    });


  }

  validarDirectorio(dataDirectory, subDirectorio){
    return new Promise(resolve=>{
      this.file.checkDir(dataDirectory, subDirectorio)
                .then(_ => {
                  console.log('La carpeta tickets Existe')
                  this.presentToast('La carpeta tickets Existe')
                resolve(true);

                })
                .catch(err => {
                  this.presentToast('La carpeta tickets NOOOO Existe')
                  console.log('La carpeta tickets NOOOO Existe')
                  resolve(false);
                  // this.file.createDir(dataDirectory, 'tickets', false).then(data=>{
                  //   this.presentToast('CREADOO');
                  // }, err =>{
                    // this.presentToast('Error al crear Directorio: ' + err)
                  // });
      });
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
      'origin': 'App. Sistema de Monitoreo Sytesa',
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
