import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';
import {map, concatMap} from 'rxjs/operators';




@Component({
  selector: 'app-appointment-table',
  templateUrl: './appointment-table.component.html',
  styleUrls: ['./appointment-table.component.css']
})
export class AppointmentTableComponent implements OnInit {

  user;
  userId;
  userType;
  countAppointment;

  displayedColumns: string[] = ['no', 'timeStamp', 'user','seansType','timeRange'];
  dataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private authService: AuthService,
    private roomService: RoomService
  ) { }

  ngOnInit() {

    this.authService.userSubject$.subscribe((user: any) => {

      this.user = user;
      this.userId = user.uid;
      this.userType = user.type;
  
      let appointment$;
      

      if (this.userType == 'therapist'){
       appointment$ =this.roomService.getReservedAppointmentThepapist(this.userId);
       this.roomService.joinUser(appointment$,this.userType).subscribe(appointments => {
         console.log(appointments);

         this.sendDatasource(appointments);
         
          });
        }
         ///user  
      if (this.userType == 'user'){
        appointment$= this.roomService.getReservedAppointmentUser(this.userId);
        
        this.roomService.joinUser(appointment$,this.userType).subscribe(appointments => {
         console.log(appointments);

         this.sendDatasource(appointments);
        
         });
        }


    })

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sendDatasource(appointments){
    if(!appointments){this.countAppointment=0; return}
    let now=Date.now();
    appointments = appointments.filter(reserve => reserve.timeStamp >= now);
           appointments.sort(function (a, b) {
            return a.timeStamp - b.timeStamp;
          });

          this.countAppointment=appointments.length;
          console.log(this.countAppointment)
      
              this.dataSource = new MatTableDataSource(appointments);//for filter
              console.log(this.dataSource)
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
  
              this.paginator._intl.itemsPerPageLabel = 'Gösterilen satır satısı:'
  }

}



