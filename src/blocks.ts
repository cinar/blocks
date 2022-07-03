import { Bitmap, E } from './bitmap.js';

const B = '#0000ff';
const C = '#00ffff';
const G = '#00ff00';
const O = '#ff7f00';
const P = '#800080';
const R = '#ff0000';
const Y = '#ffff00';

/** Block I. */
const BLOCK_I = new Bitmap([[C, C, C, C]]);

/** Block J. */
const BLOCK_J = new Bitmap([
  [B, E, E],
  [B, B, B],
]);

/** Block L. */
const BLOCK_L = new Bitmap([
  [E, E, O],
  [O, O, O],
]);

/** Block O. */
const BLOCK_O = new Bitmap([
  [Y, Y],
  [Y, Y],
]);

/** Block S. */
const BLOCK_S = new Bitmap([
  [E, G, G],
  [G, G, E],
]);

/** Block T.  */
const BLOCK_T = new Bitmap([
  [P, P, P],
  [E, P, E],
]);

/** Block Z. */
const BLOCK_Z = new Bitmap([
  [R, R, E],
  [E, R, R],
]);

export const BLOCKS: Bitmap[] = [
  BLOCK_I,
  BLOCK_J,
  BLOCK_L,
  BLOCK_O,
  BLOCK_S,
  BLOCK_T,
  BLOCK_Z,
];
