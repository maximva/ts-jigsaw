import RenderStrategy from "./renderStrategy";
import Column from "../core/column";
import Row from "../core/row";
import Coordinates from "../core/coordinates";

interface edge {
  [key: string]: number;
}

interface lobe {
  [key: string]: edge;
}

interface tabTranslationType {
  [key: string]: lobe;
}

export default class CanvasRenderStrategy implements RenderStrategy {
  private htmlCanvas: HTMLCanvasElement;

  constructor() {
    this.htmlCanvas = document.createElement('canvas');
  }

  // Implementation of RenderStrategy function
  public renderPuzzlePiece(image: HTMLImageElement, row: Row, column: Column, coordinates: Coordinates): HTMLImageElement | undefined {
    this.htmlCanvas.width = column.width * 2;
    this.htmlCanvas.height = row.height * 2;
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

  private drawTab(row: Row, column: Column, start: number, end: number, canvasContext: CanvasRenderingContext2D, edge: string) {
    const curveConstant = 5;
    const bulgeWidthConstant =  12; // 7 + Math.floor(Math.random() * 2);
    const bulgeHeightConstant = 22; // 17 + Math.floor(Math.random() * 4);
    const baseX = edge === 'upper' ? row.height * row.position : row.height * (row.position + 1);
    const baseY = edge === 'right' ? column.width * (column.position + 1) : column.width * column.position;
    const rowEdge = edge === 'upper' ? row.topEdge : row.bottomEdge;
    const columnEdge = edge === 'right' ? column.rightEdge : column.leftEdge;

    const tabOrientationTranslation: tabTranslationType = {
      startLobe: {
        upper: {
          cpx: start + curveConstant,
          cpy: baseX + rowEdge.call(start),
          x: start,
          y: baseX + rowEdge.call(start) + curveConstant,
        },
        lower: {
          cpx: start - curveConstant,
          cpy: baseX + rowEdge.call(start),
          x: start,
          y: baseX + rowEdge.call(start) + curveConstant,
        },
        right: {
          cpx: baseY + columnEdge.call(start),
          cpy: start + curveConstant,
          x: baseY + columnEdge.call(start) + curveConstant,
          y: start,
        },
        left: {
          cpx: baseY + columnEdge.call(start),
          cpy: start - curveConstant,
          x: baseY + columnEdge.call(start) + curveConstant,
          y: start,
        }
      },
      middleLobe: {
        upper: {
          cp1x: start - bulgeWidthConstant,
          cp2x: end + bulgeWidthConstant,
          cp1y: baseX + rowEdge.call(start) + bulgeHeightConstant,
          cp2y: baseX + rowEdge.call(start) + bulgeHeightConstant,
          x: end,
          y: baseX + rowEdge.call(start) + curveConstant,
        },
        lower: {
          cp1x: start + bulgeWidthConstant,
          cp2x: end - bulgeWidthConstant,
          cp1y: baseX + rowEdge.call(start) + bulgeHeightConstant,
          cp2y: baseX + rowEdge.call(start) + bulgeHeightConstant,
          x: end,
          y: baseX + rowEdge.call(start) + curveConstant,
        },
        right: {
          cp1x: baseY + columnEdge.call(start) + bulgeHeightConstant,
          cp2x: baseY + columnEdge.call(start) + bulgeHeightConstant,
          cp1y: start - bulgeWidthConstant,
          cp2y: end + bulgeWidthConstant,
          x: baseY + columnEdge.call(start) + curveConstant,
          y: end,
        },
        left: {
          cp1x: baseY + columnEdge.call(start) + bulgeHeightConstant,
          cp2x: baseY + columnEdge.call(start) + bulgeHeightConstant,
          cp1y: start + bulgeWidthConstant,
          cp2y: end - bulgeWidthConstant,
          x: baseY + columnEdge.call(start) + curveConstant,
          y: end,
        }
      },
      endLobe: {
        upper: {
          cpx: end - curveConstant,
          cpy: baseX + rowEdge.call(end + curveConstant),
          x: end,
          y: baseX + rowEdge.call(end),
        },
        lower: {
          cpx: end + curveConstant,
          cpy: baseX + rowEdge.call(end + curveConstant),
          x: end,
          y: baseX + rowEdge.call(end),
        },
        right: {
          cpx: baseY + columnEdge.call(end + curveConstant),
          cpy: end - curveConstant,
          x: baseY + columnEdge.call(end),
          y: end,
        },
        left: {
          cpx: baseY + columnEdge.call(end + curveConstant),
          cpy: end + curveConstant,
          x: baseY + columnEdge.call(end),
          y: end,
        }
      }
    }

    // First lobe
    canvasContext.quadraticCurveTo(
      tabOrientationTranslation.startLobe[edge].cpx,
      tabOrientationTranslation.startLobe[edge].cpy,
      tabOrientationTranslation.startLobe[edge].x,
      tabOrientationTranslation.startLobe[edge].y,
    );
    // Middle lobe
    canvasContext.bezierCurveTo(
      tabOrientationTranslation.middleLobe[edge].cp1x,
      tabOrientationTranslation.middleLobe[edge].cp1y,
      tabOrientationTranslation.middleLobe[edge].cp2x,
      tabOrientationTranslation.middleLobe[edge].cp2y,
      tabOrientationTranslation.middleLobe[edge].x,
      tabOrientationTranslation.middleLobe[edge].y,
    );
    // End lobe
    canvasContext.quadraticCurveTo(
      tabOrientationTranslation.endLobe[edge].cpx,
      tabOrientationTranslation.endLobe[edge].cpy,
      tabOrientationTranslation.endLobe[edge].x,
      tabOrientationTranslation.endLobe[edge].y,
    );
  }

  private drawTopEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    let tabDrawn = false;
    const baseY = row.height * row.position;
    for (let i = coordinates.topLeft.x; i < coordinates.topRight.x; i += 1) {
      if (i - (column.width * column.position) > 23 && row.position !== 0) {
        if (!tabDrawn) {
          this.drawTab(row, column, i, i+14, canvasContext, 'upper');
          tabDrawn = true;
        }
      } else if (i < 23 || i > 37) {
        const adjustmentY = row.topEdge.call(i);
        canvasContext.lineTo(i, baseY + adjustmentY);
      }
    }
  }

