export abstract class Module<
  InputNodeType extends AudioNode = AudioNode,
  OutputNodeType extends AudioNode = InputNodeType
> {
  public static context: AudioContext = new AudioContext();
  public static listener: AudioListener = this.context.listener;

  protected maxValue: number = 1;
  protected minValue: number = 0.00000000001;
  protected _destination: AudioNode | AudioParam | null = null;
  protected abstract inputNode: InputNodeType;
  protected abstract outputNode: OutputNodeType;

  public get destination(): AudioNode | null {
    return this._destination as AudioNode;
  }
  public currentTime(): number {
    return Module.context.currentTime;
  }
  protected sampleRate(): number {
    return Module.context.sampleRate;
  }
  public getInputNode(): InputNodeType {
    return this.inputNode;
  }
  public getOutputNode(): OutputNodeType {
    return this.outputNode;
  }
  public disconnectAtTime(time: number): void {
    window.setTimeout(() => {
      this.disconnetAllNodes();
    }, time ?? 0);
  }
  public disconnectAtParamValue(param: AudioParam, value: number): void {
    let id = window.setInterval(() => {
      const curr = param.value;
      if (curr < value) {
        window.clearInterval(id);
        this.disconnetAllNodes();
      }
    }, 100);
  }
  protected disconnetAllNodes(): void {
    Object.keys(this).forEach((key) => {
      const property = (this as { [key: string]: any })[key];
      if (property instanceof AudioNode) property.disconnect();
      if (property instanceof Module) {
        Object.keys(property).forEach((key) => {
          const property = (this as { [key: string]: any })[key];
          if (property instanceof AudioNode) property.disconnect();
        });
      }
    });
  }
  /**
   * Conecta o nó a um nó de audio ou ao parametro de um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination?: AudioNode | AudioParam): void {
    if (!destination) return;
    this.outputNode.connect(destination as AudioNode);
    this._destination = destination;
  }
}
