import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardService } from './../../../service/dashboard/dashboard.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.css']
})
export class ListTableComponent implements OnInit {
  botId: String
  blockOfPlugin: any = []
  blockFlow: any = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private DashboardService: DashboardService
  ) {
    this.botId = this.activatedRoute.snapshot.paramMap.get("botId")
    this.getBlockNews()

  }

  ngOnInit() {

  }
  listHash: any[] = []
  getBlockNews() {
    this.DashboardService.getBlockByPlugin(this.botId).subscribe((res) => {
      this.blockOfPlugin = res.blocks
      this.blockFlow = this.blockOfPlugin[0].flow
      for (let j = 0; j < this.blockFlow[0].elements.length; j++) {
       this.DashboardService.getUrlClick(this.blockFlow[0].elements[j].buttons[0].hash).subscribe((res) => {
          let user_clicks = res.result.data.clicks[0].user_clicks
          this.DashboardService.getUrlExpand(this.blockFlow[0].elements[j].buttons[0].url).subscribe((res) =>{
            let long_url = res.result.data.expand[0].long_url
            this.listHash.push({
              date: this.blockFlow[0].elements[j].buttons[0].date,
              link: long_url,
              total: user_clicks
  
            })
          })
          
        })
      }
    })

  }
}