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
    MatListModule
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
       MatListModule
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
    MatListModule
   ]
})
export class MaterialModule {


}