  private drawRightEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    let tabDrawn = false;
    const baseX = (column.position+1) * column.width;
    for (let i = coordinates.topRight.y; i < coordinates.bottomRight.y; i += 1) {
      if (i - (row.height * row.position) > 23) {
        if (!tabDrawn) {
          this.drawTab(row, column, i, i+14, canvasContext, 'right');
          tabDrawn = true;
        }
      } else if (i < 23 || i > 37) {
        const adjustmentX = column.rightEdge.call(i);
        canvasContext.lineTo(baseX + adjustmentX, i);
      }
    }
  }

  private drawBottomEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    let tabDrawn = false;
    const baseY = row.height * (row.position+1);
    for (let i = coordinates.bottomRight.x; i > coordinates.bottomLeft.x; i -= 1) {
      if (i - (column.width * column.position) < 37) {
        if (!tabDrawn) {
          this.drawTab(row, column, i, i-14, canvasContext, 'lower');
          tabDrawn = true;
        }
      } else if (i < 23 || i > 37) {
        const adjustmentY = row.bottomEdge.call(i);
        canvasContext.lineTo(i, baseY + adjustmentY);
      }
    }
  }

  private drawLeftEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    let tabDrawn = false;
    const baseX = column.width * column.position;
    for (let i = coordinates.bottomLeft.y; i > coordinates.topLeft.y; i -= 1) {
      if (i - (row.height * row.position) < 37) {
        if (!tabDrawn) {
          this.drawTab(row, column, i, i-14, canvasContext, 'left');
          tabDrawn = true;
        }
      } else if (i < 23 || i > 37) {
        const adjustmentX = column.leftEdge.call(i);
        canvasContext.lineTo(baseX + adjustmentX, i);
      }
    }
  }

}
