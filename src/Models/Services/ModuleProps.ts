export interface ModuleProps<K> {
  savePreset?: boolean;
  loadPreset?: boolean;
  onChange?: (params: K) => void;
}
