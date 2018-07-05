import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userName;

  constructor(private loginService: LoginService, private router: Router) {
    this.userName = localStorage.getItem('account').replace(/"/g, '');
  }

  ngOnInit() {
  }

  logOut() {
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }
}
