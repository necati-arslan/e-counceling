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

  loginForm: FormGroup;
  registerForm: FormGroup;
  user;
  forgotPassword = false;

  constructor(private authService: AuthService,
    private dialogRef: MatDialogRef<LoginComponent>
  ) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(6)
        ]
      })
    });

    this.registerForm = new FormGroup({
      emailRegister: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ]
      }),
      passwordRegister: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(6)
        ]
      })
    });


    //setInterval(()=>{this.dialogRef.close();},3000)

  }

  onSubmitRegister() {

    this.authService.registerUser({
      email: this.registerForm.value.emailRegister,
      password: this.registerForm.value.passwordRegister
    }).then(result => {
      console.log(result);
      let errMessage = document.querySelector('#errMessageR');
      if (result == 'auth/email-already-in-use') {
        errMessage.innerHTML = 'Kullanımda olan bir email yazdınız!';
        return;
      }
      this.dialogRef.close(result);
    })

  }


  onSubmitLogin() {

    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }).then(result => {
      this.dialogRef.close(result); 
    })
      .catch(error => {
        console.log(error);
        console.log(error.code);
        let errMessage = document.querySelector('#errMessage');
        if (error.code == 'auth/wrong-password') {
          errMessage.innerHTML = 'Yanlış bir şifre girdiniz';
        } else if (error.code == 'auth/user-not-found') {
          errMessage.innerHTML = 'Kullanıcı ismi bulunamadı';
        }
      });

  }

  loginGoogle(){

    this.authService.GoogleAuth().then(result => {
      console.log(result)
      this.dialogRef.close(result);
    })

  }

  loginFacebook(){
    this.authService.facebookAuth().then(result => {
      this.dialogRef.close(result);
    })

  }

  ForgotPasswordSend(email) {

    let checkMail = this.validateEmail(email);
    let message;
    message = document.querySelector('#forgotPasswordMessage');
    if (!checkMail) {
      message.innerHTML = "Doğru olmayan bir mail girdiniz!"
      message.style.color = "red";
      return;
    }
    this.authService.ForgotPassword(email).then(result => {
      console.log(result)
      if (result == 'auth/user-not-found') {
        message.innerHTML = email + '<br> İsimli kullanıcı bulunamadı';
        message.style.color = "red";
        return;
      }

      message.innerHTML = result;
      message.style.color = "green";
      setTimeout(() => {
        this.forgotPassword = false
      }, 3000);
    })

  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }




}
