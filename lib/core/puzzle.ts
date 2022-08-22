import LineFunction from "./lineFunction";
import Column from "./column";
import Row from "./row";
import Piece from "./piece";

export default class Puzzle {
  private readonly numberOfRows: number;
  private readonly numberOfColumns: number;
  protected readonly width: number;
  protected readonly height: number;
  protected readonly rowLineFunctions: LineFunction[];
  protected readonly columnLineFunctions: LineFunction[];

  protected readonly rows: Row[];
  protected readonly columns: Column[];

  protected puzzlePieces: Piece[];

  constructor(numberOfRows: number, numberOfColumns: number, width: number, height: number) {
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
        pieces.push(new Piece(row, column));
      }
    }
    return pieces;
  }
}
