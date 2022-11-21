import autoBind from "auto-bind";
import { IModulatable, EnvelopeModule, Module } from "models";

export class AmplifierModule extends Module<GainNode> implements IModulatable {
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
  private readonly compressor = new DynamicsCompressorNode(Module.context, {
    threshold: 0,
    knee: 0.0,
    ratio: 20.0,
  });
  private _level: number = 0.22;

  constructor() {
    super();
    autoBind(this);
    this.envelope.connect(this.node.gain);
    this.lfoInputNode.connect(this.inputNode.gain);
    this.inputNode.connect(this.compressor);
    this.compressor.connect(this.node);
    this.envelope.setAmount(0.22);
  }

  get level() {
    return this._level;
  }
  public setLevel(value: number): void {
    value = Math.max(value, this.minValue);
    this.envelope.setAmount(value);
    this._level = value;
    this.inputNode.gain.value = value;
  }
  public setLfoAmount(value: number): void {
    this.lfoInputNode.gain.value = value;
  }
}
