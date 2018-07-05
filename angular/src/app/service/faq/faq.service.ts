import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {ConfigService} from '../config/config.service';

@Injectable()
export class FaqService {
  authToken: any;
  domain = this.ConfigService.domain
  constructor(private http: Http,private ConfigService:ConfigService) { }
  getAllFaqs(botID) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain+'bot/faqlist/' + botID, { headers: headers })
      .map(res => res.json());
  }
  addFaq(botID,question,answer){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain+'bot/addfaq/' + botID,{question,answer}, { headers: headers })
      .map(res => res.json());
  }
  editQuestionFaq(botID,newquestion,question,answer,id) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain+'bot/editquestionfaq/' + botID,{newquestion,question,answer,faqid:id}, { headers: headers })
      .map(res => res.json());
  }
  editAnswerFaq(botID,newanswer,question,answer,id) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain+'bot/editanswerfaq/' + botID,{newanswer,question,answer,faqid:id}, { headers: headers })
      .map(res => res.json());
  }
  deleteFaq(botID,question,answer){
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain+'bot/deletefaq/' + botID,{question,answer}, { headers: headers })
      .map(res => res.json());
  }
  
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

}
