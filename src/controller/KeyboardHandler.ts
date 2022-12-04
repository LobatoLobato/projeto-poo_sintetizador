import { NoteEventHandler } from "./NoteEventHandler";

export class KeyboardHandler {
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
  private prev = 0;
  private noteEventHandler = new NoteEventHandler();
  constructor() {
    window.addEventListener("keydown", this.on);
    window.addEventListener("keyup", this.off);
  }

  public dispose() {
    window.removeEventListener("keydown", this.on);
    window.removeEventListener("keyup", this.off);
  }

  public setNoteOffset(value: number) {
    this.noteEventHandler.setNoteOffset(value);
    window.removeEventListener("keydown", this.on);
    window.removeEventListener("keyup", this.off);
    window.addEventListener("keydown", this.on);
    window.addEventListener("keyup", this.off);
  }

  private on = (ev: KeyboardEvent) => {
    if (ev.altKey) ev.preventDefault();
    const note = this.getIndex(ev.key);
    const velocity = ev.altKey ? 63 : 127;
    if (note === this.prev) return;

    this.noteEventHandler.dispatchNoteEvent("noteon", { note, velocity }, true);
    this.prev = note;
  };
  private off = (ev: KeyboardEvent) => {
    const note = this.getIndex(ev.key);
    this.noteEventHandler.dispatchNoteEvent(
      "noteoff",
      { note, velocity: 0 },
      true
    );
    this.prev = -1;
  };
  private getIndex(key: string): number {
    return KeyboardHandler.kbdKeys.indexOf(key.toUpperCase());
  }
}
