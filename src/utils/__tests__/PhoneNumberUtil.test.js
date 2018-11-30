import { getDisplayableNumber } from '../PhoneNumberUtil';

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
    expect(getDisplayableNumber('0675456545', 'US')).toBe('(067) 545-6545');
  });

  it('should format real phone numbers when typing', () => {
    expect(getDisplayableNumber('+3367545', 'FR', true)).toBe('+33 6 75 45');
    expect(getDisplayableNumber('067545', 'FR', true)).toBe('06 75 45');
    expect(getDisplayableNumber('+3367545', 'US', true)).toBe('+33 6 75 45');
    expect(getDisplayableNumber('067545', 'US', true)).toBe('067-545');
  });
});
