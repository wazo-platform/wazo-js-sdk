import { getDisplayableNumber, getCallableNumber } from '../PhoneNumberUtil';

describe('Formatting phone numbers', () => {
  it('should not format all phone numbers', () => {
    expect(getDisplayableNumber('*143450', 'FR')).toBe('*143450');
    expect(getDisplayableNumber('*10', 'US')).toBe('*10');
    expect(getDisplayableNumber('#23445433', 'DE')).toBe('#23445433');
  });

  it('should format real phone numbers', () => {
    expect(getDisplayableNumber('+33675456545', 'FR')).toBe('06 75 45 65 45');
    expect(getDisplayableNumber('0675456545', 'FR')).toBe('06 75 45 65 45');
    expect(getDisplayableNumber('+33675456545', 'US')).toBe('06 75 45 65 45');
    expect(getDisplayableNumber('0675456545', 'US')).toBe('0675456545');
    expect(getDisplayableNumber('4188884356', 'US')).toBe('(418) 888-4356');
  });

  it('should format real phone numbers when typing', () => {
    expect(getDisplayableNumber('+3367545', 'FR', true)).toBe('+33 6 75 45');
    expect(getDisplayableNumber('067545', 'FR', true)).toBe('06 75 45');
    expect(getDisplayableNumber('+3367545', 'US', true)).toBe('+33 6 75 45');
    expect(getDisplayableNumber('067545', 'US', true)).toBe('067545');
    expect(getDisplayableNumber('418808', 'US', true)).toBe('418-808');
  });
});

describe('getCallableNumber', () => {
  it('works with a country', () => {
    expect(getCallableNumber('+33 6 75 45 12 34', 'FR')).toBe('0675451234');
    expect(getCallableNumber('06 75 45 12 34', 'FR')).toBe('0675451234');
    expect(getCallableNumber('+1-202-555-0147', 'US')).toBe('2025550147');
    expect(getCallableNumber('202-555-0113', 'US')).toBe('2025550113');
    expect(getCallableNumber('8008', 'US')).toBe('8008');
    expect(getCallableNumber('80.08', 'US')).toBe('8008');
    expect(getCallableNumber('*10', 'US')).toBe('*10');
    expect(getCallableNumber('9000', 'US')).toBe('9000');
  });
  it('works without a country', () => {
    expect(getCallableNumber('06 75 45')).toBe('067545');
    expect(getCallableNumber('067-545')).toBe('067545');
    expect(getCallableNumber('8008')).toBe('8008');
    expect(getCallableNumber('80.08')).toBe('8008');
    expect(getCallableNumber('*10')).toBe('*10');
    expect(getCallableNumber('9000')).toBe('9000');
  });
});
