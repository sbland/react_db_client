import React, { useRef } from 'react';
import PropTypes from 'prop-types';

export const FieldText = ({
  uid,
  unit,
  updateFormData,
  value,
  special,
  useArea,
  required,
}) => {
  const ref = useRef(null);
  return (
    <>
      {useArea && (
        <textarea
          value={value || ''}
          id={`${uid}-input`}
          name={uid}
          aria-labelledby={`${uid}-label`}
          onChange={(e) => updateFormData(uid, e.target.value)}
          required={required}
          role="presentation"
        />
      )}
      {!useArea && (
        <input
          // Added Role to stop autofill
          // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
          role="presentation"
          type={special || 'text'}
          ref={ref}
          id={`${uid}-input`}
          onFocus={() => {
            ref.current.select();
          }}
          aria-labelledby={`${uid}-label`}
          value={value || ''}
          // id={uid}  // disabled as entering 'id' caused autofill issues
          // name={uid} // disabled as entering 'name' caused autofill issues
          onChange={(e) => updateFormData(uid, e.target.value)}
          required={required}
        />
      )}
      {unit ? <span>{unit}</span> : <span></span>}
    </>
  );
};

FieldText.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.string,
  updateFormData: PropTypes.func.isRequired,
  special: PropTypes.string,
  useArea: PropTypes.bool,
  required: PropTypes.bool,
};

FieldText.defaultProps = {
  unit: '',
  value: '',
  special: null,
  useArea: false,
  required: false,
};
