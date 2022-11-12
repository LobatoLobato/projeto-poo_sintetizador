import React, { useEffect, useState } from "react";
import { createGlobalstate, useGlobalState } from "state-pool";
import { KeyboardHandler } from "models";
import "./keyboard.scss";
import { Slider } from "components/Slider";
import { Utils } from "common";

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
  onPortamentoChange?: (state: { time: number; on: boolean }) => void;
  onLegatoChange?: (state: boolean) => void;
}
export function Keyboard(props: KeyboardProps) {
  const baseOctave = 36;
  const [octave, setOctave] = useState(0);
  const [transpose, setTranspose] = useState(0);
  const [portamentoTime, setPortamentoTime] = useState(0);
  const [portamentoOn, setPortamentoOn] = useState(false);
  const [legatoOn, setLegatoOn] = useState(false);
  const [noteOn, setNoteOn] = useGlobalState<{ note: number; active: boolean }>(
    globalNoteOn
  );
  const [noteOff, setNoteOff] = useGlobalState<{
    note: number;
    active: boolean;
  }>(globalNoteOff);
  const [isActive, setIsActive] = useState(false);
  function handlePortamentoChange(value: number | boolean) {
    if (!props.onPortamentoChange) return;
    const time =
      typeof value === "number" ? Utils.linToExp2(value, 0, 2) : portamentoTime;
    const on = typeof value === "boolean" ? value : portamentoOn;
    props.onPortamentoChange({ time, on });
    setPortamentoTime(time);
    setPortamentoOn(on);
  }
  function handleLegatoChange() {
    setLegatoOn(!legatoOn);
    if (props.onLegatoChange) props.onLegatoChange(!legatoOn);
  }
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
        <div className="portamento-options">
          <div className="top-bar">
            <p className="pl-1">Portamento</p>
            <p className="octave-value">{portamentoTime.toFixed(2)}</p>
          </div>
          <div className="flex h-full w-full items-center justify-center gap-2">
            <button
              className={`octave-value h-7 ${portamentoOn ? "on" : ""}`}
              onClick={() => handlePortamentoChange(!portamentoOn)}
            >
              <p>On</p>/<p>Off</p>
            </button>
            <Slider
              className="w-full"
              inputClassName="w-full"
              max={2}
              step={0.01}
              defaultValue={0}
              onInput={handlePortamentoChange}
            />
          </div>
        </div>
        <button
          className="flex h-7 w-1/2 items-center justify-center rounded-md border-2 border-black bg-zinc-600 text-center shadow-sm shadow-black hover:bg-zinc-500"
          style={{ background: legatoOn ? "red" : "yellow" }}
          onClick={handleLegatoChange}
        >
          Legato
        </button>
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
