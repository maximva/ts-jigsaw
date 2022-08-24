import LineFunction from "../core/lineFunction";
import Column from "../core/column";
import Row from "../core/row";
import Piece from "./piece";
import CanvasRenderStrategy from "./canvasRenderStrategy";

export default class Puzzle {
  private image: HTMLImageElement;
  private readonly numberOfRows: number;
  private readonly numberOfColumns: number;
  protected readonly width: number;
  protected readonly height: number;
  protected readonly rowLineFunctions: LineFunction[];
  protected readonly columnLineFunctions: LineFunction[];
  protected readonly rows: Row[];
  protected readonly columns: Column[];
  protected puzzlePieces: Piece[];

  constructor(image: HTMLImageElement, numberOfRows: number, numberOfColumns: number, width: number, height: number) {
    this.image = image;
    this.image.width = width;
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.width = width;
    this.height = height;
    this.rowLineFunctions = Puzzle.generateLineFunctions(numberOfRows + 1);
    this.columnLineFunctions = Puzzle.generateLineFunctions(numberOfColumns + 1);
    this.rows = this.generateRows();
    this.columns = this.generateColumns();
    this.puzzlePieces = this.generatePieces();
  }

  public getPuzzlePieces(): Piece[] {
    return this.puzzlePieces;
  }

  // should be moved, is pure canvas
  public showImage(context: CanvasRenderingContext2D) {
    context.globalAlpha = 0.5;
    context.drawImage(this.image, 0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
  }

  // should be moved, is pure canvas
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

  private static generateLineFunctions(amount: number) :LineFunction[] {
    const lineFunctions: LineFunction[] = [];
    for (let i = 0; i < amount; i += 1) {
      const outsideEdge = (i === 0 || i === amount-1);
      lineFunctions.push(new LineFunction(outsideEdge))
    }
    return lineFunctions;
  }

  private generateColumns() :Column[] {
    const columns: Column[] = [];
    for (let i = 0; i < this.numberOfColumns; i += 1) {
      const columnWidth = this.width / this.numberOfColumns;
      const leftEdge = this.columnLineFunctions[i];
      const rightEdge = this.columnLineFunctions[i+1];
      columns.push(new Column(i, columnWidth, leftEdge, rightEdge));
    }
    return columns
  }

  private generateRows() :Row[] {
    const rows: Row[] = [];
    for (let i = 0; i < this.numberOfRows; i += 1) {
      const rowHeight = this.height / this.numberOfRows;
      const topEdge = this.rowLineFunctions[i];
      const bottomEdge = this.rowLineFunctions[i+1];
      rows.push(new Row(i, rowHeight, topEdge, bottomEdge));
    }
    return rows;
  }

  private generatePieces() {
    const pieces: Piece[] = [];
    for (const column of this.columns) {
      for (const row of this.rows) {
        pieces.push(new Piece(this.image, row, column, new CanvasRenderStrategy()));
      }
    }
    return pieces;
  }
}
