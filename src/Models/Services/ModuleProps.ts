export interface ModuleProps<K> {
  noteOn?: { note: number; active: boolean };
  noteOff?: { note: number; active: boolean };
  savePreset?: boolean;
  loadPreset?: boolean;
  onChange?: (params: K) => void;
}
