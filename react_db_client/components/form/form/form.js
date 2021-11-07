import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import cloneDeep from 'lodash/cloneDeep';

import { FormInputs } from './FormInputs';

import './_form.scss';
import formValidation from './formValidation';
// import Emoji from '../Emoji/Emoji';

/** Generic Form Component that manages updates and layout
 *
 * The Form component handles general form requirements such as storing
 * edit data, auto generating a layout bassed on provided headers.


 # Headings
 The headings should have the correct headings shape...

 # Mounting the save buttons using a ref:
 If a react ref is provided to `endButtonRefOverride` then the save buttons will be placed in
 the referenced container.


 * On submit signature:
 * ({ formEditData, formData }) => {...}
 *
 * onChange Signature:
 * (field, value, newFormData) => {...}


 * additionalData - additional data to be passed to form field components. Useful when using a custom field
 * customFieldComponents - a map of field type against react component
 */
export const Form = ({
  FormField,
  formDataInitial,
  headings,
  onSubmit,
  onChange,
  showEndBtns,
  submitBtnText,
  showKey,
  orientation,
  disableAutocomplete,
  endButtonRefOverride,
  errorCallback,
  additionalData,
  customFieldComponents,
}) => {
  // const [formData, setFormData] = useState(cloneDeep(formDataInitial));
  const [formEditData, setFormEditData] = useState({});
  const [endButtonContainerRef, setEndButtonContainerRef] = useState(null);

  const formData = useMemo(() => ({ ...cloneDeep(formDataInitial), ...formEditData }), [
    formDataInitial,
    formEditData,
  ]);

  const updateFormData = useCallback(
    (field, value) => {
      setFormEditData((prev) => {
        const newFormData = cloneDeep(prev);
        newFormData[field] = value;
        if (onChange) onChange(field, value, newFormData);
        return newFormData;
      });
    },
    [onChange]
  );

  const handleReset = () => {
    setFormEditData({});
  };

  const handleSubmit = useCallback(() => {
    const passesFormValidation = formValidation(formData, headings);
    if (passesFormValidation === true) onSubmit({ formEditData, formData });
    else errorCallback(passesFormValidation.error);
  }, [formData, formEditData, headings, onSubmit, errorCallback]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      // Another possible hack to stop autocomplete on chrome
      // autoComplete={disableAutocomplete ? 'chrome-off' : 'on'}
      autoComplete={disableAutocomplete ? 'off' : 'on'}
      className="form sectionWrapper"
    >
      <FormInputs
        headings={headings}
        formData={formData}
        updateFormData={updateFormData}
        showKey={showKey}
        orientation={orientation}
        additionalData={additionalData}
        customFieldComponents={customFieldComponents}
        FormField={FormField}
      />
      <section ref={(ref) => setEndButtonContainerRef(ref)} style={{ width: '100%' }} />
      {showEndBtns &&
        endButtonContainerRef &&
        ReactDOM.createPortal(
          <div className="submitBtns">
            {/* TODO: Work out why setting this as a submit button does not work */}
            <button type="button" className="button-two submitBtn" onClick={handleSubmit}>
              <span role="img" aria-label={submitBtnText}>
                💾
              </span>
            </button>
            <button type="button" className="button-one" onClick={handleReset}>
              <span role="img" aria-label="Delete">
                ❌
              </span>
            </button>
          </div>,
          endButtonRefOverride || endButtonContainerRef
        )}
    </form>
  );
};

Form.propTypes = {
  formDataInitial: PropTypes.shape().isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf([
        'uid',
        'reference',
        'file',
        'textLong',
        'text',
        'number',
        'date',
        'image',
        'bool',
        'select',
        'selectMulti',
        'embedded',
      ]).isRequired,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  showEndBtns: PropTypes.bool,
  submitBtnText: PropTypes.string,
  disableAutocomplete: PropTypes.bool,
  showKey: PropTypes.bool,
  orientation: PropTypes.oneOf(['horiz', 'vert']),
  endButtonRefOverride: PropTypes.any, // Should be a react reference
  errorCallback: PropTypes.func,
  additionalData: PropTypes.shape({}),
  customFieldComponents: PropTypes.objectOf(PropTypes.elementType),
};

Form.defaultProps = {
  onChange: () => {},
  showEndBtns: true,
  submitBtnText: 'Save',
  showKey: true,
  orientation: 'vert',
  disableAutocomplete: false,
  endButtonRefOverride: null,
  errorCallback: alert,
  additionalData: {},
  customFieldComponents: {},
};

