import { Utils } from "common";
import * as PIXI from "pixi.js";
import { Module } from "models";

enum MODE {
  DISABLED,
  WAVE,
  FFT,
  COUNT,
}
interface IRenderer extends PIXI.IRenderer {
  backgroundColor?: number;
}

const DEFAULT_LINE_WIDTH = 1.2;
const WAVE_PIXELS_PER_SAMPLE = 0.4;
export class VisualizerModule extends Module {
  public readonly node: AnalyserNode = new AnalyserNode(Module.context, {
    fftSize: 2048,
    smoothingTimeConstant: 0.25,
  });
  private stage: PIXI.Container;
  private renderer: IRenderer;
  private view: HTMLCanvasElement;
  private graphics: PIXI.Graphics;
  private enabled: boolean = false;
  private mode: MODE = MODE.DISABLED;
  private data: Uint8Array = new Uint8Array(this.node.frequencyBinCount);
  private floatData = new Float32Array(this.node.frequencyBinCount);
  private period: number = 0;
  private lastTime: number = 0;
  private width: number = 0;
  private height: number = 0;
  private backgroundColor: number = 0;
  private foregroundColor: number = 0;
  private style: CSSStyleDeclaration;

  constructor(private container: HTMLElement) {
    super();
    // Bind render method
    this.render = this.render.bind(this);
    // Remove existing canvases from the container and create new canvas
    this.container.querySelector("canvas")?.remove();
    this.view = document.createElement("canvas");
    // Set default styles
    this.view.style.overflow = "hidden";
    this.style = getComputedStyle(container);
    this.setStyles();
    // Apend new canvas to the container
    this.container.appendChild(this.view);
    // Create a pixi stage and renderer instance
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer({
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      resolution: 3,
      antialias: true,
      view: this.view,
    });
    console.log(this.renderer);
    // Create a pixi graphics instance
    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(DEFAULT_LINE_WIDTH, this.foregroundColor);
    // Append graphics to the stage
    this.stage.addChild(this.graphics);

    window.addEventListener("resize", () => {
      this.renderer.resize(
        parseFloat(this.style.width),
        parseFloat(this.style.height)
      );
    });
    // set default mode
    this.setModeWave();
  }
  private setStyles(): void {
    const style = this.style;
    this.width = parseFloat(style.width);
    this.height = parseFloat(style.height) - parseFloat(style.borderWidth);
    this.backgroundColor = Utils.colorStrToHexNumber(style.backgroundColor);
    this.foregroundColor = Utils.colorStrToHexNumber(style.color);
  }

  public start(): void {
    this.enabled = true;
    this.view.style.visibility = "visible";
    requestAnimationFrame(this.render);
  }

  public stop(): void {
    this.mode = MODE.DISABLED;
    this.enabled = false;
    this.view.style.visibility = "hidden";
  }

  public cycleMode() {
    this.mode = (this.mode + 1) % MODE.COUNT;
    switch (this.mode) {
      case MODE.DISABLED:
        this.stop();
        break;
      case MODE.WAVE:
        this.setModeWave();
        break;
      case MODE.FFT:
        this.setModeFFT();
        break;
    }
  }

  public setModeFFT() {
    this.mode = MODE.FFT;
    this.start();
    try {
      this.node.fftSize =
        Math.pow(2, Math.ceil(Math.log(this.width) / Math.LN2)) * 16;
    } catch (e) {
      // Probably went over a browser limitation, try 2048...
      this.node.fftSize = 2048;
    }
    this.data = new Uint8Array(this.node.frequencyBinCount);
  }

  public setModeWave() {
    this.mode = MODE.WAVE;
    this.start();
    this.node.fftSize = 2048;
    this.floatData = new Float32Array(this.node.frequencyBinCount);
  }

  public setPeriod(frequency: number) {
    // TODO: make WAVE_PIXELS_PER_SAMPLE dynamic so that low freqs don't get cut off
    if (this.mode !== MODE.WAVE) return;
    this.period = this.sampleRate() / frequency;
  }

  public render() {
    // The time and data are sometimes duplicated. In this case we can bypass rendering.
    const sampleTime = this.sampleRate() * this.currentTime();
    if (sampleTime === this.lastTime) {
      // render the stage
      this.renderer.render(this.stage);
      if (this.enabled) requestAnimationFrame(this.render);
      return;
    }
    this.setStyles();
    const graphics = this.graphics;
    const height = this.height - 1.5;

    graphics.clear();
    graphics.lineStyle(DEFAULT_LINE_WIDTH, this.foregroundColor, 0.2);
    this.renderer.backgroundColor = this.backgroundColor;
    this.lastTime = sampleTime;

    if (this.mode === MODE.FFT) {
      const data = this.data;
      this.node.getByteFrequencyData(data);

      graphics.moveTo(0, height);
      graphics.lineTo(this.width, height);

      graphics.lineStyle(DEFAULT_LINE_WIDTH, this.foregroundColor, 0.66);
      data.forEach((data, i) => {
        if (data === 0) return;
        graphics.moveTo(i / 4, height);
        graphics.lineTo(i / 4, height - (data >> 3));
      });
    } else if (this.mode === MODE.WAVE) {
      const data = this.floatData;
      this.node.getFloatTimeDomainData(data);

      graphics.moveTo(0, height / 2);
      graphics.lineTo(this.width, height / 2);

      const max = data.reduce((prev, curr) => {
        return Math.abs(curr) > prev ? Math.abs(curr) : prev;
      }, 0);
      const scale = Math.min(1 / max, 4) * 0.48;
      const sampleOffset = (sampleTime % this.period) - this.period;

      graphics.lineStyle(DEFAULT_LINE_WIDTH, this.foregroundColor, 1);
      graphics.moveTo(0, height / 2);
      data.forEach((data, i) => {
        const x = (i + sampleOffset) * WAVE_PIXELS_PER_SAMPLE;
        const y = height / 2 + height * data * scale;
        graphics.lineTo(x, y);
      });
    }

    // render the stage
    this.renderer.render(this.stage);
    if (this.enabled) requestAnimationFrame(this.render);
  }
}
