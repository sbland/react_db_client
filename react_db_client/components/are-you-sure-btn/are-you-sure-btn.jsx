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
      <PopupPanel
        id="areYouSureBtn_popupPanel"
        isOpen={request && !areYouSure}
        handleClose={() => setRequest(false)}
      >
        <div className="areYouSurePanel_wrap">
          <h1>Are You Sure?</h1>
          <div>
            <button
              type="button"
              className="areYouSure_cancelBtn button-one"
              onClick={() => setRequest(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="areYouSure_acceptBtn button-two"
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
  btnText: PropTypes.node.isRequired,
  confirmMessage: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  notes: PropTypes.string,
  PopupPanel: PropTypes.elementType,
};

AreYouSureBtn.defaultProps = {
  className: 'button-one',
  disabled: false,
  notes: '',
  confirmMessage: 'Confirm',
  PopupPanel: ({ children, isOpen }) => (isOpen ? children : ''),
};
