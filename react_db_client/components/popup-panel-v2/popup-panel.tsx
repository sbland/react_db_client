import { Uid } from '@react_db_client/constants.client-types';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { PopupPanelContext } from './popup-panel-provider';
import {
  PopupPanelClosePanelStyle,
  PopupPanelContentPanelStyle,
  PopupPanelWrapStyle,
} from './style';

export interface PopupPanelProps extends IPopupPanelProps {
  // Kept for back compatability
}

export interface IPopupPanelProps {
  /**
   * a node to be rendered in the special component.
   */
  id: Uid;
  renderWhenClosed?: boolean;
  children: ReactNode;
  popupRoot?: string | HTMLElement;
  deleteRootOnUnmount?: boolean;
  zIndex?: number;
  onClose?: () => void;
}

export interface IPopupPanelRenderProps {
  id: Uid;
  renderWhenClosed?: boolean;
  children: ReactNode;
  popupRoot?: string | HTMLElement;
  deleteRootOnUnmount?: boolean;
  zIndex?: number;
  baseZIndex: number;
  z: number;
  open?: boolean;
  closePopup: (Uid) => void;
  root: HTMLElement;
}

export const PopupPanelRender = ({
  id,
  baseZIndex,
  z,
  open,
  closePopup,
  renderWhenClosed,
  children,
  root,
}: IPopupPanelRenderProps) => {
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
        aria-label="Close the popup"
        data-testid={'popupPanel_closeBtn'}
      />
      <PopupPanelContentPanelStyle
        data-testid={'popupPanel_content'}
        isOpen={open || false}
      >
        {(renderWhenClosed || open) && children}
      </PopupPanelContentPanelStyle>
    </PopupPanelWrapStyle>,
    root
  );
};

export function PopupPanel({
  id,
  renderWhenClosed,
  children,
  popupRoot,
  deleteRootOnUnmount,
  zIndex,
  onClose,
}: IPopupPanelProps) {
  const {
    registerPopup,
    deregisterPopup,
    baseZIndex,
    popupRegister,
    closePopup,
  } = React.useContext(PopupPanelContext);

  const { open, root, z } = popupRegister[id] || {
    open: false,
    root: null,
    z: null,
  };

  React.useEffect(() => {
    registerPopup({
      id,
      root: popupRoot,
      deleteRootOnUnmount,
      z: zIndex,
      onCloseCallback: onClose,
    });
  }, [id, popupRoot, zIndex, onClose, registerPopup]);

  React.useEffect(() => {
    return function cleanup() {
      deregisterPopup(id);
    };
  }, []);

  const handleClose = React.useCallback(() => {
    closePopup(id);
  }, [id, closePopup]);

  if (!root) return <></>;
  return (
    <PopupPanelRender
      id={id}
      baseZIndex={baseZIndex}
      z={z}
      open={open}
      closePopup={handleClose}
      renderWhenClosed={renderWhenClosed}
      children={children}
      root={root}
    />
  );
}
