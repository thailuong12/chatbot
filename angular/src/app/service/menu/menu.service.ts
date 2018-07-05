import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {ConfigService} from '../config/config.service';

@Injectable()
export class MenuService {
  authToken: any
  constructor(private http: Http,private ConfigService:ConfigService) { }
  domain = this.ConfigService.domain
  getAllMenu(){
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.get(this.domain+'bot/getAllMenu', { headers: headers })
      .map(res => res.json())
  }
  addMenu(menu) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain+'bot/addmenu', menu, {headers: headers })
      .map(res => res.json());
  }
  getSingleMenu(id) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.get(this.domain+'bot/singleMenu/' + id, {headers: headers })
      .map(res => res.json());
  }
  editMenu(menu,id){
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.put(this.domain+'bot/updateMenu/'+ id, menu, {headers: headers })
      .map(res => res.json());
  }
  deleteMenu(id) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.delete(this.domain+'bot/deletemenu/' + id, {headers: headers })
      .map(res => res.json());
  }
  loadToken() {
    const token = localStorage.getItem('id_token')
    this.authToken = token;
  }
}
