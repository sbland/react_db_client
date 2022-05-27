/* eslint-disable react/prop-types */
import React from 'react';

const errorWrapStyle = {
  border: '1px solid red',
  color: 'red',
  padding: '1px',
};

const generateBody = (errorLabel, error, appVersion) =>
  encodeURIComponent(`
\n
\n
Error Title\n
===========\n
${errorLabel}\n
\n
Details\n
========\n

Version: ${appVersion}
Date: ${new Date(Date.now()).toString()}
Location: ${window.location.href}

Error Traceback:
================
${error}\n
\n
`);

const getMailTo = (addr, errorBody, subject) =>
  `mailto:${addr}?subject=${subject}&body=${errorBody}`;

export const ErrorInfoComponent = ({
  errorLabel,
  error,
  emailErrorsTo,
  emailErrorSubject,
  appVersion,
}) => {
  return (
    <div style={errorWrapStyle}>
      <p>{errorLabel}</p>
      <p>
        <a
          href={getMailTo(
            emailErrorsTo,
            generateBody(errorLabel, error, appVersion),
            emailErrorSubject
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Submit Bug Report
        </a>
      </p>
    </div>
  );
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorLabel: null,
    };
  }

  componentDidMount() {
    this.setState({
      error: null,
      errorLabel: null,
    });
  }

  componentDidCatch(error, info) {
    const { onError, message, componentProps } = this.props;
    this.setState({
      error,
      errorLabel: message || 'Render Failed!',
    });
    if (onError) onError(error, info, componentProps);
  }

  render() {
    const { children } = this.props;
    const { error, errorLabel } = this.state;
    return error ? <ErrorInfoComponent errorLabel={errorLabel} error={error} /> : children;
  }
}

export default ErrorBoundary;

export const wrapWithErrorBoundary =
  (Component, message, onError, emailErrorsTo, emailErrorSubject, appVersion) => (props) =>
    (
      <ErrorBoundary
        onError={onError || (() => {})}
        message={message || 'Failed to Render'}
        componentProps={props}
        emailErrorsTo={emailErrorsTo}
        emailErrorSubject={emailErrorSubject}
        appVersion={appVersion}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
