import { IEnvelopeParams } from "./IEnvelopeParams";

export interface ILFOParams {
  discriminator: "LFOParams";
  type?: OscillatorType;
  rate?: number;
  rateEnvelope?: IEnvelopeParams;
  ampEnvelope?: IEnvelopeParams;
}
