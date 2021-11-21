import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@samnbuk/react_db_client.components.emoji';

import './multiSelectDropdown.scss';


export const MultiSelectDropdownItem = ({
  uid,
  label,
  handleSelect,
  isSelected,
}) => (
  <li className="multiSelectDropdown_item">
    <button
      type="button"
      className={(isSelected) ? 'button-two selected' : 'button-one notSelected'}
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

export const MultiSelectDropdown = ({
  activeSelection,
  updateActiveSelection,
  options = [],
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleSelect = (uid) => {
    const indexInSelection = activeSelection.indexOf(uid);
    const copyOfActiveSelection = [...activeSelection];
    if (indexInSelection !== -1) {
      copyOfActiveSelection.splice(indexInSelection, 1);
    } else {
      copyOfActiveSelection.push(uid);
    }
    const sortedList = options
      .map((opt) => opt.uid)
      .filter((opt) => copyOfActiveSelection.indexOf(opt) !== -1);
    updateActiveSelection(sortedList);
  };

  const selectedItems = activeSelection && activeSelection.map((sel) => (options.filter((opt) => opt.uid === sel)[0] || { uid: sel, label: sel }));
  const unselectedItems = (options && options.length > 0)
    ? options.filter((opt) => (activeSelection.indexOf(opt.uid) === -1))
    : [{ uid: 'invalid', label: 'There are no available options' }];

  const sortByLabel = (a, b) => (a.label.toUpperCase() > b.label.toUpperCase());

  const mapSelectedItems = selectedItems.sort(sortByLabel).map((opt) => (
    <MultiSelectDropdownItem
      key={opt.uid}
      uid={opt.uid}
      label={opt.label}
      handleSelect={handleSelect}
      isSelected
    />
  ));

  const mapUnselectedItems = unselectedItems.sort(sortByLabel).map((opt) => (
    <MultiSelectDropdownItem
      key={opt.uid}
      uid={opt.uid}
      label={opt.label}
      handleSelect={handleSelect}
    />
  ));

  return (
    <div className="multiSelectDropdown">
      <button
        className="filterBtn"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Emoji emoj="🔽" label="DropDownMenu" />
      </button>
      <ul className="multiSelectDropdown_list-selected">
        {mapSelectedItems}
      </ul>
      {menuOpen && (
        <div className="multiSelectDropdown_menu" ref={menuRef}>
          <ul className="multiSelectDropdown_list-unselected">
            {mapUnselectedItems}
          </ul>
        </div>
      )}
    </div>
  );
};

MultiSelectDropdown.propTypes = {
  activeSelection: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(PropTypes.shape({
    uid: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  updateActiveSelection: PropTypes.func.isRequired,
};

MultiSelectDropdown.defaultProps = {
  activeSelection: [],
};

