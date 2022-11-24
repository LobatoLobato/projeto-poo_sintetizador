import { IEnvelopeParams } from "./IEnvelopeParams";

export interface IFilterParams {
  discriminator: "FilterParams";
  type?: BiquadFilterType | "bypass";
  cutoffFrequency?: number;
  Q?: number;
  slope?: "-24dB" | "-12dB";
  envelope?: IEnvelopeParams;
  driveAmount?: number;
  lfoDepth?: number;
}
