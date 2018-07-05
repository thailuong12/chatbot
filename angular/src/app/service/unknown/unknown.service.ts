import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {ConfigService} from '../config/config.service';

@Injectable()
export class UnknownService {
  authToken: any;

  constructor(private http: Http,private ConfigService:ConfigService) { }
  domain = this.ConfigService.domain
  
  getAllUnknown(botID){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain+'bot/getallunknown/' + botID, { headers: headers })
      .map(res => res.json());
  }
  deleteUnknown(botID,unknownId){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.delete(this.domain+'bot/deleteunknown/' + botID+"/"+unknownId,{ headers: headers })
      .map(res => res.json());
  }
  addFaq(botID,question,answer,listIdUnknown){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain+'bot/addfaqfromunknown/' + botID,{question,answer,listIdUnknown}, { headers: headers })
      .map(res => res.json());
  }
  getFbUser(botID,appId){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain+'bot/getFbUserByAppId/' + botID+"/"+appId, { headers: headers })
      .map(res => res.json());
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

}
