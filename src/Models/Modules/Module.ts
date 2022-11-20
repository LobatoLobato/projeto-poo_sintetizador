export abstract class Module {
  public static context: AudioContext = new AudioContext();
  public static listener: AudioListener = this.context.listener;
  protected maxValue: number = 1;
  protected minValue: number = 0.00000000001;
  protected _destination: AudioNode | AudioParam | null = null;
  protected abstract node: AudioNode;
  public get destination(): AudioNode | null {
    return this._destination as AudioNode;
  }
  protected currentTime(): number {
    return Module.context.currentTime;
  }
  protected sampleRate(): number {
    return Module.context.sampleRate;
  }
  public getAudioNode<T>() {
    return this.node as T;
  }
  /**
   * Conecta o nó a um nó de audio ou ao parametro de um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination?: AudioNode | AudioParam, output?: number): void {
    if (!destination) return;
    if (destination instanceof AudioNode) {
      this.node.connect(destination, output);
    }
    if (destination instanceof AudioParam) {
      this.node.connect(destination, output);
    }
    this._destination = destination;
  }
  public abstract start(): void;
  public abstract stop(): void;
}
