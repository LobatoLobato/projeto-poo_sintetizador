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
  value?: number | null;
}
export function Slider(props: SliderProps) {
  const { className, inputClassNames } = props;
  const [value, setValue] = useState(0);
  const inputKey = props.key ? `input-${props.key}` : undefined;
  const CNMod = props.orientation || "horizontal";
  const [input_CN, track_CN, prog_CN, thumb_cn] = inputClassNames ?? [];
  const inputCN = input_CN ?? `${className} slider-input ${CNMod}`;
  const trackCN = track_CN ?? `input-track ${CNMod}`;
  const progressCN = prog_CN ?? `input-progress ${CNMod}`;
  const thumbCN = thumb_cn ?? `input-thumb ${CNMod}`;
  const { step, min, max, defaultValue, logarithmic } = props;

  function handleOnChange(value: number) {
    const out = logarithmic
      ? Utils.linToLogScale(value, min ?? 0, max ?? 100, step ?? 0.1)
      : value;
    props.onInput?.(out);
    setValue(value);
  }

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
      onChange={handleOnChange}
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
