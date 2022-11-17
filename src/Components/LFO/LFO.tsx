import { LFOModule, ModuleProps } from "models";
import { Envelope, Slider, WaveformSelector } from "components";
import { useEffect, useMemo, useState } from "react";
import "./LFO.scss";
import { Utils } from "common";

export function LFO(props: ModuleProps<LFOModule>) {
  const lfo = useMemo(() => new LFOModule(), []);
  const [rate, setRate] = useState(2);
  const { connectTo, noteOn, noteOff } = props;
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
    lfo.osc.envelope.start();
    lfo.amp.envelope.start();
  }, [noteOn, lfo]);

  useEffect(() => {
    if (!noteOff || !noteOff.active) return;
    lfo.osc.envelope.stop();
    lfo.amp.envelope.stop();
  }, [noteOff, lfo]);

  return (
    <div className="lfo-container">
      LFO
      <WaveformSelector onClick={(wave) => (lfo.osc.type = wave)} />
      <Slider
        title="Rate"
        titleClassName="text-sm whitespace-nowrap"
        className="flex h-fit w-full items-center gap-x-1  bg-zinc-700 p-1"
        outputClassName="slider-output w-fit px-1 text-center h-fit col-span-1 "
        max={10}
        defaultValue={2}
        step={0.01}
        outputValue={rate.toFixed(2)}
        onInput={(value) => {
          value = Utils.linToExp2(value, 0, 10);
          lfo.osc.frequency = value;
          setRate(value);
        }}
      />
      <Envelope
        title="Rate Envelope"
        className="flex flex-col bg-zinc-700 h-full"
        amount={{
          onValueChange: (value) => {
            lfo.osc.envelope.amount = Utils.linToExp2(value, 0, 1) * 1000;
          },
        }}
        attack={{
          onValueChange: (value) => (lfo.osc.envelope.attack = value * 5),
        }}
        decay={{
          onValueChange: (value) => (lfo.osc.envelope.decay = value * 10),
        }}
        sustain={{
          onValueChange: (value) => (lfo.osc.envelope.sustain = value),
          initial: 1,
        }}
        release={{
          onValueChange: (value) => (lfo.osc.envelope.release = value * 10),
        }}
      />
      <Envelope
        title="Amplitude Envelope"
        className="h-full flex flex-col bg-zinc-700"
        amount={{
          onValueChange: (value) => (lfo.amp.envelope.amount = value / 2),
          initial: 0.5,
        }}
        attack={{
          onValueChange: (value) => (lfo.amp.envelope.attack = value * 5),
        }}
        decay={{
          onValueChange: (value) => (lfo.amp.envelope.decay = value * 10),
        }}
        sustain={{
          onValueChange: (value) => (lfo.amp.envelope.sustain = value),
          initial: 1,
        }}
        release={{
          onValueChange: (value) => (lfo.amp.envelope.release = value * 10),
        }}
      />
    </div>
  );
}
