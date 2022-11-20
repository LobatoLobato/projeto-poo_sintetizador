import { InputRange } from "./InputRange";
import "./Slider.scss";
import React from "react";

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
// export const Slider = React.forwardRef<Range, SliderProps>((props, ref) => {
//   const { inputClassNames, inputClassName } = props;
//   const { key, step, min, max, defaultValue, outputValue, value } = props;
//   const labelKey = props.key ? `label-${key}` : undefined;
//   const outputKey = props.key ? `output-${key}` : undefined;
//   const inputKey = props.key ? `input-${key}` : undefined;
//   const classNameMod = props.orientation || "horizontal";
//   const className = `${props.className} slider-default`;
//   const labelCN = props.titleClassName || "slider-label";
//   const inputCN =
//     inputClassNames?.at(0) || `${inputClassName} slider-input ${classNameMod}`;
//   const trackCN = inputClassNames?.at(1) || `input-track ${classNameMod}`;
//   const progressCN = inputClassNames?.at(2) || `input-progress ${classNameMod}`;
//   const thumbCN = inputClassNames?.at(3) || `input-thumb ${classNameMod}`;
//   const outputCN = props.outputClassName || `slider-output ${classNameMod}`;

//   return (
//     <div key={key} className={className}>
//       <label key={labelKey} className={labelCN}>
//         {props.title}
//       </label>

//       <InputRange
//         className={inputCN}
//         trackClassName={trackCN}
//         progressClassname={progressCN}
//         thumbClassname={thumbCN}
//         colors={props.colors || ["#ff4000", "#ff0099", "#ddd"]}
//         onChange={props.onInput}
//         defaultValue={defaultValue}
//         step={step}
//         min={min}
//         max={max}
//         orientation={props.orientation}
//         key={inputKey}
//         value={value}
//       />
//       <output key={outputKey} className={outputCN}>
//         {outputValue}
//       </output>
//     </div>
//   );
// });
