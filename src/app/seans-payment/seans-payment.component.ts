import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TherapistCardComponent } from '../therapist-card/therapist-card.component';
import { RoomService } from '../services/room.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material';
import { switchMap, map, take, first, filter, mergeMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { CheckoutService } from '../checkoutService/checkout-service';
import { CheckoutSession } from '../models/CheckoutSession-model';
import { UiService } from '../ui-service.service';


@Component({
  selector: 'app-seans-payment',
  templateUrl: './seans-payment.component.html',
  styleUrls: ['./seans-payment.component.css']
})
export class SeansPaymentComponent implements OnInit,AfterViewInit {


  isLinear = false;
  messageForm: FormGroup;
  therapist;
  seansType: any;
  isPassiveVideo: Boolean = true;
  bilgi: string;
  displayName = "";
  gender = "";
  matching;
  isAppointment;
  appointmentForm;
  waitOneSecond = true;
  seansPrice: any;
  waiting=false;

  minDate;
  maxDate;
  AppointmentHours$: any;
  constructor(private _formBuilder: FormBuilder,
    private authService: AuthService,
    private roomService: RoomService,
    private checkoutService: CheckoutService,
    private uiService:UiService,
    private router: Router,
    public dialogRef: MatDialogRef<SeansPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    
  }

  ngOnInit() {

    console.log(this.data)
    //disable if therapist not online

    this.therapist=this.data.therapist;  
    if (this.data.therapist.status == 'online' || this.isAppointment) this.isPassiveVideo = false; 
    
    this.roomService.getSeansPrice().subscribe(seansPrices => {
      //console.log(seansPrices);
      this.seansPrice = seansPrices[0];

      this.isAppointment = this.data.appointment
 
      if (this.data.therapist.status == 'online' || this.isAppointment) {
        if (this.therapist.video) {
          this.seansType = this.seansPrice.video;
        } else if (this.therapist.audio) {
          this.seansType = this.seansPrice.audio;
        } else if (this.therapist.chat) {
          this.seansType = this.seansPrice.chat;
        } else {
          this.seansType = this.seansPrice.message;
        }
        this.isPassiveVideo = false
      } else { this.seansType = this.seansPrice.message; }

      if (this.isAppointment) this.appointmentFormFunction();

    });
 

    this.matching = this.data.user.matching;
    this.messageForm = this._formBuilder.group({
      konu: ['', Validators.required],
      message: ['', Validators.required]
    });



  }

  ngAfterViewInit() {

    

  }

  appointmentFormFunction() {
    this.appointmentForm = this._formBuilder.group({
      appointmentDate: [moment(), Validators.required],
      appointmentHour: ['', Validators.required]
    });

    const currentYear = new Date().getFullYear();
    let minCurrentDate = new Date();
    this.minDate = minCurrentDate;
    this.maxDate = new Date(currentYear + 1, 11, 31);

    let dateNow = moment().format('DD/MM/YYYY')
    let therapistId = this.data.therapist.uidtherapist

    this.AppointmentHours$ = this.roomService.getAppointmentHours(therapistId, dateNow);

  }

 

  appointmentAddEventDatepicker(type: string, event: MatDatepickerInputEvent<Date>) {
    this.waitOneSecond = false;
    //console.log(this.appointmentForm.get('appointmentDate').valid)
    //console.log(this.appointmentForm.value.appointmentDate.format('DD/MM/YYYY'))
    //console.log(this.appointmentForm.value.appointmentHour)

    let dateSelected = this.appointmentForm.value.appointmentDate.format('DD/MM/YYYY')
    let therapistId = this.data.therapist.uidtherapist
    this.appointmentForm.controls['appointmentHour'].reset()

    this.AppointmentHours$ = this.roomService.getAppointmentHours(therapistId, dateSelected);

    setTimeout(() => { this.waitOneSecond = true }, 1000)
    

  }
 
  seansTypeChange() {
    let seansName = this.seansType.name;
    if (seansName != 'message') this.messageForm.reset();
    if(this.isAppointment) this.appointmentForm.reset();
  }

  async onSubmitPayment() {

    let question = this.messageForm.value;
    let uidUser = this.data.user.uid
    let uidTherapist = this.data.therapist.uid;
    let statusTherapist
    this.waiting=true;
    let appointmentData=undefined;
    let IdWorkingTime=undefined;
  



    // console.log(question);
    // console.log(this.bilgi);
    // console.log(this.seansType);
    // console.log("display>>>>>", this.displayName);
    // console.log("gender>>>", this.gender);

    if (!this.matching) {
      this.roomService.updateUserInfo(uidUser, this.displayName, this.gender);
    }

    await this.authService.getAvaibleTherapist(uidTherapist).pipe(take(1)).toPromise().then((therapist: any) => {
      statusTherapist = therapist.status;
    })


    if (statusTherapist != 'online' && this.seansType.name != 'message' && !this.isAppointment) {
      //console.log('therapist meşgul');
      this.uiService.showSnackbar('Therapist şuan meşgul','Meşgul',3000)
      this.waiting=false;
      return;
    } 

    this.roomService.creatRoom(this.data.therapist, this.data.user, this.seansType.name, this.bilgi, question, this.isAppointment)
      .then((seansRef: any) => {//{seansType: "video", roomRef: "pUZBn1trIBW87TJYlJZ1", seansId: "CbwGmOBpWRhVs83In5pl"}

 
        if (this.isAppointment) {
          appointmentData= this.createAppointmentData(seansRef);
          IdWorkingTime= this.getReservedWorkingTimeData();
        }

        let seansType =this.seansType

       let dataForCharge ={seansRef, uidTherapist, seansType ,appointmentData,IdWorkingTime,}

       this.checkoutService.setChargeInfo(dataForCharge);

       this.router.navigate(['payment']);
       this.dialogRef.close();

        
      });


  }

  createAppointmentData(seansRef: any) {
    let appointmentDate = this.appointmentForm.value.appointmentDate.format('DD/MM/YYYY');
    let appointmentHour = this.appointmentForm.value.appointmentHour
    let tId = this.data.therapist.uidtherapist;
    let userId = this.data.user.uid;
    let appointmentData = {
      appointmentDate,
      hour: appointmentHour.workingHour,
      timeStamp: appointmentHour.timeStamp,
      timeRange: appointmentHour.timeRange,
      roomId: seansRef.roomRef,
      seansId: seansRef.seansId,
      seansType: seansRef.seansType,
      userId: userId,
      tId: tId,
    }
    return appointmentData
  }

  getReservedWorkingTimeData() {
    let appointmentHour = this.appointmentForm.value.appointmentHour;
    let IdWorkingTime = appointmentHour.Id
    return IdWorkingTime;   
   
  }


}
