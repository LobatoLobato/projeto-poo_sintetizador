import { useEffect, useState } from "react";
import "./App.css";
import { Keyboard, Rack, NavBar } from "components";

function App() {
  const [initCTX, setInitCTX] = useState(false);
  const [noteOn, setNoteOn] = useState({ note: 0, active: false });
  const [noteOff, setNoteOff] = useState({ note: 0, active: true });
  const [portamento, setPortamento] = useState({ time: 0, on: false });
  const [legatoOn, setLegatoOn] = useState(false);

  useEffect(() => {
    const rangeInputs = document.querySelectorAll<HTMLInputElement>(
      'input[type="range"]'
    );
    function setInputStyle(target: HTMLInputElement) {
      const { value, min, max, style } = target;
      const size = ((+value - +min) * 100) / (+max - +min);
      style.backgroundSize = `${size}% 100%`;
    }
    rangeInputs.forEach((input) => {
      input.oninput = () => setInputStyle(input);
      setInputStyle(input);
    });
  }, [initCTX]);
  return (
    <div className="App">
      {initCTX ? (
        <>
          <NavBar />
          <Rack
            noteOn={noteOn}
            noteOff={noteOff}
            portamento={portamento}
            legatoOn={legatoOn}
          />
          <Keyboard
            onNoteOn={setNoteOn}
            onNoteOff={setNoteOff}
            onPortamentoChange={setPortamento}
            onLegatoChange={setLegatoOn}
          />
        </>
      ) : (
        <button className="initctx-btn" onClick={() => setInitCTX(true)}>
          Entrar
        </button>
      )}
    </div>
  );
}

export default App;
