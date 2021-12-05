import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const FieldTextArea = ({
  uid,
  unit,
  updateFormData,
  value,
  required,
  initHeight,
  scaleToContent,
}) => {
  const ref = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState(initHeight);

  const manageInputChange = (newValue) => {
    // This makes the textbox auto size
    if (scaleToContent) {
      setTextareaHeight(ref.current.scrollHeight + 2);
    }
    updateFormData(uid, newValue);
  };

  useEffect(() => {
    // Autosize the text box on load
    if (scaleToContent) {
      if (value && ref.current.scrollHeight + 2 > initHeight)
        setTextareaHeight(ref.current.scrollHeight + 2);
    }
  }, [value, initHeight, scaleToContent]);

  return (
    <>
      <textarea
        style={{
          height: textareaHeight || 50,
        }}
        value={value || ''}
        id={uid}
        name={uid}
        onChange={(e) => manageInputChange(e.target.value)}
        required={required}
        ref={ref}
      />
      <span>{unit}</span>
    </>
  );
};

FieldTextArea.propTypes = {
  uid: PropTypes.string.isRequired,
  unit: PropTypes.string,
  value: PropTypes.string,
  updateFormData: PropTypes.func.isRequired,
  required: PropTypes.bool,
  initHeight: PropTypes.number,
  scaleToContent: PropTypes.bool,
};

FieldTextArea.defaultProps = {
  unit: '',
  value: '',
  required: false,
  initHeight: 10,
  scaleToContent: true,
};
