import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MenuService } from './../../service/menu/menu.service';
import { BotService } from './../../service/bot/bot.service';
import { ConfigService } from './../../service/config/config.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.css']
})

export class ConfigureComponent implements OnInit {

  // form: FormGroup;
  enable = true;
  disable = false;
  // addStatus = false;
  // btnAdd = true;
  // // buttonType = "Url";
  
  // menus;
  // messageClass;
  // message;
  // processing = false;
  // status = [
  //   {value: 'true', viewValue: 'True'},
  //   {value: 'false', viewValue: 'False'}
  // ];

  // //edit
  // editStatus = false;
  // showEditForm = false;
  // formEdit: FormGroup;
  // messageEdit;
  // messageEditClass;
  // menuEdit = {
  //   title: String,
  //   status: String
  // };
  // processingEdit = false;
  // editID;
  // //deleting
  // messageClassDelete;
  // messageDelete;
  // deleteID;
  // _processing = true;


  webHookGen:String
  domainName:String
  // domainName:String= "obscure-beyond-96361.herokuapp.com"
  // Facebook Setting
  formFBS: FormGroup;
  botID;
  messageFBS;
  messageFBSClass;
  fbsEdit = {
    fbToken: String,
    appSecret: String
  };
  //Gmail Setting
  formGmail: FormGroup;
  type = "email";
  messageGmailClass;
  messageGmail;
  gmailEdit:any = [];
  email;
  password;
  showpassword = "password"
   //QNA API Setting
   formQNA: FormGroup;
   type_ = "qna-api";
   messageQNAClass;
   messageQNA;
   qnaEdit:any = [];
   version;
   //Webhook URL
   typeWebhook = "webhookurl";
   webhookEdit: any = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private botService: BotService,
    private formBuilder: FormBuilder,
    private configService: ConfigService
  ) {  
    this.botID = this.activatedRoute.snapshot.paramMap.get("botId")
    this.configService.getType(this.typeWebhook).subscribe(data => {
      if (!data.success) {
        this.domainName = " "
      } else {
        this.webhookEdit = data.configures;
        this.domainName = this.webhookEdit.content[0].url
        this.webHookGen = `https://${this.domainName}/webhook/${this.botID}`
      }
    });
    //this.createForm();
   // this.editForm();
    this.editFBSForm();
    this.isEditingFBS();
    this.editGmailForm();
    this.isEditingGmail()
    this.editQNAForm();
    this.isEditingQNA();
  }

  // createForm() {
  //   this.form = this.formBuilder.group({
  //     title: ['', Validators.required],
  //     payload: ['', Validators.required],
  //     status: ['', Validators.required]
  //   })
  // }
  // editForm() {
  //   this.formEdit = this.formBuilder.group({
  //     title: ['', Validators.required],
  //     // payload: ['', Validators.required],
  //     status: ['', Validators.required]
  //   })
  // }
  editFBSForm(){
    this.formFBS = this.formBuilder.group({
      fbToken: ['', Validators.required],
      appSecret: ['', Validators.required],
    })
  }
  isEditingFBS(){
    this.botService.getBotById(this.botID).subscribe(data => {
      if (!data.success) {
        console.log("err");
      } else {
        this.fbsEdit = data.bots;
      }
    });
  }
  updateFBS() {
    const fbs = {
      fbToken: this.formFBS.get('fbToken').value,
      appSecret: this.formFBS.get('appSecret').value,
    }
    this.botService.editBotFBS(this.botID,fbs).subscribe(data => {
      if (!data.success) {
        this.messageFBSClass = 'alert alert-danger';
        this.messageFBS = data.message;
      } else {
        this.messageFBSClass = 'alert alert-success';
        this.messageFBS = data.message;
        setTimeout(() => {
          this.isEditingFBS();
          this.messageFBS = null;
          this.messageFBSClass = null;
        }, 1000);
      }
    });
  }
  showpass(){
    if(this.showpassword === "password"){
      this.showpassword = "text"
    }else if(this.showpassword === "text"){
      this.showpassword = "password"
    }else{
      this.showpassword = "password"
    }
  }
  editGmailForm(){
    this.formGmail = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  isEditingGmail(){
    this.configService.getType(this.type).subscribe(data => {
      if (!data.success) {
        console.log("err");
      } else {
        this.gmailEdit = data.configures;
        this.email = this.gmailEdit.content[0].email
        this.password = this.gmailEdit.content[0].password
      }
    });
  }
  updateGmail() {
    const gmail = {
      type: this.type,
      newPass: this.formGmail.get('password').value,
      newEmail: this.formGmail.get('email').value,
    }
    this.configService.editAccountEmail(gmail).subscribe(data => {
      if (!data.success) {
        this.messageGmailClass = 'alert alert-danger';
        this.messageGmail = data.message;
      } else {
        this.messageGmailClass = 'alert alert-success';
        this.messageGmail = data.message;
        setTimeout(() => {
          this.isEditingGmail();
          this.messageGmail = null;
          this.messageGmailClass = null;
        }, 1000);
      }
    });
  }
  editQNAForm(){
    this.formQNA = this.formBuilder.group({
      version: ['', Validators.required]
    })
  }
  isEditingQNA(){
    this.configService.getType(this.type_).subscribe(data => {
      if (!data.success) {
        console.log("err");
      } else {
        this.qnaEdit = data.configures;
        this.version = this.qnaEdit.content[0].version
      }
    });
  }
  // updateQNA() {
  //   const qna = {
  //     type: this.type_,
  //     newVersion: this.formQNA.get('version').value
  //   }
  //   this.configService.editQNA_API(qna).subscribe(data => {
  //     if (!data.success) {
  //       this.messageQNAClass = 'alert alert-danger';
  //       this.messageQNA = data.message;
  //     } else {
  //       this.messageQNAClass = 'alert alert-success';
  //       this.messageQNA = data.message;
  //       setTimeout(() => {
  //         this.isEditingQNA();
  //         this.messageQNA = null;
  //         this.messageQNAClass = null;
  //       }, 1000);
  //     }
  //   });
  // }
  // addMenu(){
  //   this.processing = true;
  //   const menu = {
  //     title: this.form.get('title').value,
  //     payload: this.form.get('payload').value,
  //     status: this.form.get('status').value
  //   };
  //   this.menuService.addMenu(menu).subscribe(data => {
  //     if (!data.success) {
  //       this.messageClass = 'alert alert-danger';
  //       this.message = data.message;
  //       this.processing = false;
  //     }else{
  //       this.messageClass = 'alert alert-success';
  //       this.message = data.message;
  //       setTimeout(() => {
  //         this.getAllMenu();
  //         this.resetForm();
  //       }, 1000);
  //     }
  //   })
  // }

  // getAllMenu() {
  //   this.menuService.getAllMenu().subscribe(data => {
  //     this.menus = data.menus;
  //   });
  // }

  setMenu() {
 
    this.configService.setMenu(this.botID).subscribe(res=>{
      if(res.success==true){
        this.disable = true;
        this.enable = false;
      }
    
    })
  }

  deleteMenu() {
 
    this.configService.deleteMenu(this.botID).subscribe(res=>{
      if(res.success==true){
        this.enable = true;
        this.disable = false;
      }
    
    })
  }
  // isAdding() {
  //   this.addStatus = !this.addStatus;
  //   this.btnAdd = false;
  // }
  // cancel(){
  //   this.resetForm();
  // }
  // resetForm(){
  //   this.form.reset();
  //   this.messageClass = null;
  //   this.message = null;
  //   this.messageEditClass = null;
  //   this.messageEdit = null;
  
  //   this.addStatus = false;
  //   this.btnAdd = true;
  //   this.editStatus = false;
  //   this.processingEdit = false;
  // }
 
  // isEditing(id){
  //   this.editStatus = !this.editStatus;
  //   this.btnAdd = false;
  //   this.addStatus = false;
  //   this.processingEdit = true;
  //   this.editID = id
  //   this.menuService.getSingleMenu(id).subscribe(data => {
  //     if (!data.success) {
  //       this.messageEditClass = 'alert alert-danger';
  //       this.messageEdit = data.message;
  //     } else {
  //       this.menuEdit = data.menu;
  //     }
  //   });
  // }
  // updateMenu() {
  //   this.processingEdit = true;
  //   const menu = {
  //     title: this.formEdit.get('title').value,
  //     status: this.formEdit.get('status').value,
  //   }
  //   this.menuService.editMenu(menu, this.editID).subscribe(data => {
  //     if (!data.success) {
  //       this.messageEditClass = 'alert alert-danger';
  //       this.messageEdit = data.message;
  //       this.processing = false;
  //     } else {
  //       this.messageEditClass = 'alert alert-success';
  //       this.messageEdit = data.message;
  //       setTimeout(() => {
  //         this.getAllMenu();
  //         this.resetForm();
  //       }, 1000);
  //     }
  //   });
  // }

  // clodeModal() {
  //   this.messageClassDelete = null;
  //   this.messageDelete = null;
  //   this._processing = true;
  //   $('#myModal').modal('hide')
  // }

  // isDeleting(id){
  //   this.deleteID = id;
  // }

  // deleteMenu() {
  //   this._processing = false;
  //   this.menuService.deleteMenu(this.deleteID).subscribe(data => {
  //     if (!data.success) {
  //       this.messageClassDelete = 'alert alert-danger';
  //       this.messageDelete = data.message;
  //     } else {
  //       this.messageClassDelete = 'alert alert-success';
  //       this.messageDelete = data.message;
  //       setTimeout(() => {
  //         this.getAllMenu();
  //         this.clodeModal();
  //       }, 1000);
  //     }
  //   });
  // }
  ngOnInit() {
   // this.getAllMenu();
  }
 
}
export class ExpansionOverviewExample {
  panelOpenState: boolean = false;
}
