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

import {AngularFireStorage} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { last, concatMap } from 'rxjs/operators';
import { UiService } from '../ui-service.service';

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
  downloadURL:any;

  ////
  video:boolean=true;
  audio:boolean=true;
  chat:boolean=true;

  uploadPercent$ : Observable<number>;
 

 

  constructor(private authService: AuthService,
    private roomService: RoomService,
    private uiService:UiService,
    private _fb: FormBuilder,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.authService.userSubject$.subscribe((user: any) => {
      
      this.user = user;
      this.userId = user.uid;
      this.displayName = user.displayName;
      this.userGender = user.gender;
      this.photoURL = user.photoURL;

      if (user.type == 'therapist') {
        this.roomService.getTherapistAllInfoById(user.uid)
          .subscribe(therapist => {
            
            this.user = therapist
            this.education = therapist.education;
            this.expertiseT = therapist.expertise;
            this.uzmanlik = therapist.uzmanlik;
            this.meslekOzet = therapist.meslekOzet;

            if(therapist.video){
              this.video=therapist.video;
              this.audio=therapist.audio;
              this.chat=therapist.chat;
            }
          })
      }


      this.askHelp$ = this.roomService.getAskHelp();


    })//user
  }





  updateTherapist() {


    this.roomService.updateTherapistInfo(this.userId, this.meslekOzet, this.expertiseT, this.uzmanlik, this.education).then(() => {
      this.uiService.showSnackbar('Güncelleme İşlemi yapıldı','Başarılı',3000)
      6
    });

  }
 
  updateUser() { 
    let obj: any = new Object();

    if (this.displayName) obj.displayName = this.displayName;
    if (this.userGender) obj.gender = this.userGender;
    
    console.log(obj);
    if (obj != {}) {
      this.roomService.updateUserAllInfo(this.userId, obj).then(() => {
       
        this.uiService.showSnackbar('Güncellemey İşlemi yapıldı','Başarılı',3000)
      })
 
    }

  }


  updateSeansType(){

    let data={
      video:this.video,
      audio:this.audio,
      chat:this.chat
    }

    this.roomService.updateTherapistInfoAnyData(this.userId,data).then(()=>{
      this.uiService.showSnackbar('Güncelleme İşlemi yapıldı','Başarılı',3000)
    })

  }
   
  uploadFile(event){
 
    const file:File=event.target.files[0];
    const filePath=`profilePhotos/${this.userId}/${file.name}`;

   const task= this.storage.upload(filePath,file);

   this.uploadPercent$=task.percentageChanges();

    task.snapshotChanges().pipe(
      last(),
      concatMap(()=>this.storage.ref(filePath).getDownloadURL())
    ).subscribe(downloadURL=>{
      this.downloadURL=downloadURL
      console.log('downloadURL',this.downloadURL)
    });
    

  }




}
