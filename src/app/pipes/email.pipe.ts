import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'email'
})
export class EmailPipe implements PipeTransform {

  transform(email: any, ...args: any[]): any {
    if(!email) return;
    let userEmail = email.substring(0, email.lastIndexOf("@"));
    return userEmail;
  }

}
