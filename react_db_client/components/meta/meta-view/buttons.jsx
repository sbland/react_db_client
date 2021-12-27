import React from 'react';
import PropTypes from 'prop-types';

// Minimize and close buttons
const FocusButtons = ({ isExpanded, handleMinimize, handleClose }) => (
  <div className="focusBtns">
    <button
      type="button"
      className="minimizeBtn"
      onClick={handleMinimize}
    >
      {(isExpanded && '﹘') || '+'}
    </button>
    <button
      type="button"
      className="closeBtn"
      onClick={handleClose}
    >
      {'X'}
    </button>
  </div>
);

FocusButtons.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  handleMinimize: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default FocusButtons;


export const MinimizeButton = ({ isExpanded, handleMinimize, className }) => (
  <div className={`focusBtns_minimize ${className}`}>
    <button
      type="button"
      className={`minimizeBtn ${className}`}
      onClick={handleMinimize}
    >
      <div>
        {(isExpanded && '﹘') || '+'}
      </div>
    </button>
  </div>
);

MinimizeButton.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  handleMinimize: PropTypes.func.isRequired,
  className: PropTypes.string,
};

MinimizeButton.defaultProps = {
  className: '',
};
