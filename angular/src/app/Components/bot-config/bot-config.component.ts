import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BotService } from './../../service/bot/bot.service';
import { LoginService } from '../../service/login/login.service';

@Component({
  selector: 'app-bot-config',
  templateUrl: './bot-config.component.html',
  styleUrls: ['./bot-config.component.css']
})

export class BotConfigComponent implements OnInit {
  configType: string;
  userName;
  botId;
  bot;

  constructor(
    private activatedRoute: ActivatedRoute,
    private botService: BotService,
  private loginService: LoginService,
    private router: Router) {
    this.userName = localStorage.getItem('account').replace(/"/g, '');
    this.configType = this.activatedRoute.snapshot.paramMap.get('config');
    this.botId = this.activatedRoute.snapshot.paramMap.get('botId');
    console.log(this.botId);
    this.botService.getBotById(this.botId).subscribe(data => {
      this.bot = data.bots.name;
    });
  }

  ngOnInit() {

  }

  getConfigType(configType) {
    this.configType = configType;
  }

    logOut() {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }
}
