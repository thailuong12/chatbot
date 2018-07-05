import { PluginService } from './../../service/plugin/plugin.service';
import { ConfigService } from './../../service/config/config.service';

import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.css']
})
export class PluginsComponent implements OnInit {
  url;


  hideIdol() {
    $('#idolModal').modal('hide')
  }
  hideTeam() {
    $('#teamModal').modal('hide')
  }
  hideNews() {
    $('#newsModal').modal('hide')
  }

  quickReplyForm: FormGroup
  idolForm: FormGroup
  newsForm: FormGroup
  teamForm: FormGroup
  plugin: String
  blocksCtrl: FormControl
  filteredBlock: Observable<any[]>;
  botID: String
  blockOfPlugin: any = []
  block: any = {}
  blockPlugin: String
  blockFlow: any = []
  blockActive = false
  blockHomeActive= false
  link: String = ""
  payLoadName: String
  idol: any
  team: any
  addQuickStatus: boolean = false
  // upload image
  responses: Array<any>;
  private uploader: FileUploader;
  message: string;
  progressBar = false;
  urlDel
  headersDel
  blockHomeElement
  constructor(private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private PluginService: PluginService,
    private http: Http,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private configService: ConfigService

  ) {
    this.botID = this.activatedRoute.snapshot.paramMap.get("botId")
    this.plugin = this.activatedRoute.snapshot.paramMap.get("config")
    this.PluginService.getAllBlock(this.botID).subscribe((res) => {
      this.blockOfPlugin = res.blocks
    })
    this.createQuickReplyForm()
    this.createNewsForm()
    this.createIdolForm()
    this.createTeamForm()
    this.blocksCtrl = new FormControl();
    this.filteredBlock = this.blocksCtrl.valueChanges
      .pipe(
        startWith(''),
        map(blocks => blocks ? this.filterBlock(blocks) : this.blockOfPlugin.slice())
      );
    this.responses = [];

  }

  filterBlock(name) {
    return this.blockOfPlugin.filter(blocks =>
      blocks.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  ngOnInit() {
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      autoUpload: false,
      isHTML5: true,
      removeAfterUpload: true,
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);
    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      fileItem.withCredentials = false;

      return { fileItem, form };
    };
    this.urlDel = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    this.headersDel = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
  }

