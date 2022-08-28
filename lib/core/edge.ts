import LineFunction from "./lineFunction";
import Tab from "./tab";

export default class Edge {
  readonly lineFunction: LineFunction;
  readonly tabs: Tab[];

  constructor(edgeSegments: number, outsideEdge: boolean) {
    this.lineFunction = new LineFunction(outsideEdge);
    this.tabs = Edge.generateTabs(edgeSegments);
  }

  private static generateTabs(amount: number) :Tab[] {
    let generatedTabs: Tab[] = [];
    for (let i = 0; i < amount; i += 1) {
      generatedTabs.push(new Tab());
    }
    return generatedTabs;
  }
}
