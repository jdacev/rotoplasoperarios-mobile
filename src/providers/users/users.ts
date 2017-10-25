import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { URL_SERVICIOS } from "../../config/url.services";

@Injectable()
export class UsersProvider {

  data:any[] = [];

  constructor(public http: Http) {
    console.log('Hello UsersProvider Provider');
  }

  traerAlgo(){
    let url = "http://localhost:8100" + "/api";
    console.log(url);

    return this.http.get(url)
              .map(resp => resp.json())


  }

}
