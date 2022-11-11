import { useEffect, useMemo, useState } from "react";
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
  const [unisonSize, setUnisonSize] = useState(0);
  const [unisonSpread, setUnisonSpread] = useState(50);
  const [unisonDetune, setUnisonDetune] = useState(50);
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
        <div className="waveform-icon-container">
          {["Sine", "Triangle", "Sawtooth", "Square"].map((wave) => {
            const baseUrl = `https://www.iconbolt.com/iconsets/phosphor-regular`;
            const src = `${baseUrl}/wave-${wave.toLowerCase()}.svg`;
            const handleOnClick = (ev: React.MouseEvent) => {
              const container = document.querySelector(
                ".waveform-icon-container"
              );
              if (container) {
                container.querySelectorAll("img").forEach((icon) => {
                  icon.classList.remove("selected");
                });
              }
              const thisIcon = ev.currentTarget.querySelector(
                "img"
              ) as HTMLImageElement;
              if (thisIcon) {
                thisIcon.classList.add("selected");
              }
              oscillator.type = wave as OscillatorType;
            };
            return (
              <button key={wave} onClick={handleOnClick}>
                <img className="waveform-icon" alt={wave} src={src} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="unison-container">
        <p>Unison</p>
        <div className="visualizer">
          <div
            style={{
              gap: `${Math.max(
                ((100 - 2 * unisonSize) / (unisonSize / 2)) *
                  (unisonDetune / 100),
                1
              )}px`,
            }}
            className="absolute flex h-full w-full justify-center overflow-hidden"
          >
            {[...Array(unisonSize + 1)].map((_, index) => (
              <div
                key={`lv-${index}`}
                className={`${
                  index === Math.round(unisonSize / 2)
                    ? "mt-0.5 bg-green-600"
                    : index === 0 || index === unisonSize
                    ? "mt-2 bg-red-600"
                    : "mt-1 bg-yellow-400"
                } h-10 w-1 shadow-inner shadow-zinc-600`}
              ></div>
            ))}
          </div>
          <div
            style={{ width: `${unisonSpread}%` }}
            className="flex h-full items-end justify-center overflow-hidden rounded-sm bg-opacity-30 bg-gradient-to-r from-[#00ff0d30] via-[#02620780] to-[#00ff0d30]"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#00ff0d80] via-[#02620780] to-[#00ff0d80]"></div>
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
            ←
          </button>
          <button
            onClick={() => {
              if (unisonSize < 14) {
                setUnisonSize(unisonSize + 2);
                oscillator.unisonSize = unisonSize + 2;
              }
            }}
          >
            →
          </button>
        </div>
        <Slider
          title="Detune"
          titleClassName="mx-auto"
          className="flex w-full flex-col bg-zinc-700"
          inputClassName="w-full"
          defaultValue={50}
          max={100}
          step={1}
          onInput={(value) => {
            setUnisonDetune(value);
          }}
        />
        <Slider
          title="Spread"
          titleClassName="mx-auto"
          className="flex w-full flex-col bg-zinc-700"
          inputClassName="slider"
          defaultValue={50}
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
