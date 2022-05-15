import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { filterTypes } from '@react_db_client/constants.client-types';

import '@samnbuk/react_db_client.constants.style';
import { FormField as DefaultFormField } from './FormField';
import './_form.scss';

export const FormInputs = ({
  FormField,
  headings,
  formData,
  updateFormData,
  orientation,
  heading: sectionHeading,
  isSection,
  showKey,
  additionalData,
  componentMap,
  id,
}) => {
  const className = [
    'form_inputs',
    'formSection',
    `${orientation}`,
    sectionHeading ? 'hasHeading' : '',
    `formSection_${id}`,
  ]
    .filter((f) => f)
    .join(' ');

  const fields = useMemo(
    () =>
      headings.map((heading) => {
        const value =
          formData && formData[heading.uid] !== null
            ? formData[heading.uid]
            : heading.defaultValue || heading.def;

        if (heading.type === filterTypes.embedded) {
          return (
            <FormInputs
              key={heading.uid}
              headings={heading.children}
              formData={formData}
              updateFormData={updateFormData}
              orientation={heading.orientation}
              heading={heading.label}
              additionalData={additionalData}
              componentMap={componentMap}
              FormField={FormField}
              id={heading.uid}
              isSection
            />
          );
        }
        // return <div>{heading.uid}</div>;
        return (
          <FormField
            heading={heading}
            updateFormData={updateFormData}
            value={value}
            key={heading.uid}
            additionalData={additionalData}
            componentMap={componentMap}
          />
        );
      }),
    [headings, formData, updateFormData, additionalData, componentMap]
  );

  return (
    <section className={className}>
      {!isSection && showKey && <p>* is required. (!) has been modified.</p>}
      <h4 className="formSection_heading">{sectionHeading}</h4>
      {fields}
    </section>
  );
};

FormInputs.propTypes = {
  FormField: PropTypes.func,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      orientation: PropTypes.oneOf(['horiz', 'vert']),
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      unit: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.shape({})),
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(['horiz', 'vert']),
  heading: PropTypes.string,
  isSection: PropTypes.bool,
  showKey: PropTypes.bool,
  additionalData: PropTypes.shape({}),
  componentMap: PropTypes.objectOf(PropTypes.elementType).isRequired,
  id: PropTypes.any,
};

FormInputs.defaultProps = {
  FormField: DefaultFormField,
  orientation: 'vert',
  heading: '',
  isSection: false,
  showKey: true,
  additionalData: {},
  id: null,
};
