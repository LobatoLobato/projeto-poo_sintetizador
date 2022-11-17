export class Utils {
  /**
   * Converte o valor de uma função linear para o valor de uma função exponencial de base 2
   * @param x Valor
   * @param lowerLim Limite inferior
   * @param upperLim Limite superior
   * @returns O valor convertido
   */
  public static linToExp2(
    x: number,
    lowerLim?: number,
    upperLim?: number
  ): number {
    const exponentialValue = x * Math.pow(2, x - (upperLim ?? 0));
    return Math.max(exponentialValue, lowerLim ?? exponentialValue);
  }
  /**
   *
   * @param index Índice da nota
   * @returns Frequencia a partir do índice
   */
  public static indexToFrequency(index: number): number {
    const frequency = 16.35 * 2 ** (index / 12);
    return frequency;
  }
  /**
   *
   * @param element O elemento HTML
   * @returns Largura do elemento
   */
  public static elementWidth(element: Element): number {
    return element.getBoundingClientRect().width;
  }
  /**
   *
   * @param element O elemento HTML
   * @returns Altura do elemento
   */
  public static elementHeight(element: Element): number {
    return element.getBoundingClientRect().height;
  }
  /**
   * @param str A cor em qualquer formato
   * @returns A cor no formato #xxxxxx
   */
  public static standardizeColor(str: string) {
    const ctx = document
      .createElement("canvas")
      .getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = str;
    return ctx.fillStyle;
  }
  /**
   * @param str A cor em qualquer formato
   * @returns A cor em hexadecimal
   */
  public static colorStrToHexNumber(str: string): number {
    const standardizedStr = this.standardizeColor(str);
    return parseInt(standardizedStr.replace(/^#/, ""), 16);
  }
  /**
   * 
   * @param num Numero fracional
   * @returns A parte decimal do numero
   */
  public static getDecimalPart(num: number): number {
    if (Number.isInteger(num)) {
      return 0;
    }

    const decimalStr = num.toString().split(".")[1];
    return Number(decimalStr);
  }
  /**
   * 
   * @param num Numero fracional
   * @returns Quantidade de casas decimais do numero
   */
  public static getDecimalPartSize(num: number): number {
    if (Number.isInteger(num)) {
      return 0;
    }

    const decimalStr = num.toString().split(".")[1];
    return decimalStr.length;
  }

  /**
   * 
   * @param num Numero fracional
   * @param precision Quantidade de digitos depois do ponto decimal
   * @returns Numero com quantidade de casas decimais fixas
   */
  public static toFixedNum(num: number, precision: number): number {
    return parseFloat(num.toFixed(precision));
  }
}