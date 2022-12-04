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
  private _noteOffset = { base: 36, val: 0 };
  private _portamento = { on: false, time: 0 };
  private _pressedNotes: number[] = [];

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

    if (type === "noteon") {
      this.noteOnEvent.detail.note = values.note;
      this.noteOnEvent.detail.offset = base + val;
      this.noteOnEvent.detail.velocity = values.velocity ?? 0;
      this.noteOnEvent.detail.portamento =
        values.portamento ?? this._portamento;
      this._pressedNotes.push(offset ? values.note - base - val : values.note);
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
    for (let i = 0; i < 128; i++) {
      this.dispatchNoteEvent("noteoff", { note: i, velocity: 0 });
    }
  }
}
