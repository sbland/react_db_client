/**
 *
 * @param {string} c // called case
 * @param {object} obj // Cases
 * @param {function} default // default
 */
export const switchF = <KeyType extends string | number | symbol, OutputType>(
  c: KeyType,
  options: Record<KeyType, string | (() => OutputType)>,
  def: null | (() => OutputType) = null
): OutputType => {
  const activeCaseList: (string | (() => OutputType))[] = Object.keys(options)
    .map((k) => k as KeyType)
    .filter((key) => {
      if (Array.isArray(key)) {
        return key.indexOf(c) >= 0;
      }
      // if (typeof key === 'function') {
      //   return key(c);
      // }
      return key === c;
    })
    .map((key) => options[key]);
  if (activeCaseList.length === 0 && def) return def();
  const activeCase = activeCaseList[0];
  if (typeof activeCase === 'function') return activeCase();
  if (typeof activeCase === 'string' && options[activeCase as string])
    return options[activeCase as string]();
  throw Error('switch F Failed!');
};

/**
 * Alternate switch that allows lambda patterns as keys
 *
 * @param {any} c
 * @param {Array[Array[
 * pattern,
 * value {function | strpattern}
 * ]]} options
 * @param {function} def
 * @returns
 */
export const switchFLam = <KeyType extends string | number | symbol | Function, OutputType>(
  c: KeyType,
  options: [KeyType, KeyType | (() => OutputType)][],
  def: () => OutputType
) => {
  const choice = options.find(([key]) => {
    if (Array.isArray(key)) {
      return key.indexOf(c) >= 0;
    }
    if (typeof key === 'function') {
      return key(c);
    }
    return key === c;
  });
  if (!choice) return def();
  const [, choiceVal] = choice;
  if (typeof choiceVal === 'function') return choiceVal();
  if (typeof choiceVal === 'string') {
    return switchFLam(choiceVal, options, def);
  }
  throw Error('switch F Failed!');
};
