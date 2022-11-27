import { useEffect, useRef, useState } from "react";
import { Range, Direction, getTrackBackground } from "react-range";
interface Props {
  onChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
  defaultValue?: number;
  step?: number;
  min?: number;
  max?: number;
  colors?: string[];
  className?: string;
  trackClassName?: string;
  progressClassname?: string;
  thumbClassname?: string;
  value?: number;
}
export function InputRange(props: Props) {
  const { orientation, defaultValue, step, min, max, colors, value } = props;
  const { className, trackClassName, progressClassname, thumbClassname } =
    props;
  const track = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(Direction.Left);
  const [values, setValues] = useState([
    (max ?? 100) - (defaultValue ?? min ?? 0),
  ]);

  function handleDoubleClick() {
    setValues([(max ?? 100) - (defaultValue ?? min ?? 0)]);
    props.onChange?.(defaultValue ?? min ?? 0);
  }
  function handleOnChange(values: number[]) {
    setValues(values);
    props.onChange?.((max ?? 100) - values[0]);
  }
  useEffect(() => {
    if (!track.current) return;
    let direction = Direction.Left;
    if (orientation === "vertical") direction = Direction.Down;
    setDirection(direction);
    track.current.style.background = getTrackBackground({
      colors: [...(colors || ["#777", "#ddd"])].reverse(),
      min: min || 0,
      max: max || 100,
      direction,
      values,
    });
  }, [values, orientation, min, max, colors]);

  useEffect(() => {
    if (typeof value === "number") {
      setValues([(max ?? 100) - value]);
    }
  }, [max, value]);

  return (
    <div className={className} onDoubleClick={handleDoubleClick}>
      <Range
        direction={direction}
        step={step}
        min={min}
        max={max}
        values={values}
        onChange={handleOnChange}
        renderTrack={({ props, children }) => (
          <div
            className={trackClassName}
            style={props.style}
            ref={track}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
          >
            <div className={progressClassname} ref={props.ref}>
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className={thumbClassname}></div>
        )}
      />
    </div>
  );
}
