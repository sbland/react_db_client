import React from 'react';
import PropTypes from 'prop-types';

export const LoadingIcon = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <img
          className="loadingIcon"
          src="/images/icons/loadingIcon.png"
          alt="loading"
          height="100%"
        />
      )}
    </>
  );
};

LoadingIcon.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
