import { EnvelopeModule } from "models";
import { Slider } from "components/Slider/Slider";
import { useState } from "react";
import { Utils } from "common";
interface EnvelopeProps {
  className?: string;
  connectTo?: AudioNode | AudioParam;
  onMount?: (module: EnvelopeModule) => void;
  onAmountChange?: (value: number) => void;
  onAttackChange?: (value: number) => void;
  onDecayChange?: (value: number) => void;
  onSustainChange?: (value: number) => void;
  onReleaseChange?: (value: number) => void;
  defaultAmount?: number;
  defaultAttack?: number;
  defaultDecay?: number;
  defaultSustain?: number;
  defaultRelease?: number;
  amountStep?: number;
  attackStep?: number;
  decayStep?: number;
  sustainStep?: number;
  releaseStep?: number;
}
export function Envelope(props: EnvelopeProps) {
  const { className } = props;
  const [amount, setAmount] = useState(props.defaultAmount ?? 1);
  const [attack, setAttack] = useState(props.defaultAttack ?? 0);
  const [decay, setDecay] = useState(props.defaultAttack ?? 0);
  const [sustain, setSustain] = useState(props.defaultSustain ?? 1);
  const [release, setRelease] = useState(props.defaultRelease ?? 0);

  return (
    <div className={className}>
      <h3>Envelope</h3>
      <Slider
        title="Amount"
        titleClassName="text-sm"
        className="flex w-full items-center gap-x-1"
        outputClassName="slider-output w-fit px-1 text-center h-fit col-span-1 "
        max={1}
        step={props.amountStep ?? 0.001}
        defaultValue={props.defaultAmount ?? 1}
        outputValue={amount.toFixed(2)}
        onInput={(value) => {
          if (props.onAmountChange) props.onAmountChange(value);
          setAmount(value);
        }}
      />
      <div className="flex h-full w-full justify-between">
        <Slider
          title="Attack"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          step={props.attackStep ?? 0.001}
          defaultValue={props.defaultAttack ?? 0}
          outputValue={Utils.linToExp2(attack * 5, 0, 4).toFixed(2)}
          onInput={(value) => {
            if (props.onAttackChange) props.onAttackChange(value);
            setAttack(value);
          }}
        />
        <Slider
          title="Decay"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          step={props.decayStep ?? 0.001}
          defaultValue={props.defaultDecay ?? 0}
          outputValue={(decay * 5).toFixed(2)}
          onInput={(value) => {
            if (props.onDecayChange) props.onDecayChange(value);
            setDecay(value);
          }}
        />
        <Slider
          title="Sustain"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          defaultValue={props.defaultSustain ?? 1}
          step={props.sustainStep ?? 0.001}
          outputValue={sustain.toFixed(2)}
          onInput={(value) => {
            if (props.onSustainChange) props.onSustainChange(value);
            setSustain(value);
          }}
        />
        <Slider
          title="Release"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          step={props.releaseStep ?? 0.001}
          defaultValue={props.defaultRelease ?? 0}
          outputValue={(release * 5).toFixed(2)}
          onInput={(value) => {
            if (props.onReleaseChange) props.onReleaseChange(value);
            setRelease(value);
          }}
        />
      </div>
    </div>
  );
}
