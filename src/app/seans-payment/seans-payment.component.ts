import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TherapistCardComponent } from '../therapist-card/therapist-card.component';
import { RoomService } from '../services/room.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { switchMap, map, take, first, filter, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-seans-payment',
  templateUrl: './seans-payment.component.html',
  styleUrls: ['./seans-payment.component.css']
})
export class SeansPaymentComponent implements OnInit {

  paymentForm: FormGroup;
  isLinear = false;
  messageForm: FormGroup;
  seansType: string;
  isPassiveVideo:Boolean=true;
  bilgi: string;
  displayName = "";
  gender = "";
  matching;
  isAppointment;
  appointmentForm;
  waitOneSecond=true;

  minDate;
  maxDate;
  AppointmentHours$: any;
  constructor(private _formBuilder: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    public dialogRef: MatDialogRef<SeansPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    console.log(this.data)
    //disable if therapist not online
    this.isAppointment=this.data.appointment
    if (this.data.therapist.status == 'online' || this.isAppointment) {
      this.seansType = "video"
      this.isPassiveVideo=false
    }else{this.seansType="message";}


    this.matching = this.data.user.matching;
    this.messageForm = this._formBuilder.group({
      konu: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.paymentForm = new FormGroup({
      cardNumber: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      cardName: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      cardCVV: new FormControl('', {
        validators: [
          Validators.required
        ]
      }),
      message: new FormControl('', {
        validators: [
          Validators.required
        ]
      })

    });


    if (this.isAppointment)this.appointmentFormFunction();


  }

  appointmentFormFunction(){
    this.appointmentForm = this._formBuilder.group({
      appointmentDate: [moment(), Validators.required],
      appointmentHour:['',Validators.required]
    });

    const currentYear = new Date().getFullYear();
    var minCurrentDate = new Date();
    this.minDate = minCurrentDate;
    this.maxDate = new Date(currentYear + 1, 11, 31);

   let dateNow= moment().format('DD/MM/YYYY')
   let therapistId= this.data.therapist.uidtherapist

   this.AppointmentHours$= this.roomService.getAppointmentHours(therapistId,dateNow);

  }

  appointmentSubmit(){

  }

  appointmentAddEventDatepicker(type: string, event: MatDatepickerInputEvent<Date>) {
     this.waitOneSecond=false;
    console.log(this.appointmentForm.get('appointmentDate').valid)
    console.log(this.appointmentForm.value.appointmentDate.format('DD/MM/YYYY'))
    console.log(this.appointmentForm.value.appointmentHour) 

    let dateSelected= this.appointmentForm.value.appointmentDate.format('DD/MM/YYYY')
   let therapistId= this.data.therapist.uidtherapist
   this.appointmentForm.controls['appointmentHour'].reset()

   this.AppointmentHours$= this.roomService.getAppointmentHours(therapistId,dateSelected);

   setTimeout(()=>{this.waitOneSecond=true},1000)
    // if (!this.workingTimeForm.get('workingDate').valid) return;
    // let workingDate = this.workingTimeForm.value.workingDate.format('DD/MM/YYYY')
    // this.roomService.getWorkingHours(this.userId, workingDate).subscribe(workingHours => {
    //   this.workingTimeForm.controls['workingHours'].setValue(workingHours)
    // })

  }

  onSubmitPayment() {

    let a = this.paymentForm.value;
    let question = this.messageForm.value;
    let uidUser = this.data.user.uid
    
    
    

    console.log(a);
    console.log(question);
    console.log(this.bilgi);
    console.log(this.seansType);
    console.log("display>>>>>", this.displayName);
    console.log("gender>>>", this.gender);
  
    if (!this.matching) {
      this.roomService.updateUserInfo(uidUser, this.displayName, this.gender);
    }
 
    this.roomService.creatRoom(this.data.therapist, this.data.user, this.seansType, this.bilgi, question,this.isAppointment)
      .then((seansRef: any) => {//{seansType: "video", roomRef: "pUZBn1trIBW87TJYlJZ1", seansId: "CbwGmOBpWRhVs83In5pl"}

      if(this.isAppointment){
        this.createAppointment(seansRef);
        this.updateReservedWorkingTimeById();
      }
        
       
        if (seansRef.seansType == 'video' || seansRef.seansType == 'audio' || seansRef.seansType == 'chat') {
          this.router.navigate(['chat', seansRef.roomRef, seansRef.seansId]);
        }
       
        if (seansRef.seansType == 'message') this.router.navigate(['questiontotherapist']);
        
        this.dialogRef.close();
      });

    //this.router.navigate([seansType,roomRef,seansId]);  

    // paymnetfromhere




  }

  createAppointment(seansRef:any){
    let appointmentDate=this.appointmentForm.value.appointmentDate.format('DD/MM/YYYY');
    let appointmentHour =this.appointmentForm.value.appointmentHour
    let tId=this.data.therapist.uidtherapist;
      let userId=this.data.user.uid; 
      let appointmentData={
        appointmentDate,
        hour:appointmentHour.workingHour,
        timeStamp:appointmentHour.timeStamp,
        timeRange:appointmentHour.timeRange,
        roomId:seansRef.roomRef,
        seansId:seansRef.seansId,
        seansType:seansRef.seansType,
        userId:userId,
        tId:tId
      }
      this.roomService.createAppointment(appointmentData);
  }

  updateReservedWorkingTimeById(){
    let appointmentHour =this.appointmentForm.value.appointmentHour;
    let IdWorkingTime=appointmentHour.Id
    let data={reserved:true}
    this.roomService.updateReservedWorkingTimeById(IdWorkingTime,data);
  }


}
