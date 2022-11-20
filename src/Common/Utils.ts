export namespace Utils {
  /**
   * Converte o valor de uma função linear para o valor de uma função exponencial de base 2
   * @param x Valor
   * @param lowerLim Limite inferior
   * @param upperLim Limite superior
   * @returns O valor convertido
   */
  export function linToExp2(
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
  export function indexToFrequency(index: number): number {
    const frequency = 16.35 * 2 ** (index / 12);
    return frequency;
  }
  /**
   *
   * @param element O elemento HTML
   * @returns Largura do elemento
   */
  export function elementWidth(element: Element): number {
    return element.getBoundingClientRect().width;
  }
  /**
   *
   * @param element O elemento HTML
   * @returns Altura do elemento
   */
  export function elementHeight(element: Element): number {
    return element.getBoundingClientRect().height;
  }
  /**
   * @param str A cor em qualquer formato
   * @returns A cor no formato #xxxxxx
   */
  export function standardizeColor(str: string): string {
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
  export function colorStrToHexNumber(str: string): number {
    const standardizedStr = standardizeColor(str);
    return parseInt(standardizedStr.replace(/^#/, ""), 16);
  }
  /**
   *
   * @param num Numero fracional
   * @returns A parte decimal do numero
   */
  export function getDecimalPart(num: number): number {
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
  export function getDecimalPartSize(num: number): number {
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
  export function toFixedNum(num: number, precision: number): number {
    return parseFloat(num.toFixed(precision));
  }
}
