import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ReusabalDialogComponent } from '../reusabal-dialog/reusabal-dialog.component';
 
@Component({
  selector: 'app-user-of-therapist',
  templateUrl: './user-of-therapist.component.html',
  styleUrls: ['./user-of-therapist.component.css']
})
export class UserOfTherapistComponent implements OnInit {
  user: any;
  displayedColumns: string[] = ['no', 'displayName', 'email', 'cinsiyet', 'createdAt', 'roomNote', 'seans'];
  dataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private roomService: RoomService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.auth.userSubject$.subscribe((user) => {
      this.user = user;
      console.log(user)
      this.roomService.joinRoomsUsers(user.uid, user.type).subscribe((rooms) => {
        console.log(rooms)
        this.dataSource = new MatTableDataSource(rooms);//for filter

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.paginator._intl.itemsPerPageLabel = 'Gösterilen satır satısı:'
      })

    })

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(roomNote) {
    const dialogRef = this.dialog.open(ReusabalDialogComponent,{
      data:{header:"Danışan Hakkında Genel Note",content:roomNote}
    }) 
    dialogRef.afterClosed()
    .subscribe(result=>{
      if (result) {
        console.log(result);
        //this.router.navigate(['/dashboard']);
      };
    })
  }
}



