import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';


export function dateValidator (control: AbstractControl): {[key: string]: any} | null  {
      const forbidDate = moment(control.value, 'DD/MM/YYYY',true).isValid();
      console.log('forbidDate',forbidDate)
      return forbidDate ? null : {'dateValidator': true};
    };
    