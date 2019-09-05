// add missing declaration

declare namespace Chai {
  interface Assertion {
    callCount(value: number, message?: string): Assertion;
  }
}
