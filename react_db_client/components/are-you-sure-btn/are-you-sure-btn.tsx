import React from 'react';
import PropTypes from 'prop-types';
import {
  PopupPanelContext,
  PopupPanel,
  PopupContentWrap,
} from '@react_db_client/components.popup-panel-v2';

const popupId = 'areYouSureBtn_popupPanel';

export interface IAreYouSureProps {
  btnText: string | React.ReactNode;
  onConfirmed: () => void;
  confirmMessage?: string;
  className?: string;
  disabled?: boolean;
  notes?: string;
}

export const AreYouSureBtn = ({
  btnText,
  onConfirmed,
  confirmMessage,
  className,
  disabled,
  notes,
}: IAreYouSureProps) => {
  const { openPopup, closePopup } = React.useContext(PopupPanelContext);

  const handleFirstClick = () => {
    openPopup(popupId);
  };

  const handleCancel = () => {
    closePopup(popupId);
  };

  const handleAccept = () => {
    closePopup(popupId);
    onConfirmed();
  };

  return (
    <>
      <PopupPanel id={popupId}>
        <PopupContentWrap id={popupId} title="Are you sure?">
          <div className="areYouSurePanel_wrap">
            <h1>Are You Sure?</h1>
            <div>
              <button
                type="button"
                className="areYouSure_cancelBtn button-one"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="areYouSure_acceptBtn button-two"
                onClick={handleAccept}
              >
                {confirmMessage}
              </button>
            </div>
            {notes && <div>{notes}</div>}
          </div>
        </PopupContentWrap>
      </PopupPanel>
      <button
        disabled={disabled}
        onClick={() => handleFirstClick()}
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
