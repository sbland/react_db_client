import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import './style.scss';


let _popupRoot = document.getElementById('popup-root');

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
export const PopupPanel = ({ title, isOpen, handleClose, className, renderWhenClosed, children, popupRoot }) => {
  const [z] = useState(popupCount);

  useEffect(() => {
    popupCount += 1;
    return () => {
      popupCount -= 1;
    };
  }, []);
  if (!isOpen) return <></>;

  return ReactDOM.createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={`popupPanelWrap ${className}`}
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
    popupRoot
  );
};

PopupPanel.propTypes = {
  title: PropTypes.node,
  children: PropTypes.any.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  renderWhenClosed: PropTypes.bool,
  popupRoot: PropTypes.any,
};

PopupPanel.defaultProps = {
  renderWhenClosed: false,
  popupRoot: _popupRoot,
};


// Uses React HOC pattern
export const PopupPanelConnector = (Component, root) => {
  if (root) {
    popupRoot = document.getElementById(root);
  }
  return (props) => (
    // eslint-disable-next-line react/prop-types, react/destructuring-assignment
    <PopupPanel handleClose={props.handleClose} isOpen={props.isOpen} title={props.title}>
      <Component {...props} />
    </PopupPanel>
  );
};
