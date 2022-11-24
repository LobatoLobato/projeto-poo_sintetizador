// import { KeyboardEvent } from "react";

export class KeyboardHandler {
  private static keyPressed: boolean = false;
  public static readonly kbdKeys: string[] = [
    "Q",
    "2",
    "W",
    "3",
    "E",
    "R",
    "5",
    "T",
    "6",
    "Y",
    "7",
    "U",
    "I",
    "9",
    "O",
    "0",
    "P",
    "Z",
    "S",
    "X",
    "D",
    "C",
    "F",
    "V",
    "B",
    "H",
    "N",
    "J",
    "M",
    ",",
  ];
  public static getIndex(key: string): number {
    return this.kbdKeys.indexOf(key.toUpperCase());
  }
  public static addKeyDownListener(
    listener: (ev: globalThis.KeyboardEvent, keyIndex: number) => void
  ): void {
    document.addEventListener("keydown", (ev) => {
      listener(ev, this.getIndex(ev.key));
    });
  }
  public static addKeyUpListener(
    listener: (ev: globalThis.KeyboardEvent, keyIndex: number) => void
  ): void {
    document.addEventListener("keyup", (ev) => {
      listener(ev, this.getIndex(ev.key));
    });
  }
}
// export class KeyboardHandler2 {
//   private keyPressed: boolean = false;
//   private readonly kbdKeys: string[] = [
//     "Q",
//     "2",
//     "W",
//     "3",
//     "E",
//     "R",
//     "5",
//     "T",
//     "6",
//     "Y",
//     "7",
//     "U",
//     "I",
//     "9",
//     "O",
//     "0",
//     "P",
//     "Z",
//     "S",
//     "X",
//     "D",
//     "C",
//     "F",
//     "V",
//     "B",
//     "H",
//     "N",
//     "J",
//     "M",
//     ",",
//   ];
//   constructor() {

//   }
//   public getIndex(key: string): number {
//     return this.kbdKeys.indexOf(key.toUpperCase());
//   }
//   public  addKeyDownListener(
//     listener: (ev: globalThis.KeyboardEvent, keyIndex: number) => void
//   ): void {
//     document.addEventListener("keydown", (ev) => {
//       listener(ev, this.getIndex(ev.key));
//     });
//   }
//   public  addKeyUpListener(
//     listener: (ev: globalThis.KeyboardEvent, keyIndex: number) => void
//   ): void {
//     document.addEventListener("keyup", (ev) => {
//       listener(ev, this.getIndex(ev.key));
//     });
//   }
// }
