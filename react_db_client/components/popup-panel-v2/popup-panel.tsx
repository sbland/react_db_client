import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { getRoot } from '@react_db_client/helpers.get-root';
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
};

export function PopupPanel({
  id,
  renderWhenClosed,
  children,
  popupRoot,
  deleteRootOnUnmount,
}: PopupPanelProps) {
  // const _popupRoot = getRoot(popupRoot || id, id);

  const { popupCount, registerPopup, deregisterPopup, baseZIndex, popupRegister, closePopup } =
    React.useContext(PopupPanelContext);

  const z = React.useRef<number>(popupCount);

  const { open, root } = popupRegister[id] || { open: false, root: null };

  React.useEffect(() => {
    registerPopup(id, popupRoot, deleteRootOnUnmount);
    return () => {
      deregisterPopup(id);
    };
  }, []);

  if (!root) return <></>;
  // if (!_popupRoot) return <div>Missing Popup Root</div>;

  return ReactDOM.createPortal(
    <PopupPanelWrapStyle
      data-testid={`popupPanel_${id}`}
      style={{
        zIndex: baseZIndex + z.current * 10,
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
