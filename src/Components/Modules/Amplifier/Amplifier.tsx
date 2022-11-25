import { useEffect, useState } from "react";
import { Envelope, AudioVisualizer, Slider } from "components";
import {
  useLoadFromPreset,
  useOnParamsChange,
  useParamUpdater,
  useSaveToPreset,
} from "hooks";
import "./Amplifier.scss";
import { ModuleProps, VisualizerModule } from "models";
import { IAmplifierParams } from "models/Data";

interface AmplifierProps extends ModuleProps<IAmplifierParams> {
  onMount(visualizer: VisualizerModule): void;
}
export function Amplifier(props: AmplifierProps) {
  const { onChange, onMount, savePreset, loadPreset } = props;
  const [visualizer, setVisualizer] = useState<VisualizerModule>();
  const params = useState<IAmplifierParams>({
    discriminator: "AmplifierParams",
  });
  const [setParam, loadParam] = useParamUpdater(params, loadPreset);

  useOnParamsChange(params[0], onChange);
  useSaveToPreset(params[0], savePreset);
  useLoadFromPreset(params, loadPreset);

  useEffect(() => {
    if (visualizer) onMount?.(visualizer);
  }, [visualizer, onMount]);

  return (
    <div className="amplifier">
      Amplifier
      <div className="visualizer-container">
        <AudioVisualizer className="visualizer" onMount={setVisualizer} />
      </div>
      <Envelope
        className="amplifier-envelope"
        amount={{ initial: 0.22 }}
        sustain={{ initial: 1 }}
        onChange={(envelope) => setParam("envelope", envelope)}
        values={loadParam("envelope")}
      />
      <div className="lfo-slider">
        <p>LFO Depth</p>
        <Slider
          max={1}
          step={0.01}
          onInput={(lfoDepth) => setParam("lfoDepth", lfoDepth)}
          value={loadParam("lfoDepth")}
        />
      </div>
    </div>
  );
}
