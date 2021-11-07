import React from 'react';
import PropTypes from 'prop-types';


const FormInputs = ({
  headings,
  formData,
  updateFormData,
  orientation,
  heading,
  isSection,
}) => {
  const className = `
    form_inputs
    ${(isSection) ? 'formSection' : ''}
    ${orientation}
  `;
  return (
    <section className={className}>
      {(!isSection) && <p>* is required.  (!) has been Overriden.</p>}
      <h4 className="formSection_heading">{heading}</h4>
      <div className="form_row">
        <input type="text" />
      </div>
    </section>
  );
};

FormInputs.propTypes = {
  headings: PropTypes.arrayOf(PropTypes.shape({
    uid: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
      'uid',
      'reference',
      'file',
      'fileMultiple',
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
    unit: PropTypes.string,
  })).isRequired,
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(['horiz', 'vert']),
  heading: PropTypes.string,
  isSection: PropTypes.bool,
};

FormInputs.defaultProps = {
  orientation: 'vert',
  heading: '',
  isSection: false,
};

export default FormInputs;
