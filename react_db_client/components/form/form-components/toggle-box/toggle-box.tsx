import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';
import { Uid } from '@react_db_client/constants.client-types';

export interface IToggleBoxProps {
  stateIn?: boolean;
  id: Uid;
  text?: string;
  onChange: (newVal: boolean, id: Uid) => void;
  width?: number;
  disabled?: boolean;
  selectButtonProps?: React.ComponentProps<'button'>; //React.HTMLProps<HTMLButtonElement>;
}

export const ToggleBox = ({
  stateIn,
  id,
  text,
  onChange,
  width,
  disabled,
  selectButtonProps = {},
}: IToggleBoxProps) => {
  const [state, setState] = useState(stateIn);
  const handleClick = () => {
    if (disabled) return;
    if (onChange) {
      onChange(!state, id);
    } else {
      setState(!state);
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
        {...selectButtonProps}
      >
        {text || (state ? <Emoji emoj="✔️" label="yes" /> : <Emoji emoj="x" label="no" />)}
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
