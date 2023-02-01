export const JSONStringifySorted = (o={}) =>
  JSON.stringify(o, Object.keys(o).sort());
