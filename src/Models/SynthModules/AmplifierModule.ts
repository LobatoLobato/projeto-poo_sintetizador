import { Modulatable, EnvelopeModule, Module } from "models";

export class AmplifierModule extends Module implements Modulatable {
  public readonly inputNode: GainNode = new GainNode(Module.context, {
    gain: 0.22,
  });
  public readonly node: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  public readonly lfoInputNode: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  public readonly envelope: EnvelopeModule = new EnvelopeModule(1, 0.22);
  private _level: number = 0.22;
  private readonly compressor = new DynamicsCompressorNode(Module.context, {
    threshold: 0,
    knee: 0.0,
    ratio: 20.0,
  });
  constructor() {
    super();
    this.envelope.connect(this.node.gain);
    this.lfoInputNode.connect(this.inputNode.gain);
    this.inputNode.connect(this.compressor);
    this.compressor.connect(this.node);
    this.envelope.amount = 0.22;
  }
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
  /**
   * Inicia o envelope do amplificador
   */
  public start(): void {
    this.envelope.start();
  }
  /**
   * Para o envelope do amplificador
   */
  public stop(): void {
    this.envelope.stop();
  }

  get level() {
    return this._level;
  }
  set level(value: number) {
    value = Math.max(value, this.minValue);
    this._level = this.envelope.amount = value;
    this.inputNode.gain.value = value;
  }
  set lfoAmount(value: number) {
    this.lfoInputNode.gain.value = value;
  }
}
