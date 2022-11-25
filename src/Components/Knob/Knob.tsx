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
  const { className, title, onValueChange } = props;
  const min = props.min ?? 0;
  const max = props.max ?? 1;
  const step = props.step ?? 0.01;
  const [knob, setKnob] = useState<FLStandardKnob>();

  useEffect(
    () => {
      if (!knobContainer.current) return;
      while (knobContainer.current.lastChild)
        knobContainer.current.lastChild?.remove();

      const knob = new FLStandardKnob(knobContainer.current, {
        ...props,
        initial: props.initial ?? 0,
      });
      setKnob(knob);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [knobContainer]
  );
  useEffect(() => {
    if (!knob) return;
    function handleValueChange() {
      const kValue = knob?.value ?? props.initial ?? min;
      const value = props.logarithmic
        ? Utils.linToLogScale(kValue, min, max, step)
        : kValue;
      if (onValueChange) onValueChange(value);
    }
    knob.addEventListener("change", handleValueChange);
    knob.addEventListener("dblclick", handleValueChange);
    knob.addEventListener("wheel", handleValueChange);
  }, [knob, max, min, onValueChange, props.initial, props.logarithmic, step]);

  const { value } = props;
  useEffect(() => {
    if (!knob || typeof value !== "number") return;
    knob.value = props.logarithmic
      ? Utils.logToLinScale(value ?? props.initial ?? min, min, max, step)
      : value ?? props.initial;
  }, [value, knob, props.logarithmic, props.initial, min, max, step]);
  return (
    <div className={className}>
      <p>{title}</p>
      <div className="w-full" ref={knobContainer} />
    </div>
  );
}
