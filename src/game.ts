import { Bag } from "./bag.js";
import { Bitmap } from "./bitmap.js";
import { Shape } from "./shape.js";
import { BLOCKS } from "./blocks.js";

/** Row count. */
const ROWS = 15;

/** Column count. */
const COLS = 10;

/** Size of a bock. */
const SIZE = 20;

/** Update speed. */
const UPDATE_SPEED = 100;

/** Step speed. */
const STEP_SPEED = 1000;

/** Game state. */
enum State {
  PLAYING,
  PAUSED,
  GAME_OVER,
}

/**
 * Game object.
 */
export class Game {
  /** Game canvas. */
  private canvas: HTMLCanvasElement;

  /** Game context. */
  private context: CanvasRenderingContext2D;

  /** Game board. */
  private board: Bitmap;

  /** Bag of the shapes. */
  private shapes: Bag<Shape>;

  /** Last update. */
  private lastUpdate: DOMHighResTimeStamp;

  /** Last step. */
  private lastStep: DOMHighResTimeStamp;

  /** Game state. */
  private state: State;

  /** Lines filled. */
  private lines: number;

  /** Game score. */
  private score: number;

  /**
   * Constructor.
   * @param {HTMLCanvasElement} canvas game canvas.
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d")!;
    this.board = Bitmap.emptyWithSize(ROWS, COLS);
    this.lastUpdate = 0;
    this.lastStep = 0;
    this.state = State.PLAYING;
    this.lines = 0;
    this.score = 0;

    this.shapes = new Bag<Shape>(Shape.asShapes(BLOCKS));

    this.resize();
    this.nextShape();
    this.listenForKeyEvents();
    this.requestUpdate();
  }

  /**
   * Clear game.
   */
  clear() {
    this.board = Bitmap.emptyWithSize(ROWS, COLS);
    this.lastUpdate = 0;
    this.lastStep = 0;
    this.state = State.PLAYING;
    this.lines = 0;
    this.score = 0;
    this.nextShape();
  }

  /**
   * Go left.
   */
  left() {
    this.shapes.current().left(this.board);
  }

  /**
   * Go right.
   */
  right() {
    this.shapes.current().right(this.board);
  }

  /**
   * Go down.
   */
  down() {
    this.moveDown();
  }

  /**
   * Rotate shape.
   */
  rotate() {
    this.shapes.current().rotate(this.board);
  }

  /**
   * Toggle game paused state.
   */
  togglePaused() {
    switch (this.state) {
      case State.PLAYING:
        this.state = State.PAUSED;
        break;

      case State.PAUSED:
        this.state = State.PLAYING;
        break;
    }
  }

  /**
   * Resizes the game canvas.
   */
  private resize() {
    const ratio = this.canvas.width / (COLS * SIZE);
    this.canvas.height = ratio * (ROWS * SIZE);
    this.context.scale(ratio, ratio);
  }

  /**
   * Listens for key events.
   */
  private listenForKeyEvents() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      this.onKeyEvent(event.key.toLowerCase());
    });
  }

  /**
   * On game key event.
   * @param {string} key game key.
   */
  private onKeyEvent(key: string) {
    if (!this.onControlKey(key) && this.state == State.PLAYING) {
      this.onPlayKey(key);
    }
  }

  /**
   * On game control key.
   * @param {string} key control key.
   * @return {boolean} key used.
   */
  private onControlKey(key: string): boolean {
    switch (key) {
      case "enter":
        this.togglePaused();
        break;

      case "r":
        this.clear();
        break;

      default:
        return false;
    }

    return true;
  }

  /**
   * On game pley key.
   * @param {string} key play key.
   * @return {boolean} key used.
   */
  private onPlayKey(key: string): boolean {
    switch (key) {
      case "arrowleft":
        this.left();
        break;

      case "arrowright":
        this.right();
        break;

      case "arrowup":
        this.rotate();
        break;

      case "arrowdown":
        this.down();
        break;

      case "spacebar":
      case " ":
        this.throwDown();
        break;

      default:
        return false;
    }

    return true;
  }

  /**
   * Request update.
   */
  private requestUpdate() {
    window.requestAnimationFrame((now: DOMHighResTimeStamp) => {
      this.update(now);
      this.requestUpdate();
    });
  }

  /**
   * Update game.
   * @param {DOMHighResTimeStamp} now now time.
   */
  private update(now: DOMHighResTimeStamp) {
    if (this.state == State.PLAYING && now - this.lastStep > STEP_SPEED) {
      this.moveDown();
      this.lastStep = now;
    }

    if (now - this.lastUpdate > UPDATE_SPEED) {
      this.context.clearRect(0, 0, COLS * SIZE, ROWS * SIZE);
      this.board.draw(this.context, 0, 0, SIZE);
      this.shapes.current().draw(this.context, SIZE);
      this.drawStats();
      this.lastUpdate = now;
    }
  }

  /**
   * Draws the game stats.
   */
  private drawStats() {
    const width = COLS * SIZE;
    const height = ROWS * SIZE;

    this.context.fillStyle = "#000000";
    this.context.textAlign = "left";
    this.context.font = '10px "Press Start 2P"';
    this.context.fillText("Lines", 2, 12);
    this.context.fillText(this.prependZeros(this.lines, 5), 2, 24);

    const rightEdge = width - 2;
    this.context.textAlign = "right";
    this.context.fillText("Score", rightEdge, 12);
    this.context.fillText(this.prependZeros(this.score, 5), rightEdge, 24);

    if (this.state == State.GAME_OVER) {
      this.context.fillStyle = "#ff0000";
      this.context.textAlign = "center";
      this.context.font = '20px "Press Start 2P"';
      this.context.fillText(
        "Game Over",
        Math.floor(width / 2),
        Math.floor(height / 2)
      );
    } else if (this.state == State.PAUSED) {
      this.context.fillStyle = "#00ff00";
      this.context.textAlign = "center";
      this.context.font = '20px "Press Start 2P"';
      this.context.fillText(
        "Paused",
        Math.floor(width / 2),
        Math.floor(height / 2)
      );
    }
  }

  /**
   * Next shape.
   */
  private nextShape() {
    this.shapes.random();
    if (!this.shapes.current().resetPosition(this.board)) {
      this.state = State.GAME_OVER;
    }
  }

  /**
   * Moves the shape down.
   * @return {boolean} moved down.
   */
  private moveDown(): boolean {
    if (!this.shapes.current().down(this.board)) {
      this.shapes.current().copyTo(this.board);

      const lines = this.board.removeFilledRows();
      this.lines += lines;
      if (lines < 4) {
        this.score += this.lines * 10;
      } else {
        this.score += 1000;
      }

      this.nextShape();

      return false;
    }

    return true;
  }

  /**
   * Throw the shape down.
   */
  private throwDown() {
    while (this.moveDown()) {
      // empty
    }
  }

  /**
   * Prepends zeros to number.
   * @param {number} value number value.
   * @param {number} size text size.
   * @return {string} number prepended with zeros.
   */
  private prependZeros(value: number, size: number) {
    const text = "000000" + value;
    return text.substr(text.length - size);
  }
}

new Game(document.getElementById("board")! as HTMLCanvasElement);
