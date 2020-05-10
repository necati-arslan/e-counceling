import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUpperCase]'
})
export class UpperCaseDirective {

  constructor(private el:ElementRef) { }
  @HostListener('input', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value= input.value.toUpperCase();
    const cardName=document.getElementById('cardName');
    if(cardName){
      cardName.style.border="1px solid #00000052";
    }
  }
}
