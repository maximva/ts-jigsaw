import Column from "../../core/column";
import Row from "../../core/row";
import Coordinates from "../../core/coordinates";
import Edge from "../../core/edge";
import Tab from "../../core/tab";

enum SHAPING_AXES { X, Y}
enum EDGES { TOP = 'top', RIGHT = 'right', BOTTOM = 'bottom', LEFT = 'left' }

interface edge {
  [key: string]: number;
}

interface lobe {
  [key: string]: edge;
}

interface tabTranslationType {
  [key: string]: lobe;
}

export default class CanvasEdgeRenderer {
  private row: Row;
  private column: Column;
  private coordinates: Coordinates;
  private canvasContext: CanvasRenderingContext2D;

  constructor(row: Row, column: Column, coordinates: Coordinates, canvasContext: CanvasRenderingContext2D) {
    this.row = row;
    this.column = column;
    this.coordinates = coordinates;
    this.canvasContext = canvasContext;
  }

  public renderEdges() {
    this.top();
    this.right();
    this.bottom();
    this.left();
  }

  private top() {
    const lengthOfPiece = this.coordinates.topRight.x - this.coordinates.topLeft.x
    const indexesToDraw = Array.from({length: lengthOfPiece}, (value, index) => this.coordinates.topLeft.x + index);
    const baseY = this.row.height * this.row.position;
    this.render(EDGES.TOP, indexesToDraw, this.row.topEdge, baseY, SHAPING_AXES.Y, this.column.position, this.coordinates.topCenter);
  }

  private right() {
    const lengthOfPiece = this.coordinates.bottomRight.y - this.coordinates.topRight.y;
    const indexesToDraw = Array.from({length: lengthOfPiece}, (value, index) => this.coordinates.topRight.y + index);
    const baseX = (this.column.position+1) * this.column.width;
    this.render(EDGES.RIGHT, indexesToDraw, this.column.rightEdge, baseX, SHAPING_AXES.X, this.row.position, this.coordinates.rightCenter);
  }

  private bottom() {
    const lengthOfPiece = this.coordinates.bottomRight.x - this.coordinates.bottomLeft.x;
    const indexesToDraw = Array.from({length: lengthOfPiece}, (value, index) => this.coordinates.bottomLeft.x + index).reverse();
    const baseY = this.row.height * (this.row.position+1);
    this.render(EDGES.BOTTOM, indexesToDraw, this.row.bottomEdge, baseY, SHAPING_AXES.Y, this.column.position, this.coordinates.bottomCenter);
  }

  private left() {
    const lengthOfPiece = this.coordinates.bottomLeft.y - this.coordinates.topLeft.y;
    const indexesToDraw = Array.from({length: lengthOfPiece}, (value, index) => this.coordinates.topLeft.y + index).reverse();
    const baseX = this.column.width * this.column.position;
    this.render(EDGES.LEFT, indexesToDraw, this.column.leftEdge, baseX, SHAPING_AXES.X, this.row.position, this.coordinates.leftCenter);
  }

  private render(edgeName: EDGES, indexesToDraw: number[], edge: Edge, base: number, shapingAxes: SHAPING_AXES, edgeSection: number, middleOfPiece: number) {
    let tabDrawn = false;
    const tab = edge.tabs[edgeSection];
    const incrementingEdge = edgeName === EDGES.TOP || edgeName === EDGES.RIGHT;
    indexesToDraw.forEach((i) => {
      const beforeTab = incrementingEdge ? i < (middleOfPiece - tab.mainLobeWidth) : i > (middleOfPiece + tab.mainLobeWidth);
      const afterTab = incrementingEdge ? i > (middleOfPiece + tab.mainLobeWidth) : i < (middleOfPiece - tab.mainLobeWidth);
      const end = incrementingEdge ? i + tab.mainLobeWidth*2 : i - tab.mainLobeWidth*2;
      if (edge.outsideEdge || beforeTab || afterTab) {
        const adjustment = edge.lineFunction.call(i);
        const x = shapingAxes === SHAPING_AXES.X ? base + adjustment : i;
        const y = shapingAxes === SHAPING_AXES.Y ? base + adjustment : i;
        this.canvasContext.lineTo(x, y);
      } else if (!tabDrawn) {
        this.renderTab(edgeName, i, end, tab, base, edge);
        tabDrawn = true;
      }
    })
  }

