import React from 'react';
import PropTypes from 'prop-types';

import { EmojiSpan } from './styles';

export interface IEmojiProps {
  emoj: string;
  label: string;
  className?: string;
}

export const Emoji = ({ emoj, label, className }: IEmojiProps) => (
  <EmojiSpan className={`emoji ${className}`} role="img" aria-label={label}>
    {emoj || ''}
  </EmojiSpan>
);

Emoji.propTypes = {
  emoj: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Emoji.defaultProps = {
  className: '',
};
