import { useEffect, useRef, useState } from "react";
import { Envelope, Slider, WaveformSelector, Knob } from "view/components";
import {
  useLoadFromPreset,
  useOnParamsChange,
  useParamUpdater,
  useSaveToPreset,
} from "view/hooks";
import "./Oscillator.scss";
import { ModuleProps } from "models";
import { IOscillatorParams, IUnisonParams } from "models/data";
import { Utils } from "common";

export function Oscillator(props: ModuleProps<IOscillatorParams>) {
  const { onChange, savePreset, loadPreset } = props;
  const params = useState<IOscillatorParams>({
    discriminator: "OscillatorParams",
  });
  const [setParam, loadParam] = useParamUpdater(params, loadPreset);

  useOnParamsChange(params[0], onChange);
  useSaveToPreset(params[0], savePreset);
  useLoadFromPreset(params, loadPreset);

  return (
    <div className="oscillator-container">
      <h2>Oscillator</h2>
      <div className="oscillator-top">
        <WaveformSelector
          className="col-span-1 row-span-2"
          orientation="vertical"
          onClick={(val) => setParam("type", val)}
          value={loadParam("type")}
        />
        <UnisonThing
          onChange={(val) => setParam("unison", val)}
          values={loadParam("unison")}
        />
        <div className="pitch-controls">
          <Knob
            className="knob"
            title="Pitch"
            dragResistance={50}
            step={1}
            min={-24}
            max={24}
            initial={0}
            onValueChange={(val) => setParam("pitchOffset", val)}
            value={loadParam("pitchOffset")}
            indicatorRingType="split"
          />
          <Knob
            className="knob"
            title="Detune"
            dragResistance={50}
            step={1}
            min={-50}
            max={50}
            initial={0}
            onValueChange={(val) => setParam("detune", val)}
            value={loadParam("detune")}
            indicatorRingType="split"
          />
        </div>
      </div>
      <Envelope
        className="oscillator-envelope"
        onChange={(val) => setParam("envelope", val)}
        amount={{
          indicatorRingType: "split",
          initial: 0,
          max: 500,
          min: -500,
        }}
        values={loadParam("envelope")}
      />
      <div className="lfo-slider">
        <p>LFO Depth</p>
        <Slider
          max={1}
          step={0.01}
          onInput={(val) => setParam("lfoDepth", val)}
          value={loadParam("lfoDepth")}
        />
      </div>
    </div>
  );
}

interface UnisonProps {
  onChange(unison: IUnisonParams): void;
  values?: IUnisonParams;
}
function UnisonThing(props: UnisonProps) {
  const visualizer = useRef<HTMLDivElement>(null);
  const middleBar = useRef<HTMLDivElement>(null);
  const spreadView = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<IUnisonParams>({});
  const { onChange, values } = props;

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
    const size = params.size ?? 0;
    const detune = params.detune ?? 0;
    const [viewW, barW] = [Utils.elementWidth(view), Utils.elementWidth(bar)];
    const gap = ((viewW - (size + 2) * barW) / size) * (detune / 100);
    view.style.gap = `${gap}px`;
  }, [params.size, params.detune]);

  useEffect(() => {
    if (!spreadView.current) return;
    spreadView.current.style.width = `${params.spread}%`;
  }, [params.spread]);

  useEffect(() => {
    if (params) onChange(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  useEffect(() => {
    if (values) setParams(values);
  }, [values]);

  return (
    <div className="unison-container">
      <p>Unison</p>
      <div className="visualizer" ref={visualizer}>
        <UnisonBars size={(params.size ?? 0) + 1} />
        <div className="v-spread" ref={spreadView}>
          <div className="v-spread-bar"></div>
        </div>
      </div>
      <Slider
        className="u-slider"
        max={14}
        step={2}
        onInput={(size) => setParams((p) => ({ ...p, size }))}
        value={params.size}
      />
      <div className="flex w-full justify-evenly">
        <Knob
          className="knob"
          title="Detune"
          dragResistance={50}
          max={100}
          onValueChange={(detune) => setParams((p) => ({ ...p, detune }))}
          value={params.detune}
        />
        <Knob
          className="knob"
          title="Spread"
          dragResistance={50}
          max={100}
          onValueChange={(spread) => setParams((p) => ({ ...p, spread }))}
          value={params.spread}
        />
      </div>
    </div>
  );
}
