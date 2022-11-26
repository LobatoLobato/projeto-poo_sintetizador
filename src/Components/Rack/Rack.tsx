import { useEffect, useMemo, useState } from "react";
import "./Rack.scss";
import { NoteEvent, VisualizerModule } from "models";
import { Amplifier, Oscillator, LFO, Filter } from "components";
import { RackController } from "controller";
import { Utils } from "common";

export function Rack() {
  const [visualizer, setVisualizer] = useState<VisualizerModule>();
  const [savePreset, setSavePreset] = useState(false);
  const [loadPreset, setLoadPreset] = useState(false);
  const rack = useMemo(() => new RackController(), []);

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

  useEffect(() => {
    const save = () => {
      setSavePreset(true);
      setTimeout(() => setSavePreset(false), 10);
    };
    const load = () => {
      setLoadPreset(true);
      setTimeout(() => setLoadPreset(false), 10);
    };
    window.addEventListener("SAVE_PRESET", save);
    window.addEventListener("LOAD_PRESET", load);
    return () => {
      window.removeEventListener("SAVE_PRESET", save);
      window.removeEventListener("LOAD_PRESET", load);
    };
  }, []);
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
