import React, { useEffect } from "react";
import { useRef } from "react";
import "./WaveformSelector.scss";
interface WaveformSelectorProps {
  onClick: (wave: OscillatorType) => void;
  className?: string;
  orientation?: "vertical" | "horizontal";
  value?: OscillatorType;
}
export function WaveformSelector(props: WaveformSelectorProps) {
  const waveformIcons = useRef<HTMLDivElement>(null);
  const iconRefs: React.RefObject<HTMLImageElement>[] = [];
  const waveForms = ["Sine", "Triangle", "Sawtooth", "Square"];
  const iconsUrl = `https://www.iconbolt.com/iconsets/phosphor-regular`;
  const { value, orientation, className } = props;

  function handleOnClick(ev: React.MouseEvent, wave: string) {
    const icons = iconRefs.map((icon) => icon.current);
    icons.forEach((icon) => icon?.classList.remove("selected"));
    ev.currentTarget.children[0].classList.add("selected");
    props.onClick(wave.toLowerCase() as OscillatorType);
  }

  function createIcon(wave: string, index: number) {
    const iconRef = React.createRef<HTMLImageElement>();
    iconRefs.push(iconRef);
    const src = `${iconsUrl}/wave-${wave.toLowerCase()}.svg`;
    const className = `waveform-icon ${index === 0 ? "selected" : ""}`;
    return (
      <button key={wave} onClick={(ev) => handleOnClick(ev, wave)}>
        <img ref={iconRef} className={className} alt={wave} src={src} />
      </button>
    );
  }

  useEffect(() => {
    if (value && iconRefs.length === waveForms.length) {
      const icons = iconRefs.map((icon) => icon.current);
      icons.forEach((icon) => icon?.classList.remove("selected"));
      const index = waveForms.indexOf(
        value.replace(/\b(\w)/g, (s) => s.toUpperCase())
      );
      icons.at(index)?.classList.add("selected");
      props.onClick(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`waveform-selector ${orientation} ${className}`}>
      <div
        ref={waveformIcons}
        className={`waveform-icon-container ${orientation}`}
      >
        {waveForms.map(createIcon)}
      </div>
    </div>
  );
}
