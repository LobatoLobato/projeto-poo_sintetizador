import { Module } from "models";
import { Utils } from "common";

export class EnvelopeModule extends Module {
  private readonly source: ConstantSourceNode = new ConstantSourceNode(
    Module.context,
    { offset: this.minValue }
  );
  public readonly node: GainNode = new GainNode(Module.context, {
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
    this.node.gain.setValueAtTime(
      initialValue ?? this.minValue,
      this.currentTime()
    );
    this.source.connect(this.node);
    this.source.start();
  }

  /**
   * Inicia o envelope
   */
  public start(): void {
    // Para a curva atual
    this.source.offset.cancelScheduledValues(this.currentTime());
    // Inicia a curva de "attack" até o valor máximo
    this._remainingAttackTime = this.currentTime() + this.attack;
    this.source.offset.setValueAtTime(this.minValue, this.currentTime());
    this.source.offset.linearRampToValueAtTime(
      1,
      this.currentTime() + this.attack
    );

    this.source.offset.exponentialRampToValueAtTime(
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
    this.source.offset.cancelScheduledValues(this.currentTime());
    // Inicia a curva de "release" até o valor mínimo
    this.source.offset.setValueAtTime(
      this.source.offset.value,
      this.currentTime()
    );
    this.source.offset.exponentialRampToValueAtTime(
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
    value = Math.min(value || this.minValue, this.maxValue);
    this._amount = value;
    this.node.gain.setValueAtTime(value, this.currentTime());
    console.log(value);
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
      this.source.offset.cancelScheduledValues(this.currentTime());
      this.source.offset.linearRampToValueAtTime(
        this.maxValue,
        this._remainingAttackTime
      );
      this.source.offset.exponentialRampToValueAtTime(
        this.maxValue * value,
        this._remainingDecayTime
      );
      return;
    }
    if (this._remainingDecayTime === this.minValue) return;
    this.source.offset.cancelScheduledValues(this.currentTime());
    this.source.offset.exponentialRampToValueAtTime(
      this.maxValue * value,
      this._remainingDecayTime
    );
  }
  set release(value: number) {
    this._release = value;
  }
}