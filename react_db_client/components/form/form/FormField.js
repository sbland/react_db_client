import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';
import { switchF } from '@samnbuk/react_db_client.helpers.func-tools';

import { FieldReadOnly } from '@samnbuk/react_db_client.components.form.form-fields.field-read-only';
import { FieldLabel } from './field-label';

import './_form.scss';

export const FormField = ({
  heading,
  value,
  updateFormData,
  additionalData,
  componentMap,
}) => {
  // TODO: Is this setup causing unnessesary updates?
  const props = useMemo(
    () => ({
      updateFormData,
      value,
      key: `${heading.uid}-sub`,
      additionalData,
      ...heading,
    }),
    [heading, updateFormData, value, additionalData]
  );
  const { label, required, type, uid, hasChanged, readOnly } = heading;

  const defaultComponent = () => FieldReadOnly;

  const FormComponent = switchF(heading.type, componentMap, defaultComponent);

  const labelClassName = [
    'form_label',
    `${required ? 'required' : ''}`,
    `${hasChanged ? 'hasChanged' : ''}`,
  ]
    .filter((f) => f)
    .join(' ');

  const hasLabel =
    [filterTypes.bool, filterTypes.toggle].indexOf(type) === -1 ||
    heading.readOnly; // we do not need a label for a toggle box

  return (
    <div className="form_row" key={uid}>
      <FieldLabel
        label={label}
        inputClassName={labelClassName}
        hasChanged={hasChanged}
        required={required}
        hasLabel={hasLabel}
      />
      <FormComponent {...props} />
    </div>
  );
};

FormField.propTypes = {
  heading: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    unit: PropTypes.string,
    required: PropTypes.bool,
    hasChanged: PropTypes.bool,
    readOnly: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['true', 'false']),
    ]),
  }).isRequired,
  value: PropTypes.any,
  updateFormData: PropTypes.func.isRequired,
  additionalData: PropTypes.shape({}).isRequired,
  componentMap: PropTypes.objectOf(PropTypes.elementType),
};

FormField.defaultProps = {
  value: null,
  componentMap: {},
};

// export default FormField;
