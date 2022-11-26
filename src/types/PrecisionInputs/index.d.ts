declare module "precision-inputs/dist/precision-inputs" {
  export interface KnobInputOptions {
    min?: number; //The minimum input value. Same as with the standard range input element.
    max?: number; //The maximum input value. Same as with the standard range input element.
    step?: number; //	The step amount for value changes. Same as with the standard range input element.
    initial?: number; //average of min and max//	The initial value of the input. Also used when the user double-clicks to reset the input value.
    dragResistance?: number; //The amount of resistance to value change on mouse/touch drag events. Higher value means more precision, and the user will have to drag farther to change the input's value.
    wheelResistance?: number; //The amount of resistance to value change on mouse wheel scroll. Higher value means more precision, and the mouse wheel will be less effective at changing the input's value.
    dragActiveClass?: string; //This class will be added to the container element whenever the user has an active drag interaction to change the value of the input.
    focusActiveClass?: string; //	This class will be added to the container element whenever the input has browser focus, which happens after most mouse interactions as well as with keyboard navigation.
  }

  class KnobInput {
    constructor(container: HTMLElement, options?: KnobInputOptions);
    public initial: number;
    public dragResistance: number;
    public wheelResistance: 4000;
    public transformProperty: string;
    public focusActiveClass: string;
    public dragActiveClass: string;
    public r: number;
    public value?: number;
    private _input: HTMLInputElement;
    private _container: HTMLElement;
    private _activeDrag: boolean;

    public addEventListener(
      eventName: keyof HTMLElementEventMap,
      listener: (ev: React.FormEvent<HTMLInputElement>) => void
    ): void;
    public removeEventListener(
      eventName: keyof HTMLElementEventMap,
      listener: (ev: React.FormEvent<HTMLInputElement>) => void
    ): void;
    private handleBlur: () => void;
    private handleDoubleClick: () => void;
    private handleFocus: () => void;
    private handleInputChange: () => void;
    private handleMiddleClick: () => void;
    private handleMouseDown: () => void;
    private handleMouseMove: () => void;
    private handleMouseUp: () => void;
    private handleMouseWheel: () => void;
    private handleTouchCancel: () => void;
    private handleTouchEnd: () => void;
    private handleTouchMove: () => void;
    private handleTouchStart: () => void;
    private setupVisuals: () => void;
  }
  export interface FLStandardKnobOptions extends KnobInputOptions {
    color?: string; //The color to use for the indicator ring fill, focus indicator, and indicator dot (if present).
    indicatorDot?: boolean; //Whether the knob should display an indicator dot for making it easier to read the current value.
    indicatorRingType?: "positive" | "negative" | "split"; //	The fill style for the indicator ring.
    // 'positive' - color fills in from the left as value increases
    // 'negative' - color fills in from the right as value decreases
    // 'split' - color fills left/right from middle as value increases/decreases relative to the middle value (half-way between min and max)
  }
  class FLStandardKnob extends KnobInput {
    constructor(container: HTMLElement, options?: FLStandardKnobOptions);
    public color: string;
    public indicatorDot: boolean;
    public ringType: "positive" | "negative" | "split";
    public indicatorRingType: string;
    public indicatorRing: {};
    public indicatorDot: {};
  }
  export interface FLReactiveGripDialOptions extends KnobInputOptions {
    color: string; // (string, hexcolor) - 'transparent' to disable (default = FL default color)
    guideTicks: number; // (int) - number of tick marks on the outer guide ring (default = 9)
    gripBumps: number; // (int)- number of grip bumps that appear when interacting with the dial (default = 5)
    gripExtrusion: number; // (Number) - the degree to which the grips 'cut' into the dial when the user interacts with it, range (0.0, 1.0) (default = 0.5)
    minRotation: number; // (Number) - angle of rotation corresponding to the `min` value, relative to pointing straight down (default = pointing to the first guide tick mark)
    maxRotation: number; // (Number) - angle of rotation corresponding to the `max` value, relative to pointing straight down (default = pointing to the last guide tick mark)
  }
  class FLReactiveGripDial extends KnobInput {
    constructor(container: HTMLElement, options?: FLReactiveGripDialOptions);
    public color: string;
    public gripBumps: number;
    public gripExtrusion: number;
    public minRotation: number;
    public maxRotation: number;
  }

  const FLColors = {
    purple: {
      val: 9135103,
      str: "#8b63ff",
    },
    blue: {
      val: 5164287,
      str: "#4eccff",
    },
    green: {
      val: 8645442,
      str: "#83eb42",
    },
    yellow: {
      val: 16108615,
      str: "#f5cc47",
    },
    red: {
      val: 16731744,
      str: "#ff4e60",
    },
    orange: {
      val: 16754736,
      str: "#ffa830",
    },
    panning: {
      val: 9135103,
      str: "#8b63ff",
    },
    volume: {
      val: 5164287,
      str: "#4eccff",
    },
    modX: {
      val: 8645442,
      str: "#83eb42",
    },
    modY: {
      val: 16108615,
      str: "#f5cc47",
    },
    pitch: {
      val: 16731744,
      str: "#ff4e60",
    },
    misc: {
      val: 16754736,
      str: "#ffa830",
    },
    default: {
      val: 16754736,
      str: "#ffa830",
    },
  };
  export { KnobInput, FLReactiveGripDial, FLStandardKnob, FLColors };
}
