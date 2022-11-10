import { EnvelopeModule } from "./EnvelopeModule";
import { Module } from "./Module";

export class AmplifierModule extends Module {
  public readonly node: GainNode = new GainNode(Module.context, {
    gain: 0.022,
  });
  private _envelope: EnvelopeModule = new EnvelopeModule();
  private _level: number = 0.022;

  constructor() {
    super();
    this.node.connect(this._envelope.node);
  }

  /**
   * Conecta o amplificador a um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination: AudioNode) {
    this._envelope.connect(destination);
  }
  /**
   * Inicia o envelope do amplificador
   */
  public start(): void {
    this._envelope.start();
  }
  /**
   * Para o envelope do amplificador
   */
  public stop(): void {
    this._envelope.stop();
  }

  get envelope(): EnvelopeModule {
    return this._envelope;
  }
  get level() {
    return this._level;
  }
  set level(value: number) {
    value = Math.max(value, this.minValue);
    this._level = this.node.gain.value = value;
  }
}
