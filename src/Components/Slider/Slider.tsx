import { InputRange } from "./InputRange";
import "./Slider.scss";
import React, { useEffect, useState } from "react";
import { Utils } from "common";

interface SliderProps {
  className?: string;
  inputClassNames?: string[];
  colors?: string[];
  orientation?: "vertical" | "horizontal";
  max?: number;
  min?: number;
  step?: number;
  defaultValue?: number;
  key?: string;
  logarithmic?: boolean;
  onInput?: (value: number) => void;
  onMount?: (
    setValue: () => (value: number | undefined, linearize?: boolean) => void
  ) => void;
  value?: number | null;
}
export function Slider(props: SliderProps) {
  const { className, inputClassNames } = props;
  const { onMount } = props;
  const { step, min, max, defaultValue, logarithmic } = props;
  const [value, setValue] = useState(0);
  const inputKey = props.key ? `input-${props.key}` : undefined;
  const CNMod = props.orientation || "horizontal";
  const [input_CN, track_CN, prog_CN, thumb_cn] = inputClassNames ?? [];
  const inputCN = input_CN ?? `${className} slider-input ${CNMod}`;
  const trackCN = track_CN ?? `input-track ${CNMod}`;
  const progressCN = prog_CN ?? `input-progress ${CNMod}`;
  const thumbCN = thumb_cn ?? `input-thumb ${CNMod}`;

  useEffect(() => {
    if (onMount)
      onMount(() => (value: number | undefined, linearize?: boolean) => {
        value = value ?? defaultValue ?? 0;
        if (linearize) {
          value = Utils.logToLinScale(value, min ?? 0, max ?? 100, step ?? 0.1);
          setValue(value);
        } else {
          setValue(value);
        }
        props.onInput?.(value);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max, min, step]);

  useEffect(() => {
    if (typeof props.value !== "number") return;
    const value = props.value;
    if (logarithmic) {
      setValue(Utils.logToLinScale(value, min ?? 0, max ?? 100, step ?? 0.1));
    } else {
      setValue(value);
    }
  }, [defaultValue, logarithmic, max, min, step, props.value]);

  return (
    <InputRange
      className={inputCN}
      trackClassName={trackCN}
      progressClassname={progressCN}
      thumbClassname={thumbCN}
      colors={props.colors || ["#ff4000", "#ff0099", "#ddd"]}
      onChange={(value) => {
        const out = logarithmic
          ? Utils.linToLogScale(value, min ?? 0, max ?? 100, step ?? 0.1)
          : value;
        if (props.onInput) props.onInput(out);
        setValue(value);
      }}
      defaultValue={defaultValue}
      step={step}
      min={min}
      max={max}
      orientation={props.orientation}
      key={inputKey}
      value={value}
    />
  );
}
