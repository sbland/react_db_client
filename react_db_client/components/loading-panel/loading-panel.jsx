import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import './_loadingWrap.scss';

/* Ensure below is included in index.html */
const loadingRoot = document.getElementById('loading-root');

let loadingCount = 1;

export const LoadingPanel = ({ open, message, collapsed }) => {
  const [z] = useState(loadingCount);
  useEffect(() => {
    loadingCount += 1;
    return () => {
      loadingCount -= 1;
    };
  }, []);

  const classname = ['loadingPanel', collapsed ? 'collapsed' : '', open ? '' : 'hidden'].join(' ');

  return ReactDOM.createPortal(
    <div className={classname}>
      <div>{message}</div>
    </div>,
    loadingRoot
  );
};

LoadingPanel.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
};

LoadingPanel.defaultProps = {
  open: false,
  message: 'Loading',
};
