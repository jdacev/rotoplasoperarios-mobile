import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service/auth-service";
import { AsistenciaProvider }  from "../../providers/asistencia/asistencia";

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';


/**
 * Generated class for the AsistenciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-asistencia',
  templateUrl: 'asistencia.html',
})
export class AsistenciaPage {

  operador:any;
  planta:any;
  ubicacion:any;
  lat:any;
  lng:any;
  map:any;
  markerUsuario:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authservice: AuthService,
              public geolocation: Geolocation,
              private locationAccuracy: LocationAccuracy,
              private googleMaps: GoogleMaps,
              private alertCtrl: AlertController,
              private asistenciaProv: AsistenciaProvider) {

      this.operador = this.authservice.AuthToken.usuario;
      this.planta = this.authservice.AuthToken.planta;
      this.ubicacion = this.planta.billingstreet;
      this.lat = 0;
      this.lng = 0;
      this.cargarMapa();
      this.markerUsuario = null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AsistenciaPage');
  }



  guardar(){

    /*Calculo la distancia que existe entre 2 puntos
    (latitud1;longitud1 contra latitud2;longitud2). */

    var R = 6371; // Radius of the earth in km
    var lat1 = this.lat;
    var lng1 = this.lng;
    var lat2 = this.planta.billinglatitude;
    var lng2 = this.planta.billinglongitude;
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lng2-lng1);
    var a =
             Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
             Math.sin(dLon/2) * Math.sin(dLon/2)
             ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var distancia = R * c; // Distance in km
    distancia = distancia * 1000;

    //Si la distancia es mayor al radio muestro una advertencia
    if(distancia > this.planta.radio__c){
      let alert = this.alertCtrl.create({
        title: 'Entrada Laboral',
        subTitle: 'Usted se encuentra a una distancia mayor a la establecida para realizar el Ingreso.',
        // buttons: ['Aceptar']
        buttons: [{text:'Entrar Igual',//'Aceptar',
        handler: () => {
             this.postAsistencia();
           }}]
      });
      alert.present();
    }else{
      this.postAsistencia();
    }

  }

  postAsistencia(){
    //Realizo la entrada laboral del operador, indicando latitud y longitud actual.
    this.asistenciaProv.postAsistencia('Entrada', this.operador.sfid, this.lat, this.lng).then(response => {
      if(response){
        // this.asistenciaProv.getAsistencia(this.authservice.AuthToken.usuario.sfid);
        this.authservice.AuthToken.asistencia.tipo__c = 'Entrada';
        localStorage.setItem('currentUser', JSON.stringify(this.authservice.AuthToken));
        this.authservice.loadUserCredentials();
        this.showAlert("Entrada Laboral", "Entrada Exitosa", 'HomePage');
      }
    }, error => {
      console.log('error: ' + error)
      console.log('errorJSON: ' + JSON.stringify(error))
    })
  }

  deg2rad(deg) {
    //Convierto en radianes
    return deg * (Math.PI/180)
  }

  //Obtengo la ubicación del dispositivo utilizando el GPS
  obtenerUbicacion(){
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      // if(canRequest) {
        // the accuracy option will be ignored by iOS
        //En caso de que no esté prendido, solicito acceso para activarlo
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() =>{

            //Si me da acceso, obtengo la posición

            this.geolocation.getCurrentPosition().then((resp) => {
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;

              this.map.moveCamera({
                target: {lat: this.lat, lng: this.lng}
              });

              //Si ya existe un marcador en el mapa del usuario, lo remuevo.
              if(this.markerUsuario){
                this.markerUsuario.remove()
              }

              //Agrego el marcador de la posición actual.
              this.map.addMarker({
                title: this.operador.name,
                icon: 'red',
                animation: 'DROP',
                position: {lat: this.lat, lng: this.lng}
              }).then(response=>{
                this.markerUsuario = response;
              });

               console.log("Lat: " + resp.coords.latitude);
               console.log("Lng: " + resp.coords.longitude);
            }).catch((error) => {
              console.log('Error getting location', error);
            });
        }, error => {
          console.log('Error requesting location permissions' + error)
          console.log('Error requesting location permissions JSON: ' + JSON.stringify(error))
        });
      // }

    });

  }

  cargarMapa(){

  //Función para cargar el mapa. Indico posición donde se debe centrar y el zoom.
  let mapOptions: GoogleMapOptions = {
    camera: {
      target: {
        lat: this.planta.billinglatitude, // default location
        lng: this.planta.billinglongitude // default location
      },
      zoom: 14,
      tilt: 30
    }
  };

  this.map = GoogleMaps.create('map_canvas', mapOptions);

  // Wait the MAP_READY before using any methods.
  this.map.one(GoogleMapsEvent.MAP_READY)
  .then(() => {
    // Now you can use all methods safely.
    this.map.moveCamera({
      target: {lat: this.planta.billinglatitude, lng: this.planta.billinglongitude}
    });

    //Agrego un círculo indicando el radio máximo para hacer el ingreso sin advertencia.
    this.map.addCircle({
      center:{lat: this.planta.billinglatitude, lng: this.planta.billinglongitude},
      radius: this.planta.radio__c,
      strokeColor: '#FF0000',
      strokeWidth: 2,
      visible: true
    })

    //Agrego el marcador de la planta.
    this.map.addMarker({
      title: 'Planta: ' + this.planta.name,
      icon: 'blue',
      animation: 'DROP',
      position: {lat: this.planta.billinglatitude, lng: this.planta.billinglongitude}
    });
    this.obtenerUbicacion();
  })
  .catch(error =>{
    console.log(error);
  });

}

//Método para mostrar una alerta. Si envío una página debe redirigirme.
showAlert(title:string, subtitle:string, page:string) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: subtitle,
    buttons: [{
      text: 'Aceptar',
      handler: data => {
        if(page){
          this.navCtrl.setRoot(page);
        }
      }
    }]
  });
  alert.present();
}

}
