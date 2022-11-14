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
}
export function Envelope(props: EnvelopeProps) {
  const { className } = props;
  const {
    onAmountChange,
    onAttackChange,
    onDecayChange,
    onSustainChange,
    onReleaseChange,
  } = props;

  const [amount, setAmount] = useState(1);
  const [attack, setAttack] = useState(0);
  const [decay, setDecay] = useState(0);
  const [sustain, setSustain] = useState(1);
  const [release, setRelease] = useState(0);

  return (
    <div className={className}>
      <h3>Envelope</h3>
      <Slider
        title="Amount"
        titleClassName="text-sm"
        className="flex w-full items-center gap-x-1"
        outputClassName="slider-output w-fit px-1 text-center h-fit col-span-1 "
        max={1}
        step={0.001}
        outputValue={amount.toFixed(2)}
        onInput={(value) => {
          if (onAmountChange) onAmountChange(value);
          setAmount(value);
        }}
      />
      <div className="flex h-full w-full justify-between">
        <Slider
          title="Attack"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          step={0.001}
          outputValue={Utils.linToExp2(attack * 5, 0, 4).toFixed(2)}
          onInput={(value) => {
            if (onAttackChange) onAttackChange(value);
            setAttack(value);
          }}
        />
        <Slider
          title="Decay"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          step={0.001}
          outputValue={decay * 5}
          onInput={(value) => {
            if (onDecayChange) onDecayChange(value);
            setDecay(value);
          }}
        />
        <Slider
          title="Sustain"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          defaultValue={1}
          step={0.001}
          outputValue={sustain}
          onInput={(value) => {
            if (onSustainChange) onSustainChange(value);
            setSustain(value);
          }}
        />
        <Slider
          title="Release"
          className="flex h-full flex-col items-center gap-1 bg-zinc-700 p-1"
          orientation="vertical"
          max={1}
          step={0.001}
          outputValue={release * 5}
          onInput={(value) => {
            if (onReleaseChange) onReleaseChange(value);
            setRelease(value);
          }}
        />
      </div>
    </div>
  );
}
