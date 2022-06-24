import React, { useEffect, useState } from 'react';
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
    document.body.appendChild(root);
  }
  return root;
};

let popupCount = 1;
/**
 * Popup panel
 * Make sure to add `<div id="popup-root"></div>` to `index.html`
 * Uses ReactDom.createPortal to place the component in different DOM root
 *
 * @param {*} {
 *   children,
 * }
 * @returns
 */
export const PopupPanel = ({
  id,
  title,
  isOpen,
  handleClose,
  className,
  renderWhenClosed,
  children,
  popupRoot,
}) => {
  const [z] = useState(popupCount);
  const _popupRoot = getRoot(popupRoot || id);

  useEffect(() => {
    popupCount += 1;
    return () => {
      popupCount -= 1;
    };
  }, []);
  if (!isOpen) return <></>;

  const classNames = [className, `popupid_${id}`].filter((f) => f).join(' ');

  if (!_popupRoot) return <div className={classNames}>Missing Popup Root</div>;
  return ReactDOM.createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={`popupPanelWrap ${classNames}`}
      style={{
        zIndex: z * 10,
      }}
      onKeyDown={(e) => e.key === 'Escape' && handleClose()}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex="0"
    >
      <div className="popupPanel">
        <div className="popupPanel_content">{(renderWhenClosed || isOpen) && children}</div>
        <div className="popupPanel_topBar">
          <div className="popupPanel_title">{title}</div>
          <button className="popupPanel_closeBtn" type="button" onClick={handleClose}>
            X
          </button>
        </div>
      </div>
      {/* eslint-disable-next-line max-len */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="popupPanel_overlay" onClick={handleClose} />
    </div>,
    _popupRoot
  );
};

PopupPanel.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.node,
  children: PropTypes.any.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  renderWhenClosed: PropTypes.bool,
  popupRoot: PropTypes.any,
};

PopupPanel.defaultProps = {
  renderWhenClosed: false,
  popupRoot: null,
};

// Uses React HOC pattern
export const PopupPanelConnector = (
  Component,
  root,
  alwaysOpen,
  closeProp = 'handleClose',
  propsOverrides = {}
) => {
  return (props) => {
    const propsMerged = { ...props, ...propsOverrides };
    const { className, isOpen, title, id } = propsMerged;
    const handleClose = props[closeProp];
    return (
      <PopupPanel
        handleClose={handleClose}
        isOpen={alwaysOpen || isOpen}
        title={title}
        popupRoot={root}
        className={className}
        id={id || root}
      >
        <Component {...props} />
      </PopupPanel>
    );
  };
};
