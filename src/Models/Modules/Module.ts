export abstract class Module<NodeType extends AudioNode = AudioNode> {
  public static context: AudioContext = new AudioContext();
  public static listener: AudioListener = this.context.listener;
  protected maxValue: number = 1;
  protected minValue: number = 0.00000000001;
  protected _destination: AudioNode | AudioParam | null = null;
  protected abstract node: NodeType;
  public get destination(): AudioNode | null {
    return this._destination as AudioNode;
  }
  protected currentTime(): number {
    return Module.context.currentTime;
  }
  protected sampleRate(): number {
    return Module.context.sampleRate;
  }
  public getAudioNode(): NodeType {
    return this.node;
  }
  /**
   * Conecta o nó a um nó de audio ou ao parametro de um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination?: AudioNode | AudioParam | undefined): void {
    if (!destination) return;
    if (destination instanceof AudioNode) {
      this.node.connect(destination);
    }
    if (destination instanceof AudioParam) {
      this.node.connect(destination);
    }
    this._destination = destination;
  }
  public abstract start(): void;
  public abstract stop(): void;
}
