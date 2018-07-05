import { Component, OnInit } from '@angular/core';
import { FbuserService } from './../../../service/fbUser/fbuser.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Chart} from 'chart.js';
@Component({
  selector: 'app-person-interact',
  templateUrl: './person-interact.component.html',
  styleUrls: ['./person-interact.component.css']
})
export class PersonInteractComponent implements OnInit {
  botID;
 
  public listUserTime: any[] = []
  jan: number = 0
  feb: number = 0
  mar: number = 0
  apr: number = 0
  may: number = 0
  jun: number = 0
  jul: number = 0
  aug: number = 0
  sep: number = 0
  oct: number = 0
  nov: number = 0
  dec: number = 0
  public lineChartData:any[]=[
    { data: [this.jan, this.feb, this.mar, this.apr, this.may, this.jun, this.jul, this.aug, this.sep, this.oct, this.nov, this.dec], label: 'People interacted with Bot' }
  ]


  constructor(private activatedRoute: ActivatedRoute,
    private FbuserService: FbuserService) {
    this.botID = this.activatedRoute.snapshot.paramMap.get("botId")
    this.loadUSerTime();

  }

  ngOnInit() {

  }
  loadUSerTime() {
    this.FbuserService.getAllFbUsers(this.botID).subscribe(res => {
      for (let j = 0; j < res.fbuser.length; j++) {
        this.listUserTime.push(res.fbuser[j].firstInter)

      }
      this.jan = this.listUserTime.filter(x => x.month === '01').length
      this.feb = this.listUserTime.filter(x => x.month === '02').length
      this.mar = this.listUserTime.filter(x => x.month === '03').length
      this.apr = this.listUserTime.filter(x => x.month === '04').length
      this.may = this.listUserTime.filter(x => x.month === '05').length
      this.jun = this.listUserTime.filter(x => x.month === '06').length
      this.jul = this.listUserTime.filter(x => x.month === '07').length
      this.aug = this.listUserTime.filter(x => x.month === '08').length
      this.sep = this.listUserTime.filter(x => x.month === '09').length
      this.oct = this.listUserTime.filter(x => x.month === '10').length
      this.nov = this.listUserTime.filter(x => x.month === '11').length
      this.dec = this.listUserTime.filter(x => x.month === '12').length

      this.lineChartData = [
        { data: [this.jan, this.feb, this.mar, this.apr, this.may, this.jun, this.jul, this.aug, this.sep, this.oct, this.nov, this.dec], label: 'People interacted with Bot' }
      ];
    })
  } 
  
  

  public lineChartColors = [{
    backgroundColor: 'rgb(186,227,215)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
  ];

  public lineChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  
  public lineChartLabels: string[] =
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public lineChartType: string = 'line';

  public lineChartLegend: boolean = true;




  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}