import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { AuthService } from "../../providers/auth-service/auth-service";
import { TicketsProvider } from "../../providers/tickets/tickets";
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Network } from '@ionic-native/network';

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
  images:any=[];
  origen:string;
  ptarName:string;
  description:string;
  cliente:any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private file: File,
              private authservice: AuthService,
              private ticketsProv: TicketsProvider,
              private photoViewer: PhotoViewer,
              private network: Network) {

    this.ptarName = this.authservice.AuthToken.planta.name;

    // Recibo por parámetro todos los datos del ticket.
    this.ticket = navParams.get('ticket')
    console.log("Se recibio ticket: "+ JSON.stringify(this.ticket));
    //Get para traer el Cliente
    if(this.network.type != 'none' && this.network.type != 'unknown'){
        this.ticketsProv.getTicket(this.ticket.id_case_heroku_c__c).subscribe(response =>{
          this.cliente = response.data;
        }, error =>{

        })

        this.ticketsProv.getImagenes(this.ticket.id_case_heroku_c__c).subscribe(response=>{
          console.log("IMAGES: " + response)
          console.log("IMAGES: " + JSON.stringify(response))
          if(response.blobs){
            this.images = response.blobs;
            console.log(this.images);
          }
          else{
            this.images = [];
          }
        }, error =>{
          console.log("ERROR:" + JSON.stringify(error));
        })
      }else{
        // Levanto las imágenes que se encuentren dentro de la carpeta 'tickets/{IdTicket}'
         this.origen = file.dataDirectory + 'tickets/';
         if(this.ticket.id_case_heroku_c__c){
           var subDir = this.ticket.id_case_heroku_c__c.toString() + '/';
         }else{
           var subDir = this.ticket.id_case_sqllite.toString() + '/';
           console.log("id_case_sqllite: "+this.ticket.id_case_sqllite);
         }
         console.log("busco destino: "+ this.origen + subDir);

         file.listDir(this.origen, subDir).then(response=>{
           for (let i = 0; i < response.length; i++) {
               this.images.push(response[i].nativeURL);
           }


         }, error=>{
           console.log("falla file.listDir: "+JSON.stringify(error));
           //this.images = error;
         });

      }

    if(this.ticket.description == "" || this.ticket.description == null || this.ticket.description == 'null'){
      this.description = "---"
    }else{
      this.description = this.ticket.description;
    }






  }


  //Abre la imagen en un visor al seleccionarla
  abrirImagen(path:string){
    this.photoViewer.show(path);
  }

}
