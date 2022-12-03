export interface NoteEvent {
  note: number;
  velocity: number;
  offset: number;
  portamento: {
    on: boolean;
    time: number;
  };
}
export class NoteEventHandler extends EventTarget {
  public static readonly kbdKeys: string[] = [
    "Q",
    "2",
    "W",
    "3",
    "E",
    "R",
    "5",
    "T",
    "6",
    "Y",
    "7",
    "U",
    "I",
    "9",
    "O",
    "0",
    "P",
    "Z",
    "S",
    "X",
    "D",
    "C",
    "F",
    "V",
    "B",
    "H",
    "N",
    "J",
    "M",
    ",",
  ];
  private noteOnEvent = new CustomEvent<NoteEvent>("noteon", {
    detail: {
      note: 0,
      offset: 0,
      velocity: 127,
      portamento: { on: false, time: 0 },
    },
  });
  private noteOffEvent = new CustomEvent<NoteEvent>("noteoff", {
    detail: {
      note: 0,
      offset: 0,
      velocity: 127,
      portamento: { on: false, time: 0 },
    },
  });
  private prev = 0;
  private _noteOffset = { base: 36, val: 0 };
  private _portamento = { on: false, time: 0 };
  constructor() {
    super();
    window.addEventListener("keydown", this.on);
    window.addEventListener("keyup", this.off);
  }

  public dispose() {
    window.removeEventListener("keydown", this.on);
    window.removeEventListener("keyup", this.off);
  }

  public dispatchNoteEvent(
    type: "noteon" | "noteoff",
    values: {
      note: number;
      velocity?: number;
      portamento?: { on: boolean; time: number };
    },
    offset?: boolean
  ) {
    const { base, val } = this._noteOffset;
    if (offset) {
      values.note += base + val;
    }
    console.log(this._portamento);
    if (type === "noteon") {
      this.noteOnEvent.detail.note = values.note;
      this.noteOnEvent.detail.offset = base + val;
      this.noteOnEvent.detail.velocity = values.velocity ?? 0;
      this.noteOnEvent.detail.portamento =
        values.portamento ?? this._portamento;
      window.dispatchEvent(this.noteOnEvent);
    } else {
      this.noteOffEvent.detail.note = values.note;
      this.noteOffEvent.detail.offset = base + val;
      this.noteOffEvent.detail.velocity = values.velocity ?? 0;
      this.noteOnEvent.detail.portamento =
        values.portamento ?? this._portamento;
      window.dispatchEvent(this.noteOffEvent);
    }
  }
  public setNoteOffset(value: number) {
    this._noteOffset.val = value;
  }
  public setPortamento(portamento: { on: boolean; time: number }) {
    this._portamento = portamento;
  }
  private on = (ev: KeyboardEvent) => {
    if (ev.altKey) ev.preventDefault();
    const note = this.getIndex(ev.key);
    const velocity = ev.altKey ? 63 : 127;
    if (note === this.prev) return;

    this.dispatchNoteEvent("noteon", { note, velocity }, true);
    this.prev = note;
  };
  private off = (ev: KeyboardEvent) => {
    const note = this.getIndex(ev.key);
    this.dispatchNoteEvent("noteoff", { note, velocity: 0 }, true);
    this.prev = -1;
  };
  private getIndex(key: string): number {
    return NoteEventHandler.kbdKeys.indexOf(key.toUpperCase());
  }
}
