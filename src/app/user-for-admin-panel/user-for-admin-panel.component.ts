import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoomService } from '../services/room.service';
//import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-for-admin-panel',
  templateUrl: './user-for-admin-panel.component.html',
  styleUrls: ['./user-for-admin-panel.component.css']
})
export class UserForAdminPanelComponent implements OnInit {
  userType;
  userTypeFire;
  userId;
  askHelp$:any;
  expertiseT;
  uzmanlik;
  education;
  meslekOzet;
  therapistInfo;
  displayName;
  alert=false;
  constructor(
    private roomService: RoomService,
    public dialogRef: MatDialogRef<UserForAdminPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
 
  ngOnInit() {
    this.userId=this.data.user.uid;
    this.userType=this.data.user.type;
    this.userTypeFire=this.data.user.type;
    this.displayName=this.data.user.displayName;

    
  console.log(this.data)   
    if(this.userType=="therapist"){
      this.roomService.getTherapistAllInfoById(this.userId).subscribe((therapistInfo:any)=>{
        this.therapistInfo=therapistInfo;
        this.education=therapistInfo.education;
        this.expertiseT=therapistInfo.expertise;
        this.uzmanlik=therapistInfo.uzmanlik;
        this.meslekOzet=therapistInfo.meslekOzet;
        
      })
    }

  this.askHelp$ = this.roomService.getAskHelp();

  }

  updateUser(){
    let obj:any = new Object();

    if(this.displayName) obj.displayName=this.displayName;
    if(this.userType) obj.type=this.userType;
    console.log(obj);
    this.roomService.updateUserAllInfo(this.userId,obj).then(()=>{
      console.log('yyyyy')
      this.roomService.createDeleteTherapist(this.userId,obj)
      this.userTypeFire=obj.type
      this.alert=true;
      console.log("kayıt yapıldı")
    })
     

  }

  updateTherapist(){
    console.log(this.userType)
    console.log(this.expertiseT)
    console.log(this.uzmanlik)
    console.log(this.education)

    this.roomService.updateTherapistInfo(this.userId,this.meslekOzet,this.expertiseT,this.uzmanlik,this.education).then(()=>{
      console.log("kayıt işlemi yapıldı")
      this.dialogRef.close();
    });
   
  }


}
