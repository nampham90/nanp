/**  Có phải là số */
export function isNum(value: string | number): boolean {
  return /^((-?\d+\.\d+)|(-?\d+)|(-?\.\d+))$/.test(value.toString());
}

/** Có phải là số nguyên */
export function isInt(value: string | number): boolean {
  return isNum(value) && parseInt(value.toString(), 10).toString() === value.toString();
}

/**  Có phải là số thập phân */
export function isDecimal(value: string | number): boolean {
  return isNum(value) && !isInt(value);
}

/** Có phải là số CMND  */
export function isIdCard(value: string): boolean {
  return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i.test(value);
}

/** Có phải là số điện thoại di động */
export function isMobile(value: string): boolean {
  return /^(0|\+?84|17951)?(13[0-9]|15[0-9]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(value);
}

/** Có phải là số điện thoại  */
export function isTelPhone(value: string): boolean {
  return /^(0\d{2,3}-?)?\d{7,8}$/.test(value);
}

/** Có phải là số điện thoại  */
export function isEmail(value: string): boolean {
  return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value);
}

/** Mật khẩu bao gồm 6 đến 20 ký tự chữ cái viết hoa và viết thường */
export function isPasswordPass(value: string): boolean {
  const regTure = /^[^\s]{6,20}$/;
  const regFalse = /^\d+$/;
  return regTure.test(value) && !regFalse.test(value);
}

/** Có phải là địa chỉ URL*/
export function isUrl(url: string): boolean {
  return /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/.test(url);
}
