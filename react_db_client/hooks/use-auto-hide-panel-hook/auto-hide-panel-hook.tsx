import React, { useCallback, useEffect, useState } from 'react';

let hidePanelTimeout: NodeJS.Timeout | null = null;

export const useAutoHidePanel = (
  menuRef: React.RefObject<HTMLElement>,
  floating: boolean | undefined | null,
  showPanelOverride: boolean | undefined | null,
  HIDETIME = 900
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [showPanel, setShowPanel] = useState(() => showPanelOverride || false);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        showPanel &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        hidePanelTimeout = setTimeout(() => {
          setShowPanel(false);
          document.removeEventListener('mouseover', handleClickOutside);
        }, HIDETIME);
      } else {
        if (hidePanelTimeout) clearTimeout(hidePanelTimeout);
      }
    },
    [HIDETIME, menuRef, showPanel]
  );

  useEffect(() => {
    if (floating) {
      document.addEventListener('mouseover', handleClickOutside);
    }
    return () => {
      // Unbind the event listener on clean up
      if (hidePanelTimeout) clearTimeout(hidePanelTimeout);
      document.removeEventListener('mouseover', handleClickOutside);
    };
  }, [showPanel, floating, handleClickOutside]);

  return [showPanel, setShowPanel];
};

export default useAutoHidePanel;
