import LineFunction from "./lineFunction";
import Tab from "./tab";

export default class Edge {
  readonly outsideEdge: boolean;
  readonly lineFunction: LineFunction;
  readonly tabs: Tab[];

  constructor(edgeLength: number, edgeSegments: number, outsideEdge: boolean) {
    this.outsideEdge = outsideEdge;
    this.lineFunction = new LineFunction(outsideEdge);
    this.tabs = Edge.generateTabs(edgeLength, edgeSegments);
  }

  private static generateTabs(edgeLength: number, amount: number) :Tab[] {
    let generatedTabs: Tab[] = [];
    for (let i = 0; i < amount; i += 1) {
      const segmentLength = edgeLength / amount
      generatedTabs.push(new Tab(segmentLength));
    }
    return generatedTabs;
  }
}
