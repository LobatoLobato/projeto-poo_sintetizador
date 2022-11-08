export abstract class Modulo {
  public static context: AudioContext = new AudioContext();
  public static listener: AudioListener = this.context.listener;
  protected maxValue: number = 1;
  protected minValue: number = 1;
  public abstract node: AudioNode;
  protected currentTime(): number {
    return Modulo.context.currentTime;
  }
  public abstract connect(destination: AudioNode | AudioParam): void;
  public abstract start(): void;
  public abstract stop(): void;
}
