import autoBind from "auto-bind";
import { Module, IModulator } from "models";

export class EnvelopeModule extends Module<GainNode> implements IModulator {
  protected inputNode: GainNode = new GainNode(Module.context, {
    gain: this.minValue,
  });
  public readonly outputNode: GainNode = this.inputNode;
  private readonly source: ConstantSourceNode = new ConstantSourceNode(
    Module.context,
    { offset: this.minValue }
  );
  private _amount: number = this.maxValue;
  private _attack: number = this.minValue;
  private _decay: number = this.minValue;
  private _sustain: number = this.maxValue;
  private _release: number = this.minValue;
  private _remainingAttackTime: number = this.minValue;
  private _remainingDecayTime: number = this.minValue;
  constructor(
    maxValue: number,
    initialValue?: number,
    options?: { ref: Module }
  ) {
    super();
    autoBind(this);
    if (initialValue) this.setAmount(initialValue);
    this.maxValue = Math.max(maxValue, this.minValue);
    this.source.connect(this.outputNode);
    this.source.start();
  }

  /**
   * Inicia o envelope
   */
  public start(): void {
    // Para a curva atual
    this.source.offset.cancelScheduledValues(this.now());
    // Inicia a curva de "attack" até o valor máximo
    this._remainingAttackTime = this.now() + this.attack;
    this.source.offset.setValueAtTime(this.minValue, this.now());
    this.source.offset.linearRampToValueAtTime(1, this.now() + this.attack);

    this.source.offset.exponentialRampToValueAtTime(
      this.sustain,
      this.now() + this.attack + this.decay
    );
    this._remainingDecayTime = this.now() + this.attack + this.decay;
  }
  /**
   * Para o envelope
   */
  public stop(): void {
    // Para a curva atual
    this.source.offset.cancelScheduledValues(this.now());
    // Inicia a curva de "release" até o valor mínimo
    this.source.offset.setValueAtTime(this.source.offset.value, this.now());
    this.source.offset.exponentialRampToValueAtTime(
      this.minValue,
      this.now() + this.release
    );
    this._remainingAttackTime = this.minValue;
    this._remainingDecayTime = this.minValue;
  }

  get amount(): number {
    return this._amount;
  }
  get attack(): number {
    return this._attack;
  }
  get decay(): number {
    return this._decay;
  }
  get sustain(): number {
    return this._sustain;
  }
  get release(): number {
    return this._release;
  }
  public setAmount(value: number): void {
    value = value || this.minValue;
    this._amount = value;
    this.outputNode.gain.setValueAtTime(value, this.now());
  }
  public setAttack(value: number): void {
    this._attack = Math.max(value, this.minValue);
  }
  public setDecay(value: number): void {
    this._decay = Math.max(value, this.minValue);
  }
  public setSustain(value: number): void {
    value = Math.max(value, this.minValue);
    this._sustain = value;

    if (this._remainingAttackTime > this.now()) {
      this.source.offset.cancelScheduledValues(this.now());
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
    this.source.offset.cancelScheduledValues(this.now());
    this.source.offset.exponentialRampToValueAtTime(
      this.maxValue * value,
      this._remainingDecayTime
    );
  }
  public setRelease(value: number): void {
    this._release = Math.max(value, this.minValue);
  }
  public getSourceNode(): ConstantSourceNode {
    return this.source;
  }
}
