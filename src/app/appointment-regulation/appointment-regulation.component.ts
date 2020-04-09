import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { dateValidator } from '../custom validator/date.validator';

@Component({
  selector: 'app-appointment-regulation',
  templateUrl: './appointment-regulation.component.html',
  styleUrls: ['./appointment-regulation.component.css']
})
export class AppointmentRegulationComponent implements OnInit {
 
  
  user;
  userId;
  minDate;
  maxDate;
  dataSource;
  displayedColumns: string[] = ['no', 'workingDate', 'workingHours'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  workingTimeForm: FormGroup;
  hours = [
    '00:00-01:00',
    '01:00-02:00',
    '02:00-03:00',
    '03:00-04:00',
    '04:00-05:00',
    '05:00-06:00',
    '06:00-07:00',
    '07:00-08:00',
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-019:00',
    '19:00-20:00',
    '20:00-21:00',
    '21:00-22:00',
    '22:00-23:00',
    '23:00-24:00',
    'Randevu Alma',
  ]
  constructor(private authService: AuthService,
    private roomService: RoomService,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this.authService.userSubject$.subscribe((user: any) => {
      console.log(user)
      this.user = user;
      this.userId = user.uid;
   

   


      this.workingTimeForm = this._fb.group({
        workingDate: [moment(), [Validators.required, dateValidator]],
        workingHours: ['', [Validators.required]],
        shortWayHours: ['']

      });


      let workingDate = moment().format('DD/MM/YYYY')
      console.log(workingDate)
      this.roomService.getWorkingHours(this.userId, workingDate).subscribe(workingHours =>{
        this.workingTimeForm.controls['workingHours'].setValue(workingHours)
      })

      const currentYear = new Date().getFullYear();
      var minCurrentDate = new Date();
      this.minDate = minCurrentDate;
      this.maxDate = new Date(currentYear + 1, 11, 31);

      this.roomService.getWorkingTimes(this.userId).subscribe((workingTimes:any)=>{
      
        this.dataSource = new MatTableDataSource(workingTimes);//for filter
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        //this.paginator._intl.itemsPerPageLabel = 'Gösterilen satır satısı:'
      })

    })//user
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async submitWorkingTime(ngworkingTimeForm) {
    console.log(this.workingTimeForm.value.workingDate.format('DD/MM/YYYY'));
    console.log(this.workingTimeForm.value.workingHours)
    const workingDate = this.workingTimeForm.value.workingDate.format('DD/MM/YYYY');
    const workingHours = this.workingTimeForm.value.workingHours;
    await this.roomService.deleteWorkingTime(this.userId, workingDate)

    workingHours.forEach(hour => {
      if(hour=='Randevu Alma') return;
      let timeRange = hour
      hour = hour.substring(0, 5);
      let workingTime = workingDate + ' ' + hour
      let timeStamp = moment(workingTime, 'D/M/YYYY hh:mm a').format('x');
      let data = {
        userId: this.userId,
        workingDate,
        workingHour: hour, 
        timeRange,
        timeStamp,
        reserved:false,
        createdAt: Date.now()
      }
      this.roomService.createWorkingTime(data)
    })

    ngworkingTimeForm.resetForm();
    let str = document.querySelector('#workingMessage')
    str.innerHTML = "Kayıt Eklendi"

  }

  addEventDatepicker(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(!this.workingTimeForm.get('workingDate').valid)
    if (!this.workingTimeForm.get('workingDate').valid) return;
    let workingDate = this.workingTimeForm.value.workingDate.format('DD/MM/YYYY')
    this.roomService.getWorkingHours(this.userId, workingDate).subscribe(workingHours => {
      this.workingTimeForm.controls['workingHours'].setValue(workingHours)
    })

  }

  checkShortWayWorkTime(event) {
    const sekizbes = [
      '08:00-09:00',
      '09:00-10:00',
      '10:00-11:00',
      '11:00-12:00',
      '12:00-13:00',
      '13:00-14:00',
      '14:00-15:00',
      '15:00-16:00',
      '16:00-17:00',]

    const besyirmiiki = [
      '17:00-18:00',
      '18:00-019:00',
      '19:00-20:00',
      '20:00-21:00',
      '21:00-22:00',]
    const reset = []
    const randevuAlma=['Randevu Alma']
    console.log(event.value)
    if (event.value == "allDay") this.workingTimeForm.controls['workingHours'].setValue(this.hours);
    if (event.value == "8-17") this.workingTimeForm.controls['workingHours'].setValue(sekizbes);
    if (event.value == "17-22") this.workingTimeForm.controls['workingHours'].setValue(besyirmiiki);
    if (event.value == "reset") this.workingTimeForm.controls['workingHours'].setValue(reset);
    if (event.value == "randevuAlma") this.workingTimeForm.controls['workingHours'].setValue(randevuAlma);


  }

}
