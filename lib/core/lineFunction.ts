/**
 * The mathematical function defining an edge
 */
export default class LineFunction {
  seed: number;
  outsideEdge: boolean;
  craziness: number;

  constructor(outsideEdge: boolean = false) {
    this.seed = Math.random();
    this.outsideEdge = outsideEdge;
    this.craziness = 2; // 0 == straight edges
  }

  /**
   *
   * @param index
   */
  public call(index: number) : number {
    if (this.outsideEdge) {
      return 0;
    } else {
      return this.craziness * 4 * Math.sin((index / (15 + (this.seed * 20))) / 4);
    }
  }
}
