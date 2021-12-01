import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export const AreYouSureBtn = ({
  btnText,
  onConfirmed,
  confirmMessage,
  className,
  disabled,
  notes,
  PopupPanel,
}) => {
  const [request, setRequest] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);

  useEffect(() => {
    if (areYouSure && request) {
      onConfirmed();
      setAreYouSure(false);
      setRequest(false);
    }
  }, [areYouSure, request, onConfirmed]);
  return (
    <>
      <PopupPanel isOpen={request && !areYouSure} handleClose={() => setRequest(false)}>
        <div>
          <h1>Are You Sure?</h1>
          <div>
            <button
              type="button"
              className="areYouSureCancel button-one"
              onClick={() => setRequest(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="areYouSureAccept button-two"
              onClick={() => setAreYouSure(true)}
            >
              {confirmMessage}
            </button>
          </div>
          {notes && <div>{notes}</div>}
        </div>
      </PopupPanel>
      <button
        disabled={disabled}
        onClick={() => setRequest(true)}
        type="button"
        className={`areYouSureBtn ${className}`}
      >
        {btnText}
      </button>
    </>
  );
};

AreYouSureBtn.propTypes = {
  onConfirmed: PropTypes.func.isRequired,
  btnText: PropTypes.element.isRequired,
  confirmMessage: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  notes: PropTypes.string,
};

AreYouSureBtn.defaultProps = {
  className: 'button-one',
  disabled: false,
  notes: '',
  confirmMessage: 'Confirm',
};
