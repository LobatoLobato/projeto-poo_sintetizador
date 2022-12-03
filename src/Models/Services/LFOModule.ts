import {
  Module,
  OscillatorModule,
  AmplifierModule,
  EnvelopeModule,
} from "models";
import type { IModulator } from "models";
import { IEnvelopeParams, ILFOParams } from "models/data";

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

  public copyParamsFrom(source: LFOModule | ILFOParams): void {
    let ampEnvelope: EnvelopeModule | IEnvelopeParams | undefined;
    let rateEnvelope: EnvelopeModule | IEnvelopeParams | undefined;
    let type: OscillatorType | undefined;

    if (source instanceof LFOModule) {
      type = source.osc.type;
      rateEnvelope = source.osc.envelope;
      ampEnvelope = source.amp.envelope;
    } else {
      type = source.type;
      rateEnvelope = source.rateEnvelope;
      ampEnvelope = source.ampEnvelope;
    }
    if (type && type !== this.osc.type) {
      this.osc.setType(type);
    }
    if (rateEnvelope) {
      this.osc.envelope.copyParamsFrom(rateEnvelope);
    }
    if (ampEnvelope) {
      this.amp.envelope.copyParamsFrom(ampEnvelope);
    }
  }
}