  private renderTab(edgeName: EDGES, start: number, end: number, tab: Tab, base: number, edge: Edge) {
    const tabOrientationTranslation: tabTranslationType = {
      startLobe: {
        top: {
          cpx: start + tab.startCurveDiameter,
          cpy: base + edge.lineFunction.call(start + tab.startCurveDiameter),
          x: start,
          y: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.startCurveDiameter : -tab.startCurveDiameter), // +curveconstant for down, - for up
        },
        bottom: {
          cpx: start - tab.endCurveDiameter,
          cpy: base + edge.lineFunction.call(start - tab.endCurveDiameter),
          x: start,
          y: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.endCurveDiameter : -tab.endCurveDiameter),
        },
        right: {
          cpx: base + edge.lineFunction.call(start + tab.startCurveDiameter),
          cpy: start + tab.startCurveDiameter,
          x: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.startCurveDiameter : -tab.startCurveDiameter),
          y: start,
        },
        left: {
          cpx: base + edge.lineFunction.call(start - tab.endCurveDiameter),
          cpy: start - tab.endCurveDiameter,
          x: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.endCurveDiameter : -tab.endCurveDiameter),
          y: start,
        }
      },
      middleLobe: {
        top: {
          cp1x: start - tab.mainLobeWidth,
          cp2x: end + tab.mainLobeWidth,
          cp1y: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          cp2y: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          x: end,
          y: base + edge.lineFunction.call(end) + (tab.upOrForward ? tab.endCurveDiameter : -tab.endCurveDiameter),
        },
        bottom: {
          cp1x: start + tab.mainLobeWidth,
          cp2x: end - tab.mainLobeWidth,
          cp1y: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          cp2y: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          x: end,
          y: base + edge.lineFunction.call(end) + (tab.upOrForward ? tab.startCurveDiameter : -tab.startCurveDiameter),
        },
        right: {
          cp1x: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          cp2x: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          cp1y: start - tab.mainLobeWidth,
          cp2y: end + tab.mainLobeWidth,
          x: base + edge.lineFunction.call(end) + (tab.upOrForward ? tab.endCurveDiameter : -tab.endCurveDiameter),
          y: end,
        },
        left: {
          cp1x: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          cp2x: base + edge.lineFunction.call(start) + (tab.upOrForward ? tab.mainLobeHeight : -tab.mainLobeHeight),
          cp1y: start + tab.mainLobeWidth,
          cp2y: end - tab.mainLobeWidth,
          x: base + edge.lineFunction.call(end) + (tab.upOrForward ? tab.startCurveDiameter : -tab.startCurveDiameter),
          y: end,
        }
      },
      endLobe: {
        top: {
          cpx: end - tab.endCurveDiameter,
          cpy: base + edge.lineFunction.call(end - tab.endCurveDiameter),
          x: end,
          y: base + edge.lineFunction.call(end),
        },
        bottom: {
          cpx: end + tab.startCurveDiameter,
          cpy: base + edge.lineFunction.call(end + tab.startCurveDiameter),
          x: end,
          y: base + edge.lineFunction.call(end),
        },
        right: {
          cpx: base + edge.lineFunction.call(end - tab.endCurveDiameter),
          cpy: end - tab.endCurveDiameter,
          x: base + edge.lineFunction.call(end),
          y: end,
        },
        left: {
          cpx: base + edge.lineFunction.call(end + tab.startCurveDiameter),
          cpy: end + tab.startCurveDiameter,
          x: base + edge.lineFunction.call(end),
          y: end,
        }
      }
    }

    // First lobe
    this.canvasContext.quadraticCurveTo(
      tabOrientationTranslation.startLobe[edgeName].cpx,
      tabOrientationTranslation.startLobe[edgeName].cpy,
      tabOrientationTranslation.startLobe[edgeName].x,
      tabOrientationTranslation.startLobe[edgeName].y,
    );
    // Middle lobe
    this.canvasContext.bezierCurveTo(
      tabOrientationTranslation.middleLobe[edgeName].cp1x,
      tabOrientationTranslation.middleLobe[edgeName].cp1y,
      tabOrientationTranslation.middleLobe[edgeName].cp2x,
      tabOrientationTranslation.middleLobe[edgeName].cp2y,
      tabOrientationTranslation.middleLobe[edgeName].x,
      tabOrientationTranslation.middleLobe[edgeName].y,
    );
    // End lobe
    this.canvasContext.quadraticCurveTo(
      tabOrientationTranslation.endLobe[edgeName].cpx,
      tabOrientationTranslation.endLobe[edgeName].cpy,
      tabOrientationTranslation.endLobe[edgeName].x,
      tabOrientationTranslation.endLobe[edgeName].y,
    );
  }
}
