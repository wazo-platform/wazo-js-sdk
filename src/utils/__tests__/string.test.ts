import { camelToUnderscore } from '../string';

describe('string utils', () => {
  describe('camelToUnderscore', () => {
    it('', () => {
      expect(() => camelToUnderscore(null)).toThrow('Input is not a string');
      expect(() => camelToUnderscore(undefined)).toThrow('Input is not a string');
      expect(() => camelToUnderscore({})).toThrow('Input is not a string');
      expect(() => camelToUnderscore([])).toThrow('Input is not a string');
    });
    it('should convert camel-cased string to underscore', () => {
      expect(camelToUnderscore('loremIpsum')).toEqual('lorem_ipsum');
      expect(camelToUnderscore('lorem-ipsum')).toEqual('lorem-ipsum');
      expect(camelToUnderscore('')).toEqual('');
    });
    it('should not prefix string with an underscore', () => {
      expect(camelToUnderscore('LoremIpsum')).toEqual('lorem_ipsum');
      expect(camelToUnderscore('L123')).toEqual('l123');
    });
  });
});
