import { useEffect, useRef, useState } from "react";
import "./Knob.scss";
import {
  FLStandardKnob,
  FLStandardKnobOptions,
} from "precision-inputs/dist/precision-inputs";
import { Utils } from "common";

export interface KnobProps extends FLStandardKnobOptions {
  className?: string;
  title?: string;
  onValueChange?: (value: number) => void;
  logarithmic?: boolean;
  value?: number | null;
}

export function Knob(props: KnobProps) {
  const knobContainer = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<FLStandardKnob | null>();
  const { className, title, onValueChange } = props;
  const min = props.min ?? 0;
  const max = props.max ?? 1;
  const step = props.step ?? 0.01;
  const initial = props.initial ?? min;

  useEffect(() => {
    const kContainer = knobContainer.current;
    if (!kContainer) return;
    const knobOptions = { ...props, initial };
    const knob = new FLStandardKnob(kContainer, knobOptions);

    setKnob(knob);

    return () => {
      kContainer.lastChild?.remove();
      setKnob(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knobContainer, initial]);

  const { logarithmic } = props;
  useEffect(() => {
    if (!knob) return;
    const handleValueChange = () => {
      let kValue = knob?.value ?? initial;
      if (logarithmic) kValue = Utils.linToLogScale(kValue, min, max, step);
      onValueChange?.(kValue);
    };
    knob.addEventListener("change", handleValueChange);
    knob.addEventListener("dblclick", handleValueChange);
    knob.addEventListener("wheel", handleValueChange);
    return () => {
      knob.removeEventListener("change", handleValueChange);
      knob.removeEventListener("dblclick", handleValueChange);
      knob.removeEventListener("wheel", handleValueChange);
    };
  }, [knob, max, min, onValueChange, initial, logarithmic, step]);

  const { value } = props;
  useEffect(() => {
    if (!knob || typeof value !== "number") return;
    knob.value = logarithmic
      ? Utils.logToLinScale(value, min, max, step)
      : value;
  }, [value, knob, logarithmic, min, max, step]);

  return (
    <div className={className}>
      <p>{title}</p>
      <div className="w-full" ref={knobContainer} />
    </div>
  );
}
