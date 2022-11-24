import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <App />
  /* </React.StrictMode> */
);

// public setLFOParams(params: ILFOParams) {
//   // Fazer algo
// }
// public setOscParams(params: IOscillatorParams) {
//   // Fazer algo
// }
// public setFilterParams(params: IFilterParams) {
//   // Fazer algo
// }
// public setAmplifierParams(params: IOscillatorParams) {
//   // Fazer algo
// }

// public getLFOParams(params: ILFOParams): ILFOParams {
//   // Fazer algo
//   return {
//     discriminator: "LFOParams",
//   };
// }
// public getOscParams(): IOscillatorParams {
//   // Fazer algo
//   return {
//     discriminator: "OscillatorParams",
//     type: this.osc.type,
//     pitchOffset: this.osc.pitchOffset,
//     detune: this.osc.detune,
//     envelope: this.osc.envelope,
//     unison: {
//       size: this.osc.unisonSize,
//       detune: this.osc.unisonDetune,
//       spread: this.osc.unisonSpread,
//     },
//     lfo_depth: this.osc.lfoDepth,
//   };
// }
// public getFilterParams(params: IFilterParams) {
//   // Fazer algo
// }
// public getAmplifierParams(params: IOscillatorParams) {
//   // Fazer algo
// }
