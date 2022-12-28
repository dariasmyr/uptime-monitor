const {stringify} = require('./tools');

describe('Tools', () => {
  test('should stringify object', () => {
    const object = {
      a: 1,
      b: 2
    };
    const result = stringify(object);
    // eslint-disable-next-line no-magic-numbers
    const expected = JSON.stringify(object, undefined, 2);
    expect(result).toBe(expected);
  });
});
