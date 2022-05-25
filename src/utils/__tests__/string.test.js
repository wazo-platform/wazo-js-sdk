import { camelToUnderscore } from '../string';

describe('string utils', () => {
  describe('camelToUnderscore', () => {
    it('should convert camel-cased string to underscore', () => {
      expect(camelToUnderscore('LoremIpsum')).toEqual('_lorem_ipsum');
      expect(camelToUnderscore('loremIpsum')).toEqual('lorem_ipsum');
      expect(camelToUnderscore('lorem-ipsum')).toEqual('lorem-ipsum');
      expect(camelToUnderscore('')).toEqual('');
      expect(camelToUnderscore('L123')).toEqual('_l123');
    });
  });
});
