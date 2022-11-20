export class NotAvailableOnBrowserError extends Error {
  constructor(name: string) {
    super(`Function/Method ${name} is not available on the browser`);
    this.name = "NotAvailableOnBrowserError";
  }
}
