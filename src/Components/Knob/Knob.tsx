import { useEffect, useRef } from "react";
import "./Knob.scss";
import {
  FLStandardKnob,
  FLStandardKnobOptions,
} from "precision-inputs/dist/precision-inputs";
export interface KnobProps extends FLStandardKnobOptions {
  className?: string;
  title?: string;
  onValueChange?: (value: number) => void;
}
export function Knob(props: KnobProps) {
  const knobContainer = useRef<HTMLDivElement>(null);
  const { className, title, onValueChange } = props;
  // const deps = Object.entries(props).filter(([name]) => {
  //   return name !== "onValueChange";
  // });

  useEffect(
    () => {
      if (!knobContainer.current) return;
      while (knobContainer.current.lastChild)
        knobContainer.current.lastChild?.remove();

      const knob = new FLStandardKnob(knobContainer.current, {
        ...props,
        initial: props.initial ?? 0,
      });
      knob.addEventListener("change", (ev) => {
        if (onValueChange) onValueChange(knob.value);
      });
      knob.addEventListener("dblclick", (ev) => {
        if (onValueChange) onValueChange(knob.value);
      });
      knob.addEventListener("wheel", (ev) => {
        if (onValueChange) onValueChange(knob.value);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  /*Object.fromEntries(deps)*/

  return (
    <div className={className}>
      <p>{title}</p>
      <div className="w-full" ref={knobContainer} />
    </div>
  );
}