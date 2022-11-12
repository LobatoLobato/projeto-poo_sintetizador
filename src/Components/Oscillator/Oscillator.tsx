import { useEffect, useMemo, useRef, useState } from "react";
import "./Oscillator.scss";
import { OscillatorModule } from "models";
import { Utils } from "common";
import { Slider } from "components";

interface Props {
  connectTo: AudioNode | undefined;
  onMount?: (module: OscillatorModule) => void;
  noteOn: number;
}
export function Oscillator(props: Props) {
  const oscillator = useMemo(() => new OscillatorModule(), []);
  const waveformIcons = useRef<HTMLDivElement>(null);
  const unisonVisualizerView = useRef<HTMLDivElement>(null);
  const [unisonSize, setUnisonSize] = useState(0);
  const [unisonSpread, setUnisonSpread] = useState(0);
  const [unisonDetune, setUnisonDetune] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [detune, setDetune] = useState(0);
  const { onMount } = props;

  useEffect(() => {
    if (onMount) onMount(oscillator);
    oscillator.start();
  }, [onMount, oscillator]);

  useEffect(() => {
    const view = unisonVisualizerView.current;
    const bar = view?.querySelector("div");
    if (!view || !bar) return;
    const viewWidth = view.getBoundingClientRect().width;
    const barWidth = bar.getBoundingClientRect().width;
    const availableSpace = viewWidth - (unisonSize + 2) * barWidth;
    const gap = (availableSpace / unisonSize) * (unisonDetune / 100);
    view.style.gap = `${gap}px`;
  }, [unisonDetune, unisonSize]);

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
        <div ref={waveformIcons} className="waveform-icon-container">
          {["Sine", "Triangle", "Sawtooth", "Square"].map((wave, index) => {
            const baseUrl = `https://www.iconbolt.com/iconsets/phosphor-regular`;
            const src = `${baseUrl}/wave-${wave.toLowerCase()}.svg`;
            const handleOnClick = (ev: React.MouseEvent) => {
              const icons = waveformIcons.current!.querySelectorAll("img");
              icons.forEach((icon) => icon.classList.remove("selected"));
              ev.currentTarget.children[0].classList.add("selected");
              oscillator.type = wave as OscillatorType;
            };
            const className = `waveform-icon ${index === 0 ? "selected" : ""}`;
            return (
              <button key={wave} onClick={handleOnClick}>
                <img className={className} alt={wave} src={src} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="unison-container">
        <p>Unison</p>
        <div className="visualizer">
          <div ref={unisonVisualizerView} className="visualizer-view">
            {[...Array(unisonSize + 1)].map((_, index) => {
              const isMiddle = index === Math.round(unisonSize / 2);
              const isEdge = index === 0 || index === unisonSize;
              const mod = isMiddle ? "middle" : isEdge ? "edge" : "";
              return <div key={`lv-${index}`} className={`v-bar ${mod}`}></div>;
            })}
          </div>
          <div className="v-spread" style={{ width: `${unisonSpread}%` }}>
            <div className="v-spread-bar"></div>
          </div>
        </div>
        <div className="button-container">
          <button
            onClick={() => {
              if (unisonSize >= 2) {
                setUnisonSize(unisonSize - 2);
                oscillator.unisonSize = unisonSize - 2;
              }
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              if (unisonSize < 14) {
                setUnisonSize(unisonSize + 2);
                oscillator.unisonSize = unisonSize + 2;
              }
            }}
          >
            +
          </button>
        </div>
        <Slider
          title="Detune"
          titleClassName="mx-auto"
          className="flex w-full flex-col bg-zinc-700"
          inputClassName="w-full"
          defaultValue={0}
          max={100}
          step={1}
          onInput={(value) => {
            setUnisonDetune(value);
            oscillator.unisonDetune = value;
          }}
        />
        <Slider
          title="Spread"
          titleClassName="mx-auto"
          className="flex w-full flex-col bg-zinc-700"
          inputClassName="slider"
          defaultValue={0}
          max={100}
          step={1}
          onInput={(value) => {
            setUnisonSpread(value);
            oscillator.unisonSpread = value;
          }}
        />
      </div>
      <Slider
        title="Pitch"
        className="flex w-full flex-wrap gap-1 bg-zinc-700 px-1 pb-1 text-sm"
        titleClassName="min-w-full mx-auto text-center "
        inputClassName="grow"
        outputClassName="w-2/12 text-center bg-white bg-opacity-20 rounded-sm shadow-inner shadow-zinc-700"
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
        className="flex w-full flex-wrap gap-1 bg-zinc-700 px-1 pb-1 text-sm"
        titleClassName="min-w-full mx-auto text-center "
        inputClassName="grow"
        outputClassName="w-2/12 text-center bg-white bg-opacity-20 rounded-sm shadow-inner shadow-zinc-700"
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
