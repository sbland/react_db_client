import { PopupProvider } from '@react_db_client/components.popup-panel-v2';
import React from 'react';
import { AreYouSureBtn } from './are-you-sure-btn';

const defaultProps = {
  onConfirmed: () => alert('confirmed'),
  message: 'Yes',
  disabled: false,
  btnText: 'Click me',
  PopupPanel: ({ children, isOpen }) => (isOpen ? children : ''),
};

export const BasicAreYouSureBtn = () => {
  const [confirmed, setConfirmed] = React.useState(false);
  return (
    <>
      <PopupProvider>
        {' '}
        <AreYouSureBtn {...defaultProps} onConfirmed={() => setConfirmed(true)} />
      </PopupProvider>
      {confirmed && <p>User confirmed</p>}
    </>
  );
};
