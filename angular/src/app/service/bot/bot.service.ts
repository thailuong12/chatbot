import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BotService {
  authToken: any;
  constructor(private http: Http, private ConfigService: ConfigService) { }
  domain = this.ConfigService.domain;
  getAllBot() {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http.get(this.domain + 'bot/getAllBot', { headers: headers })
      .map(res => res.json());
  }
  getBotById(botId) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain + 'bot/getBot/' + botId, { headers: headers })
      .map(res => res.json());
  }
  addBot(bot) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/addBot', bot, {headers: headers })
      .map(res => res.json());
  }
  editBotName(botID,newname){
    this.loadToken()
    let headers = new Headers();    
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/editBot/'+botID,{newname},{ headers: headers })
     .map(res => res.json())
  }
  editBotFBS(botID,fbs){
    this.loadToken()
    let headers = new Headers();    
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/editBotFBS/'+botID,fbs,{ headers: headers })
     .map(res => res.json())
  }
  deleteBot(id,kbId) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/deleteBot/'+ id,{kbId}, {headers: headers })
      .map(res => res.json());
  }

  loadToken() {
    const token = localStorage.getItem('id_token')
    this.authToken = token;
  }
}
