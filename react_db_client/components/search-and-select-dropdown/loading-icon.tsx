import React from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';
import { LoadingIconStyle } from './styles';

export interface ILoadingIconProps {
  isLoading: boolean;
}

export const LoadingIcon = ({ isLoading }: ILoadingIconProps) => {
  return (
    <>
      {isLoading && (
        <LoadingIconStyle data-testid="loadingIcon">
          <Emoji emoj="\/" label="loading" className="loadingIcon" />
        </LoadingIconStyle>
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
