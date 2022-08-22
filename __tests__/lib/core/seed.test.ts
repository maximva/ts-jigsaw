import Seed from '../../../lib/core/seed';

describe('Seed', () => {
  it('should return a value between 0 and 1', () => {
    expect(Seed.generate()).toBeGreaterThanOrEqual(0);
    expect(Seed.generate()).toBeLessThanOrEqual(1);
  });
});
