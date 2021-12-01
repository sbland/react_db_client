import React from 'react';
import { AreYouSureBtn } from './are-you-sure-btn';

const defaultProps = {
  onConfirmed: () => alert('confirmed'),
  message: 'Yes',
  disabled: false,
  btnText: 'Click me',
  PopupPanel: ({ children, isOpen }) => isOpen ? children : '',
};

export const BasicAreYouSureBtn = () => <AreYouSureBtn {...defaultProps} />;
