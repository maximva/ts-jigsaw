import Column from "../core/column";
import Row from "../core/row";
import Coordinates from "../core/coordinates";

export default interface IRenderStrategy {
  renderPuzzlePiece(
    image: HTMLImageElement, row: Row, column: Column, coordinates: Coordinates
  ): HTMLImageElement | undefined;
}
