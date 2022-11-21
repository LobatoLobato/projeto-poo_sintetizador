import { Module, EnvelopeModule, IModulatable } from "models";

type UnisonNode = [OscillatorNode, GainNode, PannerNode];

export class OscillatorModule
  extends Module<OscillatorNode>
  implements IModulatable
{
  public readonly lfoInputNode: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  public readonly node: OscillatorNode = new OscillatorNode(Module.context);
  public readonly envelope: EnvelopeModule = new EnvelopeModule(1000, 0);
  private readonly _maxLFOAmount: number = 400;
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
  private _running: boolean = false;

  constructor() {
    super();
    this.envelope.connect(this.node.frequency);
    this.envelope.setSustain(0);
    this.lfoInputNode.connect(this.node.frequency);
    this._unisonNodes.forEach(([osc]) =>
      this.lfoInputNode.connect(osc.frequency)
    );
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
      if (this.destination) gainNode.connect(this.destination);
      return [oscNode, gainNode, pannerNode] as UnisonNode;
    });

    this._unisonDetuneValues = values.map(([detune]) => detune);
    this._unisonNodes.forEach(([osc, gain]) => {
      gain.gain.linearRampToValueAtTime(
        this.minValue,
        this.currentTime() + 0.03
      );
      setTimeout(() => osc.stop(), 0.06);
    });
    this._unisonNodes = unisonNodes;
    this._unisonNodes.forEach((node) =>
      this.lfoInputNode.connect(node[0].frequency)
    );
    return unisonNodes;
  }

  /**
   * Conecta o oscilador a um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination?: AudioNode | AudioParam, output?: number): void {
    if (!destination) return;
    if (destination instanceof AudioNode) {
      this.node.connect(destination, output);
      this._unisonNodes.forEach(([_, gain]) =>
        gain.connect(destination, output)
      );
    }
    if (destination instanceof AudioParam) {
      this.node.connect(destination, output);
      this._unisonNodes.forEach(([_, gain]) =>
        gain.connect(destination, output)
      );
    }
    this._destination = destination;
  }
  /**
   * Inicia o oscilador
   */
  public start(): void {
    if (this._running) return;
    this.node.start();
    this._unisonNodes.forEach(([osc]) => osc.start());
    this._running = true;
  }
  /**
   * Para o oscilador
   */
  public stop(): void {
    if (!this._running) return;
    this.node.stop();
    this._unisonNodes.forEach(([osc]) => osc.stop());
    this._running = false;
  }

  public set type(type: OscillatorType) {
    type = type.toLowerCase() as OscillatorType;
    this._type = type;
    this.node.type = type;
    this._unisonNodes.forEach(([osc]) => (osc.type = type));
  }
  public set frequency(frequency: number) {
    frequency = frequency || this.minValue;
    this._frequency = frequency;

    frequency *= Math.pow(2, this._pitchOffset / 12);
    if (this._portamentoOn) {
      const portamentoTime = this.currentTime() + this._portamentoTime;
      this.node.frequency.cancelScheduledValues(this.currentTime());
      this.node.frequency.exponentialRampToValueAtTime(
        frequency,
        portamentoTime
      );
      this._unisonNodes.forEach(([osc]) => {
        osc.frequency.cancelScheduledValues(this.currentTime());
        osc.frequency.exponentialRampToValueAtTime(frequency, portamentoTime);
      });
    } else {
      this.node.frequency.setValueAtTime(frequency, this.minValue);
      this._unisonNodes.forEach(([osc]) => (osc.frequency.value = frequency));
    }
  }
  public set detune(detune: number) {
    detune = detune || this.minValue;
    this._detune = detune;
    this.node.detune.value = detune;
    this._unisonNodes.forEach(([osc], index) => {
      osc.detune.value = this._unisonDetuneValues[index] + detune;
    });
  }
  public set pitchOffset(offset: number) {
    this._pitchOffset = offset;
    this.frequency = this._frequency;
  }
  public set unisonSize(size: number) {
    size = Math.min(size, 14);
    this._unisonSize = size;
    this.createUnisonNodes(size / 2, 0.35);
  }
  public set unisonDetune(detuneAmount: number) {
    detuneAmount = Math.max(0, Math.min(detuneAmount, 100));
    this._unisonDetune = detuneAmount;
    this._unisonNodes.forEach(([osc], index) => {
      osc.detune.value = this._unisonDetuneValues[index] * detuneAmount;
    });
  }
  public set unisonSpread(spread: number) {
    spread = Math.max(0, Math.min(spread, 100)) / 10000;
    this._unisonSpread = spread;
    spread *= 0.02;
    this._unisonNodes.forEach(([osc, _, pan]) => {
      pan.positionX.value = osc.detune.value * spread;
    });
  }
  public set portamentoOn(on: boolean) {
    this._portamentoOn = on;
  }
  public set portamentoTime(time: number) {
    this._portamentoTime = time;
  }
  public set lfoAmount(value: number) {
    value = Math.max(this.minValue, Math.min(value, this._maxLFOAmount));
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
  public get unisonSpread(): number {
    return this._unisonSpread;
  }
  public get portamentoOn(): boolean {
    return this._portamentoOn;
  }
  public get portamentoTime(): number {
    return this._portamentoTime;
  }
}
