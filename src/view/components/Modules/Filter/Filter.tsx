import React, { useEffect, useState } from "react";
import { Envelope, Knob, Slider } from "view/components";
import {
  useLoadFromPreset,
  useOnParamsChange,
  useParamUpdater,
  useSaveToPreset,
} from "view/hooks";
import "./Filter.scss";
import { ModuleProps } from "models";
import { IFilterParams } from "models/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

export function Filter(props: ModuleProps<IFilterParams>) {
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
        <div className="flex w-2/5 flex-col">
          <FilterTypeSelector
            onChange={(type) => setParam("type", type)}
            value={loadParam("type")}
          />
          <SlopeSelector onChange={(slope) => setParam("slope", slope)} />
        </div>
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
              onValueChange={(freq) => setParam("cutoffFrequency", freq)}
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
            onValueChange={(drive) => setParam("driveAmount", drive)}
            value={loadParam("driveAmount")}
          />
        </div>
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
  value: BiquadFilterType | "bypass" | undefined;
}
function FilterTypeSelector(props: TypeSelectorProps) {
  const [slc, setSlc] = useState("LPF");
  const { onChange, value } = props;
  function onClick(type: BiquadFilterType | "bypass") {
    setSlc(type);
    onChange(type);
  }
  useEffect(() => {
    if (value) setSlc(value);
  }, [value]);
  return (
    <div className="grid h-fit w-full grid-cols-2 items-start justify-center gap-3">
      <FTSOption name="LPF" type="lowpass" onClick={onClick} slc={slc} />
      <FTSOption name="HPF" type="highpass" onClick={onClick} slc={slc} />
      <FTSOption name="BPF" type="bandpass" onClick={onClick} slc={slc} />
      <FTSOption name="PKG" type="peaking" onClick={onClick} slc={slc} />
      <FTSOption name="BYP" type="bypass" onClick={onClick} slc={slc} />
    </div>
  );
}
interface TypeSelectorOptions {
  onClick: (type: BiquadFilterType | "bypass") => void;
  name: string;
  type: BiquadFilterType | "bypass";
  slc: string;
}
function FTSOption(props: TypeSelectorOptions) {
  const { type, name, slc } = props;
  const onClick = () => props.onClick(type);
  const color = slc === type ? "#FEA830" : "#AAAAAA";
  return (
    <div className="flex items-center gap-0.5 pl-0.5 text-xs" onClick={onClick}>
      <FontAwesomeIcon icon={faCircle} color={color} />
      {name}
    </div>
  );
}
interface SlopeSelectorProps {
  onChange: (slope: "-24dB" | "-12dB") => void;
}
function SlopeSelector(props: SlopeSelectorProps) {
  const [slope, setSlope] = useState<"-24dB" | "-12dB">("-12dB");
  const { onChange } = props;

  function onClick() {
    const s = slope === "-12dB" ? "-24dB" : "-12dB";
    setSlope(s);
    onChange(s);
  }
  const slopeAClr = slope === "-12dB" ? "text-amber-400" : "text-zinc-400";
  const slopeBClr = slope === "-24dB" ? "text-amber-400" : "text-zinc-400";
  return (
    <div className="flex h-full w-full items-center justify-between gap-1 pl-0.5">
      <button
        className="rounded-sm bg-zinc-500 py-0.5 px-1.5 shadow-sm shadow-black hover:bg-amber-400"
        onClick={onClick}
      >
        Slope
      </button>
      <div className="flex flex-col text-xs">
        <p className={`text-center ${slopeAClr}`}> -12dB</p>
        <p className={`text-center ${slopeBClr}`}>-24dB</p>
      </div>
    </div>
  );
}
