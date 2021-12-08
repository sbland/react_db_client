import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@samnbuk/react_db_client.components.emoji';
import '@samnbuk/react_db_client.constants.style';

export const ToggleBox = ({ stateIn, id, text, onChange, width, disabled }) => {
  const [state, setState] = useState(stateIn);
  const handleClick = () => {
    if (disabled) return;
    if (onChange) {
      onChange(!state, id);
    } else {
      setState(!state, id);
    }
  };

  useEffect(() => {
    setState(stateIn);
  }, [stateIn]);

  const styleOverride = text ? {} : { width };

  return (
    <div className="toggleBoxWrap">
      <button
        type="button"
        className={state ? 'button-two' : 'button-one'}
        onClick={handleClick}
        style={styleOverride}
      >
        {text || (state ? <Emoji emoj="✔️" label="yes"/> : <Emoji emoj="x" label="no"/>)}
      </button>
    </div>
  );
};

ToggleBox.propTypes = {
  stateIn: PropTypes.bool,
  text: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
};

ToggleBox.defaultProps = {
  text: null,
  stateIn: false,
  width: '100%',
  disabled: false,
  onChange: () => {
    throw Error('onChange not set!');
  },
};
