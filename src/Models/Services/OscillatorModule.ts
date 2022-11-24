import autoBind from "auto-bind";
import { Module, EnvelopeModule, IModulatable } from "models";

type UnisonNode = [OscillatorNode, GainNode, PannerNode];

export class OscillatorModule
  extends Module<OscillatorNode>
  implements IModulatable
{
  protected inputNode: OscillatorNode = new OscillatorNode(Module.context);
  protected outputNode: OscillatorNode = this.inputNode;
  public readonly lfoInputNode: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  protected unisonMerger: ChannelMergerNode = new GainNode(Module.context, {
    gain: 1,
  });
  public readonly envelope: EnvelopeModule = new EnvelopeModule(1000, 0);
  private readonly _maxLFOAmount: number = 400;
  private _lfoDepth: number = 0;
  private _unisonNodes: UnisonNode[] = [];
  private _unisonDetuneValues: number[] = [];
  private _maxDetune: number = 0.5;
  private _type: OscillatorType = "sine";
  private _frequency: number = 440;
  private _detune: number = 0;
  private _pitchOffset: number = 0;
  private _unisonSize: number = 0;
  private _unisonDetune: number = 0;
  private _unisonSpread: number = 0;
  private _portamentoTime: number = 0;
  private _portamentoOn: boolean = false;

  constructor(st?: boolean) {
    super();
    autoBind(this);
    this.envelope.connect(this.outputNode.frequency);
    this.envelope.setSustain(0);
    this.lfoInputNode.connect(this.outputNode.frequency);
    this.outputNode.start();
  }
  private createUnisonNodes(size: number, gain: number): UnisonNode[] {
    const detuneIncrement = this._maxDetune / size;
    const panIncrement = this._unisonSpread / size;
    let values: [number, number][] = [];
    for (let i = 0; i < size; i++) {
      const detune = this._maxDetune - detuneIncrement * i;
      const pan = this._unisonSpread - panIncrement * i;
      values = [...values, [detune, pan], [-detune, -pan]];
    }
    this._unisonNodes.forEach(([o, g, p]) => {
      o.disconnect();
      g.disconnect();
      p.disconnect();
    });
    const unisonNodes = values.map(([detune, positionX]) => {
      const oscNode = new OscillatorNode(Module.context, {
        detune: detune * this._unisonDetune + this.detune,
        type: this.type,
        frequency: this.frequency,
      });
      const pannerNode = new PannerNode(Module.context, { positionX });
      const gainNode = new GainNode(Module.context, {
        gain: gain / (size / 2),
      });
      oscNode.start();
      oscNode.connect(pannerNode);
      pannerNode.connect(gainNode);
      gainNode.connect(this.unisonMerger);
      return [oscNode, gainNode, pannerNode] as UnisonNode;
    });

    this._unisonDetuneValues = values.map(([detune]) => detune);

    this._unisonNodes = unisonNodes;
    this._unisonNodes.forEach(([osc]) => {
      this.lfoInputNode.connect(osc.frequency);
      this.envelope.connect(osc.frequency);
    });
    return unisonNodes;
  }

  /**
   * Conecta o oscilador a um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination?: AudioNode | AudioParam): void {
    if (!destination) return;
    const dest = destination as AudioNode;
    this.outputNode.connect(dest);
    this.unisonMerger.connect(dest);
    this._destination = destination;
  }
  public start() {
    // this.outputNode.start();
  }
  public stop() {
    // this.outputNode.stop();
  }
  public setType(type: OscillatorType) {
    type = type.toLowerCase() as OscillatorType;
    this._type = type;
    this.outputNode.type = type;
    this._unisonNodes.forEach(([osc]) => (osc.type = type));
  }
  public setFrequency(frequency: number) {
    frequency = frequency || this.minValue;
    this._frequency = frequency;

    frequency *= Math.pow(2, this._pitchOffset / 12);
    if (this._portamentoOn) {
      const portamentoTime = this.currentTime() + this._portamentoTime;
      this.outputNode.frequency.cancelScheduledValues(this.currentTime());
      this.outputNode.frequency.exponentialRampToValueAtTime(
        frequency,
        portamentoTime
      );
      this._unisonNodes.forEach(([osc]) => {
        osc.frequency.cancelScheduledValues(this.currentTime());
        osc.frequency.exponentialRampToValueAtTime(frequency, portamentoTime);
      });
    } else {
      this.outputNode.frequency.setValueAtTime(frequency, this.minValue);
      this._unisonNodes.forEach(([osc]) => (osc.frequency.value = frequency));
    }
  }
  public setDetune(detune: number) {
    detune = detune || this.minValue;
    this._detune = detune;
    this.outputNode.detune.value = detune;
    this._unisonNodes.forEach(([osc], index) => {
      osc.detune.value =
        this._unisonDetuneValues[index] * this._unisonDetune + detune;
    });
  }
  public setPitchOffset(offset: number) {
    this._pitchOffset = offset;
    this.setFrequency(this._frequency);
  }
  public setUnisonSize(size: number) {
    size = Math.min(size, 14);
    this._unisonSize = size;
    this.createUnisonNodes(size / 2, 0.35);
  }
  public setUnisonDetune(detuneAmount: number) {
    detuneAmount = Math.max(0, Math.min(detuneAmount, 100));
    this._unisonDetune = detuneAmount;
    this._unisonNodes.forEach(([osc], index) => {
      osc.detune.value =
        this._unisonDetuneValues[index] * this._unisonDetune + this._detune;
    });
  }
  public setUnisonSpread(spread: number) {
    spread = Math.max(0, Math.min(spread, 100)) / 10000;
    this._unisonSpread = spread;
    spread *= 0.0002;
    this._unisonNodes.forEach(([osc, _, pan]) => {
      pan.positionX.value = osc.detune.value * spread;
    });
  }
  public setPortamentoOn(on: boolean) {
    this._portamentoOn = on;
  }
  public setPortamentoTime(time: number) {
    this._portamentoTime = time;
  }
  public setLfoAmount(value: number) {
    value = Math.max(this.minValue, Math.min(value, this._maxLFOAmount));
    this._lfoDepth = value;
    this.lfoInputNode.gain.value = value * this._maxLFOAmount;
  }
  public get type(): OscillatorType {
    return this._type;
  }
  public get frequency(): number {
    return this._frequency;
  }
  public get detune(): number {
    return this._detune;
  }
  public get pitchOffset(): number {
    return this._pitchOffset;
  }
  public get unisonSize(): number {
    return this._unisonSize;
  }
  public get unisonDetune(): number {
    return this._unisonDetune;
  }
  public get unisonSpread(): number {
    return this._unisonSpread;
  }
  public get unison() {
    return {
      size: this._unisonSize,
      detune: this._unisonDetune,
      spread: this._unisonSpread,
    };
  }
  public get portamentoOn(): boolean {
    return this._portamentoOn;
  }
  public get portamentoTime(): number {
    return this._portamentoTime;
  }
  public getLfoInputNode(): GainNode {
    return this.lfoInputNode;
  }
  public get lfoDepth(): number {
    return this._lfoDepth;
  }
}
