import React, { useRef } from 'react';
import PropTypes from 'prop-types';

export const FieldNumber = ({
  uid,
  unit,
  min,
  max,
  step,
  defaultValue,
  updateFormData,
  value,
  required,
}) => {
  const ref = useRef(null);
  return (
    <>
      <input
        type="number"
        max={Number(max)}
        min={Number(min)}
        step={Number(step)}
        value={Number(value) != null ? Number(value) : ''}
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
      <span>{unit}</span>
    </>
  );
};

FieldNumber.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  updateFormData: PropTypes.func.isRequired,
  required: PropTypes.bool,
  defaultValue: PropTypes.number,
};

FieldNumber.defaultProps = {
  unit: '',
  value: 0,
  min: -99999,
  max: 999999,
  step: 1,
  required: false,
  defaultValue: null,
};
