import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective implements AfterViewInit {
constructor(private el: ElementRef<HTMLInputElement>, private control: NgControl) {}

  ngAfterViewInit(): void {
    this.setUppercaseInitialValue();
  }

  @HostListener('input', ['$event'])
  onInput(): void {
    this.setUppercaseValue();
  }

  private setUppercaseInitialValue(): void {
    const currentValue = this.control.control?.value;
    if (currentValue) {
      const upper = currentValue.toUpperCase();
      this.el.nativeElement.value = upper;
      this.control.control?.setValue(upper, { emitEvent: false });
    }
  }

  private setUppercaseValue(): void {
    const input = this.el.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const uppercased = input.value.toUpperCase();
    input.value = uppercased;
    this.control.control?.setValue(uppercased, { emitEvent: false });

    input.setSelectionRange(start, end);
  }
}
