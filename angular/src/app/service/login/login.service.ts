import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class LoginService {
  authToken: any;
  account: any;
  options;
  constructor(private http: Http, private configService: ConfigService) { }
  domain = this.configService.domain;
  loginAccount(account) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'account/authenticate', account, { headers: headers })
      .map(res => res.json());
  }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
      })
    });
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  // luu token cua user
  storeAccountData(token, account) {
    localStorage.setItem('id_token', token);
    // chi luu dc string, ko luu dc object, phai chuyen user tu obj thanh string
    localStorage.setItem('account', JSON.stringify(account));
    this.authToken = token;
    this.account = account;
  }
  logOut() {
    this.authToken = null;
    this.account = null;
    localStorage.clear();
  }
  loggedIn() {
    return tokenNotExpired('id_token');
  }
  getAccountById(id) {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');

    return this.http.get('account/' + id, { headers: headers })
      .map(res => res.json());
  }
  forgotPassword(email) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'account/forgot', {email: email}, { headers: headers })
      .map(res => res.json());
  }
}
