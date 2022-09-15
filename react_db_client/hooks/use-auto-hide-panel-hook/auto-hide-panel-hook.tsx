import { useCallback, useEffect, useState } from 'react';

let hidePanelTimeout: NodeJS.Timeout | null = null;

/**
 *
 * @param {*} menuRef
 * @param {*} floating
 * @param {*} showPanelOverride
 * @param {*} HIDETIME
 * @returns [showPanel, setShowPanel]
 */
export const useAutoHidePanel = (
  menuRef: React.RefObject<HTMLElement>,
  floating: boolean,
  showPanelOverride: boolean,
  HIDETIME = 900
) => {
  const [showPanel, setShowPanel] = useState(() => showPanelOverride);

  const handleClickOutside = useCallback(
    (event) => {
      if (showPanel && menuRef.current && !menuRef.current.contains(event.target)) {
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
