import Column from "../../core/column";
import Row from "../../core/row";
import Coordinates from "../../core/coordinates";
import Edge from "../../core/edge";

enum SHAPING_AXES { X, Y}

export default class CanvasEdgeRenderer {
  private row: Row;
  private column: Column;
  private coordinates: Coordinates;
  private canvasContext: CanvasRenderingContext2D;

  constructor(row: Row, column: Column, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    this.row = row;
    this.column = column;
    this.coordinates = coordinates;
    this.canvasContext = canvasContext;
  }

  public renderEdges() {
    this.top();
    this.right();
    this.bottom();
    this.left();
  }

  private top() {
    const baseY = this.row.height * this.row.position;
    this.renderIncrementing(baseY, this.row.topEdge, SHAPING_AXES.Y, this.coordinates.topLeft.x, this.coordinates.topRight.x);
  }

  private right() {
    const baseX = (this.column.position+1) * this.column.width;
    this.renderIncrementing(baseX, this.column.rightEdge, SHAPING_AXES.X, this.coordinates.topRight.y, this.coordinates.bottomRight.y);
  }

  private bottom() {
    const baseY = this.row.height * (this.row.position+1);
    this.renderDecrementing(baseY, this.row.bottomEdge, SHAPING_AXES.Y, this.coordinates.bottomRight.x, this.coordinates.bottomLeft.x);
  }

  private left() {
    const baseX = this.column.width * this.column.position;
    this.renderDecrementing(baseX, this.column.leftEdge, SHAPING_AXES.X, this.coordinates.bottomLeft.y, this.coordinates.topLeft.y);
  }

  // Drawing from 1px up to 1px down so the pieces don't actually
  // render on the edges between the pieces to make them fit together better
  private renderIncrementing(base: number, edge: Edge, dominantAxes: SHAPING_AXES, startIndex: number, endIndex: number) {
    for (let i = startIndex + 1; i <= endIndex - 1; i += 1) {
      this.renderEdge(edge, dominantAxes, base, i);
    }
  }

  private renderDecrementing(base: number, edge: Edge, dominantAxes: SHAPING_AXES, startIndex: number, endIndex: number) {
    for (let i = startIndex - 1; i >= endIndex + 1; i -= 1) {
      this.renderEdge(edge, dominantAxes, base, i);
    }
  }
  // The shaping axes is the one that moves along with the provided function
  private renderEdge(edge: Edge, dominantAxes: SHAPING_AXES, base: number, index: number) {
    const adjustment = edge.lineFunction.call(index);
    const x = dominantAxes === SHAPING_AXES.X ? base + adjustment : index;
    const y = dominantAxes === SHAPING_AXES.Y ? base + adjustment : index;
    this.canvasContext.lineTo(x, y);
  }
}
