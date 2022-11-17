import { useRef } from "react";
import "./WaveformSelector.scss";
interface WaveformSelectorProps {
  onClick: (wave: OscillatorType) => void;
  className?: string;
  orientation?: "vertical" | "horizontal";
}
export function WaveformSelector(props: WaveformSelectorProps) {
  const waveformIcons = useRef<HTMLDivElement>(null);
  const waveForms = ["Sine", "Triangle", "Sawtooth", "Square"];
  const iconsUrl = `https://www.iconbolt.com/iconsets/phosphor-regular`;

  function handleOnClick(ev: React.MouseEvent, wave: string) {
    const icons = waveformIcons.current!.querySelectorAll("img");
    icons.forEach((icon) => icon.classList.remove("selected"));
    ev.currentTarget.children[0].classList.add("selected");
    props.onClick(wave as OscillatorType);
  }

  function createIcon(wave: string, index: number) {
    const src = `${iconsUrl}/wave-${wave.toLowerCase()}.svg`;
    const className = `waveform-icon ${index === 0 ? "selected" : ""}`;
    return (
      <button key={wave} onClick={(ev) => handleOnClick(ev, wave)}>
        <img className={className} alt={wave} src={src} />
      </button>
    );
  }
  return (
    <div
      className={`waveform-selector ${props.orientation} ${props.className}`}
    >
      <div
        ref={waveformIcons}
        className={`waveform-icon-container ${props.orientation}`}
      >
        {waveForms.map(createIcon)}
      </div>
    </div>
  );
}
