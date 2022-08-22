import Piece from "../core/piece";

export default class CanvasPiece {
  sourceImage: HTMLImageElement;
  htmlCanvas: HTMLCanvasElement = document.createElement('canvas');
  _image: HTMLImageElement = new Image();
  corePiece: Piece;

  constructor(corePiece: Piece, image: HTMLImageElement) {
    this.sourceImage =  image;
    this.corePiece = corePiece
    this.generateCanvasPiece();
  }

  public get image() {
    return this._image;
  }

  private generateCanvasPiece() {
    this.htmlCanvas.width = this.corePiece.column.width * 1.5;
    this.htmlCanvas.height = this.corePiece.row.height * 1.5;
    const canvasContext = this.htmlCanvas.getContext('2d');
    if (!canvasContext) {
      console.warn('Canvas context is null, the puzzle piece cannot be generated');
      return;
    }
    this.prepareContext(canvasContext);
    this.drawPiece(canvasContext);
    this.extractImage(canvasContext);
    CanvasPiece.cleanUpContext(canvasContext);
  }

  private prepareContext(context: CanvasRenderingContext2D) {
    context.save();
    context.lineJoin = 'round';
    context.translate(-(this.corePiece.column.width * (this.corePiece.column.position))+20, -(this.corePiece.row.height * (this.corePiece.row.position))+10);
    context.moveTo(this.corePiece.coordinates.topLeft.x, this.corePiece.coordinates.topLeft.y);
  }

  private static cleanUpContext(context: CanvasRenderingContext2D) {
    context.restore();
  }

  // Should I pass a context with the image on it to each piece instead
  // of creating a new one each time? This would remove the need for
  // CanvasPiece to know the width/height if the puzzle

  private extractImage(context: CanvasRenderingContext2D) {
    context.clip();
    context.drawImage(this.sourceImage, 0, 0, 700, (700/3)*2);
    context.beginPath();
    this.drawPiece(context);
    context.shadowColor = 'rgba(0, 0, 0, 0.4)';
    context.shadowBlur = 3;
    context.lineWidth = 1;
    context.stroke();
    context.globalCompositeOperation='destination-over'; // destination-atop or in
    context.fill();
    this._image.src = this.htmlCanvas.toDataURL('image/png');
  }

  private drawPiece(canvasContext: CanvasRenderingContext2D) {
    this.drawTopEdge(canvasContext);
    this.drawRightEdge(canvasContext);
    this.drawBottomEdge(canvasContext);
    this.drawLeftEdge(canvasContext);
  }

  // private drawTab(xStart: number, xEnd: number, canvasContext: CanvasRenderingContext2D) {
  //   const curveConstant = 5;
  //   const bulgeWidthConstant = 7 + Math.floor(Math.random() * 2);
  //   const bulgeHeightConstant = 17 + Math.floor(Math.random() * 4);
  //   const baseX = this.row.height * this.row.position;
  //   canvasContext.quadraticCurveTo(xStart+curveConstant, baseX + this.row.topEdge.call(xStart), xStart, baseX + LineFunction.call(xStart, Seeds.getRowSeeds()[this.coordinates.row - 1])+curveConstant)
  //   canvasContext.bezierCurveTo(xStart-bulgeWidthConstant, baseX + this.row.topEdge.call(xStart)+bulgeHeightConstant, xEnd+bulgeWidthConstant, baseX + LineFunction.call(xStart, Seeds.getRowSeeds()[this.coordinates.row - 1])+bulgeHeightConstant, xEnd, baseX + LineFunction.call(xStart, Seeds.getRowSeeds()[this.coordinates.row - 1])+curveConstant)
  //   canvasContext.quadraticCurveTo(xEnd-curveConstant, baseX + this.row.topEdge.call(xEnd + curveConstant), xEnd, baseX + LineFunction.call(xEnd, Seeds.getRowSeeds()[this.coordinates.row - 1]))
  // }

  private drawTopEdge(canvasContext: CanvasRenderingContext2D) {
    // let tabDrawn = false;
    const baseY = this.corePiece.row.height * this.corePiece.row.position;
    for (let i = this.corePiece.coordinates.topLeft.x; i < this.corePiece.coordinates.topRight.x; i += 1) {
      // if (i - (this.column.width * this.column.position) > 23 && this.row.position !== 0) {
      //   if (!tabDrawn) {
      //     this.drawTab(i, i+14, canvasContext);
      //     tabDrawn = true;
      //   }
      // } else if (i < 23 || i > 37) {
        const adjustmentY = this.corePiece.row.topEdge.call(i);
        canvasContext.lineTo(i, baseY + adjustmentY);
    //   }
    }
  }

  private drawRightEdge(canvasContext: CanvasRenderingContext2D) {
    const baseX = (this.corePiece.column.position+1) * this.corePiece.column.width;
    for (let i = this.corePiece.coordinates.topRight.y; i < this.corePiece.coordinates.bottomRight.y; i += 1) {
      const adjustmentX = this.corePiece.column.rightEdge.call(i);
      canvasContext.lineTo(baseX + adjustmentX, i);
    }
  }

  private drawBottomEdge(canvasContext: CanvasRenderingContext2D) {
    const baseY = this.corePiece.row.height * (this.corePiece.row.position+1);
    for (let i = this.corePiece.coordinates.bottomRight.x; i > this.corePiece.coordinates.bottomLeft.x; i -= 1) {
      const adjustmentY = this.corePiece.row.bottomEdge.call(i);
      canvasContext.lineTo(i, baseY + adjustmentY);
    }
  }

  private drawLeftEdge(canvasContext: CanvasRenderingContext2D) {
    const baseX = this.corePiece.column.width * this.corePiece.column.position;
    for (let i = this.corePiece.coordinates.bottomLeft.y; i > this.corePiece.coordinates.topLeft.y; i -= 1) {
      const adjustmentX = this.corePiece.column.leftEdge.call(i);
      canvasContext.lineTo(baseX + adjustmentX , i);
    }
  }
}
