import React, { useEffect, useMemo, useState } from "react";
import "./Amplifier.css";
import { AmplifierModule } from "@models";

interface Props {
  connectTo: AudioNode | undefined;
  onMount: (module: AmplifierModule) => void;
}
export function Amplifier(props: Props) {
  const [level, setLevel] = useState("0.22");
  const [attack, setAttack] = useState("0");
  const [decay, setDecay] = useState("0");
  const [sustain, setSustain] = useState("1");
  const [release, setRelease] = useState("0");
  const amplifier = useMemo(() => new AmplifierModule(), []);

  function handleLevelInput(value: number) {
    // console.log(value);
    amplifier.level = value;
    // console.log(amplifier.level);
    setLevel(amplifier.level.toFixed(2));
  }
  function handleAttackInput(value: number) {
    amplifier.envelope.attack = value;
    setAttack(amplifier.envelope.attack.toFixed(2));
  }
  function handleDecayInput(value: number) {
    amplifier.envelope.decay = value;
    setDecay(amplifier.envelope.decay.toFixed(2));
  }
  function handleSustainInput(value: number) {
    amplifier.envelope.sustain = value;
    setSustain(amplifier.envelope.sustain.toFixed(2));
  }
  function handleReleaseInput(value: number) {
    amplifier.envelope.release = value;
    setRelease(amplifier.envelope.release.toFixed(2));
  }
  const { onMount } = props;
  useEffect(() => {
    onMount(amplifier);
  }, [onMount, amplifier]);

  useEffect(() => {
    if (props.connectTo) amplifier.connect(props.connectTo);
  }, [props.connectTo, amplifier]);

  return (
    <div className="amplifier">
      Amplifier
      <Slider
        title="Level"
        className="amplifier-slider-container"
        titleClassName="amplifier-slider-title"
        inputClassName="amplifier-slider"
        outputClassName="amplifier-slider-value"
        max={1}
        step={0.01}
        defaultValue="0.22"
        outputValue={level}
        onInput={handleLevelInput}
      />
      <div className="amplifier-envelope">
        Envelope
        <Slider
          title="Attack"
          className="amplifier-slider-container"
          titleClassName="amplifier-slider-title"
          inputClassName="amplifier-slider"
          outputClassName="amplifier-slider-value"
          max={5}
          step={0.01}
          defaultValue={0}
          outputValue={attack}
          onInput={handleAttackInput}
        />
        <Slider
          title="Decay"
          className="amplifier-slider-container"
          titleClassName="amplifier-slider-title"
          inputClassName="amplifier-slider"
          outputClassName="amplifier-slider-value"
          max={5}
          step={0.01}
          defaultValue={0}
          outputValue={decay}
          onInput={handleDecayInput}
        />
        <Slider
          title="Sustain"
          className="amplifier-slider-container"
          titleClassName="amplifier-slider-title"
          inputClassName="amplifier-slider"
          outputClassName="amplifier-slider-value"
          max={1}
          step={0.01}
          defaultValue={1}
          outputValue={sustain}
          onInput={handleSustainInput}
        />
        <Slider
          title="Release"
          className="amplifier-slider-container"
          titleClassName="amplifier-slider-title"
          inputClassName="amplifier-slider"
          outputClassName="amplifier-slider-value"
          max={5}
          step={0.01}
          defaultValue={0}
          outputValue={release}
          onInput={handleReleaseInput}
        />
      </div>
    </div>
  );
}
interface SliderProps {
  className?: string;
  inputClassName?: string;
  outputClassName?: string;
  titleClassName?: string;
  title?: string;
  max?: number | string;
  min?: number | string;
  step?: number | string;
  defaultValue?: number | string;
  outputValue?: number | string;
  onInput?: (value: number) => void;
}
function Slider(props: SliderProps) {
  return (
    <div className={props.className}>
      <label className={props.titleClassName}>{props.title}</label>
      <input
        className={props.inputClassName}
        type="range"
        max={props.max}
        step={props.step}
        defaultValue={props.defaultValue}
        onInput={(ev) => {
          if (props.onInput) props.onInput(ev.currentTarget.valueAsNumber);
        }}
      />
      <output className={props.outputClassName}>{props.outputValue}</output>
    </div>
  );
}
