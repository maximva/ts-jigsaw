import LineFunction from "./lineFunction";
import Seeds from "./seeds";

export default class Coordinate {
  private readonly _x: number;
  private readonly _y: number;

  public constructor(rowsBefore: number, columnsBefore: number, rowHeight: number, columnWidth: number) {
    const baseX = columnsBefore * columnWidth;
    const baseY = rowsBefore * rowHeight;
    const adjustmentX = (baseX === 0 || baseX === 700)
      ? 0
      : LineFunction.call(baseY, Seeds.getColumnSeeds()[columnsBefore - 1])
    const adjustmentY = (baseY === 0 || baseY === 466)
      ? 0
      : LineFunction.call(baseX, Seeds.getRowSeeds()[rowsBefore - 1])
    this._x = baseX + adjustmentX;
    this._y = baseY + adjustmentY;
  }

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }
}
