import { useEffect, useMemo, useRef, useState } from "react";
import "./Amplifier.scss";
import { AmplifierModule, ModuleProps } from "models";
import { Envelope, Slider, AudioVisualizer } from "components";
import { Utils } from "common";
import { IAmplifierParams } from "models/Data";
import { PRESET_MANAGER } from "controller";
import { IEnvelopeParams } from "models/Data/IEnvelopeParams";

export function Amplifier(props: ModuleProps<AmplifierModule>) {
  const amplifier = useMemo(() => new AmplifierModule(), []);
  const lfoSlider = useRef<Slider>(null);
  const [lfoDepth, setLfoDepth] = useState(0);
  const envelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };
  const { onMount, connectTo, noteOn } = props;
  const { savePreset, loadPreset } = props;

  useEffect(() => {
    if (onMount) onMount(amplifier);
  }, [onMount, amplifier]);
  useEffect(() => {
    if (!savePreset) return;
    const [getEnvelopeValues] = envelope.getValues;
    PRESET_MANAGER.saveToCurrentPreset<IAmplifierParams>({
      discriminator: "AmplifierParams",
      envelope: getEnvelopeValues?.(),
      lfo_depth: lfoSlider.current?.getValue(),
    });
    console.log("Saving amplifier parameters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePreset]);

  useEffect(() => {
    if (!loadPreset) return;
    const params = PRESET_MANAGER.loadFromCurrentPreset("AmplifierParams");
    const [setEnvelopeValues] = envelope.setValues;
    setEnvelopeValues?.(params.envelope);
    lfoSlider.current?.setValue(params.lfo_depth);

    console.log("Loading amplifier parameters");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPreset]);

  useEffect(() => {
    if (!connectTo || !amplifier) return;
    if (Array.isArray(connectTo)) {
      connectTo.forEach((destination) => amplifier.connect(destination));
    } else {
      amplifier.connect(connectTo);
    }
  }, [connectTo, amplifier]);
  return (
    <div className="amplifier">
      Amplifier
      <div className="visualizer-container">
        <AudioVisualizer
          className="visualizer"
          onMount={(node) => amplifier.connect(node)}
          frequency={Utils.indexToFrequency(noteOn ? noteOn.note : 0)}
        />
      </div>
      <Envelope
        className="flex h-fit w-full grow flex-col bg-zinc-700 px-1 pb-1 text-center text-sm"
        onMount={(getValues, setValues) => {
          envelope.getValues[1](getValues);
          envelope.setValues[1](setValues);
        }}
        amount={{
          initial: 0.22,
          onValueChange: (value) => (amplifier.envelope.amount = value),
        }}
        attack={{
          onValueChange: (value) => (amplifier.envelope.attack = value * 5),
        }}
        decay={{
          onValueChange: (value) => (amplifier.envelope.decay = value * 10),
        }}
        sustain={{
          initial: 1,
          onValueChange: (value) => (amplifier.envelope.sustain = value),
        }}
        release={{
          onValueChange: (value) => (amplifier.envelope.release = value * 10),
        }}
      />
      <Slider
        title="LFO Depth"
        titleClassName="text-xs whitespace-nowrap"
        className="flex h-fit w-full items-center gap-x-1 bg-zinc-700 p-1"
        outputClassName="slider-output w-fit px-1 text-center h-fit"
        max={2}
        step={0.01}
        outputValue={lfoDepth.toFixed(2)}
        onInput={(value) => {
          value = Utils.linToExp2(value, 0, 3);
          setLfoDepth(value);
          amplifier.lfoAmount = value;
        }}
        ref={lfoSlider}
      />
    </div>
  );
}
