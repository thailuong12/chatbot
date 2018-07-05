import { UnknownService } from './../../service/unknown/unknown.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {FbuserService} from './../../service/fbUser/fbuser.service';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-unknown',
  templateUrl: './unknown.component.html',
  styleUrls: ['./unknown.component.css']
})
export class UnknownComponent implements OnInit {
  hideAddFaq() {
    $('#addFaqModal').modal('hide')
  }
  botId
  fbUser: any
  fbChat:any
  listUnknown: any
  addFaqForm:FormGroup
  unknownDeleteList: any = []
  constructor(private UnknownService: UnknownService,private fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private FbuserService:FbuserService) {
    this.botId = this.activatedRoute.snapshot.paramMap.get("botId")
    this.getAllUnknown(this.botId)
    this.creatAddFaqForm()
  }

  ngOnInit() {
  }
  getAllUnknown(botId) {
    this.UnknownService.getAllUnknown(botId).subscribe(res => {
      if (res.success == true) {
        this.listUnknown = res.unknown
      }
    })
  }
  deleteUnknown(unknownId) {
    this.UnknownService.deleteUnknown(this.botId, unknownId).subscribe(res => {
      if (res.success == true) {
        this.getAllUnknown(this.botId)
      }
    })
  }

  checkUnknowndId(unknownId) {
    let f =false
    if(this.unknownDeleteList.length==0){
      this.unknownDeleteList.push(unknownId)
    }

    else{
      for (let i = 0; i < this.unknownDeleteList.length; i++) {
        if (unknownId == this.unknownDeleteList[i]) {
          this.unknownDeleteList.splice(i, 1)
          f=true
           break
        } 
      }
      if(f==false){
        this.unknownDeleteList.push(unknownId)
      }
    }

  }
  creatAddFaqForm() {
    this.addFaqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]      
    })
  }
  addFaq(){
    let question = this.addFaqForm.get('question').value
    let answer = this.addFaqForm.get('answer').value
    
    this.UnknownService.addFaq(this.botId,question,answer,this.unknownDeleteList).subscribe(res=>{
      if(res.success==true){
        this.hideAddFaq()
        this.getAllUnknown(this.botId)
      }
    })
  }
  getFbUser(botId,appId){
    this.UnknownService.getFbUser(this.botId,appId).subscribe(res=>{
      if(res.success==true){
       // console.log(res)
        this.fbUser = res.user
       this.fbChat=   this.fbUser[0].logChat
      }
    })
}
}