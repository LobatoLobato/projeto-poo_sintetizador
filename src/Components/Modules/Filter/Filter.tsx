import React, { useState } from "react";
import { Envelope, Knob, Slider } from "components";
import {
  useLoadFromPreset,
  useOnParamsChange,
  useParamUpdater,
  useSaveToPreset,
} from "hooks";
import "./Filter.scss";
import { ModuleProps } from "models";
import { IFilterParams } from "models/Data";

export default function Filter(props: ModuleProps<IFilterParams>) {
  const { onChange, savePreset, loadPreset } = props;
  const params = useState<IFilterParams>({
    discriminator: "FilterParams",
  });
  const [setParam, loadParam] = useParamUpdater(params, loadPreset);

  useOnParamsChange(params[0], onChange);
  useSaveToPreset(params[0], savePreset);
  useLoadFromPreset(params, loadPreset);

  return (
    <div className="filter">
      Filter
      <div className="filter-top-container">
        <FilterTypeSelector onChange={(type) => setParam("type", type)} />
        <div className="filter-knob-container">
          <div className="flex h-12 w-full justify-between px-3">
            <Knob
              className="w-14 text-center text-xs"
              title="Cutoff"
              dragResistance={50}
              logarithmic
              step={1}
              min={60}
              max={20000}
              initial={20000}
              onValueChange={(cutoffFrequency) =>
                setParam("cutoffFrequency", cutoffFrequency)
              }
              value={loadParam("cutoffFrequency")}
            />
            <Knob
              className="w-14 text-center  text-xs"
              title="Reso"
              dragResistance={50}
              step={1}
              min={-10}
              initial={-10}
              max={50}
              onValueChange={(Q) => setParam("Q", Q)}
              value={loadParam("Q")}
            />
          </div>
          <Knob
            className="w-12 text-center  text-xs"
            title="Drive"
            dragResistance={50}
            step={0.01}
            min={0}
            max={2}
            onValueChange={(driveAmount) =>
              setParam("driveAmount", driveAmount)
            }
            value={loadParam("driveAmount")}
          />
        </div>
      </div>
      <div className="flex h-fit w-full justify-evenly bg-zinc-700">
        <button onClick={() => setParam("slope", "-24dB")}>Slope -24</button>
        <button onClick={() => setParam("slope", "-12dB")}>Slope -12</button>
      </div>
      <Envelope
        className="filter-envelope"
        onChange={(envelope) => setParam("envelope", envelope)}
        values={loadParam("envelope")}
        amount={{
          indicatorRingType: "split",
          initial: 0,
          max: 1000,
          min: -1000,
        }}
      />
      <div className="lfo-slider">
        <p>LFO Depth</p>
        <Slider
          onInput={(lfoDepth) => setParam("lfoDepth", lfoDepth)}
          max={1}
          step={0.01}
          value={loadParam("lfoDepth")}
        />
      </div>
    </div>
  );
}
interface TypeSelectorProps {
  onChange: (type: BiquadFilterType | "bypass") => void;
}
function FilterTypeSelector(props: TypeSelectorProps) {
  const { onChange } = props;
  return (
    <div className="flex w-2/5 flex-col items-start justify-between">
      <div className="text-xs" onClick={() => onChange("lowpass")}>
        🟡LPF
      </div>
      <div className="text-xs" onClick={() => onChange("highpass")}>
        🟡HPF
      </div>
      <div className="text-xs" onClick={() => onChange("bandpass")}>
        🟡BPF
      </div>
      <div className="text-xs" onClick={() => onChange("peaking")}>
        🟡PKG
      </div>
      <div className="text-xs" onClick={() => onChange("bypass")}>
        🟡BYPASS
      </div>
    </div>
  );
}
