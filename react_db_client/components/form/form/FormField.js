import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import FormFieldText from './Fields/FieldText';
import FormFieldNumber from './Fields/FieldNumber';
import FormFieldDate from './Fields/FieldDate';
import FormFieldBool from './Fields/FieldBool';
import FormFieldSelect from './Fields/FieldSelect';
import FormFieldReadOnly from './Fields/FieldReadOnly';
import FormFieldMultiSelect from './Fields/FieldMultiSelect';
import FormFieldSelectSearch from './Fields/FieldSelectSearch';

import './_form.scss';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';
import { switchF } from '../../Helpers/functionalProgramming';
// import FormFieldFile from './Fields/FieldFile';
import FormFieldTextArea from './Fields/FieldTextArea';
import FormFieldObjectRef from './Fields/FieldObjectRef';

export const FieldLabel = ({ label, inputClassName, hasChanged, required, hasLabel }) => (
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

const FormField = ({ heading, value, updateFormData, additionalData, customFieldComponents }) => {
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
  const componentOptions = {};
  // componentOptions[filterTypes.fileMultiple] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldFile multiple {...props} />;
  // componentOptions[filterTypes.file] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldFile {...props} />;
  // componentOptions[filterTypes.image] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldFile {...props} />;
  componentOptions[filterTypes.text] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldText {...props} />;
  componentOptions[filterTypes.textLong] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldTextArea useArea {...props} />;
  componentOptions[filterTypes.number] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldNumber {...props} />;
  componentOptions[filterTypes.date] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldDate {...props} />;
  componentOptions[filterTypes.bool] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldBool {...props} />;
  componentOptions[filterTypes.toggle] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldBool {...props} />;
  componentOptions[filterTypes.select] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldSelect {...props} />;
  componentOptions[filterTypes.selectMulti] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldMultiSelect {...props} />;
  componentOptions[filterTypes.selectSearch] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldSelectSearch {...props} />;
  componentOptions[filterTypes.reference] = () =>
    readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldObjectRef {...props} />;

  /* Merge custom components */
  Object.entries(customFieldComponents).forEach(([key, Field]) => {
    componentOptions[key] = () => <Field {...props} />;
  });
  const defaultComponent = () => <FormFieldReadOnly {...props} />;

  const formComponent = switchF(heading.type, componentOptions, defaultComponent);

  const labelClassName = [
    'form_label',
    `${required ? 'required' : ''}`,
    `${hasChanged ? 'hasChanged' : ''}`,
  ]
    .filter((f) => f)
    .join(' ');

  const hasLabel = [filterTypes.bool, filterTypes.toggle].indexOf(type) === -1 || heading.readOnly; // we do not need a label for a toggle box

  return (
    <div className="form_row" key={uid}>
      <FieldLabel
        label={label}
        inputClassName={labelClassName}
        hasChanged={hasChanged}
        required={required}
        hasLabel={hasLabel}
      />
      {formComponent}
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
    readOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['true', 'false'])]),
  }).isRequired,
  value: PropTypes.any,
  updateFormData: PropTypes.func.isRequired,
  additionalData: PropTypes.shape({}).isRequired,
  customFieldComponents: PropTypes.objectOf(PropTypes.elementType),
};

FormField.defaultProps = {
  value: null,
  customFieldComponents: {},
};

export default FormField;
