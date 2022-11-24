export namespace Utils {
  /**
   * Converte o valor obtido de uma escala linear
   * para o seu equivalente numa escala logaritmica.
   * @param x O valor da escala linear
   * @param x0 O limite inferior da escala linear
   * @param x1 O limite superior da escala linear
   * @param c A constante de incremento da escala linear (Opcional, ajuda a definir a curva)
   * @param y0 O limite inferior da escala logaritmica (Por padrão é igual a x0)
   * @param y1 O limite superior da escala logaritmica (Por padrão é igual a x1)
   * @returns O valor na escala logaritmica
   */
  export function linToLogScale(
    x: number,
    x0: number,
    x1: number,
    c?: number,
    y0: number = x0,
    y1: number = x1
  ): number {
    if (x <= x0) return x0;
    const C = c ?? 0.000000000000001;
    const lin = (x - x0) / (x1 - x0);
    const log = lin * (Math.log(y1) - Math.log(y0 + C)) + Math.log(y0 + C);
    return Math.pow(Math.E, log);
  }
  /**
   * Converte o valor obtido de uma escala logaritmica
   * para o seu equivalente numa escala linear.
   * @param y O valor da escala logaritmica
   * @param y0 O limite inferior da escala logaritmica
   * @param y1 O limite superior da escala logaritmica
   * @param c A constante de incremento da escala linear (Opcional, ajuda a linearizar a curva)
   * @param x0 O limite inferior da escala logaritmica (Por padrão é igual a y0)
   * @param x1 O limite superior da escala logaritmica (Por padrão é igual a y1)
   * @returns O valor na escala linear
   */
  export function logToLinScale(
    y: number,
    y0: number,
    y1: number,
    c?: number,
    x0: number = y0,
    x1: number = y1
  ) {
    const C = c ?? 0.000000000000001;
    const lin = x1 - x0;
    const log =
      (Math.log(Math.max(y, C)) - Math.log(y0 + C)) /
      (Math.log(y1) - Math.log(y0 + C));
    return lin * log + x0;
  }
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
  export function clamp(x: number, x0: number, x1: number): number {
    return Math.max(x0, Math.min(x, x1));
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

  /**
   *
   */
  export function isNumber(v: any): boolean {
    return typeof v === "number";
  }
}
