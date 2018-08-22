import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { RutinasProvider } from "../../providers/rutinas/rutinas";
import { AuthService } from "../../providers/auth-service/auth-service";
import { DatabaseService } from "../../services/database-service";
import { NetworkService } from "../../services/network-service";
import { Network } from '@ionic-native/network';
import { URL_SERVICIOS } from "../../config/url.services";
import { Slides } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


@IonicPage()
@Component({
  selector: 'page-nueva-rutina',
  templateUrl: 'nueva-rutina.html',
})
export class NuevaRutinaPage {
  @ViewChild(Slides) slides: Slides;

  loading: boolean;
  ptarName: string;
  ptarDate: string;
  formato: string;
  determinante: number;
  activities = [];
  tipoRutinas = [];
  tipoRutina: string;
  observacion: string;
  actividadActual = [];
  planta: any;
  lat: any;
  lng: any;
  salirSinGuardar: boolean = true;

  images = [];
  imagesFiltro = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private rutinasProv: RutinasProvider,
    private authservice: AuthService,
    private camera: Camera,
    private file: File,
    private alertCtrl: AlertController,
    private dbService: DatabaseService,
    private networkService: NetworkService,
    private network: Network,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private transfer: FileTransfer) {

    this.loading = false;
    this.ptarName = this.authservice.AuthToken.planta.name;
    this.ptarDate = new Date().toISOString();
    this.determinante = this.authservice.AuthToken.planta.determinante__c;
    this.formato = this.authservice.AuthToken.planta.formato__c;
    this.activities = [];
    this.tipoRutina = null;
    this.observacion = "";
    this.planta = this.authservice.AuthToken.planta;
    // this.getTipoRutinas();
    this.getTipoRutinasOffline();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NuevaRutinaPage');
  }

  //Vuelvo a la pantalla anterior.
  cancel() {
    this.salirSinGuardar = true;
    this.navCtrl.pop();
  }

  //Método para capturar imágenes y guardarlas en un array.
  capturar() {
    let idx = this.slides.getActiveIndex();
    let sinFotoOcupada = [];
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    for (let i = 1; i <= this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c; i++) {
      if (this.activities[idx]['foto' + i + '__c'] === undefined) {
        sinFotoOcupada.push(0);
      }
    }

    if (sinFotoOcupada.length === 0) {
      this.presentToast('Crear rutina', 'Soló puede agregar ' + this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c + ' imagénes por actividad');
      return;
    }

    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    loading.present();

    let metadata = {
      id: this.activities[idx].id,
      idtiporutina__c: this.activities[idx].idtiporutina__c,
      actividad: this.activities[idx].name.normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
      orden__c: this.activities[idx].orden__c,
      rutina__c: this.activities[idx].rutina__c,
      sfid: this.activities[idx].sfid,
      tipo_de_respuesta__c: this.activities[idx].tipo_de_respuesta__c || '-',
      turno__c: this.activities[idx].turno__c || '-',
      valor: this.activities[idx].valor || '-',
      observacion: this.activities[idx].observaciones.normalize('NFD').replace(/[\u0300-\u036f]/g, "") || '-',
      latitude: '-',
      longitude: '-',
      planta_id: this.authservice.AuthToken.planta.sfid,
      planta: this.authservice.AuthToken.planta.name,
      enlinea: 'ON LINE'
    };

    if (this.network.type == 'none' || this.network.type == 'unknown') {
      loading.dismiss();
      this.camera.getPicture(options).then((imagePath) => {
        let fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.length);

        for (let i = 1; i <= this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c; i++) {
          if (this.activities[idx]['foto' + i + '__c'] === undefined) {
            this.activities[idx]['foto' + i + '__c'] = fileName;
            break;
          }
        }
        this.images.push({
          path: imagePath,
          metadata: metadata
        });
        this.imagesFiltro.push({
          path: imagePath,
          metadata: metadata
        });

      }).catch((error) => {
        console.log('Error getting location', error);
      });


    } else {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        if (this.authservice.validaUbicacion(this.lat, this.lng)) {
          this.presentToast('Crear rutina', 'Usted se encuentra a una distancia mayor a la establecida para tomar fotografías');
          return;
        }
        loading.dismiss();

        this.camera.getPicture(options).then((imagePath) => {
          let fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.length);

          for (let i = 1; i <= this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c; i++) {
            if (this.activities[idx]['foto' + i + '__c'] === undefined) {
              this.activities[idx]['foto' + i + '__c'] = fileName;
              break;
            }
          }
          metadata.latitude = this.lat;
          metadata.longitude = this.lng;

          this.images.push({
            path: imagePath,
            metadata: metadata
          });
          this.imagesFiltro.push({
            path: imagePath,
            metadata: metadata
          });

        }).catch((error) => {
          console.log('Error getting location', error);
        });
      }, (err) => {
        // Handle error
      });
    }

  }

  private presentToast(title, subtitle) {
    let toast = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Aceptar']
    });
    toast.present();
  }

  /*Muevo el archivo de la carpeta donde se guarda la imagen capturada,
  a una carpeta que 'rutinas' que le creo.
  */
  moverArchivo(images: any[], id) {
    var dataDirectory = this.file.dataDirectory;
    var origen = dataDirectory + 'rutinas/'
    var sourceDirectory = images[0].path.substring(0, images[0].path.lastIndexOf('/') + 1);
    var destino = dataDirectory + 'rutinas/' + id.toString() + '/';
    //Verifico si existe el directorio 'rutinas'.
    this.validarDirectorio(dataDirectory, 'rutinas').then(response => {
      if (response) {
        //Existe la carpeta
        this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
      }
      else {
        //NO Existe la carpeta 'rutinas', entonces la creo
        this.file.createDir(dataDirectory, 'rutinas', false).then(data => {
          this.crearCarpetasId(origen, sourceDirectory, destino, images, id);
        }, err => {

        });
      }
    }, error => {

    })

  }

  //Funcion que crea una carpeta con el nombre del ID para guardar las imágenes.
  crearCarpetasId(origen, sourceDirectory, destino, images, id) {
    //Creo la carpeta con el nombre {ID}
    this.file.createDir(origen, id.toString(), false).then(data => {

      //Muevo todas las imágenes al nuevo directorio.
      for (let i = 0; i < images.length; i++) {

        var fileName = images[i].path.substring(images[i].path.lastIndexOf('/') + 1, images[0].path.length);


        this.file.moveFile(sourceDirectory, fileName, destino, fileName)
          .then(
            file => {

            }, error => {

            })
      }

    }, err => {

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
  eliminarImagen(pos: number, imagen: any) {
    var directorio = imagen.path.substring(0, imagen.path.lastIndexOf('/') + 1);
    var nombreArchivo = imagen.path.substring(imagen.path.lastIndexOf('/') + 1, imagen.path.length);
    this.file.removeFile(directorio, nombreArchivo);
    // this.images.splice(pos, 1)

    for (let i = 0; i < this.activities.length; i++) {
      if (this.images[i] === imagen) {
        this.images.splice(i, 1);
      }
      for (let x = 1; x <= this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c; x++) {
        if (this.activities[i][`foto${x}__c`] === imagen.path.substring(imagen.path.lastIndexOf('/') + 1, imagen.path.length)) {
          delete this.activities[i][`foto${x}__c`];
          break;
        }
      }
    }
    this.slideChanged();
  }
  /***********************************************************************/

  getTipoRutinas() {
    this.rutinasProv.getTipoRutinas().subscribe(data => {
      this.tipoRutinas = data.data;
    }, error => {

    })
  }

  getTipoRutinasOffline() {
    this.dbService.getTipoRutinasOffline().then(response => {
      this.tipoRutinas = response;
      // console.log("TIPO RUTINAS: " + JSON.stringify(response));

    }, error => {
      console.log("ERROR getTipoRutinas" + JSON.stringify(error));

    })
  }

  getActividades(idTipoRutina: string, turno: string) {

    if (idTipoRutina && turno) {


      this.dbService.getPreguntasTipoRutinaOffline(idTipoRutina, turno).then(data => {
        // console.log("TIPOS RUTINA: " + JSON.stringify(data))
        this.activities = data;
        for (let i = 0; i < this.activities.length; i++) {
          this.activities[i].observacion = '';
          if (this.activities[i].tipo_de_respuesta__c == 'true') {
            this.activities[i].valor = false;
          } else {
            this.activities[i].valor = undefined;
          }
        }
      })
    }

  }

  //Método que verifica si hay alguna respuesta incompleta
  //para deshabilitar el boton de crear
  respuestasIncompletas() {
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].valor == undefined || (this.activities[i].tipo_de_respuesta__c == 'false' && this.activities[i].valor == ""))
        return true;
    }

    return false;
  }

  crearRutina() {
    this.loading = true;
    if (this.network.type == 'none' || this.network.type == 'unknown') {
      this.crearRutinaGuardar();
    } else {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        if (this.authservice.validaUbicacion(this.lat, this.lng)) {
          this.presentToast('Crear rutina', 'Usted se encuentra a una distancia mayor a la establecida para crear una rutina');
          this.loading = false;
        } else {
          this.crearRutinaGuardar();
        }
      });
    }
  }

  crearRutinaGuardar() {
    var listaActividades = [];
    for (let i = 0; i < this.activities.length; i++) {

      let actividad = {
        'id_pregunta_rutina__c': this.activities[i].sfid,
        'valor_si_no__c': this.activities[i].tipo_de_respuesta__c == 'true' ? this.activities[i].valor : null,
        'valornumerico__c': this.activities[i].tipo_de_respuesta__c == 'false' ? this.activities[i].valor : null,
        'observaciones__c': !this.activities[i].observaciones ? '' : this.activities[i].observaciones
      };

      for (let x = 1; x <= this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c; x++) {
        actividad[`foto${x}__c`] = !this.activities[i][`foto${x}__c`] ? '' : this.activities[i][`foto${x}__c`];
      }
      listaActividades.push(actividad);
    }

    var data = {
      'observacion__c': this.observacion,
      'idtiporutina__c': this.tipoRutina,
      "idplanta__c": this.authservice.AuthToken.planta.sfid,
      'usuarioapp__c': this.authservice.AuthToken.usuario.sfid,
      'rutaimagen__c': '',
      'createddate_heroku__c': (new Date()).toISOString(),
      'actividadrutina__c': listaActividades,
      'fotos_por_actividad': this.authservice.AuthToken.variables.fotos_por_actividad_rutina__c
    };

    if (this.network.type == 'none' || this.network.type == 'unknown') {
      // console.log("rutina a crear OFFLINE: " + JSON.stringify(data));

      this.dbService.crearRutinaOffline(data).then(response => {
        // console.log("RESPONSE: " + response);
        // console.log("RESPONSE: " + JSON.stringify(response));
        if (response) {
          if (this.images.length > 0) {
            this.moverArchivo(this.images, response);
          }
          this.loading = false;
          this.salirSinGuardar = false;
          this.navCtrl.pop();
        } else {
          this.loading = false;
        }

      }, error => {
        console.log("ERROR CREANDO");

      })
    } else {
      console.log("rutina a crear ONLINE: " + JSON.stringify(data));
      this.rutinasProv.crearRutina(data).then(response => {
        if (this.network.type == 'none' || this.network.type == 'unknown') {
          if (response) {
            if (this.images.length > 0) {
              this.moverArchivo(this.images, response);
            }
            this.loading = false;
            this.salirSinGuardar = false;
            this.navCtrl.pop();
          } else {
            this.loading = false;
          }
        } else {
          if (response) {
            if (this.images.length > 0) {
              this.uploadImages(this.images, response);
            }
            this.loading = false;
            this.salirSinGuardar = false;
            this.navCtrl.pop();
          } else {
            this.loading = false;
          }
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
      params: { 'containername': "rutina" + id.toString() }
    }

    const fileTransfer: FileTransferObject = this.transfer.create();

    for (let i = 0; i < images.length; i++) {
      // enviar metada imagen
      options.params.metadata = images[i].metadata;

      // console.log(images[i]);
      options.fileName = images[i].path.substring(images[i].path.lastIndexOf('/') + 1, images[i].path.length);
      fileTransfer.upload(images[i].path, URL_SERVICIOS + '/azurecrearcontenedorsubirimagen', options)
        .then((data) => {
          // console.log(data+" Uploaded Successfully");

        }, (err) => {
          console.log('Error:' + JSON.stringify(err));
        });
    }
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.imagesFiltro = this.images.filter((item) => {
      return item.metadata.id == this.activities[currentIndex].id;
    });
  }

  async ionViewCanLeave() {
    if (this.salirSinGuardar && this.images.length > 0) {
      const shouldLeave = await this.confirmarAbandonar();
      return shouldLeave;
    } else {
      return true;
    }

  }

  confirmarAbandonar(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    const alert = this.alertCtrl.create({
      title: '¿Está seguro?',
      subTitle: 'Esta por abandonar la creación de una rutina, se perderan sus cambios.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => resolveLeaving(false)
        },
        {
          text: 'Aceptar',
          handler: () => resolveLeaving(true)
        }
      ]
    });
    alert.present();
    return canLeave
  }

}
