import { useEffect, useMemo, useState } from "react";
import "./Rack.scss";
import {
  AmplifierModule,
  FilterModule,
  LFOModule,
  Module,
  OscillatorModule,
  VisualizerModule,
} from "models";
import { Amplifier, Oscillator, LFO } from "components";
import { RackController } from "controller";
import { useGlobalState } from "state-pool";
import { LOAD_PRESET, SAVE_PRESET } from "../NavBar/NavBar";
import Filter from "components/Modules/Filter/Filter";
import { Utils } from "common";

interface RackProps {
  noteOn: { note: number; active: boolean };
  noteOff: { note: number; active: boolean };
  portamento: { time: number; on: boolean };
  legatoOn: boolean;
}
export function Rack(props: RackProps) {
  const [visualizer, setVisualizer] = useState<VisualizerModule>();
  const [savePreset] = useGlobalState<boolean>(SAVE_PRESET);
  const [loadPreset] = useGlobalState<boolean>(LOAD_PRESET);
  const { noteOn, noteOff, portamento, legatoOn } = props;
  const rack = useMemo(() => new RackController(), []);
  // useEffect(() => {
  //   if (noteOn.active && (!prevNoteState || !legatoOn)) {
  //     if (amplifier) amplifier.envelope.start();
  //     if (lfo) lfo.start();
  //     setPrevNoteState(true);
  //     // rack.noteOn(noteOn.note);
  //   } else if (noteOff.active) {
  //     if (amplifier) amplifier.envelope.stop();
  //     if (lfo) lfo.stop();
  //     setPrevNoteState(false);
  //     // rack.noteOff(noteOff.note);
  //   }
  // }, [noteOn, amplifier, lfo, noteOff, prevNoteState, legatoOn, rack]);
  useEffect(() => {
    if (noteOn.active) {
      rack.noteOn(noteOn.note);
      visualizer?.setPeriod(Utils.indexToFrequency(noteOn.note));
    }
  }, [rack, noteOn, visualizer]);
  useEffect(() => {
    if (noteOff.active) {
      rack.noteOff(noteOff.note);
    }
  }, [rack, noteOff]);
  // useEffect(() => {
  //   if (oscillator) {
  //     oscillator.setPortamentoOn(portamento.on);
  //     oscillator.setPortamentoTime(portamento.time);
  //   }
  // }, [portamento, oscillator]);
  useEffect(() => {
    if (visualizer) rack.output.connect(visualizer.getInputNode());
  }, [visualizer, rack]);
  return (
    <div className="rack">
      <LFO
        savePreset={savePreset}
        loadPreset={loadPreset}
        onChange={rack.setLFOParams}
      />
      <Oscillator
        savePreset={savePreset}
        loadPreset={loadPreset}
        onChange={rack.setOscillatorParams}
      />
      <Filter
        onChange={rack.setFilterParams}
        savePreset={savePreset}
        loadPreset={loadPreset}
      />
      <Amplifier
        onMount={setVisualizer}
        savePreset={savePreset}
        loadPreset={loadPreset}
        onChange={rack.setAmplifierParams}
      />
    </div>
  );
}
