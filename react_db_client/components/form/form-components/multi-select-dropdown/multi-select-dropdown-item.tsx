import React from 'react';
import PropTypes from 'prop-types';
import { IOpt } from './lib';

export interface IMultiSelectDropdownItemProps extends IOpt {
  handleSelect: (uid: string | number) => void;
  isSelected: boolean;
}

export const MultiSelectDropdownItem = ({
  uid,
  label,
  handleSelect,
  isSelected,
}: IMultiSelectDropdownItemProps) => (
  <li className="multiSelectDropdown_item">
    <button
      type="button"
      className={isSelected ? 'button-two selected' : 'button-one notSelected'}
      onClick={() => handleSelect(uid)}
    >
      {label}
    </button>
  </li>
);

MultiSelectDropdownItem.propTypes = {
  uid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

MultiSelectDropdownItem.defaultProps = {
  isSelected: false,
};
