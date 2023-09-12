import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changNumberToChinese',
  standalone: true
})
export class ChangNumberToChinesePipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 1:
        return 'Một';
      case 2:
        return 'Hai';
      case 3:
        return 'Ba';
      case 4:
        return 'Bố';
      case 5:
        return 'Năm';
      case 6:
        return 'Sáu';
      case 7:
        return 'Bảy';
      case 8:
        return 'Tám';
      case 9:
        return 'Chín';
      case 10:
        return 'Mười';
      default:
        return '';
    }
  }
}
