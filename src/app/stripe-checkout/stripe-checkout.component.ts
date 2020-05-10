import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '../checkoutService/checkout-service';

@Component({
  selector: 'app-stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.css']
})
export class StripeCheckoutComponent implements OnInit {

  message = "Ödeme işleminin tamamlanması bekleniyor...";
  waiting = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {

    const result = this.route.snapshot.queryParamMap.get("purchaseResult");

    if (result == "success") {

      const ongoingPurchaseSessionId = this.route.snapshot.queryParamMap.get("ongoingPurchaseSessionId");
      console.log((ongoingPurchaseSessionId))

      this.checkoutService.waitForPurchaseCompleted(ongoingPurchaseSessionId).subscribe(
        (purchase: any) => {
          const seansType = purchase.seansType.name;
         

          setTimeout(() => {
            this.message = "Ödeme işleminiz başarıyla gerçekleştirildi. Teşekkür Ederiz. Şimdi ilgili sayfaya yönderiyoruz...";
            this.waiting = false;  
          }, 2000);
          
          
          setTimeout(() => {
            
            if (purchase.isAppointment) {
              this.router.navigate(['appointmentTable']);
            } else {
              if (seansType == 'video' || seansType == 'audio' || seansType == 'chat') {
                this.router.navigate(['chat', purchase.roomId, purchase.seansId]);
              }
  
              if (purchase.seansType == 'message') this.router.navigate(['questiontotherapist']);
            }

          }, 9000);

        })
    } 

    if (result == "failed"){
      this.waiting=false;
      this.message ="Ödeme işleminiz gerçekleştirilemedi. Lütfen tekrar deneyiniz.";
    }


  }




}


