import { EnvelopeModule } from "models";

export interface IModulatable {
  readonly envelope: EnvelopeModule;
  readonly lfoInputNode: GainNode;
  setLfoAmount(value: number): void;
}
