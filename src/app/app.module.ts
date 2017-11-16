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

//servicios
import { UsersProvider } from '../providers/users/users';
import { AuthService } from '../providers/auth-service/auth-service';
import { RutinasProvider } from '../providers/rutinas/rutinas';
import { TicketsProvider } from '../providers/tickets/tickets';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
            scrollPadding: false,
            scrollAssist: true,
            autoFocusAssist: false
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
    TicketsProvider
  ]
})
export class AppModule {}
