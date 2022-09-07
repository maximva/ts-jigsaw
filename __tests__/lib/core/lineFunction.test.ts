import LineFunction from "../../../lib/core/lineFunction";

describe('LineFunction class', () => {
  it('should return 0 if it\'s an outside edge', () => {
    const lineFunction = new LineFunction(true);
    expect(lineFunction.call(128)).toEqual(0);
  });

  it('should return 0 if craziness is set to 0', () => {
    const lineFunction = new LineFunction(true, 0);
    expect(lineFunction.call(256)).toEqual(0);
  });

  it('should return value below max amplitude (craziness x 4) if not outsideEdge', () => {
    const craziness = 1;
    const lineFunction = new LineFunction(false, craziness);
    // craziness is multiplied by 4, defining the max. amplitude
    // in this case 2 * 4, being 8
    const result = lineFunction.call(512);
    expect(Math.abs(result)).toBeLessThanOrEqual(4);
  });

  it('should return value below max amplitude (2 x 4) if nothing specified', () => {
    const lineFunction = new LineFunction();
    // craziness is multiplied by 4, defining the max. amplitude
    // in this case 2 * 4, being 8
    const result = lineFunction.call(1024);
    expect(Math.abs(result)).toBeLessThanOrEqual(8);
  });
})
