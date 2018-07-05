import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from './../../service/config/config.service';
@Component({
  selector: 'app-webhook',
  templateUrl: './webhook.component.html',
  styleUrls: ['./webhook.component.css']
})
export class WebhookComponent implements OnInit {

  formWebhook: FormGroup;
  type = "webhookurl";
  webhookEdit: any = [];
  webhookurl
  Existsurl: boolean
  constructor(
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService
  ) {
    this.getWebhookUrl();
  }

  ngOnInit() {
  }
  getWebhookUrl() {
    this.configService.getType(this.type).subscribe(data => {
      if (!data.success) {
        this.webhookurl = ""
      } else {
        this.Existsurl = true
        this.webhookEdit = data.configures;
        this.webhookurl = this.webhookEdit.content[0].url
      }
    });
  }
  saveWebhookUrl(event) {
    if (event.currentTarget.value.length > 0) {
      if (this.Existsurl != true) {
        const webhookUrl = {
          url: event.currentTarget.value
        }
        this.configService.addWebhookUrl(webhookUrl).subscribe(data => {
          if (data.success == true) {
            this.getWebhookUrl()
          }
        });
      }else{
        const webhook = {
          type: this.type,
          newWebhookUrl: event.currentTarget.value
        }
        this.configService.editWebhookUrl(webhook).subscribe(data => {
          if (data.success == true) {
            this.getWebhookUrl()
          }
        });
      }
    }
  }
}


