import { Module, Modulatable } from "models";
import { EnvelopeModule } from "./EnvelopeModule";

export class FilterModule extends Module implements Modulatable {
  envelope: EnvelopeModule = new EnvelopeModule(1);
  lfoInputNode: GainNode = new GainNode(Module.context, { gain: 1 });
  set lfoAmount(value: number) {
    throw new Error("Method not implemented.");
  }
  protected node: BiquadFilterNode = new BiquadFilterNode(Module.context, {});
  public start(): void {
    throw new Error("Method not implemented.");
  }
  public stop(): void {
    throw new Error("Method not implemented.");
  }
}
