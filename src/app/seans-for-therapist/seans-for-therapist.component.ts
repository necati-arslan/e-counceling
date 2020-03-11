import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../services/room.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReusabalDialogComponent } from '../reusabal-dialog/reusabal-dialog.component';

@Component({
  selector: 'app-seans-for-therapist',
  templateUrl: './seans-for-therapist.component.html',
  styleUrls: ['./seans-for-therapist.component.css']
})
export class SeansForTherapistComponent implements OnInit {
  user: any;
  displayedColumns: string[] = ['no', 'type', 'createdAt', 'state', 'seansNote','seans'];
  dataSource;
  displayName;
  email;
  roomId;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private roomService: RoomService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    let roomId = this.route.snapshot.paramMap.get('roomId');
    this.roomId=roomId;
    this.displayName = this.route.snapshot.paramMap.get('displayName')
    this.email = this.route.snapshot.paramMap.get('email')
     
    console.log(roomId);
 
    this.auth.user$.subscribe((user) => {
      this.user = user;
      this.roomService.getRoomById(roomId).subscribe((room: any) => {
        console.log(room)
        if (this.user.uid == room.therapist.uidtherapist) {
          this.roomService.getSeans(roomId).subscribe((seans: any) => {
            console.log(seans);
            this.dataSource = new MatTableDataSource(seans);//for filter

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.paginator._intl.itemsPerPageLabel = 'Gösterilen satır satısı:';
          })
        }
      })

    })

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(seansNote) {
    const dialogRef = this.dialog.open(ReusabalDialogComponent, {
      data: { header: "Mevcut Seansla İlgili  Note", content: seansNote }
    })
    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          console.log(result);
          //this.router.navigate(['/dashboard']);
        };
      })
  }




}
