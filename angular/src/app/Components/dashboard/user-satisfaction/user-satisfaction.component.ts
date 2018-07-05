import { Component, OnInit } from '@angular/core';
import { FbuserService } from './../../../service/fbUser/fbuser.service';
import { UnknownService } from './../../../service/unknown/unknown.service';


import { Router, ActivatedRoute, Params } from '@angular/router';
import { parse } from 'url';
@Component({
  selector: 'app-user-satisfaction',
  templateUrl: './user-satisfaction.component.html',
  styleUrls: ['./user-satisfaction.component.css']
})
export class UserSatisfactionComponent implements OnInit {
  botID
 
  public pieChartData: number[] = [0, 0];
  public pieChartLabels: string[] = ['Answered', 'Unanswered'];
  public pieChartType: string = 'pie';
  constructor(private activatedRoute: ActivatedRoute,
    private FbuserService: FbuserService,
    private UnknownService: UnknownService
  ) {
    this.botID = this.activatedRoute.snapshot.paramMap.get("botId")
    this.getdata()
  }

  ngOnInit() {
  }
  async  getdata() {
    let totalChat: number = 0
    let totalAnswer: number = 0
    let totalUnanswer: number = 0
    let perTotalAnswer
    let perTotalUnanswer
    
    await  this.UnknownService.getAllUnknown(this.botID).subscribe(res => {
      if (res.success == true) {
        totalUnanswer = res.unknown.length
        
      }
    })
     this.FbuserService.getAllFbUsers(this.botID).subscribe(res => {
      if (res.success == true) {
        for (let j = 0; j < res.fbuser.length; j++) {
          totalChat = totalChat + res.fbuser[j].logChat.length
         
        }
        totalAnswer = totalChat - totalUnanswer
      
       // perTotalAnswer = (totalAnswer * 100) / (totalAnswer + totalUnanswer)
        perTotalAnswer = Math.round( (totalAnswer * 100) / (totalAnswer + totalUnanswer)* 100)/100
        
      //  perTotalUnanswer = (totalUnanswer * 100) / (totalAnswer + totalUnanswer)
        perTotalUnanswer = Math.round(  (totalUnanswer * 100) / (totalAnswer + totalUnanswer)* 100)/100
        
        this.pieChartData=[perTotalAnswer,perTotalUnanswer]
      }
    })
 

  }

  // Pie


  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}