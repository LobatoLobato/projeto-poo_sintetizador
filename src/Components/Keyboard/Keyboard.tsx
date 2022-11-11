import React, { useEffect, useState } from "react";
import { createGlobalstate, useGlobalState } from "state-pool";
import { KeyboardHandler } from "models";
import "./keyboard.scss";

const kbdKeys: string[] = KeyboardHandler.kbdKeys;

const globalNoteOn = createGlobalstate({ note: -1, active: false });
const globalNoteOff = createGlobalstate({ note: -1, active: false });

const pressedKey = createGlobalstate("");
KeyboardHandler.addKeyDownListener((ev, note) => {
  const currentKey = ev.key.toUpperCase();
  if (pressedKey.value === currentKey) return;
  if (note >= 0) {
    globalNoteOff.setValue({ note, active: false });
    globalNoteOn.setValue({ note, active: true });
  }
  pressedKey.setValue(currentKey);
});
KeyboardHandler.addKeyUpListener((ev, note) => {
  const currentKey = ev.key.toUpperCase();
  if (pressedKey.value !== currentKey) return;
  globalNoteOff.setValue({ note, active: true });
  globalNoteOn.setValue({ note, active: false });
  pressedKey.setValue("");
});

interface KeyboardProps {
  onNoteOn: (state: { note: number; active: boolean }) => void;
  onNoteOff: (state: { note: number; active: boolean }) => void;
}
export function Keyboard(props: KeyboardProps) {
  const baseOctave = 36;
  const [octave, setOctave] = useState(0);
  const [transpose, setTranspose] = useState(0);
  const [noteOn, setNoteOn] = useGlobalState<{ note: number; active: boolean }>(
    globalNoteOn
  );
  const [noteOff, setNoteOff] = useGlobalState<{
    note: number;
    active: boolean;
  }>(globalNoteOff);
  const [isActive, setIsActive] = useState(false);
  function handleNoteOn(note: number) {
    setIsActive(true);
    setNoteOn({ note, active: true });
    setNoteOff({ note, active: false });
  }
  function handleNoteOff(note: number) {
    setIsActive(false);
    setNoteOff({ note, active: true });
    setNoteOn({ note, active: false });
  }
  function handleMouseLeave() {
    if (isActive) {
      handleNoteOff(-1);
    }
  }
  const { onNoteOn, onNoteOff } = props;
  useEffect(() => {
    const note = noteOn.note + baseOctave + 12 * octave + transpose;
    onNoteOn({ ...noteOn, note });
  }, [noteOn, onNoteOn, octave, transpose]);
  useEffect(() => {
    const note = noteOff.note + baseOctave + 12 * octave + transpose;
    onNoteOff({ ...noteOff, note });
  }, [noteOff, onNoteOff, octave, transpose]);
  return (
    <div className="keyboard">
      <div className="top">
        <div className="pitch-selector">
          <div className="top-bar">
            <p className="pl-1">Octave</p>
            <p className="octave-value">{octave}</p>
          </div>
          <div className="flex w-full gap-2">
            <button
              onClick={() => setOctave(octave > -5 ? octave - 1 : octave)}
            >
              -
            </button>
            <button onClick={() => setOctave(octave < 5 ? octave + 1 : octave)}>
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
            <button
              onClick={() =>
                setTranspose(transpose > -12 ? transpose - 1 : transpose)
              }
            >
              -
            </button>
            <button
              onClick={() =>
                setTranspose(transpose < 12 ? transpose + 1 : transpose)
              }
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-red-800"></div>
      <div
        className="keys flex w-full items-end justify-end"
        onMouseLeave={handleMouseLeave}
      >
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
          className="white h-52 w-[4.8%]"
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
  return (
    <div className="octave-container">
      <div className="keys-container">
        <div className="left-key-area">
          {[1, 3].map((val) => (
            <Key
              className="black w-2/12"
              key={`bkey-${val}`}
              note={props.startNote + val}
              text={kbdKeys[props.startNote + val]}
              onNoteOn={props.onNoteOn}
              onNoteOff={props.onNoteOff}
            />
          ))}
        </div>
        <div className="right-key-area">
          {[6, 8, 10].map((val) => (
            <Key
              className="black w-[11.5%]"
              key={`bkey-${val}`}
              note={props.startNote + val}
              text={kbdKeys[props.startNote + val]}
              onNoteOn={props.onNoteOn}
              onNoteOff={props.onNoteOff}
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
              note={props.startNote + val}
              text={kbdKeys[props.startNote + val]}
              onNoteOn={props.onNoteOn}
              onNoteOff={props.onNoteOff}
            />
          ))}
        </div>
        <div className="right-key-area">
          {[5, 7, 9, 11].map((val) => (
            <Key
              className="white w-1/4"
              key={`wkey-${val}`}
              note={props.startNote + val}
              text={kbdKeys[props.startNote + val]}
              onNoteOn={props.onNoteOn}
              onNoteOff={props.onNoteOff}
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
  const [currentPressedKey] = useGlobalState(pressedKey);
  function handleMouseDown(ev: React.MouseEvent) {
    ev.preventDefault();
    if (ev.buttons === 1) props.onNoteOn(props.note);
  }
  function handleMouseUp(ev: React.MouseEvent) {
    props.onNoteOff(props.note);
  }
  function handleMouseEnter(ev: React.MouseEvent) {
    if (ev.buttons === 1) props.onNoteOn(props.note);
  }
  return (
    <div
      className={`key ${props.className} ${
        currentPressedKey === props.text ? "pressed" : ""
      }`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
    >
      {props.text}
    </div>
  );
}
