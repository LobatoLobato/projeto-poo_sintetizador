import { ModuleProps } from "models";
import { Envelope, WaveformSelector } from "components";
import { useEffect, useState } from "react";
import "./LFO.scss";
import { PRESET_MANAGER } from "controller";
import { IEnvelopeParams, ILFOParams } from "models/Data";

export function LFO(props: ModuleProps<ILFOParams>) {
  const [type, setType] = useState<OscillatorType | undefined>("sine");
  const rateEnvelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };
  const ampEnvelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };

  const [lfoParams, setLFOParams] = useState<ILFOParams>({
    discriminator: "LFOParams",
  });
  const { onChange } = props;
  const { savePreset, loadPreset } = props;
  useEffect(() => {
    if (!savePreset) return;
    PRESET_MANAGER.saveToCurrentPreset<ILFOParams>(lfoParams);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPreset]);

  useEffect(() => {
    onChange?.(lfoParams);
  }, [lfoParams, onChange]);
  return (
    <div className="lfo-container">
      LFO
      <WaveformSelector
        onClick={(type) => {
          // lfo.osc.setType(type);
          setLFOParams((p) => ({ ...p, type }));
        }}
        value={type}
      />
      <Envelope
        title="Rate"
        className="flex h-full flex-col bg-zinc-700"
        onMount={rateEnvelope.setValues[1]}
        onChange={(rateEnvelope) =>
          setLFOParams((p) => ({ ...p, rateEnvelope }))
        }
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
        onMount={ampEnvelope.setValues[1]}
        onChange={(ampEnvelope) => setLFOParams((p) => ({ ...p, ampEnvelope }))}
        amount={{ initial: 0.5 }}
        sustain={{ initial: 1 }}
      />
    </div>
  );
}
