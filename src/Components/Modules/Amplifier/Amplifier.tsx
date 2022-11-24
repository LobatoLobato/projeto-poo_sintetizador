import { useEffect, useState } from "react";
import "./Amplifier.scss";
import { ModuleProps, VisualizerModule } from "models";
import { Envelope, AudioVisualizer, Slider2 } from "components";
import { IAmplifierParams, IEnvelopeParams } from "models/Data";
import { PRESET_MANAGER } from "controller";

interface AmplifierProps extends ModuleProps<IAmplifierParams> {
  onMount(visualizer: VisualizerModule): void;
}
export function Amplifier(props: AmplifierProps) {
  const [visualizer, setVisualizer] = useState<VisualizerModule>();
  const lfoSlider = {
    setValue: useState<(value: number, linearize?: boolean) => void>(),
  };
  const envelope = {
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };
  const [ampParams, setAmpParams] = useState<IAmplifierParams>({
    discriminator: "AmplifierParams",
  });
  const { onChange, onMount } = props;
  const { savePreset, loadPreset } = props;

  useEffect(() => {
    onChange?.(ampParams);
  }, [ampParams, onChange]);

  useEffect(() => {
    if (visualizer) onMount?.(visualizer);
  }, [visualizer, onMount]);

  useEffect(() => {
    if (!savePreset) return;
    PRESET_MANAGER.saveToCurrentPreset(ampParams);
    console.log(ampParams.envelope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePreset]);

  useEffect(() => {
    if (!loadPreset) return;
    const params = PRESET_MANAGER.loadFromCurrentPreset("AmplifierParams");
    const [setEnvelopeValues] = envelope.setValues;
    const [setLFOSliderValue] = lfoSlider.setValue;
    setEnvelopeValues?.(params.envelope);
    setLFOSliderValue?.(params.lfoDepth ?? 0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPreset]);

  return (
    <div className="amplifier">
      Amplifier
      <div className="visualizer-container">
        <AudioVisualizer className="visualizer" onMount={setVisualizer} />
      </div>
      <Envelope
        className="amplifier-envelope"
        onMount={envelope.setValues[1]}
        onChange={(envelope) => setAmpParams((p) => ({ ...p, envelope }))}
        amount={{ initial: 0.22 }}
        sustain={{ initial: 1 }}
      />
      <div className="amplifier-lfo-slider">
        <p>LFO Depth</p>
        <Slider2
          onInput={(lfoDepth) => setAmpParams((p) => ({ ...p, lfoDepth }))}
          logarithmic
          max={1}
          step={0.01}
          onMount={lfoSlider.setValue[1]}
        />
      </div>
    </div>
  );
}
