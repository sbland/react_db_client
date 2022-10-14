import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { getRoot } from '@react_db_client/helpers.get-root';
import { Uid } from '@react_db_client/constants.client-types';

import {
  PopupMenuListItemButtonStyle,
  PopupMenuListItemStyle,
  PopupMenuListStyle,
  PopupMenuOverlayStyle,
  PopupMenuRightClickWrapStyle,
  PopupMenuStyle,
  PopupMenuWrapStyle,
} from './styles';

export interface IItem {
  uid: Uid;
  label: string;
  onClick: () => void;
}
export interface IPopupMenuItemsProps {
  items: IItem[];
}

const PopupMenuItems = ({ items }: IPopupMenuItemsProps) => (
  <>
    {items.map((item) => (
      <PopupMenuListItemStyle className="popupMenu_menuItem" key={item.uid}>
        <PopupMenuListItemButtonStyle type="button" className="button-reset" onClick={item.onClick}>
          {item.label}
        </PopupMenuListItemButtonStyle>
      </PopupMenuListItemStyle>
    ))}
  </>
);

PopupMenuItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export interface IPopupMenuProps {
  isOpenOverride?: boolean;
  onCloseCallback: (v: boolean) => void;
  position: { x: number; y: number };
  items: IItem[];
  popupRoot?: string | HTMLElement;
}

/**
 * Popup Menu
 *
 * @param {*} {
 *   isOpenOverride,
 *   items,
 * }
 * @returns
 */
export const PopupMenu = ({
  isOpenOverride,
  onCloseCallback,
  position,
  items,
  popupRoot,
}: IPopupMenuProps) => {
  const [isOpen, setIsOpen] = useState(isOpenOverride);

  const _popupRoot = getRoot(popupRoot);

  useEffect(() => {
    setIsOpen(isOpenOverride);
  }, [isOpenOverride]);

  const handleClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
    onCloseCallback(false);
  };

  if (!_popupRoot) return <div>Missing Popup Root</div>;

  if (isOpen) {
    return ReactDOM.createPortal(
      <PopupMenuWrapStyle className="popupMenuWrap">
        <PopupMenuStyle
          className="popupMenu"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <PopupMenuListStyle className="popupMenu_list">
            <PopupMenuItems items={items} />
          </PopupMenuListStyle>
        </PopupMenuStyle>
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <PopupMenuOverlayStyle
          className="popupMenu_overlay"
          onClick={handleClose}
          onContextMenu={handleClose}
        />
      </PopupMenuWrapStyle>,
      _popupRoot
    );
  }
  return <></>;
};

PopupMenu.propTypes = {
  isOpenOverride: PropTypes.bool,
  onCloseCallback: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  popupRoot: PropTypes.any,
};

PopupMenu.defaultProps = {
  isOpenOverride: false,
};

export interface IRightClickWrapperProps {
  children: React.ReactElement;
  items: IItem[];
  popupRoot?: string | HTMLElement;
}

export const RightClickWrapper = ({ children, items, popupRoot }: IRightClickWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsOpen(true);
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      {children?.type === 'div' ? (
        React.cloneElement(children, { onContextMenu: handleContextMenu })
      ) : (
        // : React.cloneElement(children, { ref: childRef }, [
        //   <div
        //     className="popupMenu_rightClickWrapper"
        //     onContextMenu={handleContextMenu}
        //     style={{
        //       width: '100%',
        //       height: '100%',
        //     }}
        //   />,
        // ])
        <PopupMenuRightClickWrapStyle
          style={{ width: '100%', height: '100%' }}
          className={`popupMenu_righClickWrap ${isOpen && 'active'}`}
          onContextMenu={handleContextMenu}
        >
          {children}
        </PopupMenuRightClickWrapStyle>
      )}
      <PopupMenu
        isOpenOverride={isOpen}
        onCloseCallback={() => setIsOpen(false)}
        items={items}
        position={pos}
        popupRoot={popupRoot}
      />
    </>
  );
};

RightClickWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  popupRoot: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
