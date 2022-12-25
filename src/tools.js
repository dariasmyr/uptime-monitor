function stringify(object) {
  const JSON_STRINGIFY_INDENT = 2;
  return JSON.stringify(object, undefined, JSON_STRINGIFY_INDENT);
}

module.exports = {
  stringify
};
