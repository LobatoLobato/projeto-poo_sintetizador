import { useState } from "react";
import "./App.css";
import { Keyboard, Rack } from "@components";

function App() {
  const [initCTX, setInitCTX] = useState(false);
  const [noteOn, setNoteOn] = useState({ note: 0, active: false });
  const [noteOff, setNoteOff] = useState({ note: 0, active: true });
  return (
    <div className="App">
      {initCTX ? (
        <div>
          <Rack noteOn={noteOn} noteOff={noteOff} />
          <Keyboard onNoteOn={setNoteOn} onNoteOff={setNoteOff} />
        </div>
      ) : (
        <button onClick={() => setInitCTX(true)}>Init Context</button>
      )}
    </div>
  );
}

export default App;
