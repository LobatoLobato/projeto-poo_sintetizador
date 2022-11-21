export class NotImplementedError extends Error {
  constructor(name: string) {
    super(`Method ${name} is not implemented`);
    this.name = "NotImplementedError";
  }
}
