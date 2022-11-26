import { useState } from "react";
import "./App.css";
import { Keyboard, Rack, NavBar } from "components";

function App() {
  const [initCTX, setInitCTX] = useState(false);

  return (
    <div className="App">
      {initCTX ? (
        <>
          <NavBar />
          <Rack />
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
