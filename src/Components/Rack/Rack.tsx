import { useEffect, useState } from "react";
import "./Rack.scss";
import { AmplifierModule, Module, OscillatorModule } from "models";
import { Amplifier, Oscillator } from "components";
// import { createGlobalstate, useGlobalState } from "state-pool";
// let globalWindowWidth = createGlobalstate(window.innerWidth);
// window.addEventListener("resize", () => {
//   globalWindowWidth.setValue(window.innerWidth);
// });
interface RackProps {
  noteOn: { note: number; active: boolean };
  noteOff: { note: number; active: boolean };
  portamento: { time: number; on: boolean };
  legatoOn: boolean;
}
export function Rack(props: RackProps) {
  // const [windowWidth] = useGlobalState<number>(globalWindowWidth);
  const [oscillator, setOscillator] = useState<OscillatorModule>();
  const [amplifier, setAmplifier] = useState<AmplifierModule>();
  const [prevNoteState, setPrevNoteState] = useState(false);
  const { noteOn, noteOff, portamento, legatoOn } = props;

  useEffect(() => {
    if (amplifier && noteOn.active && (!prevNoteState || !legatoOn)) {
      amplifier.start();
      setPrevNoteState(true);
    } else if (amplifier && noteOff.active) {
      amplifier.stop();
      setPrevNoteState(false);
    }
  }, [noteOn, amplifier, noteOff, prevNoteState, legatoOn]);
  useEffect(() => {
    if (oscillator) {
      oscillator.portamentoOn = portamento.on;
      oscillator.portamentoTime = portamento.time;
    }
  }, [portamento, oscillator]);
  return (
    <div className="rack">
      {/* {windowWidth > 600 ? (
        <> */}
      <Oscillator
        onMount={setOscillator}
        connectTo={amplifier?.node}
        noteOn={noteOn.note}
      />
      <Amplifier
        onMount={setAmplifier}
        connectTo={Module.context?.destination}
      />
      implementar o portamento com set value at time linearvalue at time sla
      whatever
      {/* </>
      ) : (
        ""
      )} */}
    </div>
  );
}
