import { Knob, KnobProps } from "components";
import "./Envelope.scss";
import { useEffect, useMemo, useState } from "react";
import { FLStandardKnob } from "precision-inputs/dist/precision-inputs";
import { IEnvelopeParams } from "models/Data/IEnvelopeParams";
import { Utils } from "common";

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
    setValues: () => (values: IEnvelopeParams | undefined) => void
  ) => void;
  onChange?: (envelope: IEnvelopeParams) => void;
}
export function Envelope(props: EnvelopeProps) {
  const [amKnob, setAmKnob] = useState<FLStandardKnob>();
  const [atKnob, setAtKnob] = useState<FLStandardKnob>();
  const [deKnob, setDeKnob] = useState<FLStandardKnob>();
  const [suKnob, setSuKnob] = useState<FLStandardKnob>();
  const [reKnob, setReKnob] = useState<FLStandardKnob>();
  const { className, onMount, onChange } = props;
  const [envelopeParams, setEnvelopeParams] = useState<IEnvelopeParams>({});
  const { amount, attack, decay, sustain, release } = props;
  const dragResistance = 50;

  const setValues = useMemo(() => {
    return function (values: IEnvelopeParams | undefined): void {
      if (!amKnob || !atKnob || !deKnob || !suKnob || !reKnob || !values) {
        return;
      }
      amKnob.value = values.amount ?? amount?.initial ?? 0;
      atKnob.value = Utils.logToLinScale(
        values.attack ?? attack?.initial ?? 0,
        attack?.min ?? 0,
        attack?.max ?? 50,
        attack?.step ?? 0.1
      );
      deKnob.value = Utils.logToLinScale(
        values.decay ?? decay?.initial ?? 0,
        decay?.min ?? 0,
        decay?.max ?? 50,
        decay?.step ?? 0.1
      );
      suKnob.value = values.sustain ?? sustain?.initial ?? 0;
      reKnob.value = Utils.logToLinScale(
        values.release ?? release?.initial ?? 0,
        release?.min ?? 0,
        release?.max ?? 50,
        release?.step ?? 0.1
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amKnob, atKnob, deKnob, reKnob, suKnob]);

  const onAmountChange = (value: number) => {
    if (amKnob) value = value ?? amKnob.initial;
    setEnvelopeParams((p) => ({ ...p, amount: value }));
  };
  const onAttackChange = (value: number) => {
    if (atKnob) value = value ?? atKnob.initial;
    setEnvelopeParams((p) => ({ ...p, attack: value }));
  };
  const onDecayChange = (value: number) => {
    if (deKnob) value = value ?? deKnob.initial;
    setEnvelopeParams((p) => ({ ...p, decay: value }));
  };
  const onSustainChange = (value: number) => {
    if (suKnob) value = value ?? suKnob.initial;
    setEnvelopeParams((p) => ({ ...p, sustain: value }));
  };
  const onReleaseChange = (value: number) => {
    if (reKnob) value = value ?? reKnob.initial;
    setEnvelopeParams((p) => ({ ...p, release: value }));
  };
  useEffect(() => {
    if (!onMount) return;
    onMount(() => setValues);
  }, [onMount, setValues]);
  useEffect(() => {
    onChange?.(envelopeParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envelopeParams]);
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
          step={props.release?.step ?? 0.1}
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
