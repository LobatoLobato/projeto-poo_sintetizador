import { NoteEventHandler } from "models";

export class MIDIEventHandler {
  private MIDIAccess: WebMidi.MIDIAccess | null = null;
  private MIDIInputs: WebMidi.MIDIInputMap | null = null;
  private noteEventHandler: NoteEventHandler = new NoteEventHandler();
  private sustainOn: boolean = false;
  private sustainedNotes: Map<number, number> = new Map();
  private ready: Promise<void>;

  constructor() {
    this.ready = navigator
      .requestMIDIAccess({ sysex: false })
      .then((MIDIAccess) => {
        this.MIDIAccess = MIDIAccess;
        this.MIDIAccess.onstatechange = this.handleMidiAccessChange;
        this.handleMidiAccessChange();
      });
  }
  public async dispose() {
    await this.ready;
    for (const input of this.MIDIInputs?.values() ?? []) {
      input.removeEventListener(
        "midimessage",
        this.handleMidiMessage as EventListener
      );
    }
    this.MIDIAccess?.removeEventListener(
      "statechange",
      this.handleMidiAccessChange
    );
  }

  private handleMidiAccessChange = () => {
    this.MIDIInputs = this.MIDIAccess?.inputs ?? null;
    for (const input of this.MIDIInputs?.values() ?? []) {
      input.addEventListener("midimessage", this.handleMidiMessage);
    }
  };

  private handleMidiMessage = ({ data }: WebMidi.MIDIMessageEvent) => {
    const [command, value, mod] = data;
    const noteValues = { note: value, velocity: mod };

    switch (command) {
      case 144:
        if (this.sustainOn) this.sustainedNotes.delete(noteValues.note);
        this.noteEventHandler.dispatchNoteEvent("noteon", noteValues);
        break;
      case 128:
        if (!this.sustainOn) {
          this.noteEventHandler.dispatchNoteEvent("noteoff", noteValues);
        } else {
          this.sustainedNotes.set(noteValues.note, noteValues.note);
        }
        break;
      case 176:
        this.sustainOn = mod > 64;
        if (!this.sustainOn) {
          for (const note of this.sustainedNotes.values()) {
            this.noteEventHandler.dispatchNoteEvent("noteoff", {
              note,
              velocity: 0,
            });
          }
          this.sustainedNotes.clear();
        }
        break;
    }
  };
}
