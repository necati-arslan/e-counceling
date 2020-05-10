import {  OnInit,Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef } from '@angular/core';

  import { NgForm } from '@angular/forms';
import { CheckoutService } from '../checkoutService/checkout-service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UiService } from '../ui-service.service';





@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit,AfterViewInit, OnDestroy {
  
  @ViewChild('cardnumber',{static: false}) cardnumber: ElementRef;
 
  @ViewChild('cardcvc',{static: false}) cardcvc: ElementRef;

  @ViewChild('cardexpiry',{static: false}) cardexpiry: ElementRef;


  cvc: any;
  cardNumber:any;
  cardExpiry:any;

  cardHandler = this.onChange.bind(this);
  cvcError;
  cardNumberError;
  cardExpiryError;
  cardCvcError;
  error: string;

  subscription:any;
  therapist;
  seansType;
  chargeInfo;

  checkoutButton=false;

  constructor(private cd: ChangeDetectorRef,
              private checkoutService:CheckoutService,
              private authService:AuthService,
              private uiService:UiService,
              private router:Router          
    ) {}

  ngOnInit() {
    
    this.subscription=this.checkoutService.chargeInfo$.subscribe(chargeInfo=>{
      console.log('chargeInfo>>>',chargeInfo);
      if(!chargeInfo){
        this.router.navigateByUrl('/matching');
        return;
      }
      this.chargeInfo=chargeInfo;
      this.seansType=chargeInfo.seansType;
      let uidTherapist=chargeInfo.uidTherapist;
      this.authService.getUserById(uidTherapist).subscribe(therapist=>this.therapist=therapist);

    })
 
    

  }


  ngAfterViewInit() {
    const style = {
      base: {
        lineHeight: '24px',
        fontSize: '18px',
        '::placeholder': {
          color: '#DCDFE6'
        }
      }
    };
    this.cvc = elements.create('cardCvc',{ style });
    this.cardNumber=elements.create('cardNumber',{ style });
    this.cardExpiry=elements.create('cardExpiry',{ style });
    
    

    
    
    this.cvc.mount(this.cardcvc.nativeElement);
    this.cardNumber.mount(this.cardnumber.nativeElement);
    this.cardExpiry.mount(this.cardexpiry.nativeElement);

    

    this.cvc.addEventListener('change', this.cardHandler);
    this.cardNumber.addEventListener('change', this.cardHandler);
    this.cardExpiry.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.cvc.removeEventListener('change', this.cardHandler);
    this.cvc.destroy();
    this.cardNumber.removeEventListener('change', this.cardHandler);
    this.cardNumber.destroy();
    this.cardExpiry.removeEventListener('change', this.cardHandler);
    this.cardExpiry.destroy();

    this.subscription.unsubscribe();
  }

  onChange( error ) {

    this.cardNumberError=(error.error && error.elementType=='cardNumber') ? error.error.message : null;
    this.cardExpiryError=(error.error && error.elementType=='cardExpiry') ? error.error.message : null;
    this.cardCvcError=(error.error && error.elementType=='cardCvc') ? error.error.message : null;

    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {

    let uidTherapist=this.chargeInfo.uidTherapist;
    let statusTherapist;
    let isAppointment=this.chargeInfo.appointmentData?true:false;

    await this.authService.getAvaibleTherapist(uidTherapist).pipe(take(1)).toPromise().then((therapist: any) => {
      statusTherapist = therapist.status;
    })

    //console.log(statusTherapist);

    if (statusTherapist != 'online' && this.seansType.name != 'message' && !isAppointment) {
      this.uiService.showSnackbar('Therapist şuan meşgul','Meşgul',3000)
      this.checkoutButton=false;
      return;
    }
    
    this.checkoutButton=true;

    const cardName = form.value.cardName
    if(cardName==""||cardName==null){

      let cardNameDiv=document.getElementById('cardName');
      cardNameDiv.style.border='1px solid red'
      this.checkoutButton=false;
      return;

    }
 
   
    const { token, error } = await stripe.createToken(this.cardNumber,this.cardExpiry,this.cardcvc,{name:cardName});

    if (error) {
      this.uiService.showSnackbar('İşlem gerçekleştirilemedi','Başarısız',3000)
      this.checkoutButton=false;
    } else {
     
      this.checkoutService.sendStripeToken(token,this.chargeInfo).subscribe((path:any)=>{
       
        if(path.roomId){
          this.router.navigate([path.url,path.roomId,path.seansId]);
        }else{
        
          this.router.navigateByUrl(path.url);
        }
        
      })
      // ...send the token to the your backend to process the charge
    }
  }

 
  

 



}



























// import {  OnInit,Component,
//   AfterViewInit,
//   OnDestroy,
//   ViewChild,
//   ElementRef,
//   ChangeDetectorRef } from '@angular/core';

//   import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-stripe-simple-test',
//   templateUrl: './stripe-simple-test2.component.html',
//   styleUrls: ['./stripe-simple-test2.component.css']
// })
// export class StripeSimpleTest2Component implements OnInit,AfterViewInit, OnDestroy {
  
//   @ViewChild('cardnumber',{static: false}) cardnumber: ElementRef;

//   @ViewChild('cardcvc',{static: false}) cardcvc: ElementRef;

//   @ViewChild('cardexpiry',{static: false}) cardexpiry: ElementRef;


  

//   cvc: any;
//   cardNumber:any;
//   cardExpiry:any;

//   cardHandler = this.onChange.bind(this);
//   error: string;


//   constructor(private cd: ChangeDetectorRef) {}

//   ngOnInit() {
    
//   }


//   ngAfterViewInit() {
//     const style = {
//       base: {
//         lineHeight: '24px',
//         fontSize: '18px',
//         '::placeholder': {
//           color: '#DCDFE6'
//         }
//       }
//     };
//     this.cvc = elements.create('cardCvc',{ style });
//     this.cardNumber=elements.create('cardNumber',{ style });
//     this.cardExpiry=elements.create('cardExpiry',{ style });
    
    

    
    
//     this.cvc.mount(this.cardcvc.nativeElement);
//     this.cardNumber.mount(this.cardnumber.nativeElement);
//     this.cardExpiry.mount(this.cardexpiry.nativeElement);

    

//     this.cvc.addEventListener('change', this.cardHandler);
//     this.cardNumber.addEventListener('change', this.cardHandler);
//     this.cardExpiry.addEventListener('change', this.cardHandler);
//   }

//   ngOnDestroy() {
//     this.cvc.removeEventListener('change', this.cardHandler);
//     this.cvc.destroy();
//     this.cardNumber.removeEventListener('change', this.cardHandler);
//     this.cardNumber.destroy();
//     this.cardExpiry.removeEventListener('change', this.cardHandler);
//     this.cardExpiry.destroy();
//   }

//   onChange({ error }) {
//     if (error) {
//       this.error = error.message;
//     } else {
//       this.error = null;
//     }
//     this.cd.detectChanges();
//   }

//   async onSubmit(form: NgForm) {
    
//     const cardName = form.value.cardName
//     if(cardName==""||cardName==null){

//       let cardNameDiv=document.getElementById('cardName');
//       cardNameDiv.style.border='1px solid red'
//       return;

//     }
 




   
//     const { token, error } = await stripe.createToken(this.cvc);

//     if (error) {
//       console.log('Something is wrong:', error);
//     } else {
//       console.log('Success!', token);
//       // ...send the token to the your backend to process the charge
//     }
//   }

 
  

 



// }
