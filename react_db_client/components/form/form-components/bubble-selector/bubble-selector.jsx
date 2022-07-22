import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './bubbleSelector.scss';

export const BubbleSelectorItem = ({ uid, label, handleSelect, isSelected }) => (
  <li className="bubbleSelector_item">
    <button
      type="button"
      className={isSelected ? 'button-two selected' : 'button-one notSelected'}
      onClick={() => handleSelect(uid)}
    >
      {label}
    </button>
  </li>
);

BubbleSelectorItem.propTypes = {
  uid: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

BubbleSelectorItem.defaultProps = {
  isSelected: false,
};

export const BubbleSelector = ({
  activeSelection,
  updateActiveSelection,
  options,
  isSorted,
  groupSelected,
  allowManualInput,
  allowSelectAll,
}) => {
  const [showUnselected, setShowUnselected] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const handleSelect = (uid) => {
    const indexInSelection = activeSelection.indexOf(uid);
    const copyOfActiveSelection = [...activeSelection];
    let action = null;
    if (indexInSelection !== -1) {
      action = 'remove';
      copyOfActiveSelection.splice(indexInSelection, 1);
    } else {
      action = 'add';
      copyOfActiveSelection.push(uid);
    }
    const sortedList = options
      .map((opt) => opt.uid)
      .filter((opt) => copyOfActiveSelection.indexOf(opt) !== -1);
    updateActiveSelection(sortedList, action, uid);
  };

  const handleSelectAll = () => {
    updateActiveSelection(options.map((o) => o.uid))
  }

  const selectedItems = activeSelection.map(
    (sel) => options.filter((opt) => opt.uid === sel)[0] || { uid: sel, label: sel }
  );
  // console.log(selectedItems);
  // const selectedItems = options.filter((opt) => (activeSelection.indexOf(opt.uid) !== -1));
  const unselectedItems = options.filter((opt) => activeSelection.indexOf(opt.uid) === -1);

  const allItems = selectedItems.concat(unselectedItems);

  const sortFn = isSorted ? (a, b) => a.label.toUpperCase() > b.label.toUpperCase() : () => false;

  const mapAllItems = allItems
    .sort(sortFn)
    .map((opt) => (
      <BubbleSelectorItem
        key={opt.uid}
        uid={opt.uid}
        label={opt.label}
        handleSelect={handleSelect}
        isSelected={activeSelection.indexOf(opt.uid) !== -1}
      />
    ));

  const mapSelectedItems = selectedItems
    .sort(sortFn)
    .map((opt) => (
      <BubbleSelectorItem
        key={opt.uid}
        uid={opt.uid}
        label={opt.label}
        handleSelect={handleSelect}
        isSelected
      />
    ));

  const mapUnselectedItems = unselectedItems
    .sort(sortFn)
    .map((opt) => (
      <BubbleSelectorItem
        key={opt.uid}
        uid={opt.uid}
        label={opt.label}
        handleSelect={handleSelect}
      />
    ));

  return (
    <div className="bubbleSelector">
      {allowManualInput && (
        <input
          type="text"
          value={manualInput || ''}
          onChange={(e) => setManualInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSelect(manualInput);
              setManualInput('');
            }
          }}
        />
      )}
      {groupSelected && (
        <>
          <ul className="bubbleSelector_list selected">{mapSelectedItems}</ul>
          {showUnselected && (
            <>
              <ul className="bubbleSelector_list unselected">{mapUnselectedItems}</ul>
              <button type="button" className="button-one" onClick={() => setShowUnselected(false)}>
                -
              </button>
            </>
          )}
          {!showUnselected && (
            <p>
              <button type="button" className="button-one" onClick={() => setShowUnselected(true)}>
                + more items
              </button>
            </p>
          )}
        </>
      )}
      {!groupSelected && <ul className="bubbleSelector_list">{mapAllItems}</ul>}
      {allowSelectAll && (
        <button type="button" className="button-two" onClick={handleSelectAll}>
          Select All
        </button>
      )}
    </div>
  );
};

BubbleSelector.propTypes = {
  activeSelection: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  updateActiveSelection: PropTypes.func.isRequired,
  isSorted: PropTypes.bool,
  groupSelected: PropTypes.bool,
  allowManualInput: PropTypes.bool,
  allowSelectAll: PropTypes.bool,
};

BubbleSelector.defaultProps = {
  activeSelection: [],
  isSorted: false,
  groupSelected: false,
  allowManualInput: false,
  allowSelectAll: false,
};
