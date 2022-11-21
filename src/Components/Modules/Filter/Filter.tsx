import { Utils } from "common";
import { Envelope, Knob, Slider } from "components";
import { PRESET_MANAGER } from "controller";
import { ModuleProps, FilterModule } from "models";
import { IEnvelopeParams, IFilterParams } from "models/Data";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Filter.scss";

export default function Filter(props: ModuleProps<FilterModule>) {
  const filter = useMemo(() => new FilterModule(), []);
  const lfoSlider = useRef<Slider>(null);
  const [lfoDepth, setLfoDepth] = useState(0);
  const envelope = {
    getValues: useState<() => IEnvelopeParams>(),
    setValues: useState<(values: IEnvelopeParams | undefined) => void>(),
  };
  const { onMount, connectTo, noteOn } = props;
  const { savePreset, loadPreset } = props;

  useEffect(() => {
    if (onMount) onMount(filter);
  }, [onMount, filter]);
  // useEffect(() => {
  //   if (!savePreset) return;
  //   const [getEnvelopeValues] = envelope.getValues;
  //   PRESET_MANAGER.saveToCurrentPreset<IFilterParams>({
  //     discriminator: "FilterParams",
  //     // envelope: getEnvelopeValues?.(),
  //     // lfo_depth: lfoSlider.current?.getValue(),
  //   });
  //   console.log("Saving amplifier parameters");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [savePreset]);

  // useEffect(() => {
  //   if (!loadPreset) return;
  //   const params = PRESET_MANAGER.loadFromCurrentPreset("AmplifierParams");
  //   const [setEnvelopeValues] = envelope.setValues;
  //   setEnvelopeValues?.(params.envelope);
  //   lfoSlider.current?.setValue(params.lfo_depth);

  //   console.log("Loading amplifier parameters");
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [loadPreset]);

  useEffect(() => {
    if (!connectTo || !filter) return;
    if (Array.isArray(connectTo)) {
      connectTo.forEach((destination) => filter.connect(destination));
    } else {
      filter.connect(connectTo);
    }
  }, [connectTo, filter]);
  return (
    <div className="filter">
      Filter
      <div className="h-full text-sm">
        <div className="flex w-full  rounded-sm bg-zinc-700 py-1">
          <div className="flex w-2/5 flex-col items-start justify-between">
            <div className="text-xs">🟡LPF</div>
            <div className="text-xs">🟡HPF</div>
            <div className="text-xs">🟡BPF</div>
            <div className="text-xs">🟡PKG</div>
            <div className=" text-xs">🟡BYPASS</div>
          </div>
          <div className="flex h-fit w-full flex-col items-center justify-center">
            <div className="flex h-12 w-full justify-between px-3">
              <Knob
                className="w-14 text-center text-xs"
                title="Cutoff"
                dragResistance={50}
                step={1}
                min={0}
                max={20000}
                onValueChange={(value) => filter.setCutoff(value)}
                // onMount={setPoKnob}
              />
              <Knob
                className="w-14 text-center  text-xs"
                title="Reso"
                dragResistance={50}
                step={1}
                min={0}
                max={50}
                onValueChange={(value) => filter.setResonance(value)}
                // onMount={setPoKnob}
              />
            </div>
            <Knob
              className="w-12 text-center  text-xs"
              title="Drive"
              dragResistance={50}
              step={1}
              min={-24}
              max={24}
              // onValueChange={(value) => (oscillator.pitchOffset = value)}
              // onMount={setPoKnob}
            />
          </div>
        </div>
      </div>
      <Envelope
        className="flex h-fit w-full grow flex-col bg-zinc-700 px-1 pb-1 text-center text-sm"
        onMount={(getValues, setValues) => {
          envelope.getValues[1](getValues);
          envelope.setValues[1](setValues);
        }}
        amount={{
          initial: 0.22,
          onValueChange: filter.envelope.setAmount,
        }}
        attack={{
          onValueChange: filter.envelope.setAttack,
        }}
        decay={{
          onValueChange: filter.envelope.setDecay,
        }}
        sustain={{
          initial: 1,
          onValueChange: filter.envelope.setSustain,
        }}
        release={{
          onValueChange: filter.envelope.setRelease,
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
        onInput={(value) => {
          value = Utils.linToExp2(value, 0, 3);
          setLfoDepth(value);
          // filter.lfoAmount = value;
        }}
        ref={lfoSlider}
      />
    </div>
  );
}
