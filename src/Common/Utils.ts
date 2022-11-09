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
}
