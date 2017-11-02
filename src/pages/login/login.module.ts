import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { PasswordRecoveryPage } from '../password-recovery/password-recovery';

@NgModule({
  declarations: [
    LoginPage,
    PasswordRecoveryPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
