import Coordinates from "../../../lib/core/coordinates";
import Row from "../../../lib/core/row";
import Column from "../../../lib/core/column";
import Edge from "../../../lib/core/edge";

describe('Coordinates', () => {
  it('Should return return 0 or edgeLength for outside edges', () => {
    const edge = new Edge(100, 1, true);
    const row = new Row(0, 100, edge, edge);
    const col = new Column(0, 100, edge, edge);
    const coordinates = new Coordinates(row, col);

    const topLeft = coordinates.topLeft;
    const topRight = coordinates.topRight;
    const bottomLeft = coordinates.bottomLeft;
    const bottomRight = coordinates.bottomRight;

    expect(topLeft).toEqual({ x: 0, y: 0 });
    expect(topRight).toEqual({ x: 100, y: 0 });
    expect(bottomLeft).toEqual({ x: 0, y: 100 })
    expect(bottomRight).toEqual({ x: 100, y: 100 })
  });
});
