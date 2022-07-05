/** Style 2D. */
export type Style2D = string[][];

/** Empty style. */
export const E = "";

/**
 * Bitmap object.
 */
export class Bitmap {
  /** Bitmap data. */
  private data: Style2D;

  /**
   * Constructor.
   * @param {Style2D} data bitmap data.
   */
  constructor(data: Style2D) {
    this.data = data;
  }

  /**
   * Empty bitmap with the given size.
   * @param {number} rows bitmap rows.
   * @param {number} cols bitmap cols.
   * @return {Bitmap} empty bitmap.
   */
  static emptyWithSize(rows: number, cols: number): Bitmap {
    return new Bitmap(
      new Array<string>(rows).fill(E).map(() => new Array<string>(cols).fill(E))
    );
  }

  /**
   * Bitmap rows.
   * @return {number} bitmap> rows.
   */
  rows(): number {
    return this.data.length;
  }

  /**
   * Bitmap cols.
   * @return {number} bitmap cols.
   */
  cols(): number {
    return this.data[0].length;
  }

  /**
   * Rotates the current bitmap.
   * @return {Bitmap} rotated bitmap.
   */
  rotate(): Bitmap {
    const rotated: Style2D = [];
    const rows = this.rows();
    const cols = this.cols();

    for (let col = 0; col < cols; col++) {
      rotated[col] = [];
      for (let row = 0; row < rows; row++) {
        rotated[col][row] = this.data[rows - row - 1][col];
      }
    }

    return new Bitmap(rotated);
  }

  /**
   * All rotations of this current bitmap.
   * @return {Bitmap[]} all rotations.
   */
  allRotations(): Bitmap[] {
    const rotations: Bitmap[] = [this];

    for (let i = 1; i < 4; i++) {
      rotations.push(rotations[i - 1].rotate());
    }

    return rotations;
  }

  /**
   * Draws the bitmap on the context.
   * @param {CanvasRenderingContext2D} context game context.
   * @param {number} x x position.
   * @param {number} y y position.
   * @param {number} size block size.
   */
  draw(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
    const rows = this.rows();
    const cols = this.cols();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const style = this.data[row][col];
        if (style != E) {
          context.fillStyle = style;
          context.fillRect(x + col * size, y + row * size, size, size);
        }
      }
    }
  }

  /**
   * Is this bitmap overlapping with the other bitmap.
   * @param {number} rowOffset row offset.
   * @param {number} colOffset col offset.
   * @param {Bitmap} other other bitmap.
   * @return {boolean} is overlapping.
   */
  isOverlapping(rowOffset: number, colOffset: number, other: Bitmap): boolean {
    const maxRows: number = Math.min(other.rows(), rowOffset + this.rows());
    const maxCols: number = Math.min(other.cols(), colOffset + this.cols());

    for (let row = rowOffset; row < maxRows; row++) {
      for (let col = colOffset; col < maxCols; col++) {
        const value = this.data[row - rowOffset][col - colOffset];
        const otherValue = other.data[row][col];
        if (value != E && otherValue != E) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Copy from the given other bitmap.
   * @param {number} rowOffset row offset.
   * @param {number} colOffset col offset.
   * @param {Bitmap} other other bitmap.
   */
  copyFrom(rowOffset: number, colOffset: number, other: Bitmap) {
    const maxRows: number = Math.min(this.rows(), rowOffset + other.rows());
    const maxCols: number = Math.min(this.cols(), colOffset + other.cols());

    for (let row = rowOffset; row < maxRows; row++) {
      for (let col = colOffset; col < maxCols; col++) {
        const value = other.data[row - rowOffset][col - colOffset];
        if (value != E) {
          this.data[row][col] = value;
        }
      }
    }
  }

  /**
   * Is the row filled.
   * @param {number} row row number.
   * @return {boolean} is filled.
   */
  isRowFilled(row: number): boolean {
    const cols = this.cols();

    for (let col = 0; col < cols; col++) {
      if (this.data[row][col] == E) {
        return false;
      }
    }

    return true;
  }

  /**
   * Removes the given row, and moved rows down.
   * @param {number} row row number.
   */
  removeRow(row: number) {
    this.data.splice(row, 1);
    this.data.unshift(new Array<string>(this.cols()).fill(E));
  }

  /**
   * Removes the filled rows, and returns the count.
   * @return {number} removed count.
   */
  removeFilledRows(): number {
    const rows = this.rows();
    let count = 0;

    for (let row = rows - 1; row >= count; ) {
      if (this.isRowFilled(row)) {
        this.removeRow(row);
        count++;
      } else {
        row--;
      }
    }

    return count;
  }
}
