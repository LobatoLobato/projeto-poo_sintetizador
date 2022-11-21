import { Knob, KnobProps } from "components";
import "./Envelope.scss";
import { useEffect, useMemo, useState } from "react";
import { FLStandardKnob } from "precision-inputs/dist/precision-inputs";
import { IEnvelopeParams } from "models/Data/IEnvelopeParams";
import { EnvelopeModule } from "models";

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
  envelopeModule?: EnvelopeModule;
}
export function Envelope(props: EnvelopeProps) {
  const [amKnob, setAmKnob] = useState<FLStandardKnob>();
  const [atKnob, setAtKnob] = useState<FLStandardKnob>();
  const [deKnob, setDeKnob] = useState<FLStandardKnob>();
  const [suKnob, setSuKnob] = useState<FLStandardKnob>();
  const [reKnob, setReKnob] = useState<FLStandardKnob>();
  const { className, onMount, envelopeModule } = props;

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
  const onAmountChange = (value: number) => {
    props.amount?.onValueChange?.(value);
    if (envelopeModule) envelopeModule.setAmount(value);
  };
  const onAttackChange = (value: number) => {
    props.attack?.onValueChange?.(value);
    if (envelopeModule) envelopeModule.setAttack(value);
  };
  const onDecayChange = (value: number) => {
    props.decay?.onValueChange?.(value);
    if (envelopeModule) envelopeModule.setDecay(value);
  };
  const onSustainChange = (value: number) => {
    props.sustain?.onValueChange?.(value);
    if (envelopeModule) envelopeModule.setSustain(value);
  };
  const onReleaseChange = (value: number) => {
    props.release?.onValueChange?.(value);
    if (envelopeModule) envelopeModule.setRelease(value);
  };
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
          onValueChange={props.release?.onValueChange ?? onAttackChange}
          logarithmic
          max={props.attack?.max ?? 50}
          step={props.attack?.step ?? 0.1}
          {...props.attack}
        />
        <Knob
          className="envelope-knob"
          title="Decay"
          dragResistance={dragResistance}
          onMount={setDeKnob}
          onValueChange={onDecayChange}
          logarithmic
          max={props.decay?.max ?? 50}
          step={props.decay?.step ?? 0.1}
          {...props.decay}
        />
        <Knob
          title="Sustain"
          className="envelope-knob"
          dragResistance={dragResistance}
          onMount={setSuKnob}
          onValueChange={props.release?.onValueChange ?? onSustainChange}
          {...props.sustain}
        />
        <Knob
          className="envelope-knob"
          title="Release"
          dragResistance={dragResistance}
          onMount={setReKnob}
          onValueChange={props.release?.onValueChange ?? onReleaseChange}
          logarithmic
          max={props.release?.max ?? 50}
          step={props.release?.step ?? 1}
          {...props.release}
        />
        <Knob
          {...props.amount}
          className="envelope-knob"
          title="Amount"
          dragResistance={dragResistance}
          onMount={setAmKnob}
          onValueChange={props.release?.onValueChange ?? onAmountChange}
        />
      </div>
    </div>
  );
}
