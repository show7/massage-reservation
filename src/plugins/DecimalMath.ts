import { Decimal } from "decimal.js";

export default class DecimalMath {
  /**
   * @description: 加法方法
   * @param {string} a
   * @param {string} b
   * @return {*}
   */
  static add(
    a: string | number | Decimal,
    b: string | number | Decimal
  ): Decimal {
    return new Decimal(a).plus(new Decimal(b));
  }

  /**
   * @description: 减法方法
   * @param {string} a
   * @param {string} b
   * @return {*}
   */
  static subtract(
    a: string | number | Decimal,
    b: string | number | Decimal
  ): Decimal {
    return new Decimal(a).minus(new Decimal(b));
  }

  /**
   * @description: 乘法方法
   * @param {string} a
   * @param {string} b
   * @return {*}
   */
  static multiply(
    a: string | number | Decimal,
    b: string | number | Decimal
  ): Decimal {
    return new Decimal(a).times(new Decimal(b));
  }

  /**
   * @description: 除法方法
   * @param {string} a
   * @param {string} b
   * @return {*}
   */
  static divide(
    a: string | number | Decimal,
    b: string | number | Decimal
  ): Decimal {
    return new Decimal(a).dividedBy(new Decimal(b));
  }

  /**
   * @description: 格式化方法，确保按照指定位数格式化数字，即便是整数或是末尾为零的小数
   * @param {string} value
   * @param {number} digits
   * @return {*}
   */
  static toFixed(value: string | number | Decimal, digits: number): string {
    let decimalValue = new Decimal(value);
    // Decimal.toFixed(digits) 实现四舍五入到最接近的指定小数点位数
    // 并确保结果为字符串类型以保持小数点后零的完整性
    return decimalValue.toFixed(digits);
  }
  /**
   * @description: 格式化，
   * @param {string} value
   * @return {*}
   */
  static format(value: string | number | Decimal): string {
    return Number(value).toLocaleString();
  }
}
