import { useState } from "react";
import { Envelope, WaveformSelector } from "components";
import {
  useLoadFromPreset,
  useOnParamsChange,
  useParamUpdater,
  useSaveToPreset,
} from "hooks";
import "./LFO.scss";
import { ModuleProps } from "models";
import { ILFOParams } from "models/Data";

export function LFO(props: ModuleProps<ILFOParams>) {
  const { onChange, savePreset, loadPreset } = props;
  const params = useState<ILFOParams>({
    discriminator: "LFOParams",
  });
  const [setParam, loadParam] = useParamUpdater(params, loadPreset);

  useOnParamsChange(params[0], onChange);
  useSaveToPreset(params[0], savePreset);
  useLoadFromPreset(params, loadPreset);

  return (
    <div className="lfo-container">
      LFO
      <WaveformSelector
        onClick={(type) => setParam("type", type)}
        value={loadParam("type")}
      />
      <Envelope
        title="Rate"
        className="flex h-full flex-col bg-zinc-700"
        onChange={(rateEnvelope) => setParam("rateEnvelope", rateEnvelope)}
        values={loadParam("rateEnvelope")}
        amount={{ logarithmic: true, max: 1000 }}
        sustain={{ initial: 1 }}
      />
      <Envelope
        title="Amplitude"
        className="flex h-full flex-col bg-zinc-700"
        onChange={(ampEnvelope) => setParam("ampEnvelope", ampEnvelope)}
        values={loadParam("ampEnvelope")}
        amount={{ initial: 0.5 }}
        sustain={{ initial: 1 }}
      />
    </div>
  );
}
