import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const FieldTextArea = ({
  uid,
  unit,
  updateFormData,
  value,
  required,
  initHeight,
  scaleToContent,
}) => {
  const ref = React.useRef(null);
  const [textareaHeight, setTextareaHeight] = useState(initHeight);
  const [resizing, setResizing] = useState(scaleToContent);

  const manageInputChange = (newValue) => {
    // This makes the textbox auto size
    if (scaleToContent) {
      setResizing(true);
    }
    updateFormData(uid, newValue);
  };

  useEffect(() => {
    if (scaleToContent) {
      setResizing(true);
    }
  }, [value]);

  useEffect(() => {
    if (scaleToContent && resizing) {
      if (ref.current.scrollHeight + 2 > initHeight) {
        setTextareaHeight(ref.current.scrollHeight);
      }
      setResizing(false);
    }
  }, [scaleToContent, value, resizing, ref, initHeight]);

  return (
    <>
      <div className="inputWrapper">
        <textarea
          style={{
            height: resizing ? 'auto' : textareaHeight + 2 + 'px',
            // height: textareaHeight + 'px',
            maxHeight: '100%',
            minHeight: '1rem',
            maxWidth: '100%',
            // minWidth: '100%',
          }}
          value={value || ''}
          id={uid}
          name={uid}
          onChange={(e) => manageInputChange(e.target.value)}
          required={required}
          ref={ref}
        />
      </div>
      {unit && <span>{unit}</span>}
    </>
  );
};

FieldTextArea.propTypes = {
  uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
