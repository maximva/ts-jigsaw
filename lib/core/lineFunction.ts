/**
 *
 */
export default class LineFunction {
  /**
   *
   * @param index
   * @param seed
   */
  static call(index: number, seed: number) : number {
    return 3*Math.sin(
      index/(15 + (seed * 20))
    )
  }
}
