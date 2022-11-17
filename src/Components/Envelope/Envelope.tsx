import { EnvelopeModule } from "models";
import { Knob, KnobProps } from "components";
import "./Envelope.scss";

interface EnvelopeProps {
  className?: string;
  title?: string;
  connectTo?: AudioNode | AudioParam;
  onMount?: (module: EnvelopeModule) => void;
  amount?: KnobProps;
  attack?: KnobProps;
  decay?: KnobProps;
  sustain?: KnobProps;
  release?: KnobProps;
}
export function Envelope(props: EnvelopeProps) {
  const { className } = props;
  const dragResistance = 50;
  return (
    <div className={className}>
      <h3>{props.title ?? "Envelope"}</h3>
      <div className="envelope-knobs">
        <Knob
          className="envelope-knob"
          title="Attack"
          dragResistance={dragResistance}
          {...props.attack}
        />
        <Knob
          className="envelope-knob"
          title="Decay"
          dragResistance={dragResistance}
          {...props.decay}
        />
        <Knob
          title="Sustain"
          className="envelope-knob"
          dragResistance={dragResistance}
          {...props.sustain}
        />
        <Knob
          className="envelope-knob"
          title="Release"
          dragResistance={dragResistance}
          {...props.release}
        />
        <Knob
          className="envelope-knob"
          title="Amount"
          dragResistance={dragResistance}
          {...props.amount}
        />
      </div>
    </div>
  );
}
