export class Utils {
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
