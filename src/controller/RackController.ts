import autoBind from "auto-bind";
import { Utils } from "common";
import {
  AmplifierModule,
  EnvelopeModule,
  FilterModule,
  LFOModule,
  Module,
  OscillatorModule,
} from "models";
import {
  IAmplifierParams,
  IEnvelopeParams,
  IFilterParams,
  ILFOParams,
  IOscillatorParams,
} from "models/Data";

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
      this.copyOscillatorParams(osc, source);
    }
    return osc;
  }
  private createFilter(source?: FilterModule): FilterModule {
    const filter = new FilterModule();

    if (source) {
      this.copyFilterParams(filter, source);
    }

    return filter;
  }
  private createAmplifier(
    source?: AmplifierModule | IAmplifierParams
  ): AmplifierModule {
    const amp = new AmplifierModule();

    if (source) {
      this.copyAmplifierParams(amp, source);
    }
    return amp;
  }
  private createLFO(source?: LFOModule | ILFOParams) {
    const lfo = new LFOModule();
    if (source) {
      this.copyLFOParams(lfo, source);
    }

    return lfo;
  }

  public setOscillatorParams(params: IOscillatorParams): void {
    for (const voice of this.voiceMap.values()) {
      const osc = voice[0];
      this.copyOscillatorParams(osc, params);
    }
    this.copyOscillatorParams(this.osc, params);
  }
  public setFilterParams(params: IFilterParams): void {
    for (const voice of this.voiceMap.values()) {
      const filter = voice[1];
      this.copyFilterParams(filter, params);
    }
    this.copyFilterParams(this.filter, params);
  }
  public setAmplifierParams(params: IAmplifierParams): void {
    for (const voice of this.voiceMap.values()) {
      const amp = voice[2];
      this.copyAmplifierParams(amp, params);
    }
    this.copyAmplifierParams(this.amp, params);
  }
  public setLFOParams(params: ILFOParams): void {
    for (const voice of this.voiceMap.values()) {
      const lfo = voice[3];
      this.copyLFOParams(lfo, params);
    }
    this.copyLFOParams(this.lfo, params);
  }

  private copyLFOParams(
    target: LFOModule,
    source: LFOModule | ILFOParams
  ): void {
    let ampEnvelope: EnvelopeModule | IEnvelopeParams | undefined;
    let rateEnvelope: EnvelopeModule | IEnvelopeParams | undefined;
    let type: OscillatorType | undefined;

    if (source instanceof LFOModule) {
      type = source.osc.type;
      rateEnvelope = source.osc.envelope;
      ampEnvelope = source.amp.envelope;
    } else {
      type = source.type;
      rateEnvelope = source.rateEnvelope;
      ampEnvelope = source.ampEnvelope;
    }
    if (type && type !== target.osc.type) {
      target.osc.setType(type);
    }
    if (rateEnvelope) {
      this.copyEnvelopeParams(target.osc.envelope, rateEnvelope);
    }
    if (ampEnvelope) {
      this.copyEnvelopeParams(target.amp.envelope, ampEnvelope);
    }
  }
  private copyOscillatorParams(
    target: OscillatorModule,
    source: OscillatorModule | IOscillatorParams
  ): void {
    const { type, detune, pitchOffset, unison, envelope } = source;
    const lfoDepth = source.lfoDepth;
    const changedType = type !== undefined && type !== target.type;
    const changedDetune = detune !== undefined && detune !== target.detune;
    const changedPO =
      pitchOffset !== undefined && pitchOffset !== target.pitchOffset;
    const changedLfoDepth =
      lfoDepth !== undefined && lfoDepth !== target.lfoDepth;
    if (changedType) target.setType(type);
    if (changedDetune) target.setDetune(detune);
    if (changedPO) target.setPitchOffset(pitchOffset);
    if (changedLfoDepth) target.setLfoDepth(lfoDepth);
    if (envelope) this.copyEnvelopeParams(target.envelope, envelope);
    if (unison) {
      const { size, detune, spread } = unison;
      const changedSize = size !== undefined && size !== target.unisonSize;
      const changedDetune =
        detune !== undefined && detune !== target.unisonDetune;
      const changedSpread =
        spread !== undefined && spread !== target.unisonSpread;
      if (changedSize) target.setUnisonSize(size);
      if (changedDetune) target.setUnisonDetune(detune);
      if (changedSpread) target.setUnisonSpread(spread);
    }
  }
  private copyFilterParams(
    target: FilterModule,
    source: FilterModule | IFilterParams
  ): void {
    const { type, cutoffFrequency, Q, slope, driveAmount, lfoDepth, envelope } =
      source;
    const changedCutoff =
      cutoffFrequency !== undefined &&
      cutoffFrequency !== target.cutoffFrequency;
    const changedQ = Q !== undefined && Q !== target.Q;
    const changedSlope = slope !== undefined && slope !== target.slope;
    const changedType = type !== undefined && type !== target.type;
    const changedDriveAmount =
      driveAmount !== undefined && driveAmount !== target.driveAmount;
    const changedLfoDepth =
      lfoDepth !== undefined && lfoDepth !== target.lfoDepth;
    if (changedType) target.setType(type);
    if (changedCutoff) target.setCutoff(cutoffFrequency);
    if (changedQ) target.setQ(Q);
    if (changedSlope) target.setSlope(slope);
    if (changedDriveAmount) target.setDrive(driveAmount);
    if (changedLfoDepth) target.setLfoDepth(lfoDepth);
    if (envelope) this.copyEnvelopeParams(target.envelope, envelope);
  }
  private copyAmplifierParams(
    target: AmplifierModule,
    source: AmplifierModule | IAmplifierParams
  ): void {
    const { lfoDepth, envelope } = source;
    const changedLfoDepth =
      lfoDepth !== undefined && lfoDepth !== target.lfoDepth;
    if (changedLfoDepth) target.setLfoDepth(lfoDepth);
    if (envelope) this.copyEnvelopeParams(target.envelope, envelope);
  }
  private copyEnvelopeParams(target: EnvelopeModule, source: IEnvelopeParams) {
    const { amount, attack, decay, sustain, release } = source;
    if (amount !== undefined) target.setAmount(amount);
    if (attack !== undefined) target.setAttack(attack);
    if (decay !== undefined) target.setDecay(decay);
    if (sustain !== undefined) target.setSustain(sustain);
    if (release !== undefined) target.setRelease(release);
  }
}
