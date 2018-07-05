import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {ConfigService} from '../config/config.service';

@Injectable()
export class FbuserService {
  authToken: any;
  domain = this.ConfigService.domain
  constructor(private http: Http,private ConfigService:ConfigService) { }
  getAllFbUsers(botID) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain+'bot/getAllfbuser/' + botID, { headers: headers })
      .map(res => res.json());
  }
  getFbUsers(botID,userId) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain+'bot/getfbuser/' + botID+"/"+userId, { headers: headers })
      .map(res => res.json());
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
}
