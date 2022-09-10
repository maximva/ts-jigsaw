import Tab from '../../../lib/core/tab';

describe('Tab class', () => {
  const segmentLength = 10;
  const tab = new Tab(segmentLength);

  it('Should instantiate startCurveDiameter with correct value', () => {
    const curveBase = segmentLength / 20;
    const expectedStartCurveDiameterMinimum: number = curveBase;
    const expectedStartCurveDiameterMaximum: number = curveBase*3;
    expect(tab.startCurveDiameter).toBeGreaterThanOrEqual(expectedStartCurveDiameterMinimum);
    expect(tab.startCurveDiameter).toBeLessThanOrEqual(expectedStartCurveDiameterMaximum);
  });

  it('Should instantiate endCurveDiameter with correct value', () => {
    const curveBase = segmentLength / 20;
    const expectedEndCurveDiameterMinimum: number = curveBase;
    const expectedEndCurveDiameterMaximum: number = curveBase*3;
    expect(tab.endCurveDiameter).toBeGreaterThanOrEqual(expectedEndCurveDiameterMinimum);
    expect(tab.endCurveDiameter).toBeLessThanOrEqual(expectedEndCurveDiameterMaximum);
  });

  it('Should instantiate mainLobeWidth with correct value', () => {
    const lobeWidthBase = segmentLength / 8;
    const expectedMainLobeWidthMinimum: number = lobeWidthBase;
    const expectedMainLobeWidthMaximum: number = lobeWidthBase*1.25;
    expect(tab.mainLobeWidth).toBeGreaterThanOrEqual(expectedMainLobeWidthMinimum);
    expect(tab.mainLobeWidth).toBeLessThanOrEqual(expectedMainLobeWidthMaximum);
  });

  it('Should instantiate mainLobeHeight with correct value', () => {
    const lobeHeightBase = segmentLength / 3;
    const expectedMainLobeHeightMinimum: number = lobeHeightBase;
    const expectedMainLobeHeightMaximum: number = lobeHeightBase*1.25;
    expect(tab.mainLobeHeight).toBeGreaterThanOrEqual(expectedMainLobeHeightMinimum);
    expect(tab.mainLobeHeight).toBeLessThanOrEqual(expectedMainLobeHeightMaximum);
  });

  it('Should add 50% up and 50% down tabs', () => {
    let amountUpOrForward = 0;
    for (let i = 0; i < 100; i += 1) {
      const tabDirection = new Tab(100);
      if (tabDirection.upOrForward) {
        amountUpOrForward += 1;
      }
    }
    expect(amountUpOrForward).toBeGreaterThan(40);
    expect(amountUpOrForward).toBeLessThan(60);
  });
});
