import React, { useEffect, useMemo, useState } from "react";
import "./Amplifier.css";
import { AmplifierModule } from "models";
import { Envelope } from "components";

interface Props {
  connectTo: AudioNode | undefined;
  onMount: (module: AmplifierModule) => void;
}
export function Amplifier(props: Props) {
  const amplifier = useMemo(() => new AmplifierModule(), []);
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
      <Envelope
        className="flex h-full w-full grow flex-col bg-zinc-700 px-1 text-center text-sm"
        onAmountChange={(value) => (amplifier.envelope.amount = value)}
        onAttackChange={(value) => (amplifier.envelope.attack = value * 5)}
        onDecayChange={(value) => (amplifier.envelope.decay = value * 5)}
        onSustainChange={(value) => (amplifier.envelope.sustain = value)}
        onReleaseChange={(value) => (amplifier.envelope.release = value * 5)}
        defaultAmount={0.22}
      />
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
