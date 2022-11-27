import { useEffect, useState } from "react";
import { Knob, KnobProps } from "view/components";
import "./Envelope.scss";
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
  onChange?: (envelope: IEnvelopeParams) => void;
  values?: IEnvelopeParams | null;
}
export function Envelope(props: EnvelopeProps) {
  const { className, onChange } = props;
  const [envelopeParams, setEnvelopeParams] = useState<IEnvelopeParams>({});
  const dragResistance = 50;

  const onAmountChange = (value: number) => {
    setEnvelopeParams((p) => ({ ...p, amount: value }));
  };
  const onAttackChange = (value: number) => {
    setEnvelopeParams((p) => ({ ...p, attack: value }));
  };
  const onDecayChange = (value: number) => {
    setEnvelopeParams((p) => ({ ...p, decay: value }));
  };
  const onSustainChange = (value: number) => {
    setEnvelopeParams((p) => ({ ...p, sustain: value }));
  };
  const onReleaseChange = (value: number) => {
    setEnvelopeParams((p) => ({ ...p, release: value }));
  };

  useEffect(() => {
    onChange?.(envelopeParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envelopeParams]);
  const { values } = props;
  useEffect(() => {
    if (!values) return;
    setEnvelopeParams(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <div className={className}>
      <h3>{props.title ?? "Envelope"}</h3>
      <div className="envelope-knobs">
        <Knob
          className="envelope-knob"
          title="Attack"
          dragResistance={dragResistance}
          onValueChange={props.release?.onValueChange ?? onAttackChange}
          logarithmic
          max={props.attack?.max ?? 50}
          step={props.attack?.step ?? 0.1}
          value={envelopeParams.attack}
          {...props.attack}
        />
        <Knob
          className="envelope-knob"
          title="Decay"
          dragResistance={dragResistance}
          onValueChange={onDecayChange}
          logarithmic
          max={props.decay?.max ?? 50}
          step={props.decay?.step ?? 0.1}
          value={envelopeParams.decay}
          {...props.decay}
        />
        <Knob
          title="Sustain"
          className="envelope-knob"
          dragResistance={dragResistance}
          onValueChange={props.release?.onValueChange ?? onSustainChange}
          value={envelopeParams.sustain}
          {...props.sustain}
        />
        <Knob
          className="envelope-knob"
          title="Release"
          dragResistance={dragResistance}
          onValueChange={props.release?.onValueChange ?? onReleaseChange}
          logarithmic
          max={props.release?.max ?? 50}
          step={props.release?.step ?? 0.1}
          value={envelopeParams.release}
          {...props.release}
        />
        <Knob
          {...props.amount}
          className="envelope-knob"
          title="Amount"
          dragResistance={dragResistance}
          onValueChange={props.release?.onValueChange ?? onAmountChange}
          value={envelopeParams.amount}
        />
      </div>
    </div>
  );
}
