import { useEffect, useState } from "react";
import "./App.css";
import { Keyboard, Rack } from "components";

function App() {
  const [initCTX, setInitCTX] = useState(false);
  const [noteOn, setNoteOn] = useState({ note: 0, active: false });
  const [noteOff, setNoteOff] = useState({ note: 0, active: true });
  useEffect(() => {
    const rangeInputs = document.querySelectorAll(
      'input[type="range"]'
    ) as NodeListOf<HTMLInputElement>;
    const numberInput = document.querySelector('input[type="number"]');

    function handleInputChange(e: any) {
      let target = e.target;
      if (e.target.type !== "range") {
        target = document.getElementById("range");
      }
      const min = target.min;
      const max = target.max;
      const val = target.value;

      target.style.backgroundSize =
        ((val - min) * 100) / (max - min) + "% 100%";
    }

    rangeInputs.forEach((input) => {
      input.addEventListener("input", handleInputChange);
      const min = Number(input.min);
      const max = Number(input.max);
      const val = Number(input.value);
      input.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";
    });

    if (numberInput) numberInput.addEventListener("input", handleInputChange);
  }, [initCTX]);
  return (
    <div className="App">
      {initCTX ? (
        <div className="flex h-full flex-col justify-between">
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
