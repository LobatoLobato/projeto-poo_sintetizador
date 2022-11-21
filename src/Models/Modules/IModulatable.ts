import { EnvelopeModule } from "models";

export interface IModulatable {
  readonly envelope: EnvelopeModule;
  readonly lfoInputNode: GainNode;
  set lfoAmount(value: number);
}
