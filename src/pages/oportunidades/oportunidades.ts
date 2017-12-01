import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TicketsProvider } from '../../providers/tickets/tickets';
import { AuthService } from "../../providers/auth-service/auth-service";

/**
 * Generated class for the OportunidadesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-oportunidades',
  templateUrl: 'oportunidades.html',
})
export class OportunidadesPage {

  loading: boolean;
  listaAbierta: boolean;
  ticketList = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ticketsProv: TicketsProvider,
              private authservice: AuthService) {

    this.listaAbierta = true;
    this.getTicketsUsuario();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OportunidadesPage');

  }

  doRefresh(refresher) {
    // console.log('Begin async operation', refresher);

    setTimeout(() => {
      // console.log('Async operation has ended');
      this.getTicketsUsuario();
      refresher.complete();
    }, 2000);
  }

  toggleLista(){
    // console.log(this.listaAbierta)
    if (this.listaAbierta) {
        this.listaAbierta = false;
    } else {
        this.listaAbierta = true;

    }
  }

  irAPagina(pagina:string){
    this.navCtrl.push(pagina)
  }

  irADetalle(ticket){
    console.log("YENDO A TICKET")
    this.navCtrl.push('DetalleOportunidadPage', {
      ticket: ticket
    })
  }

  getTicketsUsuario(){
    this.loading = true;
    this.ticketsProv.getTicketsUsuario(this.authservice.AuthToken.planta.sfid, this.authservice.AuthToken.usuario.sfid).subscribe(data =>{

      // if(data.status != 'success'){
      //   console.log("ERROR RECIBIENDO DATA")
      // }else{
        this.loading = false;
        this.ticketList = data.data;
      // }
    }, error =>{
        this.loading = false;
        console.log("Error: " + error);
    })
  }

}
