import React from 'react';
import PropTypes from 'prop-types';
import { BubbleSelectorListItemStyle } from './styles';

export interface IBubbleSelectorItemProps {
  uid: string | number;
  label: string | React.ReactNode;
  handleSelect: (uid: string | number) => void;
  isSelected: boolean;
}

export const BubbleSelectorItem = ({
  uid,
  label,
  handleSelect,
  isSelected,
}: IBubbleSelectorItemProps) => (
  <BubbleSelectorListItemStyle className="bubbleSelector_item">
    <button
      type="button"
      className={isSelected ? 'button-two selected' : 'button-one notSelected'}
      onClick={() => handleSelect(uid)}
      data-testid={`bubbleSelector-item-${isSelected ? "selected" : "unselected"}`}
    >
      {label}
    </button>
  </BubbleSelectorListItemStyle>
);

BubbleSelectorItem.propTypes = {
  uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

BubbleSelectorItem.defaultProps = {
  isSelected: false,
};
