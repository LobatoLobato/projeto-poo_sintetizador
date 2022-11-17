import { useEffect, useMemo, useRef, useState } from "react";
import "./Oscillator.scss";
import { ModuleProps, OscillatorModule } from "models";
import { Utils } from "common";
import { Envelope, Slider, WaveformSelector, Knob } from "components";

export function Oscillator(props: ModuleProps<OscillatorModule>) {
  const oscillator = useMemo(() => new OscillatorModule(), []);
  const [lfoDepth, setLfoDepth] = useState(0);
  const { onMount, noteOn, noteOff, connectTo } = props;

  useEffect(() => {
    if (onMount) onMount(oscillator);
    oscillator.start();
  }, [onMount, oscillator]);

  useEffect(() => {
    if (!connectTo) return;
    if (Array.isArray(connectTo)) {
      connectTo.forEach((destination) => oscillator.connect(destination));
    } else {
      oscillator.connect(connectTo);
    }
  }, [connectTo, oscillator]);

  useEffect(() => {
    if (!noteOn || (noteOn.note < 0 && !noteOn.active)) return;
    const noteFrequency = Utils.indexToFrequency(noteOn.note);
    oscillator.frequency = noteFrequency;
    oscillator.envelope.start();
  }, [noteOn, oscillator]);

  useEffect(() => {
    if (!noteOff || !noteOff.active) return;
    oscillator.envelope.stop();
  }, [noteOff, oscillator]);

  return (
    <div className="oscillator-container">
      <h2>Oscillator</h2>
      <div className="bunda">
        <WaveformSelector
          className="col-span-1 row-span-2"
          orientation="vertical"
          onClick={(wave) => (oscillator.type = wave)}
        />
        <UnisonThing
          onSizeChanged={(value) => (oscillator.unisonSize = value)}
          onDetuneChanged={(value) => (oscillator.unisonDetune = value)}
          onSpreadChanged={(value) => (oscillator.unisonSpread = value)}
        />
        <div className="col-span-1 row-span-2 grid grid-rows-2 gap-0.5 bg-zinc-700">
          <Knob
            className="text-center text-xs"
            title="Pitch"
            dragResistance={50}
            step={1}
            min={-24}
            max={24}
            onValueChange={(value) => (oscillator.pitchOffset = value)}
          />
          <Knob
            className="text-center text-xs"
            title="Detune"
            dragResistance={50}
            step={1}
            min={-50}
            max={50}
            onValueChange={(value) => (oscillator.detune = value)}
          />
        </div>
      </div>
      <Envelope
        className="col-span-full flex  w-full grow flex-col bg-zinc-700 px-1 text-center text-sm"
        amount={{
          indicatorRingType: "split",
          initial: 0.5,
          onValueChange: (value) => {
            oscillator.envelope.amount = value * 1000 - 500;
          },
        }}
        attack={{
          onValueChange: (value) => (oscillator.envelope.attack = value * 5),
        }}
        decay={{
          onValueChange: (value) => (oscillator.envelope.decay = value * 5),
        }}
        sustain={{
          onValueChange: (value) => (oscillator.envelope.sustain = value),
        }}
        release={{
          onValueChange: (value) => (oscillator.envelope.release = value * 5),
        }}
      />
      <Slider
        title="LFO Depth"
        titleClassName="text-xs whitespace-nowrap"
        className="col-span-full flex max-h-fit w-full items-center gap-x-1  bg-zinc-700 p-1"
        outputClassName="slider-output w-fit px-1 text-center h-fit col-span-1 "
        max={1}
        step={0.01}
        outputValue={lfoDepth.toFixed(2)}
        onInput={(value) => {
          value = Utils.linToExp2(value, 0, 2);
          oscillator.lfoAmount = value;
          setLfoDepth(value);
        }}
      />
    </div>
  );
}

interface UnisonProps {
  onSizeChanged(size: number): void;
  onDetuneChanged(detune: number): void;
  onSpreadChanged(spread: number): void;
}
function UnisonThing(props: UnisonProps) {
  const visualizer = useRef<HTMLDivElement>(null);
  const middleBar = useRef<HTMLDivElement>(null);
  const spreadView = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  const [detune, setDetune] = useState(0);
  const [spread, setSpread] = useState(0);

  function UnisonBars(props: { size: number }) {
    const bars: JSX.Element[] = [];
    const { size } = props;
    for (let i = 0; i < size; i++) {
      const isMiddle = i === Math.floor(size / 2);
      const isEdge = i === 0 || i === size - 1;
      const mod = isMiddle ? "middle" : isEdge ? "edge" : "";
      const ref = isMiddle ? middleBar : null;
      bars.push(
        <div ref={ref} key={`lv-${i}`} className={`v-bar ${mod}`}></div>
      );
    }
    return <>{bars}</>;
  }

  function handleSizeChange(value: number) {
    setSize(value);
    props.onSizeChanged(value);
  }
  function handleDetuneChange(value: number) {
    setDetune(value * 100);
    props.onDetuneChanged(value * 100);
  }
  function handleSpreadChange(value: number) {
    setSpread(value * 100);
    props.onSpreadChanged(value * 100);
  }
  useEffect(() => {
    const [view, bar] = [visualizer.current, middleBar.current];
    if (!view || !bar) return;
    const [viewW, barW] = [Utils.elementWidth(view), Utils.elementWidth(bar)];
    const gap = ((viewW - (size + 2) * barW) / size) * (detune / 100);
    view.style.gap = `${gap}px`;
  }, [size, detune]);

  useEffect(() => {
    if (!spreadView.current) return;
    spreadView.current.style.width = `${spread}%`;
  }, [spread]);

  return (
    <div className="unison-container">
      <p>Unison</p>
      <div className="visualizer" ref={visualizer}>
        <UnisonBars size={size + 1} />
        <div className="v-spread" ref={spreadView}>
          <div className="v-spread-bar"></div>
        </div>
      </div>
      <Slider
        max={14}
        step={2}
        className="u-slider"
        onInput={handleSizeChange}
      />
      <div className="flex w-full justify-evenly">
        <Knob
          className="text-center text-xs"
          title="Detune"
          onValueChange={handleDetuneChange}
          dragResistance={50}
        />
        <Knob
          className="text-center text-xs"
          title="Spread"
          onValueChange={handleSpreadChange}
          dragResistance={50}
        />
      </div>
    </div>
  );
}
