import autoBind from "auto-bind";
import { IModulatable, EnvelopeModule, Module } from "models";

export class AmplifierModule extends Module<GainNode> implements IModulatable {
  protected readonly inputNode: GainNode = new GainNode(Module.context, {
    gain: 0.22,
  });
  protected readonly outputNode: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  private readonly compressorNode = new DynamicsCompressorNode(Module.context, {
    threshold: 0,
    knee: 0.0,
    attack: 0.01,
    release: 0,
    ratio: 20.0,
  });
  public readonly lfoInputNode: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  public readonly envelope: EnvelopeModule = new EnvelopeModule(1, 0.22);

  constructor() {
    super();
    autoBind(this);
    this.envelope.connect(this.outputNode.gain);
    this.lfoInputNode.connect(this.inputNode.gain);
    this.inputNode.connect(this.compressorNode);
    this.compressorNode.connect(this.outputNode);
  }

  public get lfoDepth(): number {
    return this.lfoInputNode.gain.value;
  }

  public getLfoInputNode(): GainNode {
    return this.lfoInputNode;
  }
  public setLfoAmount(value: number): void {
    this.lfoInputNode.gain.value = value;
  }
}
