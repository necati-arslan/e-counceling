import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCardCvv]'
})
export class CardCvvDirective {
 
  constructor(private el:ElementRef) { }

  @HostListener('input', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value= input.value.replace(/[^0-9]/gi,'');
    if (input.value.length > 3) {
      input.value = input.value.substr(0, 3);
    }
  }


}
