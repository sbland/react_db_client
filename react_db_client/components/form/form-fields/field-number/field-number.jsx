import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const parseInput = (value) =>
  value === '' || value === null || value === undefined || Number.isNaN(Number(value))
    ? ''
    : Number(value);

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
  const value = parseInput(valueIn);

  const onFocus = () => {
    if (value === '' && parseInput(defaultValue) !== '') updateFormData(uid, defaultValue);
    else if (value !== '' && value < min) updateFormData(uid, min);
    else if (value !== '' && value > max) updateFormData(uid, max);
    ref.current.select();
  };

  const onBlur = () => {
    if (value === '' && parseInput(defaultValue) !== '') updateFormData(uid, defaultValue);
    else if (value !== '' && value < min) updateFormData(uid, min);
    else if (value !== '' && value > max) updateFormData(uid, max);
  };

  const onChange = (e) => updateFormData(uid, e.target.value);

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
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        required={required}
        aria-labelledby={`${uid}-label`}
        id={`${uid}-input`}
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
