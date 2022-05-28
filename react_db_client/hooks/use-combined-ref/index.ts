import React from 'react';

/* https://codesandbox.io/s/react-hook-form-custom-checkbox-yncp5 */

export function useCombinedRefs<El>(
  ...refs: (React.MutableRefObject<El> | React.RefCallback<El>)[]
) {
  const targetRef = React.useRef<El>();

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);
  return targetRef;
}
