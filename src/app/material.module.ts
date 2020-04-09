import { NgModule } from '@angular/core';
import {MatMomentDateModule} from "@angular/material-moment-adapter";
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
    MatSortModule,
    MatStepperModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatDateFormats,
    MatCheckboxModule   

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
       MatSortModule,
       MatStepperModule,
       MatRadioModule,
       MatProgressSpinnerModule,
       MatChipsModule,
       MatBadgeModule,
       MatDatepickerModule,
       MatMomentDateModule, //özel yükleme
       MatCheckboxModule
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
    MatSortModule,
    MatStepperModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatCheckboxModule
   ]
})
export class MaterialModule {


}

export const MY_FORMATS: MatDateFormats = {
   parse: {
       dateInput: 'DD/MM/YYYY',
   },
   display: {
       dateInput: 'DD/MM/YYYY',
       monthYearLabel: 'MMM YYYY',
       dateA11yLabel: 'LL',
       monthYearA11yLabel: 'MMMM YYYY',
   },
};