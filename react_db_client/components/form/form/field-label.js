import React from 'react';
import PropTypes from 'prop-types';

export const FieldLabel = ({ uid, label, inputClassName, hasChanged, required, hasLabel }) => (
  <label className={inputClassName} id={`${uid}-label`} htmlFor={`${uid}-input`}>
    {required && '*'}
    {hasLabel && (
      <>
        {label || 'MISSING LABEL'}
        {/* Below is a possible hack to stop chrome autofill */}
        {/* {label.split('').join('\u200b')} */}
        {hasChanged && '(!)'}
        {':'}{' '}
      </>
    )}
    {!hasLabel && <span />}
  </label>
);

FieldLabel.propTypes = {
  uid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inputClassName: PropTypes.string,
  hasChanged: PropTypes.bool,
  required: PropTypes.bool,
  hasLabel: PropTypes.bool,
};

FieldLabel.defaultProps = {
  inputClassName: '',
  hasChanged: false,
  required: false,
  hasLabel: false,
};
