interface SliderProps {
  className?: string;
  inputClassName?: string;
  outputClassName?: string;
  titleClassName?: string;
  title?: string;
  max?: number | string;
  min?: number | string;
  step?: number | string;
  defaultValue?: number | string;
  outputValue?: number | string;
  onInput?: (value: number) => void;
}
export function Slider(props: SliderProps) {
  return (
    <div className={props.className}>
      <label className={props.titleClassName}>{props.title}</label>
      <input
        className={props.inputClassName}
        type="range"
        max={props.max}
        step={props.step}
        defaultValue={props.defaultValue}
        onInput={(ev) => {
          if (props.onInput) props.onInput(ev.currentTarget.valueAsNumber);
        }}
      />
      <output className={props.outputClassName}>{props.outputValue}</output>
    </div>
  );
}
