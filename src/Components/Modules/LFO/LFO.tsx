import { LFOModule, ModuleProps } from "models";
import { Envelope, WaveformSelector } from "components";
import { useEffect, useMemo, useState } from "react";
import "./LFO.scss";
import { PRESET_MANAGER } from "controller";
import { IEnvelopeParams, ILFOParams } from "models/Data";

export function LFO(props: ModuleProps<LFOModule>) {
  const lfo = useMemo(() => new LFOModule(), []);
  const [type, setType] = useState<OscillatorType | undefined>("sine");
  const rateEnvelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };
  const ampEnvelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };

  const { connectTo, noteOn, noteOff } = props;
  const { savePreset, loadPreset } = props;
  useEffect(() => {
    if (!savePreset) return;
    const [getRateEnvelopeValues] = rateEnvelope.getValues;
    const [getAmpEnvelopeValues] = ampEnvelope.getValues;
    PRESET_MANAGER.saveToCurrentPreset<ILFOParams>({
      discriminator: "LFOParams",
      type: type,
      rateEnvelope: getRateEnvelopeValues?.(),
      ampEnvelope: getAmpEnvelopeValues?.(),
    });
    console.log("Saving lfo parameters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePreset]);
  useEffect(() => {
    if (!loadPreset) return;
    const params = PRESET_MANAGER.loadFromCurrentPreset("LFOParams");
    const [setRateEnvelopeValues] = rateEnvelope.setValues;
    const [setAmpEnvelopeValues] = ampEnvelope.setValues;
    setType(params.type);
    setRateEnvelopeValues?.(params.rateEnvelope);
    setAmpEnvelopeValues?.(params.ampEnvelope);
    console.log("Loading lfo parameters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPreset]);

  useEffect(() => {
    if (!connectTo) return;
    if (Array.isArray(connectTo)) {
      connectTo.forEach((destination) => lfo.connect(destination));
    } else {
      lfo.connect(connectTo);
    }
  }, [connectTo, lfo]);
  useEffect(() => {
    if (!noteOn || (noteOn.note < 0 && !noteOn.active)) return;
    lfo.start();
  }, [noteOn, lfo]);

  useEffect(() => {
    if (!noteOff || !noteOff.active) return;
    lfo.stop();
  }, [noteOff, lfo]);

  return (
    <div className="lfo-container">
      LFO
      <WaveformSelector
        onClick={(wave) => lfo.osc.setType(wave)}
        value={type}
      />
      <Envelope
        title="Rate"
        className="flex h-full flex-col bg-zinc-700"
        onMount={(get, set) => {
          rateEnvelope.getValues[1](get);
          rateEnvelope.setValues[1](set);
        }}
        envelopeModule={lfo.osc.envelope}
        amount={{
          logarithmic: true,
          max: 1000,
        }}
        sustain={{
          initial: 1,
        }}
      />
      <Envelope
        title="Amplitude"
        className="flex h-full flex-col bg-zinc-700"
        onMount={(get, set) => {
          ampEnvelope.getValues[1](get);
          ampEnvelope.setValues[1](set);
        }}
        envelopeModule={lfo.amp.envelope}
        amount={{
          initial: 0.5,
        }}
        sustain={{
          initial: 1,
        }}
      />
    </div>
  );
}
