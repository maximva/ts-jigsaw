import Piece from "../core/piece";
import Puzzle from "../core/puzzle";
import CanvasPiece from "./canvasPiece";

export default class CanvasPuzzle extends Puzzle {
  image: HTMLImageElement;
  canvasPuzzlePieces: CanvasPiece[] = [];

  constructor(image: HTMLImageElement, rows: number, columns: number, width: number, height: number) {
    super(rows, columns, width, height);
    this.image = image;
    this.generateCanvasPieces();
  }

  private generateCanvasPieces() {
    this.puzzlePieces.forEach((puzzlePiece: Piece) => {
      this.canvasPuzzlePieces.push(new CanvasPiece(puzzlePiece, this.image));
    })
  }

  public getCanvasPieces() {
    return this.canvasPuzzlePieces;
  }

  public showImage(context: CanvasRenderingContext2D) {
    context.globalAlpha = 0.5;
    context.drawImage(this.image, 0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
  }

  public drawGrid(context: CanvasRenderingContext2D) {
    context.save();
    context.strokeStyle = '#ffffff';
    // Columns
    for (let i = 1; i < this.columnLineFunctions.length; i++) {
      context.beginPath();
      const x = i * this.width / this.columns.length;
      context.moveTo(x, 0);
      for (let j = 0; j < context.canvas.clientHeight; j += 1) {
        context.lineTo(x + this.columnLineFunctions[i].call(j), j);
      }
      context.stroke();
    }

    // Rows
    for (let i = 1; i < this.rowLineFunctions.length; i++) {
      context.beginPath();
      const y = i * this.height / this.rows.length;
      context.moveTo(0, y);
      for (let j = 0; j < context.canvas.clientWidth; j += 1) {
        context.lineTo(j, y + this.rowLineFunctions[i].call(j));
      }
      context.stroke();
    }
    context.restore();
  }
}
