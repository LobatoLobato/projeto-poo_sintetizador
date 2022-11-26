import autoBind from "auto-bind";
import { Module, EnvelopeModule, IModulatable } from "models";

type UnisonNode = [OscillatorNode, GainNode, PannerNode];
type Unison = {
  nodes: UnisonNode[];
  detuneValues: number[];
  size: number;
  detune: number;
  spread: number;
};

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
  private _maxDetune: number = 0.5;
  private _type: OscillatorType = "sine";
  private _frequency: number = 449;
  private _detune: number = 0;
  private _pitchOffset: number = 0;
  private _portamento: { on: boolean; time: number } = { on: false, time: 0 };
  private _unison: Unison = {
    nodes: [],
    detuneValues: [],
    size: 0,
    detune: 0,
    spread: 0,
  };

  constructor() {
    super();
    autoBind(this);
    this.envelope.connect(this.outputNode.frequency);
    this.envelope.setSustain(0);
    this.lfoInputNode.connect(this.outputNode.frequency);
    this.outputNode.start();
  }
  private createUnisonNodes(size: number, gain: number): UnisonNode[] {
    const detuneIncrement = this._maxDetune / size;
    const panIncrement = this._unison.spread / size;
    let values: [number, number][] = [];
    for (let i = 0; i < size; i++) {
      const detune = this._maxDetune - detuneIncrement * i;
      const pan = this._unison.spread - panIncrement * i;
      values = [...values, [detune, pan], [-detune, -pan]];
    }
    this._unison.nodes.forEach(([o, g, p]) => {
      o.disconnect();
      g.disconnect();
      p.disconnect();
    });
    const unisonNodes = values.map(([detune, positionX]) => {
      const oscNode = new OscillatorNode(Module.context, {
        detune: detune * this._unison.detune + this.detune,
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

    this._unison.detuneValues = values.map(([detune]) => detune);

    this._unison.nodes = unisonNodes;
    this._unison.nodes.forEach(([osc]) => {
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
  /**
   * Define o tipo da forma de onda do oscilador
   * @param type O tipo da forma de onda
   */
  public setType(type: OscillatorType) {
    type = type.toLowerCase() as OscillatorType;
    this._type = type;
    this.outputNode.type = type;
    this._unison.nodes.forEach(([osc]) => (osc.type = type));
  }
  /**
   * Define a frequencia do oscilador
   * @param frequency A frequencia
   */
  public setFrequency(frequency: number) {
    frequency = frequency || this.minValue;
    this._frequency = frequency;

    frequency *= Math.pow(2, this._pitchOffset / 12); // Junta a frequencia com o offset
    // Se o portamento estiver ligado muda a frequencia de acordo com o tempo de portamento
    if (this._portamento.on) {
      const portamentoTime = this.now() + this._portamento.time;
      this.outputNode.frequency.cancelScheduledValues(this.now());
      this.outputNode.frequency.exponentialRampToValueAtTime(
        frequency,
        portamentoTime
      );
      this._unison.nodes.forEach(([osc]) => {
        osc.frequency.cancelScheduledValues(this.now());
        osc.frequency.exponentialRampToValueAtTime(frequency, portamentoTime);
      });
    }
    // Se o portamento estiver desligado muda a frequencia instantaneamente
    else {
      this.outputNode.frequency.setValueAtTime(frequency, this.now());
      this._unison.nodes.forEach(([osc]) => (osc.frequency.value = frequency));
    }
  }
  /**
   * Define o detune do oscilador
   * @param detune O valor em cents do detune
   */
  public setDetune(detune: number) {
    detune = detune || this.minValue;
    this._detune = detune;
    this.outputNode.detune.value = detune;
    this._unison.nodes.forEach(([osc], i) => {
      const unisonDetune = this._unison.detuneValues[i] * this._unison.detune;
      osc.detune.value = unisonDetune + detune;
    });
  }
  /**
   * Define o offset (quantizado) da frequencia do oscilador
   * @param offset O offset em índice
   */
  public setPitchOffset(offset: number) {
    this._pitchOffset = offset;
    this.setFrequency(this._frequency);
  }
  /**
   * Define a quantidade de vozes em uníssono com o oscilador principal
   * @param size A quantidade de vozes em uníssono
   */
  public setUnisonSize(size: number) {
    size = Math.min(size, 14);
    this._unison.size = size;
    this.createUnisonNodes(size / 2, 0.35);
  }
  /**
   * Define a o detune das vozes em uníssono com o oscilador principal
   * @param detuneAmount O detune das vozes em uníssono
   */
  public setUnisonDetune(detuneAmount: number) {
    detuneAmount = Math.max(0, Math.min(detuneAmount, 100));
    this._unison.detune = detuneAmount;
    this._unison.nodes.forEach(([osc], index) => {
      osc.detune.value =
        this._unison.detuneValues[index] * this._unison.detune + this._detune;
    });
  }
  /**
   * Define o espalhamento das vozes em uníssono com o oscilador principal
   * @param spread O espalhamento das vozes em uníssono
   */
  public setUnisonSpread(spread: number) {
    spread = Math.max(0, Math.min(spread, 100)) / 10000;
    this._unison.spread = spread;
    spread *= 0.0002;
    this._unison.nodes.forEach(([osc, _, pan]) => {
      pan.positionX.value = osc.detune.value * spread;
    });
  }
  /**
   * Liga o portamento no oscilador
   * @param on
   */
  public setPortamentoOn(on: boolean) {
    this._portamento.on = on;
  }
  /**
   * Define o tempo do portamento
   * @param time Tempo em segundos
   */
  public setPortamentoTime(time: number) {
    this._portamento.time = time;
  }
  /**
   * Define a profundidade do lfo modulando o oscilador
   * @param depth A profundidade///////,,
   */
  public setLfoDepth(depth: number) {
    depth = Math.max(this.minValue, Math.min(depth, this._maxLFOAmount));
    this._lfoDepth = depth;
    this.lfoInputNode.gain.value = depth * this._maxLFOAmount;
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
    return this._unison.size;
  }
  public get unisonDetune(): number {
    return this._unison.detune;
  }
  public get unisonSpread(): number {
    return this._unison.spread;
  }
  public get unison() {
    return {
      size: this._unison.size,
      detune: this._unison.detune,
      spread: this._unison.spread,
    };
  }
  public get portamentoOn(): boolean {
    return this._portamento.on;
  }
  public get portamentoTime(): number {
    return this._portamento.time;
  }
  public getLfoInputNode(): GainNode {
    return this.lfoInputNode;
  }
  public get lfoDepth(): number {
    return this._lfoDepth;
  }
}
