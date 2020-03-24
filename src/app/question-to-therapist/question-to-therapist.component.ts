import { Component, OnInit, ViewChild } from '@angular/core';
import { RoomService } from '../services/room.service';
import { Observable, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ReusabalDialogComponent } from '../reusabal-dialog/reusabal-dialog.component';
import { AuthService } from '../auth/auth.service';
import { QuestionTemplateComponent } from '../question-template/question-template.component';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-question-to-therapist',
  templateUrl: './question-to-therapist.component.html',
  styleUrls: ['./question-to-therapist.component.css']
})
export class QuestionToTherapistComponent implements OnInit {
  source$: Observable<any>;
  sourceLastMessage$: Observable<any>;
  displayedColumns: string[] = ['no', 'displayName', 'email', 'createdAt', 'state'];
  displayedColumnsLast: string[] = ['no', 'displayName', 'createdAt', 'state'];      
  dataSource;
  dataSourceLast;
  user;
  lastMessageLength;
  seansMessagesLength;
  userType;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(
    private auth:AuthService ,
    private roomService: RoomService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log('yyyy')
    
    this.auth.userSubject$.subscribe((user:any)=>{
      const uiduser=user.uid;
      const userType=user.type;
      this.userType=user.type
      this.user=user

      this.roomService.getLastQuestion(uiduser,userType).subscribe((lastMessages:any)=>{
          console.log(lastMessages);
          this.lastMessageLength=lastMessages.length;
          this.dataSourceLast = new MatTableDataSource(lastMessages);//for filter
      }) 
       
      

      this.roomService.getAllMessage(uiduser,userType).subscribe((seansMessages: any) => {
        console.log(seansMessages);
        this.seansMessagesLength=seansMessages.length
        this.source$ = of(seansMessages);
        this.roomService.joinUser(this.source$,userType).subscribe(seansInfos => {
          console.log(seansInfos)
          this.dataSource = new MatTableDataSource(seansInfos);//for filter
  
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.paginator._intl.itemsPerPageLabel = 'Gösterilen satır satısı:'
        })
      })

    
    })

    

    // this.roomService.getQuestion('zRhTCut126yKVyuuUSH5').subscribe(x=>console.log(x))

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
 
  openQuestion(row,allMessage?:string){
    
    const usertype= this.userType
    console.log(row)
    const dialogRef = this.dialog.open(QuestionTemplateComponent,{
      width: '99%',
      height:'90%',
      panelClass: 'custom-dialog-container',
      data:{row,usertype,allMessage}
    }) 
    .afterClosed()
    .subscribe(result=>{
      if (result) {
        console.log(result);
        //this.router.navigate(['/dashboard']);
      };
    })
  }

}
