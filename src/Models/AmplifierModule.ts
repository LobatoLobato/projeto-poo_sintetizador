import { EnvelopeModule } from "./EnvelopeModule";
import { Module } from "./Module";

export class AmplifierModule extends Module {
  public readonly node: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  public readonly envelope: EnvelopeModule = new EnvelopeModule(1, 0.22);
  private _level: number = 0.22;

  constructor() {
    super();
    this.envelope.connect(this.node.gain);
    this.envelope.amount = 0.22;
  }

  /**
   * Conecta o amplificador a um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination: AudioNode) {
    this.node.connect(destination);
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
  }
}
