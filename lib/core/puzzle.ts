import Seeds from './seeds'

export default class Puzzle {
  rows: number;
  rowSeeds: number[];

  columns: number;
  columnSeeds: number[];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.rowSeeds = Seeds.generate(rows);

    this.columns = columns;
    this.columnSeeds = Seeds.generate(columns);
  }
}
