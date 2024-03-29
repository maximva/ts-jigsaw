import Column from "../core/column";
import Row from "../core/row";
import Piece from "./piece";
import CanvasRenderStrategy from "./canvasRenderStrategy/canvasRenderStrategy";
import Edge from "../core/edge";

export default class Puzzle {
  private image: HTMLImageElement;
  private readonly numberOfRows: number;
  private readonly numberOfColumns: number;
  private readonly width: number;
  private readonly height: number;
  private readonly rowEdges: Edge[];
  private readonly columnEdges: Edge[];
  private readonly rows: Row[];
  private readonly columns: Column[];
  private puzzlePieces: Piece[] = [];

  constructor(
    image: HTMLImageElement, numberOfRows: number, numberOfColumns: number, width: number, height: number,
  ) {
    this.image = image;
    this.image.width = width * 4;
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.width = width * 4;
    this.height = height * 4;
    this.rowEdges = Puzzle.generateEdges(this.width, numberOfRows + 1, numberOfColumns);
    this.columnEdges = Puzzle.generateEdges(this.height, numberOfColumns + 1, numberOfRows);
    this.rows = this.generateRows();
    this.columns = this.generateColumns();
    this.puzzlePieces = this.generatePieces();
  }

  public getPuzzlePieces(): Piece[] {
    return this.puzzlePieces;
  }

  private static generateEdges(edgeLength: number, amount: number, edgeSegments: number) :Edge[] {
    const edges: Edge[] = [];
    for (let i = 0; i < amount; i += 1) {
      const outsideEdge = (i === 0 || i === amount-1);
      edges.push(new Edge(edgeLength, edgeSegments, outsideEdge));
    }
    return edges;
  }

  private generateColumns() :Column[] {
    const columns: Column[] = [];
    for (let i = 0; i < this.numberOfColumns; i += 1) {
      const columnWidth = this.width / this.numberOfColumns;
      const leftEdge = this.columnEdges[i];
      const rightEdge = this.columnEdges[i+1];
      columns.push(new Column(i, columnWidth, leftEdge, rightEdge));
    }
    return columns;
  }

  private generateRows() :Row[] {
    const rows: Row[] = [];
    for (let i = 0; i < this.numberOfRows; i += 1) {
      const rowHeight = this.height / this.numberOfRows;
      const topEdge = this.rowEdges[i];
      const bottomEdge = this.rowEdges[i+1];
      rows.push(new Row(i, rowHeight, topEdge, bottomEdge));
    }
    return rows;
  }

  private generatePieces() {
    const pieces: Piece[] = [];
    this.columns.forEach((column) => {
      this.rows.forEach((row) => {
        pieces.push(new Piece(this.image, row, column, new CanvasRenderStrategy()))
      })
    })
    return pieces;
  }
}
