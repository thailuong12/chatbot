import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {ConfigService} from '../config/config.service';
@Injectable()
export class AccountService {
  authToken: any
  domain = this.ConfigService.domain
  constructor(private http: Http,private ConfigService:ConfigService) { }

  loadToken() {
    const token = localStorage.getItem('id_token')
    this.authToken = token;
  }
  registerAccount(account) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'account/add', account, {headers: headers })
      .map(res => res.json());
  }
  getAllAccount() {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.get(this.domain+'account/list', {headers: headers })
      .map(res => res.json());
  }
  getSingleAccount(id) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.get(this.domain+'account/singleAccount/' + id, {headers: headers })
      .map(res => res.json());
  }
  editAccount(account,id){
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.put(this.domain+'account/updateAccount/'+ id, account, {headers: headers })
      .map(res => res.json());
  }
  deleteAccount(id) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.delete(this.domain+'account/delete/' + id, {headers: headers })
      .map(res => res.json());
  }
}
