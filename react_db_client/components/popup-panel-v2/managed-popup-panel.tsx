import React from 'react';
import { Uid } from '@react_db_client/constants.client-types';
import { PopupContentWrap } from './popup-panel-content-wrap';
import { PopupPanel } from './popup-panel';
import { PopupPanelContext } from './popup-panel-provider';

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
  const { openPopup, checkIsOpen, closePopup } =
    React.useContext(PopupPanelContext);

  React.useEffect(() => {
    if (checkIsOpen(id) && !isOpen) {
      closePopup(id);
    }
    if (!checkIsOpen(id) && isOpen) {
      openPopup(id);
    }
  }, [id, isOpen, checkIsOpen, openPopup, closePopup]);

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
  const { openPopup, checkIsOpen, closePopup } =
    React.useContext(PopupPanelContext);

  React.useEffect(() => {
    if (checkIsOpen(id) && !isOpen) {
      closePopup(id);
    }
    if (!checkIsOpen(id) && isOpen) {
      openPopup(id);
    }
  }, [id, isOpen, checkIsOpen, openPopup, closePopup]);

  return (
    <PopupPanel id={id} onClose={onClose}>
      <PopupContentWrap id={id} title={title} handleClose={onClose}>
        {children}
      </PopupContentWrap>
    </PopupPanel>
  );
};
