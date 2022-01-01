import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import './style.scss';

/* Ensure below is included in index.html */
const loadingRoot = document.getElementById('loading-root');

let loadingCount = 1;

export const LoadingPanel = ({ open, message, collapsed, portalRootRef }) => {
  const [z] = useState(loadingCount);
  useEffect(() => {
    loadingCount += 1;
    return () => {
      loadingCount -= 1;
    };
  }, []);

  const classname = ['loadingPanel', collapsed ? 'collapsed' : '', open ? '' : 'hidden'].join(' ');

  return portalRootRef?.current ?
  ReactDOM.createPortal(
    <div className={classname}>
      <div>{open ? message : ''}</div>
    </div>,
    portalRootRef.current
  ) : <div>Loading</div>
};

LoadingPanel.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  collapsed: PropTypes.bool,
  portalRootRef: PropTypes.any,
};

LoadingPanel.defaultProps = {
  open: false,
  message: 'Loading',
  collapsed: false,
  portalRootRef: { current: loadingRoot },
};

export const LoadingPanelWrapped = ({ open, message, collapsed }) => {
  const portalRootRef = React.useRef(null);
  const [portalRootRefSt, setPortalRootRefSt] = useState();
  return (
    <>
      <div
        ref={(current) => {
          portalRootRef.current = current;
          setPortalRootRefSt(portalRootRef.current);
        }}
      />
      <LoadingPanel
        open={open}
        message={message}
        collapsed={collapsed}
        portalRootRef={portalRootRef}
      />
    </>
  );
};
