import { IEnvelopeParams } from "./IEnvelopeParams";

export interface ILFOParams {
  discriminator: "LFOParams";
  type?: OscillatorType;
  rateEnvelope?: IEnvelopeParams;
  ampEnvelope?: IEnvelopeParams;
}
