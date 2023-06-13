import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Hide the navigation component when the login component initializes
    document.getElementById('myTopnav')!.style.display = 'none';
  }

}
