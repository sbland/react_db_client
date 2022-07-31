/* Adapted from https://bytemaster.io/compare-objects-javascript */

export function deepIsEqual(first, second) {
  // If first and second are the same type and have the same value
  // Useful if strings or other primitive types are compared
  if (first === undefined && second === undefined) return true;
  if (first === null && second === null) return true;
  if (first === undefined) return false;
  if (second === undefined) return false;
  if (first === null) return false;
  if (second === null) return false;
  if (first === second) return true;

  // Try a quick compare by seeing if the length of properties are the same
  const firstProps = Object.getOwnPropertyNames(first);
  const secondProps = Object.getOwnPropertyNames(second);

  // Check different amount of properties
  if (firstProps.length !== secondProps.length) return false;

  // Go through properties of first object
  for (let i = 0; i < firstProps.length; i += 1) {
    const prop = firstProps[i];
    // Check the type of property to perform different comparisons
    switch (typeof first[prop]) {
      // If it is an object, decend for deep compare
      case 'object':
        if (!deepIsEqual(first[prop], second[prop])) return false;
        break;
      case 'number':
        // with JavaScript NaN != NaN so we need a special check
        if (Number.isNaN(first[prop]) && Number.isNaN(second[prop])) return true;
        break;
      default:
        if (first[prop] !== second[prop]) return false;
    }
  }
  return true;
}

export const dateCompare = (dateA, dateB) => {
  if (dateA < dateB) return 1;
  if (dateA > dateB) return -1;
  return 0;
};

export const dateSort = (a, b) => dateCompare(new Date(a.updatedAt), new Date(b.updatedAt));
