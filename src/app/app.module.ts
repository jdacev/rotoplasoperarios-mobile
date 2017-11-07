import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule } from "@angular/http";

import { MyApp } from './app.component';

//plugins
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

//servicios
import { UsersProvider } from '../providers/users/users';
import { AuthService } from '../providers/auth-service/auth-service';
import { RutinasProvider } from '../providers/rutinas/rutinas';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlertController,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersProvider,
    AuthService,
    Camera,
    File,
    RutinasProvider
  ]
})
export class AppModule {}
