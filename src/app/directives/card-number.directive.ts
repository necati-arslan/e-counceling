import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appCardNumber]'
})
export class CardNumberDirective {
  // @HostListener('focus') onFocus(){
  //   console.log('focus on');
  // }
  // @HostListener('blur') onBlur(){
  //   console.log('Blur on');
  // }

  @HostListener('input', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi,'');
    if (trimmed.length > 16) {
      trimmed = trimmed.substr(0, 16);
    }

    let numbers = [];
    for (let i = 0; i < trimmed.length; i += 4) {
      numbers.push(trimmed.substr(i, 4));
    }

    input.value = numbers.join(' ');

  }
  constructor() { }

}
