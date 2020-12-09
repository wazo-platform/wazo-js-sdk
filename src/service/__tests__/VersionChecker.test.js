/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
import VersionChecker from '../VersionChecker';

const key = 'web-desktop';
VersionChecker.setKey(key);

describe('VersionChecker', () => {
  it('should return true when no version found', async () => {
    expect(await VersionChecker.canAccess('1.2.3', '4.5.6')).toBe(true);

    VersionChecker.versions = { '1.2.5': {} };

    expect(await VersionChecker.canAccess('1.2.3', '4.5.6')).toBe(true);

    VersionChecker.versions = { '1.2.3': {} };
    expect(await VersionChecker.canAccess('1.2.3', '4.5.6')).toBe(true);

    VersionChecker.versions = { '1.2.3': { mobile: { min: '4.5.6' } } };
    expect(await VersionChecker.canAccess('1.2.3', '4.5.6')).toBe(true);
  });

  it('should handle version when min is set', async () => {
    VersionChecker.versions = { '1.2.3': { [key]: { min: '4.5.6' } } };

    expect(await VersionChecker.canAccess('1.2.3', '5.5.2')).toBe(true);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.6')).toBe(true);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.7-rc.0')).toBe(true);

    expect(await VersionChecker.canAccess('1.2.3', '4.5.6-rc.0')).toBe(false);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.5')).toBe(false);
    expect(await VersionChecker.canAccess('1.2.3', '2.4.5-rc.2')).toBe(false);
  });

  it('should handle version when max is set', async () => {
    VersionChecker.versions = { '1.2.3': { [key]: { max: '4.5.6' } } };

    expect(await VersionChecker.canAccess('1.2.3', '5.5.2')).toBe(false);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.7-rc.0')).toBe(false);

    expect(await VersionChecker.canAccess('1.2.3', '4.5.6')).toBe(true);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.6-rc.0')).toBe(true);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.5')).toBe(true);
    expect(await VersionChecker.canAccess('1.2.3', '2.4.5-rc.2')).toBe(true);
  });

  it('should handle version when min and max is set', async () => {
    VersionChecker.versions = { '1.2.3': { [key]: { min: '4.5.3', max: '4.5.6' } } };

    expect(await VersionChecker.canAccess('1.2.3', '5.5.2')).toBe(false);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.7-rc.0')).toBe(false);

    expect(await VersionChecker.canAccess('1.2.3', '4.5.6')).toBe(true);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.6-rc.0')).toBe(true);
    expect(await VersionChecker.canAccess('1.2.3', '4.5.5')).toBe(true);

    expect(await VersionChecker.canAccess('1.2.3', '4.5.3-rc.2')).toBe(false);
  });
});
