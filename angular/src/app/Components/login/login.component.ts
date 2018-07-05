import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginService } from '../../service/login/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlashMessagesService } from 'angular2-flash-messages';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  Username: String;
  Password: String;
  Name: String = '';
  LoginSuccess: boolean;
  progressing = false 
  userName;

  form: FormGroup;
  loginform: FormGroup;
  messageClass;
  message;
  progressBar = false;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private flassMessage: FlashMessagesService,
    private formBuilder: FormBuilder
  ) {
    this.isLogin();
    this.fpForm();
    this.loginForm();
  }
  fpForm() {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      confirm: ['', Validators.required],
    });
  }
  loginForm(){
    this.loginform = this.formBuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  forgotPassword() {
    this.form.disable();
    this.progressBar = true;
    var email = this.form.get('email').value
    var confirm = this.form.get('confirm').value
    if(confirm === "CONFIRM"){
      this.loginService.forgotPassword(email).subscribe(data => {
        if (!data.success) {
          this.progressBar = false;
          this.form.enable();
          this.messageClass = 'alert alert-danger';
          this.message = data.message;
          setTimeout(() => {
            this.form.reset();
            this.messageClass = null;
            this.message = null;
          }, 1000);
        } else {
          this.form.enable();
          this.progressBar = false;
          this.messageClass = 'alert alert-success';
          this.message = data.message;
          setTimeout(() => {
            this.form.reset();
            this.messageClass = null;
            this.message = null;
            $('#fp').modal('hide')
          }, 2000);
  
        }
      });
    }else{
      this.progressBar = false;
      this.form.enable();
      this.messageClass = 'alert alert-danger';
      this.message = "CONFIRM does not match!!!!";
      setTimeout(() => {
        this.form.reset();
        this.messageClass = null;
        this.message = null;
      }, 1000);
    }
   
  }
  getAllAc
  @Output() username = new EventEmitter<string>();
  emitUsername(username) {
    this.userName = username;
    this.username.emit(this.userName);
  }

  ngOnInit() {
  }

  isLogin() {
    if (this.loginService.loggedIn()) {
      this.Name = JSON.parse(localStorage.getItem('account')).name;
    }
  }

  onSubmitLogin() {
    this.progressing = true;
    const account = {
      username: this.Username,
      password: this.Password
    };
    // console.log(account);
    this.loginService.loginAccount(account).subscribe(data => {
      if (data.success) {
        this.loginService.storeAccountData(data.token, data.account);
        this.router.navigate(['/']);
        this.LoginSuccess = true;
        this.userName = data.account.name;
        this.progressing = false;

      } else {
      //  this.flassMessage.show(data.log, { cssClass: 'alert-danger', timeout: 500 });
        this.router.navigate(['/login']);
        this.LoginSuccess = false;
        this.progressing = false;
       
      }
    });
  }

  // logOut() {
  //   this.loginService.logOut();
  //   this.router.navigate(['/login']);
  // }

  // cancel() {
  //   this.router.navigate(['/']);
  // }
}
