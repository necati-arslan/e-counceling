import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RoomService } from '../services/room.service';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { of, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
  
@Component({
  selector: 'app-therapist-of-user',
  templateUrl: './therapist-of-user.component.html',
  styleUrls: ['./therapist-of-user.component.css']
})
export class TherapistOfUserComponent implements OnInit {

  displayedColumns: string[] = ['no','type', 'date', 'state','detay'];
  dataSource;
  therapist;
  therapistCard$:Observable<any>;
  roomId;
  user;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(
    private route:ActivatedRoute,
    private roomService:RoomService,
    private authService:AuthService
  ) { 
     this.route.paramMap.subscribe((params:ParamMap)=>{
      let roomId =params.get('roomId');
      this.roomId=roomId;
      let uidtherapist=params.get('uidTherapist');
      this.therapist=[{uidtherapist:uidtherapist}];
      console.log(this.therapist)
      if(roomId){
        this.roomService.getSeans(roomId).subscribe((seans:any)=>{
          this.dataSource=new MatTableDataSource(seans);//for filter

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        
          this.paginator._intl.itemsPerPageLabel='Gösterilen satır satısı:'
        });
      } 
    });

    this.authService.userSubject$.subscribe(user=>this.user=user);
   }
  
  ngOnInit() {
  
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
