import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  registerForm:FormGroup;
 

  constructor(private authService:AuthService,
              private dialogRef: MatDialogRef<LoginComponent >
              ) { }
 
  ngOnInit() {

    this.loginForm=new FormGroup({
      email:new FormControl('',{
        validators:[
          Validators.required,
          Validators.email
      ]}),
      password: new FormControl('',{
        validators:[
          Validators.required,
          Validators.minLength(6)
      ]})
    });

    this.registerForm=new FormGroup({
      emailRegister:new FormControl('',{
        validators:[
          Validators.required,
          Validators.email
      ]}),
      passwordRegister: new FormControl('',{
        validators:[
          Validators.required,
          Validators.minLength(6)
      ]})
    });

   
    //setInterval(()=>{this.dialogRef.close();},3000)
    
    
    
  }

  onSubmitRegister(){

    this.authService.registerUser({
      email:this.registerForm.value.emailRegister,
      password:this.registerForm.value.passwordRegister
    }).then(result=>{ 
      console.log(result);
      let data ={
        uid:result.user.uid,
        email:result.user.email,
        matching:false
      }
      this.authService.saveuser(data);
      this.dialogRef.close(result.user.uid);
    })
    .catch(error=>{
        console.log(error);  
    });

  }


  onSubmitLogin(){

    this.authService.login({
      email:this.loginForm.value.email, 
      password:this.loginForm.value.password
    }).then(result=>{
      this.dialogRef.close(result);
    })
    .catch(error=>{
        console.log(error);
    });

  }



}
