export abstract class Modulo {

    public static context: AudioContext
    public static listener: AudioListener
    protected maxValue: number = 1
    protected minValue: number = 1
    public abstract node: AudioNode
    protected currentTime(): number {
        return 0
    }
    public abstract connect(destination: AudioNode | AudioParam): void
    public abstract start(): void
    public abstract stop(): void


}