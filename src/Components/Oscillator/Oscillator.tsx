import { useEffect, useMemo, useState } from "react";
import "./Oscillator.css";
import { OscillatorModule } from "@models";
import { Utils } from "@common";
import { Slider } from "@components";

interface Props {
  connectTo: AudioNode | undefined;
  onMount?: (module: OscillatorModule) => void;
  noteOn: number;
}
export function Oscillator(props: Props) {
  const oscillator = useMemo(() => new OscillatorModule(), []);
  const [unisonSize, setUnisonSize] = useState(0);
  const [unisonSpread, setUnisonSpread] = useState(50);
  const [pitch, setPitch] = useState(0);
  const [detune, setDetune] = useState(0);
  const { onMount } = props;

  useEffect(() => {
    if (onMount) onMount(oscillator);
    oscillator.start();
  }, [onMount, oscillator]);

  useEffect(() => {
    if (props.connectTo !== undefined) {
      oscillator.connect(props.connectTo);
    }
  }, [props.connectTo, oscillator]);

  useEffect(() => {
    if (props.noteOn < 0) return;
    const noteFrequency = Utils.indexToFrequency(props.noteOn);
    oscillator.frequency = noteFrequency;
  }, [props.noteOn, oscillator]);

  return (
    <div className="oscillator-container">
      Oscillator
      <div className="waveform-selector">
        Waveform
        <select
          className="mx-1"
          onInput={(ev) => {
            oscillator.type = ev.currentTarget.value as OscillatorType;
          }}
        >
          <option value="sine">Sine</option>
          <option value="triangle">Triangle</option>
          <option value="square">Square</option>
          <option value="sawtooth">Saw</option>
        </select>
      </div>
      <Slider
        title="Unison Size"
        defaultValue={0}
        max={14}
        step={2}
        onInput={(value) => {
          setUnisonSize(value);
          oscillator.unisonSize = value;
        }}
        outputValue={unisonSize}
      />
      <Slider
        title="Unison Spread"
        defaultValue={50}
        max={100}
        step={1}
        onInput={(value) => {
          setUnisonSpread(value);
          oscillator.unisonSpread = value;
        }}
        outputValue={unisonSpread}
      />
      <Slider
        title="Pitch"
        defaultValue={24}
        max={48}
        step={1}
        onInput={(value) => {
          const offsetValue = value - 24;
          oscillator.pitchOffset = offsetValue;
          setPitch(offsetValue);
        }}
        outputValue={pitch}
      />
      <Slider
        title="Detune"
        defaultValue={50}
        max={100}
        step={1}
        onInput={(value) => {
          oscillator.detune = value - 50;
          setDetune(value - 50);
        }}
        outputValue={detune}
      />
    </div>
  );
}
