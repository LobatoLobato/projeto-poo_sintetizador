import { useEffect, useRef } from "react";
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
  onMount?: (knob: FLStandardKnob) => void;
  logarithmic?: boolean;
}
export function Knob(props: KnobProps) {
  const knobContainer = useRef<HTMLDivElement>(null);
  const { className, title, onValueChange, onMount } = props;
  const min = props.min ?? 0;
  const max = props.max ?? 1;
  const step = props.step ?? 0.01;

  useEffect(
    () => {
      if (!knobContainer.current) return;
      while (knobContainer.current.lastChild)
        knobContainer.current.lastChild?.remove();

      const knob = new FLStandardKnob(knobContainer.current, {
        ...props,
        initial: props.initial ?? 0,
      });
      function handleValueChange() {
        const kValue = knob.value ?? 0;
        const value = props.logarithmic
          ? Utils.linToLogScale(kValue, min, max, step)
          : kValue;

        if (onValueChange) onValueChange(value);
      }
      knob.addEventListener("change", handleValueChange);
      knob.addEventListener("dblclick", handleValueChange);
      knob.addEventListener("wheel", handleValueChange);
      if (onMount) onMount(knob);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onMount]
  );
  /*Object.fromEntries(deps)*/

  return (
    <div className={className}>
      <p>{title}</p>
      <div className="w-full" ref={knobContainer} />
    </div>
  );
}
