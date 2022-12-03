import autoBind from "auto-bind";
import { Utils } from "common";
import {
  AmplifierModule,
  FilterModule,
  LFOModule,
  Module,
  OscillatorModule,
} from "models";
import {
  IAmplifierParams,
  IFilterParams,
  ILFOParams,
  IOscillatorParams,
} from "models/data";
export class RackController {
  private readonly lfo: LFOModule = new LFOModule();
  private readonly osc: OscillatorModule = new OscillatorModule();
  private readonly filter: FilterModule = new FilterModule();
  private readonly amp: AmplifierModule = new AmplifierModule();
  private voiceMap: Map<
    number,
    [OscillatorModule, FilterModule, AmplifierModule, LFOModule]
  > = new Map();

  constructor() {
    autoBind(this);
    this.lfo.connect(this.osc.getLfoInputNode());
    this.lfo.connect(this.filter.getLfoInputNode());
    this.lfo.connect(this.amp.getLfoInputNode());
    this.osc.connect(this.filter.getInputNode());
    this.filter.connect(this.amp.getInputNode());
    this.lfo.start();
  }
  public get output(): AudioNode {
    return this.amp.getOutputNode();
  }
  public noteOn(note: number, velocity: number): void {
    if (this.voiceMap.get(note)) return;
    const lfo = this.createLFO(this.lfo);
    const osc = this.createOscillator(this.osc);
    const filter = this.createFilter(this.filter);
    const amp = this.createAmplifier(this.amp);
    const noteFrequency = Utils.indexToFrequency(note);
    velocity = (velocity * 0.22) / 127;

    this.amp.setVelocity(velocity);
    this.osc.setFrequency(noteFrequency);
    osc.setFrequency(noteFrequency);
    amp.setVelocity(velocity);

    lfo.connect(amp.getLfoInputNode());
    lfo.connect(osc.getLfoInputNode());
    lfo.connect(filter.getLfoInputNode());

    osc.connect(filter.getInputNode());
    filter.connect(amp.getInputNode());
    amp.connect(Module.context.destination);

    lfo.start();
    osc.envelope.start();
    filter.envelope.start();
    amp.envelope.start();

    this.lfo.start();
    this.osc.envelope.start();
    this.filter.envelope.start();
    this.amp.envelope.start();

    this.voiceMap.set(note, [osc, filter, amp, lfo]);
  }

  public noteOff(note: number): void {
    const modules = this.voiceMap.get(note);
    if (modules) {
      const param = modules?.[2].envelope.getSourceNode().offset;
      modules.forEach((mod) => {
        if (mod instanceof LFOModule) mod.stop();
        else mod.envelope.stop();
        mod.disconnectAtParamValue(param, 0.003);
      });
    }
    if (this.voiceMap.size <= 1) {
      this.osc.envelope.stop();
      this.amp.envelope.stop();
      this.filter.envelope.stop();
      this.lfo.stop();
    }

    this.voiceMap.delete(note);
  }

  public portamentoOn(on: boolean) {
    this.osc.setPortamentoOn(on);
  }
  public portamentoTime(time: number) {
    this.osc.setPortamentoTime(time);
  }

  public legatoOn(on: boolean) {}
  private createOscillator(source?: OscillatorModule | IOscillatorParams) {
    const osc = new OscillatorModule();

    if (source) {
      osc.copyParamsFrom(source);
    }

    return osc;
  }
  private createFilter(source?: FilterModule): FilterModule {
    const filter = new FilterModule();

    if (source) {
      filter.copyParamsFrom(source);
    }

    return filter;
  }
  private createAmplifier(
    source?: AmplifierModule | IAmplifierParams
  ): AmplifierModule {
    const amp = new AmplifierModule();

    if (source) {
      amp.copyParamsFrom(source);
    }

    return amp;
  }
  private createLFO(source?: LFOModule | ILFOParams) {
    const lfo = new LFOModule();

    if (source) {
      lfo.copyParamsFrom(source);
    }

    return lfo;
  }

  public setOscillatorParams(params: IOscillatorParams): void {
    for (const voice of this.voiceMap.values()) {
      const osc = voice[0];
      osc.copyParamsFrom(params);
    }
    this.osc.copyParamsFrom(params);
  }
  public setFilterParams(params: IFilterParams): void {
    for (const voice of this.voiceMap.values()) {
      const filter = voice[1];
      filter.copyParamsFrom(params);
    }
    this.filter.copyParamsFrom(params);
  }
  public setAmplifierParams(params: IAmplifierParams): void {
    for (const voice of this.voiceMap.values()) {
      const amp = voice[2];
      amp.copyParamsFrom(params);
    }
    this.amp.copyParamsFrom(params);
  }
  public setLFOParams(params: ILFOParams): void {
    for (const voice of this.voiceMap.values()) {
      const lfo = voice[3];
      lfo.copyParamsFrom(params);
    }
    this.lfo.copyParamsFrom(params);
  }
}
