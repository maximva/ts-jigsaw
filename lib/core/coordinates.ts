import Row from "./row";
import Column from "./column";
import LineFunction from "./lineFunction";

interface Coordinate {
  x: number;
  y: number;
}

export default class Coordinates {
  private readonly _topLeft: Coordinate;
  private readonly _topRight: Coordinate;
  private readonly _bottomRight: Coordinate;
  private readonly _bottomLeft: Coordinate;

  private rowHeight: number;
  private columnWidth: number;

  public constructor(row: Row, column: Column) {
    this.rowHeight = row.height;
    this.columnWidth = column.width;
    this._topLeft = this.getCoordinate(row.position, column.position, row.topEdge, column.leftEdge);
    this._topRight = this.getCoordinate(row.position, column.position + 1, row.topEdge, column.rightEdge);
    this._bottomRight = this.getCoordinate(row.position + 1, column.position + 1, row.bottomEdge, column.rightEdge);
    this._bottomLeft = this.getCoordinate(row.position + 1, column.position, row.bottomEdge, column.leftEdge);
  }

  private getCoordinate(
    rowsBefore: number,
    columnsBefore: number,
    rowFunction: LineFunction,
    columnFunction: LineFunction
  ) :Coordinate {
    const baseX = columnsBefore * this.columnWidth;
    const baseY = rowsBefore * this.rowHeight;
    const adjustmentX = columnFunction.call(baseY);
    const adjustmentY = rowFunction.call(baseX);
    return { x: baseX + adjustmentX, y: baseY + adjustmentY };
  }

  public get topLeft() {
    return this._topLeft;
  }

  public get topRight() {
    return this._topRight;
  }

  public get bottomRight() {
    return this._bottomRight;
  }

  public get bottomLeft() {
    return this._bottomLeft
  }
}
