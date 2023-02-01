import { Uid } from '@react_db_client/constants.client-types';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

import {
  EPopupRegisterAction,
  PopupPanelContext,
} from './popup-panel-provider';
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
        onKeyDown={(e) => e.key === 'Escape' && closePopup(id)}
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
  const { dispatchPopupRegister, state } = React.useContext(PopupPanelContext);
  const { popupRegister, baseZIndex } = state;

  const [open, setOpen] = React.useState(false);
  const [root, setRoot] = React.useState<HTMLElement | null>(null);
  const [localZ, setLocalZ] = React.useState(-1);

  React.useEffect(() => {
    dispatchPopupRegister({
      type: EPopupRegisterAction.REGISTER_POPUP,
      args: {
        id,
        root: popupRoot,
        deleteRootOnUnmount,
        z: zIndex,
      },
    });
  }, [id, popupRoot, zIndex, dispatchPopupRegister, deleteRootOnUnmount]);

  React.useEffect(() => {
    if (popupRegister[id]?.open && !open) {
      setRoot(popupRegister[id].root || null);
      setLocalZ(popupRegister[id].z || -1);
      setOpen(true);
    }
    if (!popupRegister[id]?.open && open) {
      if (onClose) onClose();
      setOpen(false);
    }
  }, [id, open, popupRegister, dispatchPopupRegister, onClose]);

  React.useEffect(() => {
    return function cleanup() {
      dispatchPopupRegister({
        type: EPopupRegisterAction.DEREGISTER_POPUP,
        args: id,
      });
    };
  }, [dispatchPopupRegister]);

  const handleClose = React.useCallback(() => {
    dispatchPopupRegister({
      type: EPopupRegisterAction.CLOSE_POPUP,
      args: id,
    });
  }, [id, dispatchPopupRegister]);

  if (!root) return <></>;
  return (
    <PopupPanelRender
      id={id}
      baseZIndex={baseZIndex}
      z={localZ}
      open={open}
      closePopup={handleClose}
      renderWhenClosed={renderWhenClosed}
      children={children}
      root={root}
    />
  );
}
