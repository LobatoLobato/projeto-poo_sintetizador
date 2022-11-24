import { useEffect, useMemo, useRef, useState } from "react";
import "./Oscillator.scss";
import { ModuleProps } from "models";
import { Utils } from "common";
import { Envelope, Slider, WaveformSelector, Knob } from "components";
import { FLStandardKnob } from "precision-inputs/dist/precision-inputs";
import { IEnvelopeParams, IOscillatorParams, IUnisonParams } from "models/Data";
import { PRESET_MANAGER } from "controller";

export function Oscillator(props: ModuleProps<IOscillatorParams>) {
  const lfoSlider = useRef<Slider>(null);
  const [lfoDepth, setLfoDepth] = useState(0);
  const [type, setType] = useState<OscillatorType | undefined>("sine");
  const [poKnob, setPoKnob] = useState<FLStandardKnob>();
  const [dtnKnob, setDtnKnob] = useState<FLStandardKnob>();
  const unison = {
    getValues: useState<() => IUnisonParams>(),
    setValues: useState<(values: IUnisonParams | undefined) => void>(),
  };
  const envelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };
  const { onChange } = props;
  const { savePreset, loadPreset } = props;
  const [oscParams, setOscParams] = useState<IOscillatorParams>({
    discriminator: "OscillatorParams",
  });

  useEffect(() => {
    if (savePreset) {
      PRESET_MANAGER.saveToCurrentPreset(oscParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePreset]);
  useEffect(() => {
    if (!loadPreset) return;
    const params = PRESET_MANAGER.loadFromCurrentPreset("OscillatorParams");
    const [setEnvelopeValues] = envelope.setValues;
    const [setUnisonValues] = unison.setValues;
    if (poKnob) poKnob.value = params.pitchOffset;
    if (dtnKnob) dtnKnob.value = params.detune;
    setType(params.type);
    lfoSlider.current?.setValue(params.lfoDepth);
    setEnvelopeValues?.(params.envelope);
    setUnisonValues?.(params.unison);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPreset]);

  useEffect(() => {
    onChange?.(oscParams);
  }, [oscParams, onChange]);
  return (
    <div className="oscillator-container">
      <h2>Oscillator</h2>
      <div className="bunda">
        <WaveformSelector
          className="col-span-1 row-span-2"
          orientation="vertical"
          onClick={(wave) => {
            setOscParams((p) => ({ ...p, type: wave }));
            setType(wave);
          }}
          value={type}
        />
        <UnisonThing
          onMount={(getValues, setValues) => {
            unison.getValues[1](getValues);
            unison.setValues[1](setValues);
          }}
          onChange={(size, detune, spread) => {
            console.log(size, detune, spread);
            setOscParams((p) => ({ ...p, unison: { size, detune, spread } }));
          }}
        />
        <div className="col-span-1 row-span-2 grid grid-rows-2 gap-0.5 bg-zinc-700">
          <Knob
            className="text-center text-xs"
            title="Pitch"
            dragResistance={50}
            step={1}
            min={-24}
            max={24}
            onValueChange={(value) => {
              setOscParams((p) => ({ ...p, pitchOffset: value }));
            }}
            onMount={setPoKnob}
            indicatorRingType="split"
          />
          <Knob
            className="text-center text-xs"
            title="Detune"
            dragResistance={50}
            step={1}
            min={-50}
            max={50}
            onValueChange={(value) => {
              setOscParams((p) => ({ ...p, detune: value }));
            }}
            onMount={setDtnKnob}
            indicatorRingType="split"
          />
        </div>
      </div>
      <Envelope
        className="col-span-full flex  w-full grow flex-col bg-zinc-700 px-1 text-center text-sm"
        onMount={envelope.setValues[1]}
        onChange={(envelope) => setOscParams((p) => ({ ...p, envelope }))}
        amount={{
          indicatorRingType: "split",
          initial: 0,
          max: 500,
          min: -500,
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
          setOscParams((p) => ({ ...p, lfoDepth: value }));
          setLfoDepth(value);
        }}
        ref={lfoSlider}
      />
    </div>
  );
}

interface UnisonProps {
  onChange(size: number, detune: number, spread: number): void;
  onMount?: (
    getValues: () => () => IUnisonParams,
    setValues: () => (values: IUnisonParams | undefined) => void
  ) => void;
}
function UnisonThing(props: UnisonProps) {
  const visualizer = useRef<HTMLDivElement>(null);
  const middleBar = useRef<HTMLDivElement>(null);
  const spreadView = useRef<HTMLDivElement>(null);
  const sizeSlider = useRef<Slider>(null);
  const [dtnKnob, setDtnKnob] = useState<FLStandardKnob>();
  const [sprdKnob, setSprdKnob] = useState<FLStandardKnob>();
  const [size, setSize] = useState(0);
  const [detune, setDetune] = useState(0);
  const [spread, setSpread] = useState(0);
  const { onMount, onChange } = props;

  const getValues = useMemo(() => {
    return function () {
      return {
        size: sizeSlider.current?.getValue(),
        detune: dtnKnob?.value,
        spread: sprdKnob?.value,
      };
    };
  }, [dtnKnob, sprdKnob]);
  const setValues = useMemo(() => {
    return function (values: IUnisonParams | undefined): void {
      if (!sizeSlider.current || !dtnKnob || !sprdKnob || !values) {
        return;
      }
      sizeSlider.current.setValue(values.size);
      dtnKnob.value = values.detune;
      sprdKnob.value = values.spread;
    };
  }, [dtnKnob, sprdKnob]);

  useEffect(() => {
    if (!onMount) return;
    onMount(
      () => getValues,
      () => setValues
    );
  }, [getValues, onMount, setValues]);

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
  useEffect(() => {
    onChange(size, detune, spread);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, detune, spread]);
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
        ref={sizeSlider}
        max={14}
        step={2}
        className="u-slider"
        onInput={setSize}
      />
      <div className="flex w-full justify-evenly">
        <Knob
          className="text-center text-xs"
          title="Detune"
          onValueChange={setDetune}
          dragResistance={50}
          onMount={setDtnKnob}
          max={100}
        />
        <Knob
          className="text-center text-xs"
          title="Spread"
          onValueChange={setSpread}
          dragResistance={50}
          onMount={setSprdKnob}
          max={100}
        />
      </div>
    </div>
  );
}
