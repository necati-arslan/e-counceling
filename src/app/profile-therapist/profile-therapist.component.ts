import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-profile-therapist',
  templateUrl: './profile-therapist.component.html',
  styleUrls: ['./profile-therapist.component.css']
})
export class ProfileTherapistComponent implements OnInit {
  uzmanlikAlan=[];
  education=[];
  constructor(
    public dialogRef: MatDialogRef<ProfileTherapistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    console.log(this.data)
    if (this.data.therapist.uzmanlik) {
      let str:string;
      str = this.data.therapist.uzmanlik;
      this.uzmanlikAlan= str.split('\n');
      console.log('>>>>>>>>',this.uzmanlikAlan);
    }
    if(this.data.therapist.education){
      let str:string;
      str = this.data.therapist.education;
      this.education= str.split('\n');
    }
  }

}
