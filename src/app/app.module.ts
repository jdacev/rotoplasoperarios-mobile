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
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FileOpener } from '@ionic-native/file-opener';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { LocalNotifications } from '@ionic-native/local-notifications';
//import { FirebaseMessaging } from '@ionic-native/firebase-messaging';
import { FCM } from '@ionic-native/fcm';


//servicios
import { UsersProvider } from '../providers/users/users';
import { AuthService } from '../providers/auth-service/auth-service';
import { RutinasProvider } from '../providers/rutinas/rutinas';
import { TicketsProvider } from '../providers/tickets/tickets';
import { AsistenciaProvider } from '../providers/asistencia/asistencia';
import { PlantasProvider } from '../providers/plantas/plantas';
import { DatabaseService } from '../services/database-service';
import { NetworkService } from '../services/network-service';
import { SyncProvider } from '../providers/sync/sync';
import { PresenciaPlantaProvider } from '../providers/presencia-planta/presencia-planta';


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
      platforms: { ios: { statusbarPadding: true } }
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
    { provide: ErrorHandler, useClass: IonicErrorHandler },
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
    PlantasProvider,
    FileOpener,
    DocumentViewer,
    SQLite,
    DatabaseService,
    NetworkService,
    Network,
    FileTransferObject,
    FileTransfer,
    SyncProvider,
    LocalNotifications,
    //FirebaseMessaging,
    FCM,
    PresenciaPlantaProvider
  ]
})
export class AppModule { }
