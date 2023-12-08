import { camelToUnderscore, obfuscateToken } from '../string';

describe('string utils', () => {
  describe('camelToUnderscore', () => {
    it('', () => {
      // @ts-expect-error
      expect(() => camelToUnderscore(null)).toThrow('Input is not a string');
      // @ts-expect-error
      expect(() => camelToUnderscore(undefined)).toThrow('Input is not a string');
      // @ts-expect-error
      expect(() => camelToUnderscore({})).toThrow('Input is not a string');
      // @ts-expect-error
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

  describe('obfuscateToken', () => {
    it('should return null when token is null', () => {
      const result = obfuscateToken(null);
      expect(result).toBeNull();
    });

    it('should return undefined when token is undefined', () => {
      const result = obfuscateToken(undefined);
      expect(result).toBeUndefined();
    });

    it('should obfuscate the token by replacing characters after the first part with "xxxxxx"', () => {
      const token = '12345-67890-abcdef';
      const result = obfuscateToken(token);
      expect(result).toBe('12345-xxxxxx-xxxxxx');
    });

    it('should handle tokens with a single part', () => {
      const token = 'singlepart';
      const result = obfuscateToken(token);
      expect(result).toBe('singlepart');
    });

    it('should handle tokens with two parts', () => {
      const token = 'part1-part2';
      const result = obfuscateToken(token);
      expect(result).toBe('part1-xxxxxx');
    });
  });
});
