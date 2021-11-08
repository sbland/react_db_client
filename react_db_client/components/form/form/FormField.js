import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { filterTypes } from '@samnbuk/react_db_client.constants.client-types';
import { switchF } from '@samnbuk/react_db_client.helpers.func-tools';

import { FieldReadOnly } from '@samnbuk/react_db_client.components.form.form-fields.field-read-only';
import { FieldLabel } from './field-label';

// import FormFieldText from './Fields/FieldText';
// import FormFieldNumber from './Fields/FieldNumber';
// import FormFieldDate from './Fields/FieldDate';
// import FormFieldBool from './Fields/FieldBool';
// import FormFieldSelect from './Fields/FieldSelect';
// import FormFieldMultiSelect from './Fields/FieldMultiSelect';
// import FormFieldSelectSearch from './Fields/FieldSelectSearch';
// import FormFieldFile from './Fields/FieldFile';
// import FormFieldTextArea from './Fields/FieldTextArea';
// import FormFieldObjectRef from './Fields/FieldObjectRef';

import './_form.scss';

export const FormField = ({
  heading,
  value,
  updateFormData,
  additionalData,
  componentMap,
}) => {
  // return (
  //   <div>
  //     Example
  //   </div>
  // )
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

  /* Move this to external component */
  // const componentOptions = {};
  // // componentOptions[filterTypes.fileMultiple] = () =>
  // //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldFile multiple {...props} />;
  // // componentOptions[filterTypes.file] = () =>
  // //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldFile {...props} />;
  // // componentOptions[filterTypes.image] = () =>
  // //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldFile {...props} />;
  // componentOptions[filterTypes.text] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldText {...props} />;
  // componentOptions[filterTypes.textLong] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldTextArea useArea {...props} />;
  // componentOptions[filterTypes.number] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldNumber {...props} />;
  // componentOptions[filterTypes.date] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldDate {...props} />;
  // componentOptions[filterTypes.bool] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldBool {...props} />;
  // componentOptions[filterTypes.toggle] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldBool {...props} />;
  // componentOptions[filterTypes.select] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldSelect {...props} />;
  // componentOptions[filterTypes.selectMulti] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldMultiSelect {...props} />;
  // componentOptions[filterTypes.selectSearch] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldSelectSearch {...props} />;
  // componentOptions[filterTypes.reference] = () =>
  //   readOnly ? <FormFieldReadOnly {...props} /> : <FormFieldObjectRef {...props} />;

  // /* Merge custom components */
  // Object.entries(customFieldComponents).forEach(([key, Field]) => {
  //   componentOptions[key] = () => <Field {...props} />;
  // });
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
      {/* {formComponent} */}
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
