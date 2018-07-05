import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BroadcastService } from './../../service/broadcast/broadcast.service';
import { PluginService } from './../../service/plugin/plugin.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
declare const $: any;
declare var jquery: any;

@Component({
    selector: 'app-broadcast',
    templateUrl: './broadcast.component.html',
    styleUrls: ['./broadcast.component.css']
})

export class BroadcastComponent implements OnInit {
    hideSurvey() {
        $('#surveyModal').modal('hide')
      }
    showSuccessSurvey() {
        $('#sendSuccessModal').modal('show')
      }
    broadCastType: string
    quickReplyForm: FormGroup
    addSurveyForm: FormGroup
    repeatType: string
    botID: String
    allBroadCast: any
    broadCast: any
    userAtt: string
    cond: string
    value: string
    addQuickStatus: boolean = false
    constructor(private BroadcastService: BroadcastService,
        private activatedRoute: ActivatedRoute,
        private PluginService: PluginService,
        private fb: FormBuilder
    ) {

        this.botID = this.activatedRoute.snapshot.paramMap.get("botId")
        this.getAllBroadCast(this.botID)
        this.createQuickReplyForm()
        this.createAddSurveyForm()
    }

    ngOnInit() {
        this.broadCastType = 'off';

    }
    createQuickReplyForm() {
        this.quickReplyForm = this.fb.group({
            name: ['', Validators.required]
        });
    }
    createAddSurveyForm() {
        this.addSurveyForm = this.fb.group({
            name: ['', Validators.required]
        });
    }
    resetQuickReplyForm() {
        this.quickReplyForm.reset();
    }
    resetSurveyForm() {
        this.addSurveyForm.reset();
    }
    setBroadCastType(broadCastId) {
        this.BroadcastService.getBroadCast(this.botID).subscribe(res => {
            if (res.success == true) {
                this.allBroadCast = res.broadcast
                this.broadCast = this.allBroadCast.filter(x => x._id == broadCastId)
                this.broadCastType = 'on';
            }

        })
    }
    getAllBroadCast(botId) {
        this.BroadcastService.getBroadCast(this.botID).subscribe(res => {
            if (res.success == true) {
                this.allBroadCast = res.broadcast
            }
        })
    }
    editBlockName(event) {

        this.PluginService.editBlockName(this.botID, this.broadCast[0]._id,event.currentTarget.value).subscribe(res => {
            if (res.success == true) {
                this.getAllBroadCast(this.botID)
            }
        })
    }
    editContentText(event) {

        this.PluginService.editText(this.broadCast[0]._id, 0, event.currentTarget.value).subscribe(res => {
            if (res.success == true) {      
                this.getAllBroadCast(this.botID)
                 this.setBroadCastType(this.broadCast[0]._id)
            }
        })
    }
    addQuickReply() {
        var newQuickReply = {
            name: this.quickReplyForm.get('name').value,
            blockname: 'endsurvey',
            botId: this.botID
        }
        this.BroadcastService.addBroadCastQuickReply(this.broadCast[0], newQuickReply).subscribe(res => {
            if (res.success == true) {
                this.getAllBroadCast(this.botID)
                this.setBroadCastType(this.broadCast[0]._id)
                
                this.resetQuickReplyForm();
                this.changeAddQuickStatus();
            }
        })
    }
    deleteQuickReply(quickReplyID) {
        this.PluginService.deleteQuickReply(this.broadCast[0]._id, quickReplyID).subscribe(res => {
            if (res.success == true) {
                this.getAllBroadCast(this.botID)
                this.setBroadCastType(this.broadCast[0]._id)

            }

        })

    }
    addSurvey() {
        this.BroadcastService.addSurveyBlock(this.botID, this.addSurveyForm.get('name').value).subscribe(res => {
            if (res.success == true) {
                this.getAllBroadCast(this.botID)
                this.hideSurvey()
                this.resetSurveyForm();
            }
        })
    }
    deleteSurvey(){
       this.BroadcastService.deleteSurveyBlock(this.botID,this.broadCast[0]._id).subscribe(res=>{
        if (res.success == true) {
            this.getAllBroadCast(this.botID)
            this.broadCastType = 'off';
        }
     })
    }
    changeAddQuickStatus() {
        this.addQuickStatus = !this.addQuickStatus;
        this.resetQuickReplyForm();
    }

    sendSurvey(){
        this.BroadcastService.sendSurvey(this.botID,this.broadCast[0]._id).subscribe(res=>{
            if(res.success==true){
                this.showSuccessSurvey()
            }
        })
    }

}
