export const objToArray = (obj) => Object.keys(obj).map((key) => obj[key]);
export const arrayToObj = (arr, idName) => {
  if (!Array.isArray(arr)) return null;
  const obj = {};
  arr.forEach((e) => {
    const id = e[idName];
    obj[id] = e;
  });
  return obj;
};

// https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
// [[1],[2],[[3],[4]]] tp [1,2,3,4]
export const flattenArray = (arr) =>
  arr.reduce(
    (flat, toFlatten) =>
      flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten),
    []
  );

const throwInvalidObjectError = (data) => {
  throw Error(`Invalid data. Must be Object ${data}`);
};

const checkIsObject = (obj) =>
  typeof obj === 'object' && obj !== null ? obj : throwInvalidObjectError(obj);

const flattenObject = (obj) =>
  Object.keys(checkIsObject(obj))
    .map((key) => {
      const newVal =
        typeof obj[key] === 'object' && obj[key] !== null
          ? Object.values(flattenObject(obj[key])).join(', ')
          : obj[key];
      return [key, newVal];
    })
    .reduce((data, c) => {
      const newData = { ...data };
      const [key, value] = c;
      newData[key] = Array.isArray(obj) ? value : `${key}: ${value}`;
      return newData;
    }, {});

/**
 * Flattens all props in an object
 * { a: [1,2,3], b: { foo: 'bar' }}
 * to
 * { a: '1,2,3', b: 'bar' }
 *
 * @param {Object} data
 * @returns {Object}
 */
export const flattenProps = (obj) =>
  Object.keys(checkIsObject(obj))
    .map((key) => {
      // console.log(obj);
      const newVal =
        typeof obj[key] === 'object' && obj[key] !== null
          ? Object.values(flattenObject(obj[key])).join(', ')
          : obj[key];
      return [key, newVal];
    })
    .reduce((data, c) => {
      const newData = { ...data };
      const [key, value] = c;
      newData[key] = value;
      return newData;
    }, {});

export const getObjectKeySet = (objs) => {
  objs.forEach((obj) => {
    if (!obj || typeof obj !== 'object') throw Error('Input is not an object!');
  });
  const keyArray = flattenArray(objs.map((obj) => Object.keys(obj)));
  return Array.from(new Set(keyArray));
};

export const zipArrayOfObjects = (arrA, arrB) => arrA.map((item, i) => ({ ...item, ...arrB[i] }));

export const zipObjectOfObjects = (objOfA, objOfB) => {
  if (!objOfA || typeof objOfA !== 'object') throw Error('Input is not an object!');
  if (!objOfB || typeof objOfB !== 'object') throw Error('Input is not an object!');
  const newObj = {};
  const allKeys = getObjectKeySet([objOfA, objOfB]);
  allKeys.forEach((key) => {
    newObj[key] = { ...(objOfA[key] || {}), ...(objOfB[key] || {}) };
  });
  return newObj;
};

export const unzipArrayOfObject = (arr, keys) =>
  arr.map((item) => {
    const output = {};
    keys.forEach((key) => {
      output[key] = item[key];
    });
    return output;
  });

export const maskObject = (obj, mask) => {
  const newObj = {};
  mask.forEach((key) => {
    newObj[key] = obj[key];
  });
  return newObj;
};

export const objForEach = (objOf, fn) => {
  const newObj = {};
  Object.keys(objOf).forEach((key) => {
    newObj[key] = fn(objOf[key]);
  });
  return newObj;
};

export const splitList = (arr, len) =>
  arr.reduce(
    (lst, val) => {
      const endList = lst.slice(-1)[0];
      return endList.length >= len
        ? lst.concat([[val]])
        : lst.slice(0, -1).concat([endList.concat([val])]);
    },
    [[]]
  );
