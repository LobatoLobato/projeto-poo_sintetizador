import type { IAmplifierParams } from "./IAmplifierParams";
import type { IOscillatorParams, IUnisonParams } from "./IOscillatorParams";
import type { IEnvelopeParams } from "./IEnvelopeParams";
import type { ILFOParams } from "./ILFOParams";
export type PresetParamContainer =
  | IAmplifierParams
  | IOscillatorParams
  | ILFOParams;

export interface IDataInterfaces {
  AmplifierParams: IAmplifierParams;
  OscillatorParams: IOscillatorParams;
  LFOParams: ILFOParams;
}

export {
  IAmplifierParams,
  IOscillatorParams,
  IEnvelopeParams,
  IUnisonParams,
  ILFOParams,
};
