import React, { useEffect, useRef, useState } from "react";
import "./NavBar.scss";
import { PRESET_MANAGER, FILE_HANDLER } from "controller";

const SAVE_PRESET = new CustomEvent("SAVE_PRESET");
const LOAD_PRESET = new CustomEvent("LOAD_PRESET");

export function NavBar() {
  return <nav className="nav-bar">{<PresetMenu />}</nav>;
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
  const [newPresetErrMsg, setNewPresetErrMsg] = useState("");
  async function exportPresets() {
    const presetMap = PRESET_MANAGER.getPresetMapAsJSON();
    FILE_HANDLER.exportJSON(presetMap, "preset");
  }
  async function importPresets(ev: React.FormEvent<HTMLInputElement>) {
    const file = ev.currentTarget.files?.item(0);
    if (!file) return;
    FILE_HANDLER.importPresets(file)
      .then((map) => PRESET_MANAGER.setPresetMap(map))
      .catch(console.log);
  }

  function savePreset(presetName: string, overwrite?: boolean) {
    try {
      PRESET_MANAGER.savePreset(presetName, overwrite);
    } catch (e) {
      setShowOverwritePrompt([true, presetName]);
    }
    PRESET_MANAGER.setPreset(presetName);
    window.dispatchEvent(SAVE_PRESET);
  }
  function loadPreset(presetName: string) {
    PRESET_MANAGER.setPreset(presetName);
    window.dispatchEvent(LOAD_PRESET);
    setPresetName(presetName);
  }
  function deletePreset(presetName: string) {
    PRESET_MANAGER.deletePreset(presetName);
    setPresetName("Default");
  }
  function updatePresetNames() {
    setPresetNames(PRESET_MANAGER.getPresetNames());
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
  useEffect(() => {
    window.dispatchEvent(LOAD_PRESET);
  }, []);

  return (
    <div className="menu" onMouseEnter={updatePresetNames}>
      <PopUp
        showInput
        message="Enter the preset name (no spaces or hifens)"
        errormsg={newPresetErrMsg}
        onInput={setNewPresetName}
        onAccept={() => {
          if (newPresetName.toLowerCase() !== "default") {
            savePreset(newPresetName);
            setShowNewPresetPrompt(false);
            setNewPresetErrMsg("");
          } else {
            setNewPresetErrMsg('Cannot save to "Default" preset. Try again');
          }
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
              Save
              <ul onMouseEnter={updatePresetNames}>
                <li
                  className="link"
                  onClick={() => setShowNewPresetPrompt(true)}
                >
                  <p>New Preset</p>
                </li>
                {presetName !== "Default" && (
                  <li className="link" onClick={() => savePreset(presetName)}>
                    <p>{presetName}</p>
                  </li>
                )}
                {presetNames.map((name) => {
                  return (
                    name !== "Default" && (
                      <Li
                        key={`sa-${name}`}
                        name={name}
                        onClick={() => savePreset(name)}
                      />
                    )
                  );
                })}
              </ul>
            </li>
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
              Delete
              <ul onMouseEnter={updatePresetNames}>
                {presetName !== "Default" && (
                  <li className="link" onClick={() => deletePreset(presetName)}>
                    <p>{presetName}</p>
                  </li>
                )}
                {presetNames.map((name) => {
                  return (
                    name !== "Default" && (
                      <Li
                        key={`sa-${name}`}
                        name={name}
                        onClick={() => deletePreset(name)}
                      />
                    )
                  );
                })}
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
  errormsg?: string;
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
        {props.errormsg}
        <label>{props.message}</label>
        <input
          ref={input}
          style={{ display: props.showInput ? "flex" : "none" }}
          className="mx-2 text-black"
          type="text"
          onInput={(ev) => onInput?.(ev.currentTarget.value)}
        />
        <div className="flex w-full justify-evenly">
          <button
            className="w-1/4 rounded-md bg-zinc-500"
            onClick={() => {
              if (onAccept) onAccept?.();
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
