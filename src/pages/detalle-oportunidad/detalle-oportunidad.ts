import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AuthService } from "../../providers/auth-service/auth-service";
import { TicketsProvider } from "../../providers/tickets/tickets";
import { PhotoViewer } from '@ionic-native/photo-viewer';


/**
 * Generated class for the DetalleOportunidadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detalle-oportunidad',
  templateUrl: 'detalle-oportunidad.html',
})
export class DetalleOportunidadPage {

  ticket:any;
  images:any;
  origen:string;
  ptarName:string;
  description:string;
  cliente:any;
  // imagen:string = "file:///data/user/0/rotoplas.app/files/tickets/137/1512419963664.jpg";


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private file: File,
              private authservice: AuthService,
              private ticketsProv: TicketsProvider,
              private photoViewer: PhotoViewer) {

    this.ptarName = this.authservice.AuthToken.planta.name;
    this.ticket = navParams.get('ticket')

    this.ticketsProv.getTicket(this.ticket.id_case_heroku_c__c).subscribe(response =>{
      this.cliente = response.data;
    }, error =>{

    })

    if(this.ticket.description == "" || this.ticket.description == null){
      this.description = "---"
    }else{
      this.description = this.ticket.description;
    }

    this.origen = file.dataDirectory + 'tickets/'
    var subDir = this.ticket.id_case_heroku_c__c.toString() + '/';
    // console.log('Orinen: ' + this.origen);

    file.listDir(this.origen, subDir).then(response=>{
      // console.log('response[0]: ' + response[0]);
      // console.log('response Json stringify: ' + JSON.stringify(response))
      // console.log('RUTA: ' + response[0].nativeURL);
      this.images = response;

    }, error=>{
      this.images = error;
      // console.log('error: ' + JSON.stringify(error));
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleOportunidadPage');
  }

  abrirImagen(path:string){
    this.photoViewer.show(path);
  }

}
