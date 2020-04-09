import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { dateValidator } from '../custom validator/date.validator';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],

})
export class ProfileEditComponent implements OnInit {

  askHelp$;
  user;
  displayName;
  userGender;
  photoURL;
  meslekOzet;
  expertiseT;
  uzmanlik;
  education;
  userId;
  alert = false;
 

 

  constructor(private authService: AuthService,
    private roomService: RoomService,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.authService.userSubject$.subscribe((user: any) => {
      console.log(user)
      this.user = user;
      this.userId = user.uid;
      this.displayName = user.displayName;
      this.userGender = user.gender;
      this.photoURL = user.photoURL;

      if (user.type == 'therapist') {
        this.roomService.getTherapistAllInfoById(user.uid)
          .subscribe(therapist => {
            console.log('therapist>>>>', therapist);
            this.user = therapist
            this.education = therapist.education;
            this.expertiseT = therapist.expertise;
            this.uzmanlik = therapist.uzmanlik;
            this.meslekOzet = therapist.meslekOzet;
          })
      }


      this.askHelp$ = this.roomService.getAskHelp();


    })//user
  }





  updateTherapist() {


    this.roomService.updateTherapistInfo(this.userId, this.meslekOzet, this.expertiseT, this.uzmanlik, this.education).then(() => {
      console.log("kayıt işlemi yapıldı");
      let message: any = document.querySelector('#therapistMessage')
      message.innerHTML = "kayıt işlemi yapıldı";
      message.style.color = "green";

    });

  }

  updateUser() {
    let obj: any = new Object();

    if (this.displayName) obj.displayName = this.displayName;
    if (this.userGender) obj.gender = this.userGender;
    console.log(obj);
    if (obj != {}) {
      this.roomService.updateUserAllInfo(this.userId, obj).then(() => {
        this.alert = true;
        setTimeout(() => {
          this.alert = false;
        }, 4000);
        console.log("kayıt yapıldı");
      })

    }

  }



  





}
