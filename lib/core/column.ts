import LineFunction from "./lineFunction";

export default class Column {
  position: number;
  width: number;
  protected readonly _leftEdge: LineFunction;
  protected readonly _rightEdge: LineFunction;

  constructor(position: number, width: number, leftEdge: LineFunction, rightEdge: LineFunction) {
    this.position = position;
    this.width = width;
    this._leftEdge = leftEdge;
    this._rightEdge = rightEdge;
  }

  public get leftEdge() {
    return this._leftEdge;
  }

  public get rightEdge() {
    return this._rightEdge;
  }

}
