import { Module } from "./Module";
import { Utils } from "@common";

export class EnvelopeModule extends Module {
  public readonly node: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  private _attack: number = this.minValue;
  private _decay: number = this.minValue;
  private _sustain: number = this.maxValue;
  private _release: number = this.minValue;

  /**
   * Conecta o envelope a um nó de audio ou ao parametro de um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination: AudioNode | AudioParam): void {
    if (destination instanceof AudioNode) this.node.connect(destination);
    if (destination instanceof AudioParam) this.node.connect(destination);
  }
  /**
   * Inicia o envelope
   */
  public start(): void {
    // Para a curva atual
    this.node.gain.cancelScheduledValues(this.currentTime());
    // Inicia a curva de "attack" até o valor máximo
    this.node.gain.value = this.minValue;
    this.node.gain.setValueAtTime(this.node.gain.value, this.currentTime());
    this.node.gain.exponentialRampToValueAtTime(
      this.maxValue,
      this.currentTime() + this.attack
    );
    // Inicia a curva de "decay" até o valor de sustain
    this.node.gain.linearRampToValueAtTime(
      this.sustain,
      this.currentTime() + this.attack + this.decay
    );
  }
  /**
   * Para o envelope
   */
  public stop(): void {
    // Para a curva atual
    this.node.gain.cancelScheduledValues(this.currentTime());
    // Inicia a curva de "release" até o valor mínimo
    this.node.gain.setValueAtTime(this.node.gain.value, this.currentTime());
    this.node.gain.exponentialRampToValueAtTime(
      this.minValue,
      this.currentTime() + this.release
    );
  }

  get attack(): number {
    return Utils.linToExp2(this._attack, this.minValue, 4);
  }
  get decay(): number {
    return Utils.linToExp2(this._decay, this.minValue, 4);
  }
  get sustain(): number {
    return Utils.linToExp2(this._sustain, this.minValue, 1);
  }
  get release(): number {
    return Utils.linToExp2(this._release, this.minValue, 4);
  }
  set attack(value: number) {
    this._attack = value;
  }
  set decay(value: number) {
    this._decay = value;
  }
  set sustain(value: number) {
    this._sustain = value;
  }
  set release(value: number) {
    this._release = value;
  }
}
