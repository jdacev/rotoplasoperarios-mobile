import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule } from "@angular/http";

import { MyApp } from './app.component';

//plugins
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

//servicios
import { UsersProvider } from '../providers/users/users';
import { AuthService } from '../providers/auth-service/auth-service';
import { RutinasProvider } from '../providers/rutinas/rutinas';
import { TicketsProvider } from '../providers/tickets/tickets';
import { AsistenciaProvider } from '../providers/asistencia/asistencia';
import { PlantasProvider } from '../providers/plantas/plantas';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
            // scrollPadding: false,
            scrollAssist: false,
            autoFocusAssist: false,
            platforms:{ios:{statusbarPadding:true}}
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    AlertController,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersProvider,
    AuthService,
    Camera,
    File,
    RutinasProvider,
    TicketsProvider,
    PhotoViewer,
    AsistenciaProvider,
    GoogleMaps,
    Geolocation,
    LocationAccuracy,
    PlantasProvider
  ]
})
export class AppModule {}
