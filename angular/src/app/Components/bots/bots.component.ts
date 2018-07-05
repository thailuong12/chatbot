import { Component, OnInit } from '@angular/core';
import { BotService } from './../../service/bot/bot.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesModule } from 'angular2-flash-messages';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-bots',
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.css']
})
export class BotsComponent implements OnInit {
  //create
  form: FormGroup;
  bots;
  messageClass;
  message;
  progressBar = false;
  progressBarDel = false
  //edit
  formEdit: FormGroup;
  editID;
  newname;
  isDelete:boolean = false;
  isAdding:boolean = false;
  isEdit:boolean = false;
  name;
  messageEditClass;
  messageEdit;
  _progressBar = false;
  //delete
   messageDeleteClass;
   messageDelete;
   _processing = true;
   deleteID;
   kbId;
  constructor(
    private botService: BotService,
    private formBuilder: FormBuilder
  ) { 
    this.createForm();
    this.editForm();
  }
  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }
  editForm(){
    this.formEdit = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }
  getAllBot() {
    this.botService.getAllBot().subscribe(data => {
      this.bots = data.bots;
    });
  }
  addBot(){
    this.form.disable();
    this.isAdding=true;
    this.progressBar = true;
    const bot = {
      name: this.form.get('name').value,
    };
    this.botService.addBot(bot).subscribe(data => {
      if (!data.success) {
        this.progressBar = false;
        this.form.enable();
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.isAdding=false;
      }else{
        this.form.enable();
        this.progressBar = false;
      //  this.messageClass = 'alert alert-success';
        this.message = data.message;
        this.isAdding=false;
        
       
          this.getAllBot();
          this.resetForm();
       
      }
    })
  }
  resetForm(){
    //add
    this.form.reset();
    this.messageClass = null;
    this.message = null;
    $('#botModal').modal('hide')
    //delete
    this.messageDeleteClass = null;
    this.messageDelete = null;
    this._processing = true;
    $('#myModal').modal('hide')
    //edit
    this.formEdit.reset();
    this.messageEditClass = null;
    this.messageEdit = null;
    $('#ebotModal').modal('hide')
  }
  isEditing(id,name){
    this.editID = id;
    this.name = name;
  }
  editBot() {
    this.isEdit = true;
    this._progressBar = true;
    this.formEdit.disable();
    this.newname = this.formEdit.get('name').value,
    this.botService.editBotName(this.editID,this.newname).subscribe(data => {
      if (!data.success) {
        this._progressBar = false;
        this.formEdit.enable();
        this.messageEditClass = 'alert alert-danger';
        this.messageEdit = data.message;
        this.isEdit = false
      } else {
        this._progressBar = false;
        this.formEdit.enable();
        this.messageEditClass = 'alert alert-success';
        this.messageEdit = data.message;
     
          this.getAllBot();
          this.resetForm();
          this.isEdit = false
       
      }
    });
  }
  isDeleting(id,kbid){
    this.deleteID = id;
    this.kbId = kbid;
  }
  deleteBot() {
    this.isDelete =true;
    this._processing = false;
    this.progressBarDel = true
    this.botService.deleteBot(this.deleteID,this.kbId).subscribe(data => {
      if (!data.success) {
        this. messageDeleteClass = 'alert alert-danger';
        this.messageDelete = data.message;
        this.isDelete =false;
        this.progressBarDel = false
      } else {
        this. messageDeleteClass = 'alert alert-success';
        this.messageDelete = data.message;
       
          this.getAllBot();
          this.resetForm();
          this.isDelete =false;
          this.progressBarDel = false
      
      }
    });
  }
  ngOnInit() {
    this.getAllBot();
  }

}
