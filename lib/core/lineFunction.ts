/**
 * The mathematical function defining an edge
 */
export default class LineFunction {
  private seed: number;
  private outsideEdge: boolean;
  private craziness: number;
  private amplitude: number = 4;

  /**
   *
   * @param outsideEdge
   * @param craziness
   */
  constructor(outsideEdge: boolean = false, craziness: number = 2) {
    this.seed = Math.random();
    this.outsideEdge = outsideEdge;
    this.craziness = craziness; // 0 == straight edges
  }

  /**
   *
   * @param index
   */
  public call(index: number) : number {
    if (this.outsideEdge) {
      return 0;
    } else {
      return this.craziness * this.amplitude * Math.sin((index / (15 + (this.seed * 20))) / 4);
    }
  }
}
