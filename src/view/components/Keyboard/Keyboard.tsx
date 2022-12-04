import React, { useEffect, useMemo, useState } from "react";
import { NoteEvent, NoteEventHandler } from "models";
import "./keyboard.scss";
import { MIDIEventHandler } from "controller/MIDIHandler";
import { KeyboardHandler } from "controller/KeyboardHandler";

export function Keyboard() {
  const MIDIHandler = useMemo(() => new MIDIEventHandler(), []);
  const NoteHandler = useMemo(() => new NoteEventHandler(), []);
  const KbdHandler = useMemo(() => new KeyboardHandler(), []);
  const [octave, setOctave] = useState(0);
  const [transpose, setTranspose] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function handleMouseLeave() {
    if (isActive) handleNoteOff(-1);
  }

  function handleNoteOn(note: number) {
    setIsActive(true);
    const evOptions = {
      note: note + 12 * octave + transpose,
      velocity: 127,
    };
    NoteHandler.dispatchNoteEvent("noteon", evOptions, true);
  }
  function handleNoteOff(note: number) {
    setIsActive(false);
    const evOptions = {
      note: note + 12 * octave + transpose,
      velocity: 0,
    };
    NoteHandler.dispatchNoteEvent("noteoff", evOptions, true);
  }

  useEffect(() => {
    NoteHandler.setNoteOffset(12 * octave + transpose);
    KbdHandler.setNoteOffset(12 * octave + transpose);
  }, [octave, transpose, NoteHandler, KbdHandler]);

  useEffect(() => {
    return () => {
      KbdHandler.dispose();
      MIDIHandler.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="keyboard-container">
      <div className="top">
        <div className="pitch-selector">
          <div className="top-bar">
            <p className="pl-1">Octave</p>
            <p className="octave-value">{octave}</p>
          </div>
          <div className="flex w-full gap-2">
            <button onClick={() => setOctave((o) => (o > -5 ? o - 1 : o))}>
              -
            </button>
            <button onClick={() => setOctave((o) => (o < 5 ? o + 1 : o))}>
              +
            </button>
          </div>
        </div>
        <div className="pitch-selector">
          <div className="top-bar">
            <p className="pl-1">Transpose</p>
            <p className="octave-value">{transpose}</p>
          </div>
          <div className="flex w-full gap-2">
            <button onClick={() => setTranspose((t) => (t > -12 ? t - 1 : t))}>
              -
            </button>
            <button onClick={() => setTranspose((t) => (t < 12 ? t + 1 : t))}>
              +
            </button>
          </div>
        </div>
      </div>
      <div className="separator"></div>
      <div className="keyboard" onMouseLeave={handleMouseLeave}>
        <Octave
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
          startNote={0}
        />
        <Octave
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
          startNote={12}
        />
        <Octave
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
          startNote={24}
        />
        <Key
          className="white h-64 w-[4.8%]"
          note={36}
          onNoteOn={handleNoteOn}
          onNoteOff={handleNoteOff}
        />
      </div>
    </div>
  );
}

interface OctaveProps {
  startNote: number;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}
function Octave(props: OctaveProps) {
  const kbdKeys: string[] = useMemo(() => KeyboardHandler.kbdKeys, []);
  const { startNote, onNoteOn, onNoteOff } = props;
  return (
    <div className="octave-container">
      <div className="keys-container">
        <div className="left-key-area">
          {[1, 3].map((val) => (
            <Key
              className="black w-2/12"
              key={`bkey-${val}`}
              note={startNote + val}
              text={kbdKeys[startNote + val]}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
            />
          ))}
        </div>
        <div className="right-key-area">
          {[6, 8, 10].map((val) => (
            <Key
              className="black w-[11.5%]"
              key={`bkey-${val}`}
              note={startNote + val}
              text={kbdKeys[startNote + val]}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
            />
          ))}
        </div>
      </div>
      <div className="keys-container">
        <div className="left-key-area">
          {[0, 2, 4].map((val) => (
            <Key
              className="white w-1/3"
              key={`wkey-${val}`}
              note={startNote + val}
              text={kbdKeys[startNote + val]}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
            />
          ))}
        </div>
        <div className="right-key-area">
          {[5, 7, 9, 11].map((val) => (
            <Key
              className="white w-1/4"
              key={`wkey-${val}`}
              note={startNote + val}
              text={kbdKeys[startNote + val]}
              onNoteOn={onNoteOn}
              onNoteOff={onNoteOff}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface KeyProps {
  className?: string;
  note: number;
  text?: string;
  onNoteOn: (note: number) => void;
  onNoteOff: (note: number) => void;
}
function Key(props: KeyProps) {
  const [pressedKey, setPressedKey] = useState(-1);
  const { onNoteOff, onNoteOn, note, text } = props;
  const handleMouseUp = () => onNoteOff(note);
  const handleMouseLeave = () => onNoteOff(note);
  function handleMouseDown(ev: React.MouseEvent) {
    ev.preventDefault();
    if (ev.buttons === 1) onNoteOn(note);
  }
  function handleMouseEnter({ buttons }: React.MouseEvent) {
    if (buttons === 1) onNoteOn(note);
  }

  useEffect(() => {
    function on(ev: CustomEvent<NoteEvent>) {
      const note = ev.detail.note - ev.detail.offset;
      if (props.note === note) setPressedKey(note);
    }
    function off(ev: CustomEvent<NoteEvent>) {
      const note = ev.detail.note - ev.detail.offset;
      if (props.note === note) setPressedKey(-1);
    }
    window.addEventListener("noteon", on as EventListener);
    window.addEventListener("noteoff", off as EventListener);
    return () => {
      window.removeEventListener("noteon", on as EventListener);
      window.removeEventListener("noteoff", off as EventListener);
    };
  });

  const mod = pressedKey === note ? "pressed" : "";
  return (
    <div
      className={`key ${props.className} ${mod}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </div>
  );
}
