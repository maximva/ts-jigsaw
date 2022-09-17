import {Puzzle} from '../../../lib';
// @ts-ignore
import * as image from './resources/puzzle-pieces.png';

describe('Puzzle class', () => {
  it('Should return amount of puzzle pieces according to configured rows/columns', () => {
    const htmlImage = new Image(image);
    const puzzle = new Puzzle(htmlImage, 10, 10, 700, (700/3)*2);
    expect(puzzle.getPuzzlePieces().length).toBe(100); // 10 * 10
  });
});
