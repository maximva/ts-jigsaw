import Seed from "./seed";

/**
 * The mathematical function defining an edge
 */
export default class LineFunction {
  seed: number;
  outsideEdge: boolean;

  constructor(outsideEdge: boolean = false) {
    this.seed = Seed.generate();
    this.outsideEdge = outsideEdge;
  }

  /**
   *
   * @param index
   */
  public call(index: number) : number {
    if (this.outsideEdge) {
      return 0;
    } else {
      return 3 * Math.sin(index / (15 + (this.seed * 20)))
    }
  }
}
