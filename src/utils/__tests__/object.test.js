import { convertKeysFromCamelToUnderscore } from '../object';

describe('object utils', () => {
  describe('convertKeysFromCamelToUnderscore', () => {
    it('should throw an error when input is not an object', () => {
      const msg = 'Input is not an object';
      expect(convertKeysFromCamelToUnderscore).toThrow(msg);
      expect(() => convertKeysFromCamelToUnderscore(true)).toThrow(msg);
      expect(() => convertKeysFromCamelToUnderscore('some-string')).toThrow(msg);
    });

    it('should convert camel-cased keys to underscore', () => {
      let value = Math.random();
      expect(convertKeysFromCamelToUnderscore({ LoremIpsum: value })).toEqual({ _lorem_ipsum: value });
      value = Math.random();
      expect(convertKeysFromCamelToUnderscore({ loremIpsum: value })).toEqual({ lorem_ipsum: value });
      value = Math.random();
      expect(convertKeysFromCamelToUnderscore({ 'lorem-ipsum': value })).toEqual({ 'lorem-ipsum': value });
      value = Math.random();
      expect(convertKeysFromCamelToUnderscore({ L123: value })).toEqual({ _l123: value });
    });

    it('should handle multi-leveled object', () => {
      const value = Math.random();
      expect(convertKeysFromCamelToUnderscore({ LoremIpsum: { DoloreSit: { Amet: value }, regular: 'reg' } }))
        .toEqual({ _lorem_ipsum: { _dolore_sit: { _amet: value }, regular: 'reg' } });
    });
  });
});
