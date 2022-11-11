import { Module } from "./Module";

export class OscillatorModule extends Module {
  public readonly node: OscillatorNode = new OscillatorNode(Module.context);
  private readonly _unisonNodes: [OscillatorNode, GainNode, PannerNode][] = [];
  private readonly _unisonDetuneValues: number[] = [
    -7, 7, -14, 14, -21, 21, -28, 28, -35, 35, -42, 42, -50, 50,
  ];
  private _type: OscillatorType = "sine";
  private _frequency: number = 440;
  private _detune: number = 0;
  private _pitchOffset: number = 0;
  private _unisonSize: number = 0;
  private _unisonSpread: number = 0;
  private _running: boolean = false;
  constructor() {
    super();
    this._unisonNodes = this._unisonDetuneValues.map((detuneValue) => {
      const unisonOscNode = new OscillatorNode(Module.context, {
        detune: detuneValue,
      });
      const unisonPanNode = new PannerNode(Module.context, {
        positionX: detuneValue * 0.01,
      });
      const unisonGainNode = new GainNode(Module.context, { gain: 0 });
      unisonOscNode.connect(unisonPanNode);
      unisonPanNode.connect(unisonGainNode);
      return [unisonOscNode, unisonGainNode, unisonPanNode];
    });
  }

  /**
   * Conecta o oscilador a um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination: AudioNode): void {
    this._destination = destination;
    this.node.connect(destination);
    this._unisonNodes.forEach(([_, gain]) => gain.connect(destination));
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
    this.node.frequency.value = frequency;
    this._unisonNodes.forEach(([osc]) => (osc.frequency.value = frequency));
  }
  public set detune(detune: number) {
    detune = detune || this.minValue;
    this._detune = detune;
    this.node.detune.value = detune;
    this._unisonNodes.forEach(
      ([osc], index) =>
        (osc.detune.value = this._unisonDetuneValues[index] + detune)
    );
  }
  public set pitchOffset(offset: number) {
    this._pitchOffset = offset;
    this.frequency = this._frequency;
  }
  public set unisonSize(size: number) {
    size = Math.min(size, 14);
    this._unisonSize = size;
    this._unisonNodes.forEach(([_, gain], index) => {
      gain.gain.value = index < size ? 0.4 : 0;
    });
  }
  public set unisonSpread(spread: number) {
    spread = Math.max(0, Math.min(spread, 100));
    this._unisonSpread = spread;
    spread *= 0.0002;
    this._unisonNodes.forEach(([osc, _, pan]) => {
      pan.positionX.value = osc.detune.value * spread;
    });
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
}
