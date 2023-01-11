import { Uid } from '@react_db_client/constants.client-types';
import React from 'react';
import { PopupPanelContext } from './popup-panel-provider';
import {
  PopupPanelCloseBtn,
  PopupPanelContentStyle,
  PopupPanelOverlay,
  PopupPanelStyle,
  PopupPanelTitle,
  PopupPanelTopBar,
  PopupPanelWrapStyle,
} from './style';

export interface IPopupContentWrapProps {
  classNames?: string;
  id: Uid;
  children: React.ReactNode;
  title?: string | React.ReactNode;
  handleClose?: () => void;
}

export const PopupContentWrap = ({
  classNames,
  id,
  children,
  title,
  handleClose: handleCloseOverride,
}: IPopupContentWrapProps) => {
  const { closePopup } = React.useContext(PopupPanelContext);

  const handleClose =
    handleCloseOverride ||
    (() => {
      closePopup(id);
    });

  return (
    <PopupPanelWrapStyle
      className={`popupPanelWrap ${classNames}`}
      data-testid={`popupid_${id}_content`}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
    >
      <PopupPanelStyle className="popupPanel" data-testid="rdc-popupPanel">
        <PopupPanelContentStyle className="popupPanel_content">
          {children}
        </PopupPanelContentStyle>
        <PopupPanelTopBar className="popupPanel_topBar">
          <PopupPanelTitle
            className="popupPanel_title"
            data-testid="rdc-popupPanel-title"
          >
            {title}
          </PopupPanelTitle>
          <PopupPanelCloseBtn
            className="popupPanel_closeBtn"
            type="button"
            onClick={handleClose}
            aria-label="Close popup"
          >
            X
          </PopupPanelCloseBtn>
        </PopupPanelTopBar>
      </PopupPanelStyle>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <PopupPanelOverlay className="popupPanel_overlay" onClick={handleClose} />
    </PopupPanelWrapStyle>
  );
};
