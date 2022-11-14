import { useEffect, useMemo, useRef, useState } from "react";
import "./Oscillator.scss";
import { OscillatorModule } from "models";
import { Utils } from "common";
import { Envelope, Slider } from "components";

interface Props {
  connectTo: AudioNode | undefined;
  onMount?: (module: OscillatorModule) => void;
  noteOn: { note: number; active: boolean };
  noteOff: { note: number; active: boolean };
}
export function Oscillator(props: Props) {
  const oscillator = useMemo(() => new OscillatorModule(), []);
  const [pitch, setPitch] = useState(0);
  const [detune, setDetune] = useState(0);
  const { onMount, noteOn, noteOff } = props;

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
    if (noteOn.note < 0 && !noteOn.active) return;
    const noteFrequency = Utils.indexToFrequency(noteOn.note);
    oscillator.frequency = noteFrequency;
    oscillator.envelope.start();
  }, [noteOn, oscillator]);

  useEffect(() => {
    if (!noteOff.active) return;
    oscillator.envelope.stop();
  }, [noteOff, oscillator]);

  return (
    <div className="oscillator-container">
      <h2>Oscillator</h2>
      <WaveformSelector onClick={(wave) => (oscillator.type = wave)} />
      <UnisonThing
        onSizeChanged={(value) => (oscillator.unisonSize = value)}
        onDetuneChanged={(value) => (oscillator.unisonDetune = value)}
        onSpreadChanged={(value) => (oscillator.unisonSpread = value)}
      />
      <div className="col-span-2 row-span-2 grid grid-cols-2 gap-0.5">
        <Slider
          title="Pitch"
          titleClassName="text-sm"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={48}
          defaultValue={24}
          onInput={(value) => {
            const offsetValue = value - 24;
            oscillator.pitchOffset = offsetValue;
            setPitch(offsetValue);
          }}
          outputValue={pitch}
        />
        <Slider
          title="Detune"
          titleClassName="text-sm"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          defaultValue={50}
          onInput={(value) => {
            oscillator.detune = value - 50;
            setDetune(value - 50);
          }}
          outputValue={detune}
        />
      </div>

      <Envelope
        className="col-span-full flex h-full w-full grow flex-col bg-zinc-700 px-1 text-center text-sm"
        onAmountChange={(value) => (oscillator.envelope.amount = value * 1000)}
        onAttackChange={(value) => (oscillator.envelope.attack = value)}
        onDecayChange={(value) => (oscillator.envelope.decay = value)}
        onSustainChange={(value) => (oscillator.envelope.sustain = value)}
        onReleaseChange={(value) => (oscillator.envelope.release = value)}
      />
      <Slider
        title="LFO Amount"
        titleClassName="text-xs whitespace-nowrap"
        className="col-span-full flex h-fit w-full items-center gap-x-1  bg-zinc-700 p-1"
        outputClassName="slider-output w-fit px-1 text-center h-fit col-span-1 "
        outputValue={10}
      />
    </div>
  );
}
interface WaveformSelectorProps {
  onClick: (wave: OscillatorType) => void;
}
function WaveformSelector(props: WaveformSelectorProps) {
  const waveformIcons = useRef<HTMLDivElement>(null);
  const waveForms = ["Sine", "Triangle", "Sawtooth", "Square"];
  const iconsUrl = `https://www.iconbolt.com/iconsets/phosphor-regular`;

  function handleOnClick(ev: React.MouseEvent, wave: string) {
    const icons = waveformIcons.current!.querySelectorAll("img");
    icons.forEach((icon) => icon.classList.remove("selected"));
    ev.currentTarget.children[0].classList.add("selected");
    props.onClick(wave as OscillatorType);
  }

  function createIcon(wave: string, index: number) {
    const src = `${iconsUrl}/wave-${wave.toLowerCase()}.svg`;
    const className = `waveform-icon ${index === 0 ? "selected" : ""}`;
    return (
      <button key={wave} onClick={(ev) => handleOnClick(ev, wave)}>
        <img className={className} alt={wave} src={src} />
      </button>
    );
  }
  return (
    <div className="waveform-selector">
      <div ref={waveformIcons} className="waveform-icon-container">
        {waveForms.map(createIcon)}
      </div>
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
  function handleIncrement() {
    if (size < 14) {
      setSize(size + 2);
      props.onSizeChanged(size + 2);
    }
  }
  function handleDecrement() {
    if (size >= 2) {
      setSize(size - 2);
      props.onSizeChanged(size - 2);
    }
  }
  function handleDetuneChange(value: number) {
    setDetune(value);
    props.onDetuneChanged(value);
  }
  function handleSpreadChange(value: number) {
    setSpread(value);
    props.onSpreadChanged(value);
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
      <div className="button-container">
        <button onClick={handleDecrement}>-</button>
        <button onClick={handleIncrement}>+</button>
      </div>
      <Slider
        title="Detune"
        className="u-slider"
        onInput={handleDetuneChange}
      />
      <Slider
        title="Spread"
        className="u-slider"
        onInput={handleSpreadChange}
      />
    </div>
  );
}
