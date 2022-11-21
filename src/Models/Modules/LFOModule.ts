import { Module, OscillatorModule, AmplifierModule } from "models";

export class LFOModule extends Module<GainNode> {
  public readonly osc: OscillatorModule = new OscillatorModule();
  public readonly amp: AmplifierModule = new AmplifierModule();
  public readonly node: GainNode = this.amp.node;

  constructor() {
    super();
    this.osc.connect(this.amp.inputNode);
    this.osc.start();
    this.osc.frequency = this.minValue;
    this.osc.envelope.setSustain(1);
    this.amp.envelope.setAmount(0.5);
  }
  public start(): void {
    this.osc.envelope.start();
    this.amp.envelope.start();
  }
  public stop(): void {
    this.osc.envelope.stop();
    this.amp.envelope.stop();
  }
}
