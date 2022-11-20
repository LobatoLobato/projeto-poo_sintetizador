import { IEnvelopeParams } from "./IEnvelopeParams";

export interface IAmplifierParams {
  discriminator: "AmplifierParams";
  envelope?: IEnvelopeParams;
  lfo_depth?: number;
}
