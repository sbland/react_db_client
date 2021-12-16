import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import cloneDeep from 'lodash/cloneDeep';

import { FormInputs } from './FormInputs';
import formValidation from './formValidation';
import { FormField as DefaultFormField } from './FormField';

import './_form.scss';

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
  componentMap,
}) => {
  const [formEditData, setFormEditData] = useState({});
  const [endButtonContainerRef, setEndButtonContainerRef] = useState(null);

  const formData = useMemo(
    () => ({ ...cloneDeep(formDataInitial), ...formEditData }),
    [formDataInitial, formEditData]
  );

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
        componentMap={componentMap}
        FormField={FormField}
      />
      <section
        ref={(ref) => setEndButtonContainerRef(ref)}
        style={{ width: '100%' }}
      />
      {showEndBtns &&
        endButtonContainerRef &&
        ReactDOM.createPortal(
          <div className="submitBtns">
            {/* TODO: Work out why setting this as a submit button does not work */}
            <button
              type="button"
              className="button-two submitBtn"
              onClick={handleSubmit}
            >
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
  FormField: PropTypes.elementType,
  /* Initial form mdata */
  formDataInitial: PropTypes.objectOf(PropTypes.any).isRequired,
  /* Form field headings data */
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  /* Called on form submit */
  onSubmit: PropTypes.func.isRequired,
  /* Called when inputs change */
  onChange: PropTypes.func,
  /* Show save buttons */
  showEndBtns: PropTypes.bool,
  /* Text to display in submit btn */
  submitBtnText: PropTypes.string,
  /* Disable autocomplete for the form */
  disableAutocomplete: PropTypes.bool,
  /* Show info key */
  showKey: PropTypes.bool,
  /* Form orientation (horiz/vert) */
  orientation: PropTypes.oneOf(['horiz', 'vert']),
  /* React reference for button container */
  endButtonRefOverride: PropTypes.any, // Should be a react reference
  /* Callback on error */
  errorCallback: PropTypes.func,
  /* Additional data to apply to form on save */
  additionalData: PropTypes.shape({}),
  /* Mapping of field type id to React component field component */
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
};

Form.defaultProps = {
  FormField: DefaultFormField,
  onChange: () => {},
  showEndBtns: true,
  submitBtnText: 'Save',
  showKey: true,
  orientation: 'vert',
  disableAutocomplete: false,
  endButtonRefOverride: null,
  errorCallback: alert,
  additionalData: {},
};
