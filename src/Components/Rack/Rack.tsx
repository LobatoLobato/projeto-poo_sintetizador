import { useEffect, useState } from "react";
import "./Rack.scss";
import { AmplifierModule, Module } from "models";
import { Amplifier, Oscillator } from "components";
// import { createGlobalstate, useGlobalState } from "state-pool";
// let globalWindowWidth = createGlobalstate(window.innerWidth);
// window.addEventListener("resize", () => {
//   globalWindowWidth.setValue(window.innerWidth);
// });
interface RackProps {
  noteOn: { note: number; active: boolean };
  noteOff: { note: number; active: boolean };
}
export function Rack(props: RackProps) {
  // const [windowWidth] = useGlobalState<number>(globalWindowWidth);
  const [amplifier, setAmplifier] = useState<AmplifierModule>();
  const { noteOn, noteOff } = props;

  useEffect(() => {
    if (!amplifier) return;
    if (noteOn.active) amplifier.start();
  }, [noteOn, amplifier]);
  useEffect(() => {
    if (!amplifier) return;
    if (noteOff.active) amplifier.stop();
  }, [noteOff, amplifier]);

  return (
    <div className="rack">
      {/* {windowWidth > 600 ? (
        <> */}
      <Oscillator connectTo={amplifier?.node} noteOn={noteOn.note} />
      <Amplifier
        onMount={setAmplifier}
        connectTo={Module.context?.destination}
      />
      {/* </>
      ) : (
        ""
      )} */}
    </div>
  );
}
