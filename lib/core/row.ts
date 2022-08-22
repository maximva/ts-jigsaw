import LineFunction from "./lineFunction";

export default class Row {
  position: number;
  height: number;
  protected readonly _topEdge: LineFunction;
  protected readonly _bottomEdge: LineFunction;

  constructor(position: number, height: number, topEdge: LineFunction, bottomEdge: LineFunction) {
    this.position = position;
    this.height = height;
    this._topEdge = topEdge;
    this._bottomEdge = bottomEdge;
  }

  public get topEdge() {
    return this._topEdge;
  }

  public get bottomEdge() {
    return this._bottomEdge;
  }
}
