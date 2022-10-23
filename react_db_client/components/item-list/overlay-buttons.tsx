import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IOverlayButton, IOverlayButtonProps } from './lib';
import { Uid } from '@react_db_client/constants.client-types';

export const OverlayButton = ({ icon, onClick, label }: IOverlayButtonProps) => {
  const [hover, setHover] = useState(false);
  const buttonStyle = hover ? 'expanded' : '';
  return (
    <button
      type="button"
      className={`button-one ${buttonStyle}`}
      onClick={onClick}
      onMouseOver={() => setHover(true)}
      onFocus={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onBlur={() => setHover(false)}
      aria-label={label}
    >
      {!hover && icon}
      {hover && label}
    </button>
  );
};

OverlayButton.propTypes = {
  func: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

export const OverlayButtons = ({
  uid,
  overlayButtons,
}: {
  uid: Uid;
  overlayButtons: IOverlayButton[];
}) => {
  return (
    <div className="itemList_overlay">
      {overlayButtons.map(({ func, label, icon, onClick }) => (
        <OverlayButton
          key={label}
          label={label}
          icon={icon}
          onClick={() => (onClick ? onClick(uid) : func && func(uid))}
        />
      ))}
    </div>
  );
};

OverlayButtons.propTypes = {
  uid: PropTypes.string.isRequired,
  overlayButtons: PropTypes.arrayOf(PropTypes.shape(OverlayButton.propTypes)).isRequired,
};
