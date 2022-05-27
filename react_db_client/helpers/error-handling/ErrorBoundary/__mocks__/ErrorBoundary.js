/* eslint-disable no-unused-vars */
// We mock popup panels
import React from 'react';

const ErrorBoundary = () => <>ErrorBoundary Mock</>;

export const wrapWithErrorBoundary = (Component, message, onError) => (props) => (
  <>
    <Component {...props} />
  </>
);

export default ErrorBoundary;
