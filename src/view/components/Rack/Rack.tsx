import { useEffect, useMemo, useState } from "react";
import "./Rack.scss";
import { NoteEvent, VisualizerModule } from "models";
import { Amplifier, Oscillator, LFO, Filter, FX } from "view/components";
import { RackController } from "controller";
import { Utils } from "common";
import { useLoadState, useSaveState } from "view/hooks";

export function Rack() {
  const rack = useMemo(() => new RackController(), []);
  const [visualizer, setVisualizer] = useState<VisualizerModule>();
  const savePreset = useSaveState();
  const loadPreset = useLoadState();

  useEffect(() => {
    function on(ev: CustomEvent<NoteEvent>) {
      const { note, velocity, portamento } = ev.detail;
      rack.noteOn(note, velocity);
      visualizer?.setPeriod(Utils.indexToFrequency(note));
      if (portamento) {
        rack.portamentoOn(portamento.on);
        rack.portamentoTime(portamento.time);
      }
    }
    function off(ev: CustomEvent<NoteEvent>) {
      const note = ev.detail.note;
      rack.noteOff(note);
    }
    window.addEventListener("noteon", on as EventListener);
    window.addEventListener("noteoff", off as EventListener);
    return () => {
      window.removeEventListener("noteon", on as EventListener);
      window.removeEventListener("noteoff", off as EventListener);
    };
  });

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
        savePreset={savePreset}
        loadPreset={loadPreset}
        onChange={rack.setFilterParams}
      />
      <Amplifier
        savePreset={savePreset}
        loadPreset={loadPreset}
        onMount={setVisualizer}
        onChange={rack.setAmplifierParams}
      />
    </div>
  );
}
