import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
@Injectable()
export class DashboardService {

  authToken: any;
  constructor(private http: Http, private ConfigService: ConfigService) { }
  domain = this.ConfigService.domain;
  getBlockByPlugin(botId) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain + 'bot/blocknews/' + botId, { headers: headers })
      .map(res => res.json());
  }
  getUrlClick(hash){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'bot/urlclick' , {hash: hash} , { headers: headers })
      .map(res => res.json());
  }
  getUrlInfo(url){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'bot/urlinfo' , {url: url} , { headers: headers })
      .map(res => res.json());
  }
  getUrlExpand(url){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'bot/urlexpand' , {url: url} , { headers: headers })
      .map(res => res.json());
  }


  loadToken() {
    const token = localStorage.getItem('id_token')
    this.authToken = token;
  }
}
