import React from 'react';
import PropTypes from 'prop-types';

export const FieldLabel = ({
  label,
  inputClassName,
  hasChanged,
  required,
  hasLabel,
}) => (
  <label className={inputClassName}>
    {required && '*'}
    {hasLabel && (
      <>
        {label}
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
