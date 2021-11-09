
/**
 * tryF is a functional wrapper for a try catch statement
 * @param {function} func // function to try
 */
 export const tryF = (func, errorCallback) => {
    try {
      return func();
    } catch (e) {
      return errorCallback ? errorCallback(e) : null;
    }
  };

/**
 * ifF - Functional If Statement
 * @param {boolean} cond
 * @param {function} trueDo
 * @param {function} falseDo
 */
 export const ifF = (cond, trueDo, falseDo) => (cond ? trueDo() : falseDo());
