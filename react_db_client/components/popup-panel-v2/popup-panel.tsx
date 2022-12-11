import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { PopupPanelContext } from './popup-panel-provider';
import {
  PopupPanelClosePanelStyle,
  PopupPanelContentPanelStyle,
  PopupPanelWrapStyle,
} from './style';

export type PopupPanelProps = {
  /**
   * a node to be rendered in the special component.
   */
  id: string | number;
  renderWhenClosed?: boolean;
  children: ReactNode;
  popupRoot?: string | HTMLElement;
  deleteRootOnUnmount?: boolean;
  zIndex?: number;
};

export function PopupPanel({
  id,
  renderWhenClosed,
  children,
  popupRoot,
  deleteRootOnUnmount,
  zIndex,
}: PopupPanelProps) {
  const { registerPopup, deregisterPopup, baseZIndex, popupRegister, closePopup } =
    React.useContext(PopupPanelContext);

  const { open, root, z } = popupRegister[id] || { open: false, root: null, z: null };

  React.useEffect(() => {
    registerPopup(id, popupRoot, deleteRootOnUnmount, zIndex);
    return () => {
      deregisterPopup(id);
    };
  }, []);

  if (!root) return <></>;

  return ReactDOM.createPortal(
    <PopupPanelWrapStyle
      data-testid={`popupPanel_${id}`}
      style={{
        zIndex: baseZIndex + z * 10,
        display: open ? 'inherit' : 'none',
      }}
    >
      <PopupPanelClosePanelStyle
        onKeyDown={(e) => e.key === 'Escape' && closePopup(id)}
        onClick={() => closePopup(id)}
        aria-label="Close popup"
        data-testid={'popupPanel_closeBtn'}
      />
      <PopupPanelContentPanelStyle data-testid={'popupPanel_content'} isOpen={open || false}>
        {(renderWhenClosed || open) && children}
      </PopupPanelContentPanelStyle>
    </PopupPanelWrapStyle>,
    root
  );
}
