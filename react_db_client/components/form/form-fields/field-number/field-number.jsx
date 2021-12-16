import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const FieldNumber = ({
  uid,
  unit,
  min,
  max,
  step,
  defaultValue,
  updateFormData,
  value: valueIn,
  required,
}) => {
  const ref = useRef(null);
  const value =
    valueIn === '' || valueIn === null || valueIn === undefined || Number.isNaN(Number(valueIn))
      ? ''
      : Number(valueIn);
  return (
    <>
      <input
        type="number"
        className="fieldNumber"
        max={Number(max)}
        min={Number(min)}
        step={Number(step)}
        value={value}
        ref={ref}
        onFocus={() => {
          if (value === null) updateFormData(uid, defaultValue);
          else if (value <= min) updateFormData(uid, min);
          else if (value >= max) updateFormData(uid, max);
          ref.current.select();
        }}
        onBlur={() => {
          if (value <= min) updateFormData(uid, min);
          if (value >= max) updateFormData(uid, max);
        }}
        onChange={(e) => updateFormData(uid, e.target.value)}
        required={required}
      />
      {unit && <span>{unit}</span>}
    </>
  );
};

FieldNumber.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  updateFormData: PropTypes.func.isRequired,
  required: PropTypes.bool,
  defaultValue: PropTypes.number,
};

FieldNumber.defaultProps = {
  unit: '',
  value: null,
  min: -99999,
  max: 999999,
  step: 1,
  required: false,
  defaultValue: null,
};
