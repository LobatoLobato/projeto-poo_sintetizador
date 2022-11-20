import { IEnvelopeParams } from "./IEnvelopeParams";

export interface IOscillatorParams {
  discriminator: "OscillatorParams";
  type?: OscillatorType;
  unison?: IUnisonParams;
  pitchOffset?: number;
  envelope?: IEnvelopeParams;
  detune?: number;
  lfo_depth?: number;
}

export interface IUnisonParams {
  size?: number;
  detune?: number;
  spread?: number;
}
