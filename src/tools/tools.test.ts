import { stringifyFormatted } from './tools';

describe('Tools', () => {
  test('should stringify object', () => {
    const object = {
      a: 1,
      b: 2,
    };
    const INDENT = 2;
    const result = stringifyFormatted(object, INDENT);
    const expected = JSON.stringify(object, undefined, INDENT);
    expect(result).toBe(expected);
  });
});
