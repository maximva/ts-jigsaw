import Edge from "./edge";

export interface Positional {
  position: number;
}

export default class Row implements Positional {
  position: number;
  height: number;
  readonly topEdge: Edge;
  readonly bottomEdge: Edge;

  constructor(position: number, height: number, topEdge: Edge, bottomEdge: Edge) {
    this.position = position;
    this.height = height;
    this.topEdge = topEdge;
    this.bottomEdge = bottomEdge;
  }
}
