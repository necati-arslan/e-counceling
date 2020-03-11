import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-reusabal-dialog',
  templateUrl: './reusabal-dialog.component.html',
  styleUrls: ['./reusabal-dialog.component.css']
}) 
export class ReusabalDialogComponent implements OnInit {
 
  constructor(
    public dialogRef: MatDialogRef<ReusabalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) { }

  ngOnInit() {
  }

}
 