import {  OnInit,Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef } from '@angular/core';

  import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stripe-simple-test',
  templateUrl: './stripe-simple-test.component.html',
  styleUrls: ['./stripe-simple-test.component.css']
})
export class StripeSimpleTestComponent implements OnInit,AfterViewInit, OnDestroy {
  
  @ViewChild('cardInfo',{static: false}) cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;


  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    
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
    this.card = elements.create('card',{hidePostalCode: true, style });
    
      
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    
    const cardName = form.value.cardName
    if(cardName==""||cardName==null){

      let cardNameDiv=document.getElementById('cardName');
      cardNameDiv.style.border='1px solid red'
      return;

    }
 




   
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token);
      // ...send the token to the your backend to process the charge
    }
  }

 
  

 



}
