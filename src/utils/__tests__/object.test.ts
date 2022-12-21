import { convertKeysFromCamelToUnderscore } from "../object";
describe('object utils', () => {
  describe('convertKeysFromCamelToUnderscore', () => {
    it('should throw an error when input is not an object', () => {
      const msg = 'Input is not an object';
      expect(() => convertKeysFromCamelToUnderscore(true)).toThrow(msg);
      expect(() => convertKeysFromCamelToUnderscore(null)).toThrow(msg);
      expect(() => convertKeysFromCamelToUnderscore(undefined)).toThrow(msg);
      expect(() => convertKeysFromCamelToUnderscore([])).toThrow(msg);
      expect(() => convertKeysFromCamelToUnderscore('some-string')).toThrow(msg);
    });
    it('should convert camel-cased keys to underscore', () => {
      let value = Math.random();
      expect(convertKeysFromCamelToUnderscore({
        LoremIpsum: value
      })).toEqual({
        lorem_ipsum: value
      });
      value = Math.random();
      expect(convertKeysFromCamelToUnderscore({
        loremIpsum: value
      })).toEqual({
        lorem_ipsum: value
      });
      value = Math.random();
      expect(convertKeysFromCamelToUnderscore({
        'lorem-ipsum': value
      })).toEqual({
        'lorem-ipsum': value
      });
      value = Math.random();
      expect(convertKeysFromCamelToUnderscore({
        L123: value
      })).toEqual({
        l123: value
      });
    });
    it('should handle multi-leveled object', () => {
      const value = Math.random();
      expect(convertKeysFromCamelToUnderscore({
        LoremIpsum: {
          DoloreSit: {
            Amet: value
          },
          regular: 'reg'
        }
      })).toEqual({
        lorem_ipsum: {
          dolore_sit: {
            amet: value
          },
          regular: 'reg'
        }
      });
      expect(convertKeysFromCamelToUnderscore({
        LoremIpsum: {
          DoloreSit: {
            Amet: [value]
          },
          regular: ['something']
        }
      })).toEqual({
        lorem_ipsum: {
          dolore_sit: {
            amet: [value]
          },
          regular: ['something']
        }
      });
    });
  });
});