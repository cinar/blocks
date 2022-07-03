/**
 * Bag object.
 */
export class Bag<T> {
  /** Bag values. */
  private values: T[];

  /** Value index. */
  private index: number;

  /**
   * Constructor.
   * @param {T[]} values bag values.
   */
  constructor(values: T[]) {
    this.values = values;
    this.index = 0;
  }

  /**
   * Gets the current value.
   * @return {T} current value.
   */
  current(): T {
    return this.values[this.index];
  }

  /**
   * Gets the next value.
   * @return {T} next value.
   */
  next(): T {
    this.index = (this.index + 1) % this.values.length;
    return this.current();
  }

  /**
   * Gets the previous value.
   * @return {T} previous value.
   */
  previous(): T {
    this.index = (this.values.length + this.index - 1) % this.values.length;
    return this.current();
  }

  /**
   * Gets the value at a random value index.
   * @return {T} value at a random value index.
   */
  random(): T {
    this.index = Math.floor(Math.random() * this.values.length);
    return this.current();
  }
}
