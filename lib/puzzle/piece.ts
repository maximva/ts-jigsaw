import Coordinates from "../core/coordinates";
import LineFunction from "../core/lineFunction";
import Seeds from "../core/seeds";

export default class Piece {
  coordinates: Coordinates;
  sourceImage: HTMLImageElement;
  htmlCanvas: HTMLCanvasElement = document.createElement('canvas');
  _image: HTMLImageElement = new Image();

  constructor(coordinates: Coordinates, image: HTMLImageElement) {
    this.coordinates = coordinates;
    this.sourceImage =  image;
    this.generateCanvasPiece();
  }

  public get image() {
    return this._image;
  }

  private generateCanvasPiece() {
    this.htmlCanvas.width = this.coordinates.columnWidth*1.5;
    this.htmlCanvas.height = this.coordinates.rowHeight*1.5;
    const canvasContext = this.htmlCanvas.getContext('2d');
    if (!canvasContext) {
      console.warn('Canvas context is null, the puzzle piece cannot be generated');
      return;
    }
    this.prepareContext(canvasContext);
    this.drawPiece(canvasContext);
    this.extractImage(canvasContext);
    Piece.cleanUpContext(canvasContext);
  }

  private prepareContext(context: CanvasRenderingContext2D) {
    context.save();
    context.lineJoin = 'round';
    context.translate(-(this.coordinates.columnWidth * (this.coordinates.column))+20, -(this.coordinates.rowHeight * (this.coordinates.row))+10);
    context.moveTo(this.coordinates.topLeft.x, this.coordinates.topLeft.y);
  }

  private static cleanUpContext(context: CanvasRenderingContext2D) {
    context.restore();
  }

  private extractImage(context: CanvasRenderingContext2D) {
    context.stroke();
    context.clip();
    context.drawImage(this.sourceImage, 0, 0, 700, (700/3)*2);
    this._image.src = this.htmlCanvas.toDataURL('image/png');
    console.log('this._image', this._image);
  }

  private drawPiece(canvasContext: CanvasRenderingContext2D) {
    this.drawTopEdge(canvasContext);
    this.drawRightEdge(canvasContext);
    this.drawBottomEdge(canvasContext);
    this.drawLeftEdge(canvasContext);
  }

  private drawTab(xStart: number, xEnd: number) {
    // First implement 'edges' so all edges can have a different
    // function (x => x for border edges, ...)
  }

  private drawTopEdge(canvasContext: CanvasRenderingContext2D) {
    for (let i = this.coordinates.topLeft.x; i < this.coordinates.topRight.x; i += 1) {
      // if (i - (this.coordinates.columnWidth * this.coordinates.column) > 23 && this.coordinates.row !== 0) {
        // if (!tabDrawn) this.drawTab(i, i+14);
        // tabDrawn = true;
        // this.context.quadraticCurveTo(25, (this.rowHeight * this.row) + this.edges.top(i+5), 20, (this.rowHeight * this.row) + this.edges.top(i)+5)
        // this.context.bezierCurveTo(13, (this.rowHeight * this.row) + this.edges.top(i)+20, 47, (this.rowHeight * this.row) + this.edges.top(i)+20, 40, (this.rowHeight * this.row) + this.edges.top(i)+5)
        // this.context.quadraticCurveTo(35, (this.rowHeight * this.row) + this.edges.top(35), 40, (this.rowHeight * this.row) + this.edges.top(40))
      // } else if (i < 23 || i > 37) {
        canvasContext.lineTo(i, (this.coordinates.rowHeight * this.coordinates.row) + LineFunction.call(i, Seeds.getRowSeeds()[this.coordinates.row - 1]))
      // }
    }
  }

  private drawRightEdge(canvasContext: CanvasRenderingContext2D) {
    for (let i = this.coordinates.topRight.y; i < this.coordinates.bottomRight.y; i += 1) {
      canvasContext.lineTo((this.coordinates.column+1)*this.coordinates.columnWidth + LineFunction.call(i, Seeds.getColumnSeeds()[this.coordinates.column]), i);
    }
  }

  private drawBottomEdge(canvasContext: CanvasRenderingContext2D) {
    for (let i = this.coordinates.bottomRight.x; i > this.coordinates.bottomLeft.x; i -= 1) {
      canvasContext.lineTo(i, (this.coordinates.rowHeight * (this.coordinates.row+1)) + LineFunction.call(i, Seeds.getRowSeeds()[this.coordinates.row]));
    }
  }

  private drawLeftEdge(canvasContext: CanvasRenderingContext2D) {
    for (let i = this.coordinates.bottomLeft.y; i > this.coordinates.topLeft.y; i -= 1) {
      canvasContext.lineTo((this.coordinates.columnWidth * this.coordinates.column) + LineFunction.call(i, Seeds.getColumnSeeds()[this.coordinates.column - 1]), i);
    }
  }
}
