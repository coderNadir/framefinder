import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeURL',
})
export class SafeURLPipe implements PipeTransform {
  constructor(private sanitize: DomSanitizer) {}

  transform(value: string) {
    return this.sanitize.bypassSecurityTrustUrl(value);
  }
}
