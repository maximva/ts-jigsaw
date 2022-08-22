import Row from "./row";
import Column from "./column";
import Coordinates from "./coordinates";

export default class Piece {
  readonly row: Row;
  readonly column: Column;
  coordinates: Coordinates;

  constructor(row: Row, column: Column) {
    this.row = row;
    this.column = column;
    this.coordinates = new Coordinates(row, column);
  }
}
