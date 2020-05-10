import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found-component',
  templateUrl: './page-not-found-component.component.html',
  styleUrls: ['./page-not-found-component.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/']);
  }


}
