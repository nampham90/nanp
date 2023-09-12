import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDecimal, isIdCard, isInt, isMobile, isNum, isUrl } from './validate';

/** Bộ kiểm tra hàng ngày  */
export class _Validators {
  /**  Có phải là số */
  static num(control: AbstractControl): ValidationErrors | null {
    return isNum(control.value) ? null : { num: true };
  }

  /** Có phải là số nguyên  */
  static int(control: AbstractControl): ValidationErrors | null {
    return isInt(control.value) ? null : { int: true };
  }

  /** Có phải là số thập phân */
  static decimal(control: AbstractControl): ValidationErrors | null {
    return isDecimal(control.value) ? null : { decimal: true };
  }

  /** Có phải là CMND */
  static idCard(control: AbstractControl): ValidationErrors | null {
    return isIdCard(control.value) ? null : { idCard: true };
  }

  /** Có phải là số điện thoại di động*/
  static mobile(control: AbstractControl): ValidationErrors | null {
    return isMobile(control.value) ? null : { mobile: true };
  }

  /** Có phải là địa chỉ URL  */
  static url(control: AbstractControl): ValidationErrors | null {
    return isUrl(control.value) ? null : { url: true };
  }
}
