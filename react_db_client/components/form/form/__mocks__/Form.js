import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Form = ({
  formDataInitial,
  headings,
  onSubmit,
  onChange,
  showEndBtns,
  submitBtnText,
}) => {


  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="form sectionWrapper">
      <div>Demo Inputs...</div>
      {showEndBtns && (
        <section>
          <button
            type="submit"
            className="button-two submitBtn"
          >
            {submitBtnText}
          </button>
          <button
            type="button"
            className="button-one"
            onClick={() => {}}
          >
            Reset
          </button>
        </section>
      )}
    </form>
  );
};

Form.propTypes = {
  formDataInitial: PropTypes.shape().isRequired,
  headings: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  showEndBtns: PropTypes.bool,
  submitBtnText: PropTypes.string,
};

Form.defaultProps = {
  onChange: () => { },
  showEndBtns: true,
  submitBtnText: 'Submit',
};

export default Form;
