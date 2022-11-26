export abstract class Module<
  InputNodeType extends AudioNode = AudioNode,
  OutputNodeType extends AudioNode = InputNodeType
> {
  public static context: AudioContext = new AudioContext(); // O contexto de áudio usado por todos os módulos
  public static listener: AudioListener = this.context.listener; // ??

  protected maxValue: number = 1;
  protected minValue: number = 0.00000000001;
  protected _destination: AudioNode | AudioParam | null = null; // Destino de conexão do módulo
  protected abstract inputNode: InputNodeType; // Nó de entrada do módulo
  protected abstract outputNode: OutputNodeType; // Nó de saída do módulo

  /**
   * @returns O nó ou parâmetro o qual o módulo está conectado
   */
  public get destination(): AudioNode | null {
    return this._destination as AudioNode;
  }

  /**
   * @returns O tempo atual do contexto de áudio
   */
  public now(): number {
    return Module.context.currentTime;
  }
  /**
   * @returns Sample rate do contexto de áudio atual
   */
  protected sampleRate(): number {
    return Module.context.sampleRate;
  }
  /**
   * @returns O nó de entrada do módulo
   */
  public getInputNode(): InputNodeType {
    return this.inputNode;
  }

  /**
   * @returns O nó de saída do módulo
   */
  public getOutputNode(): OutputNodeType {
    return this.outputNode;
  }
  /**
   * Desconecta o módulo após o tempo especificado
   * @param time Tempo, em milissegundos, em que o módulo vai ser desconectado
   */
  public disconnectAtTime(time: number = 0): void {
    window.setTimeout(() => {
      this.disconnetAllNodes();
    }, time);
  }
  /**
   * Desconecta o módulo quando o parametro passado atinge o valor passado
   * @param param Algum parametro de audio (frequencia, ganho, etc.)
   * @param value O valor alvo
   */
  public disconnectAtParamValue(param: AudioParam, value: number): void {
    let id = window.setInterval(() => {
      const curr = param.value;
      if (curr < value) {
        window.clearInterval(id);
        this.disconnetAllNodes();
      }
    }, 100);
  }
  /**
   * Desconecta todos os nós do módulo a fim de livrar a memória
   * usada por eles
   */
  protected disconnetAllNodes(): void {
    Object.keys(this).forEach((key) => {
      const property = (this as Record<string, any>)[key];
      if (property instanceof AudioNode) property.disconnect();
      if (property instanceof Module) {
        Object.keys(property).forEach((key) => {
          const property = (this as Record<string, any>)[key];
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
