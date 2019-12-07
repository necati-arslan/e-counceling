import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  } from '@angular/material'; 

@NgModule({
   imports:[
       MatButtonModule, 
       MatIconModule, 
       MatSidenavModule,
       MatToolbarModule,
       MatCardModule,
       MatFormFieldModule,
       MatInputModule,
       MatDialogModule,
       MatTabsModule,
       MatSelectModule,
       MatSnackBarModule,
       MatListModule,
       MatDividerModule,
       MatTableModule,
       MatPaginatorModule,
       MatSortModule
    ],
   exports:[
    MatButtonModule, 
    MatIconModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
   ]
})
export class MaterialModule {


}