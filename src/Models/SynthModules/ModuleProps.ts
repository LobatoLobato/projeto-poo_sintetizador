export interface ModuleProps<T> {
  connectTo?: (AudioNode | AudioParam | undefined)[] | AudioNode | AudioParam;
  onMount?: (module: T) => void;
  noteOn?: { note: number; active: boolean };
  noteOff?: { note: number; active: boolean };
}
