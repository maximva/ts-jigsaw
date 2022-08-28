export default class Tab {
  // Start and end are defined here as going from left to right

  // The half circle that starts at the edge of the piece, and goes to the start
  // of the main lobe of the tab
  private readonly startCurveDiameter: number;

  // The half circle that goes from the end of the main lobe of the tab to the edge
  // of the piece
  private readonly endCurveDiameter: number;

  // The width of the main lobe of the tab
  private readonly mainLobeWidth: number;

  // The height of the main lob of the tab
  private readonly mainLobeHeight: number;

  constructor() {
    this.startCurveDiameter = 2 + Math.floor(Math.random() * 3);
    this.endCurveDiameter = 2 + Math.floor(Math.random() * 3);
    this.mainLobeWidth = 7 + Math.floor(Math.random() * 2);
    this.mainLobeHeight = 17 + Math.floor(Math.random() * 4);
  }
}
