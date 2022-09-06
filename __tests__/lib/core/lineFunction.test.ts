import LineFunction from "../../../lib/core/lineFunction";

describe('LineFunction class', () => {
  const lineFunction = new LineFunction(true);
  it('should return 0 if it\'s an outside edge', () => {
    expect(lineFunction.call(123)).toEqual(0);
  })
})
