import { Module, OscillatorModule, AmplifierModule } from "models";
import type { IModulator } from "models";

export class LFOModule extends Module<GainNode> implements IModulator {
  public readonly osc: OscillatorModule = new OscillatorModule();
  public readonly amp: AmplifierModule = new AmplifierModule();
  protected inputNode: GainNode = this.amp.getInputNode();
  protected outputNode: GainNode = this.amp.getOutputNode();

  constructor() {
    super();
    this.osc.connect(this.amp.getInputNode());
    this.osc.setFrequency(this.minValue);
    this.osc.envelope.setSustain(1);
    this.amp.envelope.setAmount(0.5);
  }
  /**
   * Inicia o envelope do amplificador e do oscilador ao mesmo tempo
   */
  public start(): void {
    this.osc.envelope.start();
    this.amp.envelope.start();
  }

  /**
   * Para o envelope do amplificador e do oscilador ao mesmo tempo
   */
  public stop(): void {
    this.osc.envelope.stop();
    this.amp.envelope.stop();
  }
}
