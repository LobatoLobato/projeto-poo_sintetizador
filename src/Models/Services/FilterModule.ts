import autoBind from "auto-bind";
import { Module, IModulatable, DriveModule } from "models";
import { EnvelopeModule } from "./EnvelopeModule";

export class FilterModule
  extends Module<GainNode, DynamicsCompressorNode>
  implements IModulatable
{
  private maxCutoffFrequency: number = 20000;
  protected outputNode: DynamicsCompressorNode = new DynamicsCompressorNode(
    Module.context,
    {
      ratio: 20,
      knee: 0,
      threshold: 0,
      attack: 0.2,
      release: 0.01,
    }
  );
  private readonly driveModule: DriveModule = new DriveModule();
  protected inputNode: GainNode = this.driveModule.getInputNode();
  protected readonly filterA: BiquadFilterNode = new BiquadFilterNode(
    Module.context,
    {
      frequency: this.maxCutoffFrequency,
      Q: -10,
    }
  );
  protected readonly filterB: BiquadFilterNode = new BiquadFilterNode(
    Module.context,
    {
      frequency: this.maxCutoffFrequency,
      Q: -10,
      gain: this.minValue,
    }
  );
  public readonly envelope: EnvelopeModule = new EnvelopeModule(1000, 0, {
    ref: this,
  });
  public readonly lfoInputNode: GainNode = new GainNode(Module.context, {
    gain: 1,
  });
  private readonly _maxLFOAmount: number = 400;
  private _lfoDepth: number = 0;
  private _cutoffFrequency: number = this.maxCutoffFrequency;
  private _Q: number = this.minValue;
  private _type: BiquadFilterType | "bypass" = "lowpass";
  private _slope: "-24dB" | "-12dB" = "-12dB";

  constructor() {
    super();
    autoBind(this);
    this.envelope.connect(this.filterA.frequency);
    this.envelope.connect(this.filterB.frequency);
    this.envelope.setSustain(0);
    this.lfoInputNode.connect(this.filterA.frequency);
    this.lfoInputNode.connect(this.filterB.frequency);
    this.driveModule.connect(this.filterA);
    this.setSlope(this._slope);
  }

  public get cutoffFrequency(): number {
    return this._cutoffFrequency;
  }
  public get Q(): number {
    return this._Q;
  }
  public get type(): BiquadFilterType | "bypass" {
    return this._type;
  }
  public get slope(): "-24dB" | "-12dB" {
    return this._slope;
  }
  public getInputNode(): GainNode {
    return this.inputNode;
  }
  public setType(type: BiquadFilterType | "bypass") {
    if (type === "bypass") {
      this.filterA.frequency.value = this.maxCutoffFrequency;
      this.filterA.Q.value = -10;
      this.filterB.Q.value = -10;
      this.filterB.frequency.value = this.maxCutoffFrequency;
    } else {
      if (this._type === "bypass") {
        this.filterA.frequency.value = this._cutoffFrequency;
        this.filterA.Q.value = this._Q;
        this.filterB.Q.value = this._Q;
        this.filterB.frequency.value = this._cutoffFrequency;
      }
      this.filterB.type = type;
      this.filterA.type = type;
    }
    this._type = type;
  }
  public setCutoff(cutoffFrequency: number): void {
    cutoffFrequency = Math.max(cutoffFrequency, 60);
    if (this._type !== "bypass") {
      this.filterB.frequency.value = cutoffFrequency;
      this.filterA.frequency.value = cutoffFrequency;
    }
    this._cutoffFrequency = cutoffFrequency;
  }
  public setQ(q: number): void {
    if (this._type !== "bypass") {
      this.filterB.Q.value = q;
      this.filterA.Q.value = q;
    }
    this._Q = q;
  }
  public setSlope(type: "-12dB" | "-24dB"): void {
    if (type === "-24dB") {
      this.filterA.disconnect();
      this.filterA.connect(this.filterB);
      this.filterB.connect(this.outputNode);
    } else {
      this.filterA.connect(this.outputNode);
      this.filterB.disconnect();
    }
    this._slope = type;
  }
  public setDrive(value: number) {
    this.driveModule.setDrive(value);
  }
  public get driveAmount(): number {
    return this.driveModule.driveAmount;
  }
  public getLfoInputNode(): GainNode {
    return this.lfoInputNode;
  }

  public get lfoDepth(): number {
    return this._lfoDepth;
  }

  public setLfoDepth(value: number) {
    value = Math.max(this.minValue, Math.min(value, this._maxLFOAmount));
    this._lfoDepth = value;
    this.lfoInputNode.gain.value = value * this._maxLFOAmount;
  }
}
