import { Bag } from "./bag.js";
import { Bitmap } from "./bitmap.js";

/**
 * Shape object.
 */
export class Shape {
  /** All rotations. */
  private rotations: Bag<Bitmap>;

  /** Row offset. */
  private rowOffset: number;

  /** Column offset. */
  private colOffset: number;

  /**
   * Constructor.
   * @param {Bitmap} bitmap shape bitmap.
   */
  constructor(bitmap: Bitmap) {
    this.rotations = new Bag<Bitmap>(bitmap.allRotations());
    this.rowOffset = 0;
    this.colOffset = 0;
  }

  /**
   * Returns bitmaps as shapes.
   * @param {Bitmap[]} bitmaps bitmap list.
   * @return {Shape[]} shape list.
   */
  static asShapes(bitmaps: Bitmap[]): Shape[] {
    return bitmaps.map((bitmap) => new Shape(bitmap));
  }

  /**
   * Moves left within the given bitmap.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} moved left.
   */
  left(board: Bitmap): boolean {
    return this.changeColOffset(this.colOffset - 1, board);
  }

  /**
   * Moves right within the given bitmap.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} moved right.
   */
  right(board: Bitmap): boolean {
    return this.changeColOffset(this.colOffset + 1, board);
  }

  /**
   * Rotates shape within the given bitmap.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} rotated shape.
   */
  rotate(board: Bitmap): boolean {
    this.rotations.next();

    this.fitWithin(board);
    if (this.isOverlapping(board)) {
      this.rotations.previous();
      return false;
    }

    return true;
  }

  /**
   * Moves down within the given bitmap.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} moved down.
   */
  down(board: Bitmap): boolean {
    const before = this.rowOffset;
    this.rowOffset++;

    if (!this.isWithin(board) || this.isOverlapping(board)) {
      this.rowOffset = before;
      return false;
    }

    return true;
  }

  /**
   * Draws the shape on the context.
   * @param {CanvasRenderingContext2D} context game context.
   * @param {number} size block size.
   */
  draw(context: CanvasRenderingContext2D, size: number) {
    this.rotations
      .current()
      .draw(context, this.colOffset * size, this.rowOffset * size, size);
  }

  /**
   * Resets the shape position.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} not overlapping.
   */
  resetPosition(board: Bitmap) {
    this.rowOffset = 0;
    this.colOffset = Math.floor(
      (board.cols() - this.rotations.current().cols()) / 2
    );

    return !this.isOverlapping(board);
  }

  /**
   * Copy this shape to the board.
   * @param {Bitma} board board bitmap.
   */
  copyTo(board: Bitmap) {
    board.copyFrom(this.rowOffset, this.colOffset, this.rotations.current());
  }

  /**
   * Changes the column offset within the given bitmap.
   * @param {number} colOffset column offset.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} changed X.
   */
  private changeColOffset(colOffset: number, board: Bitmap): boolean {
    const before = this.colOffset;
    this.colOffset = colOffset;

    if (!this.isWithin(board) || this.isOverlapping(board)) {
      this.colOffset = before;
      return false;
    }

    return true;
  }

  /**
   * Fit this shape within the given board.
   * @param {Bitmap} board board bitmap.
   */
  private fitWithin(board: Bitmap) {
    const boardRows = board.rows();
    const boardCols = board.cols();

    if (this.colOffset < 0) {
      this.colOffset = 0;
    }

    const currentCols = this.rotations.current().cols();
    if (this.colOffset + currentCols > boardCols) {
      this.colOffset = boardCols - currentCols;
    }

    const currentRows = this.rotations.current().rows();
    if (this.rowOffset + currentRows > boardRows) {
      this.rowOffset = boardRows - currentRows;
    }
  }

  /**
   * Is this within the given board.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} is within.
   */
  private isWithin(board: Bitmap): boolean {
    if (this.colOffset < 0) {
      return false;
    }

    const currentCols = this.rotations.current().cols();
    const boardCols = board.cols();

    if (this.colOffset + currentCols > boardCols) {
      return false;
    }

    const currentRows = this.rotations.current().rows();
    const boardRows = board.rows();

    if (this.rowOffset + currentRows > boardRows) {
      return false;
    }

    return true;
  }

  /**
   * Is this shape overlapping with the given board.
   * @param {Bitmap} board board bitmap.
   * @return {boolean} is overlapping.
   */
  private isOverlapping(board: Bitmap): boolean {
    return this.rotations
      .current()
      .isOverlapping(this.rowOffset, this.colOffset, board);
  }
}
