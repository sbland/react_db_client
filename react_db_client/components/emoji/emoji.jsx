import React from 'react';
import PropTypes from 'prop-types';

import './_emoji.scss';

export const Emoji = ({ emoj, label }) => (
  <span className="emoji" role="img" aria-label={label}>
    {emoj}
  </span>
);

Emoji.propTypes = {
  emoj: PropTypes.string.isRequired,
  label: PropTypes.string,
};

Emoji.defaultProps = {
  label: 'emoji',
};
