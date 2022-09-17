import Edge from "./edge";

export default class Row {
  readonly position: number;
  readonly height: number;
  readonly topEdge: Edge;
  readonly bottomEdge: Edge;

  constructor(position: number, height: number, topEdge: Edge, bottomEdge: Edge) {
    this.position = position;
    this.height = height;
    this.topEdge = topEdge;
    this.bottomEdge = bottomEdge;
  }
}
