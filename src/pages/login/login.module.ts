import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { HomePage } from '../home/home';
import { PasswordRecoveryPage } from '../password-recovery/password-recovery';

@NgModule({
  declarations: [
    LoginPage,
    PasswordRecoveryPage,
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
