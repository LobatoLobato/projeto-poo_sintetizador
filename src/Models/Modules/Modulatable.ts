import { EnvelopeModule } from "models";

export interface Modulatable {
  readonly envelope: EnvelopeModule;
  readonly lfoInputNode: GainNode;
  set lfoAmount(value: number);
}
