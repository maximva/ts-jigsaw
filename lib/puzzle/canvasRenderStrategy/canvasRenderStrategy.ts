import IRenderStrategy from "../IRenderStrategy";
import Column from "../../core/column";
import Row from "../../core/row";
import Coordinates from "../../core/coordinates";
import CanvasEdgeRenderer from "./canvasEdgeRenderer";

interface edge {
  [key: string]: number;
}

interface lobe {
  [key: string]: edge;
}

interface tabTranslationType {
  [key: string]: lobe;
}

export default class CanvasRenderStrategy implements IRenderStrategy {
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
    // this.drawTopEdge(column, row, coordinates, canvasContext);
    // this.drawRightEdge(column, row, coordinates, canvasContext);
    // this.drawBottomEdge(column, row, coordinates, canvasContext);
    // this.drawLeftEdge(column, row, coordinates, canvasContext);

    const edgeRenderer = new CanvasEdgeRenderer(row, column, coordinates, canvasContext);
    edgeRenderer.renderEdges();
  }

  private drawTab(row: Row, column: Column, start: number, end: number, canvasContext: CanvasRenderingContext2D, edge: string) {
    const curveConstant = 5;
    const bulgeWidthConstant =  12;
    const bulgeHeightConstant = 22;
    const baseY = edge === 'upper' ? row.height * row.position : row.height * (row.position + 1);
    const baseX = edge === 'right' ? column.width * (column.position + 1) : column.width * column.position;
    const rowEdge = edge === 'upper' ? row.topEdge : row.bottomEdge;
    const columnEdge = edge === 'right' ? column.rightEdge : column.leftEdge;

    const tabTranslationIdea: tabTranslationType = {
      startLobe: {
        horizontal: {
          cpx: 0,
          cpy: 0,
          x: start,
          y: 0,
        },
        vertical: {

        }
      }
    };

    const tabOrientationTranslation: tabTranslationType = {
      startLobe: {
        upper: {
          cpx: start + curveConstant,
          cpy: baseY + rowEdge.lineFunction.call(start + curveConstant),
          x: start,
          y: baseY + rowEdge.lineFunction.call(start) + curveConstant, // +curveconstant for down, - for up
        },
        lower: {
          cpx: start - curveConstant,
          cpy: baseY + rowEdge.lineFunction.call(start - curveConstant),
          x: start,
          y: baseY + rowEdge.lineFunction.call(start) + curveConstant,
        },
        right: {
          cpx: baseX + columnEdge.lineFunction.call(start + curveConstant),
          cpy: start + curveConstant,
          x: baseX + columnEdge.lineFunction.call(start) + curveConstant,
          y: start,
        },
        left: {
          cpx: baseX + columnEdge.lineFunction.call(start - curveConstant),
          cpy: start - curveConstant,
          x: baseX + columnEdge.lineFunction.call(start) + curveConstant,
          y: start,
        }
      },
      middleLobe: {
        upper: {
          cp1x: start - bulgeWidthConstant,
          cp2x: end + bulgeWidthConstant,
          cp1y: baseY + rowEdge.lineFunction.call(start) + bulgeHeightConstant,
          cp2y: baseY + rowEdge.lineFunction.call(start) + bulgeHeightConstant,
          x: end,
          y: baseY + rowEdge.lineFunction.call(end) + curveConstant,
        },
        lower: {
          cp1x: start + bulgeWidthConstant,
          cp2x: end - bulgeWidthConstant,
          cp1y: baseY + rowEdge.lineFunction.call(start) + bulgeHeightConstant,
          cp2y: baseY + rowEdge.lineFunction.call(start) + bulgeHeightConstant,
          x: end,
          y: baseY + rowEdge.lineFunction.call(end) + curveConstant,
        },
        right: {
          cp1x: baseX + columnEdge.lineFunction.call(start) + bulgeHeightConstant,
          cp2x: baseX + columnEdge.lineFunction.call(start) + bulgeHeightConstant,
          cp1y: start - bulgeWidthConstant,
          cp2y: end + bulgeWidthConstant,
          x: baseX + columnEdge.lineFunction.call(end) + curveConstant,
          y: end,
        },
        left: {
          cp1x: baseX + columnEdge.lineFunction.call(start) + bulgeHeightConstant,
          cp2x: baseX + columnEdge.lineFunction.call(start) + bulgeHeightConstant,
          cp1y: start + bulgeWidthConstant,
          cp2y: end - bulgeWidthConstant,
          x: baseX + columnEdge.lineFunction.call(end) + curveConstant,
          y: end,
        }
      },
      endLobe: {
        upper: {
          cpx: end - curveConstant,
          cpy: baseY + rowEdge.lineFunction.call(end - curveConstant),
          x: end,
          y: baseY + rowEdge.lineFunction.call(end),
        },
        lower: {
          cpx: end + curveConstant,
          cpy: baseY + rowEdge.lineFunction.call(end + curveConstant),
          x: end,
          y: baseY + rowEdge.lineFunction.call(end),
        },
        right: {
          cpx: baseX + columnEdge.lineFunction.call(end - curveConstant),
          cpy: end - curveConstant,
          x: baseX + columnEdge.lineFunction.call(end),
          y: end,
        },
        left: {
          cpx: baseX + columnEdge.lineFunction.call(end + curveConstant),
          cpy: end + curveConstant,
          x: baseX + columnEdge.lineFunction.call(end),
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
    const middleOfPiece = (coordinates.topRight.x - coordinates.topLeft.x) / 2;

    for (let i = coordinates.topLeft.x; i < coordinates.topRight.x; i += 1) {
      const normalisedIndex = i - coordinates.topLeft.x;
      const tabWidthConstant = column.width / 4;

      if (normalisedIndex < (middleOfPiece - tabWidthConstant/2) || normalisedIndex > (middleOfPiece + tabWidthConstant/2)) {
        const adjustmentY = row.topEdge.lineFunction.call(i);
        canvasContext.lineTo(i, baseY + adjustmentY);
      } else if (!tabDrawn) {
        this.drawTab(row, column, i, i+tabWidthConstant, canvasContext, 'upper');
        tabDrawn = true;
      }
    }
  }

  private drawRightEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    let tabDrawn = false;
    const baseX = (column.position+1) * column.width;
    const middleOfPiece = (coordinates.bottomRight.y - coordinates.topRight.y) / 2;

    for (let i = coordinates.topRight.y; i < coordinates.bottomRight.y; i += 1) {
      const normalisedIndex = i - coordinates.topRight.y;
      const tabWidthConstant = row.height / 4;

      if (normalisedIndex < (middleOfPiece - tabWidthConstant/2) || normalisedIndex > (middleOfPiece + tabWidthConstant/2)) {
        const adjustmentX = column.rightEdge.lineFunction.call(i);
        canvasContext.lineTo(baseX + adjustmentX, i);
      } else if (!tabDrawn) {
        this.drawTab(row, column, i, i+tabWidthConstant, canvasContext, 'right');
        tabDrawn = true;
      }
    }
  }

  private drawBottomEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    let tabDrawn = false;
    const baseY = row.height * (row.position+1);
    const middleOfPiece = (coordinates.bottomRight.x - coordinates.bottomLeft.x) / 2

    for (let i = coordinates.bottomRight.x; i > coordinates.bottomLeft.x; i -= 1) {
      const normalisedIndex = i - coordinates.bottomLeft.x;
      const tabWidthConstant = column.width / 4;

      if (normalisedIndex < (middleOfPiece - tabWidthConstant/2) || normalisedIndex > (middleOfPiece + tabWidthConstant/2)) {
        const adjustmentY = row.bottomEdge.lineFunction.call(i);
        canvasContext.lineTo(i, baseY + adjustmentY);
      } else if (!tabDrawn) {
        this.drawTab(row, column, i, i-tabWidthConstant, canvasContext, 'lower');
        tabDrawn = true;
      }
    }
  }

  private drawLeftEdge(column: Column, row: Row, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    let tabDrawn = false;
    const baseX = column.width * column.position;
    const middleOfPiece = (coordinates.bottomLeft.y -  coordinates.topLeft.y) / 2;

    for (let i = coordinates.bottomLeft.y; i > coordinates.topLeft.y; i -= 1) {
      const normalisedIndex = i - coordinates.topLeft.y;
      const tabWidthConstant = row.height / 4;

      if (normalisedIndex < (middleOfPiece - tabWidthConstant/2) || normalisedIndex > (middleOfPiece + tabWidthConstant/2)) {
        const adjustmentX = column.leftEdge.lineFunction.call(i);
        canvasContext.lineTo(baseX + adjustmentX, i);
      } else if (!tabDrawn) {
        this.drawTab(row, column, i, i-tabWidthConstant, canvasContext, 'left');
        tabDrawn = true;
      }
    }
  }
}
