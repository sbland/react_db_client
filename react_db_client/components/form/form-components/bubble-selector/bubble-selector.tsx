import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BubbleSelectorItem } from './bubble-selector-item';
import { BubbleSelectorListStyle } from './styles';

export enum EActions {
  REMOVE = 'remove',
  ADD = 'add',
}

export interface IOpt {
  uid: string | number;
  label: string | React.ReactNode;
}

export interface IBubbleSelectorProps {
  activeSelection: (string | number)[];
  updateActiveSelection: (
    newItems: (string | number)[],
    action?: EActions,
    uid?: string | number
  ) => void;
  options: IOpt[];
  isSorted?: boolean;
  groupSelected?: boolean;
  allowManualInput?: boolean;
  allowSelectAll?: boolean;
  hideUnselected?: boolean;
}

export const BubbleSelector = ({
  activeSelection,
  updateActiveSelection,
  options,
  isSorted,
  groupSelected,
  allowManualInput,
  allowSelectAll,
  hideUnselected,
}: IBubbleSelectorProps) => {
  const [showUnselected, setShowUnselected] = useState(!hideUnselected);
  const [manualInput, setManualInput] = useState('');

  const handleSelect = (uid) => {
    const indexInSelection = activeSelection.indexOf(uid);
    const copyOfActiveSelection = [...activeSelection];
    let action: EActions | null = null;
    if (indexInSelection !== -1) {
      action = EActions.REMOVE;
      copyOfActiveSelection.splice(indexInSelection, 1);
    } else {
      action = EActions.ADD;
      copyOfActiveSelection.push(uid);
    }
    const sortedList = options
      .map((opt) => opt.uid)
      .filter((opt) => copyOfActiveSelection.indexOf(opt) !== -1);
    updateActiveSelection(sortedList, action, uid);
  };

  const handleSelectAll = () => {
    updateActiveSelection(options.map((o) => o.uid));
  };

  const selectedItems = activeSelection.map(
    (sel) => options.filter((opt) => opt.uid === sel)[0] || { uid: sel, label: sel }
  );
  const unselectedItems = options.filter((opt) => activeSelection.indexOf(opt.uid) === -1);

  const additionalItems = selectedItems.filter(
    (opt) => options.map((o) => o.uid).indexOf(opt.uid) === -1
  );

  const allItems = groupSelected
    ? selectedItems.concat(unselectedItems)
    : [...options, ...additionalItems];

  const sortFn = isSorted
    ? (a: IOpt, b: IOpt) =>
        String(a?.label).toLowerCase() > String(b.label).toLowerCase() ? 1 : -1
    : () => -1;

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
          <BubbleSelectorListStyle
            className="bubbleSelector_list selected"
            data-testid="bubbleSelector_list-selected"
          >
            {mapSelectedItems}
          </BubbleSelectorListStyle>
          {showUnselected && (
            <>
              <BubbleSelectorListStyle
                className="bubbleSelector_list unselected"
                data-testid="bubbleSelector_list-notselected"
              >
                {mapUnselectedItems}
              </BubbleSelectorListStyle>
              {hideUnselected && (
                <button
                  type="button"
                  className="button-one"
                  onClick={() => setShowUnselected(false)}
                >
                  -
                </button>
              )}
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
      {!groupSelected && (
        <BubbleSelectorListStyle className="bubbleSelector_list notGrouped" data-testid="bubbleSelector_list">
          {mapAllItems}
        </BubbleSelectorListStyle>
      )}
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
  hideUnselected: PropTypes.bool,
};

BubbleSelector.defaultProps = {
  activeSelection: [],
  isSorted: false,
  groupSelected: false,
  allowManualInput: false,
  allowSelectAll: false,
  hideUnselected: false,
};
