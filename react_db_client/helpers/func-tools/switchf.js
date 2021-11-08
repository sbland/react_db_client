/**
 *
 * @param {string} c // called case
 * @param {object} obj // Cases
 * @param {function} default // default
 */
export const switchF = (c, options, def) => {
  const activeCaseList = Object.keys(options)
    .filter((key) => {
      if (Array.isArray(key)) {
        return key.indexOf(c) >= 0;
      }
      if (typeof key === 'function') {
        return key(c);
      }
      return key === c;
    })
    .map((key) => options[key]);
  if (activeCaseList.length === 0 && def) return def();
  const activeCase = activeCaseList[0];
  if (typeof activeCase === 'function') return activeCase();
  if (typeof activeCase === 'string' && options[activeCase])
    return options[activeCase]();
  throw Error('switch F Failed!');
};
