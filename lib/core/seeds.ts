/**
 * Seeds are the numbers used to have random shaped lines
 * in the puzzle
 */
export default class Seeds {
  /**
   * Generates an array of n random numbers
   * @param n
   */
  static generate(n: number) : number[]{
    return Array.from(
      {length: n},
      () => Math.random()
    );
  }
}
