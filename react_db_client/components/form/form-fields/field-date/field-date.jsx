import React from 'react';
import PropTypes from 'prop-types';

export const FieldDate = ({
  uid,
  unit,
  min,
  max,
  updateFormData,
  // defaultValue,
  value,
  required,
}) => {
  const parsedDate =
    value instanceof Date
      ? value.toISOString().substr(0, 10)
      : new Date(value).toISOString().substr(0, 10);

  return (
    <>
      <input
        type="date"
        max={max}
        min={min}
        value={value ? parsedDate : ''}
        onChange={(e) =>
          updateFormData(
            uid,
            new Date(e.target.value).toISOString().substr(0, 10)
          )
        }
        required={required}
      />
      <span>{unit}</span>
    </>
  );
};

FieldDate.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  min: PropTypes.number,
  max: PropTypes.number,
  updateFormData: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

FieldDate.defaultProps = {
  unit: '',
  value: 0,
  min: null,
  max: null,
  required: false,
};
