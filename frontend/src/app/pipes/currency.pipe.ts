import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kshCurrency',
  standalone: true
})
export class KshCurrencyPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined) return 'KSH 0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return `KSH ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
