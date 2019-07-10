import compareVersions from '../compare-version';

describe('Comparing versions', () => {
  it('should compare non semver versions', () => {
    expect(compareVersions('1.0', '1.0')).toBe(0);
    expect(compareVersions('0.10', '0.9')).toBeGreaterThan(0);
    expect(compareVersions('0.10', '0.11')).toBeLessThan(0);
    expect(compareVersions('0.10', '0.1')).toBeGreaterThan(0);
    expect(compareVersions('19.10', '19.1')).toBeGreaterThan(0);
  });
});
