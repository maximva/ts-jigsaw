import Row from "../core/row";
import Column from "../core/column";
import Coordinates from "../core/coordinates";
import RenderStrategy from "./renderStrategy";

export default class Piece {
  private sourceImage: HTMLImageElement;
  private _image: HTMLImageElement | undefined = new Image();
  readonly row: Row;
  readonly column: Column;
  coordinates: Coordinates;
  renderStrategy: RenderStrategy;

  constructor(image: HTMLImageElement, row: Row, column: Column, renderStrategy: RenderStrategy) {
    this.sourceImage = image;
    this.row = row;
    this.column = column;
    this.coordinates = new Coordinates(row, column);
    this.renderStrategy = renderStrategy;
    this._image = this.renderStrategy.renderPuzzlePiece(image, row, column, this.coordinates);
  }

  public get image() {
    return this._image;
  }
}
