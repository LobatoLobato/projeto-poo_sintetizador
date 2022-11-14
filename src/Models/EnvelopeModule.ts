import { Module } from "./Module";
import { Utils } from "common";

export class EnvelopeModule extends Module {
  public readonly node: ConstantSourceNode = new ConstantSourceNode(
    Module.context,
    { offset: this.minValue }
  );
  private readonly _amountNode: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  private _amount: number = this.maxValue;
  private _attack: number = this.minValue;
  private _decay: number = this.minValue;
  private _sustain: number = this.maxValue;
  private _release: number = this.minValue;
  private _remainingAttackTime: number = this.minValue;
  private _remainingDecayTime: number = this.minValue;

  constructor(maxValue: number, initialValue?: number) {
    super();
    this.maxValue = Math.max(maxValue, this.minValue);
    this._amountNode.gain.setValueAtTime(
      initialValue ?? this.minValue,
      this.currentTime()
    );
    this.node.connect(this._amountNode);
    this.node.start();
  }
  /**
   * Conecta o envelope a um nó de audio ou ao parametro de um nó de audio
   * @param destination Nó de destino da conexão
   */
  public connect(destination: AudioNode | AudioParam): void {
    if (destination instanceof AudioNode) {
      this._amountNode.connect(destination);
    }
    if (destination instanceof AudioParam) {
      this._amountNode.connect(destination);
    }
    this._destination = destination;
  }
  /**
   * Inicia o envelope
   */
  public start(): void {
    // Para a curva atual
    this.node.offset.cancelScheduledValues(this.currentTime());
    // Inicia a curva de "attack" até o valor máximo
    this._remainingAttackTime = this.currentTime() + this.attack;
    this.node.offset.setValueAtTime(this.minValue, this.currentTime());
    this.node.offset.linearRampToValueAtTime(
      1,
      this.currentTime() + this.attack
    );
    setTimeout(() => console.log(this.node.offset), this.attack * 500);
    this.node.offset.exponentialRampToValueAtTime(
      this.sustain,
      this.currentTime() + this.attack + this.decay
    );
    this._remainingDecayTime = this.currentTime() + this.attack + this.decay;
  }
  /**
   * Para o envelope
   */
  public stop(): void {
    // Para a curva atual
    this.node.offset.cancelScheduledValues(this.currentTime());
    // Inicia a curva de "release" até o valor mínimo
    if (this.maxValue > 1) console.log(this.node.offset.value);
    this.node.offset.setValueAtTime(this.node.offset.value, this.currentTime());
    this.node.offset.exponentialRampToValueAtTime(
      this.minValue,
      this.currentTime() + this.release
    );
    this._remainingAttackTime = this.minValue;
    this._remainingDecayTime = this.minValue;
  }

  get amount(): number {
    return this._amount;
  }
  get attack(): number {
    return Utils.linToExp2(this._attack, this.minValue, 4);
  }
  get decay(): number {
    return Math.max(this._decay * 2, this.minValue);
  }
  get sustain(): number {
    return Math.max(this._sustain * 2, this.minValue);
  }
  get release(): number {
    return Math.max(this._release * 2, this.minValue);
  }
  set amount(value: number) {
    value = Math.max(this.minValue, Math.min(value, this.maxValue));
    this._amount = value;
    this._amountNode.gain.setValueAtTime(value, this.currentTime());
  }
  set attack(value: number) {
    this._attack = value;
  }
  set decay(value: number) {
    this._decay = value;
  }
  set sustain(value: number) {
    value = Math.max(value, this.minValue);
    this._sustain = value;

    if (this._remainingAttackTime > this.currentTime()) {
      this.node.offset.cancelScheduledValues(this.currentTime());
      this.node.offset.linearRampToValueAtTime(
        this.maxValue,
        this._remainingAttackTime
      );
      this.node.offset.exponentialRampToValueAtTime(
        this.maxValue * value,
        this._remainingDecayTime
      );
      return;
    }
    if (this._remainingDecayTime === this.minValue) return;
    this.node.offset.cancelScheduledValues(this.currentTime());
    this.node.offset.exponentialRampToValueAtTime(
      this.maxValue * value,
      this._remainingDecayTime
    );
  }
  set release(value: number) {
    this._release = value;
  }
}
