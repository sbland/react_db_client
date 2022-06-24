import React from 'react';

/* https://codesandbox.io/s/react-hook-form-custom-checkbox-yncp5 */

export function useCombinedRefs<El>(
  ...refs: (React.MutableRefObject<El> | React.RefCallback<El> | null | undefined)[]
) {
  const targetRef = React.useRef<El | null>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        // TODO: Does this still work?
        if (targetRef.current) {
          ref.current = targetRef.current;
        }
      }
    });
  }, [refs]);
  return targetRef;
}
