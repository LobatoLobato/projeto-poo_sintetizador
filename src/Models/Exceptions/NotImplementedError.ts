export class NotImplementedError extends Error {
  constructor(name: string) {
    super(`Function/Method ${name} is not implemented`);
    this.name = "NotImplementedError";
  }
}