  addIdol() {
    if (this.uploader.queue.length > 1 || this.uploader.queue.length == 0) {
      this.message = "Please select only one picture!!!";
      this.uploader.clearQueue()
    }
    else {
      this.uploader.uploadAll()
      this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
        let res: any = JSON.parse(response);
        this.idol = {
          name: this.idolForm.get('name').value,
          plugin: this.plugin,
          imgUrl: res.url,
          deleteToken: res.delete_token
        }
        this.PluginService.addIdol(this.botID, this.idol).subscribe(res => {
          if (res.success == true) {
            this.idolForm.reset();
            this.PluginService.getAllBlock(this.botID).subscribe((res) => {
              this.blockOfPlugin = res.blocks;
            });
            this.hideIdol()
          } else {
            console.log("Errors!!!!")
          }
        })

        return { item, response, status, headers };

      };

    }
  }
  addTeam() {
    if (this.uploader.queue.length > 1 || this.uploader.queue.length == 0) {
      this.message = "Please select only one picture!!!";
      this.uploader.clearQueue()
    }
    else {
      this.uploader.uploadAll()
      this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
        let res: any = JSON.parse(response);
        this.team = {
          name: this.teamForm.get('name').value,
          imgUrl: res.url,
          deleteToken: res.delete_token
        }
        this.PluginService.addTeam(this.botID, this.team).subscribe(res => {
          if (res.success == true) {
            this.teamForm.reset();
            this.PluginService.getAllBlock(this.botID).subscribe((res) => {
              this.blockOfPlugin = res.blocks;
            });
            this.hideTeam()
          } else {
            console.log("Errors!!!!")
          }
        })

        return { item, response, status, headers };

      };

    }
  }
  deleteImage(delToken) {
    const options = { headers: this.headersDel };
    const body = {
      token: delToken
    };
    this.http.post(this.urlDel, body, options).subscribe(response => {
      console.log('Deleted image');
    });
  };
  getBlockByPlugin(blockName) {

    // tslint:disable-next-line:triple-equals
    return this.blockOfPlugin.filter(x => x.plugin == blockName);
  }

  inputBlockName(blockname) {
   
    if (blockname == 'Chọn Idol' || blockname == 'Xem tin tức' || blockname == 'Bầu Chọn' || blockname == 'Tham Gia Dự Đoán' || blockname == 'home') {
      $('.blockname').prop('disabled', true)
      this.PluginService.getAllBlock(this.botID).subscribe((res) => {
        this.blockOfPlugin = res.blocks;
        this.getBlock1(this.block[0]._id)
        $('.blockname').prop('disabled', true)
        $('.blockhomename').prop('disabled', true)
        
      });
    }
    else {
      $('.blockname').prop('disabled', false)
      $('.blockhomename').prop('disabled', false)
      

    }
  }
  inputBlockHomeName(blockname){
    if (blockname == 'Chọn Idol' || blockname == 'Xem tin tức' || blockname == 'Bầu Chọn' || blockname == 'Tham Gia Dự Đoán' || blockname == 'home') {
      $('.blockhomename').prop('disabled', true)
 
    }
    else {
    
      $('.blockhomename').prop('disabled', false)
      

    }
  }
  getBlock(blockID) {
    // tslint:disable-next-line:triple-equals
    this.block = this.blockOfPlugin.filter(x => x._id == blockID);
    this.inputBlockName(this.block[0].name)
    this.blockHomeActive = false;
    this.blockActive = true;

    this.getBlockFlow(this.block);

    this.blockPlugin = this.block[0].plugin
    this.addQuickStatus = false
    this.resetQuickReplyForm();
  }
  getBlockHome(blockid){
    this.PluginService.getAllBlock(this.botID).subscribe((res) => {
      this.blockOfPlugin = res.blocks;
    });
    this.blockHomeActive = true;
    this.blockActive = false;
    this.block = this.blockOfPlugin.filter(x => x._id == blockid);
  //  console.log(this.block[0].name)
    this.inputBlockHomeName(this.block[0].name)

    this.blockHomeElement = this.block[0].flow[0].elements
   
  }
  getBlock1(blockID) {
    // tslint:disable-next-line:triple-equals
    this.block = this.blockOfPlugin.filter(x => x._id == blockID);
    // this.inputBlockName(this.block[0].name)

    this.blockActive = true;
    this.blockHomeActive = false;

    this.getBlockFlow(this.block);

    this.blockPlugin = this.block[0].plugin
    this.addQuickStatus = false
    this.resetQuickReplyForm();
  }

  getBlockFlow(block) {
    this.blockFlow = block[0].flow;
  }
  saveBlockName(event) {
    
    if (event.currentTarget.value.length > 0) {
      this.PluginService.editBlockName(this.botID, this.block[0]._id, event.currentTarget.value).subscribe(res => {

        if (res.success == true) {

          this.PluginService.getAllBlock(this.botID).subscribe((res) => {
            this.blockOfPlugin = res.blocks;
          });
        }
      });
    }


  }
  saveText(event, item) {
    const flowID = item._id;
    let flowStt;
    for (let i = 0; i < this.block[0].flow.length; i++) {

      if (this.block[0].flow[i]._id == flowID) {
        flowStt = i;
        break;
      }
    }

    this.PluginService.editText(this.block[0]._id, flowStt, event.currentTarget.value).subscribe(res => {

      if (res.success == true) {

        this.PluginService.getAllBlock(this.botID).subscribe((res) => {
          this.blockOfPlugin = res.blocks;
        });
      }
    });
  }

  editImage(delToken, item) {
    this.progressBar = true;
    const flowID = item._id;
    let flowStt;
    for (let i = 0; i < this.block[0].flow.length; i++) {
      if (this.block[0].flow[i]._id == flowID) {
        flowStt = i;
        break;
      }
    }
   
    if (this.uploader.queue.length > 1 || this.uploader.queue.length == 0) {
      this.progressBar = false;
      this.message = "Please select only one picture!!!";
      this.uploader.clearQueue()
    }
    else {
      this.deleteImage(delToken)
      this.uploader.uploadAll()
      this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
        let res: any = JSON.parse(response);

        this.PluginService.editIdol(this.block[0]._id, flowStt, res.url, res.delete_token).subscribe(res => {
          if (res.success == true) {
            this.message = null;
            this.PluginService.getAllBlock(this.botID).subscribe((res) => {
              this.progressBar = false;
              this.blockOfPlugin = res.blocks;
              this.getBlock(this.block[0]._id)
            });

          }
        });

        return { item, response, status, headers };

      };

    }

  }
  
  editHomeImage(delToken, stt){
    this.progressBar = true;
    console.log(delToken);
    if(this.uploader.queue.length > 1 || this.uploader.queue.length == 0) {
      this.progressBar = false;
      this.message = "Please select only one picture!!!";
      this.uploader.clearQueue()
    }
    else {
      if(delToken){
        this.uploader.uploadAll()
        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
          let res: any = JSON.parse(response);
  
          this.PluginService.editGalaryImg(this.botID,this.block[0]._id,res.url,res.delete_token,stt ).subscribe(res=>{
            if (res.success == true) {
              this.message = null;
              this.PluginService.getAllBlock(this.botID).subscribe((res) => {
                this.progressBar = false;
                this.blockOfPlugin = res.blocks;
                
                this.getBlockHome(this.block[0]._id)
                
              });
            }
          })
         
          return { item, response, status, headers };
  
        };
        this.deleteImage(delToken)
      }
      else{
        this.uploader.uploadAll()
        this.uploader.onSuccessItem = (item: any, response: string, status: number, headers: any): any => {
          let res: any = JSON.parse(response);
  
          this.PluginService.editGalaryImg(this.botID,this.block[0]._id,res.url,res.delete_token,stt ).subscribe(res=>{
            if (res.success == true) {
              this.message = null;
              this.PluginService.getAllBlock(this.botID).subscribe((res) => {
                this.progressBar = false;
                this.blockOfPlugin = res.blocks;
                this.getBlockHome(this.block[0]._id)
               
              });
  
            }
          })
         
          return { item, response, status, headers };
  
        };
      }
     

    }
   
  } 
  editHomeTitle(event,i){
      this.PluginService.editGalaryTitle(this.botID,this.block[0]._id,event.currentTarget.value,i).subscribe(res=>{
        //console.log(res)
      })
  }
  editHomeSubTitle(event,i){
    this.PluginService.editGalarySubTitle(this.botID,this.block[0]._id,event.currentTarget.value,i).subscribe(res=>{
      //console.log(res)
    })
  }
  createIdolForm() {
    this.idolForm = this.fb.group({
      name: ['', Validators.required],
      imglink: []
    })
  }
  createTeamForm() {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      imglink: []
    })
  }
  createQuickReplyForm() {
    this.quickReplyForm = this.fb.group({
      name: ['', Validators.required],
      blockname: ['', Validators.required]


    });
  }
  resetQuickReplyForm() {
    this.quickReplyForm.reset();
  }
  createNewsForm() {
    this.newsForm = this.fb.group({
      link: ['', Validators.required],

    })
  }

  changeAddQuickStatus() {
    this.addQuickStatus = !this.addQuickStatus;
    this.resetQuickReplyForm();
  }
  getBLockNameById(blockId) {
  
    this.PluginService.getBlock(blockId).subscribe(res => {
       console.log(res)
    })
  }
  addQuickReply() {
    var newQuickReply = {
      name: this.quickReplyForm.get('name').value,
      blockname: this.quickReplyForm.get('blockname').value,
      botId: this.botID
    }
    this.PluginService.addQuickReply(this.block[0]._id, newQuickReply).subscribe(res => {
      if (res.success == true) {

        this.PluginService.getAllBlock(this.botID).subscribe((res) => {
          this.blockOfPlugin = res.blocks
          this.getBlock(this.block[0]._id)
        })

      }
    })
  }

  deleteQuickReply(quickReplyID) {
    this.PluginService.deleteQuickReply(this.block[0]._id, quickReplyID).subscribe(res => {
      if (res.success == true) {

        this.PluginService.getAllBlock(this.botID).subscribe((res) => {
          this.blockOfPlugin = res.blocks
          this.getBlock(this.block[0]._id)
        })

      }
    })
  }
  addNews() {

    var link = this.newsForm.get('link').value

    this.PluginService.addNews(this.block[0]._id, link).subscribe(res => {
      if (res.success == true) {
        this.hideNews();
        this.PluginService.getAllBlock(this.botID).subscribe((res) => {
          this.blockOfPlugin = res.blocks
          this.getBlock(this.block[0]._id)
        })

      }
    })

  }
  deleteNews(newsId) {
    this.PluginService.deleteNews(this.block[0]._id, newsId).subscribe(res => {
      if (res.success == true) {

        this.PluginService.getAllBlock(this.botID).subscribe((res) => {
          this.blockOfPlugin = res.blocks
          this.getBlock(this.block[0]._id)
        })

      }
    })

  }
  deleteBlock(blockId, delTokenIdol, delTokenTeam) {

    this.PluginService.deleteBlock(this.botID, blockId).subscribe(res => {
      if (res.success == true) {
        this.PluginService.getAllBlock(this.botID).subscribe((res) => {
          this.blockOfPlugin = res.blocks
          this.blockActive = false;


        })
      }
    })
    if (delTokenIdol) {
      this.deleteImage(delTokenIdol)
    }
    else {
      this.deleteImage(delTokenTeam)
    }

  }
  setMenu() {
 
    this.configService.setMenu(this.botID).subscribe(res=>{
      if(res.success==true){
       
      }
    
    })
  }
}
