import React from 'react';
import PropTypes from 'prop-types';

export const CellInfoBtn = ({ styles, message }) => {
  const handleTagButtonClick = () => {
    // TODO: Replace alert with notification
    if (message) alert(message.text);
  };

  const lhsTagStyle = {
    ...styles,
    width: '8px',
    fontSize: '1rem',
    lineHeight: '1rem',
    color: 'white',
    borderRadius: '0.3rem',
    fontWeight: 800,
    textAlign: 'center',
    cursor: 'pointer',
  };

  const lhsTagClass = [
    'button-reset',
    message ? 'popIn invalidRow' : 'hidden', // TODO: Move style to datatable css
  ].join(' ');

  return (
    <button
      type="button"
      className={lhsTagClass}
      style={lhsTagStyle}
      onClick={handleTagButtonClick}
    >
      {message ? '!' : ' '}
    </button>
  );
};

CellInfoBtn.propTypes = {
  styles: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  message: PropTypes.string,
};

CellInfoBtn.defaultProps = {
  message: '',
}
