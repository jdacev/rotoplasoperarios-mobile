import { Network } from '@ionic-native/network';
import { Injectable } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
import { NavController, ToastController } from 'ionic-angular';

@Injectable()
export class NetworkService {

  status:string;
  connected: Subscription;
  disconnected: Subscription;

  constructor(private toast:ToastController, private network: Network) {
    this.connected = this.network.onConnect().subscribe(data => {
      console.log("data: " + JSON.stringify(data))
      this.status = data.type;
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log("data: " + JSON.stringify(data))
      this.status = data.type;
      console.log("status: " + this.status);
      console.log("statusJSON: " + JSON.stringify(this.status));
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  displayNetworkUpdate(connectionState: string){
  let networkType = this.network.type;
  this.toast.create({
    message: `You are now ${connectionState} via ${networkType}`,
    duration: 3000
  }).present();
}

}
