import React from 'react';
import PropTypes from 'prop-types';

export const DropDownItem = ({ itemRef, uid, label, handleSelect, isSelected, handleKeyDown }) => (
  <li className="selectDropdown_item">
    <button
      type="button"
      className={`itemBtn ${isSelected ? 'button-two selected' : 'button-one notSelected'}`}
      onClick={() => handleSelect(uid)}
      ref={itemRef}
      onKeyDown={handleKeyDown}
    >
      {label || 'Missing Label'}
    </button>
  </li>
);

DropDownItem.propTypes = {
  itemRef: PropTypes.func,
  uid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  handleKeyDown: PropTypes.func.isRequired,
};

DropDownItem.defaultProps = {
  itemRef: null,
  isSelected: false,
};
