import { Knob, KnobProps } from "components";
import "./Envelope.scss";
import { useEffect, useMemo, useState } from "react";
import { FLStandardKnob } from "precision-inputs/dist/precision-inputs";
import { IEnvelopeParams } from "models/Data/IEnvelopeParams";

interface EnvelopeProps {
  className?: string;
  title?: string;
  connectTo?: AudioNode | AudioParam;
  amount?: KnobProps;
  attack?: KnobProps;
  decay?: KnobProps;
  sustain?: KnobProps;
  release?: KnobProps;
  onMount?: (
    getValues: () => () => IEnvelopeParams,
    setValues: () => (values: IEnvelopeParams | undefined) => void
  ) => void;
}
export function Envelope(props: EnvelopeProps) {
  const [amKnob, setAmKnob] = useState<FLStandardKnob>();
  const [atKnob, setAtKnob] = useState<FLStandardKnob>();
  const [deKnob, setDeKnob] = useState<FLStandardKnob>();
  const [suKnob, setSuKnob] = useState<FLStandardKnob>();
  const [reKnob, setReKnob] = useState<FLStandardKnob>();
  const { className, onMount } = props;
  const dragResistance = 50;
  const getValues = useMemo(() => {
    return function (): IEnvelopeParams {
      return {
        amount: amKnob?.value,
        attack: atKnob?.value,
        decay: deKnob?.value,
        sustain: suKnob?.value,
        release: reKnob?.value,
      };
    };
  }, [amKnob, atKnob, deKnob, reKnob, suKnob]);
  const setValues = useMemo(() => {
    return function (values: IEnvelopeParams | undefined): void {
      if (!amKnob || !atKnob || !deKnob || !suKnob || !reKnob || !values) {
        return;
      }
      amKnob.value = values.amount;
      atKnob.value = values.attack;
      deKnob.value = values.decay;
      suKnob.value = values.sustain;
      reKnob.value = values.release;
    };
  }, [amKnob, atKnob, deKnob, reKnob, suKnob]);

  useEffect(() => {
    if (!onMount) return;
    onMount(
      () => getValues,
      () => setValues
    );
  }, [getValues, onMount, setValues]);
  return (
    <div className={className}>
      <h3>{props.title ?? "Envelope"}</h3>
      <div className="envelope-knobs">
        <Knob
          className="envelope-knob"
          title="Attack"
          dragResistance={dragResistance}
          onMount={setAtKnob}
          {...props.attack}
        />
        <Knob
          className="envelope-knob"
          title="Decay"
          dragResistance={dragResistance}
          onMount={setDeKnob}
          {...props.decay}
        />
        <Knob
          title="Sustain"
          className="envelope-knob"
          dragResistance={dragResistance}
          onMount={setSuKnob}
          {...props.sustain}
        />
        <Knob
          className="envelope-knob"
          title="Release"
          dragResistance={dragResistance}
          onMount={setReKnob}
          {...props.release}
        />
        <Knob
          className="envelope-knob"
          title="Amount"
          dragResistance={dragResistance}
          onMount={setAmKnob}
          {...props.amount}
        />
      </div>
    </div>
  );
}
