import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { TicketsProvider } from "../../providers/tickets/tickets";
import { AuthService } from "../../providers/auth-service/auth-service";
import { DatabaseService } from "../../services/database-service";
import { NetworkService } from "../../services/network-service";
import { Network } from '@ionic-native/network';
import { URL_SERVICIOS } from "../../config/url.services";

@IonicPage()
@Component({
  selector: 'page-nuevo-ticket',
  templateUrl: 'nuevo-ticket.html',
})
export class NuevoTicketPage {

  loading: boolean;

  description: string;
  ptarName: string;
  ptarDate: string;
  ticketType: string;
  serviceType: string;
  images = [];
  motivoSeleccionado: any;
  descripcionSeleccionada: any;
  motivoDesestabilizacionSeleccionado: any;
  clienteSeleccionado: any;
  clientes: any;
  motivos;
  descripcionesMotivos;
  motivosDesestabilizacion;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private file: File,
    private alertCtrl: AlertController,
    private ticketsProv: TicketsProvider,
    private authservice: AuthService,
    private dbService: DatabaseService,
    private networkService: NetworkService,
    private network: Network,
    private transfer: FileTransfer) {

    this.loading = false;
    this.ptarName = this.authservice.AuthToken.planta.name;
    this.ptarDate = new Date().toISOString();
    this.ticketType = "Interno";
    this.description = "";
    this.serviceType = "";
    this.motivoSeleccionado = null;
    this.descripcionSeleccionada = null;
    this.clientes = [];

    // this.getMotivosOportunidades();
    this.getMotivosOportunidadesOffline();
    this.getClientesPlanta();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NuevoTicketPage');
  }

  cancel() {
    this.navCtrl.pop();
  }

  //Método para capturar imágenes y guardarlas en un array.
  capturar() {
    const options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      targetWidth: 1024,
      targetHeight: 1280,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imagePath) => {
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

  /*Muevo el archivo de la carpeta donde se guarda la imagen capturada,
  a una carpeta que 'tickets' que le creo.
  */
  moverArchivo(images: string[], id) {
    var dataDirectory = this.file.dataDirectory;
    console.log("obtengo directory" + dataDirectory);
    var origen = dataDirectory + 'tickets/'
    var sourceDirectory = images[0].substring(0, images[0].lastIndexOf('/') + 1);
    var destino = dataDirectory + 'tickets/' + id.id_case_sqllite.toString() + '/';

    console.log("/////////////////////////////////---------------");
    console.log("Destino: " + destino);
    //Verifico si existe el directorio 'tickets'.
    this.validarDirectorio(dataDirectory, 'tickets').then(response => {
      console.log("response:" + response);
      if (response) {
        //Existe la carpeta
        console.log("existe carpeta tickets en: " + dataDirectory);
        this.crearCarpetasId(origen, sourceDirectory, destino, images, id.id_case_sqllite);
      }
      else {
        //NO Existe la carpeta 'rutinas', entonces la creo
        this.file.createDir(dataDirectory, 'tickets', false).then(data => {
          this.crearCarpetasId(origen, sourceDirectory, destino, images, id.id_case_sqllite);
        }, err => {
          console.log("fallo al crear carpeta: " + JSON.stringify(err));
        });
      }
    }, error => {

    })

  }

  //Funcion que crea una carpeta con el nombre del ID para guardar las imágenes.
  crearCarpetasId(origen, sourceDirectory, destino, images, id) {
    //Creo la carpeta con el nombre {ID}
    console.log("creando carpeta id...");
    console.log("path: " + sourceDirectory);
    this.file.createDir(origen, id.toString(), false).then(data => {
      console.log("creado, copiando imagenes...");
      //Muevo todas las imágenes al nuevo directorio.
      for (let i = 0; i < images.length; i++) {
        console.log("imagen numero " + i);
        var fileName = images[i].substring(images[i].lastIndexOf('/') + 1, images[0].length);
        console.log(fileName);
        this.file.moveFile(sourceDirectory, fileName, destino, '')
          .then(
            file => {
              console.log("copiado con exito");
            }, error => {
              console.log("error al copiar: " + JSON.stringify(error));
            })
      }

    }, err => {
      console.log("error al crear carpeta " + JSON.stringify(err));
    });


  }

  // Funcion que verifica si existe un subdirectorio
  validarDirectorio(dataDirectory, subDirectorio) {
    return new Promise(resolve => {
      this.file.checkDir(dataDirectory, subDirectorio)
        .then(_ => {
          resolve(true);
        })
        .catch(err => {
          resolve(false);
        });
    });
  }

  //Función que elimina una imagen capturada.
  eliminarImagen(pos: number, imagen: string) {
    var directorio = imagen.substring(0, imagen.lastIndexOf('/') + 1);
    var nombreArchivo = imagen.substring(imagen.lastIndexOf('/') + 1, imagen.length);
    this.file.removeFile(directorio, nombreArchivo);
    this.images.splice(pos, 1)
  }

  //Método para ordenamiento
  ordenar(item1, item2) {
    return (item1 < item2 ? -1 : (item1 === item2 ? 0 : 1));
  }

  //Get para buscar los motivos y ordenarlos por orden alfabético
  getMotivosOportunidades() {
    this.ticketsProv.getMotivosOportunidades().subscribe(response => {
      this.motivos = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
    }, error => {

    })
  }

  getMotivosOportunidadesOffline() {
    this.dbService.getMotivosOportunidadesOffline().then(response => {
      console.log("MOTIVOS EN NUEVO TICKET: " + JSON.stringify(response));
      this.motivos = response.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
      // this.motivos = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
    }, error => {

    })
  }

  //Get para buscar las descripciones del motivo que selecciono
  getDescripcionMotivosOffline(motivo) {
    console.log("MOTIVO SFID: " + motivo.sfid)
    if (motivo) {
      this.dbService.getDescripcionesFallaOffline(motivo.sfid).then(response => {
        if (response.length > 0) {
          console.log("DESC. MOTIVOS EN NUEVO TICKET: " + JSON.stringify(response));
          this.descripcionesMotivos = response.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
          this.motivosDesestabilizacion = null;
          this.descripcionSeleccionada = null;
          this.motivoDesestabilizacionSeleccionado = null;
        } else {
          this.descripcionesMotivos = null;
          this.motivoDesestabilizacionSeleccionado = null;
          this.motivosDesestabilizacion = null;
        }
      }, error => {
        this.descripcionesMotivos = null;
        this.motivoDesestabilizacionSeleccionado = null;
        this.motivosDesestabilizacion = null;
      })
    }
  }

  //Get para buscar las descripciones del motivo que selecciono
  getDescripcionMotivos(motivo) {
    if (motivo) {
      this.ticketsProv.getDescripcionMotivos(motivo.sfid).subscribe(response => {
        this.descripcionesMotivos = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
        this.motivosDesestabilizacion = null;
        this.descripcionSeleccionada = null;
        this.motivoDesestabilizacionSeleccionado = null;
      }, error => {
        this.descripcionesMotivos = null;
      })
    }
  }



  // Get para buscar el motivo de desestabilización.
  getMotivosDesestabilizacionOffline(descripcion) {
    if (descripcion) {
      this.dbService.getMotivosDesestabilizacionOffline(descripcion.sfid).then(response => {
        if (response.length > 0) {
          this.motivosDesestabilizacion = response.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
          this.motivoDesestabilizacionSeleccionado = null;
        } else {
          this.motivoDesestabilizacionSeleccionado = null;
          this.motivosDesestabilizacion = null;
        }

      }, error => {
        this.motivoDesestabilizacionSeleccionado = null;
        this.motivosDesestabilizacion = null;
      })
    }
  }

  getMotivosDesestabilizacion(descripcion) {
    if (descripcion) {
      this.ticketsProv.getMotivosDesestabilizacion(descripcion.sfid).subscribe(response => {
        this.motivosDesestabilizacion = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
        this.motivoDesestabilizacionSeleccionado = null;

      }, error => {
        this.motivoDesestabilizacionSeleccionado = null;
        this.motivosDesestabilizacion = null;
      })
    }
  }

  getClientesPlanta() {
    // this.ticketsProv.getClientesPlanta(this.authservice.AuthToken.planta.sfid).subscribe(response =>{
    //   this.clientes = response.data.sort((item1, item2): number => this.ordenar(item1.name, item2.name));
    //
    // }, error=>{
    //
    // })
    // this.clientes.push({'sfid' : this.authservice.AuthToken.planta.accountsfid, 'name' : this.authservice.AuthToken.planta.accountname})
    this.clientes = this.authservice.AuthToken.clientes;
  }

  createTicket() {
    this.loading = true;


    var data = {
      'description': this.description,
      'enviaagua__c': this.serviceType,
      'origin': 'App. Sistema de Monitoreo Sytesa',
      'idplanta__c': this.authservice.AuthToken.planta.sfid,
      'operadorapp__c': this.authservice.AuthToken.usuario.sfid,
      'createddate_heroku__c': (new Date()).toISOString(),
      'reason': this.motivoSeleccionado.name,
      'descripciondefalla__c': (this.descripcionSeleccionada && this.descripcionSeleccionada != 'null') ? this.descripcionSeleccionada.name : '',
      'motivodedesestabilizacion__c': (this.motivoDesestabilizacionSeleccionado && this.motivoDesestabilizacionSeleccionado != 'null') ? this.motivoDesestabilizacionSeleccionado.name : '',
      'accountid': this.clienteSeleccionado
    }

    if (this.network.type == 'none' || this.network.type == 'unknown') {

      this.dbService.crearOportunidad(data).then(response => {
        // console.log("response: " + JSON.stringify(response));
        // if(response){
        if (this.images.length > 0) {
          this.moverArchivo(this.images, response);
        }
        this.loading = false;
        this.navCtrl.pop();
        // }else{
        //   this.loading = false;
        // }
      }, error => {
        this.loading = false;
      });
    } else {
      // console.log(data);
      this.ticketsProv.createTicket(data).then(response => {
        if (response) {
          if (this.images.length > 0) {
            this.uploadImages(this.images, response);
            // this.moverArchivo(this.images, response);
          }
          this.loading = false;
          this.navCtrl.pop();
        } else {
          this.loading = false;
        }
      }, error => {
        this.loading = false;
      });
    }

  }

  uploadImages(images, id) {
    let options: FileUploadOptions = {
      fileKey: 'azureupload',
      // fileName: fileName,
      chunkedMode: false,
      mimeType: "image/jpeg",
      // mimeType: 'multipart/form-data',
      // headers: {},
      params: { 'containername': "oportunidad" + id.toString() }
    }

    const fileTransfer: FileTransferObject = this.transfer.create();

    for (let i = 0; i < images.length; i++) {
      // console.log(images[i]);
      options.fileName = images[i].substring(images[i].lastIndexOf('/') + 1, images[i].length);
      fileTransfer.upload(images[i], URL_SERVICIOS + '/azurecrearcontenedorsubirimagen', options)
        .then((data) => {
          // console.log(data+" Uploaded Successfully");

        }, (err) => {
          console.log('Error:' + JSON.stringify(err));
        });
    }

    // console.log("UPLOADING");
    // console.log("Options:", options);
    // console.log("Options: "+ options);
    // console.log("Options: "+ JSON.stringify(options));



  }

}
