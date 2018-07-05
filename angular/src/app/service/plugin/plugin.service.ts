import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
@Injectable()
export class PluginService {
  authToken: any;

  constructor(private http: Http, private ConfigService: ConfigService) { }
  domain = this.ConfigService.domain
  getAllBlock(botID) {

    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get(this.domain + 'bot/blocklist/' + botID, { headers: headers })
      .map(res => res.json());
  }
  getBlock(blockID) {
    let headers = new Headers();
    this.loadToken()
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.get(this.domain + 'bot/block/' + blockID, { headers: headers })
      .map(res => res.json())
  }
  deleteBlock(botId,blockId){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'bot/deleteBlock/'+botId,{blockId},{ headers: headers })
      .map(res => res.json());
  }

  editBlockName(botID, blockID, newName) {
    this.loadToken()
    let headers = new Headers();
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain + 'bot/blocklist/editblockname/' + blockID, { botid: botID, blockid: blockID, newname: newName }, { headers: headers })
      .map(res => res.json())
  }

  editText(blockID, flowStt, newText) {
    this.loadToken();
    const headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.domain + 'bot/blocklist/editblocktext/' + blockID, { blockid: blockID, newtext: newText, flowstt: flowStt }, { headers: headers })
      .map(res => res.json());
  }

  editIdol(blockID, flowStt, url , delToken) {
    this.loadToken();
    const headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.domain + 'bot/blocklist/editblockidol/' + blockID, { blockid: blockID, url: url,delToken: delToken, flowStt: flowStt }, { headers: headers })
      .map(res => res.json());
  }


  addQuickReply(blockID, newQuickReply) {
    this.loadToken();
    const headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.domain + 'bot/blocklist/addQuickReply/' + blockID, { newquickreply: newQuickReply }, { headers: headers })
      .map(res => res.json());
  }
  addIdol(botId,Idol){
    this.loadToken();
    const headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    // tslint:disable-next-line:max-line-length
    return this.http.post(this.domain + 'bot/addblock/addIdolBlock/'+botId , { Idol }, { headers: headers })
      .map(res => res.json());
  }
  addTeam(botId, Team) {
    this.loadToken();
    const headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'bot/addblock/addTeamBlock/'+botId , { Team }, { headers: headers })
      .map(res => res.json());
  }
  deleteQuickReply(blockID, quickReplyID) {
    this.loadToken();
    const headers = new Headers();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.domain + 'bot/blocklist/deleteQuickReply/' + blockID + '/' + quickReplyID, { headers: headers })
      .map(res => res.json());
  }

  addNews(blockID, link) {
    this.loadToken()
    let headers = new Headers();
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain + 'bot/blocklist/addNews/' + blockID, { link: link }, { headers: headers })
      .map(res => res.json())
  }

  shortLink(link) {
    this.loadToken()
    let headers = new Headers();
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain + 'bot/urlshortener/', { link }, { headers: headers })
      .map(res => res.json())
  }

  deleteNews(blockID, newID) {
    this.loadToken()
    let headers = new Headers();
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.put(this.domain + 'bot/blocklist/deleteNews/' + blockID + '/' + newID, { headers: headers })
      .map(res => res.json())
  }
  editGalaryTitle(botId,blockId,newTitle,stt){
    this.loadToken()
    let headers = new Headers();
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain + 'bot/blocklist/editGalaryTitle/' + botId+'/'+blockId ,{newTitle,stt}, { headers: headers })
      .map(res => res.json())
  }
  editGalarySubTitle(botId,blockId,newSubTitle,stt){
    this.loadToken()
    let headers = new Headers();
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain + 'bot/blocklist/editGalarySubTitle/' + botId+'/'+blockId ,{newSubTitle,stt}, { headers: headers })
      .map(res => res.json())
  }
  editGalaryImg(botId,blockId,img,deltoken,stt){
    this.loadToken()
    let headers = new Headers();
    headers.append('Authorization', this.authToken)
    headers.append('Content-Type', 'application/json')
    return this.http.post(this.domain + 'bot/blocklist/editGalaryImg/' + botId+'/'+blockId ,{img,stt,deltoken}, { headers: headers })
      .map(res => res.json())
  }
  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

}
