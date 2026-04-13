import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appImageFallback]',
  standalone: true
})
export class ImageFallbackDirective {

  @Input('appImageFallback') text: string = 'Elite Commerce';
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('error') onError() {

    const bg = '0f172a';
    const color = '6C63FF';
    
    // Encode the text to ensure it's URL-safe
    const displayValue = this.text ? this.text : 'Elite Commerce';
    const formattedText = encodeURIComponent(displayValue);

    const fallbackUrl = `https://placehold.co/600x400/${bg}/${color}?text=${formattedText}`;

    this.renderer.setAttribute(this.el.nativeElement, 'src', fallbackUrl);

    // CORS workaround: Add referrerpolicy and crossorigin attributes
    this.renderer.setAttribute(this.el.nativeElement, 'referrerpolicy', 'no-referrer');
    this.renderer.setAttribute(this.el.nativeElement, 'crossorigin', 'anonymous');
  }

}
