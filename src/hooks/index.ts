import { PRESET_MANAGER } from "controller";
import { PresetParamContainer } from "models/Data";
import { useEffect } from "react";

export function useSaveToPreset<T extends PresetParamContainer>(
  params: T,
  savePreset: boolean | undefined
): void {
  useEffect(() => {
    if (savePreset) {
      PRESET_MANAGER.saveToCurrentPreset(params);
    }
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
