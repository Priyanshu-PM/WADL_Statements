import { Component, OnInit } from '@angular/core';
import { SignUpModel } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  users: SignUpModel = new SignUpModel();
  constructor(private router: Router) {}

  ngOnInit(): void {
      const localUsers = localStorage.getItem("loggedUser");
      console.log("logged user", localUsers);
      this.users = localUsers != null ? JSON.parse(localUsers) : [];

      console.log("users : ", this.users);     
  }
}
