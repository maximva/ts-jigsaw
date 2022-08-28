import Edge from "./edge";

export default class Column {
  readonly position: number;
  readonly width: number;
  readonly leftEdge: Edge;
  readonly rightEdge: Edge;

  constructor(position: number, width: number, leftEdge: Edge, rightEdge: Edge) {
    this.position = position;
    this.width = width;
    this.leftEdge = leftEdge;
    this.rightEdge = rightEdge;
  }
}
