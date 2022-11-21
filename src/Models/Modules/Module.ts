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
  public connect(destination?: AudioNode | AudioParam): void {
    if (!destination) return;
    this.node.connect(destination as AudioNode);
    this._destination = destination;
  }
}
