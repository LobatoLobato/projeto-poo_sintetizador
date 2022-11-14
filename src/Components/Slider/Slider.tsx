import InputRange from "./InputRange";
import "./Slider.scss";

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
export function Slider(props: SliderProps) {
  const { inputClassNames, inputClassName } = props;
  const { key, step, min, max, defaultValue, outputValue } = props;
  const labelKey = props.key ? `label-${key}` : undefined;
  const outputKey = props.key ? `output-${key}` : undefined;
  const inputKey = props.key ? `input-${key}` : undefined;
  const classNameMod = props.orientation || "horizontal";
  const className = `${props.className} slider-default`;
  const labelCN = props.titleClassName || "slider-label";
  const inputCN =
    inputClassNames?.at(0) || `${inputClassName} slider-input ${classNameMod}`;
  const trackCN = inputClassNames?.at(1) || `input-track ${classNameMod}`;
  const progressCN = inputClassNames?.at(2) || `input-progress ${classNameMod}`;
  const thumbCN = inputClassNames?.at(3) || `input-thumb ${classNameMod}`;
  const outputCN = props.outputClassName || `slider-output ${classNameMod}`;

  return (
    <div key={key} className={className}>
      <label key={labelKey} className={labelCN}>
        {props.title}
      </label>
      <InputRange
        className={inputCN}
        trackClassName={trackCN}
        progressClassname={progressCN}
        thumbClassname={thumbCN}
        colors={props.colors || ["#ff4000", "#ff0099", "#ddd"]}
        onChange={props.onInput}
        defaultValue={defaultValue}
        step={step}
        min={min}
        max={max}
        orientation={props.orientation}
        key={inputKey}
      />
      <output key={outputKey} className={outputCN}>
        {outputValue}
      </output>
    </div>
  );
}
