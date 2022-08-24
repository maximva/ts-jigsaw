import RenderStrategy from "./renderStrategy";
import Column from "../core/column";
import Row from "../core/row";
import Coordinates from "../core/coordinates";

export default class CanvasRenderStrategy implements RenderStrategy {
  private htmlCanvas: HTMLCanvasElement;

  constructor() {
    this.htmlCanvas = document.createElement('canvas');
  }

  public renderPuzzlePiece(image: HTMLImageElement, row: Row, column: Column, coordinates: Coordinates): HTMLImageElement | undefined {
    this.htmlCanvas.width = column.width * 1.5;
    this.htmlCanvas.height = row.height * 1.5;
    const canvasContext = this.htmlCanvas.getContext('2d');
    if (!canvasContext) {
      console.warn('Canvas context is null, the puzzle piece cannot be generated');
      return;
    }
    this.prepareContext(column, row, coordinates, canvasContext);
    this.drawPiece(column, row, coordinates, canvasContext);
    const pieceImage = this.extractImage(image, column, row, coordinates, canvasContext);
    CanvasRenderStrategy.cleanUpContext(canvasContext);
    return pieceImage;
  }

  private prepareContext(column: Column, row: Row, coordinates: Coordinates, context: CanvasRenderingContext2D) {
    context.save();
    context.lineJoin = 'round';
    context.translate(-(column.width * (column.position))+20, -(row.height * (row.position))+10);
    context.moveTo(coordinates.topLeft.x, coordinates.topLeft.y);
  }

  private static cleanUpContext(context: CanvasRenderingContext2D) {
    context.restore();
  }

  // Should I pass a context with the image on it to each piece instead
  // of creating a new one each time? This would remove the need for
  // CanvasPiece to know the width/height if the puzzle

  private extractImage(image: HTMLImageElement, column: Column, row: Row, coordinates: Coordinates, context: CanvasRenderingContext2D) {
    context.clip();
    context.drawImage(image, 0, 0, image.width, (image.width/3)*2);
    context.beginPath();
    this.drawPiece(column, row, coordinates, context);
    context.shadowColor = 'rgba(0, 0, 0, 0.4)';
    context.shadowBlur = 3;
    context.lineWidth = 1;
    context.stroke();
    context.globalCompositeOperation='destination-over'; // destination-atop or in
    context.fill();
    const puzzlePieceImage = new Image();
    puzzlePieceImage.src = this.htmlCanvas.toDataURL('image/png');
    return puzzlePieceImage;
  }

  private drawPiece(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    this.drawTopEdge(column, row, coordinates, canvasContext);
    this.drawRightEdge(column, row, coordinates, canvasContext);
    this.drawBottomEdge(column, row, coordinates, canvasContext);
    this.drawLeftEdge(column, row, coordinates, canvasContext);
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

  private drawTopEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    // let tabDrawn = false;
    const baseY = row.height * row.position;
    for (let i = coordinates.topLeft.x; i < coordinates.topRight.x; i += 1) {
      // if (i - (this.column.width * this.column.position) > 23 && this.row.position !== 0) {
      //   if (!tabDrawn) {
      //     this.drawTab(i, i+14, canvasContext);
      //     tabDrawn = true;
      //   }
      // } else if (i < 23 || i > 37) {
      const adjustmentY = row.topEdge.call(i);
      canvasContext.lineTo(i, baseY + adjustmentY);
      //   }
    }
  }

  private drawRightEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    const baseX = (column.position+1) * column.width;
    for (let i = coordinates.topRight.y; i < coordinates.bottomRight.y; i += 1) {
      const adjustmentX = column.rightEdge.call(i);
      canvasContext.lineTo(baseX + adjustmentX, i);
    }
  }

  private drawBottomEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    const baseY = row.height * (row.position+1);
    for (let i = coordinates.bottomRight.x; i > coordinates.bottomLeft.x; i -= 1) {
      const adjustmentY = row.bottomEdge.call(i);
      canvasContext.lineTo(i, baseY + adjustmentY);
    }
  }

  private drawLeftEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    const baseX = column.width * column.position;
    for (let i = coordinates.bottomLeft.y; i > coordinates.topLeft.y; i -= 1) {
      const adjustmentX = column.leftEdge.call(i);
      canvasContext.lineTo(baseX + adjustmentX , i);
    }
  }

}
