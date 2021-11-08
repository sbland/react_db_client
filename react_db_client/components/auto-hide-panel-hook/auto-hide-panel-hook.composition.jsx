import React, { useRef } from 'react';
import { useAutoHidePanel } from './auto-hide-panel-hook';

export const BasicAutoHidePanelHook = () => {
  const menuRef = useRef(null);
  const floating = false;
  const showPanelOverride = false;
  const [showPanel, setShowPanel] = useAutoHidePanel(
    menuRef,
    floating,
    showPanelOverride
  );
  return (
    <div>
      <h1>Auto hide panel hook</h1>
      Show Panel: {showPanel}
      <button onClick={() => setShowPanel((prev) => !prev)}>Click</button>
    </div>
  );
};
