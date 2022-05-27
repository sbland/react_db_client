import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import './style.scss';

const getRoot = (inputRoot) => {
  let root = null;
  if (typeof inputRoot == 'object') root = inputRoot;
  if (typeof inputRoot == 'string') root = document.getElementById(inputRoot);
  if (!root) {
    root = document.createElement('div');
    root.setAttribute('id', inputRoot || '_root');
  }
  return root;
};

const PopupMenuItems = ({ items }) =>
  items.map((item) => (
    <li className="popupMenu_menuItem" key={item.uid}>
      <button type="button" className="button-reset" onClick={item.onClick}>
        {item.label}
      </button>
    </li>
  ));

PopupMenuItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

/**
 * Popup Menu
 *
 * @param {*} {
 *   isOpenOverride,
 *   items,
 * }
 * @returns
 */
export const PopupMenu = ({ isOpenOverride, onCloseCallback, position, items, popupRoot }) => {
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
      <div className="popupMenuWrap">
        <div
          className="popupMenu"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <ul className="popupMenu_list">
            <PopupMenuItems items={items} />
          </ul>
        </div>
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div className="popupMenu_overlay" onClick={handleClose} onContextMenu={handleClose} />
      </div>,
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

export const RightClickWrapper = ({ children, items, popupRoot }) => {
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
        <div
          style={{ width: '100%', height: '100%' }}
          className={`popupMenu_righClickWrap ${isOpen && 'active'}`}
          onContextMenu={handleContextMenu}
        >
          {children}
        </div>
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
