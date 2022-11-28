import { PRESET_MANAGER } from "controller";
import { NoteEvent } from "models";
import { PresetParamContainer } from "models/data";
import { useEffect, useState } from "react";

export function useSaveState() {
  const [save, setSave] = useState(false);
  useEffect(() => {
    const save = () => {
      setSave(true);
      setTimeout(() => setSave(false), 10);
    };
    window.addEventListener("SAVE_PRESET", save);
    return () => window.removeEventListener("SAVE_PRESET", save);
  }, []);
  return save;
}
export function useLoadState() {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const load = () => {
      setLoad(true);
      setTimeout(() => setLoad(false), 10);
    };
    window.addEventListener("LOAD_PRESET", load);
    return () => window.removeEventListener("LOAD_PRESET", load);
  }, []);
  return load;
}
export function useSaveToPreset<T extends PresetParamContainer>(
  params: T,
  savePreset: boolean | undefined
): void {
  useEffect(() => {
    if (savePreset) PRESET_MANAGER.saveToCurrentPreset(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savePreset]);
}
export function useLoadFromPreset<T extends PresetParamContainer>(
  paramState: [T, React.Dispatch<React.SetStateAction<T>>],
  loadPreset: boolean | undefined
): void {
  const [params, setParams] = paramState;
  useEffect(() => {
    if (loadPreset) {
      const p = PRESET_MANAGER.loadFromCurrentPreset(params.discriminator);
      setParams(p as T);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPreset]);
}
export function useOnParamsChange<T extends PresetParamContainer>(
  params: T,
  onChange: ((params: T) => void) | undefined
) {
  useEffect(() => {
    onChange?.(params);
  }, [params, onChange]);
}

type paramSetter<T extends PresetParamContainer> = <K extends keyof T>(
  param: K,
  value: T[K]
) => void;

type paramLoader<T extends PresetParamContainer> = <K extends keyof T>(
  param: K
) => T[K] | undefined;

export function useParamUpdater<T extends PresetParamContainer>(
  state: [T, React.Dispatch<React.SetStateAction<T>>],
  trigger: boolean | undefined
): [paramSetter<T>, paramLoader<T>] {
  function set<K extends keyof T>(param: K, value: T[K]) {
    if (!trigger) state[1]((p) => ({ ...p, [param]: value }));
  }
  function load<K extends keyof T>(param: K): T[K] | undefined {
    const st = state[0];
    return trigger ? st[param] : undefined;
  }
  return [set, load];
}

export function useNoteEvent(
  on: (ev: CustomEvent<NoteEvent>) => void,
  off: (ev: CustomEvent<NoteEvent>) => void
) {
  useEffect(() => {
    window.addEventListener("noteon", on as EventListener);
    window.addEventListener("noteoff", off as EventListener);
    return () => {
      window.removeEventListener("noteon", on as EventListener);
      window.removeEventListener("noteoff", off as EventListener);
    };
  });
}
