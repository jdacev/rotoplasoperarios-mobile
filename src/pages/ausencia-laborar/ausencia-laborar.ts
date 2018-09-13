import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PresenciaPlantaProvider } from '../../providers/presencia-planta/presencia-planta';
import * as moment from 'moment';
moment.locale('es');

@IonicPage()
@Component({
  selector: 'page-ausencia-laborar',
  templateUrl: 'ausencia-laborar.html',
})
export class AusenciaLaborarPage {

  ausencia = {
    inicio: '',
    fin: '',
    motivo: '',
    fecha: moment().format('DD-MM-YYYY')
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _presencia: PresenciaPlantaProvider,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AusenciaLaborarPage');
  }

  validarCreacion() {
    return this.ausencia.inicio == '' || this.ausencia.fin == '' || this.ausencia.motivo == ''
  }

  crearAusencia() {
    this._presencia.ausenciaLaborar(this.ausencia)
      .subscribe((resp: any) => {
        console.log(resp);
        this.alertCtrl.create({
          title: 'Ausencia laboral',
          subTitle: resp.message,
          buttons: ['Aceptar']
        }).present();
        this.ausencia.fin = '';
        this.ausencia.inicio = '';
        this.ausencia.motivo = '';
      });
  }

  verAusencia() {
    if (localStorage.getItem('ausencia')) {
      let miAusencia = JSON.parse(localStorage.getItem('ausencia'));
      this.alertCtrl.create({
        title: 'Ausencia laboral',
        subTitle: `Fecha: ${miAusencia.fecha} \n Hora inicial: ${miAusencia.horaini} Hora final: ${miAusencia.horafin} Motivo: ${miAusencia.motivo}`,
        buttons: ['Aceptar']
      }).present();
    } else {
      this.alertCtrl.create({
        title: 'Ausencia laboral',
        subTitle: 'No tiene ninguna ausencia laboral',
        buttons: ['Aceptar']
      }).present();
    }
  }

}
