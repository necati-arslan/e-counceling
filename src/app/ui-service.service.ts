import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  

  constructor(private snackbar: MatSnackBar) { }

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }


}
