import IRenderStrategy from "../IRenderStrategy";
import Column from "../../core/column";
import Row from "../../core/row";
import Coordinates from "../../core/coordinates";
import CanvasEdgeRenderer from "./canvasEdgeRenderer";

export default class CanvasRenderStrategy implements IRenderStrategy {
  private htmlCanvas: HTMLCanvasElement = document.createElement('canvas');

  public renderPuzzlePiece(image: HTMLImageElement, row: Row, column: Column, coordinates: Coordinates): HTMLImageElement | undefined {
    this.htmlCanvas.width = column.width * 2;
    this.htmlCanvas.height = row.height * 2;
    const canvasContext = this.htmlCanvas.getContext('2d');
    if (!canvasContext) {
      console.warn('Canvas context is null, the puzzle piece cannot be generated');
      return;
    }
    CanvasRenderStrategy.prepareContext(column, row, coordinates, canvasContext);
    CanvasRenderStrategy.clipImage(image, column, row, coordinates, canvasContext);
    CanvasRenderStrategy.addEffects(column, row, coordinates, canvasContext);
    const pieceImage = this.extractImage();
    CanvasRenderStrategy.cleanUpContext(canvasContext);
    return pieceImage;
  }

  private static prepareContext(column: Column, row: Row, coordinates: Coordinates, context: CanvasRenderingContext2D) {
    context.save();
    context.lineJoin = 'round';
    context.translate(-(column.width * (column.position)) + (column.width / 2), -(row.height * (row.position)) + (row.height / 2));
    context.moveTo(coordinates.topLeft.x, coordinates.topLeft.y);
  }

  private static cleanUpContext(context: CanvasRenderingContext2D) {
    context.restore();
  }

  private static clipImage(image: HTMLImageElement, column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    CanvasRenderStrategy.drawPiece(column, row, coordinates, canvasContext);
    canvasContext.clip();
    canvasContext.drawImage(image, 0, 0, image.width, (image.width / 3) * 2);
  }

  private static addEffects(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    canvasContext.beginPath();
    CanvasRenderStrategy.drawPiece(column, row, coordinates, canvasContext);
    canvasContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
    canvasContext.shadowBlur = 3;
    canvasContext.lineWidth = 1;
    canvasContext.stroke();
    canvasContext.globalCompositeOperation = 'destination-over'; // destination-atop or in
    canvasContext.fill();
  }

  private extractImage() {
    const puzzlePieceImage = new Image();
    puzzlePieceImage.src = this.htmlCanvas.toDataURL('image/png');
    puzzlePieceImage.style.width = `${this.htmlCanvas.width / 4}px`;
    puzzlePieceImage.style.height = `${this.htmlCanvas.height / 4}px`;
    return puzzlePieceImage;
  }

  private static drawPiece(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    const edgeRenderer = new CanvasEdgeRenderer(row, column, coordinates, canvasContext);
    edgeRenderer.renderEdges();
  }
}
