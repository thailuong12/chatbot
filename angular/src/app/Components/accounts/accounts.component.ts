import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../service/account/account.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  form: FormGroup;

  showAddForm = false;
  showListForm = true;
  showButtonAdd = true;
  messageClass;
  message;
  processing = false;
  accountPosts;

  // delete
  messageClassDelete;
  messageDelete;
  _processing = true;
  foundAccount = true;
  deleteID;
  //edit
  showEditForm = false;
  formEdit: FormGroup;
  messageEdit;
  messageEditClass;
  account = {
    name: String,
    username: String,
    email: String
  };
  processingEdit = false;
  editID;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
  ) {
    this.createForm();
    this.editForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        this.validateUsername
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.mathchingPasswords('password', 'confirm') });
  }
  editForm() {
    this.formEdit = this.formBuilder.group({
      name: ['', Validators.required],
      username:['', Validators.required],
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        this.validateEmail
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(35),
        this.validatePassword
      ])],
      confirm: ['', Validators.required]
    }, { validator: this.mathchingPasswords('password', 'confirm') })
  }
  // Validate Field
  validateEmail(controls) {
    const regExp = new
      // tslint:disable-next-line:max-line-length
      RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateEmail': true };
    }

  }
  validateUsername(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validateUsername': true };
    }
  }
  validatePassword(controls) {
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,35}$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'validatePassword': true };
    }
  }
  mathchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value) {
        return null;
      } else {
        return { 'mathchingPasswords': true };
      }
    };
  }

  // Function to submit form
  onRegisterSubmit() {
    this.processing = true;
    const account = {
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };
    this.accountService.registerAccount(account).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message; 
        setTimeout(() => {
          this.getAllAccount();
          this.resetForm();
        }, 1000);
      }
    });
  }
  getAllAccount() {
    this.accountService.getAllAccount().subscribe(data => {
      this.accountPosts = data.accounts;
    });
  }
  AddNewAccountForm() {
    this.showAddForm = true;
    this.showButtonAdd = false;
    this.showListForm = false;
  }

  editAccountForm(id) {
    this.showEditForm = true;
    this.showButtonAdd = false;
    this.showListForm = false;
    this.formEdit.controls['username'].disable();
    this.editID = id
    this.accountService.getSingleAccount(id).subscribe(data => {
      if (!data.success) {
        this.messageEditClass = 'alert alert-danger';
        this.messageEdit = data.message;
      } else {
        this.account = data.account;
      }
    });
  }
  updateAccountSubmit() {
    const account = {
      name: this.formEdit.get('name').value,
      email: this.formEdit.get('email').value,
      password: this.formEdit.get('password').value
    }
    this.accountService.editAccount(account, this.editID).subscribe(data => {
      if (!data.success) {
        this.messageEditClass = 'alert alert-danger';
        this.messageEdit = data.message;
      } else {
        this.messageEditClass = 'alert alert-success';
        this.messageEdit = data.message;
        setTimeout(() => {
          this.getAllAccount();
          this.resetForm();
        }, 1000);
      }
    });
  }

  deleteAccountForm(id) {
    this.deleteID = id;
  }
  clodeModal() {
    this.messageClassDelete = null;
    this.messageDelete = null;
    this._processing = true;
    $('#myModal').modal('hide')
  }
  deleteAccount() {
    this._processing = false;
    this.accountService.deleteAccount(this.deleteID).subscribe(data => {
      if (!data.success) {
        this.messageClassDelete = 'alert alert-danger';
        this.messageDelete = data.message;
      } else {
        this.messageClassDelete = 'alert alert-success';
        this.messageDelete = data.message;
        this.getAllAccount();
        setTimeout(() => {
          this.getAllAccount();
          this.clodeModal();
        }, 1000);
      }
    });
  }
  resetForm(){
    this.form.reset();
    this.formEdit.reset();
    this.messageClass = null;
    this.message = null;
    this.messageEditClass = null;
    this.messageEdit = null;
    this.showAddForm = false;
    this.showEditForm = false;
    this.showButtonAdd = true;
    this.showListForm = true;
  }
  ngOnInit() {
    this.getAllAccount();
  }
}
