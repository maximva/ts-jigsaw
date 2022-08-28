import Row from "../core/row";
import Column from "../core/column";
import Coordinates from "../core/coordinates";
import IRenderStrategy from "./IRenderStrategy";

export default class Piece {
  private sourceImage: HTMLImageElement;
  private readonly image: HTMLImageElement | undefined = new Image();
  readonly row: Row;
  readonly column: Column;
  coordinates: Coordinates;
  renderStrategy: IRenderStrategy;

  constructor(image: HTMLImageElement, row: Row, column: Column, renderStrategy: IRenderStrategy) {
    this.sourceImage = image;
    this.row = row;
    this.column = column;
    this.coordinates = new Coordinates(row, column);
    this.renderStrategy = renderStrategy;
    this.image = this.renderStrategy.renderPuzzlePiece(image, row, column, this.coordinates);
  }
}
