
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
