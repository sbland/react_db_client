import React from 'react';
import PropTypes from 'prop-types';

import './_emoji.scss';

export const Emoji = ({ emoj, label, className }) => (
  <span className={`emoji ${className}`} role="img" aria-label={label}>
    {emoj || ''}
  </span>
);

Emoji.propTypes = {
  emoj: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Emoji.defaultProps = {
  className: '',
};
