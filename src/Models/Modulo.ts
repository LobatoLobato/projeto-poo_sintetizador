export abstract class Modulo {
  public static context: AudioContext = new AudioContext();
  public static listener: AudioListener = this.context.listener;
  protected maxValue: number = 1;
  protected minValue: number = 1;
  protected _destination: AudioNode | null = null;
  public abstract node: AudioNode;
  public get destination(): AudioNode | null {
    return this._destination;
  }
  protected currentTime(): number {
    return Modulo.context.currentTime;
  }
  public abstract connect(destination: AudioNode | AudioParam): void;
  public abstract start(): void;
  public abstract stop(): void;
}
