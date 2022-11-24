import { InputRange } from "./InputRange";
import "./Slider.scss";
import React, { useEffect, useState } from "react";
import { Utils } from "common";

interface SliderProps {
  className?: string;
  outputClassName?: string;
  titleClassName?: string;
  inputClassName?: string;
  inputClassNames?: string[];
  colors?: string[];
  orientation?: "vertical" | "horizontal";
  title?: string;
  max?: number;
  min?: number;
  step?: number;
  defaultValue?: number;
  outputValue?: number | string;
  key?: string;
  onInput?: (value: number) => void;
}

export class Slider extends React.Component<SliderProps, { value?: number }> {
  constructor(props: SliderProps) {
    super(props);
    this.state = {
      value: props.defaultValue,
    };
  }
  public getValue(): number | undefined {
    return this.state.value;
  }
  public setValue(value: number | undefined) {
    if (value === undefined) return;
    this.setState({ value: value });
    if (this.props.onInput) this.props.onInput(value);
  }
  render() {
    const { inputClassNames, inputClassName } = this.props;
    const { className, titleClassName, outputClassName } = this.props;
    const { step, min, max, defaultValue, outputValue } = this.props;
    const labelKey = this.props.key ? `label-${this.props.key}` : undefined;
    const outputKey = this.props.key ? `output-${this.props.key}` : undefined;
    const inputKey = this.props.key ? `input-${this.props.key}` : undefined;

    const CNMod = this.props.orientation || "horizontal";
    const CN = `${className} slider-default`;
    const labelCN = titleClassName || "slider-label";

    const [input_CN, track_CN, prog_CN, thumb_cn] = inputClassNames ?? [];
    const inputCN = input_CN ?? `${inputClassName} slider-input ${CNMod}`;
    const trackCN = track_CN ?? `input-track ${CNMod}`;
    const progressCN = prog_CN ?? `input-progress ${CNMod}`;
    const thumbCN = thumb_cn ?? `input-thumb ${CNMod}`;
    const outputCN = outputClassName ?? `slider-output ${CNMod}`;

    return (
      <div key={this.props.key} className={CN}>
        <label key={labelKey} className={labelCN}>
          {this.props.title}
        </label>
        <InputRange
          className={inputCN}
          trackClassName={trackCN}
          progressClassname={progressCN}
          thumbClassname={thumbCN}
          colors={this.props.colors || ["#ff4000", "#ff0099", "#ddd"]}
          onChange={(value) => {
            if (this.props.onInput) this.props.onInput(value);
            this.setValue(value);
          }}
          defaultValue={defaultValue}
          step={step}
          min={min}
          max={max}
          orientation={this.props.orientation}
          key={inputKey}
          value={this.state.value}
        />
        <output key={outputKey} className={outputCN}>
          {outputValue}
        </output>
      </div>
    );
  }
}
interface SliderProps2 {
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
    setValue: () => (value: number, linearize?: boolean) => void
  ) => void;
}
export function Slider2(props: SliderProps2) {
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
      onMount(() => (value: number, linearize?: boolean) => {
        if (linearize) {
          setValue(
            Utils.logToLinScale(value, min ?? 0, max ?? 100, step ?? 0.1)
          );
        } else {
          setValue(value);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max, min, step]);
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
        console.log(out);
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
