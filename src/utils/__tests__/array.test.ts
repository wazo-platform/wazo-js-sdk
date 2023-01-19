import { lastIndexOf } from '../array';

describe('Finding last index of an array of object', () => {
  const array = [{
    a: 1,
    b: 3,
  }, {
    a: 1,
    b: 2,
  }, {
    a: 1,
    b: 3,
  }];
  it('should compare non semver versions', () => {
    expect(lastIndexOf(array, elem => elem.a === 1 && elem.b === 3)).toBe(2);
    expect(lastIndexOf(array, elem => elem.a === 1)).toBe(2);
    expect(lastIndexOf(array, elem => elem.a === 4)).toBe(-1);
  });
});
