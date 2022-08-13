import Seeds from '../core/seeds'
import Piece from "./piece";
import Coordinates from "../core/coordinates";

export default class Puzzle {
  rows: number;
  columns: number;
  width: number;
  height: number;
  rowHeight: number;
  columnWidth: number;

  image: HTMLImageElement;
  _puzzlePieces: Piece[] = [];

  constructor(image: HTMLImageElement, rows: number, columns: number, width: number, height: number) {
    this.image = image;
    this.rows = rows;
    this.columns = columns;
    this.width = width;
    this.height = height;
    this.rowHeight = height / rows;
    this.columnWidth = width / columns;

    Seeds.initialize(this.rows, this.columns);
    this.generatePieces();
  }

  private generatePieces() {
    for (let column = 0; column < this.columns; column += 1) {
      for (let row = 0; row < this.rows; row += 1) {
        const pieceCoordinates = new Coordinates(row, column, this.rowHeight, this.columnWidth);
        this._puzzlePieces.push(new Piece(pieceCoordinates, this.image));
      }
    }
  }

  public get puzzlePieces() {
    return this._puzzlePieces;
  }
}
