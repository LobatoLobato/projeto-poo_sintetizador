import { useState } from "react";
import "./App.css";
import { Keyboard, Rack, NavBar } from "view/components";

function App() {
  const [initCTX, setInitCTX] = useState(false);

  return (
    <div className="App">
      {initCTX ? (
        <>
          <NavBar />
          <div className="h-full w-full bg-zinc-900 bg-gradient-to-b from-black to-zinc-900">
            <Rack />
          </div>
          <Keyboard />
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
