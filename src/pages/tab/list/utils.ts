/**
 * 数字转换为带单位的字符串
 * @param value 要转换的数字
 * @param digits 保留小数位数，默认2位
 * @returns 转换后的字符串
 *
 * 示例:
 * 1234 => 1.23k
 * 12345 => 12.35k
 * 123456 => 123.46k
 * 1234567 => 1.23w
 * 12345678 => 12.35w
 */
export function formatNumber(value: string | number, digits: number = 2): string {
  const num = Number(value);
  if (Number.isNaN(num)) return '0';

  if (num >= 10000) {
    return `${(num / 10000).toFixed(digits)}w`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(digits)}k`;
  }
  return num.toFixed(digits);
}
