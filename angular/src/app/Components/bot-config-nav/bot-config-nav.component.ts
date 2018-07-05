import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-bot-config-nav',
  templateUrl: './bot-config-nav.component.html',
  styleUrls: ['./bot-config-nav.component.css']
})

export class BotConfigNavComponent implements OnInit {
  configType = 'plugins';
  botID:String
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.botID= this.activatedRoute.snapshot.paramMap.get("botId")
  }


  // tslint:disable-next-line:member-ordering
  @Output() ConfigType = new EventEmitter<string>();
  getConfigType(configType) {
  
    this.configType = configType;
    this.ConfigType.emit(this.configType);
  
  }

}
