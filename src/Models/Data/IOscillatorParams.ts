import { IEnvelopeParams } from "./IEnvelopeParams";

export interface IOscillatorParams {
  discriminator: "OscillatorParams";
  type?: OscillatorType;
  unison?: IUnisonParams;
  pitchOffset?: number;
  envelope?: IEnvelopeParams;
  detune?: number;
  lfoDepth?: number;
}

export interface IUnisonParams {
  size?: number;
  detune?: number;
  spread?: number;
}
