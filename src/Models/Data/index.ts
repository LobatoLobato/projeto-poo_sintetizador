import type { IAmplifierParams } from "./IAmplifierParams";
import type { IOscillatorParams, IUnisonParams } from "./IOscillatorParams";
import type { IEnvelopeParams } from "./IEnvelopeParams";
import type { ILFOParams } from "./ILFOParams";
import type { IFilterParams } from "./IFilterParams";
export type PresetParamContainer =
  | IAmplifierParams
  | IOscillatorParams
  | ILFOParams
  | IFilterParams;

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
  IFilterParams,
};
