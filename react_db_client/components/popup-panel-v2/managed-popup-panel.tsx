import React from 'react';
import { Uid } from '@react_db_client/constants.client-types';
import { PopupContentWrap } from './popup-panel-content-wrap';
import { PopupPanel } from './popup-panel';
import {
  EPopupRegisterAction,
  PopupPanelContext,
} from './popup-panel-provider';

export interface IPopupPanelManagerProps {
  id: Uid;
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const PopupPanelManaged: React.FC<IPopupPanelManagerProps> = ({
  id,
  isOpen,
  onClose,
  children,
}) => {
  const { state, dispatchPopupRegister } = React.useContext(PopupPanelContext);
  const { popupRegister } = state;

  React.useEffect(() => {
    if (popupRegister[id]?.open && !isOpen) {
      dispatchPopupRegister({
        type: EPopupRegisterAction.CLOSE_POPUP,
        args: id,
      });
    }
    if (!popupRegister[id]?.open && isOpen) {
      dispatchPopupRegister({
        type: EPopupRegisterAction.OPEN_POPUP,
        args: id,
      });
    }
  }, [id, isOpen, dispatchPopupRegister]);

  return (
    <PopupPanel id={id} onClose={onClose}>
      {children}
    </PopupPanel>
  );
};

export interface IPopupPanelManagedWithContentWrapProps
  extends IPopupPanelManagerProps {
  title;
}

export const PopupPanelManagedWithContentWrap: React.FC<
  IPopupPanelManagedWithContentWrapProps
> = ({ id, isOpen, onClose, children, title }) => {
  const { state, openPopup, closePopup } = React.useContext(PopupPanelContext);
  const { popupRegister } = state;

  React.useEffect(() => {
    if (popupRegister[id]?.open && !isOpen) {
      closePopup(id);
    }
    if (!popupRegister[id]?.open && isOpen) {
      openPopup(id);
    }
  }, [id, isOpen, openPopup, closePopup]);

  return (
    <PopupPanel id={id} onClose={onClose}>
      <PopupContentWrap id={id} title={title}>
        {children}
      </PopupContentWrap>
    </PopupPanel>
  );
};
