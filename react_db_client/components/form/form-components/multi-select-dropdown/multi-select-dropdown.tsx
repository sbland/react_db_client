import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Emoji } from '@react_db_client/components.emoji';

import { MultiSelectDropdownItem } from './multi-select-dropdown-item';
import { IOpt } from './lib';
import { MultiSelectDropdownStyles } from './styles';

export interface MultiSelectDropdown {
  activeSelection: (string | number)[];
  updateActiveSelection: (newItem: (string | number)[]) => void;
  options: IOpt[];
  selectButtonProps?: React.ComponentProps<'button'>; //React.HTMLProps<HTMLButtonElement>;
}

export const MultiSelectDropdown = ({
  activeSelection,
  updateActiveSelection,
  options = [],
  selectButtonProps = {},
}: MultiSelectDropdown) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (uid: string | number) => {
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

  const selectedItems =
    activeSelection &&
    activeSelection.map(
      (sel) => options.filter((opt) => opt.uid === sel)[0] || { uid: sel, label: sel }
    );
  const unselectedItems =
    options && options.length > 0
      ? options.filter((opt) => activeSelection.indexOf(opt.uid) === -1)
      : [{ uid: 'invalid', label: 'There are no available options' }];

  const sortByLabel = (a: IOpt, b: IOpt) =>
    a.label.toUpperCase() >= b.label.toUpperCase() ? 1 : -1;

  const mapSelectedItems = selectedItems
    .sort(sortByLabel)
    .map((opt) => (
      <MultiSelectDropdownItem
        key={opt.uid}
        uid={opt.uid}
        label={opt.label as string}
        handleSelect={handleSelect}
        isSelected
      />
    ));

  const mapUnselectedItems = unselectedItems
    .sort(sortByLabel)
    .map((opt) => (
      <MultiSelectDropdownItem
        key={opt.uid}
        uid={opt.uid}
        label={opt.label}
        handleSelect={handleSelect}
      />
    ));

  return (
    <MultiSelectDropdownStyles className="multiSelectDropdown">
      <button
        className="filterBtn"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        {...selectButtonProps}
      >
        <Emoji emoj="🔽" label="DropDownMenu" />
      </button>
      <ul className="multiSelectDropdown_list-selected">{mapSelectedItems}</ul>
      {menuOpen && (
        <div className="multiSelectDropdown_menu" ref={menuRef}>
          <ul className="multiSelectDropdown_list-unselected">{mapUnselectedItems}</ul>
        </div>
      )}
    </MultiSelectDropdownStyles>
  );
};

MultiSelectDropdown.propTypes = {
  activeSelection: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  updateActiveSelection: PropTypes.func.isRequired,
};

MultiSelectDropdown.defaultProps = {
  activeSelection: [],
};
