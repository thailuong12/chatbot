import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
@Injectable()
export class BroadcastService {

  authToken: any;
  constructor(private http: Http, private ConfigService: ConfigService) { }
  domain = this.ConfigService.domain;

  getBroadCast(botId) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http.get(this.domain + 'bot/getBroadCast/'+botId, { headers: headers })
      .map(res => res.json());
  }
  addBroadCastQuickReply(broadCastBlock,newQuick) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.domain + 'bot/blocklist/addBroadCastQuickReply', {broadCastBlock,newquickreply: newQuick},{ headers: headers })
      .map(res => res.json());
  }
  sendSurvey(botId,blockId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http.get(this.domain + 'bot/sendSurvey/'+blockId+"/"+botId,{ headers: headers })
      .map(res => res.json());
  }
  addSurveyBlock(botId,name){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.domain + 'bot/addSurveyBlock/'+botId,{name},{ headers: headers })
      .map(res => res.json());
  }
  deleteSurveyBlock(botId,blockId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.domain + 'bot/deleteSurveyBlock/'+botId,{blockId},{ headers: headers })
      .map(res => res.json());
  }

  
  loadToken() {
    const token = localStorage.getItem('id_token')
    this.authToken = token;
  }
}
