import autoBind from "auto-bind";
import { Module } from "models";
export class DriveModule extends Module<GainNode, WaveShaperNode> {
  protected inputNode: GainNode = new GainNode(Module.context, { gain: 1 });
  protected outputNode: WaveShaperNode = new WaveShaperNode(Module.context);
  private _driveAmount: number = 0;
  constructor() {
    super();
    autoBind(this);
    this.inputNode.connect(this.outputNode);
  }
  public setDrive(value: number) {
    const k = value * 10;
    const n = 22050;
    const curve = new Float32Array(n);
    const deg = Math.PI / 180;
    for (let i = 0; i < n; i++) {
      let x = (i * 2) / n - 1;
      let p = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      curve[i] = p * 2.89;
    }

    this.outputNode.curve = curve;
    this._driveAmount = value;
  }
  public get driveAmount(): number {
    return this._driveAmount;
  }
}
