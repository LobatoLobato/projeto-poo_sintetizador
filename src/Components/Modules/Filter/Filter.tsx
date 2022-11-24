import { Utils } from "common";
import { Envelope, Knob, Slider } from "components";
import { PRESET_MANAGER } from "controller";
import { ModuleProps } from "models";
import { IEnvelopeParams, IFilterParams } from "models/Data";
import { FLStandardKnob } from "precision-inputs/dist/precision-inputs";
import React, { useEffect, useRef, useState } from "react";
import "./Filter.scss";

export default function Filter(props: ModuleProps<IFilterParams>) {
  const lfoSlider = useRef<Slider>(null);
  const [lfoDepth, setLfoDepth] = useState(0);
  const [cutoffKnob, setCutoffKnob] = useState<FLStandardKnob>();
  const [qKnob, setQKnob] = useState<FLStandardKnob>();
  const [driveKnob, setDriveKnob] = useState<FLStandardKnob>();
  const envelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };
  const { onChange } = props;
  const { savePreset, loadPreset } = props;
  const [filterParams, setFilterParams] = useState<IFilterParams>({
    discriminator: "FilterParams",
  });

  useEffect(() => {
    if (!savePreset) return;
    PRESET_MANAGER.saveToCurrentPreset(filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePreset]);

  useEffect(() => {
    if (!loadPreset) return;
    const params = PRESET_MANAGER.loadFromCurrentPreset("FilterParams");
    const [setEnvelopeValues] = envelope.setValues;
    setEnvelopeValues?.(params.envelope);
    if (cutoffKnob) cutoffKnob.value = params.cutoffFrequency;
    if (qKnob) qKnob.value = params.Q;
    if (driveKnob) driveKnob.value = params.driveAmount;
    lfoSlider.current?.setValue(params.lfoDepth);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPreset]);

  useEffect(() => {
    onChange?.(filterParams);
  }, [filterParams, onChange]);

  return (
    <div className="filter">
      Filter
      <div className="h-fit text-sm">
        <div className="flex w-full  rounded-sm bg-zinc-700 py-1">
          <FilterTypeSelector
            onChange={(type) => {
              setFilterParams((p) => ({ ...p, type }));
            }}
          />
          <div className="flex h-fit w-full flex-col items-center justify-center">
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
                onValueChange={(cutoffFrequency) => {
                  setFilterParams((p) => ({ ...p, cutoffFrequency }));
                }}
                onMount={setCutoffKnob}
              />
              <Knob
                className="w-14 text-center  text-xs"
                title="Reso"
                dragResistance={50}
                step={1}
                min={-10}
                initial={-10}
                max={50}
                onValueChange={(Q) => {
                  setFilterParams((p) => ({ ...p, Q }));
                }}
                onMount={setQKnob}
              />
            </div>
            <Knob
              className="w-12 text-center  text-xs"
              title="Drive"
              dragResistance={50}
              step={0.01}
              min={0}
              max={2}
              onValueChange={(driveAmount) => {
                setFilterParams((p) => ({ ...p, driveAmount }));
              }}
              onMount={setDriveKnob}
            />
          </div>
        </div>
      </div>
      <div className="flex h-fit w-full justify-evenly bg-zinc-700">
        <button
          className=""
          onClick={() => {
            setFilterParams((p) => ({ ...p, slope: "-24dB" }));
          }}
        >
          Slope -24
        </button>
        <button
          onClick={() => {
            setFilterParams((p) => ({ ...p, slope: "-12dB" }));
          }}
        >
          Slope -12
        </button>
      </div>
      <Envelope
        className="flex h-fit w-full grow flex-col bg-zinc-700 px-1 pb-1 text-center text-sm"
        onMount={envelope.setValues[1]}
        onChange={(envelope) => setFilterParams((p) => ({ ...p, envelope }))}
        amount={{
          indicatorRingType: "split",
          initial: 0,
          max: 1000,
          min: -1000,
        }}
      />
      <Slider
        title="LFO Depth"
        titleClassName="text-xs whitespace-nowrap"
        className="flex h-fit w-full items-center gap-x-1 bg-zinc-700 p-1"
        outputClassName="slider-output w-fit px-1 text-center h-fit"
        max={2}
        step={0.01}
        outputValue={lfoDepth.toFixed(2)}
        onInput={(lfoDepth) => {
          lfoDepth = Utils.linToExp2(lfoDepth, 0, 3);
          setLfoDepth(lfoDepth);
          setFilterParams((p) => ({ ...p, lfoDepth }));
        }}
        ref={lfoSlider}
      />
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
