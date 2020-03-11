import { Component, OnInit, ViewChild } from '@angular/core';
import { RoomService } from '../services/room.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserForAdminPanelComponent } from '../user-for-admin-panel/user-for-admin-panel.component';
import { FormBuilder, Validators, FormGroup, FormGroupDirective } from '@angular/forms';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  displayedColumns: string[] = ['no','photoURL', 'displayName', 'email', 'cinsiyet', 'type','createdAt','update'];
  dataSource;
  askHelp$;
  askHelpForm:FormGroup;
  content;

 

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(private roomService:RoomService,
    private dialog:MatDialog,
    private _formBuilder: FormBuilder
    ) { }
 
  ngOnInit() {
    this.askHelpForm = this._formBuilder.group({
      nameExpertiseCat: ['', Validators.required],
      valueExpertiseCat:['',Validators.required]
    });

  }


  getAllUser(){
    this.content="table";
    this.roomService.getAllUser().subscribe((users:any)=>{
        this.dataSource = new MatTableDataSource(users);//for filter

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    })
  }

  getAllTherapist(){
    this.content="table";
    this.roomService.getAllTherapist().subscribe((users:any)=>{
      this.dataSource = new MatTableDataSource(users);//for filter

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    })
  }

  getAskHelp(){
    
    this.content='askHelp';
    this.askHelp$= this.roomService.getAskHelp()
  }
  deleteAskHelp(askId){
    console.log(askId)
    this.roomService.deleteAskHelp(askId).then(()=>{
      console.log('kayıt silindi');
    });

  }
  addAskHelp(formDir){
    let name = this.askHelpForm.value.nameExpertiseCat;
    let value = this.askHelpForm.value.valueExpertiseCat;
    let createdAt=Date.now()
   return this.roomService.addAskHelp(name,value,createdAt).then(()=>{
    formDir.resetForm()
   document.querySelector('#askHelpResult').innerHTML="Kayıt işlemi yapıldı";
   })
   
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(user:any) {
    console.log(user);

    const dialogRef = this.dialog.open(UserForAdminPanelComponent,{
      width:'1300px',
      height:"90%",
      data:{user:user}
    }) 
    .afterClosed()
    .subscribe(result=>{
      if (result) {
        console.log(result);
        //this.router.navigate(['/dashboard']);
      };
    })
   
  }

  dialogByUser(userInfo,listType){
  
  }

}
