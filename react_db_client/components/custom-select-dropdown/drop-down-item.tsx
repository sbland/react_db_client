import React from 'react';
import PropTypes from 'prop-types';
import { SelectDropwdownItem } from './styles';

export const DropDownItem = ({ itemRef, uid, label, handleSelect, isSelected, handleKeyDown }) => (
  <SelectDropwdownItem>
    <button
      type="button"
      className={`itemBtn ${isSelected ? 'selected' : 'notSelected'}`}
      onClick={() => handleSelect(uid)}
      ref={itemRef}
      onKeyDown={handleKeyDown}
    >
      {label || 'Missing Label'}
    </button>
  </SelectDropwdownItem>
);

DropDownItem.propTypes = {
  itemRef: PropTypes.func,
  uid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  handleKeyDown: PropTypes.func.isRequired,
};

DropDownItem.defaultProps = {
  itemRef: null,
  isSelected: false,
};
