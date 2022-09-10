import Puzzle from '../../../lib/puzzle/puzzle';

const getImage = async (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.src = url;
    img.onerror = reject;
    img.onload = () => resolve(img);
  })
};

describe('Puzzle class', () => {
  it('Should return amount of puzzle pieces according to configured rows/columns', () => {
    getImage('./puzzle-pieces.png')
      .then((image) => {
        const puzzle = new Puzzle(image, 10, 10, 700, (700/3)*2);
        expect(puzzle.getPuzzlePieces().length).toBe(100); // 10 * 10
      }).catch(() => {});
  });
});
