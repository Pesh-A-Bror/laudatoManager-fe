import { AutofillMonitor } from '@angular/cdk/text-field';
import { Component } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {    
  constructor(private _fb:FormBuilder,private _autofill: AutofillMonitor, private _router:Router) {
    this.loginForm = this._fb.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        })
  }
  userNameAutofilled!: boolean;
  passwordAutofilled!: boolean;
  loginForm:FormGroup = new FormGroup({});


  get username(){
    return this.loginForm.get('username')
  }
  get password(){
    return this.loginForm.get('password')
  }
  submitLogin(value:any){
    console.log('loginForm', value);
    this._router.navigate(['']);
  }




}
