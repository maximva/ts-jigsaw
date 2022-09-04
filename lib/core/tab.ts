export default class Tab {
  // Start and end are defined here as going from left to right

  // The half circle that starts at the edge of the piece, and goes to the start
  // of the main lobe of the tab
  readonly startCurveDiameter: number;

  // The half circle that goes from the end of the main lobe of the tab to the edge
  // of the piece
  readonly endCurveDiameter: number;

  // The width of the main lobe of the tab
  readonly mainLobeWidth: number;

  // The height of the main lob of the tab
  readonly mainLobeHeight: number;

  constructor(segmentLength: number) {
    const curveBase = segmentLength / 20;
    const lobeWidthBase = segmentLength / 8;
    const lobeHeightBase = segmentLength / 3;
    this.startCurveDiameter = curveBase + Math.floor(Math.random() * curveBase * 2);
    this.endCurveDiameter = curveBase + Math.floor(Math.random() * curveBase * 2);
    this.mainLobeWidth = lobeWidthBase + Math.floor(Math.random() *  lobeWidthBase / 4);
    this.mainLobeHeight = lobeHeightBase + Math.floor(Math.random() * lobeHeightBase / 4);
  }
}
