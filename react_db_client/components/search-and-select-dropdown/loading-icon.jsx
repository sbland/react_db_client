import React from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';

export const LoadingIcon = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <Emoji emoj="\/" label="loading" className="loadingIcon"/>
        // <Emoji emoj="⌛" label="loading" className="loadingIcon"/>
        // <img
        //   className="loadingIcon"
        //   src="/images/icons/loadingIcon.png"
        //   alt="loading"
        //   height="100%"
        // />
      )}
    </>
  );
};

LoadingIcon.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
