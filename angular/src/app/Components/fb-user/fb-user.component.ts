import { Component, OnInit } from '@angular/core';
import { ViewChild, AfterViewInit, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {FbuserService} from './../../service/fbUser/fbuser.service';
import { Element } from '@angular/compiler';
@Component({
  selector: 'app-fb-user',
  templateUrl: './fb-user.component.html',
  styleUrls: ['./fb-user.component.css']
})
export class FbUserComponent implements OnInit {
  fbUserList:any
  botID:String
  fbUser: any
  fbChat:any = ""
  fbSurvey:any = ""
  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute,
    private FbuserService:FbuserService
  ) { 
    this.botID = this.activatedRoute.snapshot.paramMap.get("botId")
    this.getAllFbUser(this.botID)
  }
  displayedColumns = [ 'name', 'locale','timezone','gender','activities','message'];
  dataSource = new MatTableDataSource(this.fbUserList);
  ngOnInit() {
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  getAllFbUser(botId){
    this.FbuserService.getAllFbUsers(botId).subscribe(res=>{
      if(res.success==true){
        this.fbUserList=res.fbuser
        this.dataSource = new MatTableDataSource(this.fbUserList)
       
      }
    })
  }
  getFbUser(userId){
      this.FbuserService.getFbUsers(this.botID,userId).subscribe(res=>{
        if(res.success==true){
          this.fbUser = res.fbuser
          if(this.fbUser[0].logChat.length > 0)
          {
            this.fbChat=   this.fbUser[0].logChat
          }
          else{
            this.fbChat = null
          }

          if(this.fbUser[0].activities.length>0){
            this.fbSurvey = this.fbUser[0].activities[0].survey
           
          }else{
            this.fbSurvey = null
          
          }
        }
      })
  }
}
