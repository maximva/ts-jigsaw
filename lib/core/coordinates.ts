import Row from "./row";
import Column from "./column";
import Edge from "./edge";

interface Coordinate {
  x: number;
  y: number;
}

export default class Coordinates {
  private readonly _topLeft: Coordinate;
  private readonly _topRight: Coordinate;
  private readonly _bottomRight: Coordinate;
  private readonly _bottomLeft: Coordinate;

  readonly topCenter: number;
  readonly rightCenter: number;
  readonly bottomCenter: number;
  readonly leftCenter: number;

  private readonly rowHeight: number;
  private readonly columnWidth: number;

  public constructor(row: Row, column: Column) {
    this.rowHeight = row.height;
    this.columnWidth = column.width;
    this._topLeft = this.getCoordinate(
      row.position,
      column.position,
      row.topEdge,
      column.leftEdge,
    );
    this._topRight = this.getCoordinate(
      row.position,
      column.position + 1,
      row.topEdge,
      column.rightEdge,
    );
    this._bottomRight = this.getCoordinate(
      row.position + 1,
      column.position + 1,
      row.bottomEdge,
      column.rightEdge,
    );
    this._bottomLeft = this.getCoordinate(
      row.position + 1,
      column.position,
      row.bottomEdge,
      column.leftEdge,
    );

    this.topCenter = this._topLeft.x + ((this._topRight.x - this._topLeft.x) / 2);
    this.rightCenter = this._topRight.y + ((this._bottomRight.y - this._topRight.y) / 2);
    this.bottomCenter = this._bottomLeft.x + ((this._bottomRight.x - this._bottomLeft.x) / 2);
    this.leftCenter = this._topLeft.y + ((this._bottomLeft.y - this._topLeft.y) / 2);
  }

  private getCoordinate(
    rowsBefore: number,
    columnsBefore: number,
    rowEdge: Edge,
    columnEdge: Edge
  ) :Coordinate {
    const baseX = columnsBefore * this.columnWidth;
    const baseY = rowsBefore * this.rowHeight;
    const adjustmentX = columnEdge.lineFunction.call(baseY);
    const adjustmentY = rowEdge.lineFunction.call(baseX);
    return {
      x: baseX + adjustmentX,
      y: baseY + adjustmentY
    };
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
