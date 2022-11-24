import { EnvelopeModule } from "models";

export interface IModulatable {
  readonly envelope: EnvelopeModule;
  readonly lfoInputNode: GainNode;
  getLfoInputNode(): GainNode;
  setLfoAmount(value: number): void;
  get lfoDepth(): number;
}
