import React from 'react';
import PropTypes from 'prop-types';
import { ToggleBox } from '@react_db_client/components.form.form-components.toggle-box';

export const FieldBool = ({ uid, label, updateFormData, value, required }) => (
  <>
    <ToggleBox
      stateIn={value}
      id={uid}
      text={label}
      required={required}
      onChange={(val) => updateFormData(uid, val)}
    />
  </>
);

FieldBool.propTypes = {
  uid: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.bool,
  updateFormData: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

FieldBool.defaultProps = {
  value: false,
  required: false,
  label: null,
};
