import React, { useState } from 'react';
import PropTypes from 'prop-types';

export const OverlayButton = ({ icon, func, label }) => {
  const [hover, setHover] = useState(false);
  const buttonStyle = hover ? 'expanded' : '';
  return (
    <button
      type="button"
      className={`button-one ${buttonStyle}`}
      onClick={func}
      onMouseOver={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onBlur={() => setHover(false)}
    >
      {!hover && icon}
      {hover && label}
    </button>
  );
};

OverlayButton.propTypes = {
  func: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export const OverlayButtons = ({ uid, overlayButtons }) => {
  return (
    <div className="itemList_overlay">
      {overlayButtons.map(({ func, label, icon }) => (
        <OverlayButton key={label} func={() => func(uid)} label={label} icon={icon} />
      ))}
    </div>
  );
};

OverlayButtons.propTypes = {
  uid: PropTypes.string.isRequired,
  overlayButtons: PropTypes.arrayOf(
    PropTypes.shape({
      func: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
