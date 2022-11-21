import { IEnvelopeParams } from "./IEnvelopeParams";

export interface IFilterParams {
  discriminator: "FilterParams";
  type: BiquadFilterType;
  cutoffFrequency: number;
  cutoffOffset: number;
  resonance: number;
  slope: number;
  envelope: IEnvelopeParams;
}
