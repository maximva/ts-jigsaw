import Coordinate from "./coordinate";

export default class Coordinates {
  private readonly _topLeft: Coordinate;
  private readonly _topRight: Coordinate;
  private readonly _bottomRight: Coordinate;
  private readonly _bottomLeft: Coordinate;

  private readonly _row: number;
  private readonly _column: number;

  private readonly _rowHeight: number;
  private readonly _columnWidth: number;

  public constructor(row: number, column: number, rowHeight: number, columnWidth: number) {
    this._topLeft = new Coordinate(row, column, rowHeight, columnWidth);
    this._topRight = new Coordinate(row, column + 1, rowHeight, columnWidth);
    this._bottomRight = new Coordinate(row + 1, column + 1, rowHeight, columnWidth);
    this._bottomLeft = new Coordinate(row + 1, column, rowHeight, columnWidth);

    this._row = row;
    this._column = column;

    this._rowHeight = rowHeight;
    this._columnWidth = columnWidth;
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

  public get row() {
    return this._row;
  }

  public get column() {
    return this._column;
  }

  public get rowHeight() {
    return this._rowHeight;
  }

  public get columnWidth() {
    return this._columnWidth;
  }
}
