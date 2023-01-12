// eslint-disable-next-line no-magic-numbers
export function stringifyFormatted(object, JSON_STRINGIFY_INDENT = 2) {
  return JSON.stringify(object, undefined, JSON_STRINGIFY_INDENT);
}

