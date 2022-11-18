import { useEffect, useState } from "react";
import "./Rack.scss";
import { AmplifierModule, LFOModule, Module, OscillatorModule } from "models";
import { Amplifier, Oscillator, LFO } from "components";
import { useGlobalState } from "state-pool";
import { LOAD_PRESET, SAVE_PRESET } from "../NavBar/NavBar";

interface RackProps {
  noteOn: { note: number; active: boolean };
  noteOff: { note: number; active: boolean };
  portamento: { time: number; on: boolean };
  legatoOn: boolean;
}
export function Rack(props: RackProps) {
  const [lfo, setLfo] = useState<LFOModule>();
  const [oscillator, setOscillator] = useState<OscillatorModule>();
  const [amplifier, setAmplifier] = useState<AmplifierModule>();
  const [prevNoteState, setPrevNoteState] = useState(false);
  const [savePreset] = useGlobalState<boolean>(SAVE_PRESET);
  const [loadPreset] = useGlobalState<boolean>(LOAD_PRESET);
  const { noteOn, noteOff, portamento, legatoOn } = props;

  useEffect(() => {
    if (noteOn.active && (!prevNoteState || !legatoOn)) {
      if (amplifier) amplifier.start();
      if (lfo) lfo.start();
      setPrevNoteState(true);
    } else if (noteOff.active) {
      if (amplifier) amplifier.stop();
      if (lfo) lfo.stop();
      setPrevNoteState(false);
    }
  }, [noteOn, amplifier, lfo, noteOff, prevNoteState, legatoOn]);
  useEffect(() => {
    if (oscillator) {
      oscillator.portamentoOn = portamento.on;
      oscillator.portamentoTime = portamento.time;
    }
  }, [portamento, oscillator]);
  return (
    <div className="rack">
      <LFO
        onMount={setLfo}
        connectTo={[amplifier?.lfoInputNode, oscillator?.lfoInputNode]}
        noteOn={noteOn}
        noteOff={noteOff}
        savePreset={savePreset}
        loadPreset={loadPreset}
      />
      <Oscillator
        onMount={setOscillator}
        connectTo={amplifier?.inputNode}
        noteOn={noteOn}
        noteOff={noteOff}
        savePreset={savePreset}
        loadPreset={loadPreset}
      />
      <Amplifier
        onMount={setAmplifier}
        connectTo={Module.context?.destination}
        noteOn={noteOn}
        savePreset={savePreset}
        loadPreset={loadPreset}
      />
    </div>
  );
}
