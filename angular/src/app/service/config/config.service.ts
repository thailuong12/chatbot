import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class ConfigService {
  authToken: any;
  domain = 'http://localhost:8080/';
  constructor(private http: Http) { }
  getType(type) {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'bot/getConfig' , {type:type}, { headers: headers })
      .map(res => res.json());
  }
  addWebhookUrl(webhookUrl){
    this.loadToken()
    let headers = new Headers();    
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/addWebhookUrl',webhookUrl,{ headers: headers })
     .map(res => res.json())
  }
  editWebhookUrl(webhookurl){
    this.loadToken()
    let headers = new Headers();    
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/editWebhookUrl',webhookurl,{ headers: headers })
     .map(res => res.json())
  }
  editAccountEmail(gmail){
    this.loadToken()
    let headers = new Headers();    
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/editAccountEmail',gmail,{ headers: headers })
     .map(res => res.json())
  }
  // editQNA_API(qna){
  //   this.loadToken()
  //   let headers = new Headers();    
  //   headers.append('Authorization', this.authToken)
  //   headers.append('Content-Type', 'application/json')
  //   return this.http.post(this.domain+'bot/editQNA_API',qna,{ headers: headers })
  //    .map(res => res.json())
  // }
  setMenu(botId){
    this.loadToken()
    let headers = new Headers();    
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/setPersistentMenu/'+botId,{ headers: headers })
     .map(res => res.json())
  }
  deleteMenu(botId){
    this.loadToken()
    let headers = new Headers();    
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/deletePersistentMenu/'+botId,{ headers: headers })
     .map(res => res.json())
  }
  loadToken() {
    const token = localStorage.getItem('id_token')
    this.authToken = token;
  }
}
