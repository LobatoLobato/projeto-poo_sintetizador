import { Arquivo } from "controller/Arquivo";
import React, { useRef, useState } from "react";
import "./NavBar.scss";
import { createGlobalstate } from "state-pool";

export const SAVE_PRESET = createGlobalstate(false);
export const LOAD_PRESET = createGlobalstate(false);

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <PresetMenu />
    </nav>
  );
}

function PresetMenu() {
  const menu = useRef<HTMLUListElement>(null);
  const [presetNames, setPresetNames] = useState<string[]>([]);
  const [presetName, setPresetName] = useState("Default");
  const [newPresetName, setNewPresetName] = useState("");
  const [showOverwritePrompt, setShowOverwritePrompt] = useState<
    [boolean, string]
  >([false, ""]);
  const [showNewPresetPrompt, setShowNewPresetPrompt] = useState(false);

  function exportPresets() {
    Arquivo.exportPresets();
  }
  function importPresets(ev: React.FormEvent<HTMLInputElement>) {
    const file = ev.currentTarget.files?.item(0);
    if (!file) return;
    Arquivo.importPresets(file).catch(console.log);
  }
  function savePreset(presetName: string, overwrite?: boolean) {
    console.log(presetName);
    try {
      Arquivo.savePreset(presetName, overwrite);
    } catch (e) {
      setShowOverwritePrompt([true, presetName]);
    }
    Arquivo.setPreset(presetName);

    SAVE_PRESET.setValue(true);
    setTimeout(() => {
      SAVE_PRESET.setValue(false);
    }, 500);
  }
  function loadPreset(presetName: string) {
    Arquivo.setPreset(presetName);
    console.log(presetName);
    LOAD_PRESET.setValue(true);
    setTimeout(() => {
      LOAD_PRESET.setValue(false);
    }, 500);
    setPresetName(presetName);
  }

  function updatePresetNames() {
    setPresetNames(Arquivo.getPresetNames());
  }

  const toggleVisibility = () => {
    if (!menu.current) return;
    const m = menu.current;
    m.style.display = "none";
    setTimeout(() => {
      m.style.display = "";
    }, 20);
  };

  function Li(props: { name: string; onClick: (name: string) => void }) {
    if (props.name === presetName) return <></>;
    const { name, onClick } = props;
    const key = name + Math.random();
    return (
      <li key={`li-${key}`} className="link" onClick={() => onClick(name)}>
        <p key={`p-${key}`}>{name}</p>
      </li>
    );
  }

  return (
    <div className="menu" onMouseEnter={updatePresetNames}>
      <PopUp
        showInput
        message="Enter the preset name (no spaces or hifens)"
        onInput={setNewPresetName}
        onAccept={() => {
          savePreset(newPresetName);
          setShowNewPresetPrompt(false);
        }}
        onReject={() => setShowNewPresetPrompt(false)}
        show={showNewPresetPrompt}
      />
      <PopUp
        message={`Overwrite ${showOverwritePrompt[1]}?`}
        onAccept={() => {
          savePreset(showOverwritePrompt[1], true);
          setShowOverwritePrompt([false, ""]);
        }}
        onReject={() => setShowOverwritePrompt([false, ""])}
        show={showOverwritePrompt[0]}
      />
      <ul>
        <li>
          Presets
          <ul ref={menu} onClick={toggleVisibility}>
            <li>
              Load
              <ul onMouseEnter={updatePresetNames}>
                <li className="link" onClick={() => loadPreset(presetName)}>
                  <p>{presetName}</p>
                </li>
                {presetNames.map((name) => (
                  <Li key={`lo-${name}`} name={name} onClick={loadPreset} />
                ))}
              </ul>
            </li>
            <li>
              Save
              <ul onMouseEnter={updatePresetNames}>
                <li
                  className="link"
                  onClick={() => setShowNewPresetPrompt(true)}
                >
                  <p>New Preset</p>
                </li>
                <li className="link" onClick={() => savePreset(presetName)}>
                  <p>{presetName}</p>
                </li>
                {presetNames.map((name) => (
                  <Li
                    key={`sa-${name}`}
                    name={name}
                    onClick={() => savePreset(name)}
                  />
                ))}
              </ul>
            </li>
            <li className="link">
              <label className="h-full w-full">
                <p>Import</p>
                <input
                  className="hidden"
                  type="file"
                  accept=".json"
                  onInput={importPresets}
                />
              </label>
            </li>
            <li className="link" onClick={exportPresets}>
              <p>Export</p>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
interface PopUpProps {
  onAccept?: () => void;
  onReject?: () => void;
  onInput?: (value: string) => void;
  show: boolean;
  showInput?: boolean;
  message?: string;
  children?: JSX.Element;
}
function PopUp(props: PopUpProps) {
  const input = useRef<HTMLInputElement>(null);
  const { onAccept, onReject, onInput } = props;
  return (
    <div
      className="fixed z-[999] h-full w-full items-start justify-center bg-black bg-opacity-20 text-white backdrop-blur-sm"
      style={{ display: props.show ? "flex" : "none" }}
    >
      <div className="flex h-fit w-1/4 flex-col gap-4 rounded-md bg-gray-800 pb-2 pt-1">
        {props.children}
        <label>{props.message}</label>
        <input
          ref={input}
          style={{ display: props.showInput ? "flex" : "none" }}
          className="text-black"
          type="text"
          onInput={(ev) => {
            if (onInput) onInput(ev.currentTarget.value);
          }}
        />
        <div className="flex w-full justify-evenly">
          <button
            className="w-1/4 rounded-md bg-zinc-500"
            onClick={() => {
              if (onAccept) onAccept();
              if (input.current) input.current.value = "";
            }}
          >
            Y
          </button>
          <button
            className="w-1/4 rounded-md bg-zinc-500"
            onClick={() => {
              if (onReject) onReject();
              if (input.current) input.current.value = "";
            }}
          >
            N
          </button>
        </div>
      </div>
    </div>
  );
}
