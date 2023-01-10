import { Uid } from '@react_db_client/constants.client-types';
import React from 'react';
import { PopupContentWrap } from './popup-panel-content-wrap';
import { PopupPanel } from './popup-panel';
import { PopupPanelContext } from './popup-panel-provider';

export interface IPopupPanelManagerProps {
  id: Uid;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const PopupPanelManaged: React.FC<IPopupPanelManagerProps> = ({
  id,
  isOpen,
  onClose,
  title,
  children,
}) => {
  const { openPopup, checkIsOpen, closePopup } = React.useContext(PopupPanelContext);
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
      <PopupContentWrap id={id} title={title}>
        {children}
      </PopupContentWrap>
    </PopupPanel>
  );
};
