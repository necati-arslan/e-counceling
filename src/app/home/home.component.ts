import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../auth/login/login.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';
import * as AOS from 'aos';

declare const Swiper: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 
  user;
  swiper:any;
  
  

  constructor(private dialog:MatDialog,
              private router: Router,
              private authService:AuthService,
              private route: ActivatedRoute,
            
              ) { }

  ngOnInit() {
    this.authService.userSubject$.subscribe(user=>{this.user=user;})
     
    this.route.fragment.subscribe(f => {
      const element = document.querySelector("#" + f)
      if (element) element.scrollIntoView({ block: 'start',  behavior: 'smooth' })
    });
    
    this.showSlides(this.slideIndex);
    AOS.init();

  }

 

  startCounceling(){
    console.log(this.user)
    if(this.user.uid){
      this.router.navigate(['/dashboard']);
      return;
    }
 
    const dialogRef = this.dialog.open(LoginComponent) 
    .afterClosed()
    .subscribe((result:any)=>{
      if (result) {
        let user = result.user
        this.authService.getUserById(user.uid).pipe(take(1))
        .subscribe((user:any)=>{
          console.log(user)
          if(user.type=="therapist") this.router.navigate(['t-dashboard']);
          if(user.type=="user") this.router.navigate(['dashboard']);
        })
         
      };
    })
 
  }


  //testimonialSection
 slideIndex = 1;


 plusSlides(n) {
  this.showSlides(this.slideIndex += n);
}

 currentSlide(n) {
  this.showSlides(this.slideIndex = n);
}

showSlides(n) {
  var i;
  var slides:any = document.getElementsByClassName("mySlides");
  console.log('ddd',slides.length);
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {this.slideIndex = 1}    
  if (n < 1) {this.slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
  	
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[this.slideIndex-1].style.display = "block";  
  dots[this.slideIndex-1].className += " active";
}


//testimonialSection
 
}
