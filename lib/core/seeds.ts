/**
 * Seeds are the numbers used to have random shaped lines
 * in the puzzle
 */
export default class Seeds {
  private static instance: Seeds;

  private readonly rowSeeds: number[] = [];
  private readonly columnsSeeds: number[] = [];

  private constructor(rows: number, columns: number) {
    this.rowSeeds = this.generate(rows);
    this.columnsSeeds = this.generate(columns);
  }

  public static initialize(rows: number, columns: number) {
    if (Seeds.instance) {
      console.warn('Seeds have already been initialized, ' +
        'the original set of seeds is still in use.');
      return;
    }
    Seeds.instance = new Seeds(rows, columns);
  }

  public static getRowSeeds() {
    return this.instanceExists() ? Seeds.instance.rowSeeds : [];
  }

  public static getColumnSeeds() {
    return this.instanceExists() ? Seeds.instance.columnsSeeds : [];
  }

  private static instanceExists(): boolean {
    if (!Seeds.instance) {
      console.warn('Seeds has not been initialized yet,' +
        'there are no seeds available.');
      return false;
    }
    return true;
  }

  /**
   * Generates an array of n random numbers
   * @param n
   */
  private generate(n: number) : number[]{
    return Array.from(
      {length: n},
      () => Math.random()
    );
  }
}
