import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TherapistCardComponent } from '../therapist-card/therapist-card.component';
import { RoomService } from '../services/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seans-payment',
  templateUrl: './seans-payment.component.html',
  styleUrls: ['./seans-payment.component.css']
})
export class SeansPaymentComponent implements OnInit {

  paymentForm:FormGroup;
  isLinear = false;
  messageForm: FormGroup;
  seansType:string="video";
  bilgi:string;
  constructor(private _formBuilder: FormBuilder,
    private roomService:RoomService,
    private router:Router ,
    public dialogRef: MatDialogRef<TherapistCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
    ) {}

  ngOnInit() {

    console.log(this.data)

    this.messageForm = this._formBuilder.group({
      konu: ['', Validators.required],
      message:['',Validators.required]
    });

    this.paymentForm=new FormGroup({
      cardNumber:new FormControl('',{
        validators:[
          Validators.required
      ]}),
      cardName:new FormControl('',{
        validators:[
          Validators.required
      ]}),
      cardCVV:new FormControl('',{
        validators:[
          Validators.required
      ]}),
      message:new FormControl('',{
        validators:[
          Validators.required
      ]})
      
    });
 

  }
  
  onSubmitPayment(){
    
    let a = this.paymentForm.value;
    let question =this.messageForm.value;
  
    console.log(a);
    console.log(question);
    console.log(this.bilgi);
    console.log(this.seansType);
    console.log(this.data.user);
    console.log(this.data.therapist);

    this.roomService.creatRoom(this.data.therapist,this.data.user,this.seansType,this.bilgi,question)
    .then((seansRef:any)=>{
      this.router.navigate([seansRef.seansType,seansRef.roomRef,seansRef.seansId]);
      
    });

    //this.router.navigate([seansType,roomRef,seansId]);  

    // paymnetfromhere



 
   }
   

}
 